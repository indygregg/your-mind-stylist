import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "../utils";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import SEO from "../components/SEO";
import { Sparkles, Brain, Target, TrendingUp, CheckCircle } from "lucide-react";
import CmsText from "../components/cms/CmsText";

export default function LENS() {
  return (
    <div className="bg-[#F9F5EF]">
      <SEO
        title="LENS™ | Your Mind Stylist"
        description="Learn the core principles of Mind Styling and emotional awareness with LENS™ - a transformative program by Your Mind Stylist."
        canonical="/LENS"
      />

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-[#6E4F7D] to-[#1E3A32] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23FFFFFF' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>
        
        <div className="max-w-5xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <span className="inline-block px-4 py-2 bg-white/20 text-white text-xs tracking-[0.3em] uppercase mb-6 backdrop-blur-sm">
              <CmsText 
                contentKey="lens.hero.label" 
                page="LENS"
                blockTitle="Hero Label"
                fallback="Mind Styling Program" 
                contentType="short_text"
              />
            </span>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl leading-tight mb-6">
              <CmsText 
                contentKey="lens.hero.title" 
                page="LENS"
                blockTitle="Hero Title"
                fallback="LENS™" 
                contentType="short_text"
              />
            </h1>
            <p className="text-white/90 text-xl md:text-2xl leading-relaxed max-w-3xl mx-auto mb-8">
              <CmsText 
                contentKey="lens.hero.description" 
                page="LENS"
                blockTitle="Hero Description"
                fallback="Learn the core principles of Mind Styling and emotional awareness" 
                contentType="rich_text"
              />
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to={createPageUrl("Bookings")}>
                <Button className="bg-[#D8B46B] text-[#1E3A32] hover:bg-white px-8 py-6 text-lg">
                  Book Your Consultation
                </Button>
              </Link>
              <Link to={createPageUrl("Programs")}>
                <Button variant="outline" className="border-white text-white hover:bg-white/10 px-8 py-6 text-lg">
                  View All Programs
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <Sparkles size={40} className="text-[#D8B46B] mx-auto mb-6" />
            <div className="text-[#2B2725]/80 text-lg leading-relaxed max-w-3xl mx-auto">
              <CmsText 
                contentKey="lens.intro.content" 
                page="LENS"
                blockTitle="Intro Content"
                fallback="<p class='mb-6'><strong class='text-[#1E3A32]'>LENS™</strong> is your foundation for understanding how your mind works and how to reshape your thinking patterns.</p><p class='mb-6'>Through this transformative program, you'll learn the core principles of Mind Styling — the techniques and frameworks that help you identify outdated beliefs, release emotional patterns, and create lasting change from the inside out.</p><p class='text-[#6E4F7D] font-serif text-xl italic mt-8'>This isn't just learning. It's transformation.</p>" 
                contentType="rich_text"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* What You'll Learn Section */}
      <section className="py-20 bg-[#F9F5EF]">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-serif text-3xl md:text-4xl text-[#1E3A32] text-center mb-16">
              <CmsText 
                contentKey="lens.learn.title" 
                page="LENS"
                blockTitle="What You'll Learn Title"
                fallback="What You'll Learn" 
                contentType="short_text"
              />
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              {[
                {
                  icon: Brain,
                  title: "Understand Your Mental Patterns",
                  description: "Learn how your thoughts shape your reality and how to identify the patterns that no longer serve you."
                },
                {
                  icon: Target,
                  title: "Emotional Intelligence Fundamentals",
                  description: "Master the core principles of emotional awareness, regulation, and conscious decision-making."
                },
                {
                  icon: TrendingUp,
                  title: "Inner Rehearsal Techniques",
                  description: "Practice mental rehearsal methods that help you embody your future self and create lasting change."
                },
                {
                  icon: Sparkles,
                  title: "Mind Styling Framework",
                  description: "Discover the proven framework for releasing old beliefs and designing new thought patterns."
                }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white p-8 border-l-4 border-[#6E4F7D]"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[#6E4F7D]/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <item.icon size={24} className="text-[#6E4F7D]" />
                    </div>
                    <div>
                      <h3 className="font-serif text-xl text-[#1E3A32] mb-3">
                        <CmsText 
                          contentKey={`lens.learn.${index}.title`}
                          page="LENS"
                          blockTitle={`Learn Item ${index + 1} Title`}
                          fallback={item.title}
                          contentType="short_text"
                        />
                      </h3>
                      <p className="text-[#2B2725]/70 leading-relaxed">
                        <CmsText 
                          contentKey={`lens.learn.${index}.description`}
                          page="LENS"
                          blockTitle={`Learn Item ${index + 1} Description`}
                          fallback={item.description}
                          contentType="rich_text"
                        />
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Who This Is For Section */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-serif text-3xl md:text-4xl text-[#1E3A32] text-center mb-12">
              <CmsText 
                contentKey="lens.whofor.title" 
                page="LENS"
                blockTitle="Who This Is For Title"
                fallback="Who This Is For" 
                contentType="short_text"
              />
            </h2>

            <div className="grid md:grid-cols-3 gap-6 mb-12">
              {[
                "Different Thinkers",
                "Innovative Problem Solvers",
                "Better Human Beings"
              ].map((item, idx) => (
                <div key={idx} className="bg-[#6E4F7D]/10 p-6 text-center">
                  <p className="font-serif text-xl text-[#6E4F7D] font-medium">
                    <CmsText 
                      contentKey={`lens.whofor.${idx}.text`}
                      page="LENS"
                      blockTitle={`Who For ${idx + 1}`}
                      fallback={item}
                      contentType="short_text"
                    />
                  </p>
                </div>
              ))}
            </div>

            <div className="text-center text-[#2B2725]/80 leading-relaxed">
              <CmsText 
                contentKey="lens.whofor.description" 
                page="LENS"
                blockTitle="Who This Is For Description"
                fallback="<p>This program is perfect for individuals ready to transform how they think, communicate, and lead. Whether you're navigating change, seeking clarity, or building your emotional intelligence, LENS™ provides the foundation you need.</p>" 
                contentType="rich_text"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Program Features */}
      <section className="py-20 bg-[#F9F5EF]">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="font-serif text-3xl md:text-4xl text-[#1E3A32] mb-12">
              <CmsText 
                contentKey="lens.features.title" 
                page="LENS"
                blockTitle="Features Title"
                fallback="What's Included" 
                contentType="short_text"
              />
            </h2>

            <div className="space-y-4 max-w-2xl mx-auto">
              {[
                "Self-paced learning modules",
                "Video lessons and guided practices",
                "Downloadable worksheets and resources",
                "Lifetime access to course materials",
                "Community support forum"
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 bg-white p-4">
                  <CheckCircle size={20} className="text-[#6E4F7D] flex-shrink-0" />
                  <p className="text-[#2B2725] text-left">
                    <CmsText 
                      contentKey={`lens.features.${idx}.text`}
                      page="LENS"
                      blockTitle={`Feature ${idx + 1}`}
                      fallback={item}
                      contentType="short_text"
                    />
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#1E3A32]">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="font-serif text-3xl md:text-4xl text-[#F9F5EF] mb-6">
              <CmsText 
                contentKey="lens.cta.title" 
                page="LENS"
                blockTitle="CTA Title"
                fallback="Ready to Transform Your Thinking?" 
                contentType="short_text"
              />
            </h2>
            <p className="text-[#F9F5EF]/80 text-lg leading-relaxed mb-8 max-w-2xl mx-auto">
              <CmsText 
                contentKey="lens.cta.description" 
                page="LENS"
                blockTitle="CTA Description"
                fallback="Book your complimentary consultation to learn more about LENS™ and how it can help you reshape your mindset." 
                contentType="rich_text"
              />
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to={createPageUrl("Bookings")}>
                <Button className="bg-[#D8B46B] text-[#1E3A32] hover:bg-white px-8 py-6 text-lg">
                  Book Your Consultation
                </Button>
              </Link>
              <Link to={createPageUrl("Contact")}>
                <Button variant="outline" className="border-[#D8B46B] text-[#D8B46B] hover:bg-[#D8B46B]/10 px-8 py-6 text-lg">
                  Ask Questions
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}