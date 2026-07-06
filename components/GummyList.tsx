'use client'

import { useState } from 'react'
import GummyCard from './GummyCard'
import type { GummyWithAvg } from '@/lib/database.types'

const PER_PAGE = 10

export default function GummyList({ gummies }: { gummies: GummyWithAvg[] }) {
  const [count, setCount] = useState(PER_PAGE)
  const shown = gummies.slice(0, count)
  const hasMore = count < gummies.length

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        {shown.map((g) => (
          <GummyCard key={g.id} gummy={g} />
        ))}
      </div>
      {hasMore && (
        <div className="text-center mt-8">
          <button
            onClick={() => setCount(c => c + PER_PAGE)}
            className="bg-pink-50 text-pink-500 font-bold px-8 py-3 rounded-full hover:bg-pink-100 transition-colors text-sm border-2 border-pink-200"
          >
            もっと見る（{gummies.length - count}件）
          </button>
        </div>
      )}
    </>
  )
}
