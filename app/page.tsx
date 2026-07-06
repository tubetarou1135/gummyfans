import { supabase } from '@/lib/supabase'
import type { GummyWithAvg } from '@/lib/database.types'
import GummyCard from '@/components/GummyCard'
import GummyList from '@/components/GummyList'
import SearchBar from '@/components/SearchBar'
import Image from 'next/image'
import Link from 'next/link'

export const revalidate = 60

async function getNewGummies(): Promise<GummyWithAvg[]> {
  const now = new Date().toISOString()
  const { data } = await supabase
    .from('gummies_with_avg')
    .select('*')
    .gt('new_until', now)
    .order('new_until', { ascending: false })
  return (data ?? []) as GummyWithAvg[]
}

async function getGummies(q?: string): Promise<GummyWithAvg[]> {
  let query = supabase
    .from('gummies_with_avg')
    .select('*')
    .order('avg_overall', { ascending: false, nullsFirst: false })

  if (q) {
    query = query.or(`name.ilike.%${q}%,maker.ilike.%${q}%,flavor.ilike.%${q}%`)
  }

  const { data, error } = await query
  if (error) throw error
  return (data ?? []) as GummyWithAvg[]
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q } = await searchParams
  const [gummies, newGummies] = await Promise.all([getGummies(q), getNewGummies()])

  return (
    <main>
      <div className="w-full">
        <Image
          src="/hero.png"
          alt="gummyfans"
          width={1200}
          height={630}
          className="w-full object-contain"
          priority
        />
      </div>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <SearchBar defaultValue={q} />
        <div className="flex gap-2 mt-4 flex-wrap">
          <Link href="/ranking" className="bg-pink-500 text-white text-sm font-bold px-5 py-2 rounded-full hover:bg-pink-600 transition-colors">
            🏆 総合ランキング
          </Link>
          <Link href="/ranking?tab=hardness" className="bg-pink-50 text-pink-500 text-sm font-bold px-5 py-2 rounded-full hover:bg-pink-100 transition-colors">
            硬さランキング
          </Link>
          <Link href="/ranking?tab=sweetness" className="bg-pink-50 text-pink-500 text-sm font-bold px-5 py-2 rounded-full hover:bg-pink-100 transition-colors">
            甘さランキング
          </Link>
          <Link href="/ranking?tab=sourness" className="bg-pink-50 text-pink-500 text-sm font-bold px-5 py-2 rounded-full hover:bg-pink-100 transition-colors">
            酸っぱさランキング
          </Link>
          <Link href="/ranking?tab=value" className="bg-pink-50 text-pink-500 text-sm font-bold px-5 py-2 rounded-full hover:bg-pink-100 transition-colors">
            果汁感ランキング
          </Link>
        </div>

        {/* 新グミセクション */}
        {newGummies.length > 0 && (
          <div className="mt-6 border-2 border-pink-300 rounded-2xl p-4 bg-pink-50">
            <h2 className="text-base font-bold text-pink-500 mb-3">🆕 新発売グミ</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {newGummies.map((g) => (
                <GummyCard key={g.id} gummy={g} />
              ))}
            </div>
          </div>
        )}

        {gummies.length === 0 ? (
          <div className="text-center mt-16">
            <p className="text-5xl mb-4">🍬</p>
            <p className="text-gray-400">まだグミが登録されていません</p>
          </div>
        ) : (
          <GummyList gummies={gummies} />
        )}
      </div>
    </main>
  )
}
