/**
 * SLP Specialist Directory — Seed Script
 *
 * Pulls SLPs from the NPI Registry API (taxonomy code 235Z00000X — Speech-Language Pathologist)
 * for the top 50 US metro areas and inserts them into slp_listings.
 *
 * Usage:
 *   SUPABASE_URL=https://fbuqrnzofktepkzyfmhy.supabase.co \
 *   SUPABASE_SERVICE_ROLE_KEY=... \
 *   npx tsx scripts/seed.ts
 *
 * Data source: https://npiregistry.cms.hhs.gov/api/
 * No API key required. Returns individual SLPs (entity_type_code=1).
 * Taxonomy: 235Z00000X (Speech-Language Pathologist)
 */

import https from 'https'

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://fbuqrnzofktepkzyfmhy.supabase.co'
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

const TABLE = 'slp_listings'
const NPI_TAXONOMY = '235Z00000X'

const TOP_CITIES = [
  { city: 'New York', state: 'NY' },
  { city: 'Los Angeles', state: 'CA' },
  { city: 'Chicago', state: 'IL' },
  { city: 'Houston', state: 'TX' },
  { city: 'Phoenix', state: 'AZ' },
  { city: 'Philadelphia', state: 'PA' },
  { city: 'San Antonio', state: 'TX' },
  { city: 'San Diego', state: 'CA' },
  { city: 'Dallas', state: 'TX' },
  { city: 'San Jose', state: 'CA' },
  { city: 'Austin', state: 'TX' },
  { city: 'Jacksonville', state: 'FL' },
  { city: 'Fort Worth', state: 'TX' },
  { city: 'Columbus', state: 'OH' },
  { city: 'Charlotte', state: 'NC' },
  { city: 'Indianapolis', state: 'IN' },
  { city: 'San Francisco', state: 'CA' },
  { city: 'Seattle', state: 'WA' },
  { city: 'Denver', state: 'CO' },
  { city: 'Nashville', state: 'TN' },
  { city: 'Oklahoma City', state: 'OK' },
  { city: 'El Paso', state: 'TX' },
  { city: 'Washington', state: 'DC' },
  { city: 'Las Vegas', state: 'NV' },
  { city: 'Louisville', state: 'KY' },
  { city: 'Memphis', state: 'TN' },
  { city: 'Portland', state: 'OR' },
  { city: 'Baltimore', state: 'MD' },
  { city: 'Milwaukee', state: 'WI' },
  { city: 'Albuquerque', state: 'NM' },
  { city: 'Tucson', state: 'AZ' },
  { city: 'Fresno', state: 'CA' },
  { city: 'Sacramento', state: 'CA' },
  { city: 'Mesa', state: 'AZ' },
  { city: 'Kansas City', state: 'MO' },
  { city: 'Atlanta', state: 'GA' },
  { city: 'Omaha', state: 'NE' },
  { city: 'Colorado Springs', state: 'CO' },
  { city: 'Raleigh', state: 'NC' },
  { city: 'Long Beach', state: 'CA' },
  { city: 'Virginia Beach', state: 'VA' },
  { city: 'Minneapolis', state: 'MN' },
  { city: 'Tampa', state: 'FL' },
  { city: 'New Orleans', state: 'LA' },
  { city: 'Arlington', state: 'TX' },
  { city: 'Wichita', state: 'KS' },
  { city: 'Bakersfield', state: 'CA' },
  { city: 'Aurora', state: 'CO' },
  { city: 'Anaheim', state: 'CA' },
  { city: 'Santa Ana', state: 'CA' },
]

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

function httpsGet(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = ''
      res.on('data', (chunk) => (data += chunk))
      res.on('end', () => resolve(data))
    }).on('error', reject)
  })
}

async function queryNPI(city: string, state: string): Promise<Array<Record<string, unknown>>> {
  const url = `https://npiregistry.cms.hhs.gov/api/?version=2.1&taxonomy_description=${NPI_TAXONOMY}&city=${encodeURIComponent(city)}&state=${state}&entity_type_code=1&limit=100`
  const raw = await httpsGet(url)
  const json = JSON.parse(raw)
  return json.results ?? []
}

