-- SLP Specialist Directory — Initial Schema
-- All tables in the shared Directories Supabase project (fbuqrnzofktepkzyfmhy)
-- Table prefix: slp_

-- ============================================================
-- slp_listings
-- ============================================================
CREATE TABLE IF NOT EXISTS slp_listings (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug                  varchar UNIQUE NOT NULL,
  full_name             varchar NOT NULL,
  credentials           varchar,              -- 'CCC-SLP, MS', 'PhD, CCC-SLP', etc.
  npi_number            varchar,
  practice_name         varchar,
  city                  varchar NOT NULL,
  state                 varchar(2) NOT NULL,
  zip                   varchar,
  phone                 varchar,
  website_url           varchar,
  email                 varchar,
  email_source          varchar,              -- 'npi', 'dataforseo', 'manual', 'self-submitted'
  bio                   text,
  photo_url             varchar,
  specialties           text[],               -- e.g. ['feeding-therapy', 'childhood-apraxia']
  credential_badges     text[],               -- e.g. ['CCC-SLP', 'BCS-F', 'PROMPT', 'LSVT']
  insurance_accepted    boolean,              -- null = unknown
  telehealth_available  boolean,              -- null = unknown
  languages_spoken      text[],
  is_claimed            boolean NOT NULL DEFAULT false,
  is_verified           boolean NOT NULL DEFAULT false,  -- true when paid
  listing_tier          varchar NOT NULL DEFAULT 'free',  -- 'free', 'verified', 'featured'
  listing_tier_rank     integer NOT NULL DEFAULT 0,       -- 0=free, 1=verified, 2=featured
  is_active             boolean NOT NULL DEFAULT true,
  is_approved           boolean NOT NULL DEFAULT true,
  do_not_email          boolean NOT NULL DEFAULT false,
  stripe_customer_id    varchar,
  stripe_subscription_id varchar,
  plan_expires_at       timestamptz,
  outreach_step         integer NOT NULL DEFAULT 0,
  outreach_sent_at      timestamptz,
  search_vector         tsvector,
  created_at            timestamptz NOT NULL DEFAULT now(),
  updated_at            timestamptz NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS slp_listings_city ON slp_listings(city);
CREATE INDEX IF NOT EXISTS slp_listings_state ON slp_listings(state);
CREATE INDEX IF NOT EXISTS slp_listings_city_state ON slp_listings(city, state);
CREATE INDEX IF NOT EXISTS slp_listings_slug ON slp_listings(slug);
CREATE INDEX IF NOT EXISTS slp_listings_tier ON slp_listings(listing_tier);
CREATE INDEX IF NOT EXISTS slp_listings_specialties ON slp_listings USING GIN(specialties);
CREATE INDEX IF NOT EXISTS slp_listings_telehealth ON slp_listings(telehealth_available) WHERE telehealth_available = true;
CREATE INDEX IF NOT EXISTS slp_listings_insurance ON slp_listings(insurance_accepted) WHERE insurance_accepted = true;
CREATE INDEX IF NOT EXISTS slp_listings_outreach ON slp_listings(outreach_step, outreach_sent_at) WHERE is_claimed = false AND do_not_email = false;
CREATE INDEX IF NOT EXISTS slp_listings_search ON slp_listings USING GIN(search_vector);

-- Full text search trigger
CREATE OR REPLACE FUNCTION slp_listings_tsvector_trigger()
RETURNS trigger AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('english', coalesce(NEW.full_name, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(NEW.credentials, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(NEW.city, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(NEW.state, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(NEW.practice_name, '')), 'C') ||
    setweight(to_tsvector('english', coalesce(array_to_string(NEW.specialties, ' '), '')), 'A') ||
    setweight(to_tsvector('english', coalesce(NEW.bio, '')), 'D');
  RETURN NEW;
END
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS slp_listings_tsvector ON slp_listings;
CREATE TRIGGER slp_listings_tsvector
  BEFORE INSERT OR UPDATE ON slp_listings
  FOR EACH ROW EXECUTE FUNCTION slp_listings_tsvector_trigger();

CREATE OR REPLACE FUNCTION update_slp_listings_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS slp_listings_updated_at ON slp_listings;
CREATE TRIGGER slp_listings_updated_at
  BEFORE UPDATE ON slp_listings
  FOR EACH ROW EXECUTE FUNCTION update_slp_listings_updated_at();

-- ============================================================
-- slp_claims
-- ============================================================
CREATE TABLE IF NOT EXISTS slp_claims (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id    uuid NOT NULL REFERENCES slp_listings(id) ON DELETE CASCADE,
  email         text NOT NULL,
  token         text UNIQUE NOT NULL,
  verified      boolean NOT NULL DEFAULT false,
  verified_at   timestamptz,
  created_at    timestamptz NOT NULL DEFAULT now(),
  expires_at    timestamptz NOT NULL,
  nudge_sent_at timestamptz
);

CREATE INDEX IF NOT EXISTS slp_claims_listing ON slp_claims(listing_id);
CREATE INDEX IF NOT EXISTS slp_claims_token ON slp_claims(token);

-- ============================================================
-- slp_payments
-- ============================================================
CREATE TABLE IF NOT EXISTS slp_payments (
  id                      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id              uuid NOT NULL REFERENCES slp_listings(id) ON DELETE CASCADE,
  stripe_session_id       varchar,
  stripe_customer_id      varchar,
  stripe_subscription_id  varchar,
  amount                  integer NOT NULL DEFAULT 0,
  currency                varchar NOT NULL DEFAULT 'usd',
  tier                    varchar NOT NULL,
  status                  varchar NOT NULL,
  created_at              timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS slp_payments_listing ON slp_payments(listing_id);

-- ============================================================
-- slp_specialties (canonical reference data)
-- ============================================================
CREATE TABLE IF NOT EXISTS slp_specialties (
  slug          text PRIMARY KEY,
  name          text NOT NULL,
  description   text,
  icon          text,
  display_order integer NOT NULL DEFAULT 0
);

-- Seed specialties
INSERT INTO slp_specialties (slug, name, description, icon, display_order) VALUES
  ('feeding-therapy', 'Pediatric Feeding Therapy', 'SLPs who specialize in feeding difficulties, food refusal, ARFID, and swallowing disorders in infants and children.', '🍼', 1),
  ('childhood-apraxia', 'Childhood Apraxia of Speech', 'Specialists in CAS — a motor speech disorder where children know what they want to say but have difficulty coordinating the movements.', '🗣️', 2),
  ('autism-aac', 'Autism & AAC', 'SLPs experienced with autism spectrum disorder and Augmentative & Alternative Communication (AAC) devices and strategies.', '💬', 3),
  ('aphasia', 'Aphasia', 'Specialists in aphasia — a language disorder caused by stroke or brain injury that affects speaking, understanding, reading, and writing.', '🧠', 4),
  ('stuttering-fluency', 'Stuttering & Fluency', 'Fluency specialists who work with children and adults who stutter, including Lidcombe Program and evidence-based fluency shaping.', '🔊', 5),
  ('voice-disorders', 'Voice Disorders', 'Voice therapy for vocal nodules, dysphonia, gender-affirming voice therapy, LSVT Loud for Parkinson''s, and professional voice users.', '🎙️', 6),
  ('dysphagia-swallowing', 'Dysphagia & Swallowing', 'SLPs who evaluate and treat swallowing disorders in adults, often after stroke, cancer treatment, or neurological conditions.', '💊', 7),
  ('accent-modification', 'Accent Modification', 'Accent modification and reduction services for professionals, executives, and non-native English speakers.', '🌍', 8),
  ('selective-mutism', 'Selective Mutism', 'Specialists in selective mutism — an anxiety-based condition where children can speak in some situations but not others.', '🤫', 9)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- RLS Policies
-- ============================================================
ALTER TABLE slp_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE slp_claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE slp_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE slp_specialties ENABLE ROW LEVEL SECURITY;

-- Public read for active, approved listings
CREATE POLICY IF NOT EXISTS "slp_listings_public_read"
  ON slp_listings FOR SELECT
  USING (is_active = true AND is_approved = true);

-- Service role can do everything
CREATE POLICY IF NOT EXISTS "slp_listings_service_write"
  ON slp_listings FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "slp_claims_service"
  ON slp_claims FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "slp_payments_service"
  ON slp_payments FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "slp_specialties_public_read"
  ON slp_specialties FOR SELECT
  USING (true);

-- Grants
GRANT ALL ON slp_listings TO service_role, anon, authenticated;
GRANT ALL ON slp_claims TO service_role, anon, authenticated;
GRANT ALL ON slp_payments TO service_role, anon, authenticated;
GRANT ALL ON slp_specialties TO service_role, anon, authenticated;
