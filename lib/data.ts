import { createServiceClient, createStaticClient } from '@/lib/supabase/server'
import type { SLPListing, BrowseFilters } from '@/lib/types'

const TABLE = 'slp_listings'

export async function getFeaturedListings(limit = 6): Promise<SLPListing[]> {
  const supabase = await createServiceClient()
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('is_active', true)
    .eq('is_approved', true)
    .in('listing_tier', ['featured', 'verified'])
    .order('listing_tier_rank', { ascending: false })
    .limit(limit)

  if (error) throw error
  return (data ?? []) as SLPListing[]
}

export async function getTotalCount(): Promise<number> {
  const supabase = createStaticClient()
  const { count } = await supabase
    .from(TABLE)
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true)
    .eq('is_approved', true)

  return count ?? 0
}

export async function getListingBySlug(slug: string): Promise<SLPListing | null> {
  const supabase = await createServiceClient()
  const { data } = await supabase
    .from(TABLE)
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  return (data ?? null) as SLPListing | null
}

export async function getListingById(id: string): Promise<SLPListing | null> {
  const supabase = await createServiceClient()
  const { data } = await supabase
    .from(TABLE)
    .select('*')
    .eq('id', id)
    .single()

  return (data ?? null) as SLPListing | null
}

export async function browseListings(filters: BrowseFilters): Promise<{ listings: SLPListing[]; total: number }> {
  const supabase = createStaticClient()
  const page = filters.page ?? 1
  const pageSize = 20
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  let query = supabase
    .from(TABLE)
    .select('*', { count: 'exact' })
    .eq('is_active', true)
    .eq('is_approved', true)

  if (filters.state) query = query.ilike('state', filters.state)
  if (filters.city) query = query.ilike('city', `%${filters.city}%`)
  if (filters.specialty) query = query.contains('specialties', [filters.specialty])
  if (filters.telehealth) query = query.eq('telehealth_available', true)
  if (filters.insurance) query = query.eq('insurance_accepted', true)
  if (filters.tier) query = query.eq('listing_tier', filters.tier)
  if (filters.q) {
    query = query.textSearch('search_vector', filters.q, { type: 'websearch' })
  }

  const { data, count, error } = await query
    .order('listing_tier_rank', { ascending: false })
    .order('full_name', { ascending: true })
    .range(from, to)

  if (error) throw error
  return { listings: (data ?? []) as SLPListing[], total: count ?? 0 }
}

export async function getListingsBySpecialty(specialty: string, limit = 50): Promise<SLPListing[]> {
  const supabase = createStaticClient()
  const { data } = await supabase
    .from(TABLE)
    .select('*')
    .eq('is_active', true)
    .eq('is_approved', true)
    .contains('specialties', [specialty])
    .order('listing_tier_rank', { ascending: false })
    .order('full_name', { ascending: true })
    .limit(limit)

  return (data ?? []) as SLPListing[]
}

export async function getCityListings(city: string, state: string, limit = 50): Promise<SLPListing[]> {
  const supabase = createStaticClient()
  const { data } = await supabase
    .from(TABLE)
    .select('*')
    .eq('is_active', true)
    .eq('is_approved', true)
    .ilike('city', city)
    .ilike('state', state)
    .order('listing_tier_rank', { ascending: false })
    .order('full_name', { ascending: true })
    .limit(limit)

  return (data ?? []) as SLPListing[]
}

export async function getAllSlugs(): Promise<Array<{ slug: string; city: string; state: string }>> {
  const supabase = createStaticClient()
  const { data } = await supabase
    .from(TABLE)
    .select('slug, city, state')
    .eq('is_active', true)
    .eq('is_approved', true)

  return (data ?? []) as Array<{ slug: string; city: string; state: string }>
}

export async function getTopCities(limit = 24): Promise<Array<{ city: string; state: string; count: number }>> {
  const supabase = createStaticClient()
  const { data } = await supabase
    .from(TABLE)
    .select('city, state')
    .eq('is_active', true)
    .eq('is_approved', true)

  const counts: Record<string, { city: string; state: string; count: number }> = {}
  for (const row of data ?? []) {
    const key = `${row.city}|${row.state}`
    if (!counts[key]) counts[key] = { city: row.city, state: row.state, count: 0 }
    counts[key].count++
  }

  return Object.values(counts)
    .sort((a, b) => b.count - a.count)
    .slice(0, limit)
}

export async function getStateCounts(): Promise<Record<string, number>> {
  const supabase = createStaticClient()
  const { data } = await supabase
    .from(TABLE)
    .select('state')
    .eq('is_active', true)
    .eq('is_approved', true)

  const counts: Record<string, number> = {}
  for (const row of data ?? []) {
    counts[row.state] = (counts[row.state] ?? 0) + 1
  }
  return counts
}
