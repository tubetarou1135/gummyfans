export default function PrivacyPage() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-8">プライバシーポリシー</h1>

      <div className="space-y-8 text-sm text-gray-700 leading-relaxed">
        <section>
          <h2 className="font-bold text-base text-gray-800 mb-2">1. 個人情報の取得について</h2>
          <p>当サイト（gummyfans）は、お問い合わせフォームのご利用時にお名前・メールアドレス・お問い合わせ内容を取得します。</p>
        </section>

        <section>
          <h2 className="font-bold text-base text-gray-800 mb-2">2. 個人情報の利用目的</h2>
          <p>取得した個人情報は、お問い合わせへの返答のみに使用し、第三者への提供は行いません。</p>
        </section>

        <section>
          <h2 className="font-bold text-base text-gray-800 mb-2">3. Cookieおよびアクセス解析について</h2>
          <p>当サイトでは、サービス改善を目的としてアクセス解析ツールを使用する場合があります。これらのツールはCookieを使用してデータを収集しますが、個人を特定する情報は含まれません。</p>
        </section>

        <section>
          <h2 className="font-bold text-base text-gray-800 mb-2">4. 広告について</h2>
          <p>当サイトは、将来的にGoogle AdSense等の広告配信サービスおよびアフィリエイトプログラムを使用する予定です。これらの広告配信事業者はCookieを使用して、ユーザーの興味に応じた広告を表示する場合があります。</p>
        </section>

        <section>
          <h2 className="font-bold text-base text-gray-800 mb-2">5. ユーザー提供画像について</h2>
          <p>当サイトに掲載されている商品画像は、ユーザーの皆様からご提供いただいたものです。掲載画像の著作権は各投稿者に帰属します。当サイトは提供いただいた画像を商品紹介目的にのみ使用します。</p>
        </section>

        <section>
          <h2 className="font-bold text-base text-gray-800 mb-2">6. お問い合わせ</h2>
          <p>プライバシーポリシーに関するご質問は、<a href="/contact" className="text-pink-500 underline">お問い合わせページ</a>よりご連絡ください。</p>
        </section>

        <p className="text-xs text-gray-400">最終更新日：2026年6月29日</p>
      </div>
    </main>
  )
}
