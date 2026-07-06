import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import https from 'https'

const __dirname = dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: join(__dirname, '../.env.local') })

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
const APP_ID = process.env.NEXT_PUBLIC_RAKUTEN_APP_ID
const ACCESS_KEY = process.env.NEXT_PUBLIC_RAKUTEN_ACCESS_KEY
const AFFILIATE_ID = process.env.NEXT_PUBLIC_RAKUTEN_AFFILIATE_ID
const MAKER = 'UHA味覚糖'

// UHA味覚糖の主なグミ商品名
const PRODUCTS = [
  { name: 'コロロ',       search: 'UHA味覚糖 コロロ グミ' },
  { name: 'シゲキックス',  search: 'UHA味覚糖 シゲキックス グミ' },
  { name: '忍者めし',     search: 'UHA味覚糖 忍者めし グミ' },
  { name: '忍者めし鋼',   search: 'UHA味覚糖 忍者めし鋼 グミ' },
  { name: 'タフグミ',     search: 'UHA味覚糖 タフグミ' },
  { name: 'グミサンダー',  search: 'UHA グミサンダー' },
  { name: 'シゲキックスソフト', search: 'UHA シゲキックス ソフト グミ' },
  { name: '味覚糖グミ',   search: 'UHA味覚糖 グミ レモン' },
  { name: 'コロロ',       search: 'コロロ グミ いちご UHA' },
  { name: 'コロロ',       search: 'コロロ グミ 白桃 UHA' },
  { name: 'コロロ',       search: 'コロロ グミ マンゴー UHA' },
  { name: 'コロロ',       search: 'コロロ グミ りんご UHA' },
  { name: 'コロロ',       search: 'コロロ グミ もも UHA' },
  { name: 'コロロ',       search: 'コロロ グミ メロン UHA' },
  { name: 'コロロ',       search: 'コロロ グミ ライチ UHA' },
  { name: 'シゲキックス',  search: 'シゲキックス グミ レモン UHA' },
  { name: 'シゲキックス',  search: 'シゲキックス グミ いちご UHA' },
  { name: 'シゲキックス',  search: 'シゲキックス グミ青りんご UHA' },
  { name: '忍者めし',     search: '忍者めし グミ いちご UHA' },
  { name: '忍者めし',     search: '忍者めし グミ もも UHA' },
]

// NG判定
function isNG(name) {
  const ng = ['セット', 'まとめ', 'バケツ', 'ケース', '詰め合わせ', '業務用', 'コストコ', '選べる',
    '30袋', '50袋', '40袋', '24袋', '12袋', '6袋', '10個', '72個', 'シリコン', 'モールド',
    '型', '製氷', 'ハンドメイド', 'レジン', '石鹸', 'サプリ', 'ビタミン', '医薬']
  return ng.some(w => name.includes(w))
}

// 余分なテキスト除去してフレーバーを抽出
function extractFlavor(rawName, productName) {
  let s = rawName
    .replace(/＜[^＞]*＞/g, '')   // ＜賞味期限：...＞
    .replace(/<[^>]*>/g, '')       // <...>
    .replace(/【[^】]*】/g, '')
    .replace(/「[^」]*」/g, '')
    .replace(/\([^)]*\)/g, '')
    .replace(/（[^）]*）/g, '')
    .replace(/UHA味覚糖/g, '')
    .replace(new RegExp(productName, 'g'), '')
    .replace(/グミ/g, '')
    .replace(/飴|タブレット|お菓子|キャンディ/g, '')
    .replace(/\d+g[×x×]\d+[袋個枚本箱]/g, '')
    .replace(/\d+[袋個枚本箱]入?/g, '')
    .replace(/\d+g/g, '')
    .replace(/\d+粒/g, '')
    .replace(/\d+本/g, '')
    .replace(/×\d+BOX/g, '')
    .replace(/×1BOX/g, '')
    .replace(/1BOX/g, '')
    .replace(/メール便/g, '')
    .replace(/送料無料/g, '')
    .replace(/ネコポス/g, '')
    .replace(/まとめ買い/g, '')
    .replace(/ハード/g, '')
    .replace(/激(?=\s)/g, '')   // 「激 」を除去（「激レモン」などは残す）
    .replace(/[|｜]/g, '')
    .replace(/\s{2,}/g, ' ')
    .trim()
  return s || null
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

// 登録済み取得
const { data: existing } = await supabase.from('gummies').select('name,flavor').eq('maker', MAKER)
const registeredSet = new Set((existing ?? []).map(g => `${g.name}__${g.flavor ?? ''}`))

console.log(`\n=== UHA味覚糖 グミ候補 ===`)
console.log(`登録済み除外: ${registeredSet.size}件\n`)

const candidates = []

for (const { name: productName, search } of PRODUCTS) {
  await new Promise(r => setTimeout(r, 1500))
  const res = await httpsPost(
    `https://openapi.rakuten.co.jp/ichibams/api/IchibaItem/Search/20260401?accessKey=${encodeURIComponent(ACCESS_KEY)}&format=json`,
    { applicationId: APP_ID, accessKey: ACCESS_KEY, affiliateId: AFFILIATE_ID, keyword: search, hits: 30 }
  )
  if (!res.ok) { console.log(`❌ ${productName}: API エラー`); continue }

  const items = res.body.Items?.map(i => i.Item) ?? []
  const seen = new Set()
  const noiseWords = ['入', '袋', '全国', 'のど', 'ダイエット', '式', 'フルーツ', 'BOX']

  for (const item of items) {
    if (isNG(item.itemName)) continue
    const flavor = extractFlavor(item.itemName, productName)
    if (!flavor || flavor.length > 15) continue
    if (noiseWords.some(w => flavor.includes(w))) continue
    const key = `${productName}__${flavor}`
    if (seen.has(key) || registeredSet.has(key)) continue
    seen.add(key)
    candidates.push({
      name: productName,
      flavor,
      image_url: item.largeImageUrls?.[0]?.imageUrl ?? item.mediumImageUrls?.[0]?.imageUrl ?? null,
      rakuten_url: item.itemUrl,
    })
  }
}

console.log(`候補 ${candidates.length}件:\n`)
candidates.forEach((c, i) => {
  console.log(`${i + 1}. 商品名:${c.name} / フレーバー:${c.flavor}`)
})

// JSONで保存（次のステップで使う）
import { writeFileSync } from 'fs'
writeFileSync(join(__dirname, 'uha-candidates.json'), JSON.stringify(candidates, null, 2))
console.log(`\n→ uha-candidates.json に保存しました`)
