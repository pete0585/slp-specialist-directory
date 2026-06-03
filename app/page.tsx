import type { Metadata } from 'next'
import Link from 'next/link'
import { MapPin, CheckCircle, Wifi, Users, ChevronRight, Search } from 'lucide-react'
import { getFeaturedListings, getTotalCount, getTopCities, getStateCounts } from '@/lib/data'
import { formatPhone, stateAbbrevToName, SPECIALTIES } from '@/lib/utils'
import type { SLPListing } from '@/lib/types'

export const metadata: Metadata = {
  title: 'SLP Specialist Directory — Find a Speech Therapist by Specialty',
  description: 'Find a speech-language pathologist who specializes in what your family needs. Search by condition: apraxia, feeding therapy, autism & AAC, aphasia, stuttering, voice disorders, dysphagia, and more.',
  openGraph: {
    title: 'Find a Speech Therapist Who Specializes in What You Need | SLP Specialist Directory',
    description: 'The only US-wide directory to find an SLP by specialty. Search feeding therapy, apraxia, aphasia, autism & AAC, stuttering, and more.',
  },
}

export const revalidate = 3600

export default async function HomePage() {
  const [totalCount, topCities, stateCounts, featuredListings] = await Promise.all([
    getTotalCount().catch(() => 0),
    getTopCities(24).catch(() => []),
    getStateCounts().catch(() => ({})),
    getFeaturedListings(6).catch(() => []),
  ])

  const stateList = Object.entries(stateCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)

  return (
    <div>
      {/* Hero */}
      <section className="bg-brand-slate text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-brand-emerald/20 text-brand-emerald px-3 py-1 rounded-full text-sm font-medium mb-6">
              <CheckCircle className="w-4 h-4" aria-label="Verified" />
              Free to search · No login required
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4">
              Find a speech therapist<br className="hidden md:block" /> who specializes in{' '}
              <span className="text-brand-emerald">what you need</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl">
              {totalCount > 0 ? `${totalCount.toLocaleString()}+ SLPs` : 'Thousands of SLPs'} searchable by specialty — feeding therapy, apraxia, autism &amp; AAC, aphasia, stuttering, voice disorders, and more.
              Find the right specialist, not just the nearest one.
            </p>
            <SearchHero />
            <div className="flex flex-wrap gap-3 mt-6">
              <QuickFilter href="/speech-therapist/feeding-therapy" label="🍼 Feeding Therapy" />
              <QuickFilter href="/speech-therapist/childhood-apraxia" label="🗣️ Apraxia" />
              <QuickFilter href="/speech-therapist/autism-aac" label="💬 Autism & AAC" />
              <QuickFilter href="/speech-therapist/aphasia" label="🧠 Aphasia" />
              <QuickFilter href="/speech-therapist/stuttering-fluency" label="🔊 Stuttering" />
              <QuickFilter href="/slp?telehealth=true" label="💻 Telehealth" />
            </div>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="bg-brand-emerald text-white py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-8 text-sm font-medium">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" aria-label="Check" />
              {totalCount > 0 ? `${totalCount.toLocaleString()}+` : '5,000+'} licensed SLPs
            </div>
            <div className="flex items-center gap-2">
              <Search className="w-5 h-5" aria-label="Search" />
              Specialty-first search
            </div>
            <div className="flex items-center gap-2">
              <Wifi className="w-5 h-5" aria-label="Telehealth" />
              Telehealth options included
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5" aria-label="Users" />
              NPI Registry verified
            </div>
          </div>
        </div>
      </section>

      {/* Specialty Browse */}
      <section className="py-14 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-brand-slate mb-3">Browse by Specialty</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Most SLP directories only let you search by location. This one lets you find the specialist your family actually needs.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-4">
            {Object.entries(SPECIALTIES).map(([slug, info]) => (
              <SpecialtyCard key={slug} slug={slug} name={info.name} icon={info.icon} description={info.description} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      {featuredListings.length > 0 && (
        <section className="py-12 bg-brand-emerald-light">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-brand-slate">Featured SLPs</h2>
              <Link href="/slp" className="text-brand-emerald hover:underline text-sm font-medium flex items-center gap-1">
                View all <ChevronRight className="w-4 h-4" aria-label="" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredListings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Browse by City */}
      {topCities.length > 0 && (
        <section className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-brand-slate mb-2">Browse by City</h2>
            <p className="text-gray-600 mb-8">Find speech-language pathologists in your metro area</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {topCities.map(({ city, state, count }) => (
                <Link
                  key={`${city}-${state}`}
                  href={`/slp?city=${encodeURIComponent(city)}&state=${state}`}
                  className="card p-3 text-center hover:border-brand-emerald hover:shadow-md transition-all group"
                >
                  <div className="font-semibold text-sm text-gray-900 group-hover:text-brand-emerald truncate">{city}</div>
                  <div className="text-xs text-gray-500">{state} · {count} SLPs</div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Browse by State */}
      {stateList.length > 0 && (
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-brand-slate mb-2">Browse by State</h2>
            <p className="text-gray-600 mb-8">SLP specialists available in every state</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {stateList.map(([state, count]) => (
                <Link
                  key={state}
                  href={`/slp?state=${state}`}
                  className="flex items-center justify-between p-3 rounded-xl border border-gray-200 hover:border-brand-emerald hover:bg-brand-emerald-light transition-all group"
                >
                  <span className="font-medium text-sm text-gray-900 group-hover:text-brand-emerald-dark truncate">{stateAbbrevToName(state)}</span>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full flex-shrink-0 ml-1">{count}</span>
                </Link>
              ))}
            </div>
            <div className="mt-6 text-center">
              <Link href="/slp" className="btn-secondary inline-flex">
                View All SLPs
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Why use this directory */}
      <section className="py-14 bg-brand-slate text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <h2 className="text-3xl font-bold mb-4">Why SLP Specialist Directory?</h2>
            <p className="text-gray-300">
              There are 200,000+ licensed SLPs in the US. Finding one who specializes in your child&apos;s
              exact condition — or your specific needs as an adult — is nearly impossible with generic directories.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <WhyCard
              icon="🔍"
              title="Specialty-first search"
              description="Search by condition, not just location. Find an SLP who specializes in childhood apraxia of speech, not just an SLP near you."
            />
            <WhyCard
              icon="📋"
              title="200,000+ SLPs indexed"
              description="Built from the NPI Registry — the most complete dataset of licensed SLPs in the US. Not just the 15,000 who paid ASHA membership dues."
            />
            <WhyCard
              icon="💻"
              title="Telehealth included"
              description="Rare specialists don't have to be local. Filter for SLPs who offer telehealth so your family can access the best specialist for your child's specific needs."
            />
          </div>
        </div>
      </section>

      {/* CTA for providers */}
      <section className="py-12 bg-brand-emerald-light">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-brand-slate mb-3">Are you an SLP in private practice?</h2>
          <p className="text-gray-600 mb-6 max-w-xl mx-auto">
            Parents are Googling &quot;[city] apraxia speech therapist&quot; and finding nothing.
            A verified listing on SLP Specialist Directory is the SEO channel you&apos;re missing.
            One new pediatric patient = $1,800–$6,000 first-year revenue.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/submit" className="btn-primary">
              Add Your Listing — Free
            </Link>
            <Link href="/slp" className="btn-secondary">
              Find Your Profile
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

function SearchHero() {
  return (
    <form action="/slp" method="get" className="flex flex-col sm:flex-row gap-3">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" aria-label="Search" />
        <input
          type="text"
          name="q"
          placeholder="Specialty, condition, or name..."
          className="w-full pl-10 pr-4 py-4 rounded-xl bg-white text-gray-900 placeholder-gray-400 border-0 focus:outline-none focus:ring-2 focus:ring-brand-emerald text-base shadow-lg"
        />
      </div>
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" aria-label="Location" />
        <input
          type="text"
          name="city"
          placeholder="City or state..."
          className="w-full sm:w-52 pl-10 pr-4 py-4 rounded-xl bg-white text-gray-900 placeholder-gray-400 border-0 focus:outline-none focus:ring-2 focus:ring-brand-emerald text-base shadow-lg"
        />
      </div>
      <button
        type="submit"
        className="px-8 py-4 bg-brand-amber text-white font-bold rounded-xl hover:bg-brand-amber-dark transition-colors text-base shadow-lg whitespace-nowrap"
      >
        Find SLPs
      </button>
    </form>
  )
}

function QuickFilter({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full text-sm font-medium transition-colors border border-white/20 hover:border-white/40"
    >
      {label}
    </Link>
  )
}

function SpecialtyCard({ slug, name, icon, description }: { slug: string; name: string; icon: string; description: string }) {
  return (
    <Link
      href={`/speech-therapist/${slug}`}
      className="card p-5 block hover:border-brand-emerald group"
    >
      <div className="text-3xl mb-3">{icon}</div>
      <h3 className="font-bold text-brand-slate group-hover:text-brand-emerald text-sm leading-tight mb-2">{name}</h3>
      <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{description}</p>
    </Link>
  )
}

function ListingCard({ listing }: { listing: SLPListing }) {
  const citySlug = listing.city.toLowerCase().replace(/\s+/g, '-')
  const stateSlug = listing.state.toLowerCase()
  return (
    <Link href={`/slp/${stateSlug}/${citySlug}/${listing.slug}`} className="card p-5 block hover:border-brand-emerald">
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-gray-900 text-base leading-tight">
            {listing.full_name}
            {listing.credentials && <span className="text-gray-500 font-normal text-sm">, {listing.credentials}</span>}
          </h3>
          {listing.practice_name && (
            <p className="text-xs text-gray-500 mt-0.5 truncate">{listing.practice_name}</p>
          )}
          <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
            <MapPin className="w-3.5 h-3.5 flex-shrink-0" aria-label="Location" />
            <span>{listing.city}, {listing.state}</span>
          </div>
        </div>
        {listing.listing_tier === 'featured' && (
          <span className="badge-featured flex-shrink-0">Featured ⭐</span>
        )}
        {listing.listing_tier === 'verified' && (
          <span className="badge-verified flex-shrink-0">✓ Verified</span>
        )}
      </div>
      {listing.specialties && listing.specialties.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {listing.specialties.slice(0, 3).map((s) => (
            <span key={s} className="badge-specialty">{s.replace(/-/g, ' ')}</span>
          ))}
          {listing.specialties.length > 3 && (
            <span className="text-xs text-gray-400">+{listing.specialties.length - 3} more</span>
          )}
        </div>
      )}
      <div className="flex flex-wrap gap-2">
        {listing.telehealth_available && (
          <span className="badge-telehealth text-xs">💻 Telehealth</span>
        )}
        {listing.insurance_accepted && (
          <span className="text-xs px-2 py-0.5 bg-green-50 text-green-700 rounded-full">Insurance Accepted</span>
        )}
      </div>
      {listing.phone && (
        <div className="flex items-center gap-2 text-sm text-brand-emerald font-medium mt-3">
          <span>📞</span>
          {formatPhone(listing.phone)}
        </div>
      )}
    </Link>
  )
}

function WhyCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="bg-white/10 rounded-xl p-6 border border-white/10">
      <div className="text-3xl mb-4">{icon}</div>
      <h3 className="font-bold text-white text-lg mb-2">{title}</h3>
      <p className="text-gray-300 text-sm leading-relaxed">{description}</p>
    </div>
  )
}
