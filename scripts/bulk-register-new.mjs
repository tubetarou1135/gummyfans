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

const targets = [
  // --- Folder 3 (202-204) ---
  { maker: 'UHA味覚糖', name: '番長ぷっちょグミ', flavor: 'コーラ味' },
  { maker: 'アサヒ', name: '濃ーいブルーベリーグミ', flavor: null },
  { maker: '扇雀', name: '南国のコナッツグミ', flavor: 'パッションフルーツ' },
  { maker: '扇雀', name: '南国のコナッツグミ', flavor: 'パイン' },
  { maker: 'ノーベル', name: '直七グミ', flavor: null },
  { maker: '明治', name: '超ひもQグミ', flavor: 'グレープ&レモン' },
  { maker: '江崎グリコ', name: '朝グミ生活', flavor: 'りんごヨーグルト味' },
  { maker: '江崎グリコ', name: '朝グミ生活', flavor: 'ブルーベリーヨーグルト味' },
  { maker: '扇雀', name: '早摘みいちご 練乳グミ', flavor: null },
  { maker: '春日井', name: '青梅グミ', flavor: null },
  { maker: '森永製菓', name: '生ラムネグミ', flavor: '角切りりんご味' },
  { maker: '森永製菓', name: '生ラムネグミ', flavor: 'ちっちゃいおっさん 冷凍みかん味' },
  { maker: 'カバヤ', name: '世界のキッチンからグミ', flavor: '乳酸菌ととろとろ桃のフルーニュ' },
  { maker: 'カバヤ', name: '世界のキッチンからグミ', flavor: 'ディアボロ・ジンジャー' },
  { maker: 'カバヤ', name: '世界のキッチンから ソルティライチグミ', flavor: null },
  { maker: 'ロッテ', name: '小雪ぐみ', flavor: 'ゆず味' },

  // --- Folder 3 (319-325) ---
  { maker: '不二家', name: 'チューイングミルキー', flavor: 'ココアーモンド' },
  { maker: 'ノーベル', name: 'ちびサワーズグミ', flavor: 'ドリンクアソート' },
  { maker: '扇雀', name: 'ちっちゃな幸せにくきゅうグミ', flavor: null },
  { maker: 'UHA味覚糖', name: 'チコちゃん グミ', flavor: null },
  { maker: 'カバヤ', name: 'タフグミ', flavor: '梅' },
  { maker: 'カバヤ', name: 'タフグミ', flavor: 'ドライ' },
  { maker: 'カバヤ', name: 'タフグミ', flavor: 'ソルティグレープフルーツ' },
  { maker: 'カバヤ', name: 'タフグミ', flavor: 'エナジードリンク' },
  { maker: 'クリート', name: 'タピオカ抹茶ミルクティグミ', flavor: null },
  { maker: 'ノーベル', name: 'タビるGummy', flavor: 'ミルクティー味' },
  { maker: 'サンスマイル', name: 'タピオカミルクティーグミ', flavor: null },
  { maker: 'クリート', name: 'タピオカいちごミルクティグミ', flavor: null },
  { maker: '旺旺・ジャパン', name: 'すばグミ', flavor: 'ブルーベリー味&ピーチヨーグルト味' },
  { maker: 'ファミリーマート', name: '#平成最後のグミ', flavor: null },
  { maker: '明治', name: 'GOCHIグミ', flavor: '甘ずっぱいグレープ味' },
  { maker: '明治', name: 'GOCHIグミ', flavor: 'ほんのり甘ずっぱい梅味' },
  { maker: 'ロッテ', name: "Fit'sグミ", flavor: 'グレープ' },
  { maker: 'ロッテ', name: 'C.C.レモングミ', flavor: null },
  { maker: 'Dole', name: 'グミ実感', flavor: 'グリーンアップル' },
  { maker: 'Dole', name: '実感果実グミアソート', flavor: null },
  { maker: 'Dole', name: '果実グミ', flavor: 'キウイ' },
  { maker: 'Dole', name: 'まるで生食感グミ', flavor: 'シャキシャキパイン' },
  { maker: 'Dole', name: 'ドール 実感 果実グミ', flavor: 'マンゴー' },
  { maker: 'Dole', name: 'ドール 実感 果実グミ', flavor: 'パイナップル' },
  { maker: 'Dole', name: 'ドール 実感 果実グミ', flavor: 'グレープ' },
  { maker: 'Dole', name: 'ドール パイナップルジュレ&ヨーグルトグミ', flavor: null },
  { maker: 'Dole', name: 'ドール グミボール', flavor: 'バナナ' },
  { maker: 'Dole', name: 'ドール グミ', flavor: 'バナナミックス' },
  { maker: 'Dole', name: 'ドール キウイジュレ&ヨーグルトグミ', flavor: null },
  { maker: 'Dole', name: 'ドール 2つのフルーツグミ', flavor: 'パイナップル&アップル' },
  { maker: 'Dole', name: 'ドール 2つのフルーツグミ', flavor: 'グレープ&マスカット' },
  { maker: 'Dole', name: 'ドール2つのフルーツグミ', flavor: '青りんご&赤りんご' },
  { maker: 'Dole', name: 'ドール2つのフルーツグミ', flavor: 'ストロベリー&ブルーベリー' },
  { maker: 'Dole', name: 'コツブグミ', flavor: 'バナナ 食物繊維プラス' },
  { maker: 'Dole', name: 'グミ', flavor: 'マンゴー' },
  { maker: 'Dole', name: '2つのデザートグミ', flavor: 'ピーチジュレ&ヨーグルト' },
  { maker: '明治', name: '果汁グミ', flavor: 'とろけるふたつの果実 グレープ&マスカットジュレ' },

  // --- Folder 4 (216-223) ---
  { maker: '明治', name: 'ミルモでポン！ グミミッチョ', flavor: null },
  { maker: '杉本屋', name: 'ミラクルホームラングミ', flavor: 'グレープ' },
  { maker: 'ロッテ', name: 'ミックスグミ', flavor: null },
  { maker: '春日井', name: 'マンゴーグミ', flavor: null },
  { maker: '春日井', name: 'まるごと漬けた杏酒グミ', flavor: null },
  { maker: '春日井', name: 'まるかじっグミ', flavor: 'いよかん味' },
  { maker: '春日井', name: 'まるかじっ！グミ', flavor: 'ピングレ味' },
  { maker: 'カバヤ', name: 'マミーグミ', flavor: null },
  { maker: 'カバヤ', name: 'マジカルストーングミ', flavor: 'ピーチ&青りんご' },
  { maker: '明治', name: 'まさか？！まさかのコーラアップグミ', flavor: '苺コーラ味' },
  { maker: '杉本屋', name: 'まけんグミ', flavor: 'パイン味' },
  { maker: '杉本屋', name: 'まけんグミ', flavor: 'サイダー味' },
  { maker: '杉本屋', name: 'まけんグミ', flavor: 'コーラ味' },
  { maker: '杉本屋', name: 'まけんグミ', flavor: 'グレープ味' },
  { maker: 'カンロ', name: 'ぽんかんのぐみ', flavor: null },
  { maker: 'サクマ', name: 'ポン グレープフルーツグミ', flavor: null },
  { maker: 'サクマ', name: 'ポン アップルグミ', flavor: null },
  { maker: '春日井', name: 'ポケグミ', flavor: 'グレープ' },
  { maker: '杉本屋', name: 'ふわわのグミ', flavor: 'イチゴ味' },
  { maker: 'ノーベル', name: 'プルッタグミ', flavor: 'ピンクグレープフルーツ味' },
  { maker: 'ノーベル', name: 'プルッタグミ', flavor: 'グリーンアップル味' },
  { maker: '不二家', name: 'ぷにゅぷにゅグミ', flavor: 'グレープ味' },
  { maker: 'UHA味覚糖', name: 'ぷっちょグミ', flavor: '元気ドリンク&スポーツドリンク' },
  { maker: 'UHA味覚糖', name: 'ぷっちょグミ', flavor: 'レモングミ&ソーダグミ' },
  { maker: 'UHA味覚糖', name: 'ぷっちょグミ', flavor: 'りんごヨーグルト' },
  { maker: 'UHA味覚糖', name: 'ぷっちょグミ', flavor: 'ミニオンモンスター' },
  { maker: 'UHA味覚糖', name: 'ぷっちょグミ', flavor: 'ドリンクフィーバー' },
  { maker: 'UHA味覚糖', name: 'ぷっちょグミ', flavor: 'ソーダグミ&メロンソーダグミ' },
  { maker: 'UHA味覚糖', name: 'ぷっちょグミ', flavor: 'ソーダ' },
  { maker: 'UHA味覚糖', name: 'ぷっちょグミ', flavor: 'さくらんぼ味' },
  { maker: 'UHA味覚糖', name: 'ぷっちょグミ', flavor: 'コーラ&レモン' },
  { maker: 'UHA味覚糖', name: 'ぷっちょグミ', flavor: 'コーラ' },
  { maker: 'UHA味覚糖', name: 'ぷっちょグミ', flavor: 'オレンジグミ&ヨーグルトグミ' },
  { maker: 'UHA味覚糖', name: 'ぷっちょグミ', flavor: 'メロンソーダグミ&ヨーグルトグミ' },
  { maker: 'UHA味覚糖', name: 'ぷっちょグミ', flavor: 'オレンジ' },
  { maker: 'カンロ', name: 'プチピュレグミ', flavor: 'グレープ' },
  { maker: 'カバヤ', name: 'プチッコアニマルグミ', flavor: 'オレンジ味' },
  { maker: 'カンロ', name: 'クプクプ水族館グミ', flavor: null },

  // --- Folder 5 (224-242) ---
  { maker: 'UHA味覚糖', name: 'ふわモコグミ モコノコ', flavor: 'ピンクグレープフルーツ味' },
  { maker: '江崎グリコ', name: 'フレンドグミ', flavor: null },
  { maker: 'カバヤ', name: 'フルーツ缶？グミ', flavor: 'みかん味' },
  { maker: '春日井', name: 'フルーツミックスグミ', flavor: null },
  { maker: 'バヤリース', name: 'フルーツグミ', flavor: null },
  { maker: 'サクマ', name: 'ふるグミ', flavor: '抹茶もち' },
  { maker: 'カバヤ', name: 'ふにょグミ', flavor: 'ソーダ味&ピーチ味' },
  { maker: 'カバヤ', name: 'ふにょグミ', flavor: 'ソーダ味' },
  { maker: 'バンダイ', name: 'ふなっしーグミ', flavor: null },
  { maker: 'バンダイ', name: 'フコウモリグミ', flavor: null },
  { maker: 'ブルボン', name: 'フェットチーネグミ', flavor: 'カシスオレンジ味' },
  { maker: 'ブルボン', name: 'フェットチーネグミ', flavor: 'イタリアンオレンジ' },
  { maker: 'カンロ', name: 'ピュレグミ', flavor: '林檎ジンジャー' },
  { maker: 'カンロ', name: 'ピュレグミ', flavor: '青りんご味' },
  { maker: 'カンロ', name: 'ピュレグミ', flavor: '青りんごソーダ' },
  { maker: 'カンロ', name: 'ピュレグミ', flavor: '元祖すもも味' },
  { maker: 'カンロ', name: 'ピュレグミ', flavor: 'ラズベリー味' },
  { maker: 'カンロ', name: 'ピュレグミ', flavor: 'マンゴー味' },
  { maker: 'カンロ', name: 'ピュレグミ', flavor: 'ブラッドオレンジ味' },
  { maker: 'カンロ', name: 'ピュレグミ', flavor: 'バレンシアオレンジ味' },
  { maker: 'カンロ', name: 'ピュレグミ', flavor: 'はちみつりんご' },
  { maker: 'カンロ', name: 'ピュレグミ', flavor: 'スウィーティー味' },
  { maker: 'カンロ', name: 'ピュレグミ', flavor: 'ゴールデンパイン' },
  { maker: 'カバヤ', name: 'ピュアラルグミ', flavor: '蜜りんご' },
  { maker: 'カバヤ', name: 'ピュアラルグミ', flavor: 'とちおとめ' },
  { maker: 'カバヤ', name: 'ピュアラルグミ', flavor: '紅玉りんご&王林りんご' },
  { maker: 'カバヤ', name: 'ピュアラルグミ', flavor: '柑橘' },
  { maker: 'カバヤ', name: 'ピュアラルグミ', flavor: '沖縄県シークワーサー&山形県産佐藤錦' },
  { maker: 'カバヤ', name: 'ピュアラルグミ', flavor: 'ラフランス' },
  { maker: 'カバヤ', name: 'ピュアラルグミ', flavor: 'ライチ&グレープフルーツ' },
  { maker: 'カバヤ', name: 'ピュアラルグミ', flavor: 'ミックスベリー' },
  { maker: 'カバヤ', name: 'ピュアラルグミ', flavor: 'パイン' },
  { maker: 'カバヤ', name: 'ピュアラルグミ', flavor: 'とちおとめ苺' },
  { maker: 'カバヤ', name: 'ピュアラルグミ', flavor: 'せとか' },
  { maker: 'カバヤ', name: 'ピュアラルグミ', flavor: 'スパークリングレモン' },
  { maker: 'カバヤ', name: 'ピュアラルグミ', flavor: 'シークヮーサー' },
  { maker: 'カバヤ', name: 'ピュアラルグミ', flavor: 'グレープフルーツ' },
  { maker: 'カバヤ', name: 'ピュアラルグミ', flavor: 'カシス&オレンジ' },
  { maker: 'カバヤ', name: 'ピュアラルグミ', flavor: 'アサイー' },
  { maker: 'カバヤ', name: 'ピュアラル レモン ハローキティ とろっとジューシーな果実グミ', flavor: null },
  { maker: 'カバヤ', name: 'ピュアラルグミ', flavor: 'すもも' },
  { maker: 'エイム', name: 'ピッツァグミ', flavor: 'シングル' },
  { maker: 'やおきん', name: 'パーティグミ', flavor: null },
  { maker: '春日井', name: 'はちみつ入りレモングミ', flavor: null },
  { maker: 'カンロ', name: 'はちみつレモンCグミ', flavor: null },
  { maker: 'カンロ', name: 'はちみつりんごCグミ', flavor: null },
  { maker: 'ロマンス', name: 'はずかっぷグミ', flavor: null },
  { maker: 'カンロ', name: 'ノンシュガーグミ', flavor: 'レモンC' },
  { maker: 'カンロ', name: 'ノンシュガーグミ', flavor: 'ブルーベリーA' },
  { maker: 'クラシエ', name: 'ぬりんぐグミン', flavor: 'ブドウ&オレンジ味' },
  { maker: 'エイム', name: 'ニューホットドックグミ', flavor: null },
  { maker: 'エイム', name: 'ニュージューシーバーガーグミ', flavor: null },
  { maker: 'ライオン', name: 'ナタデコライチグミ', flavor: null },
  { maker: 'ライオン', name: 'ナタデコカシスグミ', flavor: null },
  { maker: 'UHA味覚糖', name: 'なが～いさけるグミ', flavor: '巨峰' },
  { maker: 'UHA味覚糖', name: 'なが～いさけるグミ', flavor: '温州みかん' },
  { maker: 'UHA味覚糖', name: 'なが～いさけるグミ', flavor: 'シャインマスカット' },
  { maker: '明治', name: 'ドーナッツグミ', flavor: 'チョコ味' },
  { maker: 'カンロ', name: 'どきどき動物ランドグミ', flavor: null },
  { maker: '春日井', name: 'つぶグミ', flavor: 'トロピカル' },
  { maker: 'オリオン', name: 'トミカグミ', flavor: '緊急車両 コーラ味' },
  { maker: '明治', name: 'とっとこハム太郎 グミ', flavor: null },
  { maker: 'ライオン', name: 'デコポングミ', flavor: null },
  { maker: '江崎グリコ', name: 'ディズニー フレンドグミ', flavor: 'オレンジ&レモン' },
  { maker: '春日井', name: 'つぶグミ', flavor: 'フルーツミックス' },
  { maker: '春日井', name: 'つぶグミ', flavor: '5つの秘宝' },
  { maker: 'ノーベル', name: 'ツウィッシュ ジンジャーエール&ビタミンドリンクグミ', flavor: null },
  { maker: '春日井', name: 'チョコっとグミキャン', flavor: null },
  { maker: 'カンロ', name: 'だるまでまるだグミ', flavor: 'いよかん味' },
  { maker: 'バンダイ', name: 'たまごっちぐみ', flavor: 'いちごヨーグルト味' },
  { maker: 'カバヤ', name: 'たいやき！？グミ', flavor: null },
  { maker: 'ライオン', name: 'ゼスプリ ゴールドキウイグミ', flavor: null },
  { maker: 'バンダイ', name: 'すみっコぐらしきもちカラフルグミ', flavor: null },
  { maker: 'ノーベル', name: 'スプラトゥーングミ', flavor: 'オレンジソーダ&メロンソーダ' },
  { maker: 'ノーベル', name: 'スーパーマリオグミ', flavor: 'ラムネ&コーラ' },
  { maker: 'ポーラ化粧品本舗', name: 'スヌーピー グミキャンディ！', flavor: null },
  { maker: 'カバヤ', name: 'すいかグミ', flavor: '塩つき すいか味 すっぱすいか味' },
  { maker: '明治', name: 'ジュレin果汁グミ', flavor: '赤梅' },
  { maker: '明治', name: 'ジュレin果汁グミ', flavor: '青りんご' },
  { maker: 'カバヤ', name: 'ジューシープラスグミ', flavor: null },
  { maker: '春日井', name: 'じゅーしぃーグミ', flavor: null },
  { maker: '杉本屋', name: 'ショートなショースケのサワーグミ', flavor: 'れもん味' },
  { maker: '杉本屋', name: 'ショートなショーコのチューイングミ', flavor: '桃ヨーグルト味' },
  { maker: 'UHA味覚糖', name: 'シュワリンコーラグミ', flavor: null },
  { maker: 'アサヒ', name: 'しゃりっとかむ三ツ矢サイダー 温州みかんグミ', flavor: null },
  { maker: 'アサヒ', name: 'しゃりっとかむ三ツ矢サイダー レモングミ', flavor: null },
  { maker: 'UHA味覚糖', name: 'シゲキックス グミガーム', flavor: 'ナチュラルミント' },
  { maker: 'モントワール', name: 'シークヮーサーグミ', flavor: null },
  { maker: 'ノーベル', name: 'サワーズグミ', flavor: '北海道メロン味' },
  { maker: 'ノーベル', name: 'サワーズ グミ', flavor: 'ラムネ味' },
  { maker: 'やおきん', name: 'サワーサイダーグミ', flavor: null },
  { maker: 'やおきん', name: 'サワーグレープグミ', flavor: null },
  { maker: 'UHA味覚糖', name: 'さけるグミ', flavor: 'チアシード&レモン' },
  { maker: 'UHA味覚糖', name: 'さけるグミ', flavor: '白桃' },
  { maker: 'UHA味覚糖', name: 'さけるグミ', flavor: 'ゴールドキウイ' },
  { maker: 'UHA味覚糖', name: 'さけるグミ', flavor: '1コマ劇場' },
  { maker: 'モントワール', name: 'さくらんぼグミ', flavor: null },
  { maker: 'カバヤ', name: 'ゴールドキウイグミ', flavor: null },

  // --- Folder 6 (249-255) ---
  { maker: 'ファミリーマート', name: 'これってもしかしてグミっすか！？', flavor: 'さっぱりさわやかレモン味' },
  { maker: 'セブンイレブン', name: 'コールド・ストーン クリマリー レッドベリーズグミ', flavor: null },
  { maker: '丹生堂本舗', name: 'コーラボトルグミ', flavor: null },
  { maker: 'カバヤ', name: 'コーラとソーダのグミ', flavor: null },
  { maker: 'やおきん', name: 'コーラグミ ビッグサイズ', flavor: null },
  { maker: '明治', name: 'コーラアップ ハードグミ', flavor: null },
  { maker: '明治', name: 'コーラ 餅グミ', flavor: null },
  { maker: 'ノーベル', name: 'グレープ&マスカットソーダグミ', flavor: null },
  { maker: '江崎グリコ', name: 'グミルト', flavor: 'ブルーベリーヨーグルト味' },
  { maker: '江崎グリコ', name: 'グミルト', flavor: 'アロエヨーグルト味' },
  { maker: '杉本屋', name: 'グミボン', flavor: null },
  { maker: 'クラシエ', name: 'グミビューン', flavor: 'メロン味' },
  { maker: 'クラシエ', name: 'グミビューン', flavor: 'ブドウ味' },
  { maker: '春日井', name: 'グミ100', flavor: 'オレンジ' },
  { maker: '春日井', name: 'グミ100', flavor: 'マスカットグミ' },
  { maker: '春日井', name: 'グミ100', flavor: 'グレープ果' },
  { maker: '春日井', name: 'グミ100', flavor: 'グレープグミ' },
  { maker: '春日井', name: 'グミ100 MIX', flavor: 'アップル&マスカット&グレープ' },
  { maker: '春日井', name: 'グミ100', flavor: '100%マスカット果汁' },
  { maker: '春日井', name: 'グミ100', flavor: '100%オレンジ果汁' },
  { maker: '春日井', name: 'グミ100', flavor: '100%アップル果汁' },
  { maker: '明治', name: 'グニッグミ', flavor: 'コーラ味' },
  { maker: '春日井', name: 'クリームソーダグミ', flavor: null },
  { maker: 'カバヤ', name: 'クミクミグミ', flavor: 'メロンクリームソーダ' },
  { maker: 'カバヤ', name: 'クミクミグミ', flavor: 'グレープソーダ' },
  { maker: 'カバヤ', name: 'クミクミグミ', flavor: 'オレンジソーダ' },
  { maker: 'サクマ', name: 'クエン酸グミ', flavor: null },
  { maker: 'ロッテ', name: 'クイッククエンチ C グミ', flavor: null },
  { maker: 'サクマ', name: 'ぎっしり果実グミ', flavor: '白ぶどう' },
  { maker: '春日井', name: 'キレイの種', flavor: 'レモングミ' },
  { maker: '春日井', name: 'キレイの種', flavor: 'ミックスベリーグミ' },
  { maker: 'モントワール', name: 'うめぼしグミ', flavor: 'うめぼし仕立て 和歌山県産 紀州梅エキス使用' },
  { maker: 'UHA味覚糖', name: 'いちご味グミ', flavor: null },
  { maker: '不二家', name: 'アンパンマングミ', flavor: 'グレープ' },
  { maker: 'バンダイ', name: 'あの頃ケロロ軍曹のグミであります', flavor: null },

  // --- Folder 6 (256-260) ---
  { maker: '春日井', name: 'キレイの種', flavor: 'ピーチグミ' },
  { maker: 'カバヤ', name: 'キリンレモン グミ', flavor: null },
  { maker: '明治', name: 'キラリン アイドル養成グミ', flavor: null },
  { maker: 'ブルボン', name: 'キュービィロップグミ', flavor: 'いちご' },
  { maker: 'ブルボン', name: 'キュービィロップ ゼリーinグミ', flavor: null },
  { maker: 'ノーベル', name: 'わらびもちグミ', flavor: null },
  { maker: '夢クリエイト', name: 'カロサボ ノンシュガーグミ', flavor: 'オレンジ' },
  { maker: '夢クリエイト', name: 'カロサボ100kcalノンシュガーグミ', flavor: 'グレープ' },
  { maker: 'カンロ', name: 'カルピスジューシーグミ', flavor: 'マスカット' },
  { maker: 'カンロ', name: 'カルピスジューシーグミ', flavor: 'グレープフルーツ' },
  { maker: 'アサヒグループ食品', name: 'カルピスグミ', flavor: '甘夏味' },
  { maker: 'カンロ', name: 'カルピスグミ', flavor: 'すっきりさわやかプレーン味' },
  { maker: 'カンロ', name: 'カルピスグミ', flavor: 'グレープ味' },
  { maker: '杉本屋', name: 'カスタードプリングミ', flavor: null },
  { maker: 'ノーベル', name: 'カジッシュグミ', flavor: 'オレンジ味' },
  { maker: 'UHA味覚糖', name: 'オラフグミ', flavor: 'ホワイトソーダ味' },
  { maker: '杉本屋', name: 'おもちな抹茶みるくグミ', flavor: null },
  { maker: '杉本屋', name: 'おもちな黒ごまグミ', flavor: null },
  { maker: 'カンロ', name: 'おさかな探検隊グミ', flavor: null },
  { maker: '杉本屋', name: 'うるっぷるん', flavor: '林檎味' },
  { maker: '杉本屋', name: 'うるっぷるん', flavor: 'マンゴー味' },
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

const { data: existing } = await supabase.from('gummies').select('name,flavor,maker')
const registeredSet = new Set((existing ?? []).map(g => `${g.maker}__${g.name}__${g.flavor ?? ''}`))

console.log(`既存登録数: ${registeredSet.size}件\n`)

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
