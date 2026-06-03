import type { Metadata } from 'next'
import { CheckCircle } from 'lucide-react'
import { SPECIALTIES } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Add Your SLP Listing — Free | SLP Specialist Directory',
  description: 'List your speech-language pathology practice on the SLP Specialist Directory. Free listing, specialty-first search, SEO-indexed profile page.',
  robots: { index: true, follow: true },
}

export default function SubmitPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-brand-slate text-white py-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-extrabold mb-2">Add Your SLP Listing</h1>
          <p className="text-gray-300">
            Free listing on the only US-wide directory that lets patients find SLPs by specialty.
            One new patient referral from a verified listing = $1,800–$6,000 first-year revenue.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <form action="/api/submit" method="post" className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="full_name" className="label">Full Name *</label>
                    <input type="text" id="full_name" name="full_name" required className="input" placeholder="Dr. Jane Smith" />
                  </div>
                  <div>
                    <label htmlFor="credentials" className="label">Credentials</label>
                    <input type="text" id="credentials" name="credentials" className="input" placeholder="CCC-SLP, MS, PhD" />
                  </div>
                </div>

                <div>
                  <label htmlFor="practice_name" className="label">Practice / Clinic Name</label>
                  <input type="text" id="practice_name" name="practice_name" className="input" placeholder="Smith Speech Therapy" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="city" className="label">City *</label>
                    <input type="text" id="city" name="city" required className="input" placeholder="Los Angeles" />
                  </div>
                  <div>
                    <label htmlFor="state" className="label">State *</label>
                    <input type="text" id="state" name="state" required className="input" placeholder="CA" maxLength={2} />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="phone" className="label">Phone Number</label>
                    <input type="tel" id="phone" name="phone" className="input" placeholder="(555) 555-5555" />
                  </div>
                  <div>
                    <label htmlFor="website_url" className="label">Website URL</label>
                    <input type="url" id="website_url" name="website_url" className="input" placeholder="https://yourpractice.com" />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="label">Your Email Address *</label>
                  <input type="email" id="email" name="email" required className="input" placeholder="you@yourpractice.com" />
                  <p className="text-xs text-gray-500 mt-1">Used to verify your listing. Not shown publicly.</p>
                </div>

                <div>
                  <label htmlFor="npi_number" className="label">NPI Number</label>
                  <input type="text" id="npi_number" name="npi_number" className="input" placeholder="1234567890" maxLength={10} />
                  <p className="text-xs text-gray-500 mt-1">Your 10-digit National Provider Identifier (optional, for verification).</p>
                </div>

                <div>
                  <p className="label mb-2">Specialties (select all that apply)</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {Object.entries(SPECIALTIES).map(([slug, info]) => (
                      <label key={slug} className="flex items-center gap-2 text-sm cursor-pointer p-2 rounded-lg hover:bg-gray-50">
                        <input type="checkbox" name="specialties" value={slug} className="accent-brand-emerald w-4 h-4" />
                        <span>{info.icon} {info.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="checkbox" name="telehealth_available" value="true" className="accent-brand-emerald w-4 h-4" />
                    I offer telehealth / virtual appointments
                  </label>
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="checkbox" name="insurance_accepted" value="true" className="accent-brand-emerald w-4 h-4" />
                    I accept insurance
                  </label>
                </div>

                <div>
                  <label htmlFor="bio" className="label">Bio / Description</label>
                  <textarea
                    id="bio"
                    name="bio"
                    rows={4}
                    className="input"
                    placeholder="Brief description of your practice and approach. Patients will see this on your profile."
                  />
                </div>

                <button type="submit" className="w-full btn-primary py-3 text-base">
                  Submit Free Listing
                </button>

                <p className="text-xs text-gray-500 text-center">
                  Free listings are reviewed within 24 hours. Upgrade to Verified ($99/yr) any time after approval.
                </p>
              </form>
            </div>
          </div>

          {/* Benefits sidebar */}
          <div className="space-y-4">
            <div className="bg-brand-emerald-light rounded-2xl border border-brand-emerald/20 p-5">
              <h2 className="font-bold text-brand-slate mb-4">Free Listing Includes</h2>
              <ul className="space-y-2.5 text-sm">
                {[
                  'SEO-indexed profile page',
                  'Searchable by specialty',
                  'City &amp; state listing',
                  'Basic contact info',
                  '"Claim Listing" link on your profile',
                ].map((benefit) => (
                  <li key={benefit} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-brand-emerald mt-0.5 flex-shrink-0" aria-label="Check" />
                    <span dangerouslySetInnerHTML={{ __html: benefit }} />
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <h2 className="font-bold text-brand-slate mb-1">Verified — $99/yr</h2>
              <p className="text-xs text-gray-500 mb-4">Upgrade any time after approval</p>
              <ul className="space-y-2 text-sm">
                {[
                  'Everything in Free',
                  'Priority placement above free listings',
                  'Up to 8 specialty badges',
                  'Credential badges (CCC-SLP, PROMPT, etc.)',
                  'Full bio &amp; photo',
                  'Phone, website, insurance details',
                  '✓ Verified badge',
                ].map((benefit) => (
                  <li key={benefit} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-brand-emerald mt-0.5 flex-shrink-0" aria-label="Check" />
                    <span dangerouslySetInnerHTML={{ __html: benefit }} />
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-2xl border border-brand-amber/30 p-5">
              <h2 className="font-bold text-brand-slate mb-1">Featured — $249/yr</h2>
              <ul className="space-y-2 text-sm">
                {[
                  'Everything in Verified',
                  '⭐ Top-3 placement in city results',
                  '⭐ "Featured SLP" badge',
                  '⭐ Highlighted card on specialty pages',
                ].map((benefit) => (
                  <li key={benefit} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-brand-amber mt-0.5 flex-shrink-0" aria-label="Check" />
                    <span dangerouslySetInnerHTML={{ __html: benefit }} />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
