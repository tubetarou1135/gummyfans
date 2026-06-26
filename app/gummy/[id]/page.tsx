import { supabase } from '@/lib/supabase'
import type { Review } from '@/lib/database.types'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import StarRating from '@/components/StarRating'
import ReviewForm from '@/components/ReviewForm'

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

const ratingLabels: { key: keyof Review; label: string }[] = [
  { key: 'hardness', label: '硬さ' },
  { key: 'sweetness', label: '甘さ' },
  { key: 'sourness', label: '酸っぱさ' },
  { key: 'value', label: 'コスパ' },
  { key: 'overall', label: '総合' },
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
          <div className="flex items-center gap-4 mb-4">
            <span className="text-4xl font-bold text-pink-500">{gummy.avg_overall}</span>
            <div>
              <StarRating value={Math.round(gummy.avg_overall)} readonly />
              <p className="text-xs text-gray-500 mt-1">{gummy.review_count}件のレビュー</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-2">
            {[
              { label: '硬さ', val: gummy.avg_hardness },
              { label: '甘さ', val: gummy.avg_sweetness },
              { label: '酸っぱさ', val: gummy.avg_sourness },
              { label: 'コスパ', val: gummy.avg_value },
            ].map(({ label, val }) => val != null && (
              <div key={label} className="flex items-center gap-2 text-sm">
                <span className="text-gray-500 w-16">{label}</span>
                <StarRating value={Math.round(val)} readonly size="sm" />
                <span className="text-gray-400 text-xs">{val}</span>
              </div>
            ))}
          </div>
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
              <div key={r.id} className="border border-gray-200 rounded-xl p-4">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-medium text-sm">{r.nickname}</span>
                  <span className="text-xs text-gray-400">
                    {new Date(r.created_at).toLocaleDateString('ja-JP')}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 mb-2">
                  {ratingLabels.map(({ key, label }) => (
                    <div key={key} className="flex items-center gap-2 text-xs">
                      <span className="text-gray-500 w-16">{label}</span>
                      <StarRating value={r[key] as number} readonly size="sm" />
                    </div>
                  ))}
                </div>
                {r.comment && <p className="text-sm text-gray-700 mt-2">{r.comment}</p>}
              </div>
            ))}
          </div>
        </>
      )}
    </main>
  )
}
