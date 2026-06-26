import Link from 'next/link'
import type { GummyWithAvg } from '@/lib/database.types'
import StarRating from './StarRating'

export default function GummyCard({ gummy }: { gummy: GummyWithAvg }) {
  return (
    <Link
      href={`/gummy/${gummy.id}`}
      className="block border-2 border-pink-100 rounded-3xl p-5 hover:shadow-lg hover:border-pink-300 transition-all bg-white"
    >
      <div className="flex justify-between items-start mb-1">
        <h2 className="font-semibold text-gray-800 text-base leading-tight">{gummy.name}</h2>
        {gummy.avg_overall != null && (
          <span className="text-sm font-bold text-pink-500 ml-2 whitespace-nowrap">
            {gummy.avg_overall}
          </span>
        )}
      </div>
      <p className="text-xs text-gray-500 mb-2">
        {gummy.maker}
        {gummy.flavor && ` / ${gummy.flavor}`}
      </p>
      {gummy.avg_overall != null ? (
        <div className="flex items-center gap-1">
          <StarRating value={Math.round(gummy.avg_overall)} readonly size="sm" />
          <span className="text-xs text-gray-400">({gummy.review_count}件)</span>
        </div>
      ) : (
        <span className="text-xs text-gray-400">まだレビューなし</span>
      )}
      {gummy.description && (
        <p className="text-xs text-gray-600 mt-2 line-clamp-2">{gummy.description}</p>
      )}
    </Link>
  )
}
