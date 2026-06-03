import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createServiceClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    const formData = await req.formData().catch(() => null)
    if (!formData) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
    }
    body = {
      listing_id: formData.get('listing_id'),
      tier: formData.get('tier'),
    }
  }

  const listingId = (body.listingId ?? body.listing_id) as string | undefined
  const tier = body.tier as string | undefined

  if (!listingId || !tier) {
    return NextResponse.json({ error: 'listing_id and tier required' }, { status: 400 })
  }

  const supabase = await createServiceClient()
  const { data: listing, error } = await supabase
    .from('slp_listings')
    .select('id, full_name, city, state, slug')
    .eq('id', listingId)
    .single()

  if (error || !listing) {
    return NextResponse.json({ error: 'Listing not found' }, { status: 404 })
  }

  const priceId = tier === 'featured'
    ? process.env.STRIPE_FEATURED_PRICE_ID!
    : process.env.STRIPE_VERIFIED_PRICE_ID!

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.findslpspecialist.com'
  const citySlug = listing.city.toLowerCase().replace(/\s+/g, '-')
  const stateSlug = listing.state.toLowerCase()

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    line_items: [{ price: priceId, quantity: 1 }],
    allow_promotion_codes: true,
    success_url: `${siteUrl}/slp/${stateSlug}/${citySlug}/${listing.slug}?upgraded=true`,
    cancel_url: `${siteUrl}/claim/${listingId}?verified=true`,
    metadata: { listing_id: listingId, tier },
    subscription_data: { metadata: { listing_id: listingId, tier } },
  })

  if (req.headers.get('content-type')?.includes('application/x-www-form-urlencoded')) {
    return NextResponse.redirect(session.url!, { status: 303 })
  }

  return NextResponse.json({ url: session.url })
}
