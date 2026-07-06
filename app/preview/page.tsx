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
          className="inline-block hover:opacity-80 transition-opacity"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="https://93gummy.jp/_assets/images/logo.svg" alt="日本グミ協会" className="h-12" />
        </a>

        {/* 公式SNSバナー画像 */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <a href="https://twitter.com/japan_gummy" target="_blank" rel="noopener noreferrer">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://93gummy.jp/wp-content/uploads/2024/09/PC@japan_gummy.png" alt="@japan_gummy" className="w-full rounded-2xl hover:opacity-90 transition-opacity" />
          </a>
          <a href="https://www.instagram.com/gummy_japan/" target="_blank" rel="noopener noreferrer">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://93gummy.jp/_assets/images/sns_bnr_002_pc.png" alt="@gummy_japan" className="w-full rounded-2xl hover:opacity-90 transition-opacity" />
          </a>
        </div>
      </section>

      {/* 会員紹介 */}
      <section className="mb-10">
        <p className="text-center text-gray-700 font-bold text-lg mb-6">そんな日本グミ協会の著名な会長・会員様をまとめました！</p>
        <h2 className="text-xl font-bold text-gray-800 mb-6">著名会員紹介</h2>
        <div className="flex flex-col gap-4">
          {members.map((m) => (
            <Link
              key={m.slug}
              href={`/preview/${m.slug}`}
              className="flex items-center gap-6 border-2 border-pink-100 rounded-3xl p-6 hover:border-pink-300 hover:shadow-md transition-all bg-white"
            >
              <div className="shrink-0 w-16 text-center">
                {m.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={m.image} alt={m.name} className="w-14 h-14 rounded-full object-cover mx-auto mb-1 border-2 border-pink-100" />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-pink-50 mx-auto mb-1 flex items-center justify-center text-2xl">🍬</div>
                )}
                <p className="text-xs font-semibold text-pink-400">{m.title}</p>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-gray-800 mb-1">{m.name}</h3>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {m.sns.map((s) => (
                    <span key={s.label} className="text-xs bg-pink-50 text-pink-400 px-2 py-0.5 rounded-full">{s.icon} {s.label}</span>
                  ))}
                </div>
                <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{m.description}</p>
              </div>
              <p className="text-xs text-pink-400 font-semibold shrink-0">詳しく見る →</p>
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
