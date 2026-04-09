import React from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { motion } from "framer-motion";
import { ArrowRight, ShoppingCart, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import BookCover3D from "../components/books/BookCover3D";
import SEO from "../components/SEO";

const formatPrice = (price) => `$${(price / 100).toFixed(2)}`;

export default function BookLanding() {
  const { slug } = useParams();

  const { data: book, isLoading } = useQuery({
    queryKey: ["book-landing", slug],
    queryFn: async () => {
      const products = await base44.entities.Product.filter({ slug, product_subtype: "book" });
      return products[0] || null;
    },
    enabled: !!slug,
  });

  const handlePurchase = async () => {
    if (!book) return;
    const response = await base44.functions.invoke("createProductCheckout", { product_id: book.id });
    if (response.data?.url) window.location.href = response.data.url;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F9F5EF] flex items-center justify-center">
        <Loader2 className="animate-spin text-[#D8B46B]" size={40} />
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-[#F9F5EF] flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-serif text-2xl text-[#1E3A32] mb-4">Book not found</h2>
          <Link to="/Books"><Button variant="outline">Back to Books</Button></Link>
        </div>
      </div>
    );
  }

  const coverImage = book.book_cover_image || book.thumbnail;
  const quizSlug = slug; // quiz route mirrors book slug

  return (
    <div className="min-h-screen bg-[#F9F5EF]">
      <SEO
        title={`${book.name} | Your Mind Stylist`}
        description={book.short_description}
        image={coverImage}
      />

      {/* Section 1 — Hero */}
      <section className="pt-28 pb-20 bg-[#F9F5EF]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              className="flex justify-center"
            >
              {coverImage ? (
                <BookCover3D imageUrl={coverImage} title={book.name} size="lg" />
              ) : (
                <div className="w-[240px] h-[320px] bg-[#E4D9C4] rounded flex items-center justify-center text-[#2B2725]/40 text-sm">
                  No cover image
                </div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              {book.tagline && (
                <p className="text-[#D8B46B] text-sm tracking-[0.2em] uppercase mb-3 font-medium">
                  {book.tagline}
                </p>
              )}
              <h1 className="font-serif text-4xl md:text-5xl text-[#1E3A32] mb-6 leading-tight">
                {book.name}
              </h1>
              {book.short_description && (
                <p className="text-[#2B2725]/80 text-lg leading-relaxed mb-8">
                  {book.short_description}
                </p>
              )}
              {book.price && (
                <div className="mb-8">
                  <span className="font-serif text-4xl text-[#D8B46B] font-bold">
                    {formatPrice(book.price)}
                  </span>
                </div>
              )}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={handlePurchase}
                  className="bg-[#1E3A32] hover:bg-[#2B2725] text-white px-8 py-6 text-base"
                >
                  <ShoppingCart size={18} className="mr-2" />
                  Buy the Book
                </Button>
                <Link to={`/quiz/${quizSlug}`}>
                  <Button variant="outline" className="border-[#D8B46B] text-[#1E3A32] hover:bg-[#D8B46B]/10 px-8 py-6 text-base w-full">
                    Take the Quiz
                    <ArrowRight size={16} className="ml-2" />
                  </Button>
                </Link>
              </div>
              {book.features && book.features.length > 0 && (
                <ul className="mt-8 space-y-2">
                  {book.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-2 text-[#2B2725]/80 text-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#D8B46B] flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section 2 — Emotional Hook */}
      {book.long_description && (
        <section className="py-20 bg-white">
          <div className="max-w-3xl mx-auto px-6">
            <h2 className="font-serif text-3xl text-[#1E3A32] mb-8 text-center">About the Book</h2>
            <div
              className="prose prose-lg max-w-none text-[#2B2725]/80 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: book.long_description }}
            />
          </div>
        </section>
      )}

      {/* Section 3 — Quiz CTA Block */}
      <section className="py-20 bg-[#1E3A32]">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-[#D8B46B] text-xs tracking-[0.3em] uppercase mb-4">Self-Discovery</p>
            <h2 className="font-serif text-3xl md:text-4xl text-white mb-6">
              Which Archetype Leads Your Life?
            </h2>
            <p className="text-white/70 text-lg mb-10 leading-relaxed">
              In less than 3 minutes, discover the pattern you return to most — and how it shapes your relationships, work style, emotional habits, and growth.
            </p>
            <Link to={`/quiz/${quizSlug}`}>
              <Button className="bg-[#D8B46B] hover:bg-[#C5A35B] text-[#1E3A32] px-10 py-6 text-base font-semibold">
                Start the Quiz
                <ArrowRight size={16} className="ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Section 4 — Reviews */}
      {book.book_reviews && book.book_reviews.length > 0 && (
        <section className="py-20 px-6 bg-[#F9F5EF]">
          <div className="max-w-5xl mx-auto">
            <h2 className="font-serif text-3xl text-[#1E3A32] mb-12 text-center">What Readers Are Saying</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {book.book_reviews.map((review, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white p-6 border border-[#E4D9C4]"
                >
                  <p className="text-[#2B2725]/80 italic leading-relaxed text-sm mb-4">"{review.quote}"</p>
                  <p className="font-medium text-[#1E3A32] text-sm">{review.reviewer}</p>
                  {review.reviewer_title && (
                    <p className="text-[#2B2725]/50 text-xs mt-0.5">{review.reviewer_title}</p>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Section 5 — Final CTA */}
      <section className="py-20 bg-[#D8B46B]/10 border-t border-[#D8B46B]/20">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="font-serif text-3xl text-[#1E3A32] mb-4">
            Read the book. Discover your archetype. Restyle your mindset.
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Button
              onClick={handlePurchase}
              className="bg-[#1E3A32] hover:bg-[#2B2725] text-white px-10 py-6 text-base"
            >
              <ShoppingCart size={18} className="mr-2" />
              Buy the Book{book.price ? ` — ${formatPrice(book.price)}` : ""}
            </Button>
            <Link to={`/quiz/${quizSlug}`}>
              <Button variant="outline" className="border-[#1E3A32] text-[#1E3A32] px-10 py-6 text-base w-full">
                Take the Quiz
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}