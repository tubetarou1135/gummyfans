import { supabase } from '@/lib/supabase'
import type { GummyWithAvg } from '@/lib/database.types'
import Link from 'next/link'
import StarRating from '@/components/StarRating'

export const revalidate = 60

type TabKey = 'overall' | 'hardness' | 'sweetness' | 'sourness' | 'value' | 'first_bite' | 'second_bounding' | 'gelatin_toughness' | 'fruit_taste' | 'after_flavor'

const tabs: { key: TabKey; label: string; field: keyof GummyWithAvg }[] = [
  { key: 'overall',          label: '総合',           field: 'avg_overall' },
  { key: 'hardness',         label: '硬さ',           field: 'avg_hardness' },
  { key: 'sweetness',        label: '甘さ',           field: 'avg_sweetness' },
  { key: 'sourness',         label: '酸っぱさ',       field: 'avg_sourness' },
  { key: 'value',            label: 'コスパ',         field: 'avg_value' },
  { key: 'first_bite',       label: '初噛み',         field: 'avg_first_bite' },
  { key: 'second_bounding',  label: '二段バウンド',   field: 'avg_second_bounding' },
  { key: 'gelatin_toughness',label: 'ゼラチン強度',   field: 'avg_gelatin_toughness' },
  { key: 'fruit_taste',      label: '果実感',         field: 'avg_fruit_taste' },
  { key: 'after_flavor',     label: '後味',           field: 'avg_after_flavor' },
]

async function getRanking(field: keyof GummyWithAvg, ascending: boolean): Promise<GummyWithAvg[]> {
  const { data, error } = await supabase
    .from('gummies_with_avg')
    .select('*')
    .not(field as string, 'is', null)
    .order(field as string, { ascending })
    .limit(20)
  if (error) throw error
  return (data ?? []) as GummyWithAvg[]
}

const medals = ['🥇', '🥈', '🥉']

export default async function RankingPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; order?: string }>
}) {
  const { tab, order } = await searchParams
  const currentTab = tabs.find((t) => t.key === tab) ?? tabs[0]
  const isHardness = currentTab.key === 'hardness'
  const ascending = isHardness ? order === 'asc' : false
  const gummies = await getRanking(currentTab.field, ascending)

  const tabHref = (key: TabKey) => key === 'overall' ? '/ranking' : `/ranking?tab=${key}`

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <Link href="/" className="text-pink-500 text-sm hover:underline mb-4 inline-block">
        ← 一覧に戻る
      </Link>
      <h1 className="text-2xl font-bold mb-5">ランキング</h1>

      {/* タブ */}
      <div className="flex gap-1.5 flex-wrap mb-4">
        {tabs.map((t) => (
          <Link
            key={t.key}
            href={tabHref(t.key)}
            className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${
              currentTab.key === t.key
                ? 'bg-pink-500 text-white'
                : 'bg-pink-50 text-pink-500 hover:bg-pink-100'
            }`}
          >
            {t.label}
          </Link>
        ))}
      </div>

      {/* 硬さ：注記＋昇順降順ボタン */}
      {isHardness && (
        <div className="mb-5 bg-pink-50 rounded-2xl px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <p className="text-xs text-gray-500 flex-1">
            ⭐ 星が多いほど硬いよ！　少ないほど柔らかいよ！
          </p>
          <div className="flex gap-2 shrink-0">
            <Link
              href={`/ranking?tab=hardness&order=desc`}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
                !ascending ? 'bg-pink-500 text-white' : 'bg-white text-pink-500 border-2 border-pink-200 hover:bg-pink-50'
              }`}
            >
              硬い順
            </Link>
            <Link
              href={`/ranking?tab=hardness&order=asc`}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
                ascending ? 'bg-pink-500 text-white' : 'bg-white text-pink-500 border-2 border-pink-200 hover:bg-pink-50'
              }`}
            >
              柔らかい順
            </Link>
          </div>
        </div>
      )}

      {gummies.length === 0 ? (
        <p className="text-gray-400">まだレビューがありません</p>
      ) : (
        <ol className="space-y-3">
          {gummies.map((g, i) => {
            const score = g[currentTab.field] as number | null
            return (
              <li key={g.id}>
                <Link
                  href={`/gummy/${g.id}`}
                  className="flex items-center gap-4 border-2 border-pink-100 rounded-2xl p-4 hover:shadow-md hover:border-pink-300 transition-all bg-white"
                >
                  <span className="text-xl w-8 text-center shrink-0">
                    {medals[i] ?? `${i + 1}`}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 truncate">{g.name}</p>
                    <p className="text-xs text-gray-500">{g.maker}{g.flavor && ` / ${g.flavor}`}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <StarRating value={Math.round(score ?? 0)} readonly size="sm" />
                      <span className="text-xs text-gray-400">({g.review_count}件)</span>
                    </div>
                  </div>
                  <span className="text-2xl font-bold text-pink-500 shrink-0">
                    {score != null ? score.toFixed(1) : '—'}
                  </span>
                </Link>
              </li>
            )
          })}
        </ol>
      )}
    </main>
  )
}
