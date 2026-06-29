import * as dotenv from 'dotenv'
import https from 'https'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: join(__dirname, '../.env.local') })

const APP_ID = process.env.NEXT_PUBLIC_RAKUTEN_APP_ID
const ACCESS_KEY = process.env.NEXT_PUBLIC_RAKUTEN_ACCESS_KEY
const AFFILIATE_ID = process.env.NEXT_PUBLIC_RAKUTEN_AFFILIATE_ID
const keyword = process.argv[2] ?? 'ハリボー'

const payload = JSON.stringify({ applicationId: APP_ID, accessKey: ACCESS_KEY, affiliateId: AFFILIATE_ID, keyword: keyword + ' グミ', hits: 10 })
const parsed = new URL(`https://openapi.rakuten.co.jp/ichibams/api/IchibaItem/Search/20260401?accessKey=${encodeURIComponent(ACCESS_KEY)}&format=json`)
const req = https.request({
  hostname: parsed.hostname, path: parsed.pathname + parsed.search, method: 'POST',
  headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(payload), 'Referer': 'https://gummyfans.vercel.app/admin', 'Origin': 'https://gummyfans.vercel.app', 'User-Agent': 'Mozilla/5.0' }
}, res => {
  let d = ''
  res.on('data', c => d += c)
  res.on('end', () => {
    const data = JSON.parse(d)
    data.Items?.forEach((i, idx) => console.log(`[${idx}] ${i.Item.itemName} / ¥${i.Item.itemPrice}`))
  })
})
req.write(payload)
req.end()
