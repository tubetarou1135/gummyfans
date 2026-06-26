'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import StarRating from './StarRating'

type RatingKey = 'hardness' | 'sweetness' | 'sourness' | 'value' | 'overall'

const ratingFields: { key: RatingKey; label: string }[] = [
  { key: 'hardness', label: '硬さ' },
  { key: 'sweetness', label: '甘さ' },
  { key: 'sourness', label: '酸っぱさ' },
  { key: 'value', label: 'コスパ' },
  { key: 'overall', label: '総合評価' },
]

const defaultRatings: Record<RatingKey, number> = {
  hardness: 0,
  sweetness: 0,
  sourness: 0,
  value: 0,
  overall: 0,
}

export default function ReviewForm({ gummyId }: { gummyId: number }) {
  const router = useRouter()
  const [nickname, setNickname] = useState('')
  const [comment, setComment] = useState('')
  const [ratings, setRatings] = useState(defaultRatings)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const unrated = ratingFields.filter((f) => ratings[f.key] === 0)
    if (unrated.length > 0) {
      setError(`${unrated.map((f) => f.label).join('・')}を評価してください`)
      return
    }
    if (!nickname.trim()) {
      setError('ニックネームを入力してください')
      return
    }
    setSubmitting(true)
    setError(null)
    const { error: err } = await supabase.from('reviews').insert({
      gummy_id: gummyId,
      nickname: nickname.trim(),
      comment: comment.trim() || null,
      ...ratings,
    })
    if (err) {
      setError('送信に失敗しました。もう一度お試しください。')
      setSubmitting(false)
      return
    }
    router.refresh()
    setNickname('')
    setComment('')
    setRatings(defaultRatings)
    setSubmitting(false)
  }

  return (
    <form onSubmit={handleSubmit} className="border-2 border-pink-100 rounded-3xl p-5 space-y-4 bg-white">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">ニックネーム</label>
        <input
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder="例：グミ好き太郎"
          className="w-full border-2 border-pink-100 rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:border-pink-400 bg-pink-50"
          maxLength={30}
        />
      </div>

      <div className="space-y-2">
        {ratingFields.map(({ key, label }) => (
          <div key={key} className="flex items-center gap-3">
            <span className="text-sm text-gray-600 w-20">{label}</span>
            <StarRating
              value={ratings[key]}
              onChange={(v) => setRatings((prev) => ({ ...prev, [key]: v }))}
            />
          </div>
        ))}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">コメント（任意）</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="食感・味・おすすめポイントなど..."
          rows={3}
          className="w-full border-2 border-pink-100 rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:border-pink-400 bg-pink-50 resize-none"
          maxLength={500}
        />
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-pink-500 text-white py-3 rounded-full text-sm font-bold hover:bg-pink-600 transition-colors disabled:opacity-50"
      >
        {submitting ? '送信中...' : 'レビューを投稿'}
      </button>
    </form>
  )
}
