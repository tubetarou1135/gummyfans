import { supabase } from '@/lib/supabase'
import type { Review, GummyImageRow } from '@/lib/database.types'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import StarRating from '@/components/StarRating'
import ScoreTabs from '@/components/ScoreTabs'
import PostTabs from '@/components/PostTabs'
import GummyImageGallery from '@/components/GummyImageGallery'
import type { Metadata } from 'next'

export const revalidate = 60

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const { data } = await supabase.from('gummies_with_avg').select('*').eq('id', Number(id)).single()
  if (!data) return {}
  const title = data.flavor ? `${data.name} ${data.flavor}` : data.name
  const description = `${data.maker}の「${title}」のレビュー・評価ページ。グミファンが実際に食べた感想を掲載中。`
  return {
    title,
    description,
    openGraph: { title: `${title} | グミファンズ-GummyFans-`, description, images: data.image_url ? [{ url: data.image_url }] : [] },
  }
}

async function getGummy(id: number) {
  const { data } = await supabase
    .from('gummies_with_avg')
    .select('*')
    .eq('id', id)
    .single()
  return data
}

async function getReviews(gummyId: number): Promise<Review[]> {
  const { data } = await supabase
    .from('reviews')
    .select('*')
    .eq('gummy_id', gummyId)
    .order('created_at', { ascending: false })
  return data ?? []
}


async function getApprovedImages(gummyId: number): Promise<GummyImageRow[]> {
  const { data } = await supabase
    .from('gummy_images')
    .select('*')
    .eq('gummy_id', gummyId)
    .eq('status', 'approved')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true })
  return data ?? []
}

const basicLabels: { key: keyof Review; label: string }[] = [
  { key: 'hardness', label: '硬さ' },
  { key: 'sweetness', label: '甘さ' },
  { key: 'sourness', label: '酸っぱさ' },
  { key: 'value', label: '果汁感' },
  { key: 'overall', label: '総合' },
]

const expertLabels: { key: keyof Review; label: string }[] = [
  { key: 'first_bite', label: 'ファーストバイト' },
  { key: 'second_bounding', label: 'セカンドバウンディング' },
  { key: 'gelatin_toughness', label: 'ゼラチンタフネス' },
  { key: 'fruit_taste', label: 'フルーツテイスト' },
  { key: 'after_flavor', label: 'アフターフレーバー' },
]

