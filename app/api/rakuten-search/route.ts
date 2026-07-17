import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const keyword = req.nextUrl.searchParams.get('keyword') ?? ''
  const appId = process.env.NEXT_PUBLIC_RAKUTEN_APP_ID ?? ''
  const affiliateId = process.env.NEXT_PUBLIC_RAKUTEN_AFFILIATE_ID ?? ''

  if (!appId) {
    return NextResponse.json({ error: 'RAKUTEN_APP_ID not set', appId, affiliateId }, { status: 500 })
  }

  const params = new URLSearchParams({ applicationId: appId, affiliateId, keyword, hits: '20', format: 'json' })
  const url = `https://app.rakuten.co.jp/services/api/IchibaItem/Search/20170706?${params}`

  try {
    const res = await fetch(url)
    const data = await res.json()
    if (!res.ok) {
      return NextResponse.json({ error: 'Rakuten API error', status: res.status, data }, { status: 502 })
    }
    return NextResponse.json(data)
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
