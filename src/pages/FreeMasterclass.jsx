import React from "react";
import SEO from "../components/SEO";
import { Link } from "react-router-dom";
import { createPageUrl } from "../utils";
import { motion } from "framer-motion";
import { ArrowRight, Play, CheckCircle, Lightbulb, Shield, Brain, Users, Star } from "lucide-react";
import CmsText from "../components/cms/CmsText";

export default function FreeMasterclass() {
  const learnings = [
    "What imposter syndrome really is — and what it isn't",
    "The emotional and cognitive patterns behind \"I'm not enough\"",
    "Why high performers and leaders are especially vulnerable to it",
    "How your mind creates stories about worth, competence, and belonging",
    "Practical ways to interrupt the imposter loop when it shows up",
    "How to begin trusting your own abilities — without needing constant external validation",
  ];

  const forYouIf = [
    "You're successful on paper but still feel like you're winging it",
    "You downplay your achievements or feel uncomfortable owning them",
    "You worry others will \"find out\" you're not as capable as they think",
    "You compare yourself constantly and come up short",
    "You feel pressure to perform perfectly to feel safe or worthy",
    "You lead others, but privately question your legitimacy",
  ];

  const approaches = [
    {
      title: "The stories",
      description: "Your mind is running about your place in the world",
    },
    {
      title: "The emotional patterns",
      description: "That got wired in over time",
    },
    {
      title: "The expectations",
      description: "You've internalized about success and worth",
    },
    {
      title: "The pressure",
      description: "Of always needing to prove yourself",
    },
  ];

  const steps = [
    {
      number: "1",
      title: "Create your free account",
      description: "Sign up once to access your private Mind Stylist Portal.",
    },
    {
      number: "2",
      title: "Access the masterclass",
      description: "You'll find the video inside your portal under \"Imposter Syndrome & Other Myths to Ditch.\"",
    },
    {
      number: "3",
      title: "Watch on your own time",
      description: "Pause, reflect, take notes. Rewatch any time you like.",
    },
    {
      number: "4",
      title: "Take your next step",
      description: "When you're ready, you can explore the Mind Styling Certification™, Private Mind Styling, or The Inner Rehearsal Sessions™ from within your dashboard.",
    },
  ];

  const offerings = [
    {
      icon: Brain,
      title: "The Mind Styling Certification™",
      description: "For identity-level change and emotional intelligence.",
      link: "Evolution",
    },
    {
      icon: Users,
      title: "Private Mind Styling (1:1)",
      description: "For personalized support in shifting long-held patterns.",
      link: "PrivateSessions",
    },
    {
      icon: Star,
      title: "The Inner Rehearsal Sessions™",
      description: "For ongoing internal resets and future-self rehearsal.",
      link: "InnerRehearsal",
    },
  ];

  return (
    <div className="bg-[#F9F5EF]">
      <SEO
        title="Free Masterclass | Imposter Syndrome & Other Myths to Ditch"
        description="An on-demand masterclass with Your Mind Stylist on imposter syndrome and other myths to let go of so you can finally trust your own abilities."
        canonical="/free-masterclass"
      />
      {/* Hero Section */}
      <section className="pt-32 pb-20">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-[#D8B46B] text-xs tracking-[0.3em] uppercase mb-4 block text-center">
              <CmsText 
                contentKey="freemasterclass.hero.label" 
                page="FreeMasterclass"
                blockTitle="Hero Label"
                fallback="Free On-Demand Masterclass" 
                contentType="short_text"
              />
            </span>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-[#1E3A32] leading-tight mb-6 text-center">
              <CmsText 
                contentKey="freemasterclass.hero.title" 
                page="FreeMasterclass"
                blockTitle="Hero Title"
                fallback="Imposter Syndrome<br /><span class='italic text-[#D8B46B]'>& Other Myths to Ditch</span>" 
                contentType="rich_text"
              />
            </h1>
            <p className="text-[#2B2725] font-serif text-2xl md:text-3xl italic mb-8 text-center">
              <CmsText 
                contentKey="freemasterclass.hero.tagline" 
                page="FreeMasterclass"
                blockTitle="Hero Tagline"
                fallback="A practical, psychologically grounded class to help you stop feeling like you're faking it — and start trusting your abilities." 
                contentType="short_text"
              />
            </p>

            <p className="text-[#2B2725]/80 text-lg leading-relaxed mb-10 max-w-3xl mx-auto text-center">
              <CmsText 
                contentKey="freemasterclass.hero.paragraph1" 
                page="FreeMasterclass"
                blockTitle="Hero Paragraph 1"
                fallback="If you've ever felt like you don't belong in the room, that you're not &quot;qualified enough,&quot; or that people will eventually find out you're not as capable as they think — this class is for you." 
                contentType="rich_text"
              />
            </p>

            <p className="text-[#2B2725]/80 text-lg leading-relaxed mb-10 max-w-3xl mx-auto text-center">
              <CmsText 
                contentKey="freemasterclass.hero.paragraph2" 
                page="FreeMasterclass"
                blockTitle="Hero Paragraph 2"
                fallback="In this on-demand masterclass, you'll learn what's really happening beneath imposter syndrome and how to shift the way you see yourself, your work, and your abilities." 
                contentType="rich_text"
              />
            </p>

            {/* Video Preview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="aspect-video bg-[#2B2725] mb-10 relative overflow-hidden rounded-lg"
            >
              <CmsText
                contentKey="freemasterclass.hero.video_embed"
                page="FreeMasterclass"
                blockTitle="Masterclass Video Embed - Paste your Vimeo embed code here"
                fallback={`<iframe src="https://player.vimeo.com/video/1153707003?fl=ml&fe=ec&badge=0&autopause=0&player_id=0&app_id=58479" allow="autoplay; fullscreen; picture-in-picture; clipboard-write" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" title="Imposter Syndrome Masterclass"></iframe>`}
                contentType="rich_text"
                className="w-full h-full [&_iframe]:w-full [&_iframe]:h-full [&_iframe]:absolute [&_iframe]:inset-0"
              />
            </motion.div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/app/signup?intent=masterclass"
                className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#1E3A32] text-[#F9F5EF] text-sm tracking-wide hover:bg-[#2B2725] transition-all duration-300"
              >
                Watch the Free Webinar
                <ArrowRight
                  size={16}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>
              <Link
                to={createPageUrl("Contact")}
                className="group inline-flex items-center justify-center gap-3 px-8 py-4 border border-[#D8B46B] text-[#1E3A32] text-sm tracking-wide hover:bg-[#D8B46B]/10 transition-all duration-300"
              >
                Contact Roberta
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* What You'll Learn */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-[#1E3A32] mb-8">
              What You'll Learn in This Class
            </h2>

            <p className="text-[#2B2725]/80 text-lg leading-relaxed mb-8">
              In this masterclass, you'll explore:
            </p>

            <div className="space-y-4 mb-10">
              {learnings.map((learning, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-4 bg-[#F9F5EF] p-6"
                >
                  <CheckCircle size={24} className="text-[#D8B46B] flex-shrink-0 mt-0.5" />
                  <span className="text-[#2B2725]/80 text-lg">{learning}</span>
                </motion.div>
              ))}
            </div>

            <div className="border-l-4 border-[#D8B46B] pl-6 mb-8">
              <p className="font-serif text-xl text-[#1E3A32] mb-2">
                This class isn't about "fake it till you make it."
              </p>
              <p className="text-[#2B2725]/80 text-lg">
                It's about understanding your mind so you can stop fighting yourself.
              </p>
            </div>

            <div className="text-center">
              <Link
                to="/app/signup?intent=masterclass"
                className="group inline-flex items-center gap-3 px-8 py-4 bg-[#1E3A32] text-[#F9F5EF] text-sm tracking-wide hover:bg-[#2B2725] transition-all duration-300"
              >
                Access the Free Masterclass
                <ArrowRight
                  size={16}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Who This Is For */}
      <section className="py-24 bg-[#F9F5EF]">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-[#1E3A32] mb-8">
              This Class Is for You If…
            </h2>

            <div className="space-y-4">
              {forYouIf.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <div className="w-2 h-2 rounded-full bg-[#6E4F7D] mt-2.5 flex-shrink-0" />
                  <span className="text-[#2B2725]/80 text-lg">{item}</span>
                </motion.div>
              ))}
            </div>

            <p className="mt-10 font-serif text-xl text-[#1E3A32] italic">
              If you're tired of the internal battle between what you've achieved and what you believe
              about yourself, this is your starting point.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Why This Approach Is Different */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-[#1E3A32] mb-8">
              A Different Way to Look at Imposter Syndrome
            </h2>

            <p className="text-[#2B2725]/80 text-lg leading-relaxed mb-6">
              Most advice about imposter syndrome focuses on:
            </p>

            <div className="bg-[#F9F5EF] p-8 mb-10">
              <div className="space-y-3">
                <p className="text-[#2B2725]/70">• More affirmations</p>
                <p className="text-[#2B2725]/70">• More confidence hacks</p>
                <p className="text-[#2B2725]/70">• More "just believe in yourself"</p>
              </div>
            </div>

            <p className="font-serif text-2xl text-[#1E3A32] mb-8">
              Your Mind Stylist approach is different.
            </p>

            <p className="text-[#2B2725]/80 text-lg leading-relaxed mb-8">
              Instead of forcing confidence, we explore:
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-10">
              {approaches.map((approach, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="border-l-2 border-[#D8B46B] pl-6"
                >
                  <p className="font-medium text-[#1E3A32] mb-2">{approach.title}</p>
                  <p className="text-[#2B2725]/70">{approach.description}</p>
                </motion.div>
              ))}
            </div>

            <div className="bg-[#6E4F7D] p-8 text-center">
              <p className="text-[#F9F5EF] text-lg mb-4">
                From there, we work with awareness, emotional intelligence, and gentle pattern shifts.
              </p>
              <p className="font-serif text-xl text-[#F9F5EF] italic">
                This isn't about pretending — it's about understanding.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-[#F9F5EF]">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-[#1E3A32] mb-4">
              How to Watch the Masterclass
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-8 text-center"
              >
                <div className="w-16 h-16 rounded-full bg-[#D8B46B]/20 flex items-center justify-center mx-auto mb-6">
                  <span className="font-serif text-3xl text-[#1E3A32]">{step.number}</span>
                </div>
                <h3 className="font-serif text-lg text-[#1E3A32] mb-3 flex items-start justify-center gap-2">
                  <span className="text-[#D8B46B]">✦</span>
                  {step.title}
                </h3>
                <p className="text-[#2B2725]/70 text-sm leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <Link
              to="/app/signup?intent=masterclass"
              className="group inline-flex items-center gap-3 px-8 py-4 bg-[#1E3A32] text-[#F9F5EF] text-sm tracking-wide hover:bg-[#2B2725] transition-all duration-300"
            >
              Watch the Free Masterclass
              <ArrowRight
                size={16}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
          </div>
        </div>
      </section>

      {/* Connected Offerings */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-[#1E3A32] mb-4">
              Want to Go Deeper After the Masterclass?
            </h2>
            <p className="text-[#2B2725]/70 text-lg">
              If this class resonates, there are several ways to continue your work:
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {offerings.map((offering, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-[#F9F5EF] p-8 hover:shadow-lg transition-shadow"
              >
                <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center mb-6">
                  <offering.icon size={24} className="text-[#1E3A32]" />
                </div>
                <h3 className="font-serif text-xl text-[#1E3A32] mb-3 flex items-start gap-2">
                  <span className="text-[#D8B46B]">✦</span>
                  {offering.title}
                </h3>
                <p className="text-[#2B2725]/70 leading-relaxed mb-6">{offering.description}</p>
                <Link
                  to={createPageUrl(offering.link)}
                  className="group inline-flex items-center gap-2 text-[#1E3A32] font-medium hover:gap-3 transition-all"
                >
                  Learn More
                  <ArrowRight
                    size={16}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-[#1E3A32]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-[#F9F5EF] leading-tight mb-6">
              Ready to Stop Feeling
              <br />
              <span className="italic text-[#D8B46B]">Like You're Faking It?</span>
            </h2>

            <p className="text-[#F9F5EF]/80 text-lg leading-relaxed mb-10 max-w-2xl mx-auto">
              You've already done the work. This is about finally allowing yourself to own it.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/app/signup?intent=masterclass"
                className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#D8B46B] text-[#1E3A32] text-sm tracking-wide hover:bg-[#F9F5EF] transition-all duration-300"
              >
                Watch the Free Webinar
                <ArrowRight
                  size={16}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>
              <Link
                to={createPageUrl("Contact")}
                className="group inline-flex items-center justify-center gap-3 px-8 py-4 border border-[#D8B46B] text-[#F9F5EF] text-sm tracking-wide hover:bg-[#D8B46B]/10 transition-all duration-300"
              >
                Contact Roberta
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}