'use client'

import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import type { GummyRow, ReviewRow, ContactRow, GummyImageRow } from '@/lib/database.types'
import { toMoshimoUrl } from '@/lib/moshimo'
import Image from 'next/image'

type Tab = 'register' | 'gummies' | 'reviews' | 'requests' | 'contacts' | 'images' | 'discontinued'

type GummyRequest = {
  id: number
  name: string
  maker: string
  flavor: string | null
  description: string | null
  status: string
  created_at: string
}

type RakutenItem = {
  itemName: string
  shopName: string
  itemPrice: number
  itemUrl: string
  mediumImageUrls: { imageUrl: string }[]
  largeImageUrls: { imageUrl: string }[]
}

// ---- グミ登録タブ ----
function RegisterTab() {
  const [mode, setMode] = useState<'rakuten' | 'manual'>('rakuten')
  const [query, setQuery] = useState('')
  const [searching, setSearching] = useState(false)
  const [results, setResults] = useState<RakutenItem[]>([])
  const [selected, setSelected] = useState<RakutenItem | null>(null)
  const [form, setForm] = useState({ name: '', maker: '', flavor: '', description: '', image_url: '', rakuten_url: '' })
  const [msg, setMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null)
  const [loading, setLoading] = useState(false)

  function set(key: string, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (!query.trim()) return
    setSearching(true)
    setResults([])
    const appId = process.env.NEXT_PUBLIC_RAKUTEN_APP_ID
    const accessKey = process.env.NEXT_PUBLIC_RAKUTEN_ACCESS_KEY
    const affiliateId = process.env.NEXT_PUBLIC_RAKUTEN_AFFILIATE_ID
    const res = await fetch(`https://openapi.rakuten.co.jp/ichibams/api/IchibaItem/Search/20260401?accessKey=${encodeURIComponent(accessKey ?? '')}&format=json`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        applicationId: appId,
        accessKey: accessKey,
        affiliateId: affiliateId,
        keyword: query + ' グミ',
        hits: 20,
      }),
    })
    const data = await res.json()
    setResults(data.Items?.map((i: { Item: RakutenItem }) => i.Item) ?? [])
    setSearching(false)
  }

  function handleSelect(item: RakutenItem) {
    setSelected(item)
    setForm({
      name: item.itemName,
      maker: item.shopName,
      flavor: '',
      description: '',
      image_url: item.largeImageUrls?.[0]?.imageUrl ?? item.mediumImageUrls[0]?.imageUrl ?? '',
      rakuten_url: toMoshimoUrl(item.itemUrl),
    })
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
      image_url: form.image_url.trim() || null,
      rakuten_url: form.rakuten_url.trim() || null,
    })
    setLoading(false)
    if (error) {
      setMsg({ type: 'err', text: '登録に失敗しました: ' + error.message })
    } else {
      setMsg({ type: 'ok', text: '登録しました！' })
      setForm({ name: '', maker: '', flavor: '', description: '', image_url: '', rakuten_url: '' })
      setSelected(null)
      setResults([])
      setQuery('')
    }
  }

  return (
    <div className="space-y-4">
      {/* モード切替 */}
      <div className="flex rounded-full bg-pink-50 p-1 gap-1">
        <button onClick={() => setMode('rakuten')} className={`flex-1 py-2 rounded-full text-xs font-semibold transition-colors ${mode === 'rakuten' ? 'bg-pink-500 text-white' : 'text-gray-500'}`}>楽天から検索</button>
        <button onClick={() => setMode('manual')} className={`flex-1 py-2 rounded-full text-xs font-semibold transition-colors ${mode === 'manual' ? 'bg-pink-500 text-white' : 'text-gray-500'}`}>手動入力</button>
      </div>

      {mode === 'rakuten' && !selected && (
        <div className="space-y-4">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="グミ名で検索..."
              className="flex-1 border-2 border-pink-100 rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:border-pink-400 bg-pink-50"
            />
            <button type="submit" disabled={searching} className="bg-pink-500 text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-pink-600 disabled:opacity-50">
              {searching ? '検索中...' : '検索'}
            </button>
          </form>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[600px] overflow-y-auto pr-1">
            {results.map((item, i) => (
              <button key={i} onClick={() => handleSelect(item)} className="flex items-center gap-3 border-2 border-pink-100 rounded-2xl p-3 hover:border-pink-400 hover:bg-pink-50 transition-colors text-left">
                {( item.largeImageUrls?.[0] || item.mediumImageUrls[0]) && (
                  <Image src={item.largeImageUrls?.[0]?.imageUrl ?? item.mediumImageUrls[0].imageUrl} alt={item.itemName} width={64} height={64} className="rounded-xl object-contain shrink-0" />
                )}
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-gray-800 line-clamp-3">{item.itemName}</p>
                  <p className="text-xs text-gray-400 mt-1">{item.shopName}</p>
                  <p className="text-sm font-bold text-pink-500 mt-0.5">¥{item.itemPrice.toLocaleString()}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {(mode === 'manual' || selected) && (
        <form onSubmit={handleSubmit} className="space-y-4">
          {selected && (
            <div className="flex items-center gap-3 bg-pink-50 rounded-2xl p-3">
              {form.image_url && <Image src={form.image_url} alt={form.name} width={48} height={48} className="rounded-xl object-contain shrink-0" />}
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-gray-700 line-clamp-1">{selected.itemName}</p>
                <p className="text-xs text-gray-400">選択中</p>
              </div>
              <button type="button" onClick={() => { setSelected(null); setForm({ name: '', maker: '', flavor: '', description: '', image_url: '', rakuten_url: '' }) }} className="text-xs text-gray-400 hover:text-red-400">変更</button>
            </div>
          )}
          {[
            { key: 'name', label: '商品名 *', placeholder: '' },
            { key: 'maker', label: 'メーカー *', placeholder: '' },
            { key: 'flavor', label: 'フレーバー', placeholder: '' },
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
      )}
    </div>
  )
}

// ---- グミ編集・削除タブ ----
function GummiesTab() {
  const [gummies, setGummies] = useState<GummyRow[]>([])
  const [editing, setEditing] = useState<GummyRow | null>(null)
  const [msg, setMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null)
  const [loading, setLoading] = useState(false)
  const [makerFilter, setMakerFilter] = useState('')
  const [imageFilter, setImageFilter] = useState<'all' | 'with' | 'without'>('all')
  const [sortAsc, setSortAsc] = useState(true)
  const scrollRef = useRef(0)

  async function load() {
    const { data } = await supabase.from('gummies').select('*')
    setGummies(data ?? [])
  }

  useEffect(() => { load() }, [])

  const makers = Array.from(new Set(gummies.map(g => g.maker))).sort((a, b) => a.localeCompare(b, 'ja'))
  const filtered = gummies
    .filter(g => makerFilter ? g.maker === makerFilter : true)
    .filter(g => imageFilter === 'with' ? !!g.image_url : imageFilter === 'without' ? !g.image_url : true)
    .slice()
    .sort((a, b) => {
      const cmp = a.name.localeCompare(b.name, 'ja')
      return sortAsc ? cmp : -cmp
    })

  async function handleDelete(id: number) {
    if (!confirm('本当に削除しますか？')) return
    await supabase.from('gummies').delete().eq('id', id)
    load()
  }

  const [rakutenQuery, setRakutenQuery] = useState('')
  const [rakutenResults, setRakutenResults] = useState<RakutenItem[]>([])
  const [rakutenSearching, setRakutenSearching] = useState(false)

  async function handleRakutenSearch(e?: React.FormEvent | React.MouseEvent) {
    e?.preventDefault()
    if (!rakutenQuery.trim()) return
    setRakutenSearching(true)
    setRakutenResults([])
    const appId = process.env.NEXT_PUBLIC_RAKUTEN_APP_ID
    const accessKey = process.env.NEXT_PUBLIC_RAKUTEN_ACCESS_KEY
    const affiliateId = process.env.NEXT_PUBLIC_RAKUTEN_AFFILIATE_ID
    const res = await fetch(`https://openapi.rakuten.co.jp/ichibams/api/IchibaItem/Search/20260401?accessKey=${encodeURIComponent(accessKey ?? '')}&format=json`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ applicationId: appId, accessKey, affiliateId, keyword: rakutenQuery + ' グミ', hits: 20 }),
    })
    const data = await res.json()
    setRakutenResults(data.Items?.map((i: { Item: RakutenItem }) => i.Item) ?? [])
    setRakutenSearching(false)
  }

  function handleRakutenSelect(item: RakutenItem) {
    setEditing(prev => prev ? {
      ...prev,
      image_url: item.largeImageUrls?.[0]?.imageUrl ?? item.mediumImageUrls[0]?.imageUrl ?? prev.image_url,
      rakuten_url: toMoshimoUrl(item.itemUrl),
    } : prev)
    setRakutenResults([])
    setRakutenQuery('')
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
      image_url: editing.image_url,
      rakuten_url: editing.rakuten_url,
      new_until: editing.new_until,
    }).eq('id', editing.id)
    setLoading(false)
    if (error) {
      setMsg({ type: 'err', text: '更新に失敗しました' })
    } else {
      setMsg({ type: 'ok', text: '更新しました！' })
      setEditing(null)
      setRakutenResults([])
      load().then(() => window.scrollTo({ top: scrollRef.current }))
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

      {/* 楽天検索 */}
      <div className="border-2 border-pink-100 rounded-2xl p-4 space-y-3">
        <p className="text-sm font-semibold text-gray-700">楽天から画像・URLを検索</p>
        {editing.image_url ? (
          <div className="flex items-center gap-3">
            <Image src={editing.image_url} alt="" width={80} height={80} className="rounded-xl object-contain shrink-0 border border-pink-100" />
            <div className="space-y-1">
              <p className="text-xs text-gray-400">{editing.rakuten_url ? '楽天URL設定済み' : 'URLなし'}</p>
              <button type="button" onClick={() => setEditing(prev => prev ? { ...prev, image_url: null } : prev)} className="text-xs text-red-400 hover:text-red-600">画像を削除</button>
            </div>
          </div>
        ) : (
          <p className="text-xs text-gray-400">画像なし・{editing.rakuten_url ? '楽天URL設定済み' : 'URLなし'}</p>
        )}
        <div className="flex gap-2">
          <input
            value={rakutenQuery}
            onChange={(e) => setRakutenQuery(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleRakutenSearch(e as unknown as React.FormEvent) } }}
            placeholder={`${editing.name}${editing.flavor ? ' ' + editing.flavor : ''}`}
            className="flex-1 border-2 border-pink-100 rounded-2xl px-4 py-2 text-sm focus:outline-none focus:border-pink-400 bg-pink-50"
          />
          <button type="button" onClick={handleRakutenSearch} disabled={rakutenSearching} className="bg-pink-500 text-white px-4 py-2 rounded-full text-sm font-bold hover:bg-pink-600 disabled:opacity-50">
            {rakutenSearching ? '...' : '検索'}
          </button>
        </div>
        {rakutenResults.length > 0 && (
          <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
            {rakutenResults.map((item, i) => (
              <button key={i} type="button" onClick={() => handleRakutenSelect(item)}
                className="flex items-center gap-2 border-2 border-pink-100 rounded-xl p-2 hover:border-pink-400 hover:bg-pink-50 transition-colors text-left">
                {(item.largeImageUrls?.[0] || item.mediumImageUrls[0]) && (
                  <Image src={item.largeImageUrls?.[0]?.imageUrl ?? item.mediumImageUrls[0].imageUrl} alt="" width={40} height={40} className="rounded-lg object-contain shrink-0" />
                )}
                <p className="text-xs text-gray-700 line-clamp-2">{item.itemName}</p>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 新グミ設定 */}
      <div className="border-2 border-pink-100 rounded-2xl p-4">
        <p className="text-sm font-semibold text-gray-700 mb-2">新グミタグ</p>
        {editing.new_until && new Date(editing.new_until) > new Date() ? (
          <div className="flex items-center justify-between">
            <p className="text-xs text-green-600 font-semibold">🆕 設定中 〜 {new Date(editing.new_until).toLocaleDateString('ja-JP')}</p>
            <button type="button" onClick={() => setEditing(prev => prev ? { ...prev, new_until: null } : prev)}
              className="text-xs text-red-400 hover:text-red-600">解除</button>
          </div>
        ) : (
          <button type="button"
            onClick={() => {
              const d = new Date(); d.setMonth(d.getMonth() + 1)
              setEditing(prev => prev ? { ...prev, new_until: d.toISOString() } : prev)
            }}
            className="text-xs bg-pink-50 text-pink-500 px-4 py-2 rounded-full hover:bg-pink-100 transition-colors font-semibold">
            新グミに設定（1ヶ月間）
          </button>
        )}
      </div>

      {msg && <p className={`text-sm ${msg.type === 'ok' ? 'text-green-600' : 'text-red-500'}`}>{msg.text}</p>}
      <div className="flex gap-2">
        <button type="button" onClick={() => { setEditing(null); setRakutenResults([]); window.scrollTo({ top: scrollRef.current }) }} className="flex-1 border-2 border-pink-200 text-pink-500 py-3 rounded-full text-sm font-bold hover:bg-pink-50 transition-colors">
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
      <div className="flex gap-2">
        <select
          value={makerFilter}
          onChange={(e) => setMakerFilter(e.target.value)}
          className="flex-1 border-2 border-pink-100 rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:border-pink-400 bg-pink-50"
        >
          <option value="">すべてのメーカー ({gummies.length}件)</option>
          {makers.map(m => (
            <option key={m} value={m}>{m} ({gummies.filter(g => g.maker === m).length}件)</option>
          ))}
        </select>
        <select
          value={imageFilter}
          onChange={(e) => setImageFilter(e.target.value as 'all' | 'with' | 'without')}
          className="shrink-0 border-2 border-pink-100 rounded-2xl px-3 py-2.5 text-sm focus:outline-none focus:border-pink-400 bg-pink-50"
        >
          <option value="all">画像：全て ({gummies.length}件)</option>
          <option value="with">画像あり ({gummies.filter(g => !!g.image_url).length}件)</option>
          <option value="without">画像なし ({gummies.filter(g => !g.image_url).length}件)</option>
        </select>
        <button
          onClick={() => setSortAsc(v => !v)}
          className="shrink-0 border-2 border-pink-100 rounded-2xl px-4 py-2.5 text-sm font-semibold bg-pink-50 hover:bg-pink-100 transition-colors text-pink-500"
        >
          五十音 {sortAsc ? '▲' : '▼'}
        </button>
      </div>
      <p className="text-xs text-gray-400">{filtered.length}件表示中</p>
      {filtered.length === 0 && <p className="text-gray-400 text-sm">グミが登録されていません</p>}
      {filtered.map((g) => (
        <div key={g.id} className="flex items-center justify-between border-2 border-pink-100 rounded-2xl px-4 py-3">
          <div>
            <p className="font-semibold text-sm text-gray-800">{g.name}</p>
            <p className="text-xs text-gray-500">{g.maker}{g.flavor && ` / ${g.flavor}`}</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => { scrollRef.current = window.scrollY; setEditing(g); setRakutenQuery(g.name + (g.flavor ? ' ' + g.flavor : '')) }} className="text-xs bg-pink-50 text-pink-500 px-3 py-1.5 rounded-full hover:bg-pink-100 transition-colors font-semibold">
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

// ---- 申請管理タブ ----
function RequestsTab() {
  const [requests, setRequests] = useState<GummyRequest[]>([])
  const [msg, setMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null)

  async function load() {
    const { data } = await supabase
      .from('gummy_requests')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: false })
    setRequests(data ?? [])
  }

  useEffect(() => { load() }, [])

  async function handleApprove(req: GummyRequest) {
    const { error } = await supabase.from('gummies').insert({
      name: req.name,
      maker: req.maker,
      flavor: req.flavor,
      description: req.description,
      image_url: null,
      rakuten_url: null,
    })
    if (error) {
      setMsg({ type: 'err', text: '登録に失敗しました: ' + error.message })
      return
    }
    await supabase.from('gummy_requests').update({ status: 'approved' }).eq('id', req.id)
    setMsg({ type: 'ok', text: `「${req.name}」を承認しました！` })
    load()
  }

  async function handleReject(req: GummyRequest) {
    if (!confirm(`「${req.name}」を却下しますか？`)) return
    await supabase.from('gummy_requests').update({ status: 'rejected' }).eq('id', req.id)
    load()
  }

  return (
    <div className="space-y-3">
      {msg && <p className={`text-sm ${msg.type === 'ok' ? 'text-green-600' : 'text-red-500'}`}>{msg.text}</p>}
      {requests.length === 0 && <p className="text-gray-400 text-sm">未処理の申請はありません</p>}
      {requests.map((r) => (
        <div key={r.id} className="border-2 border-pink-100 rounded-2xl px-4 py-3 space-y-2">
          <div>
            <p className="font-semibold text-sm text-gray-800">{r.name}</p>
            <p className="text-xs text-gray-500">{r.maker}{r.flavor && ` / ${r.flavor}`}</p>
            {r.description && <p className="text-xs text-gray-400 mt-1">{r.description}</p>}
            <p className="text-xs text-gray-300 mt-1">{new Date(r.created_at).toLocaleDateString('ja-JP')}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handleApprove(r)}
              className="flex-1 text-xs bg-green-50 text-green-600 px-3 py-2 rounded-full hover:bg-green-100 transition-colors font-semibold"
            >
              承認して登録
            </button>
            <button
              onClick={() => handleReject(r)}
              className="flex-1 text-xs bg-red-50 text-red-400 px-3 py-2 rounded-full hover:bg-red-100 transition-colors font-semibold"
            >
              却下
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

// ---- 画像承認タブ ----
function ImagesTab() {
  const [images, setImages] = useState<(GummyImageRow & { gummy_name: string })[]>([])
  const [msg, setMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null)

  async function load() {
    const { data } = await supabase
      .from('gummy_images')
      .select('*, gummies(name)')
      .eq('status', 'pending')
      .order('created_at', { ascending: false })
    setImages(
      (data ?? []).map((r: GummyImageRow & { gummies: { name: string } | null }) => ({
        ...r,
        gummy_name: r.gummies?.name ?? '不明',
      }))
    )
  }

  useEffect(() => { load() }, [])

  async function handleApprove(img: GummyImageRow & { gummy_name: string }) {
    // 既存の承認済み画像を却下
    await supabase
      .from('gummy_images')
      .update({ status: 'rejected' })
      .eq('gummy_id', img.gummy_id)
      .eq('status', 'approved')
    // 今回の画像を承認
    const { error } = await supabase
      .from('gummy_images')
      .update({ status: 'approved' })
      .eq('id', img.id)
    if (error) { setMsg({ type: 'err', text: '承認に失敗しました' }); return }
    setMsg({ type: 'ok', text: `「${img.gummy_name}」の画像を承認しました！` })
    load()
  }

  async function handleReject(img: GummyImageRow) {
    await supabase.from('gummy_images').update({ status: 'rejected' }).eq('id', img.id)
    load()
  }

  return (
    <div className="space-y-4">
      {msg && <p className={`text-sm ${msg.type === 'ok' ? 'text-green-600' : 'text-red-500'}`}>{msg.text}</p>}
      {images.length === 0 && <p className="text-gray-400 text-sm">未処理の画像投稿はありません</p>}
      {images.map((img) => {
        const url = supabase.storage.from('gummy-images').getPublicUrl(img.storage_path).data.publicUrl
        return (
          <div key={img.id} className="border-2 border-pink-100 rounded-2xl p-4 space-y-3">
            <div>
              <p className="font-semibold text-sm text-gray-800">{img.gummy_name}</p>
              <p className="text-xs text-gray-500">{img.nickname}さんより · {new Date(img.created_at).toLocaleDateString('ja-JP')}</p>
            </div>
            <div className="relative w-full aspect-square max-w-xs rounded-2xl overflow-hidden border border-pink-100">
              <Image src={url} alt={img.gummy_name} fill className="object-contain" />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleApprove(img)}
                className="flex-1 text-xs bg-green-50 text-green-600 px-3 py-2 rounded-full hover:bg-green-100 transition-colors font-semibold"
              >
                承認して掲載
              </button>
              <button
                onClick={() => handleReject(img)}
                className="flex-1 text-xs bg-red-50 text-red-400 px-3 py-2 rounded-full hover:bg-red-100 transition-colors font-semibold"
              >
                却下
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ---- 問い合わせタブ ----
function ContactsTab() {
  const [contacts, setContacts] = useState<ContactRow[]>([])

  async function load() {
    const { data } = await supabase
      .from('contacts')
      .select('*')
      .order('created_at', { ascending: false })
    setContacts(data ?? [])
  }

  useEffect(() => { load() }, [])

  async function handleDelete(id: number) {
    if (!confirm('削除しますか？')) return
    await supabase.from('contacts').delete().eq('id', id)
    load()
  }

  return (
    <div className="space-y-3">
      {contacts.length === 0 && <p className="text-gray-400 text-sm">問い合わせはありません</p>}
      {contacts.map((c) => (
        <div key={c.id} className="border-2 border-pink-100 rounded-2xl px-4 py-3 space-y-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="font-semibold text-sm text-gray-800">{c.name}</p>
              <p className="text-xs text-pink-400">{c.email}</p>
              <p className="text-xs text-gray-300 mt-0.5">{new Date(c.created_at).toLocaleDateString('ja-JP')}</p>
            </div>
            <button
              onClick={() => handleDelete(c.id)}
              className="text-xs bg-red-50 text-red-400 px-3 py-1.5 rounded-full hover:bg-red-100 transition-colors font-semibold shrink-0"
            >
              削除
            </button>
          </div>
          <p className="text-sm text-gray-600 whitespace-pre-wrap border-t border-pink-50 pt-2 mt-2">{c.message}</p>
        </div>
      ))}
    </div>
  )
}

// ---- 終売報告タブ ----
function DiscontinuedTab() {
  const [rows, setRows] = useState<{ name: string; maker: string; flavor: string | null; count: number; gummy_id: number; discontinued: boolean }[]>([])

  async function load() {
    const { data } = await supabase
      .from('discontinued_reports')
      .select('gummy_id, gummies(name, maker, flavor, discontinued)')
    if (!data) return
    const map = new Map<number, { name: string; maker: string; flavor: string | null; count: number; gummy_id: number; discontinued: boolean }>()
    for (const row of data as any[]) {
      const id = row.gummy_id
      if (!map.has(id)) {
        map.set(id, { gummy_id: id, name: row.gummies.name, maker: row.gummies.maker, flavor: row.gummies.flavor, discontinued: row.gummies.discontinued, count: 0 })
      }
      map.get(id)!.count++
    }
    setRows([...map.values()].sort((a, b) => b.count - a.count))
  }

  useEffect(() => { load() }, [])

  async function confirmDiscontinued(gummy_id: number) {
    await supabase.from('gummies').update({ discontinued: true }).eq('id', gummy_id)
    setRows((prev) => prev.map((r) => r.gummy_id === gummy_id ? { ...r, discontinued: true } : r))
  }

  async function cancelDiscontinued(gummy_id: number) {
    await supabase.from('gummies').update({ discontinued: false }).eq('id', gummy_id)
    setRows((prev) => prev.map((r) => r.gummy_id === gummy_id ? { ...r, discontinued: false } : r))
  }

  async function deleteReports(gummy_id: number) {
    await supabase.from('discontinued_reports').delete().eq('gummy_id', gummy_id)
    setRows((prev) => prev.filter((r) => r.gummy_id !== gummy_id))
  }

  if (rows.length === 0) return <p className="text-sm text-gray-400">終売報告はまだありません</p>

  return (
    <div className="space-y-3">
      {rows.map((r) => (
        <div key={r.gummy_id} className="flex items-center justify-between border border-pink-100 rounded-2xl px-4 py-3">
          <div>
            <div className="flex items-center gap-2">
              <p className="font-semibold text-gray-800">{r.name}</p>
              {r.discontinued && (
                <span className="text-xs bg-gray-200 text-gray-500 px-2 py-0.5 rounded-full font-bold">終売確定済</span>
              )}
            </div>
            <p className="text-xs text-gray-400">{r.maker}{r.flavor && ` / ${r.flavor}`}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-orange-500 font-bold text-sm">{r.count}件</span>
            <button
              type="button"
              onClick={() => deleteReports(r.gummy_id)}
              className="text-xs bg-red-50 text-red-400 px-3 py-1.5 rounded-full font-bold hover:bg-red-100 transition-colors"
            >
              報告削除
            </button>
            {r.discontinued ? (
              <button
                type="button"
                onClick={() => cancelDiscontinued(r.gummy_id)}
                className="text-xs bg-gray-200 text-gray-600 px-3 py-1.5 rounded-full font-bold hover:bg-gray-300 transition-colors"
              >
                取り消し
              </button>
            ) : (
              <button
                type="button"
                onClick={() => confirmDiscontinued(r.gummy_id)}
                className="text-xs bg-red-500 text-white px-3 py-1.5 rounded-full font-bold hover:bg-red-600 transition-colors"
              >
                終売確定
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

// ---- メイン ----
const tabs: { key: Tab; label: string; icon: string }[] = [
  { key: 'register', label: 'グミ登録', icon: '➕' },
  { key: 'gummies', label: 'グミ編集・削除', icon: '✏️' },
  { key: 'reviews', label: 'レビュー削除', icon: '🗑️' },
  { key: 'requests', label: '新グミ申請', icon: '📬' },
  { key: 'contacts', label: '問い合わせ', icon: '✉️' },
  { key: 'images', label: '画像承認', icon: '🖼️' },
  { key: 'discontinued', label: '終売報告', icon: '🚫' },
]

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>('register')
  const current = tabs.find(t => t.key === tab)

  return (
    <div className="min-h-screen pb-20 md:pb-0" style={{ background: 'var(--background)' }}>
      {/* スマホ: 上部タブスクロール */}
      <div className="md:hidden sticky top-0 z-10 bg-white border-b border-pink-100 px-2 py-2">
        <p className="text-xs font-bold text-gray-400 px-2 mb-1">管理画面</p>
        <div className="flex gap-1 overflow-x-auto no-scrollbar">
          {tabs.map(({ key, label, icon }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex-none flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors whitespace-nowrap ${
                tab === key ? 'bg-pink-500 text-white' : 'text-gray-500 bg-pink-50'
              }`}
            >
              <span>{icon}</span>
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 md:py-8 md:flex md:gap-6">
        {/* PC: サイドバー */}
        <aside className="hidden md:block w-48 shrink-0">
          <h1 className="text-lg font-bold text-gray-700 mb-4 px-2">管理画面</h1>
          <nav className="space-y-1">
            {tabs.map(({ key, label, icon }) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`w-full flex items-center gap-2.5 px-4 py-2.5 rounded-2xl text-sm font-semibold transition-colors text-left ${
                  tab === key
                    ? 'bg-pink-500 text-white'
                    : 'text-gray-500 hover:bg-pink-50 hover:text-pink-500'
                }`}
              >
                <span>{icon}</span>
                <span>{label}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* コンテンツ */}
        <main className="flex-1 min-w-0">
          <h2 className="text-lg md:text-xl font-bold text-gray-700 mb-4 md:mb-6 flex items-center gap-2">
            <span>{current?.icon}</span>
            <span>{current?.label}</span>
          </h2>
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-pink-100">
            {tab === 'register' && <RegisterTab />}
            {tab === 'gummies' && <GummiesTab />}
            {tab === 'reviews' && <ReviewsTab />}
            {tab === 'requests' && <RequestsTab />}
            {tab === 'contacts' && <ContactsTab />}
            {tab === 'images' && <ImagesTab />}
            {tab === 'discontinued' && <DiscontinuedTab />}
          </div>
        </main>
      </div>
    </div>
  )
}
