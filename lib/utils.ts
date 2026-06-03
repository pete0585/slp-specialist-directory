export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export function toTitleCase(str: string): string {
  return str.replace(/\w\S*/g, (txt) =>
    txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase()
  )
}

export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`
  }
  if (cleaned.length === 11 && cleaned[0] === '1') {
    return `(${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`
  }
  return phone
}

export function stateAbbrevToName(abbrev: string): string {
  const map: Record<string, string> = {
    AL: 'Alabama', AK: 'Alaska', AZ: 'Arizona', AR: 'Arkansas', CA: 'California',
    CO: 'Colorado', CT: 'Connecticut', DE: 'Delaware', FL: 'Florida', GA: 'Georgia',
    HI: 'Hawaii', ID: 'Idaho', IL: 'Illinois', IN: 'Indiana', IA: 'Iowa',
    KS: 'Kansas', KY: 'Kentucky', LA: 'Louisiana', ME: 'Maine', MD: 'Maryland',
    MA: 'Massachusetts', MI: 'Michigan', MN: 'Minnesota', MS: 'Mississippi',
    MO: 'Missouri', MT: 'Montana', NE: 'Nebraska', NV: 'Nevada', NH: 'New Hampshire',
    NJ: 'New Jersey', NM: 'New Mexico', NY: 'New York', NC: 'North Carolina',
    ND: 'North Dakota', OH: 'Ohio', OK: 'Oklahoma', OR: 'Oregon', PA: 'Pennsylvania',
    RI: 'Rhode Island', SC: 'South Carolina', SD: 'South Dakota', TN: 'Tennessee',
    TX: 'Texas', UT: 'Utah', VT: 'Vermont', VA: 'Virginia', WA: 'Washington',
    WV: 'West Virginia', WI: 'Wisconsin', WY: 'Wyoming', DC: 'Washington D.C.',
  }
  return map[abbrev.toUpperCase()] ?? abbrev
}

export function stateNameToAbbrev(name: string): string {
  const map: Record<string, string> = {
    alabama: 'AL', alaska: 'AK', arizona: 'AZ', arkansas: 'AR', california: 'CA',
    colorado: 'CO', connecticut: 'CT', delaware: 'DE', florida: 'FL', georgia: 'GA',
    hawaii: 'HI', idaho: 'ID', illinois: 'IL', indiana: 'IN', iowa: 'IA',
    kansas: 'KS', kentucky: 'KY', louisiana: 'LA', maine: 'ME', maryland: 'MD',
    massachusetts: 'MA', michigan: 'MI', minnesota: 'MN', mississippi: 'MS',
    missouri: 'MO', montana: 'MT', nebraska: 'NE', nevada: 'NV',
    'new hampshire': 'NH', 'new jersey': 'NJ', 'new mexico': 'NM', 'new york': 'NY',
    'north carolina': 'NC', 'north dakota': 'ND', ohio: 'OH', oklahoma: 'OK',
    oregon: 'OR', pennsylvania: 'PA', 'rhode island': 'RI', 'south carolina': 'SC',
    'south dakota': 'SD', tennessee: 'TN', texas: 'TX', utah: 'UT', vermont: 'VT',
    virginia: 'VA', washington: 'WA', 'west virginia': 'WV', wisconsin: 'WI',
    wyoming: 'WY', 'washington d.c.': 'DC',
  }
  return map[name.toLowerCase()] ?? name.toUpperCase().slice(0, 2)
}

export function cityStateSlug(city: string, state: string): string {
  return `${slugify(city)}-${state.toLowerCase()}`
}

export function formatCityState(city: string, state: string): string {
  return `${toTitleCase(city)}, ${state.toUpperCase()}`
}

// Specialty display info
export const SPECIALTIES: Record<string, { name: string; icon: string; description: string }> = {
  'feeding-therapy': {
    name: 'Pediatric Feeding Therapy',
    icon: '🍼',
    description: 'SLPs who specialize in feeding difficulties, food refusal, ARFID, and swallowing disorders in infants and children.',
  },
  'childhood-apraxia': {
    name: 'Childhood Apraxia of Speech',
    icon: '🗣️',
    description: 'Specialists in CAS — a motor speech disorder where children know what they want to say but have difficulty coordinating the movements to say it.',
  },
  'autism-aac': {
    name: 'Autism & AAC',
    icon: '💬',
    description: 'SLPs experienced with autism spectrum disorder and Augmentative & Alternative Communication (AAC) devices and strategies.',
  },
  'aphasia': {
    name: 'Aphasia',
    icon: '🧠',
    description: 'Specialists in aphasia — a language disorder caused by stroke or brain injury that affects speaking, understanding, reading, and writing.',
  },
  'stuttering-fluency': {
    name: 'Stuttering & Fluency',
    icon: '🔊',
    description: 'Fluency specialists who work with children and adults who stutter, including the Lidcombe Program and evidence-based fluency shaping.',
  },
  'voice-disorders': {
    name: 'Voice Disorders',
    icon: '🎙️',
    description: 'Voice therapy for vocal nodules, dysphonia, gender-affirming voice therapy, LSVT Loud for Parkinson\'s, and professional voice users.',
  },
  'dysphagia-swallowing': {
    name: 'Dysphagia & Swallowing',
    icon: '💊',
    description: 'SLPs who evaluate and treat swallowing disorders (dysphagia) in adults, often after stroke, cancer treatment, or neurological conditions.',
  },
  'accent-modification': {
    name: 'Accent Modification',
    icon: '🌍',
    description: 'Accent modification and reduction services for professionals, executives, and non-native English speakers.',
  },
  'selective-mutism': {
    name: 'Selective Mutism',
    icon: '🤫',
    description: 'Specialists in selective mutism — an anxiety-based condition where children can speak in some situations but not others.',
  },
}

export function getSpecialtyInfo(slug: string): { name: string; icon: string; description: string } {
  return SPECIALTIES[slug] ?? { name: toTitleCase(slug.replace(/-/g, ' ')), icon: '🗣️', description: '' }
}
