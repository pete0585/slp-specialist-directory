import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { MapPin, Phone, Globe, CheckCircle } from 'lucide-react'
import { getListingBySlug, getAllSlugs } from '@/lib/data'
import { formatPhone, toTitleCase, SPECIALTIES, stateAbbrevToName } from '@/lib/utils'

interface PageProps {
  params: Promise<{ state: string; city: string; slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const listing = await getListingBySlug(slug).catch(() => null)
  if (!listing) return { title: 'SLP Not Found' }

  const specialty = listing.specialties?.[0]
    ? (SPECIALTIES[listing.specialties[0]]?.name ?? listing.specialties[0].replace(/-/g, ' '))
    : 'Speech-Language Pathologist'

  return {
    title: `${listing.full_name}${listing.credentials ? `, ${listing.credentials}` : ''} — ${listing.city} ${specialty} | SLP Specialist Directory`,
    description: `Find ${listing.full_name}${listing.credentials ? `, ${listing.credentials},` : ''} in ${listing.city}, ${listing.state}. ${listing.specialties?.length ? `Specializes in ${listing.specialties.slice(0, 3).map(s => SPECIALTIES[s]?.name ?? s).join(', ')}.` : ''} ${listing.telehealth_available ? 'Telehealth available.' : ''} ${listing.insurance_accepted ? 'Insurance accepted.' : ''}`.trim(),
    openGraph: {
      title: `${listing.full_name} — ${specialty} in ${listing.city}, ${listing.state}`,
      description: `SLP specialist profile for ${listing.full_name} at SLP Specialist Directory.`,
    },
  }
}

export async function generateStaticParams() {
  const slugs = await getAllSlugs().catch(() => [])
  return slugs.slice(0, 1000).map(({ slug, city, state }) => ({
    state: state.toLowerCase(),
    city: city.toLowerCase().replace(/\s+/g, '-'),
    slug,
  }))
}

export default async function ListingDetailPage({ params }: PageProps) {
  const { slug } = await params
  const listing = await getListingBySlug(slug).catch(() => null)
  if (!listing) notFound()

  const citySlug = listing.city.toLowerCase().replace(/\s+/g, '-')
  const stateSlug = listing.state.toLowerCase()
  const stateName = stateAbbrevToName(listing.state)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'MedicalBusiness',
    name: listing.full_name,
    description: listing.bio ?? `Speech-Language Pathologist in ${listing.city}, ${listing.state}`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: listing.city,
      addressRegion: listing.state,
      postalCode: listing.zip ?? '',
      addressCountry: 'US',
    },
    ...(listing.phone ? { telephone: listing.phone } : {}),
    ...(listing.website_url ? { url: listing.website_url } : {}),
    medicalSpecialty: listing.specialties?.map(s => SPECIALTIES[s]?.name ?? s) ?? ['Speech-Language Pathology'],
    knowsAbout: listing.specialties?.map(s => SPECIALTIES[s]?.name ?? s) ?? [],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumbs */}
      <div className="bg-gray-50 border-b border-gray-200 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="text-sm text-gray-500 flex items-center gap-2 flex-wrap">
            <Link href="/" className="hover:text-brand-emerald">Home</Link>
            <span>/</span>
            <Link href="/slp" className="hover:text-brand-emerald">Find an SLP</Link>
            <span>/</span>
            <Link href={`/slp?state=${listing.state}`} className="hover:text-brand-emerald">{stateName}</Link>
            <span>/</span>
            <Link href={`/slp?city=${encodeURIComponent(listing.city)}&state=${listing.state}`} className="hover:text-brand-emerald">
              {toTitleCase(listing.city)}
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-medium truncate">{listing.full_name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile header */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-start gap-4">
                {listing.photo_url ? (
                  <img
                    src={listing.photo_url}
                    alt={listing.full_name}
                    className="w-20 h-20 rounded-full object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-brand-emerald-light flex items-center justify-center flex-shrink-0">
                    <span className="text-brand-emerald font-bold text-2xl">
                      {listing.full_name.charAt(0)}
                    </span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <div>
                      <h1 className="text-2xl font-extrabold text-brand-slate leading-tight">
                        {listing.full_name}
                        {listing.credentials && (
                          <span className="text-gray-500 font-normal text-lg">, {listing.credentials}</span>
                        )}
                      </h1>
                      {listing.practice_name && (
                        <p className="text-gray-600 mt-0.5">{listing.practice_name}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {listing.listing_tier === 'featured' && <span className="badge-featured">Featured ⭐</span>}
                      {listing.listing_tier === 'verified' && <span className="badge-verified">✓ Verified</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-gray-500 mt-2">
                    <MapPin className="w-4 h-4 flex-shrink-0" aria-label="Location" />
                    <span>{toTitleCase(listing.city)}, {listing.state}</span>
                  </div>
                </div>
              </div>

              {listing.bio && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-gray-700 leading-relaxed">{listing.bio}</p>
                </div>
              )}
            </div>

            {/* Specialties */}
            {listing.specialties && listing.specialties.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h2 className="font-bold text-brand-slate text-lg mb-4">Specialties</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {listing.specialties.map((s) => {
                    const info = SPECIALTIES[s]
                    return (
                      <Link
                        key={s}
                        href={`/speech-therapist/${s}`}
                        className="flex items-start gap-3 p-3 rounded-xl bg-brand-emerald-light hover:bg-brand-emerald-mid transition-colors"
                      >
                        <span className="text-2xl">{info?.icon ?? '🗣️'}</span>
                        <div>
                          <div className="font-semibold text-brand-emerald-dark text-sm">
                            {info?.name ?? toTitleCase(s.replace(/-/g, ' '))}
                          </div>
                          {info?.description && (
                            <div className="text-xs text-gray-600 mt-0.5 line-clamp-2">{info.description}</div>
                          )}
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Credential badges */}
            {listing.credential_badges && listing.credential_badges.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h2 className="font-bold text-brand-slate text-lg mb-4">Credentials &amp; Certifications</h2>
                <div className="flex flex-wrap gap-2">
                  {listing.credential_badges.map((badge) => (
                    <span key={badge} className="badge-credential text-sm px-3 py-1">
                      <CheckCircle className="w-3.5 h-3.5 inline mr-1" aria-label="Verified" />
                      {badge}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Contact card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="font-bold text-brand-slate mb-4">Contact Information</h2>
              <div className="space-y-3">
                {listing.phone && (
                  <a href={`tel:${listing.phone}`} className="flex items-center gap-3 text-brand-emerald font-medium hover:underline">
                    <Phone className="w-4 h-4 flex-shrink-0" aria-label="Phone" />
                    {formatPhone(listing.phone)}
                  </a>
                )}
                {listing.website_url && (
                  <a
                    href={listing.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-brand-emerald font-medium hover:underline"
                  >
                    <Globe className="w-4 h-4 flex-shrink-0" aria-label="Website" />
                    Visit Website
                  </a>
                )}
                {!listing.phone && !listing.website_url && (
                  <p className="text-sm text-gray-500 italic">Contact info not yet claimed.</p>
                )}
              </div>

              {listing.telehealth_available && (
                <div className="mt-4 p-3 bg-purple-50 rounded-xl">
                  <div className="flex items-center gap-2">
                    <span className="text-purple-600">💻</span>
                    <span className="text-sm font-semibold text-purple-800">Telehealth Available</span>
                  </div>
                  <p className="text-xs text-purple-700 mt-1">This SLP offers virtual appointments.</p>
                </div>
              )}

              {listing.insurance_accepted && (
                <div className="mt-3 p-3 bg-green-50 rounded-xl">
                  <div className="flex items-center gap-2">
                    <span>🏥</span>
                    <span className="text-sm font-semibold text-green-800">Insurance Accepted</span>
                  </div>
                </div>
              )}

              {listing.languages_spoken && listing.languages_spoken.length > 0 && (
                <div className="mt-3">
                  <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">Languages</p>
                  <div className="flex flex-wrap gap-1">
                    {listing.languages_spoken.map((lang) => (
                      <span key={lang} className="text-xs px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full">{lang}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Claim / upgrade CTA */}
            {!listing.is_claimed ? (
              <div className="bg-brand-amber-light rounded-2xl border border-brand-amber/20 p-5">
                <h3 className="font-bold text-brand-slate mb-2">Is this your practice?</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Claim this listing to add your full bio, specialties, contact info, and get priority placement in search results.
                </p>
                <Link href={`/claim/${listing.id}`} className="btn-amber w-full block text-center">
                  Claim This Listing
                </Link>
              </div>
            ) : listing.listing_tier === 'free' && (
              <div className="bg-brand-emerald-light rounded-2xl border border-brand-emerald/20 p-5">
                <h3 className="font-bold text-brand-slate mb-2">Upgrade to Verified</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Get top-of-results placement and a verified badge for just $99/year. One new patient pays for 1–3 years.
                </p>
                <Link href={`/claim/${listing.id}?verified=true`} className="btn-primary w-full block text-center">
                  Upgrade — $99/yr
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
