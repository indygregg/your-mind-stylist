import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { motion } from "framer-motion";
import { ShoppingCart, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import SEO from "../components/SEO";

const RESULTS = {
  leader: {
    title: "You're the Leader Dog",
    emoji: "🐕",
    summary: "You tend to move toward action, clarity, and forward motion. You're often the one who steps up, decides, organizes, and carries responsibility. You value momentum, competence, and progress.",
    strengths: ["Decisive", "Capable under pressure", "Courageous", "Naturally directive", "Able to move things forward"],
    growth: "Your challenge is not strength — it's softness. You may move so quickly toward solutions that you miss what needs to be felt, not fixed.",
    relationships: "You often show love through action, protection, and problem-solving. You may need reminders that presence, patience, and listening can be just as powerful as solutions.",
    stress: "You may become more controlling, impatient, blunt, or over-responsible. Stress can make everything feel like a problem to solve immediately.",
    restyle: "Am I leading right now — or protecting myself from discomfort?",
  },
  connector: {
    title: "You're the Connector Dog",
    emoji: "🐶",
    summary: "You lead with energy, expression, and connection. You're often the emotional bridge in a room — sensing people quickly, bringing warmth, and helping others feel included.",
    strengths: ["Expressive", "Intuitive with people", "Encouraging", "Relationally aware", "Emotionally vibrant"],
    growth: "You may spend so much energy reading, managing, or supporting others that you lose contact with your own emotional center.",
    relationships: "You bond quickly and bring warmth, enthusiasm, and emotional presence. Your deeper growth comes through consistency, grounding, and letting connection deepen beyond chemistry.",
    stress: "You may become scattered, overextended, reactive, or overly dependent on outside reassurance.",
    restyle: "What am I actually feeling before I reach outward for connection?",
  },
  steady: {
    title: "You're the Steady Companion Dog",
    emoji: "🐾",
    summary: "You bring calm, trust, and consistency. You're often the grounded one — the safe presence, the dependable heart, the person people lean on when life feels unstable.",
    strengths: ["Loyal", "Calming", "Patient", "Emotionally attuned", "Deeply trustworthy"],
    growth: "You may suppress your own needs to keep the peace. Your strength is steadiness — but your growth lies in letting your voice matter too.",
    relationships: "You love through presence, reliability, and care. You remember what matters. You stay. But staying connected should not require self-silencing.",
    stress: "You may withdraw, become passive, go quiet, or carry resentment internally instead of expressing what you need.",
    restyle: "What need have I not said out loud yet?",
  },
  thoughtful: {
    title: "You're the Thoughtful Observer Dog",
    emoji: "🦮",
    summary: "You lead with insight, pattern recognition, and careful awareness. You often notice what others miss and prefer to understand before you act.",
    strengths: ["Perceptive", "Thoughtful", "Precise", "Dependable", "Reflective"],
    growth: "You may overanalyze, hesitate, or wait for certainty that never fully comes. Your growth lies in trusting that clarity often arrives through movement, not before it.",
    relationships: "You show care through reliability, thoughtfulness, and depth. But others may not always see how much you feel unless you let more of yourself be visible.",
    stress: "You may retreat inward, become overly critical, freeze, delay action, or try to think your way out of emotion.",
    restyle: "Is my analysis helping me move — or helping me avoid?",
  },
};

export default function QuizResults() {
  const { slug } = useParams();
  const urlParams = new URLSearchParams(window.location.search);
  const archetype = urlParams.get("archetype") || "leader";
  const result = RESULTS[archetype] || RESULTS.leader;

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