import { supabase } from '@/lib/supabase'
import type { GummyWithAvg } from '@/lib/database.types'
import GummyCard from '@/components/GummyCard'
import SearchBar from '@/components/SearchBar'
import Image from 'next/image'
import Link from 'next/link'

export const revalidate = 60

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
  const gummies = await getGummies(q)

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
      <div className="max-w-4xl mx-auto px-4 py-8">
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
          コスパランキング
        </Link>
      </div>
      {gummies.length === 0 ? (
        <div className="text-center mt-16">
          <p className="text-5xl mb-4">🍬</p>
          <p className="text-gray-400">まだグミが登録されていません</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          {gummies.map((g) => (
            <GummyCard key={g.id} gummy={g} />
          ))}
        </div>
      )}
      </div>
    </main>
  )
}
