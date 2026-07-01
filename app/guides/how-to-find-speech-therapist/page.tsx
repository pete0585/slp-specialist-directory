import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, BookOpen } from 'lucide-react'

export const metadata: Metadata = {
  title: 'How to Find a Speech-Language Pathologist (SLP) Near You | SLP Specialist Directory',
  description: 'Step-by-step guide to finding the right speech therapist — how SLPs differ from coaches, types of SLPs, getting a referral, insurance basics, and what to look for.',
  alternates: { canonical: 'https://www.findslpspecialist.com/guides/how-to-find-speech-therapist' },
  openGraph: {
    title: 'How to Find an SLP: A Complete Patient Guide | SLP Specialist Directory',
    description: 'What to know before finding a speech-language pathologist — SLP types, referrals, insurance, school services, and what to look for.',
  },
}

export const revalidate = 86400

const FAQ = [
  {
    q: 'What is the difference between an SLP and a speech coach?',
    a: 'A speech-language pathologist (SLP) is a licensed healthcare professional who holds at minimum a master\'s degree in communication sciences and disorders, passes the Praxis exam, and holds a state license. SLPs are authorized to diagnose and treat communication disorders — including speech delays, language disorders, stuttering, voice disorders, swallowing disorders, and aphasia. The ASHA CCC-SLP (Certificate of Clinical Competence) is the gold-standard credential, awarded by the American Speech-Language-Hearing Association after completing supervised clinical hours and a national exam. A "speech coach" or "communication coach" is an unregulated title with no licensure requirement. Coaches may be helpful for accent modification or public speaking confidence, but they cannot legally diagnose or treat speech or language disorders. If there is a clinical concern — a child with delayed speech, an adult with aphasia, a swallowing problem — you need a licensed SLP, not a coach.',
  },
  {
    q: 'Do I need a referral to see a speech therapist?',
    a: 'It depends on your insurance and your state. Most adults can self-refer to a private practice SLP without a physician referral — you call, make an appointment, and pay out of pocket or bill insurance directly. However, many insurance plans require a physician referral for SLP services to be covered. Medicaid often requires a referral from a primary care provider. For children, pediatricians typically coordinate referrals to both school-based and private SLP evaluation. Always verify with your specific insurance plan before scheduling.',
  },
  {
    q: 'What is the difference between school-based SLP services and private SLP?',
    a: 'School-based SLPs (employed by public schools under IDEA) provide services specifically to address a student\'s educational impact — the threshold is whether the speech or language issue affects the student\'s ability to access the curriculum, not whether it affects overall communication function. Private practice SLPs can address the full range of communication goals without the educational mandate constraint. A child with an IEP may receive school-based SLP services and also see a private SLP for more intensive therapy — these services are separate and complementary. School-based services are free under IDEA; private SLP is billed to insurance or paid out of pocket.',
  },
  {
    q: 'How much does a speech therapy evaluation cost without insurance?',
    a: 'A full speech-language evaluation by a private practice SLP typically costs $300-700 without insurance, depending on the type and depth of assessment. Diagnostic evaluations (standardized testing + parent/patient interview + written report) are at the higher end; screenings are lower. Ongoing therapy sessions typically run $100-250 per session. University clinic programs supervised by licensed SLPs often offer reduced-rate evaluations ($100-200) and therapy — worth considering if cost is a barrier. ASHA\'s "Find an SLP" tool can also help identify providers in your area.',
  },
]

export default function HowToFindSpeechTherapistPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="py-10 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <nav className="flex items-center gap-1.5 text-sm text-gray-500 mb-6">
            <Link href="/" className="hover:text-brand-emerald transition-colors">Home</Link>
            <span>/</span>
            <Link href="/slp" className="hover:text-brand-emerald transition-colors">Directory</Link>
            <span>/</span>
            <span className="text-gray-700">Guides</span>
            <span>/</span>
            <span className="text-gray-700">How to Find an SLP</span>
          </nav>

          <div className="flex items-center gap-2 text-brand-emerald text-sm font-medium mb-3">
            <BookOpen className="h-4 w-4" />
            <span>Resource guide</span>
          </div>

          <h1 className="text-3xl font-bold text-brand-slate tracking-tight mb-4">
            How to Find a Speech-Language Pathologist (SLP) Near You
          </h1>
          <p className="text-gray-600 text-sm mb-8">
            Finding the right speech therapist is not as simple as searching for the nearest provider. The type of SLP matters, the referral process varies by insurance, and school-based services are different from private practice. Here is what you need to know.
          </p>

          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-brand-slate mb-3">SLPs vs. speech coaches vs. communication coaches</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                A speech-language pathologist (SLP) is a licensed healthcare professional with a graduate degree in
                communication sciences and disorders. To practice clinically, an SLP must:
              </p>
              <ul className="space-y-2 text-gray-700 mb-4">
                <li className="flex gap-3"><span className="text-brand-emerald font-bold mt-0.5">→</span><span>Complete a master&apos;s degree or doctoral degree in speech-language pathology</span></li>
                <li className="flex gap-3"><span className="text-brand-emerald font-bold mt-0.5">→</span><span>Pass the Praxis examination in speech-language pathology</span></li>
                <li className="flex gap-3"><span className="text-brand-emerald font-bold mt-0.5">→</span><span>Complete a supervised clinical fellowship year</span></li>
                <li className="flex gap-3"><span className="text-brand-emerald font-bold mt-0.5">→</span><span>Hold a state license in their practice state (all 50 states require licensure)</span></li>
              </ul>
              <p className="text-gray-700 leading-relaxed mb-4">
                The ASHA CCC-SLP (Certificate of Clinical Competence from the American Speech-Language-Hearing
                Association) is an additional voluntary credential indicating the SLP has met ASHA&apos;s continuing
                education and competency standards. Most insurance plans require CCC-SLP for reimbursement.
              </p>
              <p className="text-gray-700 leading-relaxed">
                &ldquo;Speech coach&rdquo; and &ldquo;communication coach&rdquo; have no licensure requirements. They may be appropriate
                for accent modification or professional presentation skills — but they cannot diagnose speech
                or language disorders or treat clinical conditions. For any child with speech concerns or any
                adult with a neurological communication disorder, only a licensed SLP is appropriate.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-brand-slate mb-3">What kinds of SLPs are there?</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                SLPs specialize across very different areas of practice. Finding an SLP with the right specialty
                for your specific need matters far more than geographic convenience alone.
              </p>
              <div className="space-y-3">
                {[
                  { name: 'Pediatric SLPs', desc: 'Work with infants, toddlers, and children on speech sound disorders, language delays, social communication, and developmental milestones. The most common private practice specialization.' },
                  { name: 'Feeding and Swallowing Specialists', desc: 'Work with infants (bottle and breastfeeding difficulties, failure to thrive) and older children with sensory-based feeding disorders. Also serve adults with dysphagia (swallowing difficulties after stroke, cancer treatment, or neurological conditions).' },
                  { name: 'Adult Neurogenic SLPs', desc: 'Specialize in communication and swallowing disorders caused by stroke, traumatic brain injury, Parkinson\'s, ALS, or other neurological events. Aphasia, dysarthria, and cognitive-communication disorders are core competencies.' },
                  { name: 'Fluency Specialists', desc: 'Specialize in stuttering and cluttering. Fluency therapy requires specific training and is distinct from general speech therapy — not all SLPs have strong stuttering expertise.' },
                  { name: 'Voice Specialists', desc: 'Work with singers, teachers, actors, and others with professional voice demands, as well as people with voice disorders (nodules, vocal fold paralysis, gender-affirming voice). Often co-treat with ENT physicians.' },
                  { name: 'AAC Specialists', desc: 'Specialize in augmentative and alternative communication for individuals who are minimally verbal or non-speaking — autism, ALS, cerebral palsy, rare syndromes. This is a high-specialization area with specific technology expertise.' },
                ].map(({ name, desc }) => (
                  <div key={name} className="bg-white border border-gray-200 rounded-xl p-4">
                    <h3 className="font-bold text-brand-slate mb-1">{name}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{desc}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-brand-slate mb-3">How to get a referral vs. self-referral</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                The referral question depends on your insurance and your reason for seeking SLP services:
              </p>
              <div className="space-y-4 text-gray-700">
                <div>
                  <p className="font-semibold mb-1">For children</p>
                  <p className="leading-relaxed">Start with the pediatrician. Pediatricians can refer to both private practice SLPs (for intensive therapy) and to the local school district for evaluation under IDEA (for school-based services). You can also contact your local school district directly for a free speech and language evaluation at any age from birth through 21 under IDEA — no referral needed for this route. Both pathways can run simultaneously.</p>
                </div>
                <div>
                  <p className="font-semibold mb-1">For adults</p>
                  <p className="leading-relaxed">Most adults can self-refer to private practice SLPs without a physician referral, but insurance coverage for self-referred SLP services varies. After a stroke or neurological event, the hospital or rehabilitation team typically coordinates SLP referrals. For voice disorders, an ENT evaluation often precedes SLP — laryngoscopy to assess vocal fold structure before beginning voice therapy is standard practice.</p>
                </div>
                <div>
                  <p className="font-semibold mb-1">Insurance and prior authorization</p>
                  <p className="leading-relaxed">Many insurance plans require prior authorization before SLP services are covered. Call your insurance member services number before your first appointment to confirm: (1) whether SLP services are covered under your plan; (2) whether a referral or prior authorization is required; (3) how many visits are covered per year; (4) what your copay or coinsurance is. Getting this information before you start saves significant frustration.</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-brand-slate mb-3">What to look for in an SLP for your child vs. adult care</h2>
              <div className="grid sm:grid-cols-2 gap-5">
                <div className="bg-white border border-gray-200 rounded-xl p-5">
                  <h3 className="font-bold text-brand-slate mb-2">For a child</h3>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li>✓ Pediatric specialization (not just general SLP)</li>
                    <li>✓ Experience with your child&apos;s specific condition (apraxia vs. articulation vs. language delay are different)</li>
                    <li>✓ Play-based therapy approach for young children</li>
                    <li>✓ Parent coaching component (you practice between sessions)</li>
                    <li>✓ Bilingual therapy if your home language is not English</li>
                    <li>✓ PROMPT certification for apraxia of speech cases</li>
                  </ul>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-5">
                  <h3 className="font-bold text-brand-slate mb-2">For an adult</h3>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li>✓ Specialization in the specific condition (aphasia ≠ dysarthria ≠ voice disorder)</li>
                    <li>✓ Experience with your diagnosis (e.g., stroke vs. TBI vs. Parkinson&apos;s)</li>
                    <li>✓ Evidence-based treatment approach (LSVT LOUD for Parkinson&apos;s, CILT for aphasia)</li>
                    <li>✓ Family or caregiver training component</li>
                    <li>✓ Telehealth availability if travel is difficult</li>
                    <li>✓ Coordination with your medical team</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-brand-slate mb-3">Insurance, school-based services, and private pay</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                The three funding streams for SLP services serve different needs and have different rules:
              </p>
              <div className="space-y-3 text-gray-700">
                <div>
                  <p className="font-semibold">School-based SLP (IDEA — free)</p>
                  <p className="text-sm leading-relaxed">Public schools are legally required under IDEA to evaluate and serve students with communication disorders that affect their educational access. School SLP services are free to families. The scope is limited to educational impact — which is why many families supplement school services with private SLP.</p>
                </div>
                <div>
                  <p className="font-semibold">Insurance-covered private SLP</p>
                  <p className="text-sm leading-relaxed">Most major insurance plans cover SLP services for medically necessary conditions with appropriate documentation. Coverage depth varies significantly — confirm your benefits before starting. ABA funding (often available for autism) does not include SLP directly, but many children on ABA plans also have separate SLP coverage.</p>
                </div>
                <div>
                  <p className="font-semibold">Private pay SLP</p>
                  <p className="text-sm leading-relaxed">Many SLPs do not accept insurance — particularly feeding specialists, stuttering specialists, and voice therapists who serve specialized populations. Private pay SLPs often have shorter waitlists, more schedule flexibility, and may offer more intensive therapy schedules than insurance-paneled practices.</p>
                </div>
              </div>
            </section>
          </div>

          <section className="mt-16">
            <h2 className="text-2xl font-bold text-brand-slate mb-8">Frequently Asked Questions</h2>
            <div className="space-y-5">
              {FAQ.map(({ q, a }) => (
                <div key={q} className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="font-bold text-brand-slate mb-3">{q}</h3>
                  <p className="text-gray-600 leading-relaxed text-sm">{a}</p>
                </div>
              ))}
            </div>
          </section>

          <div className="mt-12 rounded-2xl bg-brand-slate p-8 text-center">
            <h2 className="text-xl font-bold text-white mb-3">Find the right SLP for your needs</h2>
            <p className="text-gray-400 mb-6 text-sm">
              Search our directory by specialty and location to find a licensed SLP who matches your specific situation.
            </p>
            <Link
              href="/slp"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-emerald hover:bg-brand-emerald-dark px-8 py-3 text-sm font-bold text-white transition-colors"
            >
              Browse SLPs by Specialty <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
