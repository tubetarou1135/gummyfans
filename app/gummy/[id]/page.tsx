import { supabase } from '@/lib/supabase'
import type { Review } from '@/lib/database.types'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import StarRating from '@/components/StarRating'
import ReviewForm from '@/components/ReviewForm'
import ScoreTabs from '@/components/ScoreTabs'

export const revalidate = 60

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

const basicLabels: { key: keyof Review; label: string }[] = [
  { key: 'hardness', label: '硬さ' },
  { key: 'sweetness', label: '甘さ' },
  { key: 'sourness', label: '酸っぱさ' },
  { key: 'value', label: 'コスパ' },
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
  const reviews = await getReviews(gummy.id)

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <Link href="/" className="text-pink-500 text-sm hover:underline mb-4 inline-block">
        ← 一覧に戻る
      </Link>

      <h1 className="text-2xl font-bold text-gray-800 mb-1">{gummy.name}</h1>
      <p className="text-sm text-gray-500 mb-4">
        {gummy.maker}
        {gummy.flavor && ` / ${gummy.flavor}`}
      </p>

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
        <p className="text-sm text-gray-600 mb-6">{gummy.description}</p>
      )}

      <h2 className="text-lg font-semibold mb-4">レビューを投稿</h2>
      <ReviewForm gummyId={gummy.id} />

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
