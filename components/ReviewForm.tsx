'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import StarRating from './StarRating'

type BasicKey = 'hardness' | 'sweetness' | 'sourness' | 'value' | 'overall'
type ExpertKey = 'first_bite' | 'second_bounding' | 'gelatin_toughness' | 'fruit_taste' | 'after_flavor'

const basicFields: { key: BasicKey; label: string }[] = [
  { key: 'hardness', label: '硬さ' },
  { key: 'sweetness', label: '甘さ' },
  { key: 'sourness', label: '酸っぱさ' },
  { key: 'value', label: 'コスパ' },
  { key: 'overall', label: '総合評価' },
]

const expertFields: { key: ExpertKey; label: string; desc: string }[] = [
  { key: 'first_bite', label: 'ファーストバイト', desc: '口に入れた瞬間の硬さや柔らかさ' },
  { key: 'second_bounding', label: 'セカンドバウンディング', desc: '噛んだ際の弾力や跳ね返るような噛み応え' },
  { key: 'gelatin_toughness', label: 'ゼラチンタフネス', desc: 'ゼラチン特有の歯切れの良さや舌触り' },
  { key: 'fruit_taste', label: 'フルーツテイスト', desc: '噛んだ瞬間に広がる果汁感や味の濃淡' },
  { key: 'after_flavor', label: 'アフターフレーバー', desc: '飲み込んだ後に残る香りや余韻' },
]

const defaultBasic: Record<BasicKey, number> = {
  hardness: 0, sweetness: 0, sourness: 0, value: 0, overall: 0,
}
const defaultExpert: Record<ExpertKey, number> = {
  first_bite: 0, second_bounding: 0, gelatin_toughness: 0, fruit_taste: 0, after_flavor: 0,
}

export default function ReviewForm({ gummyId }: { gummyId: number }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [nickname, setNickname] = useState('')
  const [comment, setComment] = useState('')
  const [basic, setBasic] = useState(defaultBasic)
  const [expert, setExpert] = useState(defaultExpert)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!nickname.trim()) {
      setError('ニックネームを入力してください')
      return
    }
    const unrated = basicFields.filter((f) => basic[f.key] === 0)
    if (unrated.length > 0) {
      setError(`${unrated.map((f) => f.label).join('・')}を評価してください`)
      return
    }
    setSubmitting(true)
    setError(null)

    const hasExpert = expertFields.some((f) => expert[f.key] > 0)
    const payload = {
      gummy_id: gummyId,
      nickname: nickname.trim(),
      comment: comment.trim() || null,
      ...basic,
      ...(hasExpert ? expert : {}),
    }

    const { error: err } = await supabase.from('reviews').insert(payload)
    if (err) {
      setError('送信に失敗しました。もう一度お試しください。')
      setSubmitting(false)
      return
    }
    router.refresh()
    setNickname('')
    setComment('')
    setBasic(defaultBasic)
    setExpert(defaultExpert)
    setOpen(false)
    setSubmitting(false)
  }

  return (
    <div className="border-2 border-pink-100 rounded-3xl bg-white overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-4 text-left"
      >
        <span className="font-semibold text-gray-700">レビューを投稿</span>
        <span className="text-pink-400 text-lg">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <form onSubmit={handleSubmit} className="px-5 pb-5 space-y-5 border-t-2 border-pink-50 pt-4">
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

          {/* 一般評価 */}
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-2">一般評価</p>
            <div className="space-y-2">
              {basicFields.map(({ key, label }) => (
                <div key={key} className="flex items-center gap-3">
                  <span className="text-sm text-gray-600 w-20 shrink-0">{label}</span>
                  <StarRating value={basic[key]} onChange={(v) => setBasic((p) => ({ ...p, [key]: v }))} size="md" />
                </div>
              ))}
            </div>
          </div>

          {/* 日本グミ協会指標（任意） */}
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-0.5">日本グミ協会指標 <span className="text-gray-400 font-normal text-xs">（任意）</span></p>
            <p className="text-xs text-gray-300 mb-2">この評価指標は日本グミ協会の許可を得て使用しています</p>
            <div className="space-y-3">
              {expertFields.map(({ key, label, desc }) => (
                <div key={key}>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-600 w-40 shrink-0 whitespace-nowrap">{label}</span>
                    <StarRating value={expert[key]} onChange={(v) => setExpert((p) => ({ ...p, [key]: v }))} size="md" />
                  </div>
                  <p className="text-xs text-gray-400 ml-40 pl-3">{desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* コメント（任意） */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">コメント <span className="text-gray-400 font-normal text-xs">（任意）</span></label>
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
      )}
    </div>
  )
}
