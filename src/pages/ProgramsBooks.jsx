import React, { useState } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "../utils";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import SEO from "../components/SEO";
import { ArrowLeft, BookOpen, ShoppingCart, Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";

export default function ProgramsBooks() {
  const [checkoutLoading, setCheckoutLoading] = useState(null);

  const handlePurchase = async (bookId) => {
    setCheckoutLoading(bookId);
    const response = await base44.functions.invoke('createProductCheckout', { product_id: bookId });
    if (response.data?.url) {
      window.location.href = response.data.url;
    } else {
      setCheckoutLoading(null);
    }
  };

  const { data: books = [], isLoading } = useQuery({
    queryKey: ["book-products"],
    queryFn: async () => {
      const all = await base44.entities.Product.filter({ 
        status: "published",
        product_subtype: "book"
      });
      return all;
    },
  });

  const formatPrice = (price) => {
    return `$${(price / 100).toFixed(2)}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--brand-cream)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--brand-gold)] mx-auto mb-4"></div>
          <p className="text-[var(--brand-charcoal)]/70">Loading books...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--brand-cream)]">
      <SEO
        title="Books & Resources | Your Mind Stylist"
        description="Deep dives and practical guides for your transformation journey"
      />

      {/* Hero */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-[var(--brand-gold)] to-[#C5A35B] text-[var(--brand-green)]">
        <div className="max-w-6xl mx-auto px-6">
          <Link to={createPageUrl("Programs")} className="inline-flex items-center gap-2 text-[var(--brand-green)]/70 hover:text-[var(--brand-green)] mb-6 transition-colors">
            <ArrowLeft size={18} />
            <span className="text-sm">Back to All Programs</span>
          </Link>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <BookOpen size={40} />
              <h1 className="font-serif text-4xl md:text-5xl">Books & Resources</h1>
            </div>
            <p className="text-xl text-[var(--brand-green)]/90 max-w-3xl">
              Foundational reading to deepen your understanding of Mind Styling principles and emotional intelligence.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Books Grid */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          {books.length === 0 ? (
            <div className="text-center py-20">
              <BookOpen size={64} className="mx-auto mb-4 text-[var(--brand-gold)]/40" />
              <h3 className="font-serif text-2xl text-[var(--brand-green)] mb-2">No Books Available Yet</h3>
              <p className="text-[var(--brand-charcoal)]/70 mb-6">Check back soon for new resources.</p>
              <Link to={createPageUrl("Programs")}>
                <Button variant="outline" className="border-[var(--brand-gold)] text-[var(--brand-gold)]">
                  View All Programs
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {books.map((book) => (
                <motion.div
                  key={book.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="group"
                >
                  <div className="bg-white shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden h-full flex flex-col">
                    {book.thumbnail && (
                      <div className="h-64 overflow-hidden bg-[var(--brand-cream)]">
                        <img
                          src={book.thumbnail}
                          alt={book.name}
                          className="w-full h-full object-contain p-4 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <div className="p-6 flex-1 flex flex-col">
                      <h3 className="font-serif text-xl text-[var(--brand-green)] mb-2">
                        {book.name}
                      </h3>
                      {book.tagline && (
                        <p className="text-sm text-[var(--brand-gold)] mb-3 font-medium">{book.tagline}</p>
                      )}
                      {book.short_description && (
                        <p className="text-sm text-[var(--brand-charcoal)]/70 mb-4 flex-1">
                          {book.short_description}
                        </p>
                      )}
                      
                      <div className="pt-4 border-t border-[var(--brand-sand)] mt-auto">
                        <div className="text-2xl font-bold text-[var(--brand-green)] mb-3">
                          {formatPrice(book.price)}
                        </div>
                        <div className="flex gap-2">
                          {book.slug && (
                            <Link
                              to={createPageUrl(`ProductPage?slug=${book.slug}`)}
                              className="flex-1 text-center text-sm py-2.5 border border-[var(--brand-gold)] text-[var(--brand-gold)] hover:bg-[var(--brand-gold)] hover:text-[var(--brand-green)] transition-colors"
                            >
                              Details
                            </Link>
                          )}
                          <button
                            onClick={() => handlePurchase(book.id)}
                            disabled={checkoutLoading === book.id}
                            className="flex-1 flex items-center justify-center gap-2 text-sm py-2.5 bg-[var(--brand-green)] text-white hover:bg-[var(--brand-charcoal)] transition-colors disabled:opacity-50"
                          >
                            {checkoutLoading === book.id ? (
                              <Loader2 size={16} className="animate-spin" />
                            ) : (
                              <><ShoppingCart size={14} /> Buy Now</>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[var(--brand-green)] text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="font-serif text-3xl mb-4">Transform Your Understanding</h2>
          <p className="text-white/80 mb-8 text-lg">
            These books are designed to complement your journey with practical wisdom and deep insights.
          </p>
          <Link to={createPageUrl("Contact")}>
            <Button variant="outline" className="border-[var(--brand-gold)] text-[var(--brand-gold)] hover:bg-[var(--brand-gold)] hover:text-[var(--brand-green)] px-8 py-6 text-lg">
              Have Questions? Contact Us
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}