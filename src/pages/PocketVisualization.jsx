import React from "react";
import SEO from "../components/SEO";
import { Link } from "react-router-dom";
import { createPageUrl } from "../utils";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sparkles, Brain, Heart, Zap, Moon, Coffee, Target, Shield } from "lucide-react";

export default function PocketVisualization() {
  const useCases = [
    {
      icon: Coffee,
      title: "Morning Reset",
      description: "Start your day with clarity and intention"
    },
    {
      icon: Target,
      title: "Before Big Moments",
      description: "Rehearse confidence before presentations or meetings"
    },
    {
      icon: Shield,
      title: "Stress Relief",
      description: "Calm your nervous system when overwhelmed"
    },
    {
      icon: Moon,
      title: "Evening Wind Down",
      description: "Release the day and prepare for restorative sleep"
    }
  ];

  const features = [
    "5-15 minute guided sessions",
    "Voice-guided by Roberta",
    "Designed for busy schedules",
    "Science-backed techniques",
    "New sessions added monthly",
    "Access on any device"
  ];

  return (
    <div className="bg-[#F9F5EF]">
      <SEO
        title="Pocket Visualization™ | Your Mind Stylist"
        description="Short, guided sessions to shift your emotional state, reset your nervous system, and rehearse your future self. Roberta in your pocket, whenever you need her."
        canonical="/pocket-visualization"
      />

      {/* Hero Section */}
      <section className="pt-32 pb-20">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <span className="text-[#D8B46B] text-xs tracking-[0.3em] uppercase mb-4 block">
              Pocket Visualization™
            </span>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-[#1E3A32] leading-tight mb-6">
              Roberta in Your Pocket
            </h1>
            <p className="text-[#2B2725] font-serif text-2xl md:text-3xl italic mb-8">
              Short, guided sessions to shift your state, calm your system, and rehearse your future self.
            </p>
            <p className="text-[#2B2725]/80 text-lg leading-relaxed max-w-3xl mx-auto mb-10">
              When you need to reset, refocus, or rehearse—these sessions meet you exactly where you are.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to={createPageUrl("Programs")}>
                <Button className="bg-[#1E3A32] hover:bg-[#2B2725] text-[#F9F5EF] px-8 py-6 text-lg">
                  Start Your Subscription
                </Button>
              </Link>
              <Link to={createPageUrl("Contact?interest=pocket-visualization")}>
                <Button variant="outline" className="border-[#1E3A32] text-[#1E3A32] hover:bg-[#1E3A32]/10 px-8 py-6 text-lg">
                  Learn More
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* What Is It */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-serif text-3xl md:text-4xl text-[#1E3A32] mb-6">
              What is Pocket Visualization™?
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <p className="text-[#2B2725]/80 text-lg leading-relaxed mb-6">
                  These are short, guided audio sessions designed to help you:
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <Sparkles className="text-[#D8B46B] mt-1 flex-shrink-0" size={20} />
                    <span className="text-[#2B2725]/80">Shift your emotional state in minutes</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Brain className="text-[#D8B46B] mt-1 flex-shrink-0" size={20} />
                    <span className="text-[#2B2725]/80">Calm your nervous system</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Heart className="text-[#D8B46B] mt-1 flex-shrink-0" size={20} />
                    <span className="text-[#2B2725]/80">Rehearse supportive patterns</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Zap className="text-[#D8B46B] mt-1 flex-shrink-0" size={20} />
                    <span className="text-[#2B2725]/80">Build emotional resilience</span>
                  </li>
                </ul>
              </div>
              <div className="bg-[#F9F5EF] p-8">
                <h3 className="font-serif text-xl text-[#1E3A32] mb-4">Why "Pocket Visualization"?</h3>
                <p className="text-[#2B2725]/80 leading-relaxed">
                  Because these sessions are designed to go with you—wherever you are, whenever you need them. 
                  Quick enough to fit into your day, powerful enough to create real shifts.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* When to Use */}
      <section className="py-24 bg-[#F9F5EF]">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-serif text-3xl md:text-4xl text-[#1E3A32] mb-12 text-center">
              When You Might Use This
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {useCases.map((useCase, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white p-6 text-center"
                >
                  <useCase.icon className="text-[#D8B46B] mx-auto mb-4" size={40} />
                  <h3 className="font-serif text-lg text-[#1E3A32] mb-2">{useCase.title}</h3>
                  <p className="text-[#2B2725]/70 text-sm">{useCase.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* What's Included */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-serif text-3xl md:text-4xl text-[#1E3A32] mb-8">
              What's Included
            </h2>
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div>
                <h3 className="font-serif text-xl text-[#1E3A32] mb-4">Your Subscription Includes:</h3>
                <ul className="space-y-3">
                  {features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="text-[#D8B46B]">✦</span>
                      <span className="text-[#2B2725]/80">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-[#F9F5EF] p-8">
                <h3 className="font-serif text-xl text-[#1E3A32] mb-4">Pricing</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-[#2B2725] font-medium">Monthly</p>
                    <p className="text-[#D8B46B] text-2xl font-serif">$7/month</p>
                  </div>
                  <div>
                    <p className="text-[#2B2725] font-medium">Yearly</p>
                    <p className="text-[#D8B46B] text-2xl font-serif">$70/year</p>
                    <p className="text-[#2B2725]/60 text-sm">(Save $14)</p>
                  </div>
                </div>
              </div>
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
          >
            <h2 className="font-serif text-3xl md:text-4xl text-[#1E3A32] mb-12 text-center">
              How It Works
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-[#D8B46B] text-white rounded-full flex items-center justify-center mx-auto mb-4 font-serif text-xl">
                  1
                </div>
                <h3 className="font-serif text-lg text-[#1E3A32] mb-2">Subscribe</h3>
                <p className="text-[#2B2725]/70">
                  Choose monthly or yearly access
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-[#D8B46B] text-white rounded-full flex items-center justify-center mx-auto mb-4 font-serif text-xl">
                  2
                </div>
                <h3 className="font-serif text-lg text-[#1E3A32] mb-2">Browse & Select</h3>
                <p className="text-[#2B2725]/70">
                  Choose a session based on what you need right now
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-[#D8B46B] text-white rounded-full flex items-center justify-center mx-auto mb-4 font-serif text-xl">
                  3
                </div>
                <h3 className="font-serif text-lg text-[#1E3A32] mb-2">Listen & Shift</h3>
                <p className="text-[#2B2725]/70">
                  5-15 minutes to reset and realign
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-[#1E3A32]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-[#F9F5EF] leading-tight mb-6">
              Start Shifting Today
            </h2>
            <p className="text-[#F9F5EF]/80 text-lg leading-relaxed mb-10 max-w-2xl mx-auto">
              Join Pocket Visualization™ and have Roberta's guidance available whenever you need it.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to={createPageUrl("Programs")}>
                <Button className="bg-[#D8B46B] hover:bg-[#F9F5EF] text-[#1E3A32] px-8 py-6 text-lg">
                  Subscribe Now
                </Button>
              </Link>
              <Link to={createPageUrl("Contact?interest=pocket-visualization")}>
                <Button variant="outline" className="border-[#F9F5EF] text-[#F9F5EF] hover:bg-[#F9F5EF]/10 px-8 py-6 text-lg">
                  Questions? Get in Touch
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}