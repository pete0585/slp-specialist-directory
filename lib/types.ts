export interface SLPListing {
  id: string
  slug: string
  full_name: string
  credentials: string | null
  npi_number: string | null
  practice_name: string | null
  city: string
  state: string
  zip: string | null
  phone: string | null
  website_url: string | null
  email: string | null
  bio: string | null
  photo_url: string | null
  specialties: string[] | null
  credential_badges: string[] | null
  insurance_accepted: boolean | null
  telehealth_available: boolean | null
  languages_spoken: string[] | null
  is_claimed: boolean
  is_verified: boolean
  listing_tier: string
  listing_tier_rank: number
  is_active: boolean
  is_approved: boolean
  do_not_email: boolean
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  plan_expires_at: string | null
  outreach_step: number
  outreach_sent_at: string | null
  email_source: string | null
  created_at: string
  updated_at: string
}

export interface SLPSpecialty {
  slug: string
  name: string
  description: string | null
  icon: string | null
  display_order: number
}

export interface BrowseFilters {
  q?: string
  specialty?: string
  state?: string
  city?: string
  telehealth?: boolean
  insurance?: boolean
  tier?: string
  page?: number
}
