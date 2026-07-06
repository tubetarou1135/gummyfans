import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
dotenv.config({ path: 'C:/Users/i_lov/OneDrive/デスクトップ/gummy-wiki/.env.local' })
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

const items = [
  {maker:'UHA味覚糖', name:'むっちりグミ', flavor:'スコール'},
  {maker:'アイデアパッケージ', name:'純喫茶グミ', flavor:'ミックスジュース'},
  {maker:'UHA味覚糖', name:'長野グミ', flavor:'やまのしずく'},
  {maker:'ノースカラーズ', name:'白くまグミ', flavor:null},
  {maker:'カバヤ', name:'タフグミ', flavor:'ジューシーボム メロン＆レモン'},
  {maker:'ロッテ', name:"Fit's BIGグミ", flavor:'オレンジ＆アップル'},
  {maker:'カンロ', name:'ピュレグミプレミアム', flavor:'山梨産白桃'},
  {maker:'春日井製菓', name:'つぶグミ チョコの贅沢', flavor:null},
  {maker:'ブルボン', name:'フェットチーネグミ', flavor:'みんなの青春の味'},
  {maker:'カンロ', name:'カンデミーナグミ', flavor:null},
  {maker:'ジェイアール西日本デイリーサービスネット', name:'純喫茶グミ', flavor:'プリンアラモード'},
  {maker:'ブルボン', name:'もっちぷフェットチーネグミ', flavor:'カベルネソーダ味'},
  {maker:'カバヤ', name:'ピュアラルグミ', flavor:'完熟かぼす'},
  {maker:'UHA味覚糖', name:'水グミ', flavor:'巨峰'},
  {maker:'カンロ', name:'あの日見た雪グミ', flavor:null},
  {maker:'UHA味覚糖', name:'シゲキックス', flavor:'新潟県産越後姫グミ'},
  {maker:'クリート', name:'福笑いグミ', flavor:null},
  {maker:'ブルボン', name:'フェットチーネグミ', flavor:'夏かわソーダ味 ハードボイルド'},
  {maker:'UHA味覚糖', name:'コグミ', flavor:'スカイタイム'},
  {maker:'カバヤ', name:'タフグミ MEGAサイズ Ver2.0', flavor:null},
  {maker:'バンダイ', name:'リミックスフルーツグミ', flavor:'仮面ライダーリバイス'},
  {maker:'扇雀飴本舗', name:'蜜果グミ', flavor:'りんごはちみつ味'},
  {maker:'明治', name:'温かしょうがグミ', flavor:'ゆず'},
  {maker:'アイエスアイ', name:'ヨーグルトグミ', flavor:null},
  {maker:'カンロ', name:'カンデミーナグミ', flavor:'ぶどう明王'},
  {maker:'春日井製菓', name:'つぶグミプレミアム', flavor:'濃厚柑橘'},
  {maker:'カバヤ', name:'タフグミ', flavor:'エナジーゾーン'},
  {maker:'カンロ', name:'もちりカンロ', flavor:'みたらしグミ'},
  {maker:'ノーベル', name:'カメカメサワーズグミ', flavor:'コーラ味'},
  {maker:'ノーベル', name:'カメカメサワーズグミ', flavor:'マスカット味'},
  {maker:'サンキューマート', name:'バーバパパグミ', flavor:'アップルソーダ＆ホワイトソーダ'},
  {maker:'サンキューマート', name:'バーバパパグミ', flavor:'メロンクリームソーダ＆クリームソーダ'},
  {maker:'サンキューマート', name:'バーバパパグミ', flavor:'グレープソーダ＆オレンジソーダ'},
  {maker:'カンロ', name:'4Dグミ', flavor:'フルーツオレンジ'},
  {maker:'春日井製菓', name:'つぶグミ', flavor:'変身パーティー'},
  {maker:'カンロ', name:'ピュレグミプレミアム', flavor:'国産とちおとめ苺'},
  {maker:'UHA味覚糖', name:'ゲンキクールグミ', flavor:null},
  {maker:'ブルボン', name:'フェットチーネグミ', flavor:'芳醇りんご味'},
  {maker:'ブルボン', name:'しゃりもにグミ', flavor:'ヨーグルト味'},
  {maker:'クリート', name:'鉄分補給グミ', flavor:'ミックスベリー味'},
  {maker:'カンロ', name:'ピュレグミ', flavor:'柿'},
  {maker:'VIDAL', name:'ソフトフルーツグミ', flavor:null},
  {maker:'バンダイ', name:'すみっコぐらし コレクションカードグミ5', flavor:null},
  {maker:'春日井製菓', name:'つぶグミプレミアム', flavor:'濃厚りんご'},
  {maker:'アモス', name:'4Dグミ', flavor:'ミニフルーツ ストロベリー'},
  {maker:'バンダイ', name:'ピクミン たべられるぅ〜グミ', flavor:null},
  {maker:'カンロ', name:'ピュレグミポケモン', flavor:'ピカチュウ＆ポッチャマ'},
  {maker:'春日井製菓', name:'つぶグミ', flavor:'ヨーグルト'},
  {maker:'カンロ', name:'ふわもちカンロ', flavor:'マスカット'},
  {maker:'Trolli', name:'Trolli 目玉グミ', flavor:null},
  {maker:'Trolli', name:'Trolli 地球グミ', flavor:null},
  {maker:'明治', name:'お口のミカタグミ', flavor:'レモン'},
  {maker:'明治', name:'お口のミカタグミ', flavor:'マスカット'},
  {maker:'ブルボン', name:'フェットチーネグミ', flavor:'ピンクレモネード味'},
  {maker:'カバヤ', name:'タフグミ', flavor:'スポーツドリンク味'},
  {maker:'カンロ', name:'BRAONグミ', flavor:null},
  {maker:'JAニッポンエール', name:'北海道和ハッカグミ', flavor:null},
  {maker:'カンロ', name:'ピュレグミ', flavor:'ベリー・ベリー・ベリー'},
  {maker:'UHA味覚糖', name:'トムとジェリーグミ', flavor:null},
  {maker:'春日井製菓', name:'たっぷりグミのしろ', flavor:'ソーダ味'},
  {maker:'明治', name:'果汁グミ 糖類30％オフ', flavor:'ぶどう'},
]

const { data: existing } = await sb.from('gummies').select('name,flavor,maker')
const registeredSet = new Set((existing ?? []).map(g => `${g.maker}__${g.name}__${g.flavor??''}`))

let registered = 0, skipped = 0
for (const t of items) {
  const key = `${t.maker}__${t.name}__${t.flavor??''}`
  if (registeredSet.has(key)) { skipped++; continue }
  const {error} = await sb.from('gummies').insert({...t, image_url:null, description:null, rakuten_url:null})
  if (error) console.log(`❌ ${t.name} ${error.message}`)
  else { registered++; registeredSet.add(key) }
}
console.log(`完了: ${registered}件登録 / ${skipped}件スキップ`)
