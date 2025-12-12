import React, { useState } from "react";
import SEO from "../components/SEO";
import { Link } from "react-router-dom";
import { createPageUrl } from "../utils";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, Clock, Tag } from "lucide-react";
import CmsText from "../components/cms/CmsText";

export default function Blog() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = [
    "All",
    "Monday Mentions",
    "Thursday Thoughts",
    "Emotional Intelligence",
    "Communication",
    "Leadership & Teams",
    "Identity & Confidence",
    "Stress & Regulation",
    "Relationships",
    "Inner Rehearsal",
  ];

  const featuredPost = {
    category: "Thursday Thoughts",
    title: "The Stories You Tell Yourself About Who You Are",
    excerpt:
      "Most of us live inside narratives we didn't consciously write. We carry stories about who we are, what we're capable of, and what we deserve — and those stories shape everything.",
    readTime: 5,
    slug: "stories-you-tell-yourself",
    date: "Dec 5, 2024",
  };

  const latestPosts = [
    {
      category: "Monday Mentions",
      title: "One Question to Start Your Week With",
      excerpt: "Before the week starts pulling you forward, ask yourself: What story am I telling myself about this week?",
      readTime: 3,
      slug: "question-to-start-week",
      date: "Dec 9, 2024",
    },
    {
      category: "Emotional Intelligence",
      title: "Emotional Intelligence Isn't About Being Nice",
      excerpt: "Emotional intelligence is often misunderstood as being soft, agreeable, or perpetually calm. But that's not what it is.",
      readTime: 6,
      slug: "ei-not-being-nice",
      date: "Dec 3, 2024",
    },
    {
      category: "Communication",
      title: "How to Say What You Mean Without Apologizing for It",
      excerpt: "If you find yourself softening every sentence, over-explaining your position, or apologizing before you even begin — this is for you.",
      readTime: 5,
      slug: "say-what-you-mean",
      date: "Nov 28, 2024",
    },
    {
      category: "Identity & Confidence",
      title: "The Confidence Myth: Why Waiting to Feel Ready Keeps You Stuck",
      excerpt: "Confidence doesn't arrive before action. It builds because of action.",
      readTime: 4,
      slug: "confidence-myth",
      date: "Nov 21, 2024",
    },
    {
      category: "Leadership & Teams",
      title: "The Silent Patterns That Shape Team Culture",
      excerpt: "Culture isn't built by vision statements. It's built by the unspoken patterns that repeat every day.",
      readTime: 7,
      slug: "silent-patterns-team-culture",
      date: "Nov 14, 2024",
    },
    {
      category: "Thursday Thoughts",
      title: "What If You Stopped Proving and Started Being?",
      excerpt: "A reflective note to carry into your weekend: What would change if you stopped trying to prove yourself?",
      readTime: 4,
      slug: "stopped-proving",
      date: "Nov 7, 2024",
    },
  ];

  const filteredPosts =
    selectedCategory === "All"
      ? latestPosts
      : latestPosts.filter((post) => post.category === selectedCategory);

  return (
    <div className="bg-[#F9F5EF]">
      <SEO
        title="Your Mind Styling Journal | Articles & Reflections"
        description="Your Mind Styling Journal offers weekly articles, Monday Mentions, and Thursday Thoughts on mindset, emotional intelligence, and inner pattern shifts."
        canonical="/blog"
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
              <CmsText 
                contentKey="blog.hero.subtitle" 
                page="Blog"
                blockTitle="Hero Subtitle"
                fallback="Your Mind Styling Journal" 
                contentType="short_text"
              />
            </span>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-[#1E3A32] leading-tight mb-6">
              <CmsText 
                contentKey="blog.hero.title" 
                page="Blog"
                blockTitle="Hero Title"
                fallback='Articles, Thoughts & Tools<br /><span class="italic text-[#6E4F7D]">for a Calmer, Clearer Mind</span>' 
                contentType="rich_text"
              />
            </h1>
            <p className="text-[#2B2725]/80 text-lg leading-relaxed mb-8 max-w-3xl mx-auto">
              <CmsText 
                contentKey="blog.hero.description" 
                page="Blog"
                blockTitle="Hero Description"
                fallback="Weekly reflections, tools, and perspectives to help you understand your patterns, soften your internal dialogue, and think from where you want to be." 
                contentType="rich_text"
              />
            </p>
            <p className="text-[#2B2725]/70 text-lg mb-10">
              <CmsText 
                contentKey="blog.hero.tagline" 
                page="Blog"
                blockTitle="Hero Tagline"
                fallback="This is where I share short ideas, deeper essays, and practical tools about emotional intelligence, mindset, communication, and identity.<br />Come here when you want to think differently — gently." 
                contentType="rich_text"
              />
            </p>
            <a
              href="#latest"
              className="group inline-flex items-center gap-3 px-8 py-4 bg-[#1E3A32] text-[#F9F5EF] text-sm tracking-wide hover:bg-[#2B2725] transition-all duration-300"
            >
              Read the Latest
              <ArrowRight
                size={16}
                className="group-hover:translate-x-1 transition-transform"
              />
            </a>
          </motion.div>
        </div>
      </section>

      {/* Category Filters */}
      <section id="filters" className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-serif text-2xl text-[#1E3A32] mb-6 text-center">
              <CmsText 
                contentKey="blog.filters.title" 
                page="Blog"
                blockTitle="Filter Section Title"
                fallback="Explore by Theme" 
                contentType="short_text"
              />
            </h2>
            <div className="flex flex-wrap justify-center gap-3">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-5 py-2 text-sm tracking-wide transition-all duration-300 ${
                    selectedCategory === category
                      ? "bg-[#1E3A32] text-[#F9F5EF]"
                      : "bg-[#F9F5EF] text-[#2B2725] hover:bg-[#E4D9C4]"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Post */}
      <section id="featured" className="py-20 bg-[#F9F5EF]">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-serif text-3xl text-[#1E3A32] mb-10">
              <CmsText 
                contentKey="blog.featured.title" 
                page="Blog"
                blockTitle="Featured Section Title"
                fallback="Featured" 
                contentType="short_text"
              />
            </h2>
            <div className="bg-white p-10 md:p-12 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-[#D8B46B]/20 text-[#2B2725] text-xs tracking-wide uppercase">
                  {featuredPost.category}
                </span>
                <div className="flex items-center gap-2 text-[#2B2725]/60 text-sm">
                  <Calendar size={14} />
                  {featuredPost.date}
                </div>
                <div className="flex items-center gap-2 text-[#2B2725]/60 text-sm">
                  <Clock size={14} />
                  {featuredPost.readTime} min read
                </div>
              </div>
              <h3 className="font-serif text-3xl md:text-4xl text-[#1E3A32] mb-4 leading-tight">
                {featuredPost.title}
              </h3>
              <p className="text-[#2B2725]/80 text-lg leading-relaxed mb-6">
                {featuredPost.excerpt}
              </p>
              <Link
                to={createPageUrl(`BlogPost?slug=${featuredPost.slug}`)}
                className="group inline-flex items-center gap-2 text-[#1E3A32] font-medium hover:gap-3 transition-all"
              >
                Read Article
                <ArrowRight
                  size={16}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Latest Posts */}
      <section id="latest" className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-serif text-3xl md:text-4xl text-[#1E3A32] mb-12">
              {selectedCategory === "All" ? "Latest Posts" : selectedCategory}
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post, index) => (
                <motion.div
                  key={post.slug}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-[#F9F5EF] p-8 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1 bg-white text-[#2B2725] text-xs tracking-wide uppercase">
                      {post.category}
                    </span>
                  </div>
                  <h3 className="font-serif text-xl text-[#1E3A32] mb-3 leading-tight">
                    {post.title}
                  </h3>
                  <p className="text-[#2B2725]/70 leading-relaxed mb-4">{post.excerpt}</p>
                  <div className="flex items-center gap-4 text-[#2B2725]/60 text-sm mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      {post.date}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={14} />
                      {post.readTime} min
                    </div>
                  </div>
                  <Link
                    to={createPageUrl(`BlogPost?slug=${post.slug}`)}
                    className="group inline-flex items-center gap-2 text-[#1E3A32] font-medium hover:gap-3 transition-all"
                  >
                    Read
                    <ArrowRight
                      size={16}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Monday Mentions */}
      <section className="py-20 bg-[#A6B7A3]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-serif text-3xl md:text-4xl text-[#F9F5EF] mb-6">
              <CmsText 
                contentKey="blog.monday.title" 
                page="Blog"
                blockTitle="Monday Mentions Title"
                fallback="Monday Mentions" 
                contentType="short_text"
              />
            </h2>
            <p className="text-[#F9F5EF]/90 text-lg leading-relaxed mb-8">
              <CmsText 
                contentKey="blog.monday.description" 
                page="Blog"
                blockTitle="Monday Mentions Description"
                fallback="Short, focused pieces to help you begin your week with one clear thought, question, or tool." 
                contentType="rich_text"
              />
            </p>
            <button
              onClick={() => setSelectedCategory("Monday Mentions")}
              className="group inline-flex items-center gap-3 px-8 py-4 bg-[#F9F5EF] text-[#1E3A32] text-sm tracking-wide hover:bg-white transition-all duration-300"
            >
              See Monday Mentions
              <ArrowRight
                size={16}
                className="group-hover:translate-x-1 transition-transform"
              />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Thursday Thoughts */}
      <section className="py-20 bg-[#6E4F7D]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-serif text-3xl md:text-4xl text-[#F9F5EF] mb-6">
              <CmsText 
                contentKey="blog.thursday.title" 
                page="Blog"
                blockTitle="Thursday Thoughts Title"
                fallback="Thursday Thoughts" 
                contentType="short_text"
              />
            </h2>
            <p className="text-[#F9F5EF]/90 text-lg leading-relaxed mb-8">
              <CmsText 
                contentKey="blog.thursday.description" 
                page="Blog"
                blockTitle="Thursday Thoughts Description"
                fallback="A reflective note to carry into the weekend — something to notice, try on, or gently shift in your internal world." 
                contentType="rich_text"
              />
            </p>
            <button
              onClick={() => setSelectedCategory("Thursday Thoughts")}
              className="group inline-flex items-center gap-3 px-8 py-4 bg-[#F9F5EF] text-[#1E3A32] text-sm tracking-wide hover:bg-white transition-all duration-300"
            >
              See Thursday Thoughts
              <ArrowRight
                size={16}
                className="group-hover:translate-x-1 transition-transform"
              />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Work With Me */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-[#1E3A32] mb-8">
              <CmsText 
                contentKey="blog.cta.title" 
                page="Blog"
                blockTitle="CTA Title"
                fallback="Want to Take This Work Deeper?" 
                contentType="short_text"
              />
            </h2>
            <p className="text-[#2B2725]/80 text-lg leading-relaxed mb-10">
              <CmsText 
                contentKey="blog.cta.description" 
                page="Blog"
                blockTitle="CTA Description"
                fallback="If something you read here resonates, there are several ways we can work together:" 
                contentType="rich_text"
              />
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
              <Link
                to={createPageUrl("Certification")}
                className="text-[#1E3A32] hover:text-[#D8B46B] transition-colors"
              >
                The Mind Styling Certification™
              </Link>
              <span className="hidden sm:block text-[#2B2725]/30">•</span>
              <Link
                to={createPageUrl("PrivateSessions")}
                className="text-[#1E3A32] hover:text-[#D8B46B] transition-colors"
              >
                Private Mind Styling (1:1)
              </Link>
              <span className="hidden sm:block text-[#2B2725]/30">•</span>
              <Link
                to={createPageUrl("InnerRehearsal")}
                className="text-[#1E3A32] hover:text-[#D8B46B] transition-colors"
              >
                The Inner Rehearsal Sessions™
              </Link>
            </div>

            <Link
              to={createPageUrl("Contact")}
              className="group inline-flex items-center gap-3 px-8 py-4 bg-[#1E3A32] text-[#F9F5EF] text-sm tracking-wide hover:bg-[#2B2725] transition-all duration-300"
            >
              Explore Ways to Work With Me
              <ArrowRight
                size={16}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}