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

  // メーカー名が先頭にある場合は除去
  if (maker) {
    const escaped = maker.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    name = name.replace(new RegExp(`^${escaped}\\s*`, ''), '').trim()
  }

  return name
}

function isNG(name) {
  const ng = ['セット', 'まとめ', 'バケツ', 'ケース', '個入', '袋入', '詰め合わせ', '業務用', 'コストコ', '選べる', 'ポッキリ', '30袋', '50袋', '40袋', '24袋', '12袋', '72個', '10個', '6袋', '6個', 'シリコン', 'モールド', '型', '製氷', 'ハンドメイド', 'レジン', '石鹸', '石膏']
  return ng.some(w => name.includes(w))
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
      let d = ''
      res.on('data', c => d += c)
      res.on('end', () => resolve({ ok: res.statusCode < 300, body: JSON.parse(d) }))
    })
    req.on('error', reject)
    req.write(payload)
    req.end()
  })
}

async function searchBest(keyword) {
  const res = await httpsPost(
    `https://openapi.rakuten.co.jp/ichibams/api/IchibaItem/Search/20260401?accessKey=${encodeURIComponent(ACCESS_KEY)}&format=json`,
    { applicationId: APP_ID, accessKey: ACCESS_KEY, affiliateId: AFFILIATE_ID, keyword: keyword + ' グミ', hits: 10 }
  )
  if (!res.ok) throw new Error(JSON.stringify(res.body))
  const items = res.body.Items?.map(i => i.Item) ?? []
  return items.find(i => !isNG(i.itemName)) ?? null
}

// 登録リスト: [検索キーワード, メーカー, フレーバー]
const targets = [
  ['コロロ ぶどう', 'UHA味覚糖', 'ぶどう'],
  ['コロロ いちご', 'UHA味覚糖', 'いちご'],
  ['ピュレグミ レモン', 'カンロ', 'レモン'],
  ['果汁グミ ぶどう 明治', '明治', 'ぶどう'],
  ['果汁グミ いちご 明治', '明治', 'いちご'],
  ['果汁グミ もも 明治', '明治', 'もも'],
  ['グミサプリ ビタミンC UHA', 'UHA味覚糖', 'ビタミンC'],
]

// 既存商品名一覧を取得（重複チェック用）
const { data: existing } = await supabase.from('gummies').select('name')
const existingNames = new Set((existing ?? []).map(g => g.name))

let registered = 0
let skipped = 0

for (const [keyword, maker, flavor] of targets) {
  process.stdout.write(`🔍 ${keyword}... `)
  await new Promise(r => setTimeout(r, 2000)) // レート制限対策

  let item
  try {
    item = await searchBest(keyword)
  } catch (e) {
    console.log('❌ API エラー:', e.message)
    continue
  }

  if (!item) { console.log('候補なし'); skipped++; continue }

  const name = cleanName(item.itemName, maker)
  if (existingNames.has(name)) { console.log(`スキップ（登録済み: ${name}）`); skipped++; continue }

  const { error } = await supabase.from('gummies').insert({
    name,
    maker,
    flavor,
    description: null,
    image_url: item.largeImageUrls?.[0]?.imageUrl ?? item.mediumImageUrls?.[0]?.imageUrl ?? null,
    rakuten_url: item.itemUrl,
  })

  if (error) {
    console.log(`❌ 登録失敗: ${error.message}`)
  } else {
    console.log(`✅ ${name}`)
    existingNames.add(name)
    registered++
  }
}

console.log(`\n完了: ${registered}件登録 / ${skipped}件スキップ`)
