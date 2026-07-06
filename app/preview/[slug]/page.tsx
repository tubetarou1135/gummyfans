import { members } from '../members'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export const metadata = { robots: 'noindex,nofollow' }

export default async function MemberPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const member = members.find((m) => m.slug === slug)
  if (!member) notFound()

  return (
    <main className="max-w-2xl mx-auto px-4 py-12">
      <Link href="/preview" className="text-pink-500 text-sm hover:underline mb-8 inline-block">
        ← 一覧に戻る
      </Link>

      <div className="bg-white border-2 border-pink-100 rounded-3xl p-8">
        <p className="text-xs font-semibold text-pink-400 tracking-widest mb-2">{member.title}</p>
        <h1 className="text-3xl font-bold text-gray-800 mb-6">{member.name}</h1>

        <div className="border-t border-pink-50 pt-6 mb-6">
          <p className="text-sm text-gray-600 leading-relaxed">{member.description}</p>
        </div>

        <div className="space-y-2">
          {member.sns.map((s) => (
            <a
              key={s.label}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 border-2 border-pink-100 rounded-2xl px-5 py-3 hover:border-pink-300 hover:bg-pink-50 transition-colors"
            >
              <span className="text-lg">{s.icon}</span>
              <span className="text-sm font-semibold text-gray-700">{s.label}</span>
              <span className="text-xs text-gray-400 ml-auto truncate">{s.url}</span>
            </a>
          ))}
        </div>
      </div>
    </main>
  )
}
