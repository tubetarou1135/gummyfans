import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
dotenv.config({ path: 'C:/Users/i_lov/OneDrive/デスクトップ/gummy-wiki/.env.local' })
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

const items = [
  {maker:'UHA味覚糖', name:'忍者めし鋼', flavor:'鋼のメンタルピーチ'},
  {maker:'ブルボン', name:'フェットチーネグミ', flavor:'アサイーボウル'},
  {maker:'カンロ', name:'ピュレグミプレミアム', flavor:'山形産佐藤錦'},
  {maker:'ノースカラーズ', name:'475GUMMY', flavor:'ライチ'},
  {maker:'ロッテ', name:'カジッテ', flavor:'ストロベリー＆ピーチ'},
  {maker:'セブンイレブン', name:'裏グミまる', flavor:'シャインマスカット'},
  {maker:'カバヤ食品', name:'激辛コーラグミ', flavor:'激辛コーラ味'},
  {maker:'春日井製菓', name:'つぶグミ', flavor:'デカいソーダ'},
  {maker:'カンロ', name:'カンデミーニャ', flavor:'ニャインマスキャットソーダ'},
  {maker:'ブルボン', name:'フェットチーネグミ', flavor:'宮崎県産ストロベリーブレンド'},
  {maker:'カンロ', name:'ピュレマロ！', flavor:'ピーチ'},
  {maker:'ドルチェ', name:'とろむに', flavor:'シャインマスカット'},
  {maker:'ノーベル製菓', name:'シンサワーズ', flavor:'ラムネ'},
  {maker:'UHA味覚糖', name:'ニャン者めし鋼', flavor:'ピーチ味'},
  {maker:'カバヤ食品', name:'タフグミ', flavor:'グレフルフィーバー'},
  {maker:'UHA味覚糖', name:'忍者めし鋼の鎧', flavor:'ピーチ味'},
  {maker:'シーズ', name:'くまグミ', flavor:'ラムネ味'},
  {maker:'カバヤ食品', name:'しゃりinグミ', flavor:'クリスタルグレープ'},
  {maker:'カバヤ食品', name:'おとうふくん', flavor:'とってもピーンチ味'},
  {maker:'三菱食品', name:'ハリボー', flavor:'ハッピーバーサリー'},
  {maker:'UHA味覚糖', name:'チョコレア', flavor:'イチゴ味'},
  {maker:'クリート', name:'星空つくろうグミ', flavor:'ジュレ入りパインソーダ味'},
  {maker:'クリート', name:'yogiboグミ', flavor:'マスカット＆ラムネ＆ストロベリー'},
]

const { data: existing } = await sb.from('gummies').select('name,flavor,maker')
const registeredSet = new Set((existing ?? []).map(g => `${g.maker}__${g.name}__${g.flavor??''}`))

let registered = 0, skipped = 0
for (const t of items) {
  const key = `${t.maker}__${t.name}__${t.flavor??''}`
  if (registeredSet.has(key)) { skipped++; console.log(`⏭ スキップ: ${t.maker} / ${t.name} / ${t.flavor??'-'}`); continue }
  const {error} = await sb.from('gummies').insert({...t, image_url:null, description:null, rakuten_url:null})
  if (error) console.log(`❌ ${t.name} ${error.message}`)
  else { registered++; registeredSet.add(key) }
}
console.log(`完了: ${registered}件登録 / ${skipped}件スキップ`)
