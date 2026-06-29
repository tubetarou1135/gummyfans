'use client'

import { useState, useRef } from 'react'
import { supabase } from '@/lib/supabase'

export default function ImageUploadForm({ gummyId }: { gummyId: number }) {
  const [nickname, setNickname] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (!f) return
    setFile(f)
    setPreview(URL.createObjectURL(f))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!nickname.trim()) { setError('ニックネームを入力してください'); return }
    if (!file) { setError('画像を選択してください'); return }

    setLoading(true)
    setError(null)

    const ext = file.name.split('.').pop()
    const path = `${gummyId}/${Date.now()}.${ext}`

    const { error: uploadError } = await supabase.storage
      .from('gummy-images')
      .upload(path, file, { upsert: false })

    if (uploadError) {
      setError('アップロードに失敗しました。もう一度お試しください。')
      setLoading(false)
      return
    }

    const { error: dbError } = await supabase.from('gummy_images').insert({
      gummy_id: gummyId,
      nickname: nickname.trim(),
      storage_path: path,
    })

    setLoading(false)
    if (dbError) {
      setError('送信に失敗しました。もう一度お試しください。')
      return
    }
    setDone(true)
  }

  if (done) {
    return (
      <div className="text-center py-8">
        <p className="text-3xl mb-3">📸</p>
        <p className="font-bold text-gray-800 mb-1">ありがとうございます！</p>
        <p className="text-sm text-gray-500">審査後に掲載されます。</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">ニックネーム</label>
        <input
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder="例：グミ好き太郎"
          maxLength={30}
          className="w-full border-2 border-pink-100 rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:border-pink-400 bg-pink-50"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">画像</label>
        <div
          onClick={() => inputRef.current?.click()}
          className="border-2 border-dashed border-pink-200 rounded-2xl p-6 text-center cursor-pointer hover:border-pink-400 hover:bg-pink-50 transition-colors"
        >
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="preview" className="max-h-48 mx-auto rounded-xl object-contain" />
          ) : (
            <>
              <p className="text-3xl mb-2">📷</p>
              <p className="text-sm text-gray-500">タップして画像を選択</p>
              <p className="text-xs text-gray-400 mt-1">JPEG / PNG / WebP / HEIC・最大10MB</p>
            </>
          )}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/heic"
          onChange={handleFile}
          className="hidden"
        />
        {preview && (
          <button type="button" onClick={() => { setFile(null); setPreview(null) }} className="text-xs text-gray-400 mt-1 hover:text-red-400">
            画像を変更
          </button>
        )}
      </div>

      <div className="text-xs text-gray-400 space-y-1">
        <p>※ 投稿された画像は審査後に掲載されます。掲載された画像の著作権は投稿者に帰属します。</p>
        <p>※ 著作権等の権利があるサイトからの転載はご遠慮下さい。</p>
        <p>※ 自身が著作権を持つ画像（自分で撮った写真等）をご提供下さい。</p>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-pink-500 text-white py-3 rounded-full text-sm font-bold hover:bg-pink-600 transition-colors disabled:opacity-50"
      >
        {loading ? '送信中...' : '画像を提供する'}
      </button>
    </form>
  )
}
