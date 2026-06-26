import { supabase } from '@/lib/supabase'
import type { GummyWithAvg } from '@/lib/database.types'
import Link from 'next/link'
import StarRating from '@/components/StarRating'

export const revalidate = 60

async function getRanking(): Promise<GummyWithAvg[]> {
  const { data, error } = await supabase
    .from('gummies_with_avg')
    .select('*')
    .not('avg_overall', 'is', null)
    .order('avg_overall', { ascending: false })
    .limit(20)
  if (error) throw error
  return (data ?? []) as GummyWithAvg[]
}

const medals = ['🥇', '🥈', '🥉']

export default async function RankingPage() {
  const gummies = await getRanking()

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <Link href="/" className="text-pink-500 text-sm hover:underline mb-4 inline-block">
        ← 一覧に戻る
      </Link>
      <h1 className="text-2xl font-bold mb-6">ランキング</h1>
      {gummies.length === 0 ? (
        <p className="text-gray-400">まだレビューがありません</p>
      ) : (
        <ol className="space-y-3">
          {gummies.map((g, i) => (
            <li key={g.id}>
              <Link
                href={`/gummy/${g.id}`}
                className="flex items-center gap-4 border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow bg-white"
              >
                <span className="text-xl w-8 text-center">
                  {medals[i] ?? `${i + 1}`}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-800 truncate">{g.name}</p>
                  <p className="text-xs text-gray-500">{g.maker}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <StarRating value={Math.round(g.avg_overall!)} readonly size="sm" />
                    <span className="text-xs text-gray-400">({g.review_count}件)</span>
                  </div>
                </div>
                <span className="text-2xl font-bold text-pink-500">{g.avg_overall}</span>
              </Link>
            </li>
          ))}
        </ol>
      )}
    </main>
  )
}
