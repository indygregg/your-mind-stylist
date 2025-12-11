import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Send, MapPin, Mail } from "lucide-react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Form submission logic
    alert("Thank you for your message. Roberta will be in touch soon.");
  };

  return (
    <div className="bg-[#F9F5EF] pt-32 pb-24">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-[#D8B46B] text-xs tracking-[0.3em] uppercase mb-4 block">
            Get in Touch
          </span>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-[#1E3A32] leading-tight mb-6">
            Let's Start a Conversation
          </h1>
          <p className="text-[#2B2725]/80 text-lg max-w-2xl mx-auto">
            Ready to transform how you think? Schedule your complimentary consultation
            or send a message.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <form onSubmit={handleSubmit} className="bg-white p-8 md:p-10">
              <div className="space-y-6">
                <div>
                  <Label htmlFor="name" className="text-[#2B2725] mb-2 block">
                    Your Name
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="border-[#E4D9C4] focus:border-[#D8B46B] focus:ring-[#D8B46B]"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="text-[#2B2725] mb-2 block">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="border-[#E4D9C4] focus:border-[#D8B46B] focus:ring-[#D8B46B]"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="subject" className="text-[#2B2725] mb-2 block">
                    Subject
                  </Label>
                  <Input
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="border-[#E4D9C4] focus:border-[#D8B46B] focus:ring-[#D8B46B]"
                    placeholder="How can Roberta help you?"
                  />
                </div>

                <div>
                  <Label htmlFor="message" className="text-[#2B2725] mb-2 block">
                    Your Message
                  </Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="border-[#E4D9C4] focus:border-[#D8B46B] focus:ring-[#D8B46B] min-h-[150px]"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-[#1E3A32] hover:bg-[#2B2725] text-[#F9F5EF] py-6"
                >
                  <Send size={16} className="mr-2" />
                  Send Message
                </Button>
              </div>
            </form>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col justify-center"
          >
            <div className="space-y-8">
              <div>
                <h3 className="font-serif text-2xl text-[#1E3A32] mb-4">
                  Schedule Your Complimentary Consultation
                </h3>
                <p className="text-[#2B2725]/70 leading-relaxed">
                  Not sure which path is right for you? Book a free consultation call
                  to discuss your goals and find the best approach for your transformation.
                </p>
              </div>

              <div className="border-t border-[#E4D9C4] pt-8">
                <div className="flex items-start gap-4 mb-6">
                  <MapPin size={20} className="text-[#D8B46B] mt-1" />
                  <div>
                    <p className="font-medium text-[#1E3A32]">Location</p>
                    <p className="text-[#2B2725]/70">Las Vegas, NV</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Mail size={20} className="text-[#D8B46B] mt-1" />
                  <div>
                    <p className="font-medium text-[#1E3A32]">Email</p>
                    <p className="text-[#2B2725]/70">Contact via form</p>
                  </div>
                </div>
              </div>

              <div className="bg-[#A6B7A3]/20 p-6">
                <p className="font-serif text-lg text-[#1E3A32] italic">
                  "When you change your thinking, everything changes."
                </p>
                <p className="text-[#2B2725]/60 text-sm mt-2">— Roberta Fernandez</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}