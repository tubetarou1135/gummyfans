import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import https from 'https'

const __dirname = dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: join(__dirname, '../.env.local') })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

const APP_ID = process.env.NEXT_PUBLIC_RAKUTEN_APP_ID
const ACCESS_KEY = process.env.NEXT_PUBLIC_RAKUTEN_ACCESS_KEY
const AFFILIATE_ID = process.env.NEXT_PUBLIC_RAKUTEN_AFFILIATE_ID

// 商品名を整形する
function cleanName(raw, maker = '') {
  let name = raw
    .replace(/【[^】]*】/g, '')
    .replace(/「[^」]*」/g, '')
    .replace(/\([^)]*\)/g, '')
    .replace(/\d+g[×x×]\d+[袋個枚本箱]/g, '')
    .replace(/\d+[袋個枚本箱]入/g, '')
    .replace(/\d+g/g, '')
    .replace(/\d+日分/g, '')
    .replace(/送料無料/g, '')
    .replace(/ネコポス/g, '')
    .replace(/全国/g, '')
    .replace(/[|｜]/g, '')
    .replace(/\s{2,}/g, ' ')
    .trim()

  if (maker) {
    const escaped = maker.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    name = name.replace(new RegExp(`^${escaped}\\s*`, ''), '').trim()
  }

  return name
}

function httpsPost(url, body) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url)
    const payload = JSON.stringify(body)
    const req = https.request({
      hostname: parsed.hostname,
      path: parsed.pathname + parsed.search,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload),
        'Referer': 'https://gummyfans.vercel.app/admin',
        'Origin': 'https://gummyfans.vercel.app',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/149.0.0.0 Safari/537.36',
      },
    }, res => {
      let data = ''
      res.on('data', chunk => data += chunk)
      res.on('end', () => resolve({ ok: res.statusCode < 300, status: res.statusCode, body: JSON.parse(data) }))
    })
    req.on('error', reject)
    req.write(payload)
    req.end()
  })
}

// キーワード検索してN番目を登録
const keyword = process.argv[2]
const pickIndex = parseInt(process.argv[3] ?? '0')  // 0始まり
const maker = process.argv[4] ?? ''
const flavor = process.argv[5] ?? ''

if (!keyword) {
  console.log('使い方: node register-one.mjs <キーワード> <番号(0始まり)> <メーカー> [フレーバー]')
  process.exit(1)
}

const res = await httpsPost(
  `https://openapi.rakuten.co.jp/ichibams/api/IchibaItem/Search/20260401?accessKey=${encodeURIComponent(ACCESS_KEY)}&format=json`,
  { applicationId: APP_ID, accessKey: ACCESS_KEY, affiliateId: AFFILIATE_ID, keyword: keyword + ' グミ', hits: 10 }
)

if (!res.ok) { console.error('❌ API エラー:', JSON.stringify(res.body)); process.exit(1) }

const items = res.body.Items?.map(i => i.Item) ?? []
const item = items[pickIndex]
if (!item) { console.error('❌ 指定番号の商品が見つかりません'); process.exit(1) }

console.log('登録する商品:')
console.log('  名前:', item.itemName)
console.log('  ショップ:', item.shopName)
console.log('  価格:', item.itemPrice)
console.log('  画像:', item.largeImageUrls?.[0]?.imageUrl ?? item.mediumImageUrls?.[0]?.imageUrl)

const cleanedName = cleanName(item.itemName, maker)
console.log('  整形後名前:', cleanedName)

const { error } = await supabase.from('gummies').insert({
  name: cleanedName,
  maker: maker || item.shopName,
  flavor: flavor || null,
  description: null,
  image_url: item.largeImageUrls?.[0]?.imageUrl ?? item.mediumImageUrls?.[0]?.imageUrl ?? null,
  rakuten_url: item.itemUrl,
})

if (error) {
  console.error('❌ 登録失敗:', error.message)
} else {
  console.log('✅ 登録完了！')
}
