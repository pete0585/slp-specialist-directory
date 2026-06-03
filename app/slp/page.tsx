import type { Metadata } from 'next'
import Link from 'next/link'
import { MapPin, ChevronLeft, ChevronRight } from 'lucide-react'
import { browseListings } from '@/lib/data'
import { formatPhone, SPECIALTIES, stateAbbrevToName } from '@/lib/utils'
import type { SLPListing } from '@/lib/types'

interface PageProps {
  searchParams: Promise<{
    q?: string
    specialty?: string
    state?: string
    city?: string
    telehealth?: string
    insurance?: string
    tier?: string
    page?: string
  }>
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const sp = await searchParams
  const specialty = sp.specialty ? SPECIALTIES[sp.specialty]?.name ?? sp.specialty : null
  const state = sp.state ? stateAbbrevToName(sp.state) : null

  const titleParts = ['Find an SLP']
  if (specialty) titleParts.push(`— ${specialty} Specialists`)
  if (state) titleParts.push(`in ${state}`)

  return {
    title: titleParts.join(' '),
    description: `Search ${specialty ? `${specialty} SLPs` : 'speech-language pathologists'}${state ? ` in ${state}` : ' nationwide'}. Filter by specialty, telehealth, and insurance.`,
  }
}

export default async function BrowsePage({ searchParams }: PageProps) {
  const sp = await searchParams
  const page = parseInt(sp.page ?? '1', 10)

  const { listings, total } = await browseListings({
    q: sp.q,
    specialty: sp.specialty,
    state: sp.state,
    city: sp.city,
    telehealth: sp.telehealth === 'true',
    insurance: sp.insurance === 'true',
    tier: sp.tier,
    page,
  }).catch(() => ({ listings: [], total: 0 }))

  const totalPages = Math.ceil(total / 20)
  const activeSpecialty = sp.specialty ? SPECIALTIES[sp.specialty] : null
  const activeState = sp.state ? stateAbbrevToName(sp.state) : null

  const buildUrl = (overrides: Record<string, string | undefined>) => {
    const params = new URLSearchParams()
    const merged = { q: sp.q, specialty: sp.specialty, state: sp.state, city: sp.city, telehealth: sp.telehealth, insurance: sp.insurance, tier: sp.tier, ...overrides }
    Object.entries(merged).forEach(([k, v]) => { if (v) params.set(k, v) })
    const qs = params.toString()
    return `/slp${qs ? `?${qs}` : ''}`
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page header */}
      <div className="bg-brand-slate text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {activeSpecialty ? (
            <>
              <div className="text-brand-emerald text-3xl mb-2">{activeSpecialty.icon}</div>
              <h1 className="text-3xl font-extrabold mb-2">
                {activeSpecialty.name} Specialists
                {activeState ? ` in ${activeState}` : ''}
              </h1>
              <p className="text-gray-300 text-sm max-w-xl">{activeSpecialty.description}</p>
            </>
          ) : (
            <>
              <h1 className="text-3xl font-extrabold mb-2">
                {activeState ? `Speech-Language Pathologists in ${activeState}` : 'Find a Speech-Language Pathologist'}
              </h1>
              <p className="text-gray-300 text-sm">
                {total > 0 ? `${total.toLocaleString()} SLPs` : 'Search results'} — filter by specialty, telehealth, and insurance below
              </p>
            </>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar filters */}
          <aside className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h2 className="font-bold text-brand-slate text-sm mb-4">Filters</h2>

              {/* Search */}
              <div className="mb-4">
                <label className="label">Search</label>
                <form action="/slp" method="get">
                  {sp.specialty && <input type="hidden" name="specialty" value={sp.specialty} />}
                  {sp.state && <input type="hidden" name="state" value={sp.state} />}
                  {sp.city && <input type="hidden" name="city" value={sp.city} />}
                  <input type="text" name="q" defaultValue={sp.q} className="input" placeholder="Name or keyword..." />
                  <button type="submit" className="mt-2 w-full btn-primary py-2 text-xs">Search</button>
                </form>
              </div>

              {/* Specialty filter */}
              <div className="mb-4">
                <label className="label">Specialty</label>
                <div className="space-y-1.5">
                  <Link
                    href={buildUrl({ specialty: undefined, page: '1' })}
                    className={`block text-sm px-3 py-1.5 rounded-lg transition-colors ${!sp.specialty ? 'bg-brand-emerald text-white' : 'hover:bg-gray-100 text-gray-700'}`}
                  >
                    All Specialties
                  </Link>
                  {Object.entries(SPECIALTIES).map(([slug, info]) => (
                    <Link
                      key={slug}
                      href={buildUrl({ specialty: slug, page: '1' })}
                      className={`block text-sm px-3 py-1.5 rounded-lg transition-colors ${sp.specialty === slug ? 'bg-brand-emerald text-white' : 'hover:bg-gray-100 text-gray-700'}`}
                    >
                      {info.icon} {info.name}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Boolean filters */}
              <div className="mb-4 space-y-2">
                <label className="label">Options</label>
                <Link
                  href={buildUrl({ telehealth: sp.telehealth === 'true' ? undefined : 'true', page: '1' })}
                  className={`flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg transition-colors ${sp.telehealth === 'true' ? 'bg-brand-emerald text-white' : 'hover:bg-gray-100 text-gray-700'}`}
                >
                  💻 Telehealth Available
                </Link>
                <Link
                  href={buildUrl({ insurance: sp.insurance === 'true' ? undefined : 'true', page: '1' })}
                  className={`flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg transition-colors ${sp.insurance === 'true' ? 'bg-green-600 text-white' : 'hover:bg-gray-100 text-gray-700'}`}
                >
                  🏥 Insurance Accepted
                </Link>
              </div>

              {(sp.q || sp.specialty || sp.state || sp.city || sp.telehealth || sp.insurance) && (
                <Link href="/slp" className="block text-center text-xs text-gray-500 hover:text-red-600 mt-3">
                  Clear all filters
                </Link>
              )}
            </div>
          </aside>

          {/* Results */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-500">
                {total > 0 ? `${total.toLocaleString()} SLP${total !== 1 ? 's' : ''} found` : 'No results'}
              </p>
            </div>

            {listings.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                <div className="text-5xl mb-4">🔍</div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">No SLPs found</h2>
                <p className="text-gray-500 mb-6">Try adjusting your filters or searching a different area.</p>
                <Link href="/slp" className="btn-primary">Clear Filters</Link>
              </div>
            ) : (
              <div className="space-y-4">
                {listings.map((listing) => (
                  <BrowseListingCard key={listing.id} listing={listing} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 mt-8">
                {page > 1 && (
                  <Link href={buildUrl({ page: String(page - 1) })} className="flex items-center gap-1 btn-secondary py-2 px-4 text-sm">
                    <ChevronLeft className="w-4 h-4" aria-label="" /> Previous
                  </Link>
                )}
                <span className="text-sm text-gray-600">Page {page} of {totalPages}</span>
                {page < totalPages && (
                  <Link href={buildUrl({ page: String(page + 1) })} className="flex items-center gap-1 btn-secondary py-2 px-4 text-sm">
                    Next <ChevronRight className="w-4 h-4" aria-label="" />
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function BrowseListingCard({ listing }: { listing: SLPListing }) {
  const citySlug = listing.city.toLowerCase().replace(/\s+/g, '-')
  const stateSlug = listing.state.toLowerCase()

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-5">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <Link
              href={`/slp/${stateSlug}/${citySlug}/${listing.slug}`}
              className="font-bold text-gray-900 hover:text-brand-emerald text-lg transition-colors"
            >
              {listing.full_name}
              {listing.credentials && <span className="text-gray-500 font-normal text-sm">, {listing.credentials}</span>}
            </Link>
            {listing.listing_tier === 'featured' && <span className="badge-featured">Featured ⭐</span>}
            {listing.listing_tier === 'verified' && <span className="badge-verified">✓ Verified</span>}
          </div>
          {listing.practice_name && (
            <p className="text-sm text-gray-500 mb-1">{listing.practice_name}</p>
          )}
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <MapPin className="w-3.5 h-3.5 flex-shrink-0" aria-label="Location" />
            <span>{listing.city}, {listing.state}</span>
          </div>
          {listing.bio && (
            <p className="text-sm text-gray-600 mt-2 line-clamp-2">{listing.bio}</p>
          )}
        </div>

        <div className="flex flex-col items-end gap-2">
          {!listing.is_claimed ? (
            <Link
              href={`/claim/${listing.id}`}
              className="text-xs px-3 py-1.5 border border-brand-amber text-brand-amber rounded-lg hover:bg-brand-amber-light transition-colors font-medium"
            >
              Claim Listing
            </Link>
          ) : (
            <Link
              href={`/slp/${stateSlug}/${citySlug}/${listing.slug}`}
              className="text-xs px-3 py-1.5 btn-primary py-1.5"
            >
              View Profile
            </Link>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mt-3">
        {listing.specialties?.slice(0, 5).map((s) => (
          <Link
            key={s}
            href={`/speech-therapist/${s}`}
            className="badge-specialty hover:bg-brand-emerald hover:text-white transition-colors"
          >
            {SPECIALTIES[s]?.icon ?? '🗣️'} {SPECIALTIES[s]?.name ?? s.replace(/-/g, ' ')}
          </Link>
        ))}
        {listing.telehealth_available && <span className="badge-telehealth">💻 Telehealth</span>}
        {listing.insurance_accepted && (
          <span className="text-xs px-2 py-0.5 bg-green-50 text-green-700 rounded-full">Insurance Accepted</span>
        )}
      </div>

      {listing.phone && (
        <div className="mt-3 text-sm text-brand-emerald font-medium">
          📞 {formatPhone(listing.phone)}
        </div>
      )}
    </div>
  )
}
