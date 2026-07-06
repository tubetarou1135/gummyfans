import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
dotenv.config({ path: 'C:/Users/i_lov/OneDrive/デスクトップ/gummy-wiki/.env.local' })
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

const { data } = await sb.from('gummies').select('id,image_url').not('image_url', 'is', null)
console.log(`対象: ${data.length}件`)

let updated = 0
for (const g of data) {
  const newUrl = g.image_url.replace(/_ex=\d+x\d+/, '_ex=600x600')
  if (newUrl === g.image_url) continue
  const { error } = await sb.from('gummies').update({ image_url: newUrl }).eq('id', g.id)
  if (error) console.log(`❌ id=${g.id} ${error.message}`)
  else updated++
}
console.log(`完了: ${updated}件更新`)