async function supabaseUpsert(records: Array<Record<string, unknown>>): Promise<number> {
  const body = JSON.stringify(records)
  return new Promise((resolve, reject) => {
    const url = new URL(`${SUPABASE_URL}/rest/v1/${TABLE}`)
    const options = {
      hostname: url.hostname,
      path: `${url.pathname}?on_conflict=slug`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Prefer': 'resolution=ignore-duplicates',
        'Content-Length': Buffer.byteLength(body),
      },
    }
    const req = https.request(options, (res) => {
      let data = ''
      res.on('data', (chunk) => (data += chunk))
      res.on('end', () => {
        if (res.statusCode && res.statusCode >= 400) {
          console.error('Supabase error:', res.statusCode, data)
          resolve(0)
        } else {
          resolve(records.length)
        }
      })
    })
    req.on('error', reject)
    req.write(body)
    req.end()
  })
}

interface NPIResult {
  number?: string
  basic?: {
    first_name?: string
    last_name?: string
    middle_name?: string
    name_prefix?: string
    credential?: string
  }
  addresses?: Array<{
    address_purpose?: string
    address_1?: string
    city?: string
    state?: string
    postal_code?: string
    telephone_number?: string
  }>
  taxonomies?: Array<{
    primary?: boolean
    desc?: string
  }>
}

function parseNPIRecord(record: NPIResult, existingSlugs: Set<string>): Record<string, unknown> | null {
  const basic = record.basic
  if (!basic) return null

  const firstName = basic.first_name ?? ''
  const lastName = basic.last_name ?? ''
  const fullName = `${firstName} ${lastName}`.trim()
  if (!fullName || fullName.length < 3) return null

  const credentials = basic.credential ?? null

  const practiceAddress = record.addresses?.find(a => a.address_purpose === 'LOCATION')
    ?? record.addresses?.[0]

  const city = practiceAddress?.city ?? ''
  const state = practiceAddress?.state ?? ''
  const zip = practiceAddress?.postal_code?.slice(0, 5) ?? null
  const phone = practiceAddress?.telephone_number ?? null

  if (!city || !state) return null

  const baseSlug = slugify(`${fullName} ${city} ${state}`)
  let slug = baseSlug
  let attempt = 0
  while (existingSlugs.has(slug)) {
    attempt++
    slug = `${baseSlug}-${Math.random().toString(36).slice(2, 6)}`
    if (attempt > 10) return null
  }
  existingSlugs.add(slug)

  return {
    slug,
    full_name: fullName,
    credentials,
    npi_number: record.number ?? null,
    city,
    state,
    zip,
    phone,
    is_claimed: false,
    is_verified: false,
    listing_tier: 'free',
    listing_tier_rank: 0,
    is_active: true,
    is_approved: true,
    do_not_email: false,
    email_source: 'npi',
    outreach_step: 0,
  }
}

async function main() {
  console.log('SLP Specialist Directory — NPI Seed Script')
  console.log(`Target: ${TOP_CITIES.length} cities`)

  let total = 0
  const existingSlugs = new Set<string>()

  for (const { city, state } of TOP_CITIES) {
    try {
      const results = await queryNPI(city, state)
      if (!results.length) {
        console.log(`${city}, ${state}: 0 results`)
        continue
      }

      const records = results
        .map(r => parseNPIRecord(r as NPIResult, existingSlugs))
        .filter(Boolean) as Array<Record<string, unknown>>

      if (records.length === 0) continue

      const inserted = await supabaseUpsert(records)
      total += inserted
      console.log(`${city}, ${state}: ${records.length} records (total: ${total})`)

      // Rate limit: 1 req/sec to NPI API
      await new Promise(resolve => setTimeout(resolve, 1000))
    } catch (err) {
      console.error(`Error processing ${city}, ${state}:`, err)
    }
  }

  console.log(`\n✅ Seed complete. Total inserted: ${total}`)
}

main().catch(console.error)
