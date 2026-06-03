import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { slugify } from '@/lib/utils'

export async function POST(req: NextRequest) {
  const formData = await req.formData().catch(() => null)
  if (!formData) {
    return NextResponse.json({ error: 'Invalid form data' }, { status: 400 })
  }

  const fullName = (formData.get('full_name') as string)?.trim()
  const city = (formData.get('city') as string)?.trim()
  const state = (formData.get('state') as string)?.trim().toUpperCase().slice(0, 2)
  const email = (formData.get('email') as string)?.trim()

  if (!fullName || !city || !state || !email) {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.findslpspecialist.com'
    return NextResponse.redirect(`${siteUrl}/submit?error=missing_fields`, { status: 303 })
  }

  const specialties = formData.getAll('specialties') as string[]
  const baseSlug = slugify(`${fullName} ${city} ${state}`)

  const supabase = await createServiceClient()

  // Ensure unique slug
  let slug = baseSlug
  let attempt = 0
  while (attempt < 5) {
    const { data } = await supabase.from('slp_listings').select('id').eq('slug', slug).single()
    if (!data) break
    attempt++
    slug = `${baseSlug}-${Math.random().toString(36).slice(2, 6)}`
  }

  const { error } = await supabase.from('slp_listings').insert({
    slug,
    full_name: fullName,
    credentials: (formData.get('credentials') as string)?.trim() || null,
    practice_name: (formData.get('practice_name') as string)?.trim() || null,
    city,
    state,
    zip: (formData.get('zip') as string)?.trim() || null,
    phone: (formData.get('phone') as string)?.trim() || null,
    website_url: (formData.get('website_url') as string)?.trim() || null,
    email,
    npi_number: (formData.get('npi_number') as string)?.trim() || null,
    bio: (formData.get('bio') as string)?.trim() || null,
    specialties: specialties.length > 0 ? specialties : null,
    telehealth_available: formData.get('telehealth_available') === 'true',
    insurance_accepted: formData.get('insurance_accepted') === 'true',
    is_claimed: false,
    is_verified: false,
    listing_tier: 'free',
    listing_tier_rank: 0,
    is_active: true,
    is_approved: false,
    email_source: 'self-submitted',
    outreach_step: 0,
  })

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.findslpspecialist.com'

  if (error) {
    console.error('Submit error:', error)
    return NextResponse.redirect(`${siteUrl}/submit?error=server_error`, { status: 303 })
  }

  return NextResponse.redirect(`${siteUrl}/submit?success=true`, { status: 303 })
}
