import * as dotenv from 'dotenv'
import { createClient } from '@supabase/supabase-js'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: join(__dirname, '../.env.local') })

const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
const { data } = await sb.from('gummies').select('name,maker,flavor').order('created_at', { ascending: true })
data.forEach(g => console.log(`商品名: ${g.name}  /  フレーバー: ${g.flavor ?? 'なし'}  /  メーカー: ${g.maker}`))
