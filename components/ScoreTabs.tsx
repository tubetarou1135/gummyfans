'use client'

import { useState } from 'react'
import type { GummyWithAvg } from '@/lib/database.types'
import StarRating from './StarRating'

const basicItems = [
  { key: 'avg_hardness', label: '硬さ' },
  { key: 'avg_sweetness', label: '甘さ' },
  { key: 'avg_sourness', label: '酸っぱさ' },
  { key: 'avg_value', label: '果汁感' },
] as const

const expertItems = [
  { key: 'avg_first_bite', label: 'ファーストバイト' },
  { key: 'avg_second_bounding', label: 'セカンドバウンディング' },
  { key: 'avg_gelatin_toughness', label: 'ゼラチンタフネス' },
  { key: 'avg_fruit_taste', label: 'フルーツテイスト' },
  { key: 'avg_after_flavor', label: 'アフターフレーバー' },
] as const

export default function ScoreTabs({ gummy }: { gummy: GummyWithAvg }) {
  const [tab, setTab] = useState<'basic' | 'expert'>('basic')

  const hasExpert = expertItems.some((item) => gummy[item.key] != null)

  return (
    <div>
      <div className="flex rounded-full bg-white p-1 gap-1 mb-3 w-fit">
        <button
          type="button"
          onClick={() => setTab('basic')}
          className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${tab === 'basic' ? 'bg-pink-500 text-white' : 'text-gray-400 hover:text-pink-500'}`}
        >
          一般評価
        </button>
        <button
          type="button"
          onClick={() => setTab('expert')}
          className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${tab === 'expert' ? 'bg-pink-500 text-white' : 'text-gray-400 hover:text-pink-500'}`}
        >
          日本グミ協会指標
        </button>
      </div>

      {tab === 'basic' && (
        <div className="grid grid-cols-2 gap-x-6 gap-y-2">
          {basicItems.map(({ key, label }) => gummy[key] != null && (
            <div key={key} className="flex items-center gap-2 text-sm">
              <span className="text-gray-500 w-16">{label}</span>
              <StarRating value={Math.round(gummy[key]!)} readonly size="sm" />
              <span className="text-gray-400 text-xs">{gummy[key]}</span>
            </div>
          ))}
        </div>
      )}

      {tab === 'expert' && (
        <div className="space-y-2">
          {hasExpert ? (
            <>
              {expertItems.map(({ key, label }) => gummy[key] != null && (
                <div key={key} className="flex items-center gap-2 text-sm">
                  <span className="text-gray-500 w-36 shrink-0">{label}</span>
                  <StarRating value={Math.round(gummy[key]!)} readonly size="sm" />
                  <span className="text-gray-400 text-xs">{gummy[key]}</span>
                </div>
              ))}
              <p className="text-xs text-gray-300 mt-2">この評価指標は日本グミ協会の許可を得て使用しています</p>
            </>
          ) : (
            <p className="text-sm text-gray-400">まだ日本グミ協会指標のレビューがありません</p>
          )}
        </div>
      )}
    </div>
  )
}
