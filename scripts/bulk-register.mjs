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
const MOSHIMO_A_ID = process.env.NEXT_PUBLIC_MOSHIMO_A_ID

function toMoshimoUrl(itemUrl) {
  if (!MOSHIMO_A_ID || !itemUrl) return itemUrl
  return `https://af.moshimo.com/af/c/click?a_id=${MOSHIMO_A_ID}&p_id=54&pc_id=54&pl_id=616&url=${encodeURIComponent(itemUrl)}`
}

// 登録リスト（重複・除外済み）
const targets = [
  { maker: 'カンロ',      name: 'ピュレグミプレミアム',              flavor: '沖縄産パイナップル' },
  { maker: '明治',        name: '果汁グミSpecial',                  flavor: 'とちあいか' },
  { maker: 'ロッテ',      name: '小梅グミ',                         flavor: null },
  { maker: 'カバヤ',      name: 'かき氷グミ',                       flavor: null },
  { maker: 'ギンビス',    name: 'シャリっと食感たべっ子どうぶつグミ', flavor: 'マンゴー' },
  { maker: 'ノーベル',    name: 'ペタグーグミ',                     flavor: 'ソーダ' },
  { maker: 'カンロ',      name: 'ピュレグミ',                       flavor: 'すいすい塩スイカ' },
  { maker: 'ブルボン',    name: 'フェットチーネグミ PREMIUM',        flavor: '大分県産マリンレモン' },
  { maker: '不二家',      name: 'ガツン、とみかんグミ',              flavor: null },
  { maker: 'ブルボン',    name: 'しゃりもにグミ',                   flavor: 'りんご' },
  { maker: 'ノーベル',    name: 'シンサワーズグミ',                  flavor: 'ラムネ' },
  { maker: 'カンロ',      name: 'ピュレグミプレミアム',              flavor: '塩ライチ' },
  { maker: 'ノーベル',    name: '男梅グミ',                         flavor: null },
  { maker: '不二家',      name: 'アニメちいかわグミ',               flavor: 'むちゃうまヨーグルト' },
  { maker: '明治',        name: 'FRUBI by果汁グミ',                 flavor: 'ブルーベリー＆ザクロ' },
  { maker: '明治',        name: '果汁グミ',                         flavor: '推し味フルーツミックス' },
  { maker: 'クラシエ',    name: 'チュッパチャップス サワーバイトグミ', flavor: null },
  { maker: 'UHA味覚糖',   name: 'ぷにキャラグミ',                   flavor: 'ドンキーコング' },
  { maker: 'カバヤ',      name: 'タフグミ',                         flavor: 'グレフルフィーバー' },
  { maker: 'ノーベル',    name: 'SORBETグミ',                       flavor: null },
  { maker: 'UHA味覚糖',   name: 'むっちりグミ',                     flavor: 'サワーマスカット' },
  { maker: '明治',        name: '果汁グミ',                         flavor: 'ダークチェリーミックス' },
  { maker: 'ノーベル',    name: 'ペタグーグミ',                     flavor: 'グレープ' },
  { maker: 'カンロ',      name: 'マロッシュ',                       flavor: 'アップルサイダー' },
  { maker: 'ブルボン',    name: 'しゃりもにグミ',                   flavor: 'フルーティエナジードリンク' },
  { maker: 'ノーベル',    name: 'ソルベットグミ',                   flavor: '巨峰' },
  { maker: 'ローソン',    name: 'グミ学',                           flavor: 'ウマイパウダーの定理' },
  { maker: '明治',        name: 'FRUBI by果汁グミ',                 flavor: 'レモン＆キウイ' },
  { maker: 'クリート',    name: 'もちまるグミ',                     flavor: 'もちしゅわアソート' },
  { maker: 'ブルボン',    name: 'フェットチーネグミ',               flavor: 'ソーダ' },
  { maker: '春日井',      name: 'つぶグミ',                         flavor: 'ソーダ' },
  { maker: 'ノーベル',    name: 'キラふわグミ',                     flavor: 'ゴールデンパイン' },
  { maker: 'UHA味覚糖',   name: 'コグミ',                           flavor: null },
  { maker: '明治',        name: '果汁グミ',                         flavor: 'シチリアレモン' },
  { maker: 'ノーベル',    name: 'ソルベットグミ',                   flavor: 'シャインマスカット' },
  { maker: 'カバヤ',      name: 'すいかグミ',                       flavor: null },
  { maker: 'カンロ',      name: 'ピュレグミプレミアム',             flavor: '山形産佐藤錦' },
  { maker: '不二家',      name: '超レモンスカッシュグミ',           flavor: null },
  { maker: 'カンロ',      name: 'ザ・ストロンググミ',               flavor: 'グレープソーダ' },
  { maker: '明治',        name: '果汁グミ',                         flavor: 'すいか' },
  { maker: 'クリート',    name: '濃密マンゴーグミ',                 flavor: 'マンゴー' },
  { maker: 'ノースカラーズ', name: 'つぶもちグミ',                  flavor: 'ぶどう' },
  { maker: '日進乳業',    name: 'プラータチーズ風グミ',             flavor: '白桃' },
  { maker: 'カンロ',      name: 'ピタリアルグミ',                   flavor: 'ビターレモン' },
  { maker: 'カバヤ',      name: 'タフグミ',                         flavor: null },
  { maker: 'カンロ',      name: 'カンデミーナグミ',                 flavor: 'ストライクショット' },
  { maker: 'ギンビス',    name: 'シャリっと食感たべっ子どうぶつグミ', flavor: 'ピーチ' },
  { maker: 'カバヤ',      name: 'ピュアラルグミ',                   flavor: 'ぶどう' },
  { maker: 'ジェーシーシー', name: 'ナカミグミ',                    flavor: 'みかん' },
  { maker: 'カンロ',      name: 'カンデミーナグミ',                 flavor: 'スーパーベスト' },
  { maker: 'ブルボン',    name: 'しゃりもにグミ',                   flavor: 'ピーチ' },
  { maker: 'カバヤ',      name: 'タフグミ',                         flavor: 'ビッグバンピーチ' },
  { maker: 'ブルボン',    name: 'フェットチーネグミ',               flavor: 'コーラ' },
  { maker: '明治',        name: '果汁グミ',                         flavor: 'ぶどう' },
  { maker: '明治',        name: 'エッセルスーパーカップ超バニラ味グミ', flavor: '超バニラ' },
  { maker: 'セブン＆アイ', name: 'セブンプレミアム チョコっとグミ', flavor: '白桃' },
  { maker: 'ブルボン',    name: 'しゃりもにグミ',                   flavor: 'ヨーグルト' },
  { maker: '森永製菓',    name: 'グミチョコボール',                  flavor: '国産白桃' },
  { maker: 'クラシエ',    name: 'チュッパチャップス サワーチューブグミ', flavor: null },
  { maker: '不二家',      name: 'ポップグミ',                       flavor: null },
  { maker: 'クリート',    name: 'サクレパイングミ',                  flavor: 'パイン' },
  { maker: 'カバヤ',      name: 'しゃりinグミ',                     flavor: 'クリスタルピーチ' },
  { maker: '明治',        name: 'FRUBI by果汁グミ',                 flavor: 'ブルーベリー＆ザクロ' },
  { maker: 'UHA味覚糖',   name: 'グミだま',                         flavor: 'いちご' },
  { maker: 'ロッテ',      name: 'スイカ＆メロンバーグミ',           flavor: null },
  { maker: 'UHA味覚糖',   name: 'グンキ クールグミ',                flavor: null },
  { maker: 'ブルボン',    name: 'フェットチーネグミ',               flavor: 'アサイーボウル' },
  { maker: '明治',        name: '果汁グミ',                         flavor: 'いちご' },
  { maker: '明治',        name: '果汁グミ',                         flavor: 'もも' },
]

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

