import { createClient } from '@supabase/supabase-js'
import * as readline from 'readline'
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

function httpsPost(url, body, headers) {
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
        ...headers,
      },
    }, res => {
      let data = ''
      res.on('data', chunk => data += chunk)
      res.on('end', () => resolve({ ok: res.statusCode < 300, status: res.statusCode, json: () => JSON.parse(data) }))
    })
    req.on('error', reject)
    req.write(payload)
    req.end()
  })
}

async function searchRakuten(keyword) {
  const res = await httpsPost(
    `https://openapi.rakuten.co.jp/ichibams/api/IchibaItem/Search/20260401?accessKey=${encodeURIComponent(ACCESS_KEY)}&format=json`,
    {
      applicationId: APP_ID,
      accessKey: ACCESS_KEY,
      affiliateId: AFFILIATE_ID,
      keyword: keyword + ' グミ',
      hits: 10,
    }
  )
  const data = res.json()
  if (!res.ok) throw new Error(JSON.stringify(data))
  return data.Items?.map(i => i.Item) ?? []
}

function ask(q) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
  return new Promise(resolve => rl.question(q, ans => { rl.close(); resolve(ans.trim()) }))
}

// セット・まとめ買い系を除外するフィルタ
function isGoodProduct(item) {
  const ng = ['セット', 'まとめ', '箱', '送料無料', 'ケース', '×', '個入', '袋入', '詰め合わせ']
  return !ng.some(word => item.itemName.includes(word))
}

async function main() {
  const keyword = process.argv[2] ?? 'ハリボー'
  console.log(`\n🔍 「${keyword}」で楽天検索中...\n`)

  let items
  try {
    items = await searchRakuten(keyword)
  } catch (e) {
    console.error('❌ API エラー:', e.message)
    process.exit(1)
  }

  // フィルタして上位5件表示
  const filtered = items.filter(isGoodProduct).slice(0, 5)
  if (filtered.length === 0) {
    console.log('候補が見つかりませんでした')
    process.exit(0)
  }

  filtered.forEach((item, i) => {
    console.log(`[${i + 1}] ${item.itemName}`)
    console.log(`    ショップ: ${item.shopName}  価格: ¥${item.itemPrice.toLocaleString()}`)
    console.log(`    画像: ${item.largeImageUrls?.[0]?.imageUrl ?? item.mediumImageUrls?.[0]?.imageUrl ?? 'なし'}`)
    console.log()
  })

  const choice = await ask('登録する番号を選んでください (1-5, スキップはEnter): ')
  if (!choice) { console.log('スキップしました'); process.exit(0) }

  const idx = parseInt(choice) - 1
  const selected = filtered[idx]
  if (!selected) { console.log('無効な番号です'); process.exit(1) }

  console.log(`\n選択: ${selected.itemName}`)
  const name = await ask(`商品名 [${selected.itemName}]: `) || selected.itemName
  const maker = await ask('メーカー [ハリボー]: ') || 'ハリボー'
  const flavor = await ask('フレーバー (なければEnter): ')
  const description = await ask('説明 (なければEnter): ')
  const imageUrl = selected.largeImageUrls?.[0]?.imageUrl ?? selected.mediumImageUrls?.[0]?.imageUrl ?? null

  const confirm = await ask(`\n登録しますか？ (y/N): `)
  if (confirm.toLowerCase() !== 'y') { console.log('キャンセルしました'); process.exit(0) }

  const { error } = await supabase.from('gummies').insert({
    name,
    maker,
    flavor: flavor || null,
    description: description || null,
    image_url: imageUrl,
    rakuten_url: selected.itemUrl,
  })

  if (error) {
    console.error('❌ 登録失敗:', error.message)
  } else {
    console.log('✅ 登録しました！')
  }
}

main()
