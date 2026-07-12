import { supabase } from '@/lib/supabase'
import type { GummyWithAvg } from '@/lib/database.types'
import GummyCard from '@/components/GummyCard'
import Link from 'next/link'
import type { Metadata } from 'next'

export const revalidate = 60

export const metadata: Metadata = {
  title: '新発売グミ一覧',
  description: '現在発売中の新グミをまとめて紹介。グミファンズの新発売グミ一覧ページです。',
}

async function getNewGummies(): Promise<GummyWithAvg[]> {
  const now = new Date().toISOString()
  const { data } = await supabase
    .from('gummies_with_avg')
    .select('*')
    .eq('published', true)
    .gt('new_until', now)
    .order('new_until', { ascending: false })
  return (data ?? []) as GummyWithAvg[]
}

export default async function NewGummiesPage() {
  const gummies = await getNewGummies()

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <Link href="/" className="text-pink-500 text-sm hover:underline mb-4 inline-block">
        ← トップに戻る
      </Link>
      <h1 className="text-xl font-bold text-pink-500 mb-6">🆕 新発売グミ一覧</h1>
      {gummies.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-3">🍬</p>
          <p className="text-sm">現在登録中の新発売グミはありません</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {gummies.map((g) => (
            <GummyCard key={g.id} gummy={g} />
          ))}
        </div>
      )}
    </main>
  )
}
