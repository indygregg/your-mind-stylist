import React from "react";
import SEO from "../components/SEO";
import { Link } from "react-router-dom";
import { createPageUrl } from "../utils";
import { motion } from "framer-motion";
import { Eye, Mail } from "lucide-react";

export default function Accessibility() {
  return (
    <div className="bg-[#F9F5EF]">
      <SEO
        title="Accessibility | Your Mind Stylist"
        description="Your Mind Stylist is committed to making our website accessible and usable for as many people as possible."
        canonical="/accessibility"
      />

      {/* Hero */}
      <section className="pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <Eye size={32} className="text-[#D8B46B]" />
              <span className="text-[#D8B46B] text-xs tracking-[0.3em] uppercase">
                Accessibility
              </span>
            </div>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-[#1E3A32] leading-tight mb-6">
              Accessibility at Your Mind Stylist
            </h1>
            <p className="text-[#2B2725]/80 text-lg leading-relaxed">
              Your Mind Stylist is committed to making our website and digital experiences
              accessible and usable for as many people as possible.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-12"
          >
            <p className="text-[#2B2725]/80 text-lg leading-relaxed">
              We aim to align our public website with the principles of the Web Content
              Accessibility Guidelines (WCAG) 2.1, Level AA, over time. This is an ongoing
              effort as we continue to improve our content, design, and technology.
            </p>

            {/* Our Approach */}
            <div>
              <h2 className="font-serif text-3xl text-[#1E3A32] mb-6">Our Approach</h2>
              <p className="text-[#2B2725]/80 text-lg mb-4">We:</p>
              <ul className="space-y-3 text-[#2B2725]/80 text-lg">
                <li className="flex items-start gap-3">
                  <span className="text-[#D8B46B] mt-1">•</span>
                  Use clear, readable typography
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#D8B46B] mt-1">•</span>
                  Aim for sufficient color contrast
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#D8B46B] mt-1">•</span>
                  Structure content with headings and landmarks
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#D8B46B] mt-1">•</span>
                  Provide descriptive link text where possible
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#D8B46B] mt-1">•</span>
                  Test pages with keyboard navigation when we make major changes
                </li>
              </ul>
            </div>

            {/* Accessibility Widget */}
            <div>
              <h2 className="font-serif text-3xl text-[#1E3A32] mb-6">
                Accessibility Widget
              </h2>
              <p className="text-[#2B2725]/80 text-lg mb-4">
                You'll find an <strong>Accessibility</strong> button at the bottom of our pages.
              </p>
              <p className="text-[#2B2725]/80 text-lg mb-4">This widget lets you:</p>
              <ul className="space-y-3 text-[#2B2725]/80 text-lg">
                <li className="flex items-start gap-3">
                  <span className="text-[#D8B46B] mt-1">•</span>
                  Adjust text size
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#D8B46B] mt-1">•</span>
                  Increase contrast
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#D8B46B] mt-1">•</span>
                  Enable a dyslexia-friendly font
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#D8B46B] mt-1">•</span>
                  Increase line spacing
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#D8B46B] mt-1">•</span>
                  Highlight links
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#D8B46B] mt-1">•</span>
                  Reduce motion and animation
                </li>
              </ul>
              <p className="text-[#2B2725]/80 text-lg mt-4">
                These settings affect only your experience on this site and can be changed or
                reset at any time.
              </p>
            </div>

            {/* Known Limitations */}
            <div>
              <h2 className="font-serif text-3xl text-[#1E3A32] mb-6">Known Limitations</h2>
              <p className="text-[#2B2725]/80 text-lg mb-4">
                While we strive for accessibility, you may still encounter parts of the site
                that are not fully optimized—for example, older blog posts or media that were
                created before our current standards were in place.
              </p>
              <p className="text-[#2B2725]/80 text-lg">
                We are actively working to review and improve these areas.
              </p>
            </div>

            {/* Feedback & Contact */}
            <div className="bg-[#F9F5EF] p-8 rounded-lg">
              <h2 className="font-serif text-3xl text-[#1E3A32] mb-6">Feedback & Contact</h2>
              <p className="text-[#2B2725]/80 text-lg mb-4">
                If you experience any difficulty accessing information on this site, or if you
                have suggestions on how we can improve accessibility, please contact us:
              </p>
              <div className="flex items-start gap-3 mb-4">
                <Mail size={20} className="text-[#D8B46B] mt-1" />
                <div>
                  <p className="text-[#1E3A32] font-medium mb-1">Email:</p>
                  <a
                    href="mailto:info@themindstylist.com"
                    className="text-[#D8B46B] hover:text-[#1E3A32] transition-colors"
                  >
                    info@themindstylist.com
                  </a>
                </div>
              </div>
              <p className="text-[#2B2725]/80 text-sm mt-6">
                <strong>Please include:</strong> the page URL, a description of the issue, and
                the assistive technology or browser you're using if applicable.
              </p>
              <p className="text-[#2B2725]/80 text-lg mt-4">
                We value your feedback and will do our best to respond and address your concerns.
              </p>
            </div>

            {/* Third-Party Content */}
            <div>
              <h2 className="font-serif text-3xl text-[#1E3A32] mb-6">Third-Party Content</h2>
              <p className="text-[#2B2725]/80 text-lg">
                Some content or features on our site are provided by third parties (such as
                embedded videos, social media widgets, or payment processors like Stripe). While
                we cannot control the accessibility of third-party tools, we choose partners who
                are actively working toward accessible experiences.
              </p>
            </div>

            {/* Ongoing Improvement */}
            <div>
              <h2 className="font-serif text-3xl text-[#1E3A32] mb-6">Ongoing Improvement</h2>
              <p className="text-[#2B2725]/80 text-lg">
                Accessibility is not a one-time project for us—it's an ongoing commitment. As
                our site evolves, we will continue reviewing our content and features with
                accessibility in mind.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-[#1E3A32]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-serif text-3xl md:text-4xl text-[#F9F5EF] mb-6">
              Questions or Suggestions?
            </h2>
            <p className="text-[#F9F5EF]/80 text-lg mb-8">
              We're here to help and always looking to improve.
            </p>
            <Link
              to={createPageUrl("Contact")}
              className="inline-flex items-center gap-3 px-8 py-4 bg-[#D8B46B] text-[#1E3A32] text-sm tracking-wide hover:bg-[#F9F5EF] transition-all duration-300"
            >
              Get in Touch
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}