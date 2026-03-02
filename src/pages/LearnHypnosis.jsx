import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "../utils";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import SEO from "../components/SEO";
import CmsText from "../components/cms/CmsText";
import LearnSectionGrid from "../components/hypnosis/LearnSectionGrid";
import IncludedSectionGrid from "../components/hypnosis/IncludedSectionGrid";
import { 
  Brain, 
  Heart, 
  Users, 
  BookOpen, 
  Award, 
  CheckCircle, 
  ArrowRight,
  Sparkles,
  Target,
  MessageCircle
} from "lucide-react";

export default function LearnHypnosis() {
  return (
    <div className="bg-[var(--brand-cream)]">
      <SEO
        title="Learn Hypnosis | The Mind Stylist™"
        description="Become a confident, ethical, emotionally intelligent hypnotist using Roberta's signature Mind Styling™ approach to subconscious change. Perfect for beginners and professionals."
        canonical="/learn-hypnosis"
      />

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-b from-[var(--brand-green)] to-[var(--brand-charcoal)]">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <span className="text-[var(--brand-gold)] text-xs tracking-[0.3em] uppercase mb-4 block">
              <CmsText 
                contentKey="hypnosis.hero.subtitle"
                page="LearnHypnosis"
                blockTitle="Hero Subtitle"
                fallback="Hypnosis Training"
                contentType="short_text"
                as="span"
              />
            </span>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-[var(--brand-cream)] leading-tight mb-6">
              <CmsText 
                contentKey="hypnosis.hero.title"
                page="LearnHypnosis"
                blockTitle="Hero Title"
                fallback="Learn Hypnosis with The Mind Stylist™"
                contentType="short_text"
              />
            </h1>
            <p className="text-[var(--brand-cream)]/90 text-xl md:text-2xl leading-relaxed mb-8 max-w-3xl mx-auto">
              <CmsText 
                contentKey="hypnosis.hero.tagline"
                page="LearnHypnosis"
                blockTitle="Hero Tagline"
                fallback="Train your mind to guide others—and yourself—into calm, clarity, and emotional transformation."
                contentType="rich_text"
              />
            </p>
            <p className="text-[var(--brand-cream)]/80 text-lg leading-relaxed mb-6 max-w-3xl mx-auto">
              <CmsText 
                contentKey="hypnosis.hero.description"
                page="LearnHypnosis"
                blockTitle="Hero Description"
                fallback="Become a confident, ethical, emotionally intelligent hypnotist using Roberta's signature Mind Styling™ approach to subconscious change."
                contentType="rich_text"
              />
            </p>
            <p className="text-[var(--brand-gold)] text-base mb-10">
              <CmsText 
                contentKey="hypnosis.hero.perfect"
                page="LearnHypnosis"
                blockTitle="Hero Perfect For"
                fallback="Perfect for beginners, coaches, therapists, and anyone ready to help others reshape their inner world."
                contentType="rich_text"
              />
            </p>
            <Link
              to={createPageUrl("Contact")}
              className="inline-flex items-center gap-3 px-8 py-4 bg-[var(--brand-gold)] text-[var(--brand-green)] text-sm tracking-wide hover:bg-[var(--brand-cream)] transition-all duration-300"
            >
              Begin Your Training
              <ArrowRight size={18} />
            </Link>
          </motion.div>

          {/* Training Video */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="aspect-video bg-[var(--brand-charcoal)] mt-12 relative overflow-hidden rounded-lg"
          >
            <iframe
              src="https://player.vimeo.com/video/1153704942?badge=0&autopause=0&player_id=0&app_id=58479"
              allow="autoplay; fullscreen; picture-in-picture; clipboard-write"
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
              title="Hypnosis Training Introduction"
            />
          </motion.div>
        </div>
      </section>

      {/* Section 1 — Why Learn Hypnosis with Roberta? */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-12">
              <Heart size={40} className="text-[var(--brand-gold)] mx-auto mb-4" />
              <h2 className="font-serif text-3xl md:text-4xl text-[var(--brand-green)] mb-6">
                <CmsText 
                  contentKey="hypnosis.why.title"
                  page="LearnHypnosis"
                  blockTitle="Why Section Title"
                  fallback="Why Learn Hypnosis with Roberta?"
                  contentType="short_text"
                />
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="bg-[var(--brand-cream)] p-8">
                <p className="text-[var(--brand-charcoal)]/60 text-lg mb-2">
                  <CmsText 
                    contentKey="hypnosis.why.compare1a"
                    page="LearnHypnosis"
                    blockTitle="Why Compare 1A"
                    fallback="Most hypnosis trainings teach scripts."
                    contentType="rich_text"
                  />
                </p>
                <p className="font-serif text-2xl text-[var(--brand-green)]">
                  <CmsText 
                    contentKey="hypnosis.why.compare1b"
                    page="LearnHypnosis"
                    blockTitle="Why Compare 1B"
                    fallback="Roberta teaches human understanding."
                    contentType="rich_text"
                  />
                </p>
              </div>
              <div className="bg-[var(--brand-cream)] p-8">
                <p className="text-[var(--brand-charcoal)]/60 text-lg mb-2">
                  <CmsText 
                    contentKey="hypnosis.why.compare2a"
                    page="LearnHypnosis"
                    blockTitle="Why Compare 2A"
                    fallback="Most focus on what to say."
                    contentType="rich_text"
                  />
                </p>
                <p className="font-serif text-2xl text-[var(--brand-green)]">
                  <CmsText 
                    contentKey="hypnosis.why.compare2b"
                    page="LearnHypnosis"
                    blockTitle="Why Compare 2B"
                    fallback="Roberta teaches you how to listen."
                    contentType="rich_text"
                  />
                </p>
              </div>
            </div>

            <div className="max-w-3xl mx-auto text-center mb-10">
              <p className="text-[var(--brand-charcoal)]/80 text-lg leading-relaxed mb-6">
                <CmsText 
                  contentKey="hypnosis.why.intro1"
                  page="LearnHypnosis"
                  blockTitle="Why Intro 1"
                  fallback="This training goes beyond technique. It introduces you to the emotional, rhythmic, and relational art of helping someone change their mind—internally, safely, and effectively."
                  contentType="rich_text"
                />
              </p>
              <p className="text-[var(--brand-charcoal)]/80 text-lg leading-relaxed mb-6">
                <CmsText 
                  contentKey="hypnosis.why.intro2"
                  page="LearnHypnosis"
                  blockTitle="Why Intro 2"
                  fallback="You'll learn a modern, grounded approach rooted in:"
                  contentType="rich_text"
                />
              </p>
            </div>

            <CmsText 
              contentKey="hypnosis.why.principles"
              page="LearnHypnosis"
              blockTitle="Why Principles List"
              fallback={`<div class='grid md:grid-cols-3 gap-6 max-w-4xl mx-auto'>${["Neuroscience", "Emotional repatterning", "Subconscious communication", "Therapeutic language", "Mind Styling™ principles", "Ethical, compassionate practice"].map(item => `<div class='flex items-start gap-3'><svg class='lucide lucide-check-circle' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='var(--brand-sage)' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' style='flex-shrink: 0; margin-top: 4px;'><path d='M22 11.08V12a10 10 0 1 1-5.93-9.14'/><polyline points='22 4 12 14.01 9 11.01'/></svg><p class='text-[var(--brand-charcoal)]'>${item}</p></div>`).join('')}</div>`}
              contentType="rich_text"
            />

            <p className="text-center text-[var(--brand-green)] font-serif text-xl mt-10 italic">
              <CmsText 
                contentKey="hypnosis.why.closing"
                page="LearnHypnosis"
                blockTitle="Why Closing"
                fallback="This is hypnosis for people who want to facilitate transformation, not memorize dialogues."
                contentType="rich_text"
              />
            </p>
          </motion.div>
        </div>
      </section>

      {/* Section 2 — What You'll Learn */}
      <section className="py-24 bg-[var(--brand-cream)]">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-12">
              <Brain size={40} className="text-[var(--brand-gold)] mx-auto mb-4" />
              <h2 className="font-serif text-3xl md:text-4xl text-[var(--brand-green)] mb-4">
                <CmsText 
                  contentKey="hypnosis.learn.title"
                  page="LearnHypnosis"
                  blockTitle="Learn Section Title"
                  fallback="What You'll Learn"
                  contentType="short_text"
                />
              </h2>
            </div>

            <LearnSectionGrid />
          </motion.div>
        </div>
      </section>

      {/* Section 3 — Who This Training Is For */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-12">
              <Users size={40} className="text-[var(--brand-gold)] mx-auto mb-4" />
              <h2 className="font-serif text-3xl md:text-4xl text-[var(--brand-green)] mb-6">
                <CmsText 
                  contentKey="hypnosis.who.title"
                  page="LearnHypnosis"
                  blockTitle="Who Section Title"
                  fallback="Who This Training Is For"
                  contentType="short_text"
                />
              </h2>
              <p className="text-[var(--brand-charcoal)]/80 text-lg">
                <CmsText 
                  contentKey="hypnosis.who.intro"
                  page="LearnHypnosis"
                  blockTitle="Who Section Intro"
                  fallback="This training is perfect for:"
                  contentType="rich_text"
                />
              </p>
            </div>

            <CmsText 
              contentKey="hypnosis.who.list"
              page="LearnHypnosis"
              blockTitle="Who Audience List"
              fallback={`<div class='grid md:grid-cols-3 gap-6 mb-10'>${["New hypnotists", "Coaches & wellness practitioners", "Therapists", "Educators", "Yoga/meditation teachers", "Public speakers", "Corporate trainers", "Anyone who wants to guide others into clarity and internal alignment"].map(audience => `<div class='bg-[var(--brand-cream)] p-6 text-center border-l-4 border-[var(--brand-gold)]'><p class='text-[var(--brand-green)] font-medium'>${audience}</p></div>`).join('')}</div>`}
              contentType="rich_text"
            />

            <p className="text-center text-xl text-[var(--brand-green)] font-serif italic">
              <CmsText 
                contentKey="hypnosis.who.note"
                page="LearnHypnosis"
                blockTitle="Who Note"
                fallback="Absolutely no prior experience is required."
                contentType="rich_text"
              />
            </p>
          </motion.div>
        </div>
      </section>

      {/* Section 4 — What's Included */}
      <section className="py-24 bg-[var(--brand-cream)]">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-12">
              <BookOpen size={40} className="text-[var(--brand-gold)] mx-auto mb-4" />
              <h2 className="font-serif text-3xl md:text-4xl text-[var(--brand-green)] mb-6">
                <CmsText 
                  contentKey="hypnosis.included.title"
                  page="LearnHypnosis"
                  blockTitle="Included Section Title"
                  fallback="What's Included in the Training"
                  contentType="short_text"
                />
              </h2>
            </div>

            <IncludedSectionGrid />
          </motion.div>
        </div>
      </section>



      {/* Section 6 — The Mind Stylist Hypnosis Method™ */}
      <section className="py-24 bg-gradient-to-br from-[var(--brand-mauve)] to-[var(--brand-green)] text-white">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <Sparkles size={40} className="text-[var(--brand-gold)] mx-auto mb-6" />
            <h2 className="font-serif text-3xl md:text-4xl text-white mb-8">
              <CmsText 
                contentKey="hypnosis.method.title"
                page="LearnHypnosis"
                blockTitle="Method Section Title"
                fallback="The Mind Stylist Hypnosis Method™"
                contentType="short_text"
              />
            </h2>

            <p className="text-[var(--brand-cream)]/90 text-lg mb-8 max-w-3xl mx-auto">
              <CmsText 
                contentKey="hypnosis.method.intro"
                page="LearnHypnosis"
                blockTitle="Method Intro"
                fallback="Roberta's method blends:"
                contentType="rich_text"
              />
            </p>

            <CmsText 
              contentKey="hypnosis.method.blends"
              page="LearnHypnosis"
              blockTitle="Method Blends"
              fallback={`<div class='grid md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto'>${["Hypnosis", "Emotional repatterning", "Internal narrative reframing", "Mind Styling Studio™ tools", "Pocket Visualization™ techniques"].map(method => `<div class='bg-white/10 backdrop-blur-sm p-4'><p class='text-[var(--brand-cream)]'>${method}</p></div>`).join('')}</div>`}
              contentType="rich_text"
            />

            <p className="text-[var(--brand-cream)]/90 text-lg mb-6">
              <CmsText 
                contentKey="hypnosis.method.creates"
                page="LearnHypnosis"
                blockTitle="Method Creates Intro"
                fallback="This creates a practitioner who is:"
                contentType="rich_text"
              />
            </p>

            <CmsText 
              contentKey="hypnosis.method.traits"
              page="LearnHypnosis"
              blockTitle="Method Traits"
              fallback={`<div class='flex flex-wrap justify-center gap-4 mb-10'>${["steady", "intuitive", "ethical", "calming", "adaptable", "client-centered"].map(trait => `<span class='px-6 py-2 bg-[var(--brand-gold)] text-[var(--brand-green)] text-sm tracking-wide'>${trait}</span>`).join('')}</div>`}
              contentType="rich_text"
            />

            <div className="bg-white/10 backdrop-blur-sm p-8 max-w-3xl mx-auto">
              <p className="font-serif text-2xl text-[var(--brand-cream)] italic mb-4">
                <CmsText 
                  contentKey="hypnosis.method.quote1"
                  page="LearnHypnosis"
                  blockTitle="Method Quote 1"
                  fallback="This is not hypnosis as performance."
                  contentType="rich_text"
                />
              </p>
              <p className="font-serif text-2xl text-[var(--brand-gold)] italic">
                <CmsText 
                  contentKey="hypnosis.method.quote2"
                  page="LearnHypnosis"
                  blockTitle="Method Quote 2"
                  fallback="It's hypnosis as transformation."
                  contentType="rich_text"
                />
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Section 7 — Enrollment & Pricing */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="font-serif text-3xl md:text-4xl text-[var(--brand-green)] mb-8">
              <CmsText 
                contentKey="hypnosis.pricing.title"
                page="LearnHypnosis"
                blockTitle="Pricing Title"
                fallback="Enrollment & Pricing"
                contentType="short_text"
              />
            </h2>

            <div className="bg-[var(--brand-cream)] p-10 mb-10">
              <p className="text-[var(--brand-charcoal)]/80 text-lg mb-4">
                <CmsText 
                  contentKey="hypnosis.pricing.cert"
                  page="LearnHypnosis"
                  blockTitle="Certification Pricing"
                  fallback="Certification Track: <span class='font-medium text-[var(--brand-green)]'>TBD</span>"
                  contentType="rich_text"
                />
              </p>
              <p className="text-[var(--brand-charcoal)]/80 text-lg">
                <CmsText 
                  contentKey="hypnosis.pricing.audit"
                  page="LearnHypnosis"
                  blockTitle="Audit Pricing"
                  fallback="Audit Track: <span class='font-medium text-[var(--brand-green)]'>TBD</span>"
                  contentType="rich_text"
                />
              </p>
            </div>

            <Link
              to={createPageUrl("Contact")}
              className="inline-flex items-center gap-3 px-8 py-4 bg-[var(--brand-green)] text-[var(--brand-cream)] text-sm tracking-wide hover:bg-[var(--brand-charcoal)] transition-all duration-300"
            >
              Begin Your Training
              <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Section 8 — FAQ */}
      <section className="py-24 bg-[var(--brand-cream)]">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-12">
              <MessageCircle size={40} className="text-[var(--brand-gold)] mx-auto mb-4" />
              <h2 className="font-serif text-3xl md:text-4xl text-[var(--brand-green)] mb-6">
                <CmsText 
                  contentKey="hypnosis.faq.title"
                  page="LearnHypnosis"
                  blockTitle="FAQ Title"
                  fallback="Frequently Asked Questions"
                  contentType="short_text"
                />
              </h2>
            </div>

            <div className="space-y-8">
              {[
                {
                  q: "Do I need prior experience?",
                  a: "No. This course is designed for beginners and seasoned practitioners."
                },
                {
                  q: "Will I be able to practice professionally after this training?",
                  a: "Yes — the Certification Track includes the necessary foundations to begin working with clients."
                },
                {
                  q: "Is hypnosis safe?",
                  a: "Absolutely. Roberta teaches ethical, responsible hypnosis grounded in emotional intelligence."
                },
                {
                  q: "Do I get ongoing support?",
                  a: "Yes — depending on your track, support is offered through Q&A, Office Hours, and community elements."
                }
              ].map((faq, idx) => (
                <div key={idx} className="bg-white p-8 border-l-4 border-[var(--brand-gold)]">
                  <h3 className="font-serif text-xl text-[var(--brand-green)] mb-3">
                    <CmsText 
                      contentKey={`hypnosis.faq${idx + 1}.question`}
                      page="LearnHypnosis"
                      blockTitle={`FAQ ${idx + 1} Question`}
                      fallback={faq.q}
                      contentType="short_text"
                    />
                  </h3>
                  <p className="text-[var(--brand-charcoal)]/80 leading-relaxed">
                    <CmsText 
                      contentKey={`hypnosis.faq${idx + 1}.answer`}
                      page="LearnHypnosis"
                      blockTitle={`FAQ ${idx + 1} Answer`}
                      fallback={faq.a}
                      contentType="rich_text"
                    />
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Section 9 — Final CTA */}
      <section className="py-24 bg-[var(--brand-green)]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-[var(--brand-cream)] leading-tight mb-6">
              <CmsText 
                contentKey="hypnosis.cta.title"
                page="LearnHypnosis"
                blockTitle="CTA Title"
                fallback="Ready to Learn Hypnosis the Mind Stylist™ Way?"
                contentType="short_text"
              />
            </h2>
            <p className="text-[var(--brand-cream)]/80 text-lg mb-10 max-w-2xl mx-auto">
              <CmsText 
                contentKey="hypnosis.cta.description"
                page="LearnHypnosis"
                blockTitle="CTA Description"
                fallback="Become a guide for change in your life—and in the lives of others."
                contentType="rich_text"
              />
            </p>
            <Link
              to={createPageUrl("Contact")}
              className="inline-flex items-center gap-3 px-8 py-4 bg-[var(--brand-gold)] text-[var(--brand-green)] text-sm tracking-wide hover:bg-[var(--brand-cream)] transition-all duration-300"
            >
              Begin Your Training
              <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}