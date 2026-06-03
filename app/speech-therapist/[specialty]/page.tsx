import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { MapPin, ChevronRight } from 'lucide-react'
import { getListingsBySpecialty } from '@/lib/data'
import { formatPhone, SPECIALTIES, toTitleCase } from '@/lib/utils'
import type { SLPListing } from '@/lib/types'

interface PageProps {
  params: Promise<{ specialty: string }>
}

export async function generateStaticParams() {
  return Object.keys(SPECIALTIES).map((slug) => ({ specialty: slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { specialty } = await params
  const info = SPECIALTIES[specialty]
  if (!info) return { title: 'Specialty Not Found' }

  return {
    title: `${info.name} Speech Therapists — Find an SLP Near You`,
    description: `Find speech-language pathologists who specialize in ${info.name.toLowerCase()}. ${info.description} Search by location and filter for telehealth.`,
    openGraph: {
      title: `${info.name} Specialists — SLP Specialist Directory`,
      description: info.description,
    },
  }
}

export default async function SpecialtyPage({ params }: PageProps) {
  const { specialty } = await params
  const info = SPECIALTIES[specialty]
  if (!info) notFound()

  const listings = await getListingsBySpecialty(specialty, 50).catch(() => [])

  const cityGroups: Record<string, SLPListing[]> = {}
  for (const listing of listings) {
    const key = `${toTitleCase(listing.city)}, ${listing.state}`
    if (!cityGroups[key]) cityGroups[key] = []
    cityGroups[key].push(listing)
  }
  const topCities = Object.entries(cityGroups)
    .sort((a, b) => b[1].length - a[1].length)
    .slice(0, 12)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: `${info.name} Speech Therapists`,
    description: info.description,
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.findslpspecialist.com' },
        { '@type': 'ListItem', position: 2, name: 'Specialties', item: 'https://www.findslpspecialist.com/slp' },
        { '@type': 'ListItem', position: 3, name: info.name, item: `https://www.findslpspecialist.com/speech-therapist/${specialty}` },
      ],
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <section className="bg-brand-slate text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="text-sm text-gray-400 mb-4 flex items-center gap-2">
            <Link href="/" className="hover:text-white">Home</Link>
            <span>/</span>
            <Link href="/slp" className="hover:text-white">SLPs</Link>
            <span>/</span>
            <span className="text-white">{info.name}</span>
          </nav>
          <div className="text-5xl mb-3">{info.icon}</div>
          <h1 className="text-4xl font-extrabold mb-3">{info.name} Specialists</h1>
          <p className="text-gray-300 text-lg max-w-2xl mb-6">{info.description}</p>
          <div className="flex flex-wrap gap-3">
            <Link href={`/slp?specialty=${specialty}`} className="btn-primary">
              Browse All {info.name} SLPs
            </Link>
            <Link href={`/slp?specialty=${specialty}&telehealth=true`} className="btn-secondary">
              Telehealth Options
            </Link>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Top cities for this specialty */}
        {topCities.length > 0 && (
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-brand-slate mb-2">
              Find {info.name} Specialists by City
            </h2>
            <p className="text-gray-600 mb-6">
              {listings.length} SLP{listings.length !== 1 ? 's' : ''} in this directory specialize in {info.name.toLowerCase()}.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {topCities.map(([cityState, cityListings]) => (
                <Link
                  key={cityState}
                  href={`/slp?specialty=${specialty}&city=${encodeURIComponent(cityListings[0].city)}&state=${cityListings[0].state}`}
                  className="card p-3 hover:border-brand-emerald transition-all group"
                >
                  <div className="font-semibold text-sm text-gray-900 group-hover:text-brand-emerald">{cityState}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{cityListings.length} specialist{cityListings.length !== 1 ? 's' : ''}</div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Listings */}
        {listings.length > 0 && (
          <section className="mb-10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-brand-slate">
                {info.name} SLPs — All Locations
              </h2>
              <Link href={`/slp?specialty=${specialty}`} className="text-brand-emerald text-sm font-medium hover:underline flex items-center gap-1">
                View all <ChevronRight className="w-4 h-4" aria-label="" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {listings.slice(0, 12).map((listing) => (
                <SpecialtyListingCard key={listing.id} listing={listing} />
              ))}
            </div>
            {listings.length > 12 && (
              <div className="text-center mt-6">
                <Link href={`/slp?specialty=${specialty}`} className="btn-secondary">
                  View All {listings.length} {info.name} SLPs
                </Link>
              </div>
            )}
          </section>
        )}

        {listings.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center mb-10">
            <div className="text-5xl mb-4">{info.icon}</div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">No {info.name} specialists listed yet</h2>
            <p className="text-gray-500 mb-6">
              Be the first {info.name.toLowerCase()} specialist listed in this directory.
            </p>
            <Link href="/submit" className="btn-primary">Add Your Listing — Free</Link>
          </div>
        )}

        {/* Related specialties */}
        <section>
          <h2 className="text-2xl font-bold text-brand-slate mb-4">Related Specialties</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {Object.entries(SPECIALTIES)
              .filter(([s]) => s !== specialty)
              .slice(0, 8)
              .map(([slug, relInfo]) => (
                <Link
                  key={slug}
                  href={`/speech-therapist/${slug}`}
                  className="card p-4 hover:border-brand-emerald group"
                >
                  <div className="text-2xl mb-2">{relInfo.icon}</div>
                  <div className="font-semibold text-sm text-gray-900 group-hover:text-brand-emerald leading-tight">{relInfo.name}</div>
                </Link>
              ))}
          </div>
        </section>
      </div>
    </>
  )
}

function SpecialtyListingCard({ listing }: { listing: SLPListing }) {
  const citySlug = listing.city.toLowerCase().replace(/\s+/g, '-')
  const stateSlug = listing.state.toLowerCase()

  return (
    <Link href={`/slp/${stateSlug}/${citySlug}/${listing.slug}`} className="card p-4 hover:border-brand-emerald block">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div>
          <h3 className="font-bold text-gray-900 text-sm">
            {listing.full_name}
            {listing.credentials && <span className="text-gray-500 font-normal">, {listing.credentials}</span>}
          </h3>
          {listing.practice_name && (
            <p className="text-xs text-gray-500">{listing.practice_name}</p>
          )}
        </div>
        <div className="flex flex-col items-end gap-1">
          {listing.listing_tier === 'featured' && <span className="badge-featured text-xs">Featured ⭐</span>}
          {listing.listing_tier === 'verified' && <span className="badge-verified text-xs">✓ Verified</span>}
        </div>
      </div>
      <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
        <MapPin className="w-3 h-3" aria-label="Location" />
        <span>{toTitleCase(listing.city)}, {listing.state}</span>
      </div>
      <div className="flex flex-wrap gap-1">
        {listing.telehealth_available && <span className="badge-telehealth text-xs">💻 Telehealth</span>}
        {listing.insurance_accepted && (
          <span className="text-xs px-2 py-0.5 bg-green-50 text-green-700 rounded-full">Insurance</span>
        )}
      </div>
      {listing.phone && (
        <div className="mt-2 text-xs text-brand-emerald font-medium">📞 {formatPhone(listing.phone)}</div>
      )}
    </Link>
  )
}
