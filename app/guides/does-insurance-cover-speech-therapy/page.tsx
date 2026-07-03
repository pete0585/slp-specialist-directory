import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Does Insurance Cover Speech Therapy? | FindSLPSpecialist.com',
  description:
    'Most insurance plans cover speech therapy when it is medically necessary — but coverage rules, visit limits, and prior authorization requirements vary significantly. Here is how to navigate it.',
  openGraph: {
    title: 'Does Insurance Cover Speech Therapy?',
    description:
      'Insurance covers speech therapy when medically necessary — but prior auth, visit limits, and medical necessity criteria apply. Here is what to know.',
  },
}

export const revalidate = 86400

const FAQ = [
  {
    q: 'What makes speech therapy "medically necessary" for insurance purposes?',
    a: 'Insurers define medical necessity for speech therapy based on: a documented diagnosis (aphasia, voice disorder, dysphagia, specific language disorder, autism spectrum disorder, stuttering, or a condition causing the communication impairment), functional impairment from the condition, and a reasonable expectation of improvement with treatment. For children, a formal diagnosis is typically required — "speech delay" alone may not qualify; "specific language impairment" or a DSM-5 diagnosis often does. For adults, post-stroke aphasia, TBI, or head/neck cancer treatment are common covered indications.',
  },
  {
    q: 'Do I need a referral from my doctor for speech therapy?',
    a: 'It depends on your insurance plan. HMO plans typically require a referral from your primary care physician before seeing a specialist, including an SLP. PPO plans usually allow direct access to specialists. Even if a referral is not required, your SLP will typically request records from your physician, and the insurer may require documentation of the medical condition being treated. For children with autism or developmental delays, a diagnosis from a pediatrician or developmental pediatrician strengthens the insurance claim.',
  },
  {
    q: 'Does Medicaid cover speech therapy?',
    a: 'Yes — Medicaid covers speech therapy for children under EPSDT (Early and Periodic Screening, Diagnostic, and Treatment) benefits, which require all medically necessary services to be provided. For adults, Medicaid speech therapy coverage varies by state — most cover it for medically necessary conditions. Medicaid reimbursement rates are typically lower than private insurance, which means not all SLPs accept Medicaid. Check your state's Medicaid program or call your managed Medicaid plan for specifics.',
  },
  {
    q: 'How many speech therapy visits does insurance typically cover?',
    a: 'This varies significantly. Some plans have no visit limit (covering all medically necessary visits). Others cap at 20–60 visits per year. ACA marketplace plans are required to cover habilitative services (including speech therapy for developmental conditions) — but the number of covered visits differs. The Mental Health Parity Act applies to autism-related services: if a plan covers unlimited physical therapy visits, it generally cannot cap autism/speech therapy visits differently. Visit limits that discriminate against habilitative vs. rehabilitative services may be a parity violation.',
  },
  {
    q: 'What if my insurance claim for speech therapy is denied?',
    a: 'Appeals succeed frequently. Common denial reasons — and how to appeal: "Not medically necessary" → provide additional clinical documentation from your SLP and referring physician, including functional impact and prognosis. "Exceeds visit limit" → cite Mental Health Parity Act if applicable, or request an exception based on medical necessity. "No prior authorization" → obtain retroactive authorization or appeal on the basis that authorization was not clearly required. Request a peer-to-peer review between your SLP and the insurance medical reviewer — this overturns many denials. If internal appeals fail, request an external independent medical review.',
  },
]

export default function InsuranceCoversSpeechTherapyPage() {
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
            <span className="text-gray-700">Speech Therapy Insurance Guide</span>
          </nav>

          <header className="mb-10">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight mb-4">
              Does Insurance Cover Speech Therapy?
            </h1>
            <p className="text-gray-500 text-lg leading-relaxed">
              Most insurance plans cover speech therapy when it is medically necessary —
              but prior authorization requirements, visit limits, and what counts as "medically necessary"
              vary significantly between plans.
            </p>
          </header>

          <div className="space-y-10">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Coverage by Plan Type</h2>
              <div className="space-y-4">
                {[
                  { plan: 'Employer-Sponsored Insurance (ESI)', coverage: 'Typically covered — most large employer plans include speech therapy under medical or habilitative services benefits. Visit limits and prior auth requirements vary by plan design.' },
                  { plan: 'ACA Marketplace Plans', coverage: 'Required to cover habilitative services (including speech therapy for developmental conditions). The number of covered visits is not federally mandated — varies by plan.' },
                  { plan: 'Medicaid', coverage: 'Covered for children under EPSDT (all medically necessary services). Adult coverage varies by state — most cover it for acute conditions.' },
                  { plan: 'Medicare (Parts A/B)', coverage: 'Covered when medically necessary (post-stroke, TBI, cancer treatment). Must show functional improvement. Medicare Part A covers inpatient speech therapy; Part B covers outpatient.' },
                  { plan: 'TRICARE', coverage: 'Covered for medically necessary speech therapy. TRICARE for Kids covers speech therapy for children with autism when prescribed by a physician.' },
                ].map((item) => (
                  <div key={item.plan} className="bg-white border border-gray-200 rounded-xl p-5">
                    <p className="font-bold text-gray-800 mb-2">{item.plan}</p>
                    <p className="text-sm text-gray-600 leading-relaxed">{item.coverage}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Before Your First Appointment: Insurance Checklist</h2>
              <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                <ul className="space-y-2">
                  {[
                    'Call the member services number on your insurance card',
                    'Ask: Is speech therapy covered under my plan?',
                    'Ask: Is prior authorization required before starting?',
                    'Ask: What is the annual visit limit?',
                    'Ask: Is [specific SLP name or practice] in-network?',
                    'Ask: What is my deductible and has it been met?',
                    'Ask: What is my copay or coinsurance for specialist visits?',
                    'Document the call: agent name, reference number, date and time',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="text-brand-emerald font-bold mt-0.5">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
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
              <h2 className="text-2xl font-bold mb-3">Find an SLP Who Takes Your Insurance</h2>
              <p className="text-white/80 mb-6 text-sm">
                Search our directory and filter by insurance accepted, specialty, and location.
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
                <Link href="/guides/speech-therapy-cost" className="text-sm text-brand-emerald hover:underline font-medium">Speech Therapy Cost Guide →</Link>
                <Link href="/guides/how-to-find-speech-therapist" className="text-sm text-brand-emerald hover:underline font-medium">How to Find a Speech Therapist →</Link>
                <Link href="/guides/child-speech-delay-guide" className="text-sm text-brand-emerald hover:underline font-medium">Child Speech Delay Guide →</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
