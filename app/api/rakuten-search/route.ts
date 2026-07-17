import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const keyword = req.nextUrl.searchParams.get('keyword') ?? ''
  const appId = process.env.NEXT_PUBLIC_RAKUTEN_APP_ID ?? ''
  const affiliateId = process.env.NEXT_PUBLIC_RAKUTEN_AFFILIATE_ID ?? ''

  const params = new URLSearchParams({ applicationId: appId, affiliateId, keyword, hits: '20', format: 'json' })
  const res = await fetch(`https://app.rakuten.co.jp/services/api/IchibaItem/Search/20170706?${params}`)
  const data = await res.json()

  return NextResponse.json(data)
}
