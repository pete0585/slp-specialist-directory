import type { MetadataRoute } from 'next'
import { getAllSlugs, getTopCities } from '@/lib/data'
import { SPECIALTIES } from '@/lib/utils'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.findslpspecialist.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [slugs, topCities] = await Promise.all([
    getAllSlugs().catch(() => []),
    getTopCities(100).catch(() => []),
  ])

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${siteUrl}/slp`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${siteUrl}/submit`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
  ]

  const specialtyRoutes: MetadataRoute.Sitemap = Object.keys(SPECIALTIES).map((slug) => ({
    url: `${siteUrl}/speech-therapist/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.85,
  }))

  const cityRoutes: MetadataRoute.Sitemap = topCities.map(({ city, state }) => ({
    url: `${siteUrl}/slp?city=${encodeURIComponent(city)}&state=${state}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.75,
  }))

  const listingRoutes: MetadataRoute.Sitemap = slugs.slice(0, 5000).map(({ slug, city, state }) => ({
    url: `${siteUrl}/slp/${state.toLowerCase()}/${city.toLowerCase().replace(/\s+/g, '-')}/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  return [...staticRoutes, ...specialtyRoutes, ...cityRoutes, ...listingRoutes]
}
