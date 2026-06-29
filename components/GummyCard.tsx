import Link from 'next/link'
import type { GummyWithAvg } from '@/lib/database.types'
import StarRating from './StarRating'

function ScoreItem({ label, value }: { label: string; value: number | null }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-[10px] text-gray-400 leading-none mb-0.5">{label}</span>
      <span className="text-xs font-bold text-pink-500">
        {value != null ? value.toFixed(1) : '—'}
      </span>
    </div>
  )
}

export default function GummyCard({ gummy }: { gummy: GummyWithAvg }) {
  const hasReview = gummy.avg_overall != null

  return (
    <Link
      href={`/gummy/${gummy.id}`}
      className="block border-2 border-pink-100 rounded-3xl p-4 hover:shadow-lg hover:border-pink-300 transition-all bg-white"
    >
      <div className="flex gap-3 items-center">
        {/* 左：名前・メーカー */}
        <div className="flex-1 min-w-0">
          <h2 className="font-bold text-gray-800 text-lg leading-tight truncate">{gummy.name}</h2>
          <p className="text-xs text-gray-500 mt-0.5 truncate">
            {gummy.maker}{gummy.flavor && ` / ${gummy.flavor}`}
          </p>
          {!hasReview && (
            <span className="text-xs text-gray-400 mt-1 block">まだレビューなし</span>
          )}
        </div>

        {/* 右：スコアグリッド */}
        {hasReview && (
          <div className="shrink-0 flex flex-col items-center gap-1.5">
            <ScoreItem label="総合" value={gummy.avg_overall} />
            <StarRating value={Math.round(gummy.avg_overall ?? 0)} readonly size="sm" />
            <div className="grid grid-cols-2 gap-x-3 gap-y-1">
              <ScoreItem label="硬さ" value={gummy.avg_hardness} />
              <ScoreItem label="甘さ" value={gummy.avg_sweetness} />
              <ScoreItem label="酸っぱさ" value={gummy.avg_sourness} />
              <ScoreItem label="コスパ" value={gummy.avg_value} />
            </div>
            <span className="text-[10px] text-gray-300">({gummy.review_count}件)</span>
          </div>
        )}
      </div>
    </Link>
  )
}
