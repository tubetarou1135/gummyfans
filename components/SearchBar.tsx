'use client'

import { useRouter } from 'next/navigation'
import { useTransition } from 'react'

export default function SearchBar({ defaultValue }: { defaultValue?: string }) {
  const router = useRouter()
  const [, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const q = (e.currentTarget.elements.namedItem('q') as HTMLInputElement).value.trim()
    startTransition(() => {
      router.push(q ? `/?q=${encodeURIComponent(q)}` : '/')
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        name="q"
        defaultValue={defaultValue}
        placeholder="🔍 商品名・メーカー・フレーバーで検索..."
        className="flex-1 border-2 border-pink-200 rounded-full px-5 py-2.5 text-sm focus:outline-none focus:border-pink-400 bg-white"
      />
      <button
        type="submit"
        className="bg-pink-500 text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-pink-600 transition-colors"
      >
        検索
      </button>
    </form>
  )
}
