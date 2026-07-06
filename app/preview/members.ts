export type Member = {
  slug: string
  name: string
  title: string
  twitter: string
  twitterUrl: string
  description: string
}

export const members: Member[] = [
  {
    slug: 'mushatter',
    name: '武者慶佑',
    title: '名誉会長',
    twitter: '@mushatter',
    twitterUrl: 'https://x.com/mushatter',
    description: 'フリーランス。日本グミ協会の創設メンバーとして長年グミ文化の普及に貢献。テレビ番組「マツコの知らない世界」への出演でグミの魅力を全国に発信した。',
  },
  {
    slug: 'aiueoka5',
    name: 'あいうえお',
    title: '会長',
    twitter: '@aiueoka5',
    twitterUrl: 'https://lit.link/aiueoka5',
    description: 'SNSでグミ情報を発信し続けるグミのプロフェッショナル。フォロワー24,000人超のグミ専門アカウント「A I U E O グミチャンネル」を運営。',
  },
  {
    slug: 'kotobukiyume',
    name: '琴吹ゆめ',
    title: 'バーチャル副会長',
    twitter: '@寿夢',
    twitterUrl: 'https://x.com/KotobukiYume',
    description: 'グミ・コスメ・アイドルをこよなく愛するバーチャル副会長。SNSやYouTubeでグミの魅力を発信中。',
  },
  {
    slug: 'yumemaru',
    name: 'ゆめまる（東海オンエア）',
    title: '名誉会員',
    twitter: '東海オンエア',
    twitterUrl: 'https://www.youtube.com/@tokaioncue',
    description: 'チャンネル登録者数1,000万人超の人気YouTubeグループ「東海オンエア」のメンバー。日本グミ協会の名誉会員として認定され、グミ文化の普及に貢献。',
  },
]
