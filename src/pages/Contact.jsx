import React, { useState, useEffect } from "react";
import SEO from "../components/SEO";
import { Link } from "react-router-dom";
import { createPageUrl } from "../utils";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Send, Mail, CheckCircle } from "lucide-react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    reachingOutAs: "",
    interests: [],
    message: "",
    preferredContact: "email",
    availability: "",
  });

  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const interest = urlParams.get("interest");
    if (interest === "private-sessions") {
      setFormData(prev => ({
        ...prev,
        interests: ["Private Mind Styling (1:1)"]
      }));
    }
  }, []);

  const interestOptions = [
    "The Mind Styling Certification™",
    "Private Mind Styling (1:1)",
    "The Inner Rehearsal Sessions™",
    "Organizational Mind Styling (Speaking / Training)",
    "The Free Masterclass",
    "Something else / I'm not sure",
  ];

  const handleInterestToggle = (interest) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Form submission logic would go here
    console.log("Form submitted:", formData);
    setSubmitted(true);
    
    // Reset form after a delay
    setTimeout(() => {
      setFormData({
        name: "",
        email: "",
        phone: "",
        reachingOutAs: "",
        interests: [],
        message: "",
        preferredContact: "email",
        availability: "",
      });
      setSubmitted(false);
    }, 5000);
  };

  return (
    <div className="bg-[#F9F5EF]">
      <SEO
        title="Contact | Your Mind Stylist"
        description="Contact Your Mind Stylist, Roberta Fernandez, to explore private work, organizational trainings, or questions about programs and Inner Rehearsal Sessions™."
        canonical="/contact"
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
              Contact
            </span>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-[#1E3A32] leading-tight mb-6">
              Let's Start the Conversation
            </h1>
            <p className="text-[#2B2725] font-serif text-2xl md:text-3xl italic mb-8">
              Whether you're exploring personal work, organizational support, or have a question about
              one of my programs, I'd love to hear from you.
            </p>

            <p className="text-[#2B2725]/80 text-lg leading-relaxed max-w-3xl mx-auto">
              Sometimes the first step toward change is simply saying, "Here's where I am, and here's
              what I'd like to be different." This page is your space to do exactly that.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-serif text-3xl md:text-4xl text-[#1E3A32] mb-6">Get in Touch</h2>
            <p className="text-[#2B2725]/80 text-lg mb-10">
              Share a bit about what you're looking for, and I'll respond as soon as I can with next
              steps or a suggested path forward.
            </p>

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-[#A6B7A3]/20 p-10 text-center"
              >
                <CheckCircle size={48} className="text-[#A6B7A3] mx-auto mb-4" />
                <p className="text-[#1E3A32] text-lg font-medium mb-2">
                  Your message has been received.
                </p>
                <p className="text-[#2B2725]/70">
                  I'll review what you've shared and be in touch soon.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Name */}
                <div>
                  <Label htmlFor="name" className="text-[#2B2725] mb-2 block">
                    Name *
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="border-[#E4D9C4] focus:border-[#D8B46B] focus:ring-[#D8B46B]"
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <Label htmlFor="email" className="text-[#2B2725] mb-2 block">
                    Email *
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

                {/* Phone */}
                <div>
                  <Label htmlFor="phone" className="text-[#2B2725] mb-2 block">
                    Phone (optional)
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="border-[#E4D9C4] focus:border-[#D8B46B] focus:ring-[#D8B46B]"
                  />
                </div>

                {/* Reaching Out As */}
                <div>
                  <Label className="text-[#2B2725] mb-2 block">I'm reaching out as a…</Label>
                  <Select
                    value={formData.reachingOutAs}
                    onValueChange={(value) => setFormData({ ...formData, reachingOutAs: value })}
                  >
                    <SelectTrigger className="border-[#E4D9C4] focus:border-[#D8B46B] focus:ring-[#D8B46B]">
                      <SelectValue placeholder="Select one" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="individual">Individual</SelectItem>
                      <SelectItem value="leader">Leader / Executive</SelectItem>
                      <SelectItem value="hr">HR / People & Culture</SelectItem>
                      <SelectItem value="business-owner">Business Owner</SelectItem>
                      <SelectItem value="event-organizer">Event / Conference Organizer</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Interests */}
                <div>
                  <Label className="text-[#2B2725] mb-4 block">I'm interested in…</Label>
                  <div className="space-y-3">
                    {interestOptions.map((interest) => (
                      <div key={interest} className="flex items-start gap-3">
                        <Checkbox
                          id={interest}
                          checked={formData.interests.includes(interest)}
                          onCheckedChange={() => handleInterestToggle(interest)}
                          className="mt-1"
                        />
                        <label
                          htmlFor={interest}
                          className="text-[#2B2725]/80 leading-relaxed cursor-pointer"
                        >
                          {interest}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Message */}
                <div>
                  <Label htmlFor="message" className="text-[#2B2725] mb-2 block">
                    Message *
                  </Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="border-[#E4D9C4] focus:border-[#D8B46B] focus:ring-[#D8B46B] min-h-[150px]"
                    placeholder="Share anything you'd like me to know about your situation, goals, or questions."
                    required
                  />
                </div>

                {/* Preferred Contact Method */}
                <div>
                  <Label className="text-[#2B2725] mb-3 block">Preferred contact method</Label>
                  <RadioGroup
                    value={formData.preferredContact}
                    onValueChange={(value) => setFormData({ ...formData, preferredContact: value })}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="email" id="contact-email" />
                      <Label htmlFor="contact-email" className="cursor-pointer font-normal">
                        Email
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="phone" id="contact-phone" />
                      <Label htmlFor="contact-phone" className="cursor-pointer font-normal">
                        Phone
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="either" id="contact-either" />
                      <Label htmlFor="contact-either" className="cursor-pointer font-normal">
                        Either is fine
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Availability */}
                <div>
                  <Label htmlFor="availability" className="text-[#2B2725] mb-2 block">
                    Preferred availability (optional)
                  </Label>
                  <Input
                    id="availability"
                    value={formData.availability}
                    onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                    className="border-[#E4D9C4] focus:border-[#D8B46B] focus:ring-[#D8B46B]"
                    placeholder="If you'd like a call, share a few days / times that work best for you."
                  />
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full bg-[#1E3A32] hover:bg-[#2B2725] text-[#F9F5EF] py-6"
                >
                  <Send size={16} className="mr-2" />
                  Send Message
                </Button>
              </form>
            )}
          </motion.div>
        </div>
      </section>

      {/* Other Ways to Connect */}
      <section className="py-20 bg-[#F9F5EF]">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-serif text-3xl md:text-4xl text-[#1E3A32] mb-8">
              Other Ways to Connect
            </h2>
            <p className="text-[#2B2725]/80 text-lg mb-6">If you prefer, you can also reach out here:</p>

            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <Mail size={20} className="text-[#D8B46B] mt-1" />
                <div>
                  <p className="font-medium text-[#1E3A32]">General inquiries:</p>
                  <p className="text-[#2B2725]/70">info@themindstylist.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Mail size={20} className="text-[#D8B46B] mt-1" />
                <div>
                  <p className="font-medium text-[#1E3A32]">Speaking & training:</p>
                  <p className="text-[#2B2725]/70">
                    Use the form above and select "Organizational Mind Styling (Speaking / Training)" as
                    your interest.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Common Next Steps */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-serif text-3xl md:text-4xl text-[#1E3A32] mb-8">
              Not Sure Where to Start?
            </h2>

            <p className="text-[#2B2725]/80 text-lg leading-relaxed mb-6">
              If you're unsure which path is right for you, that's completely okay. You can use this
              page simply to say:
            </p>

            <div className="bg-[#F9F5EF] p-8 mb-8">
              <div className="space-y-3">
                <p className="text-[#2B2725]/80 flex items-start gap-3">
                  <span className="text-[#D8B46B]">•</span>
                  "Here's what I'm struggling with right now."
                </p>
                <p className="text-[#2B2725]/80 flex items-start gap-3">
                  <span className="text-[#D8B46B]">•</span>
                  "Here's what I'd like to feel or experience instead."
                </p>
              </div>
            </div>

            <p className="text-[#2B2725]/80 text-lg leading-relaxed mb-6">
              From there, I can suggest:
            </p>

            <div className="grid md:grid-cols-2 gap-4 mb-10">
              <Link
                to={createPageUrl("Evolution")}
                className="text-[#1E3A32] hover:text-[#D8B46B] transition-colors flex items-center gap-2"
              >
                <span className="text-[#D8B46B]">✦</span>
                The Mind Styling Certification™
              </Link>
              <Link
                to={createPageUrl("PrivateSessions")}
                className="text-[#1E3A32] hover:text-[#D8B46B] transition-colors flex items-center gap-2"
              >
                <span className="text-[#D8B46B]">✦</span>
                Private Mind Styling
              </Link>
              <Link
                to={createPageUrl("InnerRehearsal")}
                className="text-[#1E3A32] hover:text-[#D8B46B] transition-colors flex items-center gap-2"
              >
                <span className="text-[#D8B46B]">✦</span>
                The Inner Rehearsal Sessions™
              </Link>
              <Link
                to={createPageUrl("SpeakingTraining")}
                className="text-[#1E3A32] hover:text-[#D8B46B] transition-colors flex items-center gap-2"
              >
                <span className="text-[#D8B46B]">✦</span>
                Organizational Mind Styling
              </Link>
              <Link
                to={createPageUrl("FreeMasterclass")}
                className="text-[#1E3A32] hover:text-[#D8B46B] transition-colors flex items-center gap-2"
              >
                <span className="text-[#D8B46B]">✦</span>
                Or a gentle first step like the Free Masterclass
              </Link>
            </div>

            <div className="text-center">
              <Link
                to={createPageUrl("Contact")}
                className="group inline-flex items-center gap-3 px-8 py-4 border border-[#D8B46B] text-[#1E3A32] text-sm tracking-wide hover:bg-[#D8B46B]/10 transition-all duration-300"
              >
                Explore Ways to Work With Me
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Closing */}
      <section className="py-24 bg-[#1E3A32]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-[#F9F5EF] leading-tight mb-6">
              You Don't Have to Figure It All Out Alone
            </h2>

            <p className="text-[#F9F5EF]/80 text-lg leading-relaxed mb-10 max-w-2xl mx-auto">
              Rewriting your patterns and shifting your internal world can feel big — but you don't
              have to do it by yourself. This is an invitation to begin.
            </p>

            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="group inline-flex items-center gap-3 px-8 py-4 bg-[#D8B46B] text-[#1E3A32] text-sm tracking-wide hover:bg-[#F9F5EF] transition-all duration-300"
            >
              Send a Message
              <Send size={16} />
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}