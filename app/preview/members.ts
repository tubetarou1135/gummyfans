export type SnsLink = {
  label: string
  url: string
  icon: string
}

export type Member = {
  slug: string
  name: string
  title: string
  image?: string
  description: string
  sns: SnsLink[]
}

export const members: Member[] = [
  {
    slug: 'mushatter',
    name: '武者慶佑',
    title: '名誉会長',
    image: 'https://pbs.twimg.com/profile_images/1816067405334077441/-PoQA-hG_400x400.jpg',
    description: 'フリーランス。日本グミ協会の創設メンバーとして長年グミ文化の普及に貢献。テレビ番組「マツコの知らない世界」への出演でグミの魅力を全国に発信した。',
    sns: [
      { label: 'X', url: 'https://x.com/mushatter', icon: '𝕏' },
    ],
  },
  {
    slug: 'aiueoka5',
    name: 'あいうえお',
    title: '会長',
    image: 'https://pbs.twimg.com/profile_images/1709567740087074817/NifYJZ21_400x400.jpg',
    description: 'SNSでグミ情報を発信し続けるグミのプロフェッショナル。フォロワー24,000人超のグミ専門アカウント「A I U E O グミチャンネル」を運営。',
    sns: [
      { label: 'X', url: 'https://twitter.com/aiueoka5', icon: '𝕏' },
      { label: 'YouTube', url: 'https://youtube.com/@aiueo93ch', icon: '▶' },
      { label: 'Instagram', url: 'https://www.instagram.com/Aiueoka_93/', icon: '📸' },
      { label: 'TikTok', url: 'https://www.tiktok.com/@aip.p.p', icon: '🎵' },
    ],
  },
  {
    slug: 'kotobukiyume',
    name: '琴吹ゆめ',
    title: 'バーチャル副会長',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcROXB5DOhw2mmAK_AuEOIUdoEIQ8e0W1FGiCs0OPBfGcg&s=10',
    description: 'グミ・コスメ・アイドルをこよなく愛するバーチャル副会長。SNSやYouTubeでグミの魅力を発信中。',
    sns: [
      { label: 'X', url: 'https://twitter.com/KotobukiYume', icon: '𝕏' },
      { label: 'YouTube', url: 'https://www.youtube.com/@kotobukiyume', icon: '▶' },
      { label: 'Instagram', url: 'https://www.instagram.com/kotobuki_yume/', icon: '📸' },
      { label: 'TikTok', url: 'https://www.tiktok.com/@kotobukiyume', icon: '🎵' },
    ],
  },
  {
    slug: 'yumemaru',
    name: 'ゆめまる（東海オンエア）',
    title: '名誉会員',
    image: 'https://pbs.twimg.com/media/GlreJUQbcAAey7s.jpg',
    description: 'チャンネル登録者数1,000万人超の人気YouTubeグループ「東海オンエア」のメンバー。日本グミ協会の名誉会員として認定され、グミ文化の普及に貢献。',
    sns: [
      { label: 'X', url: 'https://x.com/TO_yumemarucas', icon: '𝕏' },
      { label: 'YouTube', url: 'https://www.youtube.com/@TokaiOnAir', icon: '▶' },
      { label: 'Instagram', url: 'https://www.instagram.com/yumemaru_original/', icon: '📸' },
    ],
  },
]
