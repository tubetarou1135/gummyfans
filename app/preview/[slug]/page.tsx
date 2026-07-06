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
        <h1 className="text-3xl font-bold text-gray-800 mb-2">{member.name}</h1>
        <a
          href={member.twitterUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-pink-400 hover:underline mb-6 inline-block"
        >
          {member.twitter}
        </a>

        <div className="border-t border-pink-50 pt-6 mt-2">
          <p className="text-sm text-gray-600 leading-relaxed">{member.description}</p>
        </div>

        <div className="mt-8 text-center">
          <a
            href={member.twitterUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border-2 border-pink-200 text-pink-500 px-6 py-3 rounded-full text-sm font-bold hover:bg-pink-50 transition-colors"
          >
            SNSをフォローする →
          </a>
        </div>
      </div>
    </main>
  )
}
