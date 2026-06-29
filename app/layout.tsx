import type { Metadata } from "next";
import { Nunito, Mochiy_Pop_One } from "next/font/google";
import Link from "next/link";
import Image from "next/image";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
});

const mochiy = Mochiy_Pop_One({
  variable: "--font-mochiy",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "gummyfans",
  description: "グミの評価・レビューサイト",
  icons: {
    icon: "/favicon.png",
  },
  openGraph: {
    title: "gummyfans",
    description: "グミの評価・レビューサイト",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={`${nunito.variable} ${mochiy.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col" style={{background: 'var(--background)', fontFamily: 'var(--font-mochiy), var(--font-nunito), sans-serif'}}>
        <header className="bg-white shadow-sm sticky top-0 z-10">
          <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-1 font-black tracking-tight shrink-0">
              <Image src="/favicon.png" alt="gummyfans" width={36} height={36} className="rounded-xl" />
              <span className="text-base sm:text-xl" style={{color:'#f472b6'}}>G</span>
              <span className="text-base sm:text-xl" style={{color:'#fb923c'}}>u</span>
              <span className="text-base sm:text-xl" style={{color:'#facc15'}}>m</span>
              <span className="text-base sm:text-xl" style={{color:'#4ade80'}}>m</span>
              <span className="text-base sm:text-xl" style={{color:'#60a5fa'}}>y</span>
              <span className="text-base sm:text-xl" style={{color:'#f472b6'}}>F</span>
              <span className="text-base sm:text-xl" style={{color:'#fb923c'}}>a</span>
              <span className="text-base sm:text-xl" style={{color:'#facc15'}}>n</span>
              <span className="text-base sm:text-xl" style={{color:'#4ade80'}}>s</span>
            </Link>
            <nav className="flex gap-1 sm:gap-2 text-xs sm:text-sm ml-2">
              <Link href="/ranking" className="bg-pink-50 text-pink-500 font-semibold px-3 sm:px-4 py-2 rounded-full hover:bg-pink-100 transition-colors whitespace-nowrap">
                ランキング
              </Link>
              <Link href="/request" className="bg-pink-500 text-white font-semibold px-3 sm:px-4 py-2 rounded-full hover:bg-pink-600 transition-colors whitespace-nowrap">
                ＋ 新グミ申請
              </Link>
            </nav>
          </div>
        </header>
        <div className="flex-1">{children}</div>
        <footer className="border-t border-pink-100 mt-12 py-6 text-center text-xs text-gray-400 space-x-4">
          <Link href="/contact" className="hover:text-pink-400 transition-colors">お問い合わせ</Link>
          <Link href="/privacy" className="hover:text-pink-400 transition-colors">プライバシーポリシー</Link>
          <Link href="/terms" className="hover:text-pink-400 transition-colors">利用規約</Link>
        </footer>
      </body>
    </html>
  );
}
