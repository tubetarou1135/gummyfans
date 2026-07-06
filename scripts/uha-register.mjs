import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: join(__dirname, '../.env.local') })

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

const targets = [
  {
    name: 'コロロ', maker: 'UHA味覚糖', flavor: 'グレープ',
    image_url: 'https://thumbnail.image.rakuten.co.jp/@0_mall/cocodecow/cabinet/182/178424.jpg?_ex=128x128',
    rakuten_url: 'https://item.rakuten.co.jp/cocodecow/r24472/',
  },
  {
    name: 'シゲキックス', maker: 'UHA味覚糖', flavor: '極刺激ソーダ',
    image_url: 'https://thumbnail.image.rakuten.co.jp/@0_mall/dagasi/cabinet/09212374/imgrc0121521427.jpg?_ex=128x128',
    rakuten_url: 'https://item.rakuten.co.jp/dagasi/10006215/',
  },
  {
    name: 'シゲキックス', maker: 'UHA味覚糖', flavor: 'グレープ',
    image_url: 'https://thumbnail.image.rakuten.co.jp/@0_mall/mizota/cabinet/okashi/gumi/4902750789562.jpg?_ex=128x128',
    rakuten_url: 'https://item.rakuten.co.jp/mizota/4902750789562-10/',
  },
  {
    name: '忍者めし', maker: 'UHA味覚糖', flavor: 'ラムネ',
    image_url: 'https://thumbnail.image.rakuten.co.jp/@0_mall/okagesama-market/cabinet/05816752/imgrc0084878449.jpg?_ex=128x128',
    rakuten_url: 'https://item.rakuten.co.jp/okagesama-market/4902750675841/',
  },
  {
    name: '忍者めし', maker: 'UHA味覚糖', flavor: '巨峰',
    image_url: 'https://thumbnail.image.rakuten.co.jp/@0_mall/dagasi/cabinet/09212374/12334395/imgrc0148395694.jpg?_ex=128x128',
    rakuten_url: 'https://item.rakuten.co.jp/dagasi/mb-4902750615113-20/',
  },
  {
    name: '忍者めし鋼', maker: 'UHA味覚糖', flavor: 'マスカット',
    image_url: 'https://thumbnail.image.rakuten.co.jp/@0_mall/jetprice/cabinet/bn3/j7589y.jpg?_ex=128x128',
    rakuten_url: 'https://item.rakuten.co.jp/jetprice/x439rd/',
  },
]

for (const t of targets) {
  const { error } = await supabase.from('gummies').insert(t)
  console.log(error ? `❌ ${t.name} ${t.flavor}: ${error.message}` : `✅ ${t.name} / ${t.flavor}`)
}
console.log('\n完了')
