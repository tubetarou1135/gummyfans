import { NextRequest, NextResponse } from 'next/server'

const ACCESS_KEY = 'pk_NqeOiyYlRyXKylDuyJVo13T1KJ3JieoYoPAmH8Uvg48'
const APP_ID = 'beef9ec2-6740-42ab-a5ee-5926c52a4742'

export async function GET(req: NextRequest) {
  const keyword = req.nextUrl.searchParams.get('keyword') ?? ''
  const affiliateId = process.env.NEXT_PUBLIC_RAKUTEN_AFFILIATE_ID ?? ''

  const params = new URLSearchParams({
    applicationId: APP_ID,
    accessKey: ACCESS_KEY,
    affiliateId,
    keyword,
    hits: '20',
    format: 'json',
  })

  try {
    const res = await fetch(
      `https://openapi.rakuten.co.jp/ichibams/api/IchibaItem/Search/20260701?${params}`,
      { method: 'GET' }
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
