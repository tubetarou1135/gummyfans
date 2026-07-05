import type { MetadataRoute } from 'next'
import { supabase } from '@/lib/supabase'

const BASE = 'https://gummyfans.vercel.app'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { data } = await supabase.from('gummies').select('id,created_at')

  const gummyUrls: MetadataRoute.Sitemap = (data ?? []).map((g) => ({
    url: `${BASE}/gummy/${g.id}`,
    lastModified: g.created_at,
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  return [
    { url: BASE, changeFrequency: 'daily', priority: 1.0 },
    { url: `${BASE}/ranking`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE}/request`, changeFrequency: 'monthly', priority: 0.5 },
    ...gummyUrls,
  ]
}
