import Link from 'next/link'
import { members } from './members'

export const metadata = { robots: 'noindex,nofollow' }

export default function PreviewPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      {/* ヘッダー */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-black text-gray-800 leading-tight">
          <span className="text-pink-500">日本グミ協会</span>って何！？
        </h1>
      </div>

      {/* 日本グミ協会とは */}
      <section className="bg-pink-50 rounded-3xl p-8 mb-10">
        <h2 className="text-xl font-bold text-gray-800 mb-4">日本グミ協会とは</h2>
        <p className="text-sm text-gray-600 leading-relaxed mb-4">
          「グミが好きなら、あなたも今日から会員！」——そんな自由な精神のもと、2013年にSNS上の同人活動として誕生した非営利のグミ愛好家集団。
          手続きも審査も不要。グミが好きという気持ちだけで誰でも会員になれるのが最大の特徴で、
          2020年時点ですでに5,400名以上に会員証が発行されています。
        </p>
        <p className="text-sm text-gray-600 leading-relaxed mb-4">
          2016年には「マツコの知らない世界」への出演で一躍全国区に。
          その後、UHA味覚糖・カバヤ・カンロなど国内主要グミメーカーと連携し、
          業界横断の連合体「GUMMIT（グミット）」を結成。
          毎年9月3日「グミの日」を中心に、メーカーの垣根を越えた合同キャンペーンや
          公開イベント「グミパーティー」を展開しています。
        </p>
        <p className="text-sm text-gray-600 leading-relaxed mb-4">
          SNSでの新作グミ紹介、プレゼントキャンペーン、リアルイベントまで——
          グミ文化をボトムアップで広げ続けるユニークな存在です。
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
