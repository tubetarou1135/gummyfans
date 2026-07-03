export function toMoshimoUrl(rakutenItemUrl: string): string {
  const a_id = process.env.NEXT_PUBLIC_MOSHIMO_A_ID
  if (!a_id) return rakutenItemUrl
  return `https://af.moshimo.com/af/c/click?a_id=${a_id}&p_id=54&pc_id=54&pl_id=616&url=${encodeURIComponent(rakutenItemUrl)}`
}
