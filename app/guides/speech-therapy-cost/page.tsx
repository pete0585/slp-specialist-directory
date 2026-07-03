import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'How Much Does Speech Therapy Cost? | FindSLPSpecialist.com',
  description:
    'Speech therapy costs $100–$400 per session without insurance. With insurance, your copay varies by plan. Here is the full breakdown — school services, private pay, insurance, and teletherapy.',
  openGraph: {
    title: 'How Much Does Speech Therapy Cost?',
    description:
      'Private speech therapy, school services, and teletherapy have very different cost structures. Here is what to expect.',
  },
}

export const revalidate = 86400

const FAQ = [
  {
    q: 'How much does a speech therapy evaluation cost?',
    a: 'A private speech-language pathology evaluation typically costs $200–$500 out of pocket. The evaluation is usually 60–90 minutes and includes standardized testing, informal assessment, and a written report with diagnosis and recommendations. Insurance often covers evaluations when medically necessary — your cost depends on your deductible and copay. School-based evaluations for children are free under IDEA (the Individuals with Disabilities Education Act) when a learning or developmental need is suspected.',
  },
  {
    q: 'Does insurance cover speech therapy?',
    a: 'Yes — most health insurance plans cover speech therapy when it is medically necessary (e.g., after stroke, traumatic brain injury, voice disorders, or for children with diagnosed speech/language delays). The Mental Health Parity Act also requires that autism-related services, including speech therapy, be covered at parity in many states. Your out-of-pocket cost depends on your plan's deductible, copay, and any visit limits. Verification of benefits before starting is strongly recommended — coverage and visit limits vary significantly between plans.',
  },
  {
    q: 'Can I get free speech therapy through my child's school?',
    a: 'Yes — under the Individuals with Disabilities Education Act (IDEA), children aged 3–21 with qualifying speech/language delays are entitled to a free, appropriate public education, which includes speech therapy services. School districts must evaluate children at no cost to families when a disability is suspected. If your child qualifies, an Individualized Education Program (IEP) is developed — speech therapy is provided at school during the school year at no charge to you. The downside: school-based SLPs carry large caseloads and typically provide 30-minute sessions once or twice a week, which may not be sufficient for some children.',
  },
  {
    q: 'Is teletherapy for speech therapy as effective as in-person?',
    a: 'For many speech and language goals — including language therapy, stuttering, voice disorders, and cognitive-communication — teletherapy has comparable outcomes to in-person in research studies. The limitations are in areas requiring hands-on work: oral motor therapy, feeding therapy, and some articulation goals where visual and tactile cues from the therapist matter. Teletherapy is also typically less expensive than in-person private practice (often $80–$180/session) and dramatically expands access to specialists — particularly for rare conditions or in areas with few SLPs.',
  },
  {
    q: 'What is the difference between a speech therapist, speech pathologist, and SLP?',
    a: 'They are the same profession — different terms. "Speech therapist" is the everyday term. "Speech-language pathologist" (SLP) is the official professional title. "Speech pathologist" is an informal shorthand. All licensed SLPs hold at minimum a master's degree, have completed a supervised clinical fellowship, and are licensed by their state. Many also hold ASHA CCC-SLP certification (Certificate of Clinical Competence from the American Speech-Language-Hearing Association).',
  },
]

COST_ROWS = [
  { setting: 'School-based (IDEA)', eval_cost: 'Free', therapy: 'Free (during school year)', notes: 'Children 3–21 with qualifying needs' },
  { setting: 'Early intervention (age 0–3)', eval_cost: 'Free to low-cost', therapy: 'Free to sliding scale', notes: 'State-funded; eligibility varies' },
  { setting: 'Hospital / rehab outpatient', eval_cost: '$200–$400', therapy: '$100–$250/session', notes: 'Often insurance-covered; higher copays' },
  { setting: 'Private practice (in-person)', eval_cost: '$250–$500', therapy: '$150–$400/session', notes: 'Typically in-network or out-of-network' },
  { setting: 'Private practice (teletherapy)', eval_cost: '$150–$350', therapy: '$80–$180/session', notes: 'Expanding access; often OON' },
  { setting: 'Intensive programs', eval_cost: 'Included', therapy: '$1,000–$5,000+/week', notes: 'Stuttering camps, aphasia boot camps' },
]

