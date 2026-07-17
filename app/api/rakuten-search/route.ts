import { NextRequest, NextResponse } from 'next/server'
import https from 'https'

const ACCESS_KEY = 'pk_NqeOiyYlRyXKylDuyJVo13T1KJ3JieoYoPAmH8Uvg48'

export async function GET(req: NextRequest) {
  const keyword = req.nextUrl.searchParams.get('keyword') ?? ''
  const affiliateId = process.env.NEXT_PUBLIC_RAKUTEN_AFFILIATE_ID ?? ''

  const body = JSON.stringify({
    applicationId: ACCESS_KEY,
    accessKey: ACCESS_KEY,
    affiliateId,
    keyword,
    hits: 20,
    httpReferrer: 'https://www.gummyfans.jp/',
  })

  return new Promise<NextResponse>((resolve) => {
    const options = {
      hostname: 'openapi.rakuten.co.jp',
      path: `/ichibams/api/IchibaItem/Search/20260401?accessKey=${encodeURIComponent(ACCESS_KEY)}&format=json`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
        'Referer': 'https://www.gummyfans.jp/',
      },
    }

    const nodeReq = https.request(options, (res) => {
      let data = ''
      res.on('data', (chunk) => { data += chunk })
      res.on('end', () => {
        try {
          const json = JSON.parse(data)
          if ((res.statusCode ?? 200) >= 400) {
            resolve(NextResponse.json({ error: 'Rakuten API error', status: res.statusCode, data: json }, { status: 502 }))
          } else {
            resolve(NextResponse.json(json))
          }
        } catch {
          resolve(NextResponse.json({ error: 'parse error', raw: data }, { status: 502 }))
        }
      })
    })

    nodeReq.on('error', (err) => {
      resolve(NextResponse.json({ error: String(err) }, { status: 500 }))
    })

    nodeReq.write(body)
    nodeReq.end()
  })
}
