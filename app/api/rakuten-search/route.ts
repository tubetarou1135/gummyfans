import { NextRequest, NextResponse } from 'next/server'

const ACCESS_KEY = 'pk_NqeOiyYlRyXKylDuyJVo13T1KJ3JieoYoPAmH8Uvg48'

export async function GET(req: NextRequest) {
  const keyword = req.nextUrl.searchParams.get('keyword') ?? ''
  const affiliateId = process.env.NEXT_PUBLIC_RAKUTEN_AFFILIATE_ID ?? ''

  try {
    const res = await fetch(
      `https://openapi.rakuten.co.jp/ichibams/api/IchibaItem/Search/20260401?accessKey=${ACCESS_KEY}&format=json`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Referer': 'https://www.gummyfans.jp/',
        },
        body: JSON.stringify({ applicationId: ACCESS_KEY, accessKey: ACCESS_KEY, affiliateId, keyword, hits: 20 }),
      }
    )
    const data = await res.json()
    if (!res.ok) {
      return NextResponse.json({ error: 'Rakuten API error', status: res.status, data }, { status: 502 })
    }
    return NextResponse.json(data)
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
