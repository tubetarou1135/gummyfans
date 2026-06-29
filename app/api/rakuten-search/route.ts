import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get('query')
  if (!query) return NextResponse.json({ error: 'query required' }, { status: 400 })

  const appId = process.env.RAKUTEN_APP_ID
  const accessKey = process.env.RAKUTEN_ACCESS_KEY
  const affiliateId = process.env.RAKUTEN_AFFILIATE_ID

  const body = {
    applicationId: appId,
    accessKey: accessKey,
    affiliateId: affiliateId,
    keyword: query + ' グミ',
    format: 'json',
    httpReferrer: 'https://gummyfans.vercel.app/',
    hits: 20,
  }

  const res = await fetch('https://openapi.rakuten.co.jp/ichibams/api/IchibaItem/Search/20260401', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Referer: 'https://gummyfans.vercel.app/',
    },
    body: JSON.stringify(body),
  })
  const data = await res.json()

  if (!res.ok) {
    return NextResponse.json(data, { status: res.status })
  }

  return NextResponse.json(data)
}
