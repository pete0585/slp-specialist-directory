import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.findslpspecialist.com'),
  title: {
    default: 'SLP Specialist Directory — Find a Speech-Language Pathologist by Specialty',
    template: '%s | SLP Specialist Directory',
  },
  description: 'Find a speech-language pathologist who specializes in what your family needs. Search by condition: apraxia, feeding therapy, autism & AAC, aphasia, stuttering, voice disorders, and more.',
  keywords: ['speech language pathologist', 'SLP near me', 'speech therapist', 'feeding therapist', 'apraxia', 'aphasia therapist', 'stuttering specialist', 'AAC therapist'],
  openGraph: {
    type: 'website',
    siteName: 'SLP Specialist Directory',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen flex flex-col font-sans antialiased bg-white text-gray-900">
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}

function Header() {
  return (
    <header className="bg-brand-slate text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <a href="/" className="flex items-center gap-2">
            <span className="text-brand-emerald font-bold text-2xl">💬</span>
            <span className="font-bold text-lg tracking-tight">SLP Specialist Directory</span>
          </a>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <a href="/slp" className="text-gray-300 hover:text-white transition-colors">Find an SLP</a>
            <a href="/speech-therapist/feeding-therapy" className="text-gray-300 hover:text-white transition-colors">Feeding Therapy</a>
            <a href="/speech-therapist/childhood-apraxia" className="text-gray-300 hover:text-white transition-colors">Apraxia</a>
            <a href="/speech-therapist/autism-aac" className="text-gray-300 hover:text-white transition-colors">Autism & AAC</a>
            <a href="/submit" className="text-gray-300 hover:text-white transition-colors">List Your Practice</a>
          </nav>
          <a
            href="/submit"
            className="hidden md:inline-flex items-center px-4 py-2 bg-brand-emerald text-white text-sm font-semibold rounded-lg hover:bg-brand-emerald-dark transition-colors"
          >
            Add Your Listing
          </a>
          <a href="/slp" className="md:hidden text-gray-300 hover:text-white text-sm font-medium">
            Find an SLP
          </a>
        </div>
      </div>
    </header>
  )
}

function Footer() {
  return (
    <footer className="bg-brand-slate text-gray-400 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-brand-emerald font-bold text-xl">💬</span>
              <span className="text-white font-bold text-lg">SLP Specialist Directory</span>
            </div>
            <p className="text-sm leading-relaxed max-w-sm">
              The only US-wide directory to find a speech-language pathologist by their specific specialty —
              not just by ZIP code. Search by condition: apraxia, feeding therapy, autism &amp; AAC, aphasia, and more.
            </p>
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm mb-3">Browse by Specialty</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/speech-therapist/feeding-therapy" className="hover:text-white transition-colors">Feeding Therapy</a></li>
              <li><a href="/speech-therapist/childhood-apraxia" className="hover:text-white transition-colors">Childhood Apraxia</a></li>
              <li><a href="/speech-therapist/autism-aac" className="hover:text-white transition-colors">Autism &amp; AAC</a></li>
              <li><a href="/speech-therapist/aphasia" className="hover:text-white transition-colors">Aphasia</a></li>
              <li><a href="/speech-therapist/stuttering-fluency" className="hover:text-white transition-colors">Stuttering &amp; Fluency</a></li>
              <li><a href="/speech-therapist/voice-disorders" className="hover:text-white transition-colors">Voice Disorders</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm mb-3">For SLPs</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/submit" className="hover:text-white transition-colors">Add Your Listing</a></li>
              <li><a href="/slp" className="hover:text-white transition-colors">Claim Your Profile</a></li>
            </ul>
            <h3 className="text-white font-semibold text-sm mb-3 mt-6">More Specialties</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/speech-therapist/dysphagia-swallowing" className="hover:text-white transition-colors">Dysphagia &amp; Swallowing</a></li>
              <li><a href="/speech-therapist/accent-modification" className="hover:text-white transition-colors">Accent Modification</a></li>
              <li><a href="/speech-therapist/selective-mutism" className="hover:text-white transition-colors">Selective Mutism</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 pt-8">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} SLP Specialist Directory. For emergencies, call 911.
            SLP data sourced from NPI Registry (public domain, CMS.gov) and self-submitted practitioner profiles.
          </p>
        </div>
      </div>
    </footer>
  )
}
