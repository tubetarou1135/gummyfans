'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function RequestPage() {
  const [form, setForm] = useState({ name: '', maker: '', flavor: '', description: '' })
  const [msg, setMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null)
  const [loading, setLoading] = useState(false)

  function set(key: string, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim() || !form.maker.trim()) {
      setMsg({ type: 'err', text: '商品名とメーカーは必須です' })
      return
    }
    setLoading(true)
    const { error } = await supabase.from('gummy_requests').insert({
      name: form.name.trim(),
      maker: form.maker.trim(),
      flavor: form.flavor.trim() || null,
      description: form.description.trim() || null,
    })
    setLoading(false)
    if (error) {
      setMsg({ type: 'err', text: '送信に失敗しました: ' + error.message })
    } else {
      setMsg({ type: 'ok', text: '申請を送信しました！審査後に掲載されます。' })
      setForm({ name: '', maker: '', flavor: '', description: '' })
    }
  }

  return (
    <main className="max-w-lg mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-2">新グミ申請</h1>
      <p className="text-sm text-gray-500 mb-8">掲載してほしいグミを申請できます。管理人が確認し掲載されます。</p>

      {msg?.type === 'ok' ? (
        <div className="text-center py-12">
          <p className="text-4xl mb-4">🎉</p>
          <p className="font-bold text-gray-800 mb-2">{msg.text}</p>
          <button
            onClick={() => setMsg(null)}
            className="mt-4 text-sm text-pink-500 underline"
          >
            続けて申請する
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { key: 'name', label: '商品名 *', placeholder: '' },
            { key: 'maker', label: 'メーカー *', placeholder: '' },
            { key: 'flavor', label: 'フレーバー / 味', placeholder: '' },
          ].map(({ key, label, placeholder }) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
              <input
                value={(form as Record<string, string>)[key]}
                onChange={(e) => set(key, e.target.value)}
                placeholder={placeholder}
                className="w-full border-2 border-pink-100 rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:border-pink-400 bg-pink-50"
              />
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">説明（任意）</label>
            <textarea
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              placeholder=""
              rows={3}
              className="w-full border-2 border-pink-100 rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:border-pink-400 bg-pink-50 resize-none"
            />
          </div>
          {msg && <p className="text-sm text-red-500">{msg.text}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-pink-500 text-white py-3 rounded-full text-sm font-bold hover:bg-pink-600 transition-colors disabled:opacity-50"
          >
            {loading ? '送信中...' : '申請する'}
          </button>
        </form>
      )}
    </main>
  )
}
