import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "../utils";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Clock } from "lucide-react";

export default function BlogPost() {
  // In a real implementation, this would be fetched based on the slug from URL params
  const urlParams = new URLSearchParams(window.location.search);
  const slug = urlParams.get("slug");

  // Sample post data - in production, this would come from a CMS or database
  const post = {
    category: "Thursday Thoughts",
    title: "The Stories You Tell Yourself About Who You Are",
    subtitle: "And why changing them changes everything",
    date: "December 5, 2024",
    readTime: 5,
    content: [
      {
        type: "paragraph",
        text: "Most of us live inside narratives we didn't consciously write. We carry stories about who we are, what we're capable of, and what we deserve — and those stories shape everything.",
      },
      {
        type: "paragraph",
        text: "They influence how we show up in conversations, what opportunities we say yes or no to, how we interpret feedback, and whether we believe we belong in the room.",
      },
      {
        type: "heading",
        text: "The Problem With Unconscious Stories",
      },
      {
        type: "paragraph",
        text: "These narratives rarely get examined. They were written over time — through experiences, relationships, failures, and successes — and now they run quietly in the background of your mind.",
      },
      {
        type: "paragraph",
        text: "Some of them are helpful. But many are outdated, incomplete, or just plain untrue.",
      },
      {
        type: "pullquote",
        text: "The stories you tell yourself about who you are become the ceiling of what you allow yourself to do.",
      },
      {
        type: "heading",
        text: "What Happens When You Change the Story",
      },
      {
        type: "paragraph",
        text: "When you begin to see your internal narrative for what it is — just a story, not the truth — something shifts. You gain space. You start to question:",
      },
      {
        type: "list",
        items: [
          "Is this actually true?",
          "Where did I learn this?",
          "Does this belief still serve me?",
          "What would I think if this weren't true?",
        ],
      },
      {
        type: "paragraph",
        text: "And from that space, you can begin to rewrite it. Not with forced affirmations or pretending. But with curiosity, clarity, and evidence from your actual life.",
      },
      {
        type: "heading",
        text: "How to Start",
      },
      {
        type: "paragraph",
        text: "This week, notice the quiet thoughts you have about yourself. The ones that start with:",
      },
      {
        type: "list",
        items: [
          '"I\'m the kind of person who..."',
          '"I always..."',
          '"I never..."',
          '"I can\'t..."',
        ],
      },
      {
        type: "paragraph",
        text: "Write them down. Look at them. Ask yourself: Is this helping me or holding me back?",
      },
      {
        type: "paragraph",
        text: "Because the moment you see the story, you can begin to edit it. And when you change the story, you change everything.",
      },
    ],
    keyTakeaways: [
      "Your identity is made of stories — and most of them were written unconsciously.",
      "Those stories shape what you believe you're capable of and what you allow yourself to pursue.",
      "Changing the story begins with noticing it, questioning it, and choosing a more accurate narrative.",
    ],
    innerRehearsalTieIn: {
      show: true,
      theme: "confidence and identity expansion",
      description: "calm in transition, future-self embodiment, and releasing old narratives",
    },
    relatedEpisodes: [
      {
        title: "The Stories We Tell Ourselves",
        link: "#",
      },
      {
        title: "Identity, Confidence & Belonging",
        link: "#",
      },
    ],
  };

  return (
    <div className="bg-[#F9F5EF]">
      {/* Back Link */}
      <section className="pt-32 pb-8">
        <div className="max-w-4xl mx-auto px-6">
          <Link
            to={createPageUrl("Blog")}
            className="group inline-flex items-center gap-2 text-[#2B2725]/70 hover:text-[#1E3A32] transition-colors"
          >
            <ArrowLeft
              size={16}
              className="group-hover:-translate-x-1 transition-transform"
            />
            Back to The Mind Styling Journal
          </Link>
        </div>
      </section>

      {/* Hero Section */}
      <section className="pb-16">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-[#D8B46B] text-xs tracking-[0.3em] uppercase mb-4 block">
              {post.category}
            </span>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-[#1E3A32] leading-tight mb-6">
              {post.title}
            </h1>
            {post.subtitle && (
              <p className="font-serif text-2xl md:text-3xl text-[#6E4F7D] italic mb-8">
                {post.subtitle}
              </p>
            )}

            <div className="flex items-center gap-6 text-[#2B2725]/60 text-sm">
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                {post.date}
              </div>
              <div className="flex items-center gap-2">
                <Clock size={16} />
                {post.readTime} min read
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Body Content */}
      <section id="body" className="pb-16">
        <div className="max-w-3xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="prose prose-lg max-w-none"
          >
            {post.content.map((block, index) => {
              if (block.type === "paragraph") {
                return (
                  <p
                    key={index}
                    className="text-[#2B2725]/80 text-lg leading-relaxed mb-6"
                  >
                    {block.text}
                  </p>
                );
              }

              if (block.type === "heading") {
                return (
                  <h2
                    key={index}
                    className="font-serif text-2xl md:text-3xl text-[#1E3A32] mt-12 mb-6"
                  >
                    {block.text}
                  </h2>
                );
              }

              if (block.type === "pullquote") {
                return (
                  <div key={index} className="my-12 border-l-4 border-[#D8B46B] pl-8 py-4">
                    <p className="font-serif text-2xl text-[#1E3A32] italic leading-relaxed">
                      {block.text}
                    </p>
                  </div>
                );
              }

              if (block.type === "list") {
                return (
                  <ul key={index} className="space-y-3 mb-6 ml-6">
                    {block.items.map((item, i) => (
                      <li
                        key={i}
                        className="text-[#2B2725]/80 text-lg leading-relaxed flex items-start gap-3"
                      >
                        <span className="text-[#D8B46B] mt-1">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                );
              }

              return null;
            })}
          </motion.div>
        </div>
      </section>

      {/* Key Takeaways */}
      {post.keyTakeaways && (
        <section className="py-16 bg-white">
          <div className="max-w-3xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-serif text-2xl md:text-3xl text-[#1E3A32] mb-8">
                Key Takeaways
              </h2>
              <div className="space-y-4">
                {post.keyTakeaways.map((takeaway, index) => (
                  <div key={index} className="flex items-start gap-3 bg-[#F9F5EF] p-6">
                    <span className="text-[#D8B46B] text-xl">✦</span>
                    <p className="text-[#2B2725]/80 text-lg leading-relaxed">{takeaway}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Inner Rehearsal Tie-In */}
      {post.innerRehearsalTieIn?.show && (
        <section className="py-16 bg-[#A6B7A3]">
          <div className="max-w-3xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-serif text-2xl md:text-3xl text-[#F9F5EF] mb-6">
                Try This Inner Rehearsal
              </h2>
              <p className="text-[#F9F5EF]/90 text-lg leading-relaxed mb-8">
                If this post resonates, you might love an Inner Rehearsal Session focused on{" "}
                {post.innerRehearsalTieIn.theme}. Inside the Inner Rehearsal Library, you'll find
                guided experiences for {post.innerRehearsalTieIn.description}.
              </p>
              <Link
                to={createPageUrl("InnerRehearsal")}
                className="inline-flex items-center gap-2 text-[#F9F5EF] font-medium hover:text-white transition-colors"
              >
                Explore the Inner Rehearsal Sessions™
                <ArrowLeft size={16} className="rotate-180" />
              </Link>
            </motion.div>
          </div>
        </section>
      )}

      {/* Related Episodes */}
      {post.relatedEpisodes && post.relatedEpisodes.length > 0 && (
        <section className="py-16 bg-[#F9F5EF]">
          <div className="max-w-3xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-serif text-2xl md:text-3xl text-[#1E3A32] mb-6">
                Listen to Activated Dialogue
              </h2>
              <div className="space-y-3">
                {post.relatedEpisodes.map((episode, index) => (
                  <Link
                    key={index}
                    to={createPageUrl("Podcast")}
                    className="block text-[#1E3A32] hover:text-[#D8B46B] transition-colors text-lg"
                  >
                    • {episode.title}
                  </Link>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* About Roberta */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-serif text-2xl md:text-3xl text-[#1E3A32] mb-6">
              About The Mind Stylist
            </h2>
            <p className="text-[#2B2725]/80 text-lg leading-relaxed mb-8">
              Roberta Fernandez is The Mind Stylist — an Integrative Emotional Intelligence
              Specialist, Master Practitioner of NLP, and Board-certified Hypnotherapist. She helps
              individuals and teams understand their internal patterns, release outdated beliefs, and
              redesign their thinking so they can move through life with more clarity, confidence, and
              calm.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to={createPageUrl("Contact")}
                className="group inline-flex items-center justify-center gap-3 px-6 py-3 bg-[#1E3A32] text-[#F9F5EF] text-sm tracking-wide hover:bg-[#2B2725] transition-all duration-300"
              >
                Work With Roberta
              </Link>
              <Link
                to={createPageUrl("Certification")}
                className="group inline-flex items-center justify-center gap-3 px-6 py-3 border border-[#D8B46B] text-[#1E3A32] text-sm tracking-wide hover:bg-[#D8B46B]/10 transition-all duration-300"
              >
                Explore The Mind Styling Certification™
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Back Link */}
      <section className="py-12 bg-[#F9F5EF]">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <Link
            to={createPageUrl("Blog")}
            className="group inline-flex items-center gap-2 text-[#1E3A32] hover:text-[#D8B46B] transition-colors"
          >
            <ArrowLeft
              size={16}
              className="group-hover:-translate-x-1 transition-transform"
            />
            Back to The Mind Styling Journal
          </Link>
        </div>
      </section>
    </div>
  );
}