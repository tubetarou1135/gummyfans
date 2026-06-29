'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function set(key: string, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setError('すべての項目を入力してください')
      return
    }
    setLoading(true)
    setError(null)
    const { error: err } = await supabase.from('contacts').insert({
      name: form.name.trim(),
      email: form.email.trim(),
      message: form.message.trim(),
    })
    setLoading(false)
    if (err) {
      setError('送信に失敗しました。もう一度お試しください。')
    } else {
      setDone(true)
    }
  }

  if (done) {
    return (
      <main className="max-w-lg mx-auto px-4 py-16 text-center">
        <p className="text-4xl mb-4">✉️</p>
        <h1 className="text-xl font-bold text-gray-800 mb-2">お問い合わせを受け付けました</h1>
        <p className="text-sm text-gray-500">内容を確認のうえ、ご連絡いたします。</p>
      </main>
    )
  }

  return (
    <main className="max-w-lg mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-2">お問い合わせ</h1>
      <p className="text-sm text-gray-500 mb-8">ご質問・ご要望はこちらからどうぞ。</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">お名前</label>
          <input
            value={form.name}
            onChange={(e) => set('name', e.target.value)}
            className="w-full border-2 border-pink-100 rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:border-pink-400 bg-pink-50"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">メールアドレス</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => set('email', e.target.value)}
            className="w-full border-2 border-pink-100 rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:border-pink-400 bg-pink-50"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">お問い合わせ内容</label>
          <textarea
            value={form.message}
            onChange={(e) => set('message', e.target.value)}
            rows={5}
            className="w-full border-2 border-pink-100 rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:border-pink-400 bg-pink-50 resize-none"
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-pink-500 text-white py-3 rounded-full text-sm font-bold hover:bg-pink-600 transition-colors disabled:opacity-50"
        >
          {loading ? '送信中...' : '送信する'}
        </button>
      </form>
    </main>
  )
}
