import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "../utils";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import SEO from "../components/SEO";
import CmsText from "../components/cms/CmsText";
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
    <div className="bg-[#F9F5EF]">
      <SEO
        title="Learn Hypnosis | The Mind Stylist™"
        description="Become a confident, ethical, emotionally intelligent hypnotist using Roberta's signature Mind Styling™ approach to subconscious change. Perfect for beginners and professionals."
        canonical="/learn-hypnosis"
      />

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-b from-[#1E3A32] to-[#2B2725]">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <span className="text-[#D8B46B] text-xs tracking-[0.3em] uppercase mb-4 block">
              <CmsText 
                contentKey="hypnosis.hero.subtitle"
                page="LearnHypnosis"
                blockTitle="Hero Subtitle"
                fallback="Hypnosis Training"
                contentType="short_text"
                as="span"
              />
            </span>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-[#F9F5EF] leading-tight mb-6">
              <CmsText 
                contentKey="hypnosis.hero.title"
                page="LearnHypnosis"
                blockTitle="Hero Title"
                fallback="Learn Hypnosis with The Mind Stylist™"
                contentType="short_text"
              />
            </h1>
            <p className="text-[#F9F5EF]/90 text-xl md:text-2xl leading-relaxed mb-8 max-w-3xl mx-auto">
              <CmsText 
                contentKey="hypnosis.hero.tagline"
                page="LearnHypnosis"
                blockTitle="Hero Tagline"
                fallback="Train your mind to guide others—and yourself—into calm, clarity, and emotional transformation."
                contentType="rich_text"
              />
            </p>
            <p className="text-[#F9F5EF]/80 text-lg leading-relaxed mb-6 max-w-3xl mx-auto">
              <CmsText 
                contentKey="hypnosis.hero.description"
                page="LearnHypnosis"
                blockTitle="Hero Description"
                fallback="Become a confident, ethical, emotionally intelligent hypnotist using Roberta's signature Mind Styling™ approach to subconscious change."
                contentType="rich_text"
              />
            </p>
            <p className="text-[#D8B46B] text-base mb-10">
              <CmsText 
                contentKey="hypnosis.hero.perfect"
                page="LearnHypnosis"
                blockTitle="Hero Perfect For"
                fallback="Perfect for beginners, coaches, therapists, and anyone ready to help others reshape their inner world."
                contentType="rich_text"
              />
            </p>
            <Link
              to="/app/login"
              className="inline-flex items-center gap-3 px-8 py-4 bg-[#D8B46B] text-[#1E3A32] text-sm tracking-wide hover:bg-[#F9F5EF] transition-all duration-300"
            >
              Begin Your Training
              <ArrowRight size={18} />
            </Link>
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
              <Heart size={40} className="text-[#D8B46B] mx-auto mb-4" />
              <h2 className="font-serif text-3xl md:text-4xl text-[#1E3A32] mb-6">
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
              <div className="bg-[#F9F5EF] p-8">
                <p className="text-[#2B2725]/60 text-lg mb-2">
                  <CmsText 
                    contentKey="hypnosis.why.compare1a"
                    page="LearnHypnosis"
                    blockTitle="Why Compare 1A"
                    fallback="Most hypnosis trainings teach scripts."
                    contentType="rich_text"
                  />
                </p>
                <p className="font-serif text-2xl text-[#1E3A32]">
                  <CmsText 
                    contentKey="hypnosis.why.compare1b"
                    page="LearnHypnosis"
                    blockTitle="Why Compare 1B"
                    fallback="Roberta teaches human understanding."
                    contentType="rich_text"
                  />
                </p>
              </div>
              <div className="bg-[#F9F5EF] p-8">
                <p className="text-[#2B2725]/60 text-lg mb-2">
                  <CmsText 
                    contentKey="hypnosis.why.compare2a"
                    page="LearnHypnosis"
                    blockTitle="Why Compare 2A"
                    fallback="Most focus on what to say."
                    contentType="rich_text"
                  />
                </p>
                <p className="font-serif text-2xl text-[#1E3A32]">
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
              <p className="text-[#2B2725]/80 text-lg leading-relaxed mb-6">
                <CmsText 
                  contentKey="hypnosis.why.intro1"
                  page="LearnHypnosis"
                  blockTitle="Why Intro 1"
                  fallback="This training goes beyond technique. It introduces you to the emotional, rhythmic, and relational art of helping someone change their mind—internally, safely, and effectively."
                  contentType="rich_text"
                />
              </p>
              <p className="text-[#2B2725]/80 text-lg leading-relaxed mb-6">
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
              fallback={`<div class='grid md:grid-cols-3 gap-6 max-w-4xl mx-auto'>${["Neuroscience", "Emotional repatterning", "Subconscious communication", "Therapeutic language", "Mind Styling™ principles", "Ethical, compassionate practice"].map(item => `<div class='flex items-start gap-3'><svg class='lucide lucide-check-circle' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='#A6B7A3' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' style='flex-shrink: 0; margin-top: 4px;'><path d='M22 11.08V12a10 10 0 1 1-5.93-9.14'/><polyline points='22 4 12 14.01 9 11.01'/></svg><p class='text-[#2B2725]'>${item}</p></div>`).join('')}</div>`}
              contentType="rich_text"
            />

            <p className="text-center text-[#1E3A32] font-serif text-xl mt-10 italic">
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
      <section className="py-24 bg-[#F9F5EF]">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-12">
              <Brain size={40} className="text-[#D8B46B] mx-auto mb-4" />
              <h2 className="font-serif text-3xl md:text-4xl text-[#1E3A32] mb-4">
                <CmsText 
                  contentKey="hypnosis.learn.title"
                  page="LearnHypnosis"
                  blockTitle="Learn Section Title"
                  fallback="What You'll Learn"
                  contentType="short_text"
                />
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h3 className="font-serif text-2xl text-[#1E3A32] mb-6">
                  <CmsText 
                    contentKey="hypnosis.learn.core.title"
                    page="LearnHypnosis"
                    blockTitle="Core Skills Title"
                    fallback="Core Skills:"
                    contentType="short_text"
                  />
                </h3>
                <CmsText 
                  contentKey="hypnosis.learn.core.list"
                  page="LearnHypnosis"
                  blockTitle="Core Skills List"
                  fallback={`<div class='space-y-4'>${["Understanding the subconscious mind", "Safe, ethical trance induction", "How to guide clients into focused inner states", "Emotional state design (Mind Styling™ foundations)", "How to restructure internal narratives", "How to work with anxiety, performance, confidence, and habits", "How to design custom sessions without scripts", "How to incorporate hypnosis into coaching or therapeutic work"].map(skill => `<div class='flex items-start gap-3'><svg class='lucide lucide-check-circle' width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='#6E4F7D' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' style='flex-shrink: 0; margin-top: 4px;'><path d='M22 11.08V12a10 10 0 1 1-5.93-9.14'/><polyline points='22 4 12 14.01 9 11.01'/></svg><p class='text-[#2B2725]/80'>${skill}</p></div>`).join('')}</div>`}
                  contentType="rich_text"
                />
              </div>

              <div>
                <h3 className="font-serif text-2xl text-[#1E3A32] mb-6">
                  <CmsText 
                    contentKey="hypnosis.learn.practical.title"
                    page="LearnHypnosis"
                    blockTitle="Practical Application Title"
                    fallback="Practical Application:"
                    contentType="short_text"
                  />
                </h3>
                <CmsText 
                  contentKey="hypnosis.learn.practical.list"
                  page="LearnHypnosis"
                  blockTitle="Practical Application List"
                  fallback={`<div class='space-y-4'>${["Live demos & practice sessions", "Client session frameworks", "How to create your own recorded hypnosis sessions", "Troubleshooting difficult patterns", "Creating emotional \"wardrobes\" that genuinely fit the client"].map(practice => `<div class='flex items-start gap-3'><svg class='lucide lucide-target' width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='#D8B46B' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' style='flex-shrink: 0; margin-top: 4px;'><circle cx='12' cy='12' r='10'/><circle cx='12' cy='12' r='6'/><circle cx='12' cy='12' r='2'/></svg><p class='text-[#2B2725]/80'>${practice}</p></div>`).join('')}</div>`}
                  contentType="rich_text"
                />
              </div>
            </div>
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
              <Users size={40} className="text-[#D8B46B] mx-auto mb-4" />
              <h2 className="font-serif text-3xl md:text-4xl text-[#1E3A32] mb-6">
                <CmsText 
                  contentKey="hypnosis.who.title"
                  page="LearnHypnosis"
                  blockTitle="Who Section Title"
                  fallback="Who This Training Is For"
                  contentType="short_text"
                />
              </h2>
              <p className="text-[#2B2725]/80 text-lg">
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
              fallback={`<div class='grid md:grid-cols-3 gap-6 mb-10'>${["New hypnotists", "Coaches & wellness practitioners", "Therapists", "Educators", "Yoga/meditation teachers", "Public speakers", "Corporate trainers", "Anyone who wants to guide others into clarity and internal alignment"].map(audience => `<div class='bg-[#F9F5EF] p-6 text-center border-l-4 border-[#D8B46B]'><p class='text-[#1E3A32] font-medium'>${audience}</p></div>`).join('')}</div>`}
              contentType="rich_text"
            />

            <p className="text-center text-xl text-[#1E3A32] font-serif italic">
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
      <section className="py-24 bg-[#F9F5EF]">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-12">
              <BookOpen size={40} className="text-[#D8B46B] mx-auto mb-4" />
              <h2 className="font-serif text-3xl md:text-4xl text-[#1E3A32] mb-6">
                <CmsText 
                  contentKey="hypnosis.included.title"
                  page="LearnHypnosis"
                  blockTitle="Included Section Title"
                  fallback="What's Included in the Training"
                  contentType="short_text"
                />
              </h2>
            </div>

            <CmsText 
              contentKey="hypnosis.included.list"
              page="LearnHypnosis"
              blockTitle="Included List"
              fallback={`<div class='grid md:grid-cols-2 gap-6 max-w-4xl mx-auto'>${["Full video-based course taught by Roberta", "Hypnosis demonstrations", "Practice exercises", "Client mapping templates", "Hypnosis scripts & customizable frameworks", "Office Hours or Q&A opportunities (depending on track)", "Access to The Mind Styling Studio™ for live practice", "Certificate of Completion (Certification Track only)"].map(item => `<div class='flex items-start gap-3 bg-white p-4'><svg class='lucide lucide-sparkles' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='#6E4F7D' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' style='flex-shrink: 0; margin-top: 4px;'><path d='m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z'/><path d='M5 3v4'/><path d='M19 17v4'/><path d='M3 5h4'/><path d='M17 19h4'/></svg><p class='text-[#2B2725]/80'>${item}</p></div>`).join('')}</div>`}
              contentType="rich_text"
            />
          </motion.div>
        </div>
      </section>

      {/* Section 5 — Training Tracks */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-12">
              <Award size={40} className="text-[#D8B46B] mx-auto mb-4" />
              <h2 className="font-serif text-3xl md:text-4xl text-[#1E3A32] mb-6">
                <CmsText 
                  contentKey="hypnosis.tracks.title"
                  page="LearnHypnosis"
                  blockTitle="Tracks Section Title"
                  fallback="Training Tracks"
                  contentType="short_text"
                />
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Certification Track */}
              <div className="bg-[#1E3A32] p-8 text-[#F9F5EF] relative">
                <div className="absolute top-6 right-6 bg-[#D8B46B] text-[#1E3A32] px-3 py-1 text-xs uppercase tracking-wide">
                  Recommended
                </div>
                <h3 className="font-serif text-2xl mb-4">
                  <CmsText 
                    contentKey="hypnosis.tracks.cert.title"
                    page="LearnHypnosis"
                    blockTitle="Certification Track Title"
                    fallback="Certification Track"
                    contentType="short_text"
                  />
                </h3>
                <p className="text-[#F9F5EF]/80 mb-6">
                  <CmsText 
                    contentKey="hypnosis.tracks.cert.description"
                    page="LearnHypnosis"
                    blockTitle="Certification Track Description"
                    fallback="For those who want to practice hypnosis professionally."
                    contentType="rich_text"
                  />
                </p>

                <div className="space-y-3 mb-8">
                  <p className="text-sm font-medium text-[#D8B46B] mb-3">Includes:</p>
                  <CmsText 
                    contentKey="hypnosis.tracks.cert.features"
                    page="LearnHypnosis"
                    blockTitle="Certification Features"
                    fallback={`${["Full course access", "Exams & supervised practice", "Practitioner certificate", "Listing in Mind Stylist network (optional)"].map(feature => `<div class='flex items-start gap-3'><svg class='lucide lucide-check-circle' width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='#D8B46B' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' style='flex-shrink: 0; margin-top: 4px;'><path d='M22 11.08V12a10 10 0 1 1-5.93-9.14'/><polyline points='22 4 12 14.01 9 11.01'/></svg><p class='text-[#F9F5EF]/90'>${feature}</p></div>`).join('')}`}
                    contentType="rich_text"
                  />
                </div>

                <Link
                  to="/app/login"
                  className="block w-full text-center px-6 py-3 bg-[#D8B46B] text-[#1E3A32] hover:bg-[#F9F5EF] transition-colors"
                >
                  Begin Certification →
                </Link>
              </div>

              {/* Audit Track */}
              <div className="bg-[#F9F5EF] p-8 border border-[#E4D9C4]">
                <h3 className="font-serif text-2xl text-[#1E3A32] mb-4">
                  <CmsText 
                    contentKey="hypnosis.tracks.audit.title"
                    page="LearnHypnosis"
                    blockTitle="Audit Track Title"
                    fallback="Audit Track"
                    contentType="short_text"
                  />
                </h3>
                <p className="text-[#2B2725]/80 mb-6">
                  <CmsText 
                    contentKey="hypnosis.tracks.audit.description"
                    page="LearnHypnosis"
                    blockTitle="Audit Track Description"
                    fallback="For personal use or skill development without certification."
                    contentType="rich_text"
                  />
                </p>

                <div className="space-y-3 mb-8">
                  <p className="text-sm font-medium text-[#1E3A32] mb-3">Includes:</p>
                  <CmsText 
                    contentKey="hypnosis.tracks.audit.features"
                    page="LearnHypnosis"
                    blockTitle="Audit Features"
                    fallback={`${["Full content access", "No exam", "No practitioner listing"].map(feature => `<div class='flex items-start gap-3'><svg class='lucide lucide-check-circle' width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='#A6B7A3' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' style='flex-shrink: 0; margin-top: 4px;'><path d='M22 11.08V12a10 10 0 1 1-5.93-9.14'/><polyline points='22 4 12 14.01 9 11.01'/></svg><p class='text-[#2B2725]/80'>${feature}</p></div>`).join('')}`}
                    contentType="rich_text"
                  />
                </div>

                <Link
                  to="/app/login"
                  className="block w-full text-center px-6 py-3 border border-[#1E3A32] text-[#1E3A32] hover:bg-[#1E3A32] hover:text-[#F9F5EF] transition-colors"
                >
                  Start Learning →
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Section 6 — The Mind Stylist Hypnosis Method™ */}
      <section className="py-24 bg-gradient-to-br from-[#6E4F7D] to-[#1E3A32]">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <Sparkles size={40} className="text-[#D8B46B] mx-auto mb-6" />
            <h2 className="font-serif text-3xl md:text-4xl text-[#F9F5EF] mb-8">
              <CmsText 
                contentKey="hypnosis.method.title"
                page="LearnHypnosis"
                blockTitle="Method Section Title"
                fallback="The Mind Stylist Hypnosis Method™"
                contentType="short_text"
              />
            </h2>

            <p className="text-[#F9F5EF]/90 text-lg mb-8 max-w-3xl mx-auto">
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
              fallback={`<div class='grid md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto'>${["Hypnosis", "Emotional repatterning", "Internal narrative reframing", "Mind Styling Studio™ tools", "Pocket Visualization™ techniques"].map(method => `<div class='bg-white/10 backdrop-blur-sm p-4'><p class='text-[#F9F5EF]'>${method}</p></div>`).join('')}</div>`}
              contentType="rich_text"
            />

            <p className="text-[#F9F5EF]/90 text-lg mb-6">
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
              fallback={`<div class='flex flex-wrap justify-center gap-4 mb-10'>${["steady", "intuitive", "ethical", "calming", "adaptable", "client-centered"].map(trait => `<span class='px-6 py-2 bg-[#D8B46B] text-[#1E3A32] text-sm tracking-wide'>${trait}</span>`).join('')}</div>`}
              contentType="rich_text"
            />

            <div className="bg-white/10 backdrop-blur-sm p-8 max-w-3xl mx-auto">
              <p className="font-serif text-2xl text-[#F9F5EF] italic mb-4">
                <CmsText 
                  contentKey="hypnosis.method.quote1"
                  page="LearnHypnosis"
                  blockTitle="Method Quote 1"
                  fallback="This is not hypnosis as performance."
                  contentType="rich_text"
                />
              </p>
              <p className="font-serif text-2xl text-[#D8B46B] italic">
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
            <h2 className="font-serif text-3xl md:text-4xl text-[#1E3A32] mb-8">
              <CmsText 
                contentKey="hypnosis.pricing.title"
                page="LearnHypnosis"
                blockTitle="Pricing Title"
                fallback="Enrollment & Pricing"
                contentType="short_text"
              />
            </h2>

            <div className="bg-[#F9F5EF] p-10 mb-10">
              <p className="text-[#2B2725]/80 text-lg mb-4">
                <CmsText 
                  contentKey="hypnosis.pricing.cert"
                  page="LearnHypnosis"
                  blockTitle="Certification Pricing"
                  fallback="Certification Track: <span class='font-medium text-[#1E3A32]'>TBD</span>"
                  contentType="rich_text"
                />
              </p>
              <p className="text-[#2B2725]/80 text-lg">
                <CmsText 
                  contentKey="hypnosis.pricing.audit"
                  page="LearnHypnosis"
                  blockTitle="Audit Pricing"
                  fallback="Audit Track: <span class='font-medium text-[#1E3A32]'>TBD</span>"
                  contentType="rich_text"
                />
              </p>
            </div>

            <Link
              to={createPageUrl("Contact")}
              className="inline-flex items-center gap-3 px-8 py-4 bg-[#1E3A32] text-[#F9F5EF] text-sm tracking-wide hover:bg-[#2B2725] transition-all duration-300"
            >
              Join the Waitlist
              <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Section 8 — FAQ */}
      <section className="py-24 bg-[#F9F5EF]">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-12">
              <MessageCircle size={40} className="text-[#D8B46B] mx-auto mb-4" />
              <h2 className="font-serif text-3xl md:text-4xl text-[#1E3A32] mb-6">
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
                <div key={idx} className="bg-white p-8 border-l-4 border-[#D8B46B]">
                  <h3 className="font-serif text-xl text-[#1E3A32] mb-3">
                    <CmsText 
                      contentKey={`hypnosis.faq${idx + 1}.question`}
                      page="LearnHypnosis"
                      blockTitle={`FAQ ${idx + 1} Question`}
                      fallback={faq.q}
                      contentType="short_text"
                    />
                  </h3>
                  <p className="text-[#2B2725]/80 leading-relaxed">
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
      <section className="py-24 bg-[#1E3A32]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-[#F9F5EF] leading-tight mb-6">
              <CmsText 
                contentKey="hypnosis.cta.title"
                page="LearnHypnosis"
                blockTitle="CTA Title"
                fallback="Ready to Learn Hypnosis the Mind Stylist™ Way?"
                contentType="short_text"
              />
            </h2>
            <p className="text-[#F9F5EF]/80 text-lg mb-10 max-w-2xl mx-auto">
              <CmsText 
                contentKey="hypnosis.cta.description"
                page="LearnHypnosis"
                blockTitle="CTA Description"
                fallback="Become a guide for change in your life—and in the lives of others."
                contentType="rich_text"
              />
            </p>
            <Link
              to="/app/login"
              className="inline-flex items-center gap-3 px-8 py-4 bg-[#D8B46B] text-[#1E3A32] text-sm tracking-wide hover:bg-[#F9F5EF] transition-all duration-300"
            >
              Start Your Training
              <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}