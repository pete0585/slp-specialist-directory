import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.email !== (process.env.ADMIN_EMAIL ?? 'adam@thestrategicveteran.com')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const formData = await req.formData()
  const listingId = formData.get('listing_id') as string

  if (!listingId) {
    return NextResponse.json({ error: 'listing_id required' }, { status: 400 })
  }

  const serviceClient = await createServiceClient()
  await serviceClient.from('slp_listings').update({ is_approved: true }).eq('id', listingId)

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.findslpspecialist.com'
  return NextResponse.redirect(`${siteUrl}/admin`, { status: 303 })
}
