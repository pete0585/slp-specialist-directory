import type { Metadata } from 'next'
import Link from 'next/link'
import { MapPin, ChevronRight } from 'lucide-react'
import { getCityListings } from '@/lib/data'
import { formatPhone } from '@/lib/utils'
import type { SLPListing } from '@/lib/types'

export const metadata: Metadata = {
  title: 'Find a Speech-Language Pathologist in Chicago, IL | SLP Specialist Directory',
  description: 'Find licensed speech-language pathologists in Chicago. Pediatric SLPs, adult neurogenic specialists, feeding therapists, and stuttering specialists across the Chicago metro area.',
  alternates: { canonical: 'https://www.findslpspecialist.com/slp-specialists/chicago-il' },
  openGraph: {
    title: 'Speech-Language Pathologists in Chicago | SLP Specialist Directory',
    description: 'Find a licensed SLP in Chicago specializing in pediatric speech, feeding therapy, aphasia, stuttering, and more.',
  },
}

export const revalidate = 86400

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Why are private SLP waitlists so long in Chicago?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Chicago Public Schools and the Chicago Park District employ a large number of SLPs in school-based roles, which reduces the pool of clinicians available in private practice. High demand from a large pediatric population combined with limited private practice supply creates significant waitlists — particularly for feeding therapy and childhood apraxia specialists. Using this directory to contact multiple SLPs simultaneously and getting on several waitlists at once is the most effective approach.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does Lurie Children\'s Hospital offer outpatient SLP services in Chicago?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Ann & Robert H. Lurie Children\'s Hospital of Chicago has one of the top-ranked pediatric rehabilitation programs in the country, including outpatient speech-language pathology services. Lurie is particularly strong for complex pediatric feeding disorders, augmentative communication (AAC), and rare conditions. Referral from a pediatrician is typically required. Waitlists can be long — securing a referral early while also pursuing private SLP options is advisable.',
      },
    },
    {
      '@type': 'Question',
      name: 'Are there bilingual SLPs in Chicago?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Chicago\'s large Spanish-speaking population drives significant demand for bilingual Spanish-English SLPs. The Polish and Mandarin-speaking communities in Chicago also have demand for SLPs who can provide therapy in those languages. Therapy in a child\'s home language is critical for accurate assessment — a child who is bilingual should be assessed in both languages to distinguish a language difference from a language disorder.',
      },
    },
    {
      '@type': 'Question',
      name: 'Which Chicago hospitals have adult SLP programs for stroke recovery?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Northwestern Memorial Hospital, Rush University Medical Center, and Shirley Ryan AbilityLab (formerly Rehabilitation Institute of Chicago — consistently ranked #1 rehabilitation hospital in the US) all have SLP programs for adult neurogenic conditions including aphasia, dysarthria, and dysphagia after stroke. Shirley Ryan AbilityLab is particularly known for intensive aphasia rehabilitation. Most offer both inpatient and outpatient services.',
      },
    },
  ],
}

export default async function SLPChicagoPage() {
  const listings = await getCityListings('Chicago', 'IL', 50).catch(() => [])

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
            <span className="text-gray-200">Chicago, IL</span>
          </nav>
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-3">
            Find a Speech-Language Pathologist in Chicago, IL
          </h1>
          <p className="text-gray-300 max-w-2xl text-lg leading-relaxed">
            Chicago has world-class pediatric and adult SLP resources — Lurie Children&apos;s Hospital, Shirley Ryan
            AbilityLab, Northwestern Memorial, and Rush University Medical Center. Private practice waitlists
            are long; finding a qualified SLP early is critical for children with speech delays.
          </p>
          <div className="flex items-center gap-2 mt-4 text-sm text-gray-400">
            <MapPin className="w-4 h-4" />
            <span>{listings.length > 0 ? `${listings.length} SLPs found in Chicago, IL` : 'SLPs in Chicago, IL'}</span>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Local context */}
        <div className="bg-brand-emerald-light rounded-2xl p-6 mb-10">
          <h2 className="text-lg font-bold text-brand-slate mb-3">About finding an SLP in Chicago</h2>
          <div className="grid sm:grid-cols-3 gap-4 text-sm text-gray-700">
            <div>
              <p className="font-semibold mb-1 text-brand-slate">Private practice waitlists are long</p>
              <p>CPS and Chicago Park District employ many SLPs in school roles, limiting private practice supply. Getting on multiple waitlists simultaneously is the most effective strategy for families in need.</p>
            </div>
            <div>
              <p className="font-semibold mb-1 text-brand-slate">Lurie Children&apos;s and Shirley Ryan</p>
              <p>Lurie is a top-ranked pediatric center for feeding and AAC. Shirley Ryan AbilityLab (#1 US rehab hospital) is the premier destination for adult aphasia and stroke recovery SLP services.</p>
            </div>
            <div>
              <p className="font-semibold mb-1 text-brand-slate">Bilingual SLPs available</p>
              <p>Chicago&apos;s large Spanish-speaking, Polish, and Mandarin-speaking communities drive demand for bilingual SLPs. Specify your language needs when searching to find appropriate specialists.</p>
            </div>
          </div>
        </div>

        {/* Listings */}
        {showListings.length > 0 ? (
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-brand-slate mb-6">Speech Therapists in Chicago, IL</h2>
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
                href="/slp?state=IL&city=Chicago"
                className="inline-flex items-center gap-2 bg-brand-slate hover:bg-brand-slate/90 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
              >
                Browse all Chicago speech therapists →
              </Link>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-200 mb-10">
            <p className="text-gray-500 mb-4">Loading SLP listings for Chicago, IL…</p>
            <Link href="/slp?state=IL" className="text-brand-emerald font-medium hover:underline text-sm">
              Browse all Illinois SLPs →
            </Link>
          </div>
        )}

        {/* Specialties */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-brand-slate mb-4">Find a Chicago SLP by specialty</h2>
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
          <h2 className="text-xl font-bold mb-2">Are you an SLP in Chicago?</h2>
          <p className="text-gray-400 mb-6 max-w-xl mx-auto">
            Your listing may already be here from NPI Registry data. Claim your free profile to add your specialties, bio, and contact information.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/slp?state=IL" className="bg-brand-emerald hover:bg-brand-emerald-dark text-white font-bold px-6 py-3 rounded-xl transition-colors">
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
