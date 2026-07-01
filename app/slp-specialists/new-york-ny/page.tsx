import type { Metadata } from 'next'
import Link from 'next/link'
import { MapPin, ChevronRight } from 'lucide-react'
import { getCityListings } from '@/lib/data'
import { formatPhone } from '@/lib/utils'
import type { SLPListing } from '@/lib/types'

export const metadata: Metadata = {
  title: 'Find a Speech-Language Pathologist in New York, NY | SLP Specialist Directory',
  description: 'Find licensed speech-language pathologists (SLPs) in New York City. Search by specialty — pediatric, adult neurogenic, aphasia, feeding therapy, autism & AAC, stuttering. Private pay and insurance accepted.',
  alternates: { canonical: 'https://www.findslpspecialist.com/slp-specialists/new-york-ny' },
  openGraph: {
    title: 'Speech-Language Pathologists in New York City | SLP Specialist Directory',
    description: 'Find a licensed SLP in NYC specializing in the condition you need — pediatric speech delays, aphasia, feeding therapy, stuttering, and more.',
  },
}

export const revalidate = 86400

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How do I find a private speech therapist in New York City?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Search this directory by specialty to find SLPs in NYC who accept private pay or your insurance. NYC DOE provides school-based SLP services for children with IEPs, but private SLPs offer more intensive care and shorter waitlists. Many NYC SLPs also offer telehealth for families who cannot easily travel to a clinic.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the difference between a school SLP and a private practice SLP in New York City?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'School-based SLPs employed by NYC DOE are limited to services that address a student\'s educational impact under an IEP. Private practice SLPs can focus on the full range of functional communication goals — including social communication, pragmatic language, feeding therapy, and voice — without the educational mandate constraint. Many families use both: school-based services through DOE plus private SLP for more intensive therapy.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do NYC SLPs offer multilingual therapy?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes — New York City\'s linguistically diverse population drives high demand for multilingual SLPs. Many NYC SLPs are fluent in Spanish, Mandarin, Cantonese, Korean, Russian, Hindi, Bengali, and other languages commonly spoken in the city. When searching, specify your language needs to find an SLP who can provide therapy in your home language, which is often critical for young children and for assessment accuracy.',
      },
    },
    {
      '@type': 'Question',
      name: 'Which New York City hospitals have SLP programs?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'NYU Langone, Weill Cornell Medicine, New York-Presbyterian/Columbia, and Mount Sinai all have SLP programs serving both inpatient and outpatient populations. NYU Steinhardt has a graduate SLP clinic that offers reduced-rate therapy supervised by licensed SLPs. For pediatric specialist care, the NYU Langone pediatric division and Columbia\'s pediatric program are among the most comprehensive in the city.',
      },
    },
  ],
}