export default async function GummyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const gummy = await getGummy(Number(id))
  if (!gummy) notFound()
  const [reviews, approvedImages] = await Promise.all([
    getReviews(gummy.id),
    getApprovedImages(gummy.id),
  ])

  const hasCitationCard = gummy.show_citation_card || gummy.show_jga_card
  const galleryImages = [
    ...(gummy.image_url ? [{ url: gummy.image_url, label: hasCitationCard ? '' : '楽天市場' }] : []),
    ...approvedImages.map((img) => ({
      url: img.storage_path.startsWith('http')
        ? img.storage_path
        : supabase.storage.from('gummy-images').getPublicUrl(img.storage_path).data.publicUrl,
      label: img.nickname === 'サブ画像' ? '' : `${img.nickname}さんからの画像提供`,
    })),
  ]

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <Link href="/" className="text-pink-500 text-sm hover:underline mb-4 inline-block">
        ← 一覧に戻る
      </Link>

      {/* PC: 横並び / SP: 縦並び */}
      <div className="md:flex md:gap-8 md:items-start">

        {/* 左カラム：画像 */}
        <div className="md:w-80 md:shrink-0 mb-4 md:mb-0">
          <GummyImageGallery images={galleryImages} />
          {(() => {
            const citations = [
              { url: gummy.source_url, label: gummy.source_label },
              { url: gummy.source_url_2, label: gummy.source_label_2 },
              { url: gummy.source_url_3, label: gummy.source_label_3 },
            ].filter((c) => c.url)

            // あいうえおカード
            if (gummy.show_citation_card && citations.length > 0) {
              return (
                <div className="mt-2 border border-purple-200 rounded-xl p-2.5 bg-purple-50">
                  <p className="text-[10px] font-bold text-purple-400 mb-1">📸 画像について</p>
                  <p className="text-[10px] text-gray-600 mb-2 leading-relaxed">
                    {gummy.source_label || 'あいうえお🌈🍇💖日本グミ協会会長@aiueoka5様の画像を引用しております！'}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {citations.map((c, i) => (
                      <a key={i} href={c.url!} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 bg-purple-500 text-white px-3 py-1 rounded-full text-[10px] font-bold hover:bg-purple-600 transition-colors">
                        {i === 0 ? (c.label || '引用元の投稿はコチラから') : `引用元${i + 1}`}
                      </a>
                    ))}
                  </div>
                </div>
              )
            }

            // JGAカード（引用リンクも内包）
            if (gummy.show_jga_card) {
              return (
                <div className="mt-2 border border-blue-200 rounded-xl p-2.5 bg-blue-50">
                  <p className="text-[10px] font-bold text-blue-400 mb-1">🍬 画像について</p>
                  <p className="text-[10px] text-gray-600 mb-2 leading-relaxed">
                    日本グミ協会(@japan_gummy)の画像を引用しております！
                  </p>
                  <div className="flex flex-wrap gap-1">
                    <a href="https://x.com/japan_gummy" target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 bg-blue-500 text-white px-3 py-1 rounded-full text-[10px] font-bold hover:bg-blue-600 transition-colors">
                      引用元の投稿はコチラ
                    </a>
                    {citations.map((c, i) => (
                      <a key={i} href={c.url!} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 bg-blue-500 text-white px-3 py-1 rounded-full text-[10px] font-bold hover:bg-blue-600 transition-colors">
                        {c.label || (i === 0 ? '引用元の投稿はコチラから' : `引用元${i + 1}`)}
                      </a>
                    ))}
                  </div>
                </div>
              )
            }

            // カードなし：スタンドアロンボタン
            if (citations.length > 0) {
              return (
                <div className="mt-2 flex flex-wrap gap-1">
                  {citations.map((c, i) => (
                    <a key={i} href={c.url!} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 bg-purple-500 text-white px-3 py-1 rounded-full text-[10px] font-bold hover:bg-purple-600 transition-colors">
                      {c.label || (i === 0 ? '引用元の投稿はコチラから' : `引用元${i + 1}`)}
                    </a>
                  ))}
                </div>
              )
            }

            return null
          })()}
        </div>

        {/* 右カラム：商品情報 */}
        <div className="flex-1 min-w-0">
          <div className="mb-4">
            <h1 className="text-2xl font-bold text-gray-800 mb-1">{gummy.name}</h1>
            <p className="text-sm text-gray-500">
              {gummy.maker}
              {gummy.flavor && ` / ${gummy.flavor}`}
            </p>
          </div>

          {gummy.avg_overall != null && (
            <div className="bg-pink-50 rounded-2xl p-5 mb-6">
              <p className="text-xs text-gray-400 mb-2">平均総合評価</p>
              <div className="flex items-center gap-4 mb-4">
                <span className="text-4xl font-bold text-pink-500">{gummy.avg_overall}</span>
                <div>
                  <StarRating value={Math.round(gummy.avg_overall)} readonly />
                  <p className="text-xs text-gray-500 mt-1">{gummy.review_count}件のレビュー</p>
                </div>
              </div>
              <ScoreTabs gummy={gummy} />
            </div>
          )}

          {gummy.description && (
            <p className="text-sm text-gray-600 mb-4">{gummy.description}</p>
          )}

          {gummy.rakuten_url && (
            <div className="mb-6">
              <a
                href={gummy.rakuten_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-red-500 text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-red-600 transition-colors"
              >
                🛒 楽天市場で買う
              </a>
            </div>
          )}

        </div>
      </div>

      {/* レビュー投稿 / 画像提供 タブ（全幅） */}
      <div className="mt-6">
        <PostTabs gummyId={gummy.id} />
      </div>

      <h2 className="text-lg font-semibold mt-8 mb-4">みんなのレビュー</h2>
      {reviews.length === 0 && (
        <div className="text-center py-10 text-gray-400">
          <p className="text-3xl mb-2">🍬</p>
          <p className="text-sm">まだレビューがありません。<br />最初のレビューを投稿してみましょう！</p>
        </div>
      )}
      {reviews.length > 0 && (
        <>
          <div className="space-y-4">
            {reviews.map((r) => (
              <div key={r.id} className="border-2 border-pink-100 rounded-2xl p-4">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-medium text-sm">{r.nickname}</span>
                  <span className="text-xs text-gray-400">
                    {new Date(r.created_at).toLocaleDateString('ja-JP')}
                  </span>
                </div>
                {r.overall > 0 ? (
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 mb-2">
                    {basicLabels.map(({ key, label }) => (
                      <div key={key} className="flex items-center gap-2 text-xs">
                        <span className="text-gray-500 w-16">{label}</span>
                        <StarRating value={r[key] as number} readonly size="sm" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <>
                    <p className="text-xs text-pink-400 font-semibold mb-1">日本グミ協会指標</p>
                    <div className="space-y-1 mb-2">
                      {expertLabels.map(({ key, label }) => r[key] != null && (
                        <div key={key} className="flex items-center gap-2 text-xs">
                          <span className="text-gray-500 w-36">{label}</span>
                          <StarRating value={r[key] as number} readonly size="sm" />
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-gray-300">この評価指標は日本グミ協会の許可を得て使用しています</p>
                  </>
                )}
                {r.comment && <p className="text-sm text-gray-700 mt-2">{r.comment}</p>}
              </div>
            ))}
          </div>
        </>
      )}

    </main>
  )
}

