import type { Metadata } from 'next'
import Link from 'next/link'
import { createServiceClient } from '@/lib/supabase/server'
import { getListingById } from '@/lib/data'

interface PageProps {
  params: Promise<{ id: string }>
  searchParams: Promise<{ verified?: string; token?: string }>
}

export const metadata: Metadata = {
  title: 'Claim Your SLP Listing | SLP Specialist Directory',
  description: 'Claim and verify your speech-language pathologist listing to manage your profile and upgrade to a verified listing.',
  robots: { index: false, follow: false },
}

export default async function ClaimPage({ params, searchParams }: PageProps) {
  const { id } = await params
  const { verified, token } = await searchParams

  if (token) {
    return <TokenVerification id={id} token={token} />
  }

  if (verified === 'true') {
    return <UpgradePage id={id} />
  }

  return <ClaimForm id={id} />
}

async function TokenVerification({ id, token }: { id: string; token: string }) {
  const supabase = await createServiceClient()

  const { data: claim } = await supabase
    .from('slp_claims')
    .select('*')
    .eq('listing_id', id)
    .eq('token', token)
    .eq('verified', false)
    .gt('expires_at', new Date().toISOString())
    .single()

  if (!claim) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <div className="text-5xl mb-4">❌</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-3">Link Expired or Invalid</h1>
        <p className="text-gray-600 mb-6">
          This verification link has expired or has already been used.
          Request a new verification email to claim your listing.
        </p>
        <Link href={`/claim/${id}`} className="btn-primary">
          Request New Link
        </Link>
      </div>
    )
  }

  // Verify the claim
  await supabase
    .from('slp_claims')
    .update({ verified: true, verified_at: new Date().toISOString() })
    .eq('id', claim.id)

  await supabase
    .from('slp_listings')
    .update({ is_claimed: true })
    .eq('id', id)

  return (
    <div className="max-w-lg mx-auto px-4 py-16 text-center">
      <div className="text-5xl mb-4">✅</div>
      <h1 className="text-2xl font-bold text-brand-slate mb-3">Listing Claimed!</h1>
      <p className="text-gray-600 mb-8">
        Your listing is now verified. Upgrade to a Verified plan to add your full bio, specialty badges,
        credential certificates, and get priority placement in search results.
      </p>
      <div className="space-y-3">
        <Link href={`/claim/${id}?verified=true`} className="w-full btn-primary block text-center">
          View Upgrade Options
        </Link>
      </div>
    </div>
  )
}

async function UpgradePage({ id }: { id: string }) {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-2xl font-bold text-brand-slate mb-2">Upgrade Your Listing</h1>
      <p className="text-gray-600 mb-8">
        Your listing is claimed. Upgrade to reach more patients and stand out in specialty searches.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        {/* Verified tier */}
        <div className="bg-white rounded-2xl border-2 border-brand-emerald p-6">
          <div className="badge-verified mb-4 w-fit">✓ Verified</div>
          <div className="text-3xl font-extrabold text-brand-slate mb-1">
            $99<span className="text-lg font-normal text-gray-500">/yr</span>
          </div>
          <ul className="space-y-2 text-sm text-gray-600 mb-6">
            <li>✅ Priority placement above free listings</li>
            <li>✅ Up to 8 specialty badges</li>
            <li>✅ Credential badges (CCC-SLP, PROMPT, etc.)</li>
            <li>✅ Full bio, photo, phone, website</li>
            <li>✅ Insurance &amp; telehealth flags</li>
            <li>✅ ✓ Verified badge on profile</li>
          </ul>
          <UpgradeButton listingId={id} tier="verified" label="Upgrade to Verified" />
        </div>

        {/* Featured tier */}
        <div className="bg-white rounded-2xl border-2 border-brand-amber p-6">
          <div className="badge-featured mb-4 w-fit">Featured ⭐</div>
          <div className="text-3xl font-extrabold text-brand-slate mb-1">
            $249<span className="text-lg font-normal text-gray-500">/yr</span>
          </div>
          <ul className="space-y-2 text-sm text-gray-600 mb-6">
            <li>✅ Everything in Verified</li>
            <li>⭐ Top-3 placement in city results</li>
            <li>⭐ Featured badge &amp; highlighted card</li>
            <li>⭐ Highlighted on specialty pages</li>
            <li>⭐ Newsletter inclusion (future)</li>
          </ul>
          <UpgradeButton listingId={id} tier="featured" label="Upgrade to Featured" amber />
        </div>
      </div>

      <p className="text-xs text-gray-400 text-center">
        Annual subscription. Cancel anytime. One new pediatric patient = $1,800–$6,000 first-year revenue.
        Your listing pays for itself with a fraction of one referral.
      </p>
    </div>
  )
}

function UpgradeButton({ listingId, tier, label, amber }: { listingId: string; tier: string; label: string; amber?: boolean }) {
  return (
    <form action="/api/upgrade" method="post">
      <input type="hidden" name="listing_id" value={listingId} />
      <input type="hidden" name="tier" value={tier} />
      <button type="submit" className={`w-full ${amber ? 'btn-amber' : 'btn-primary'}`}>
        {label}
      </button>
    </form>
  )
}

async function ClaimForm({ id }: { id: string }) {
  const listing = await getListingById(id).catch(() => null)

  return (
    <div className="max-w-lg mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-2xl font-bold text-brand-slate mb-2">Claim Your Listing</h1>
      {listing && (
        <p className="text-gray-600 mb-8">
          Claim <strong>{listing.full_name}</strong> to manage your profile, add your specialties, and upgrade to a verified listing.
        </p>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <form action="/api/claim" method="post" className="space-y-4">
          <input type="hidden" name="listing_id" value={id} />
          <div>
            <label htmlFor="email" className="label">Your Work Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="input"
              placeholder="you@yourpractice.com"
            />
            <p className="text-xs text-gray-500 mt-1">
              We&apos;ll send a one-click verification link. Use your practice email address.
            </p>
          </div>
          <button type="submit" className="w-full btn-primary">
            Send Verification Email
          </button>
        </form>
      </div>

      <p className="text-xs text-gray-500 text-center mt-4">
        Having trouble? Email us at{' '}
        <a href="mailto:hello@findslpspecialist.com" className="text-brand-emerald hover:underline">
          hello@findslpspecialist.com
        </a>
      </p>
    </div>
  )
}
