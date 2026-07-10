'use client'

import { useState } from 'react'
import Image from 'next/image'

type ImageItem = {
  url: string
  label: string // "楽天市場" | "nickname" など
}

export default function GummyImageGallery({ images }: { images: ImageItem[] }) {
  const [current, setCurrent] = useState(0)

  if (images.length === 0) {
    return (
      <div className="w-full aspect-square max-w-sm mx-auto md:mx-0 rounded-3xl border-2 border-dashed border-pink-200 bg-pink-50 flex flex-col items-center justify-center gap-2">
        <span className="text-5xl">🍬</span>
        <p className="text-sm text-gray-400 text-center leading-relaxed">
          画像がありません<br />
          画像提供お願いします。
        </p>
      </div>
    )
  }

  return (
    <div>
      <div className="relative w-full aspect-square max-w-sm mx-auto md:mx-0 rounded-3xl overflow-hidden border-2 border-pink-100">
        <Image
          src={images[current].url}
          alt=""
          fill
          sizes="(max-width: 768px) 100vw, 320px"
          quality={90}
          className="object-contain"
        />
        {images.length > 1 && (
          <>
            <button
              onClick={() => setCurrent((p) => (p - 1 + images.length) % images.length)}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-white shadow"
            >
              ‹
            </button>
            <button
              onClick={() => setCurrent((p) => (p + 1) % images.length)}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-white shadow"
            >
              ›
            </button>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="flex gap-1.5 justify-center mt-2">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-2 h-2 rounded-full transition-colors ${i === current ? 'bg-pink-400' : 'bg-pink-200'}`}
            />
          ))}
        </div>
      )}

      {images[current].label && (
        <p className="text-center text-xs text-gray-400 mt-1">
          📸 {images[current].label}
        </p>
      )}
    </div>
  )
}
