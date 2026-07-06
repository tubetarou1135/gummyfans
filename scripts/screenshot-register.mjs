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

// スクリーンショット300-318から抽出した商品リスト
const targets = [
  // 森永製菓
  { maker: '森永製菓',    name: 'ヘルシースナッキング',        flavor: 'つぶつぶグレープ' },
  // UHA味覚糖
  { maker: 'UHA味覚糖',  name: 'ぷっちょグミ',               flavor: 'いちご＆ホワイトソーダ' },
  { maker: 'UHA味覚糖',  name: 'シゲキックス グミガーム',     flavor: 'エナジーミント' },
  { maker: 'UHA味覚糖',  name: 'グミガーム',                  flavor: 'ストロングソーダ' },
  { maker: 'UHA味覚糖',  name: 'コロロ GUMMIT',              flavor: '瀬戸内レモン' },
  { maker: 'UHA味覚糖',  name: '勝ちグミ',                   flavor: 'もも' },
  { maker: 'UHA味覚糖',  name: '至福の桃グミ',               flavor: null },
  { maker: 'UHA味覚糖',  name: '山形グミ',                   flavor: 'おきたまデラウェア' },
  { maker: 'UHA味覚糖',  name: '三ツ星いちご スカイベリーグミ', flavor: null },
  { maker: 'UHA味覚糖',  name: 'リセットレモングミ',          flavor: null },
  { maker: 'UHA味覚糖',  name: 'リコぷにグミ',               flavor: null },
  { maker: 'UHA味覚糖',  name: 'むっちりグミ',               flavor: '乳酸菌ドリンク' },
  { maker: 'UHA味覚糖',  name: 'むっちりグミ',               flavor: 'ありまサイダー&コーラ' },
  { maker: 'UHA味覚糖',  name: 'ながーいさけるグミ',          flavor: 'レモン' },
  { maker: 'UHA味覚糖',  name: 'ながーいさけるグミ',          flavor: 'ピーチ' },
  { maker: 'UHA味覚糖',  name: 'ながーいさけるグミ',          flavor: 'グレープ' },
  { maker: 'UHA味覚糖',  name: 'とろけるグミ',               flavor: 'コーラ' },
  { maker: 'UHA味覚糖',  name: 'つむグミ',                   flavor: 'ブロック' },
  // カンロ
  { maker: 'カンロ',     name: 'プチピュレグミ',              flavor: 'レモン' },
  { maker: 'カンロ',     name: 'ピュレグミ',                  flavor: 'アソートパック' },
  { maker: 'カンロ',     name: 'ピュレグミ',                  flavor: 'プチ三角いちご' },
  { maker: 'カンロ',     name: 'ピュレグミ',                  flavor: 'ピンクレモネード' },
  { maker: 'カンロ',     name: 'パート・ド・フリュイグミ',    flavor: 'フランボワーズ' },
  { maker: 'カンロ',     name: 'ギガンツグミ',               flavor: '濃厚エナジーソーダ' },
  { maker: 'カンロ',     name: '食べタネグミ',               flavor: '梅干し' },
  // カバヤ
  { maker: 'カバヤ',     name: 'ふってふってグミ',            flavor: 'メロン' },
  { maker: 'カバヤ',     name: 'ピュアラルグミ',              flavor: 'みかん' },
  { maker: 'カバヤ',     name: 'ピュアラルグミ',              flavor: 'ふじりんご' },
  { maker: 'カバヤ',     name: 'ピュアラルグミ',              flavor: 'ピーチ' },
  { maker: 'カバヤ',     name: 'シャリルグミ',               flavor: 'りんご' },
  { maker: 'カバヤ',     name: 'こびとづかんグミ',            flavor: null },
  { maker: 'カバヤ',     name: 'はちみつレモングミ',          flavor: null },
  { maker: 'カバヤ',     name: 'タフグミ',                   flavor: 'フルーツ' },
  // ブルボン
  { maker: 'ブルボン',   name: 'フェットチーネグミ',          flavor: '梨' },
  { maker: 'ブルボン',   name: 'フェットチーネグミ',          flavor: 'レモンスカッシュ' },
  { maker: 'ブルボン',   name: 'フェットチーネグミ',          flavor: 'モヒート' },
  { maker: 'ブルボン',   name: 'レヴォグミ',                  flavor: 'ソーダ' },
  { maker: 'ブルボン',   name: 'バウンドロックグミ',          flavor: 'コーラ' },
  { maker: 'ブルボン',   name: 'バウンドロックグミ',          flavor: 'グレープ' },
  { maker: 'ブルボン',   name: 'もちふわフェットチーネグミ',  flavor: 'コーラ' },
  { maker: 'ブルボン',   name: 'チュルーツグミ',              flavor: '濃いピーチ味' },
  { maker: 'ブルボン',   name: 'チュルーツグミ',              flavor: '濃いグレープ味' },
  // ロッテ
  { maker: 'ロッテ',     name: "Fit'sグミ",                  flavor: 'ゴツンとふにゃん' },
  { maker: 'ロッテ',     name: '小梅ちゃん',                 flavor: '梅干しぐみ' },
  { maker: 'ロッテ',     name: '梅干グミ はちみつ仕立て',    flavor: null },
  { maker: 'ロッテ',     name: '梅干ぐみ',                   flavor: null },
  { maker: 'ロッテ',     name: 'ひとくちスムージーグミ',      flavor: null },
  { maker: 'ロッテ',     name: 'ポケモン グミ',               flavor: null },
  { maker: 'ロッテ',     name: 'ニチレイアセロラグミ',        flavor: null },
  { maker: 'ロッテ',     name: 'ハートいっぱい小梅ちゃんぐみ', flavor: null },
  { maker: 'ロッテ',     name: '小彩',                        flavor: 'さくらんぼ初恋' },
  { maker: 'ロッテ',     name: 'ドリンクミックスアソートグミ', flavor: null },
  { maker: 'ロッテ',     name: 'ドラえもんアソートグミ',      flavor: null },
  { maker: 'ロッテ',     name: 'トーマスソーダグミ',          flavor: null },
  { maker: 'ロッテ',     name: 'チョコ組',                   flavor: 'バナナ' },
  // 不二家
  { maker: '不二家',     name: '充実野菜 やさいとくだものグミ', flavor: null },
  { maker: '不二家',     name: 'やさいとくだものグミ',        flavor: null },
  { maker: '不二家',     name: 'のどグミ',                   flavor: 'ストロベリーミント' },
  { maker: '不二家',     name: 'のどグミ',                   flavor: 'シトラスミント' },
  { maker: '不二家',     name: 'ドールグミ',                 flavor: '実感ざくろ&グレープフルーツ' },
  // 明治
  { maker: '明治',       name: '果汁グミキッズ',              flavor: 'グレープ&マスカットミックス' },
  { maker: '明治',       name: '果汁グミ鉄分',               flavor: 'グレープフルーツ' },
  { maker: '明治',       name: '果汁グミ',                   flavor: '個包装アソート' },
  { maker: '明治',       name: '果汁グミ',                   flavor: '温州みかん' },
  { maker: '明治',       name: '果汁グミ',                   flavor: 'レモンピール' },
  { maker: '明治',       name: '果汁グミ',                   flavor: 'ポンカン' },
  { maker: '明治',       name: '果汁グミ',                   flavor: 'ふじりんご' },
  { maker: '明治',       name: '果汁グミ',                   flavor: 'ゴールデンパイン' },
  { maker: '明治',       name: '果汁グミ',                   flavor: 'とろけるふたつの果実もも&いちご' },
  { maker: '明治',       name: '果汁グミ',                   flavor: 'とろけるふたつの果実キウイ&マンゴージュレ' },
  { maker: '明治',       name: '果汁グミ',                   flavor: 'シークワーサー' },
  { maker: '明治',       name: '果汁グミ',                   flavor: 'キウイミックススムージー' },
  { maker: '明治',       name: '果汁グミ',                   flavor: 'キウイ' },
  { maker: '明治',       name: '果汁グミ',                   flavor: '食べきり5連アソート' },
  // ノーベル
  { maker: 'ノーベル',   name: 'サワーズグミ',               flavor: '白桃' },
  { maker: 'ノーベル',   name: 'ミニキューブグミ',            flavor: 'Wレモン' },
  // ライオン菓子
  { maker: 'ライオン菓子', name: 'ナタデココ マスカットグミ', flavor: null },
  { maker: 'ライオン菓子', name: 'なしグミ',                 flavor: null },
  { maker: 'ライオン菓子', name: 'ゆずグミ',                 flavor: null },
  { maker: 'ライオン菓子', name: 'ナタデココ ぶどらグミ',    flavor: null },
  // DyDo
  { maker: 'DyDo',       name: 'デミタスコーヒーグミ',       flavor: null },
  // 三菱食品
  { maker: '三菱食品',   name: 'グレープ200% キレイグミ',    flavor: '芳醇グレープ' },
  // Haribo
  { maker: 'Haribo',     name: 'グミ',                       flavor: 'サワーレモン' },
  { maker: 'Haribo',     name: 'グミ',                       flavor: 'トロピカルフルーツ' },
  // アサヒ
  { maker: 'アサヒ',     name: '三ツ矢サイダー りんごグミ',  flavor: null },
  // カルディ(キャメル珈琲)
  { maker: 'カルディ',   name: '杏仁豆腐グミ',               flavor: null },
  // クリート
  { maker: 'クリート',   name: 'ロシアンルーレットグミ',      flavor: null },
  // 丹生堂本舗
  { maker: '丹生堂本舗', name: 'リラックマグミ',              flavor: null },
  // サクマ
  { maker: 'サクマ',     name: 'ポンジュース グミ',          flavor: null },
  // サンスマイル
  { maker: 'サンスマイル', name: 'もっちりモチモチ桜ぐみ',   flavor: null },
  // パイン
  { maker: 'パイン',     name: 'パインアメグミ',              flavor: null },
  // 藤二誠
  { maker: '藤二誠',     name: '山梨シャインマスカットグミ',  flavor: null },
  // バンダイ
  { maker: 'バンダイ',   name: 'ドラえもんじゃんけんグミ',   flavor: null },
  { maker: 'バンダイ',   name: 'ドラえもんグミ',             flavor: null },
  // 春日井
  { maker: '春日井',     name: 'つぶグミ鬼サンダー',          flavor: null },
  { maker: '春日井',     name: 'つぶグミオールスターズ',      flavor: null },
  { maker: '春日井',     name: 'つぶグミ',                   flavor: '濃厚ぶどう' },
  { maker: '春日井',     name: 'つぶグミ',                   flavor: 'リフレッシュ' },
  { maker: '春日井',     name: 'つぶグミ',                   flavor: 'ヨーグルト味&苺ヨーグルト味' },
  // アトリオン
  { maker: 'アトリオン', name: 'わいわいすいぞくかんグミ',    flavor: 'ソーダ' },
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

async function searchImage(maker, name, flavor) {
  const keyword = flavor ? `${maker} ${name} ${flavor} グミ` : `${maker} ${name} グミ`
  await new Promise(r => setTimeout(r, 1000))
  const res = await httpsPost(
    `https://openapi.rakuten.co.jp/ichibams/api/IchibaItem/Search/20260401?accessKey=${encodeURIComponent(ACCESS_KEY)}&format=json`,
    { applicationId: APP_ID, accessKey: ACCESS_KEY, affiliateId: AFFILIATE_ID, keyword, hits: 5 }
  )
  if (!res.ok) return null
  const item = res.body.Items?.[0]?.Item
  return item ? (item.largeImageUrls?.[0]?.imageUrl ?? item.mediumImageUrls?.[0]?.imageUrl ?? null) : null
}

const { data: existing } = await supabase.from('gummies').select('name,flavor,maker')
const registeredSet = new Set((existing ?? []).map(g => `${g.maker}__${g.name}__${g.flavor ?? ''}`))

let registered = 0
let skipped = 0

for (const t of targets) {
  const key = `${t.maker}__${t.name}__${t.flavor ?? ''}`
  if (registeredSet.has(key)) {
    console.log(`⏭️  スキップ（登録済み）: ${t.maker} / ${t.name} / ${t.flavor ?? '-'}`)
    skipped++
    continue
  }

  process.stdout.write(`🔍 ${t.maker} ${t.name} ${t.flavor ?? ''}... `)
  const image_url = await searchImage(t.maker, t.name, t.flavor)

  const { error } = await supabase.from('gummies').insert({
    maker: t.maker,
    name: t.name,
    flavor: t.flavor,
    image_url,
    description: null,
    rakuten_url: null,
  })

  if (error) {
    console.log(`❌ ${error.message}`)
  } else {
    console.log(`✅ ${image_url ? '画像あり' : '画像なし'}`)
    registeredSet.add(key)
    registered++
  }
}

console.log(`\n完了: ${registered}件登録 / ${skipped}件スキップ`)
