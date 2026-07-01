import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, BookOpen } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Child Speech Delays: When to Seek Help and What to Expect | SLP Specialist Directory',
  description: 'Normal speech milestones, red flags at each age, types of speech and language delays, what happens in a pediatric evaluation, and how speech therapy works for children.',
  alternates: { canonical: 'https://www.findslpspecialist.com/guides/child-speech-delay-guide' },
  openGraph: {
    title: 'Child Speech Delays: Parent\'s Guide to Milestones and When to Seek Help | SLP Specialist Directory',
    description: 'When should children say their first words? What are the red flags for speech delay? When to get an evaluation — and what to expect.',
  },
}

export const revalidate = 86400

const FAQ = [
  {
    q: 'When should I be worried about my child\'s speech?',
    a: 'The clearest red flags by age: by 12 months, no babbling or no pointing/waving/gesturing; by 16 months, no single words; by 24 months, no two-word phrases (like "more milk" or "daddy go"); by 30 months, not using 50+ words or combining words; by 36 months, not understood by familiar adults at least 75% of the time; by 4 years, not understood by strangers at least 75% of the time. Any loss of previously acquired speech or language skills at any age is a red flag and should be evaluated promptly. Research consistently shows that early intervention produces better outcomes — "wait and see" rarely helps and often delays necessary treatment.',
  },
  {
    q: 'What is the difference between a speech delay and a language delay?',
    a: 'Speech refers to the physical production of sounds — articulation, fluency, voice. A speech delay or speech sound disorder means difficulty producing sounds correctly (saying "wabbit" for "rabbit," or being hard to understand). Language refers to the system of words and rules for combining them — vocabulary, grammar, understanding. A language delay means difficulty with the size of vocabulary, sentence structure, or understanding what others say. A child can have a speech delay without a language delay (understands everything, uses age-appropriate vocabulary, just hard to understand due to sound errors) or a language delay without a speech sound disorder. A full evaluation assesses both.',
  },
  {
    q: 'What is childhood apraxia of speech (CAS)?',
    a: 'Childhood apraxia of speech (CAS) is a motor speech disorder — the child\'s brain has difficulty coordinating the muscle movements required for speech. CAS is not caused by muscle weakness (that\'s dysarthria) but by motor planning and programming difficulties. Children with CAS typically have more errors on longer words and phrases than short ones, inconsistent errors (says the same word differently each time), difficulty with graded movements, and limited prosody (flat or unusual intonation). CAS requires specific treatment — a specialized approach called DTTC (Dynamic Temporal and Tactile Cueing) or PROMPT — and does not respond well to the same therapy as a simple articulation delay. CAS can be misdiagnosed; if your child has not responded to standard speech therapy, ask for a specific evaluation for CAS.',
  },
  {
    q: 'How often will my child need speech therapy?',
    a: 'Most pediatric speech therapy is scheduled 1-2 sessions per week, 30-45 minutes per session. The right frequency depends on the severity and type of disorder. Mild articulation delays may resolve with 1x/week therapy over 6-12 months. Childhood apraxia of speech typically requires 3-5 sessions per week at minimum in the intensive phase — more frequency produces better outcomes for CAS than less frequent sessions. Complex language disorders or severe delays may require intensive initial treatment followed by maintenance. Home practice between sessions is a critical part of all pediatric SLP programs — a parent who practices daily with a child will see significantly faster progress than one who relies on therapy sessions alone.',
  },
]

