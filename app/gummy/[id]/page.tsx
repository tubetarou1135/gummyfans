import { supabase } from '@/lib/supabase'
import type { Review, GummyImageRow } from '@/lib/database.types'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import StarRating from '@/components/StarRating'
import ScoreTabs from '@/components/ScoreTabs'
import PostTabs from '@/components/PostTabs'
import DiscontinuedButton from '@/components/DiscontinuedButton'
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
    openGraph: { title: `${title} | GummyFans-グミファンズ-`, description, images: data.image_url ? [{ url: data.image_url }] : [] },
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

async function getDiscontinuedCount(gummyId: number): Promise<number> {
  const { count } = await supabase
    .from('discontinued_reports')
    .select('*', { count: 'exact', head: true })
    .eq('gummy_id', gummyId)
  return count ?? 0
}

async function getApprovedImage(gummyId: number): Promise<GummyImageRow | null> {
  const { data } = await supabase
    .from('gummy_images')
    .select('*')
    .eq('gummy_id', gummyId)
    .eq('status', 'approved')
    .order('created_at', { ascending: false })
    .limit(1)
    .single()
  return data ?? null
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
  const [reviews, approvedImage, discontinuedCount] = await Promise.all([
    getReviews(gummy.id),
    getApprovedImage(gummy.id),
    getDiscontinuedCount(gummy.id),
  ])

  const imageUrl = approvedImage
    ? supabase.storage.from('gummy-images').getPublicUrl(approvedImage.storage_path).data.publicUrl
    : null

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <Link href="/" className="text-pink-500 text-sm hover:underline mb-4 inline-block">
        ← 一覧に戻る
      </Link>

      {/* 商品画像 */}
      <div className="mb-4">
        {(gummy.image_url || imageUrl) ? (
          <>
            <div className="relative w-full aspect-square max-w-sm mx-auto rounded-3xl overflow-hidden border-2 border-pink-100">
              <Image src={gummy.image_url ?? imageUrl!} alt={gummy.name} fill sizes="(max-width: 640px) 100vw, 384px" quality={90} className="object-contain" />
            </div>
            {!gummy.image_url && approvedImage && (
              <p className="text-center text-xs text-gray-400 mt-2">
                📸 {approvedImage.nickname}さんからの画像提供
              </p>
            )}
            {gummy.image_url && (
              <p className="text-center text-xs text-gray-400 mt-2">画像提供：楽天市場</p>
            )}
          </>
        ) : (
          <div className="w-full aspect-square max-w-sm mx-auto rounded-3xl border-2 border-dashed border-pink-200 bg-pink-50 flex flex-col items-center justify-center gap-2">
            <span className="text-5xl">🍬</span>
            <p className="text-sm text-gray-400 text-center leading-relaxed">
              画像がありません<br />
              画像提供お願いします。
            </p>
          </div>
        )}
      </div>

      <div className="flex items-start justify-between gap-2 mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold text-gray-800">{gummy.name}</h1>
            {gummy.discontinued && (
              <span className="text-xs bg-gray-700 text-white px-2 py-0.5 rounded-full font-bold shrink-0">終売</span>
            )}
          </div>
          <p className="text-sm text-gray-500">
            {gummy.maker}
            {gummy.flavor && ` / ${gummy.flavor}`}
          </p>
        </div>
        <div className="shrink-0 mt-1">
          <DiscontinuedButton gummyId={gummy.id} reportCount={discontinuedCount} />
        </div>
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
        <a
          href={gummy.rakuten_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-red-500 text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-red-600 transition-colors mb-6"
        >
          🛒 楽天市場で買う
        </a>
      )}

      {/* レビュー投稿 / 画像提供 タブ */}
      <PostTabs gummyId={gummy.id} />

      {reviews.length > 0 && (
        <>
          <h2 className="text-lg font-semibold mt-8 mb-4">みんなのレビュー</h2>
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

