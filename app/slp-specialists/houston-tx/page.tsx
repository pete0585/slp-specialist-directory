import type { Metadata } from 'next'
import Link from 'next/link'
import { MapPin, ChevronRight } from 'lucide-react'
import { getCityListings } from '@/lib/data'
import { formatPhone } from '@/lib/utils'
import type { SLPListing } from '@/lib/types'

export const metadata: Metadata = {
  title: 'Find a Speech-Language Pathologist in Houston, TX | SLP Specialist Directory',
  description: 'Find licensed speech-language pathologists in Houston. Bilingual SLPs, pediatric specialists, adult neurogenic care, and telehealth options across the Houston metro area.',
  alternates: { canonical: 'https://www.findslpspecialist.com/slp-specialists/houston-tx' },
  openGraph: {
    title: 'Speech-Language Pathologists in Houston | SLP Specialist Directory',
    description: 'Find a licensed SLP in Houston specializing in the condition you need — pediatric speech, feeding therapy, aphasia, stuttering, bilingual therapy, and more.',
  },
}

export const revalidate = 86400

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Does Texas Medicaid cover speech therapy for children in Houston?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Texas Medicaid covers pediatric speech-language therapy for children who qualify through the THSteps (Texas Health Steps) program and the Children with Special Health Care Needs (CSHCN) program. Children with Medicaid who receive a referral from their primary care physician can access SLP services at approved providers. Coverage includes diagnostic evaluation and ongoing therapy when medically necessary. To find an SLP who accepts Texas Medicaid in Houston, ask specifically about THSteps and STAR/STAR Kids enrollment.',
      },
    },
    {
      '@type': 'Question',
      name: 'Why is telehealth SLP popular in Houston?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Houston\'s suburban sprawl makes in-person travel to specialist providers time-intensive for many families. Telehealth SLP eliminates drive time and is equally effective as in-person therapy for most conditions — particularly language, pragmatics, stuttering, and voice therapy. Texas licensure law allows SLPs to provide telehealth services to Texas residents. Many Houston-area SLPs offer hybrid models: initial evaluation in-person, ongoing therapy via telehealth.',
      },
    },
    {
      '@type': 'Question',
      name: 'Are there bilingual Spanish-English SLPs in Houston?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes — Houston\'s large Spanish-speaking population (approximately 44% of the city) drives high demand for bilingual Spanish-English SLPs. Finding a bilingual SLP is critical for young children whose home language is Spanish: assessment in English only can lead to misdiagnosis of language disorder when the child actually has a language difference (normal for bilingual children). When searching, filter for bilingual or Spanish-language competency explicitly.',
      },
    },
    {
      '@type': 'Question',
      name: 'What pediatric SLP resources are available at Texas Children\'s Hospital in Houston?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Texas Children\'s Hospital has a comprehensive speech-language pathology department serving both inpatient and outpatient populations. Services include pediatric feeding and swallowing therapy, augmentative and alternative communication (AAC) evaluation and treatment, voice therapy, and evaluation for childhood apraxia of speech (CAS) and other complex speech disorders. Referral from a pediatrician is typically required. For complex cases — particularly feeding disorders and AAC needs — Texas Children\'s is the strongest referral center in the greater Houston area.',
      },
    },
  ],
}

export default async function SLPHoustonPage() {
  const listings = await getCityListings('Houston', 'TX', 50).catch(() => [])

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
            <span className="text-gray-200">Houston, TX</span>
          </nav>
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-3">
            Find a Speech-Language Pathologist in Houston, TX
          </h1>
          <p className="text-gray-300 max-w-2xl text-lg leading-relaxed">
            Houston is the most ethnically diverse major city in the United States, driving high demand for
            multilingual SLPs. Texas Children&apos;s Hospital and Houston Methodist are major regional hubs.
            Telehealth SLP is especially popular given the city&apos;s suburban sprawl.
          </p>
          <div className="flex items-center gap-2 mt-4 text-sm text-gray-400">
            <MapPin className="w-4 h-4" />
            <span>{listings.length > 0 ? `${listings.length} SLPs found in Houston, TX` : 'SLPs in Houston, TX'}</span>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Local context */}
        <div className="bg-brand-emerald-light rounded-2xl p-6 mb-10">
          <h2 className="text-lg font-bold text-brand-slate mb-3">About finding an SLP in Houston</h2>
          <div className="grid sm:grid-cols-3 gap-4 text-sm text-gray-700">
            <div>
              <p className="font-semibold mb-1 text-brand-slate">Most diverse US city</p>
              <p>Houston&apos;s diversity — Spanish, Vietnamese, Hindi, Tagalog, Arabic and dozens more languages — creates unique demand for multilingual SLPs. Bilingual assessment is essential for accurate diagnosis in non-English-speaking children.</p>
            </div>
            <div>
              <p className="font-semibold mb-1 text-brand-slate">Texas Children&apos;s and Houston Methodist</p>
              <p>Texas Children&apos;s Hospital is the top regional referral center for complex pediatric SLP needs. Houston Methodist has a strong adult neurogenic SLP program for post-stroke aphasia and dysphagia.</p>
            </div>
            <div>
              <p className="font-semibold mb-1 text-brand-slate">Telehealth is widely available</p>
              <p>Houston&apos;s sprawl makes telehealth SLP practical for many families. Texas Medicaid (THSteps) also covers pediatric SLP — ask providers specifically about THSteps and STAR Kids enrollment.</p>
            </div>
          </div>
        </div>

        {/* Listings */}
        {showListings.length > 0 ? (
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-brand-slate mb-6">Speech Therapists in Houston, TX</h2>
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
                href="/slp?state=TX&city=Houston"
                className="inline-flex items-center gap-2 bg-brand-slate hover:bg-brand-slate/90 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
              >
                Browse all Houston speech therapists →
              </Link>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-200 mb-10">
            <p className="text-gray-500 mb-4">Loading SLP listings for Houston, TX…</p>
            <Link href="/slp?state=TX" className="text-brand-emerald font-medium hover:underline text-sm">
              Browse all Texas SLPs →
            </Link>
          </div>
        )}

        {/* Specialties */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-brand-slate mb-4">Find a Houston SLP by specialty</h2>
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
          <h2 className="text-xl font-bold mb-2">Are you an SLP in Houston?</h2>
          <p className="text-gray-400 mb-6 max-w-xl mx-auto">
            Your listing may already be here from NPI Registry data. Claim your free profile to add your specialties, bio, and contact information.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/slp?state=TX" className="bg-brand-emerald hover:bg-brand-emerald-dark text-white font-bold px-6 py-3 rounded-xl transition-colors">
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
