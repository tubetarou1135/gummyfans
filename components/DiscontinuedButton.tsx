'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function DiscontinuedButton({ gummyId, reportCount }: { gummyId: number; reportCount: number }) {
  const [count, setCount] = useState(reportCount)
  const [done, setDone] = useState(false)

  async function handleClick() {
    if (done) return
    const { error } = await supabase.from('discontinued_reports').insert({ gummy_id: gummyId })
    if (!error) {
      setCount((c) => c + 1)
      setDone(true)
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <p className="text-xs text-gray-400 text-right">
        終売情報を<br />見かけたら↓
      </p>
      <button
        type="button"
        onClick={handleClick}
        disabled={done}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border-2 transition-colors ${
          done
            ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-default'
            : 'bg-white border-orange-300 text-orange-500 hover:bg-orange-50'
        }`}
      >
        <span>🚫</span>
        <span>終売かも！</span>
        {count > 0 && (
          <span className={`ml-0.5 ${done ? 'text-gray-400' : 'text-orange-400'}`}>
            {count}件
          </span>
        )}
      </button>
      {done && <p className="text-xs text-gray-400 text-right">ありがとうございます！</p>}
    </div>
  )
}
