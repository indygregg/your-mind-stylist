import React, { useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Star, ShoppingCart, ArrowLeft, Loader2 } from "lucide-react";
import { createPageUrl } from "../utils";
import SEO from "../components/SEO";
import BookCover3D from "../components/books/BookCover3D";
import BookPurchaseOptions from "../components/books/BookPurchaseOptions";

const formatPrice = (price) => {
  const curr = new Intl.NumberFormat('en-EU', {
    style: 'currency',
    currency: 'EUR',
  }).format(price / 100);
  return curr;
};

function StarRating({ stars }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={16}
          className={s <= stars ? "fill-[#D8B46B] text-[#D8B46B]" : "text-[#D8B46B]/30"}
        />
      ))}
    </div>
  );
}

export default function BookProductPage() {
  const { slug } = useParams();

  const { data: book, isLoading } = useQuery({
    queryKey: ["book-product", slug],
    queryFn: async () => {
      const products = await base44.entities.Product.filter({ slug, product_subtype: "book" });
      return products[0] || null;
    },
    enabled: !!slug,
  });

  const { data: quiz } = useQuery({
    queryKey: ["book-quiz", book?.id],
    queryFn: async () => {
      if (!book?.id) return null;
      const quizzes = await base44.entities.Quiz.filter({ related_product_id: book.id });
      return quizzes[0] || null;
    },
    enabled: !!book?.id,
  });

  const handleAddToCart = async (product) => {
    const response = await base44.functions.invoke("createProductCheckout", { product_id: product.id });
    if (response.data?.url) {
      window.location.href = response.data.url;
    }
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
          <Link to={createPageUrl("ProgramsBooks")}>
            <Button variant="outline">Back to Books</Button>
          </Link>
        </div>
      </div>
    );
  }

  const bookOnLeft = !book.book_hero_layout || book.book_hero_layout === "book_left";
  const coverImage = book.book_cover_image || book.thumbnail;
  const reviews = book.book_reviews || [];

  return (
    <div className="min-h-screen bg-[#F9F5EF]">
      <SEO
        title={`${book.name} | Your Mind Stylist`}
        description={book.short_description}
        image={coverImage}
      />

      {/* Hero */}
      <section className="bg-[#F9F5EF] min-h-screen flex items-center py-20">
        <div className="w-full px-6">
          <div className="w-full">
            <Link
              to="/Books"
              className="inline-flex items-center gap-2 text-[#1E3A32]/60 hover:text-[#1E3A32] mb-10 transition-colors text-sm"
            >
              <ArrowLeft size={16} /> Back to Books
            </Link>

            <div className={`grid md:grid-cols-2 gap-20 items-center ${!bookOnLeft ? "md:[&>*:first-child]:order-last" : ""}`}>
              {/* Book Cover */}
              <motion.div
                initial={{ opacity: 0, x: bookOnLeft ? -40 : 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7 }}
                className="flex justify-center"
              >
                {coverImage ? (
                  <BookCover3D imageUrl={coverImage} title={book.name} size="xl" />
                ) : (
                  <div className="w-[320px] h-[480px] bg-[#E4D9C4] rounded flex items-center justify-center text-[#2B2725]/40 text-sm">
                    No cover image
                  </div>
                )}
              </motion.div>

              {/* Book Info */}
              <motion.div
                initial={{ opacity: 0, x: bookOnLeft ? 40 : -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
              >
                {book.tagline && (
                  <p className="text-[#D8B46B] text-sm tracking-[0.2em] uppercase mb-3 font-medium">
                    {book.tagline}
                  </p>
                )}
                <h1 className="font-serif text-5xl md:text-6xl text-[#1E3A32] mb-8 leading-tight">
                  {book.name}
                </h1>
                {book.short_description && (
                  <p className="text-[#2B2725]/80 text-lg leading-relaxed mb-10">
                    {book.short_description}
                  </p>
                )}

              {book.purchase_options && book.purchase_options.length > 0 ? (
                <BookPurchaseOptions
                  product={book}
                  ctaLabel="Get Your Copy"
                  onAddToCart={handleAddToCart}
                  quiz={quiz}
                />
              ) : (
                <div className="bg-white border border-[#E4D9C4] p-6 mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-[#1E3A32]">{book.name}</h3>
                    <div className="text-2xl font-bold text-[#1E3A32]">{formatPrice(book.price)}</div>
                  </div>
                  <Button
                    onClick={() => handleAddToCart(book)}
                    className="w-full bg-[#D8B46B] hover:bg-[#C5A35B] text-[#1E3A32] font-semibold py-6"
                  >
                    <ShoppingCart size={18} className="mr-2" />
                    Get Your Copy
                  </Button>
                </div>
              )}

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
        </div>
      </section>

      {/* Long Description */}
      {book.long_description && (
        <section className="py-20 px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-serif text-3xl text-[#1E3A32] mb-8 text-center">About the Book</h2>
            <div
              className="prose prose-lg max-w-none text-[#2B2725]/80 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: book.long_description }}
            />
          </div>
        </section>
      )}

      {/* Video Section */}
      {book.book_video_embed && (
        <section className="py-20 bg-[#1E3A32]">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="font-serif text-3xl text-white mb-8 text-center">Hear from the Author</h2>
            <div className="aspect-video rounded-lg overflow-hidden shadow-2xl">
              <iframe
                src={book.book_video_embed}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </section>
      )}

      {/* Reviews Section */}
      {reviews.length > 0 && (
        <section className="py-20 px-6 bg-[#F9F5EF]">
          <div className="max-w-5xl mx-auto">
            <h2 className="font-serif text-3xl text-[#1E3A32] mb-12 text-center">What Readers Are Saying</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reviews.map((review, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white p-6 rounded-lg shadow-sm border border-[#E4D9C4]"
                >
                  <StarRating stars={review.stars || 5} />
                  <p className="mt-4 text-[#2B2725]/80 italic leading-relaxed text-sm">
                    "{review.quote}"
                  </p>
                  <div className="mt-4 pt-4 border-t border-[#E4D9C4]">
                    <p className="font-medium text-[#1E3A32] text-sm">{review.reviewer}</p>
                    {review.reviewer_title && (
                      <p className="text-[#2B2725]/50 text-xs mt-0.5">{review.reviewer_title}</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      {book.purchase_options && book.purchase_options.length > 0 && (
        <section className="py-20 bg-[#D8B46B]/10 border-t border-[#D8B46B]/20">
          <div className="max-w-2xl mx-auto px-6">
            <h2 className="font-serif text-3xl text-[#1E3A32] mb-4 text-center">Ready to Begin?</h2>
            <p className="text-[#2B2725]/70 mb-8 text-center">{book.short_description}</p>
            <BookPurchaseOptions
              product={book}
              ctaLabel="Get Your Copy"
              onAddToCart={handleAddToCart}
            />
          </div>
        </section>
      )}
      {!book.purchase_options || book.purchase_options.length === 0 && (
        <section className="py-20 bg-[#D8B46B]/10 border-t border-[#D8B46B]/20">
          <div className="max-w-2xl mx-auto px-6 text-center">
            <h2 className="font-serif text-3xl text-[#1E3A32] mb-4">Ready to Begin?</h2>
            <p className="text-[#2B2725]/70 mb-8">{book.short_description}</p>
            <Button
              onClick={() => handleAddToCart(book)}
              className="bg-[#1E3A32] hover:bg-[#2B2725] text-white px-10 py-6 text-base"
            >
              <ShoppingCart size={18} className="mr-2" />
              Get Your Copy — {formatPrice(book.price)}
            </Button>
          </div>
        </section>
      )}
    </div>
  );
}