export default async function SLPNewYorkPage() {
  const listings = await getCityListings('New York', 'NY', 50).catch(() => [])

  const featuredListings = listings.filter((l) => l.listing_tier === 'featured' || l.listing_tier === 'verified').slice(0, 9)
  const showListings = featuredListings.length > 0 ? featuredListings : listings.slice(0, 9)

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <section className="bg-brand-slate text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-1.5 text-sm text-gray-400 mb-4">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/slp" className="hover:text-white transition-colors">Browse SLPs</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-gray-200">New York, NY</span>
          </nav>
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-3">
            Find a Speech-Language Pathologist in New York, NY
          </h1>
          <p className="text-gray-300 max-w-2xl text-lg leading-relaxed">
            New York City has one of the highest concentrations of licensed SLPs per capita in the United States —
            driven by the density of hospitals, schools, and private practices. Whether you need pediatric speech therapy,
            adult stroke recovery, or feeding therapy, NYC&apos;s depth of specialists is unmatched.
          </p>
          <div className="flex items-center gap-2 mt-4 text-sm text-gray-400">
            <MapPin className="w-4 h-4" />
            <span>{listings.length > 0 ? `${listings.length} SLPs found in New York, NY` : 'SLPs in New York, NY'}</span>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Local context */}
        <div className="bg-brand-emerald-light rounded-2xl p-6 mb-10">
          <h2 className="text-lg font-bold text-brand-slate mb-3">About finding an SLP in NYC</h2>
          <div className="grid sm:grid-cols-3 gap-4 text-sm text-gray-700">
            <div>
              <p className="font-semibold mb-1 text-brand-slate">NYC DOE vs. private SLPs</p>
              <p>NYC DOE provides school-based SLP services for students with IEPs, but services are limited to educational impact. Private SLPs offer more intensive therapy, shorter waitlists, and broader goal scope.</p>
            </div>
            <div>
              <p className="font-semibold mb-1 text-brand-slate">Multilingual specialists</p>
              <p>NYC&apos;s diversity drives demand for Spanish, Mandarin, Korean, Russian, Bengali, and Hindi-speaking SLPs. Therapy in a child&apos;s home language is critical for accurate assessment and effective treatment.</p>
            </div>
            <div>
              <p className="font-semibold mb-1 text-brand-slate">Hospital and academic programs</p>
              <p>NYU Langone, Weill Cornell, and NYU Steinhardt all have SLP programs. NYU Steinhardt&apos;s clinic offers supervised therapy at reduced rates — a good option for families with budget constraints.</p>
            </div>
          </div>
        </div>

        {/* Listings */}
        {showListings.length > 0 ? (
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-brand-slate mb-6">Speech Therapists in New York, NY</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {showListings.map((listing: SLPListing) => (
                <Link
                  key={listing.id}
                  href={`/slp/${listing.state.toLowerCase()}/${listing.city.toLowerCase().replace(/\s+/g, '-')}/${listing.slug}`}
                  className="card p-5 hover:border-brand-emerald block transition-all"
                >
                  <div className="font-bold text-brand-slate mb-1">{listing.full_name}</div>
                  {listing.city && (
                    <div className="flex items-center gap-1 text-gray-500 text-xs mb-2">
                      <MapPin className="w-3 h-3" />
                      <span>{listing.city}, {listing.state}</span>
                    </div>
                  )}
                  {listing.specialties && listing.specialties.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {listing.specialties.slice(0, 3).map((s: string) => (
                        <span key={s} className="text-xs bg-brand-emerald-light text-brand-emerald-dark px-2 py-0.5 rounded-full">{s}</span>
                      ))}
                    </div>
                  )}
                  {listing.phone && (
                    <div className="text-xs text-brand-emerald font-medium mt-2">{formatPhone(listing.phone)}</div>
                  )}
                </Link>
              ))}
            </div>
            <div className="mt-6 text-center">
              <Link
                href="/slp?state=NY&city=New+York"
                className="inline-flex items-center gap-2 bg-brand-slate hover:bg-brand-slate/90 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
              >
                Browse all NYC speech therapists →
              </Link>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-200 mb-10">
            <p className="text-gray-500 mb-4">Loading SLP listings for New York, NY…</p>
            <Link href="/slp?state=NY" className="text-brand-emerald font-medium hover:underline text-sm">
              Browse all New York SLPs →
            </Link>
          </div>
        )}

        {/* Specialties in NYC */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-brand-slate mb-4">Find an NYC SLP by specialty</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {[
              { name: 'Pediatric Speech', slug: 'pediatric-speech-language' },
              { name: 'Feeding Therapy', slug: 'feeding-therapy' },
              { name: 'Aphasia Recovery', slug: 'aphasia' },
              { name: 'Autism & AAC', slug: 'autism-aac' },
              { name: 'Stuttering', slug: 'stuttering-fluency' },
              { name: 'Apraxia (CAS)', slug: 'childhood-apraxia' },
              { name: 'Voice Disorders', slug: 'voice-disorders' },
              { name: 'Dysphagia', slug: 'dysphagia-swallowing' },
            ].map(({ name, slug }) => (
              <Link
                key={slug}
                href={`/speech-therapist/${slug}`}
                className="card p-3 text-center hover:border-brand-emerald group transition-all"
              >
                <div className="font-semibold text-sm text-gray-900 group-hover:text-brand-emerald">{name}</div>
              </Link>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-brand-slate mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqSchema.mainEntity.map((item) => (
              <div key={item.name} className="bg-white rounded-2xl border border-gray-200 p-6">
                <h3 className="font-bold text-brand-slate mb-2">{item.name}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{item.acceptedAnswer.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-brand-slate text-white rounded-2xl p-8 text-center">
          <h2 className="text-xl font-bold mb-2">Are you an SLP in New York City?</h2>
          <p className="text-gray-400 mb-6 max-w-xl mx-auto">
            Your listing may already be here from NPI Registry data. Claim your free profile to add your specialties, bio, and contact information.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/slp?state=NY" className="bg-brand-emerald hover:bg-brand-emerald-dark text-white font-bold px-6 py-3 rounded-xl transition-colors">
              Find Your Listing
            </Link>
            <Link href="/submit" className="border border-white/30 text-white font-semibold px-6 py-3 rounded-xl hover:bg-white/10 transition-colors">
              Submit New Listing
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
