import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import crypto from 'crypto'

export async function POST(req: NextRequest) {
  const formData = await req.formData().catch(() => null)
  if (!formData) {
    return NextResponse.json({ error: 'Invalid form data' }, { status: 400 })
  }

  const listingId = formData.get('listing_id') as string
  const email = (formData.get('email') as string)?.trim().toLowerCase()
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.findslpspecialist.com'

  if (!listingId || !email) {
    return NextResponse.redirect(`${siteUrl}/claim/${listingId}?error=missing_fields`, { status: 303 })
  }

  const supabase = await createServiceClient()

  const { data: listing } = await supabase
    .from('slp_listings')
    .select('id, full_name, slug')
    .eq('id', listingId)
    .single()

  if (!listing) {
    return NextResponse.redirect(`${siteUrl}/claim/${listingId}?error=not_found`, { status: 303 })
  }

  const token = crypto.randomBytes(32).toString('hex')
  const expiresAt = new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString()

  await supabase.from('slp_claims').insert({
    listing_id: listingId,
    email,
    token,
    verified: false,
    expires_at: expiresAt,
  })

  await supabase.from('slp_listings').update({ email }).eq('id', listingId)

  const verifyUrl = `${siteUrl}/claim/${listingId}?token=${token}`

  // Send verification email via Resend
  const resendKey = process.env.RESEND_API_KEY
  if (resendKey) {
    try {
      const { execSync } = await import('child_process')
      const emailPayload = JSON.stringify({
        from: 'SLP Specialist Directory <hello@findslpspecialist.com>',
        to: [email],
        subject: `Verify your claim for ${listing.full_name} — SLP Specialist Directory`,
        html: `
          <div style="font-family: Inter, sans-serif; max-width: 560px; margin: 0 auto;">
            <h2 style="color: #1E293B;">Verify Your Listing Claim</h2>
            <p>Click the button below to verify your claim for <strong>${listing.full_name}</strong> on SLP Specialist Directory.</p>
            <a href="${verifyUrl}" style="display:inline-block;background:#059669;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;margin:16px 0;">
              Verify My Claim
            </a>
            <p style="color:#6b7280;font-size:14px;">This link expires in 72 hours. If you didn't request this, you can safely ignore it.</p>
          </div>
        `,
      })

      execSync(`curl -s -X POST "https://api.resend.com/emails" \
        -H "Authorization: Bearer ${resendKey}" \
        -H "Content-Type: application/json" \
        -d '${emailPayload.replace(/'/g, "'\\''")}'`)
    } catch (e) {
      console.error('Email send failed:', e)
    }
  }

  return NextResponse.redirect(`${siteUrl}/claim/${listingId}?sent=true`, { status: 303 })
}
