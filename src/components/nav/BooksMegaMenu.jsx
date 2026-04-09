import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { motion, AnimatePresence } from "framer-motion";

export default function BooksMegaMenu({ isOpen, hasDarkHero }) {
  const { data: books = [] } = useQuery({
    queryKey: ["nav-books"],
    queryFn: async () => {
      const all = await base44.entities.Product.filter({ status: "published", product_subtype: "book" });
      return all.sort((a, b) => (a.display_order ?? 999) - (b.display_order ?? 999));
    },
    staleTime: 5 * 60 * 1000,
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.2 }}
          className="absolute top-full left-1/2 -translate-x-1/2 mt-0 bg-white shadow-2xl border-t border-b border-[#E4D9C4] w-[100vw] z-50"
        >
          <div className="max-w-7xl mx-auto px-8 py-8">
            <div className="flex items-start gap-10">
              {books.length === 0 ? (
                <p className="text-[#2B2725]/60 text-sm">No books available yet.</p>
              ) : (
                books.map((book) => {
                  const cover = book.book_cover_image || book.thumbnail;
                  const slugPath = book.slug ? `/book/${book.slug}` : `/Books`;
                  return (
                    <Link key={book.id} to={slugPath} className="group flex flex-col items-center gap-3 max-w-[140px]">
                      {cover ? (
                        <div className="w-[100px] h-[140px] shadow-lg overflow-hidden rounded-sm group-hover:shadow-xl transition-shadow duration-300">
                          <img
                            src={cover}
                            alt={book.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      ) : (
                        <div className="w-[100px] h-[140px] bg-[#E4D9C4] rounded-sm flex items-center justify-center">
                          <span className="text-xs text-[#2B2725]/40">No cover</span>
                        </div>
                      )}
                      <div className="text-center">
                        <p className="text-[#1E3A32] font-medium text-sm group-hover:text-[#D8B46B] transition-colors leading-snug">
                          {book.name}
                        </p>
                        {book.tagline && (
                          <p className="text-[#2B2725]/50 text-xs mt-0.5">{book.tagline}</p>
                        )}
                      </div>
                    </Link>
                  );
                })
              )}
              {/* View All */}
              <div className="ml-auto flex items-center self-center">
                <Link
                  to="/Books"
                  className="text-sm text-[#D8B46B] hover:text-[#1E3A32] transition-colors border-b border-[#D8B46B] pb-0.5 whitespace-nowrap"
                >
                  View All Books →
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}