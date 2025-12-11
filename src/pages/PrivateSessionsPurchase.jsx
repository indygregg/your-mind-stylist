import React from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "../utils";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Calendar, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function PrivateSessionsPurchase() {
  const navigate = useNavigate();

  const handleBookConsultation = () => {
    navigate(createPageUrl("Contact") + "?interest=private-sessions");
  };

  const benefits = [
    "Personalized 1:1 attention focused on your specific patterns",
    "Deep exploration of emotional patterns and identity-level shifts",
    "Custom strategies tailored to your life and goals",
    "Ongoing support between sessions via email",
    "Flexible scheduling that works with your life"
  ];

  return (
    <div className="min-h-screen bg-[#F9F5EF] pt-32 pb-24">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="text-center mb-12">
            <span className="text-[#D8B46B] text-xs tracking-[0.3em] uppercase mb-4 block">
              Private Mind Styling
            </span>
            <h1 className="font-serif text-4xl md:text-5xl text-[#1E3A32] mb-6">
              Work Directly with Roberta
            </h1>
            <p className="text-[#2B2725]/70 text-lg max-w-2xl mx-auto leading-relaxed">
              Private Mind Styling is for those ready for personalized, deep-dive work on shifting 
              long-held patterns and designing new ways of being.
            </p>
          </div>

          {/* What You Get */}
          <div className="bg-white p-8 mb-8">
            <h2 className="font-serif text-2xl text-[#1E3A32] mb-6">What's Included</h2>
            <div className="space-y-4">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <CheckCircle size={20} className="text-[#D8B46B] flex-shrink-0 mt-1" />
                  <span className="text-[#2B2725]/80">{benefit}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* How It Works */}
          <div className="bg-[#1E3A32] p-8 mb-8">
            <h2 className="font-serif text-2xl text-[#F9F5EF] mb-6">How It Works</h2>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#D8B46B]/20 flex items-center justify-center flex-shrink-0">
                  <Calendar size={20} className="text-[#D8B46B]" />
                </div>
                <div>
                  <h3 className="text-[#F9F5EF] font-medium mb-2">Step 1: Complimentary Consultation</h3>
                  <p className="text-[#F9F5EF]/70 text-sm">
                    We'll have a 30-minute conversation to explore what you're working on and see if 
                    private work is the right fit.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#D8B46B]/20 flex items-center justify-center flex-shrink-0">
                  <MessageCircle size={20} className="text-[#D8B46B]" />
                </div>
                <div>
                  <h3 className="text-[#F9F5EF] font-medium mb-2">Step 2: Custom Proposal</h3>
                  <p className="text-[#F9F5EF]/70 text-sm">
                    Based on our conversation, Roberta will create a custom proposal with pricing, 
                    session structure, and timeline that fits your needs.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#D8B46B]/20 flex items-center justify-center flex-shrink-0">
                  <CheckCircle size={20} className="text-[#D8B46B]" />
                </div>
                <div>
                  <h3 className="text-[#F9F5EF] font-medium mb-2">Step 3: Begin Your Work</h3>
                  <p className="text-[#F9F5EF]/70 text-sm">
                    Once you're ready to move forward, we'll schedule your first session and begin 
                    the transformational work.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing Note */}
          <div className="bg-[#F9F5EF] border border-[#E4D9C4] p-6 mb-8">
            <h3 className="font-medium text-[#1E3A32] mb-2">Investment</h3>
            <p className="text-[#2B2725]/70 text-sm leading-relaxed">
              Private Mind Styling is customized to your needs, so pricing varies based on the scope 
              and frequency of sessions. During your complimentary consultation, we'll discuss investment 
              options that align with your goals and budget.
            </p>
          </div>

          {/* CTA */}
          <div className="text-center">
            <Button
              onClick={handleBookConsultation}
              className="bg-[#1E3A32] hover:bg-[#2B2725] px-8 py-6 text-base"
            >
              Schedule Your Complimentary Consultation
              <ArrowRight size={18} className="ml-2" />
            </Button>
            <p className="text-[#2B2725]/60 text-sm mt-4">
              No obligation • 30 minutes • Discovery call
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}