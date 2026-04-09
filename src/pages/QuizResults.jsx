import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getFunnel } from "../lib/bookFunnels";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { motion } from "framer-motion";
import { ShoppingCart, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import SEO from "../components/SEO";

export default function QuizResults() {
  const { slug } = useParams();
  const urlParams = new URLSearchParams(window.location.search);
  const archetype = urlParams.get("archetype");
  const funnel = getFunnel(slug);
  const archetypes = funnel?.archetypes || {};
  const firstKey = Object.keys(archetypes)[0];
  const result = archetypes[archetype] || archetypes[firstKey] || {};

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [revealed, setRevealed] = useState(false);

  // Find the book to link to purchase
  const { data: book } = useQuery({
    queryKey: ["book-for-quiz", slug],
    queryFn: async () => {
      const products = await base44.entities.Product.filter({ slug, product_subtype: "book" });
      return products[0] || null;
    },
    enabled: !!slug,
  });

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setSubmitting(true);
    // Create lead record
    await base44.entities.Lead.create({
      email,
      first_name: name,
      source: "website",
      what_inquired_about: `Dog Archetype Quiz — Result: ${result.title}`,
      tags: [`archetype:${archetype}`, "quiz-funnel", `book:${slug}`],
    });
    // Add to MailerLite
    await base44.functions.invoke("mailerLiteAddSubscriber", {
      email,
      name,
      groups: [],
      fields: { dog_archetype: archetype, quiz_source: slug },
    }).catch(() => {}); // non-blocking
    setSubmitting(false);
    setSubmitted(true);
    setRevealed(true);
  };

  const handlePurchase = async () => {
    if (!book) return;
    const response = await base44.functions.invoke("createProductCheckout", { product_id: book.id });
    if (response.data?.url) window.location.href = response.data.url;
  };

  return (
    <div className="min-h-screen bg-[#F9F5EF]">
      <SEO title={`Your Dog Archetype Result | Your Mind Stylist`} description={result.title} />

      <div className="pt-28 pb-20 px-6">
        <div className="max-w-2xl mx-auto">

          {!revealed ? (
            /* Email gate */
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <p className="text-[#D8B46B] text-xs tracking-[0.3em] uppercase mb-4">Your Result is Ready</p>
              <h1 className="font-serif text-3xl md:text-4xl text-[#1E3A32] mb-4">Want your results?</h1>
              <p className="text-[#2B2725]/70 mb-8 leading-relaxed">
                Enter your email to reveal your dog archetype, get your personalized insight, and receive practical next steps inspired by <em>Go Fetch Your Self</em>.
              </p>
              <form onSubmit={handleEmailSubmit} className="bg-white border border-[#E4D9C4] p-8 text-left space-y-4">
                <div>
                  <label className="block text-sm text-[#2B2725]/70 mb-1">First Name</label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your first name"
                    className="border-[#E4D9C4]"
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#2B2725]/70 mb-1">Email Address *</label>
                  <Input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="border-[#E4D9C4]"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-[#1E3A32] hover:bg-[#2B2725] text-white py-6 text-base"
                >
                  {submitting ? <Loader2 size={18} className="animate-spin mr-2" /> : null}
                  Show Me My Results
                  <ArrowRight size={16} className="ml-2" />
                </Button>
                <p className="text-center text-xs text-[#2B2725]/40">
                  No spam. Just thoughtful insights, book updates, and practical mindset tools.
                </p>
              </form>
            </motion.div>
          ) : (
            /* Results reveal */
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="text-center mb-10">
                <div className="text-6xl mb-4">{result.emoji}</div>
                <p className="text-[#D8B46B] text-xs tracking-[0.3em] uppercase mb-3">Your Archetype</p>
                <h1 className="font-serif text-4xl md:text-5xl text-[#1E3A32] mb-6">{result.title}</h1>
                <p className="text-[#2B2725]/80 text-lg leading-relaxed">{result.summary}</p>
              </div>

              <div className="space-y-6">
                {/* Strengths */}
                <div className="bg-white border border-[#E4D9C4] p-6">
                  <h3 className="font-serif text-xl text-[#1E3A32] mb-4">Your Strengths</h3>
                  <ul className="space-y-2">
                    {result.strengths.map((s, i) => (
                      <li key={i} className="flex items-center gap-3 text-[#2B2725]/80">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#D8B46B] flex-shrink-0" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Growth edge */}
                <div className="bg-[#F9F5EF] border border-[#E4D9C4] p-6">
                  <h3 className="font-serif text-xl text-[#1E3A32] mb-3">Your Growth Edge</h3>
                  <p className="text-[#2B2725]/80 leading-relaxed">{result.growth}</p>
                </div>

                {/* Relationships */}
                <div className="bg-white border border-[#E4D9C4] p-6">
                  <h3 className="font-serif text-xl text-[#1E3A32] mb-3">In Relationships</h3>
                  <p className="text-[#2B2725]/80 leading-relaxed">{result.relationships}</p>
                </div>

                {/* Stress */}
                <div className="bg-[#F9F5EF] border border-[#E4D9C4] p-6">
                  <h3 className="font-serif text-xl text-[#1E3A32] mb-3">Under Stress</h3>
                  <p className="text-[#2B2725]/80 leading-relaxed">{result.stress}</p>
                </div>

                {/* Restyle prompt */}
                <div className="bg-[#1E3A32] p-6 text-center">
                  <p className="text-[#D8B46B] text-xs tracking-[0.2em] uppercase mb-3">Your Restyle Prompt</p>
                  <p className="font-serif text-xl text-white italic">"{result.restyle}"</p>
                </div>

                {/* Book CTA */}
                <div className="bg-[#D8B46B]/10 border border-[#D8B46B]/30 p-8 text-center">
                  <h3 className="font-serif text-2xl text-[#1E3A32] mb-3">Ready to understand your archetype more deeply?</h3>
                  <p className="text-[#2B2725]/70 mb-6">
                    Read <em>Go Fetch Your Self</em> and explore how your archetype shows up in emotional intelligence, change, and relationships.
                  </p>
                  <Button
                    onClick={handlePurchase}
                    disabled={!book}
                    className="bg-[#1E3A32] hover:bg-[#2B2725] text-white px-10 py-6 text-base"
                  >
                    <ShoppingCart size={18} className="mr-2" />
                    Get the Book{book?.price ? ` — $${(book.price / 100).toFixed(2)}` : ""}
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}