export default function ChildSpeechDelayGuidePage() {
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
            <span className="text-gray-700">Child Speech Delays</span>
          </nav>

          <div className="flex items-center gap-2 text-brand-emerald text-sm font-medium mb-3">
            <BookOpen className="h-4 w-4" />
            <span>Resource guide</span>
          </div>

          <h1 className="text-3xl font-bold text-brand-slate tracking-tight mb-4">
            Child Speech Delays: When to Seek Help and What to Expect
          </h1>
          <p className="text-gray-600 text-sm mb-8">
            Most parents who seek speech therapy evaluation for their children waited too long — not too soon. This guide gives you the concrete milestones and red flags to watch for, and explains what happens when you get an evaluation.
          </p>

          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-brand-slate mb-4">Normal speech milestones by age</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                These are evidence-based developmental norms from ASHA and the American Academy of Pediatrics.
                Individual variation exists — but deviation from these norms warrants evaluation, not waiting.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-brand-slate text-white">
                      <th className="text-left p-3 rounded-tl-xl">Age</th>
                      <th className="text-left p-3">Expected Development</th>
                      <th className="text-left p-3 rounded-tr-xl">Intelligibility</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {[
                      { age: '12 months', dev: 'First words emerging; babbling with varied consonants; pointing, waving, other gestures', intel: 'Mostly babble and jargon' },
                      { age: '18 months', dev: '10-20 words; understands 50+ words; points to named pictures', intel: '~25% to strangers' },
                      { age: '24 months', dev: '50+ words; 2-word combinations ("more juice," "daddy go"); vocabulary growing rapidly', intel: '~50% to strangers' },
                      { age: '3 years', dev: '3-word sentences; 200-1,000 words; asks "why?"; answers simple questions; grammar emerging', intel: '~75% to familiar adults' },
                      { age: '4 years', dev: 'Full sentences; tells stories; most sounds produced correctly; can follow 3-step directions', intel: '~75-90% to strangers' },
                      { age: '5 years', dev: 'Adult-like grammar; complex sentences; age-appropriate narrative; all sounds except /r/ and /th/ mastered', intel: 'Near 100% to strangers' },
                    ].map(({ age, dev, intel }) => (
                      <tr key={age} className="bg-white odd:bg-gray-50">
                        <td className="p-3 font-semibold text-brand-slate whitespace-nowrap">{age}</td>
                        <td className="p-3 text-gray-700">{dev}</td>
                        <td className="p-3 text-gray-600 text-xs">{intel}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-brand-slate mb-3">Red flags at each age</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Parents often minimize concerns or accept reassurance to &ldquo;wait and see.&rdquo; Research consistently
                shows that early intervention produces better outcomes. If you see these red flags, request
                an evaluation — not in 6 months, now.
              </p>
              <div className="space-y-3">
                {[
                  { age: 'By 12 months', flags: ['No babbling', 'No pointing, waving, or other gestures', 'No response to name', 'Loss of any previously acquired communication skills'] },
                  { age: 'By 18 months', flags: ['No single words', 'No pointing to show interest or request', 'Fewer than 6 words consistently'] },
                  { age: 'By 24 months', flags: ['Fewer than 50 words', 'No two-word combinations', 'Cannot follow 2-step instructions', 'Loss of any words previously used'] },
                  { age: 'By 3 years', flags: ['Cannot be understood by familiar adults', 'Not combining 3+ words', 'Not asking questions', 'Vocabulary not growing noticeably each month'] },
                  { age: 'By 4 years', flags: ['Strangers cannot understand most of what child says', 'Leaving off word endings consistently', 'Not using complex sentences', 'Significant frustration when communicating'] },
                ].map(({ age, flags }) => (
                  <div key={age} className="bg-white border border-gray-200 rounded-xl p-4">
                    <h3 className="font-bold text-brand-slate mb-2">{age}</h3>
                    <ul className="space-y-1">
                      {flags.map((flag) => (
                        <li key={flag} className="text-sm text-gray-600 flex gap-2">
                          <span className="text-brand-emerald font-bold mt-0.5">!</span>
                          <span>{flag}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-brand-slate mb-3">Types of speech and language delays</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Not all &ldquo;speech delays&rdquo; are the same. The type of delay affects the treatment approach significantly.
              </p>
              <div className="space-y-3 text-gray-700">
                <div>
                  <p className="font-semibold">Expressive language delay</p>
                  <p className="text-sm leading-relaxed">The child understands more than they can express — vocabulary below age level, fewer words than expected, shorter sentences. Often responds well to parent-coaching models and play-based language intervention.</p>
                </div>
                <div>
                  <p className="font-semibold">Receptive language delay</p>
                  <p className="text-sm leading-relaxed">The child has difficulty understanding language — following directions, understanding questions, comprehending what is read to them. More significant and often associated with other developmental concerns. Warrants prompt evaluation.</p>
                </div>
                <div>
                  <p className="font-semibold">Articulation disorder</p>
                  <p className="text-sm leading-relaxed">Difficulty producing specific speech sounds — substituting one sound for another, distorting sounds, or omitting sounds. Treatment focuses on teaching correct tongue, lip, and jaw placement for target sounds.</p>
                </div>
                <div>
                  <p className="font-semibold">Phonological disorder</p>
                  <p className="text-sm leading-relaxed">A pattern of sound errors that affects multiple sounds at once — for example, dropping all final consonants, or fronting all back sounds. Different from a single articulation error; requires different treatment approach.</p>
                </div>
                <div>
                  <p className="font-semibold">Childhood Apraxia of Speech (CAS)</p>
                  <p className="text-sm leading-relaxed">A motor speech disorder where the brain has difficulty coordinating speech movements. Inconsistent errors, difficulty with longer words, limited prosody. Requires specialized treatment (DTTC, PROMPT) and does not respond to standard articulation therapy.</p>
                </div>
                <div>
                  <p className="font-semibold">Language delay vs. language disorder</p>
                  <p className="text-sm leading-relaxed">A language delay means skills are developing in the typical pattern, just more slowly. A language disorder means the pattern of development is atypical — skills are not just delayed but qualitatively different. Disorders are more persistent and require ongoing SLP support.</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-brand-slate mb-3">What happens in a pediatric speech evaluation</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                A comprehensive pediatric speech-language evaluation typically includes:
              </p>
              <ol className="space-y-4 text-gray-700">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-slate text-white text-xs flex items-center justify-center font-bold">1</span>
                  <div>
                    <p className="font-semibold">Parent or caregiver interview</p>
                    <p className="text-sm leading-relaxed">Medical history, developmental history, family history of speech or language difficulties, current communication abilities at home. The SLP wants to know what you observe in your daily life — this information shapes the evaluation.</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-slate text-white text-xs flex items-center justify-center font-bold">2</span>
                  <div>
                    <p className="font-semibold">Standardized testing</p>
                    <p className="text-sm leading-relaxed">The SLP administers validated norm-referenced assessments to compare the child&apos;s performance to age-matched peers. Common assessments include the GFTA-3 (articulation), CELF (language), PLS (preschool language), ROWPVT/EOWPVT (vocabulary). Standardized scores give the diagnostic picture and justify services.</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-slate text-white text-xs flex items-center justify-center font-bold">3</span>
                  <div>
                    <p className="font-semibold">Play-based observation and speech sampling</p>
                    <p className="text-sm leading-relaxed">For young children especially, the SLP observes natural communication during play and records a language sample to analyze mean length of utterance, vocabulary diversity, grammatical accuracy, and pragmatic function. Children are much more communicative in play than in formal testing.</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-slate text-white text-xs flex items-center justify-center font-bold">4</span>
                  <div>
                    <p className="font-semibold">Oral mechanism examination</p>
                    <p className="text-sm leading-relaxed">A quick assessment of the oral structures — tongue, lips, jaw, palate — to rule out structural contributors to speech difficulties. Most speech delays are not caused by structural problems, but an oral exam is a standard component of a comprehensive evaluation.</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-slate text-white text-xs flex items-center justify-center font-bold">5</span>
                  <div>
                    <p className="font-semibold">Feedback, diagnosis, and recommendations</p>
                    <p className="text-sm leading-relaxed">After the evaluation, the SLP provides diagnostic conclusions, explains what the scores mean, and recommends whether therapy is indicated, at what frequency, and with what goals. A written evaluation report with standardized scores and diagnostic conclusions should be provided.</p>
                  </div>
                </li>
              </ol>
              <p className="text-gray-600 text-sm mt-4 leading-relaxed">
                A full evaluation typically takes 60-90 minutes. Many SLPs schedule the parent feedback session
                separately after scoring is complete. Bring your concerns in writing — SLPs appreciate specific
                examples from daily life more than general descriptions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-brand-slate mb-3">How often does speech therapy happen?</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Therapy frequency depends on the type and severity of the disorder:
              </p>
              <div className="space-y-3 text-gray-700">
                <div>
                  <p className="font-semibold">Mild articulation delay</p>
                  <p className="text-sm">1x/week, 30-45 minute sessions for 6-12 months. Parent home practice daily. Good prognosis for resolution.</p>
                </div>
                <div>
                  <p className="font-semibold">Language delay or disorder</p>
                  <p className="text-sm">1-2x/week for ongoing language delay; 2x/week for more significant disorders. Parent-coaching component is critical — generalization of language skills happens at home, not just in the therapy room.</p>
                </div>
                <div>
                  <p className="font-semibold">Childhood Apraxia of Speech</p>
                  <p className="text-sm">3-5x/week in the intensive phase, then stepping down as motor programs establish. Frequency matters more for CAS than for most other conditions. 1x/week is often insufficient for meaningful progress.</p>
                </div>
                <div>
                  <p className="font-semibold">School IEP services</p>
                  <p className="text-sm">Typically 1-2 sessions per week of 20-30 minutes within the school day, often in small groups. Adequate for educational impact goals; often insufficient as the sole treatment for moderate-severe delays.</p>
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
            <h2 className="text-xl font-bold text-white mb-3">Find a pediatric SLP near you</h2>
            <p className="text-gray-400 mb-6 text-sm">
              Search our directory to find a speech-language pathologist who specializes in your child&apos;s needs.
            </p>
            <Link
              href="/speech-therapist/pediatric-speech-language"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-emerald hover:bg-brand-emerald-dark px-8 py-3 text-sm font-bold text-white transition-colors"
            >
              Find Pediatric SLPs <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
