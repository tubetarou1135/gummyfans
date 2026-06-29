'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { GummyRow, ReviewRow } from '@/lib/database.types'

type Tab = 'register' | 'gummies' | 'reviews'

// ---- グミ登録タブ ----
function RegisterTab() {
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
    const { error } = await supabase.from('gummies').insert({
      name: form.name.trim(),
      maker: form.maker.trim(),
      flavor: form.flavor.trim() || null,
      description: form.description.trim() || null,
    })
    setLoading(false)
    if (error) {
      setMsg({ type: 'err', text: '登録に失敗しました: ' + error.message })
    } else {
      setMsg({ type: 'ok', text: '登録しました！' })
      setForm({ name: '', maker: '', flavor: '', description: '' })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {[
        { key: 'name', label: '商品名 *', placeholder: 'コーラアップ' },
        { key: 'maker', label: 'メーカー *', placeholder: 'ハリボー' },
        { key: 'flavor', label: 'フレーバー', placeholder: 'コーラ' },
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
        <label className="block text-sm font-medium text-gray-700 mb-1">説明</label>
        <textarea
          value={form.description}
          onChange={(e) => set('description', e.target.value)}
          rows={3}
          className="w-full border-2 border-pink-100 rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:border-pink-400 bg-pink-50 resize-none"
        />
      </div>
      {msg && <p className={`text-sm ${msg.type === 'ok' ? 'text-green-600' : 'text-red-500'}`}>{msg.text}</p>}
      <button type="submit" disabled={loading} className="w-full bg-pink-500 text-white py-3 rounded-full text-sm font-bold hover:bg-pink-600 transition-colors disabled:opacity-50">
        {loading ? '登録中...' : '登録する'}
      </button>
    </form>
  )
}

// ---- グミ編集・削除タブ ----
function GummiesTab() {
  const [gummies, setGummies] = useState<GummyRow[]>([])
  const [editing, setEditing] = useState<GummyRow | null>(null)
  const [msg, setMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null)
  const [loading, setLoading] = useState(false)

  async function load() {
    const { data } = await supabase.from('gummies').select('*').order('created_at', { ascending: false })
    setGummies(data ?? [])
  }

  useEffect(() => { load() }, [])

  async function handleDelete(id: number) {
    if (!confirm('本当に削除しますか？')) return
    await supabase.from('gummies').delete().eq('id', id)
    load()
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault()
    if (!editing) return
    setLoading(true)
    const { error } = await supabase.from('gummies').update({
      name: editing.name,
      maker: editing.maker,
      flavor: editing.flavor,
      description: editing.description,
    }).eq('id', editing.id)
    setLoading(false)
    if (error) {
      setMsg({ type: 'err', text: '更新に失敗しました' })
    } else {
      setMsg({ type: 'ok', text: '更新しました！' })
      setEditing(null)
      load()
    }
  }

  if (editing) return (
    <form onSubmit={handleUpdate} className="space-y-4">
      <h2 className="font-semibold text-gray-700">編集: {editing.name}</h2>
      {[
        { key: 'name', label: '商品名' },
        { key: 'maker', label: 'メーカー' },
        { key: 'flavor', label: 'フレーバー' },
      ].map(({ key, label }) => (
        <div key={key}>
          <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
          <input
            value={(editing as unknown as Record<string, string | null>)[key] ?? ''}
            onChange={(e) => setEditing((prev) => prev ? { ...prev, [key]: e.target.value } : prev)}
            className="w-full border-2 border-pink-100 rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:border-pink-400 bg-pink-50"
          />
        </div>
      ))}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">説明</label>
        <textarea
          value={editing.description ?? ''}
          onChange={(e) => setEditing((prev) => prev ? { ...prev, description: e.target.value } : prev)}
          rows={3}
          className="w-full border-2 border-pink-100 rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:border-pink-400 bg-pink-50 resize-none"
        />
      </div>
      {msg && <p className={`text-sm ${msg.type === 'ok' ? 'text-green-600' : 'text-red-500'}`}>{msg.text}</p>}
      <div className="flex gap-2">
        <button type="button" onClick={() => setEditing(null)} className="flex-1 border-2 border-pink-200 text-pink-500 py-3 rounded-full text-sm font-bold hover:bg-pink-50 transition-colors">
          キャンセル
        </button>
        <button type="submit" disabled={loading} className="flex-1 bg-pink-500 text-white py-3 rounded-full text-sm font-bold hover:bg-pink-600 transition-colors disabled:opacity-50">
          {loading ? '更新中...' : '更新する'}
        </button>
      </div>
    </form>
  )

  return (
    <div className="space-y-3">
      {gummies.length === 0 && <p className="text-gray-400 text-sm">グミが登録されていません</p>}
      {gummies.map((g) => (
        <div key={g.id} className="flex items-center justify-between border-2 border-pink-100 rounded-2xl px-4 py-3">
          <div>
            <p className="font-semibold text-sm text-gray-800">{g.name}</p>
            <p className="text-xs text-gray-500">{g.maker}{g.flavor && ` / ${g.flavor}`}</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setEditing(g)} className="text-xs bg-pink-50 text-pink-500 px-3 py-1.5 rounded-full hover:bg-pink-100 transition-colors font-semibold">
              編集
            </button>
            <button onClick={() => handleDelete(g.id)} className="text-xs bg-red-50 text-red-400 px-3 py-1.5 rounded-full hover:bg-red-100 transition-colors font-semibold">
              削除
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

// ---- レビュー削除タブ ----
function ReviewsTab() {
  const [reviews, setReviews] = useState<(ReviewRow & { gummy_name: string })[]>([])

  async function load() {
    const { data } = await supabase
      .from('reviews')
      .select('*, gummies(name)')
      .order('created_at', { ascending: false })
    setReviews(
      (data ?? []).map((r: ReviewRow & { gummies: { name: string } | null }) => ({
        ...r,
        gummy_name: r.gummies?.name ?? '不明',
      }))
    )
  }

  useEffect(() => { load() }, [])

  async function handleDelete(id: number) {
    if (!confirm('本当に削除しますか？')) return
    await supabase.from('reviews').delete().eq('id', id)
    load()
  }

  return (
    <div className="space-y-3">
      {reviews.length === 0 && <p className="text-gray-400 text-sm">レビューがありません</p>}
      {reviews.map((r) => (
        <div key={r.id} className="flex items-start justify-between border-2 border-pink-100 rounded-2xl px-4 py-3">
          <div>
            <p className="font-semibold text-sm text-gray-800">{r.gummy_name}</p>
            <p className="text-xs text-gray-500">{r.nickname} · {new Date(r.created_at).toLocaleDateString('ja-JP')}</p>
            {r.comment && <p className="text-xs text-gray-400 mt-1 line-clamp-1">{r.comment}</p>}
          </div>
          <button onClick={() => handleDelete(r.id)} className="text-xs bg-red-50 text-red-400 px-3 py-1.5 rounded-full hover:bg-red-100 transition-colors font-semibold shrink-0 ml-2">
            削除
          </button>
        </div>
      ))}
    </div>
  )
}

// ---- メイン ----
const tabs: { key: Tab; label: string }[] = [
  { key: 'register', label: 'グミ登録' },
  { key: 'gummies', label: 'グミ編集・削除' },
  { key: 'reviews', label: 'レビュー削除' },
]

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>('register')

  return (
    <main className="max-w-lg mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">管理画面</h1>
      <div className="flex rounded-full bg-pink-50 p-1 gap-1 mb-6">
        {tabs.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex-1 py-2 rounded-full text-xs font-semibold transition-colors ${tab === key ? 'bg-pink-500 text-white' : 'text-gray-500 hover:text-pink-500'}`}
          >
            {label}
          </button>
        ))}
      </div>
      {tab === 'register' && <RegisterTab />}
      {tab === 'gummies' && <GummiesTab />}
      {tab === 'reviews' && <ReviewsTab />}
    </main>
  )
}