export default function SpeechTherapyCostPage() {
  const faqLd = {
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      <div className="py-10 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <nav className="flex items-center gap-1.5 text-sm text-gray-500 mb-6">
            <Link href="/" className="hover:text-brand-emerald transition-colors">Home</Link>
            <span>/</span>
            <Link href="/slp" className="hover:text-brand-emerald transition-colors">Directory</Link>
            <span>/</span>
            <span className="text-gray-700">Speech Therapy Cost Guide</span>
          </nav>

          <header className="mb-10">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight mb-4">
              How Much Does Speech Therapy Cost?
            </h1>
            <p className="text-gray-500 text-lg leading-relaxed">
              Speech therapy costs range from free (school-based services) to $400/session (private practice specialists).
              Here is the full breakdown by setting — and how insurance factors in.
            </p>
          </header>

          <div className="space-y-10">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-5">Cost by Setting</h2>
              <div className="overflow-x-auto rounded-xl border border-gray-200">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-brand-emerald text-white">
                      <th className="text-left p-3 font-semibold">Setting</th>
                      <th className="text-left p-3 font-semibold">Evaluation</th>
                      <th className="text-left p-3 font-semibold">Therapy Sessions</th>
                      <th className="text-left p-3 font-semibold">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {COST_ROWS.map((row, i) => (
                      <tr key={row.setting} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="p-3 font-medium text-gray-800">{row.setting}</td>
                        <td className="p-3 text-gray-600">{row.eval_cost}</td>
                        <td className="p-3 text-gray-600">{row.therapy}</td>
                        <td className="p-3 text-gray-500 text-xs">{row.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Reducing Your Out-of-Pocket Cost</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { tip: 'Verify benefits before the first visit', detail: 'Call your insurer and ask: Is speech therapy covered? Is pre-authorization required? What is my copay? How many visits are covered per year?' },
                  { tip: 'Request school-based services for children', detail: 'If your child is school-age (3–21), request a school evaluation in writing. Under IDEA, the district must evaluate within 60 days and provide services if eligible — at no cost.' },
                  { tip: 'Consider teletherapy', detail: 'Teletherapy typically costs less than in-person private practice and provides access to specialists your local area may not have.' },
                  { tip: 'Use your HSA or FSA', detail: 'Speech therapy is a qualified medical expense for HSA and FSA accounts. Use pre-tax dollars to reduce the effective cost.' },
                ].map((item) => (
                  <div key={item.tip} className="bg-white border border-gray-200 rounded-xl p-5">
                    <p className="font-bold text-gray-800 mb-2">{item.tip}</p>
                    <p className="text-sm text-gray-600 leading-relaxed">{item.detail}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900">Frequently Asked Questions</h2>
              {FAQ.map((faq) => (
                <div key={faq.q} className="bg-white border border-gray-200 rounded-xl p-6">
                  <h3 className="font-bold text-gray-800 mb-2">{faq.q}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </section>

            <div className="bg-brand-emerald rounded-2xl p-8 text-white text-center">
              <h2 className="text-2xl font-bold mb-3">Find a Speech-Language Pathologist Near You</h2>
              <p className="text-white/80 mb-6 text-sm">
                Search our directory for licensed SLPs by specialty, location, and age group served.
              </p>
              <Link
                href="/slp"
                className="inline-flex items-center gap-2 bg-white text-brand-emerald font-semibold px-8 py-3 rounded-full hover:bg-gray-100 transition-colors"
              >
                Find an SLP Near Me <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="pt-6 border-t border-gray-200">
              <h3 className="font-bold text-gray-800 mb-3">Related Guides</h3>
              <div className="flex flex-wrap gap-3">
                <Link href="/guides/how-to-find-speech-therapist" className="text-sm text-brand-emerald hover:underline font-medium">How to Find a Speech Therapist →</Link>
                <Link href="/guides/child-speech-delay-guide" className="text-sm text-brand-emerald hover:underline font-medium">Child Speech Delay Guide →</Link>
                <Link href="/guides/does-insurance-cover-speech-therapy" className="text-sm text-brand-emerald hover:underline font-medium">Does Insurance Cover Speech Therapy? →</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
