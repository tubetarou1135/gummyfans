'use client'

import { useState } from 'react'
import ReviewForm from './ReviewForm'
import ImageUploadForm from './ImageUploadForm'

type Tab = 'review' | 'image'

export default function PostTabs({ gummyId }: { gummyId: number }) {
  const [tab, setTab] = useState<Tab>('review')

  return (
    <div className="border-2 border-pink-100 rounded-3xl bg-white overflow-hidden mb-6">
      {/* タブヘッダー */}
      <div className="flex border-b-2 border-pink-50">
        <button
          onClick={() => setTab('review')}
          className={`flex-1 py-3 text-sm font-semibold transition-colors ${
            tab === 'review' ? 'text-pink-500 border-b-2 border-pink-500 -mb-0.5' : 'text-gray-400 hover:text-pink-400'
          }`}
        >
          レビューを投稿
        </button>
        <button
          onClick={() => setTab('image')}
          className={`flex-1 py-3 text-sm font-semibold transition-colors ${
            tab === 'image' ? 'text-pink-500 border-b-2 border-pink-500 -mb-0.5' : 'text-gray-400 hover:text-pink-400'
          }`}
        >
          📸 画像を提供
        </button>
      </div>

      {/* コンテンツ */}
      <div className="px-5 pb-5">
        {tab === 'review' && <ReviewFormInner gummyId={gummyId} />}
        {tab === 'image' && <ImageUploadForm gummyId={gummyId} />}
      </div>
    </div>
  )
}

function ReviewFormInner({ gummyId }: { gummyId: number }) {
  return <ReviewForm gummyId={gummyId} inner />
}
