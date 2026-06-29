'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function DiscontinuedButton({ gummyId, reportCount }: { gummyId: number; reportCount: number }) {
  const [count, setCount] = useState(reportCount)
  const [done, setDone] = useState(false)
  const [confirm, setConfirm] = useState(false)

  async function handleConfirm() {
    setConfirm(false)
    const { error } = await supabase.from('discontinued_reports').insert({ gummy_id: gummyId })
    if (!error) {
      setCount((c) => c + 1)
      setDone(true)
    }
  }

  return (
    <>
      {confirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-xs shadow-2xl text-center">
            <p className="font-bold text-gray-800 mb-1">終売を報告しますか？</p>
            <p className="text-xs text-gray-400 mb-5">この商品の終売情報を見かけた場合のみ報告してください</p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setConfirm(false)}
                className="flex-1 border-2 border-pink-200 text-pink-500 py-2.5 rounded-full text-sm font-bold hover:bg-pink-50 transition-colors"
              >
                キャンセル
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                className="flex-1 bg-orange-500 text-white py-2.5 rounded-full text-sm font-bold hover:bg-orange-600 transition-colors"
              >
                報告する
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="flex flex-col items-end gap-1">
        <p className="text-xs text-gray-400 text-right">
          終売情報を<br />見かけたら↓
        </p>
        <button
          type="button"
          onClick={() => { if (!done) setConfirm(true) }}
          disabled={done}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border-2 transition-colors ${
            done
              ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-default'
              : 'bg-white border-orange-300 text-orange-500 hover:bg-orange-50'
          }`}
        >
          <span>終売かも！</span>
          {count > 0 && (
            <span className={`ml-0.5 ${done ? 'text-gray-400' : 'text-orange-400'}`}>
              {count}件
            </span>
          )}
        </button>
        {done && <p className="text-xs text-gray-400 text-right">ありがとうございます！</p>}
      </div>
    </>
  )
}
