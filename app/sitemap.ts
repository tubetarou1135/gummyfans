import type { MetadataRoute } from 'next'
import { supabase } from '@/lib/supabase'

const BASE = 'https://www.gummyfans.jp'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { data } = await supabase
    .from('gummies_with_avg')
    .select('id,created_at')
    .eq('published', true)

  const gummyUrls: MetadataRoute.Sitemap = (data ?? []).map((g) => ({
    url: `${BASE}/gummy/${g.id}`,
    lastModified: g.created_at,
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  return [
    { url: BASE, changeFrequency: 'daily', priority: 1.0 },
    { url: `${BASE}/ranking`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE}/new`, changeFrequency: 'daily', priority: 0.8 },
    { url: `${BASE}/request`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/about`, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${BASE}/contact`, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${BASE}/privacy`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE}/terms`, changeFrequency: 'yearly', priority: 0.3 },
    ...gummyUrls,
  ]
}