async function searchItem(name, flavor) {
  const keyword = flavor ? `${name} ${flavor} グミ` : `${name} グミ`
  await new Promise(r => setTimeout(r, 1000))
  const res = await httpsPost(
    `https://openapi.rakuten.co.jp/ichibams/api/IchibaItem/Search/20260401?accessKey=${encodeURIComponent(ACCESS_KEY)}&format=json`,
    { applicationId: APP_ID, accessKey: ACCESS_KEY, affiliateId: AFFILIATE_ID, keyword, hits: 5 }
  )
  if (!res.ok) return { image_url: null, rakuten_url: null }
  const item = res.body.Items?.[0]?.Item
  if (!item) return { image_url: null, rakuten_url: null }
  return {
    image_url: item.largeImageUrls?.[0]?.imageUrl ?? item.mediumImageUrls?.[0]?.imageUrl ?? null,
    rakuten_url: item.itemUrl ? toMoshimoUrl(item.itemUrl) : null,
  }
}

// 既存登録チェック
const { data: existing } = await supabase.from('gummies').select('name,flavor,maker')
const registeredSet = new Set((existing ?? []).map(g => `${g.maker}__${g.name}__${g.flavor ?? ''}`))

let registered = 0
let skipped = 0

for (const t of targets) {
  const key = `${t.maker}__${t.name}__${t.flavor ?? ''}`
  if (registeredSet.has(key)) {
    console.log(`⏭️  スキップ（登録済み）: ${t.maker} / ${t.name} / ${t.flavor ?? '不明'}`)
    skipped++
    continue
  }

  process.stdout.write(`🔍 ${t.name} ${t.flavor ?? ''}... `)
  const { image_url, rakuten_url } = await searchItem(t.name, t.flavor)

  const { error } = await supabase.from('gummies').insert({
    maker: t.maker,
    name: t.name,
    flavor: t.flavor,
    image_url,
    description: null,
    rakuten_url,
  })

  if (error) {
    console.log(`❌ ${error.message}`)
  } else {
    console.log(`✅ ${image_url ? '画像あり' : '画像なし'} ${rakuten_url ? '/ URL取得' : ''}`)
    registeredSet.add(key)
    registered++
  }
}

console.log(`\n完了: ${registered}件登録 / ${skipped}件スキップ`)
