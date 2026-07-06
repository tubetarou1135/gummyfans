import Link from 'next/link'
import { members } from './members'

export const metadata = { robots: 'noindex,nofollow' }

export default function PreviewPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      {/* ヘッダー */}
      <div className="text-center mb-12">
        <p className="text-xs font-semibold text-pink-400 tracking-widest mb-2">SPECIAL PREVIEW</p>
        <h1 className="text-3xl font-bold text-gray-800 mb-4">日本グミ協会 × GummyFans</h1>
        <p className="text-sm text-gray-500 leading-relaxed">
          グミファンズは、日本最大級のグミレビューサイトです。<br />
          この度、<a href="https://93gummy.jp/" target="_blank" rel="noopener noreferrer" className="text-pink-500 hover:underline font-semibold">日本グミ協会</a>との連携に向けて、<br />
          特別プレビューページをご用意いたしました。
        </p>
      </div>

      {/* 日本グミ協会とは */}
      <section className="bg-pink-50 rounded-3xl p-8 mb-10">
        <h2 className="text-xl font-bold text-gray-800 mb-4">日本グミ協会とは</h2>
        <p className="text-sm text-gray-600 leading-relaxed mb-4">
          2013年にSNS上の同人活動としてスタートした、グミ愛好家たちによる非営利団体。
          「コンビニに売っている100円グミのボトムアップ」を目的に設立され、
          2016年にはテレビ番組「マツコの知らない世界」に出演し、一気に全国的な注目を集めました。
        </p>
        <p className="text-sm text-gray-600 leading-relaxed mb-4">
          9月3日を「グミの日」として制定し、UHA味覚糖・カバヤ・カンロなどメーカー各社が参加する連合体
          「GUMMIT（グミット）」を結成。メーカーの垣根を超えた共同キャンペーンやイベントを展開しています。
        </p>
        <a
          href="https://93gummy.jp/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-sm font-semibold text-pink-500 hover:underline"
        >
          詳しくはこちら →
        </a>
      </section>

      {/* 会員紹介 */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-800 mb-6">著名会員紹介</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {members.map((m) => (
            <Link
              key={m.slug}
              href={`/preview/${m.slug}`}
              className="block border-2 border-pink-100 rounded-3xl p-6 hover:border-pink-300 hover:shadow-md transition-all bg-white"
            >
              <p className="text-xs font-semibold text-pink-400 mb-1">{m.title}</p>
              <h3 className="text-lg font-bold text-gray-800 mb-1">{m.name}</h3>
              <p className="text-xs text-gray-400 mb-3">{m.twitter}</p>
              <p className="text-xs text-gray-500 leading-relaxed line-clamp-3">{m.description}</p>
              <p className="text-xs text-pink-400 mt-3 font-semibold">詳しく見る →</p>
            </Link>
          ))}
        </div>
      </section>

      {/* GummyFans紹介 */}
      <section className="border-2 border-pink-100 rounded-3xl p-8 text-center">
        <h2 className="text-xl font-bold text-gray-800 mb-3">GummyFans について</h2>
        <p className="text-sm text-gray-500 leading-relaxed mb-4">
          880種類以上のグミを掲載した日本最大級のグミレビューサイト。<br />
          硬さ・甘さ・酸っぱさ・果汁感など、独自の指標でグミを評価。<br />
          ユーザーによるレビュー・画像投稿機能も備えています。
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-pink-500 text-white px-6 py-3 rounded-full text-sm font-bold hover:bg-pink-600 transition-colors"
        >
          GummyFansを見る →
        </Link>
      </section>
    </main>
  )
}
