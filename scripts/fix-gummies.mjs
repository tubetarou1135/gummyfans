import * as dotenv from 'dotenv'
import { createClient } from '@supabase/supabase-js'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: join(__dirname, '../.env.local') })

const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

// 修正リスト: { 現在のname, 正しいname, flavor }
const fixes = [
  { from: 'コロロ マスカット',   name: 'コロロ', flavor: 'マスカット' },
  { from: 'ピュレグミ グレープ', name: 'ピュレグミ', flavor: 'グレープ' },
  { from: 'ピュレグミ レモン',   name: 'ピュレグミ', flavor: 'レモン' },
  { from: '果汁グミ ぶどう',     name: '果汁グミ', flavor: 'ぶどう' },
  { from: '果汁グミ いちご',     name: '果汁グミ', flavor: 'いちご' },
  { from: '果汁グミ もも',       name: '果汁グミ', flavor: 'もも' },
  { from: 'コロロ ぶどう',       name: 'コロロ', flavor: 'ぶどう' },
  { from: 'コロロ いちご',       name: 'コロロ', flavor: 'いちご' },
]

for (const { from, name, flavor } of fixes) {
  const { error } = await sb.from('gummies').update({ name, flavor }).eq('name', from)
  console.log(error ? `❌ ${from}: ${error.message}` : `✅ ${from} → 商品名:${name} / フレーバー:${flavor}`)
}

// ピュレグミ レモン の重複を削除（古い方を残す）
const { data: lemons } = await sb.from('gummies').select('id,name,flavor,image_url').eq('name', 'ピュレグミ').eq('flavor', 'レモン').order('created_at', { ascending: true })
if (lemons && lemons.length > 1) {
  // 画像あり優先、なければ古い方を残して残りを削除
  const keep = lemons.find(g => g.image_url) ?? lemons[0]
  const deleteIds = lemons.filter(g => g.id !== keep.id).map(g => g.id)
  for (const id of deleteIds) {
    await sb.from('gummies').delete().eq('id', id)
    console.log(`🗑️  ピュレグミ レモン 重複削除 (id:${id})`)
  }
}

console.log('\n完了')
