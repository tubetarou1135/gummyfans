import Link from 'next/link'
import Image from 'next/image'
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
      {/* 商品画像 */}
      {gummy.image_url && (
        <div className="relative w-full aspect-[3/2] rounded-2xl overflow-hidden mb-3 bg-pink-50">
          <Image src={gummy.image_url} alt={gummy.name} fill className="object-contain" />
        </div>
      )}

      {/* 名前・メーカー */}
      <h2 className="font-bold text-gray-800 text-base leading-tight">{gummy.name}</h2>
      <p className="text-xs text-gray-500 mt-0.5 truncate">
        {gummy.maker}{gummy.flavor && ` / ${gummy.flavor}`}
      </p>

      {hasReview ? (
        <div className="mt-2 space-y-2">
          {/* 総合評価 */}
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-pink-500">{gummy.avg_overall?.toFixed(1)}</span>
            <div>
              <StarRating value={Math.round(gummy.avg_overall ?? 0)} readonly size="sm" />
              <span className="text-[10px] text-gray-300">({gummy.review_count}件)</span>
            </div>
          </div>
          {/* サブスコア */}
          <div className="grid grid-cols-4 gap-1 border-t border-pink-50 pt-2">
            <ScoreItem label="硬さ" value={gummy.avg_hardness} />
            <ScoreItem label="甘さ" value={gummy.avg_sweetness} />
            <ScoreItem label="酸っぱさ" value={gummy.avg_sourness} />
            <ScoreItem label="果汁感" value={gummy.avg_value} />
          </div>
        </div>
      ) : (
        <span className="text-xs text-gray-400 mt-1 block">まだレビューなし</span>
      )}
    </Link>
  )
}
