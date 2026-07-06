import Image from 'next/image'

export default function AboutPage() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-8">運営者情報</h1>
      <div className="mb-6">
        <Image src="/グミ会員.png" alt="グミ会員" width={400} height={400} className="mx-auto rounded-2xl" />
      </div>

      <div className="space-y-6 text-sm text-gray-700 leading-relaxed">
        <div className="border-2 border-pink-100 rounded-2xl overflow-hidden">
          {[
            { label: 'サイト名', value: 'グミファンズ-GummyFans-' },
            { label: '運営者', value: 'GummyFans管理人' },
            { label: '運営目的', value: 'グミの魅力を広めるための情報・レビューサイト' },
            { label: 'お問い合わせ', value: 'お問い合わせページよりご連絡ください' },
          ].map(({ label, value }, i, arr) => (
            <div
              key={label}
              className={`flex gap-4 px-5 py-4 ${i !== arr.length - 1 ? 'border-b border-pink-50' : ''}`}
            >
              <span className="text-gray-400 w-28 shrink-0">{label}</span>
              <span className="text-gray-700">{value}</span>
            </div>
          ))}
          <div className="flex gap-4 px-5 py-4 border-t border-pink-50">
            <span className="text-gray-400 w-28 shrink-0">公式SNS</span>
            <div className="flex gap-3">
              <a href="https://x.com/GummyFans9393" target="_blank" rel="noopener noreferrer"
                className="text-pink-500 hover:underline font-semibold">𝕏 @GummyFans9393</a>
              <a href="https://www.instagram.com/gummyfans9393/" target="_blank" rel="noopener noreferrer"
                className="text-pink-500 hover:underline font-semibold">📸 @gummyfans9393</a>
            </div>
          </div>
        </div>

        <p className="text-xs text-gray-400">
          当サイトはグミを愛するすべての人に向けた非公式のレビューサイトです。
        </p>
      </div>
    </main>
  )
}
