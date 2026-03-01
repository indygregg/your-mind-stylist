import React from "react";
import { ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "../../utils";
import { base44 } from "@/api/base44Client";
import haptics from "@/components/utils/haptics";

export default function ProductCard({ product }) {
  const formatPrice = (price, interval) => {
    if (!price) return "Free";
    const d = (price / 100).toFixed(2);
    if (interval === "monthly") return `$${d}/mo`;
    if (interval === "yearly") return `$${d}/yr`;
    return `$${d}`;
  };

  const handleBuy = async () => {
    haptics.light();
    try {
      const response = await base44.functions.invoke("createProductCheckout", {
        product_ids: [product.id],
      });
      if (response.data?.checkout_url) {
        window.location.href = response.data.checkout_url;
      }
    } catch (error) {
      console.error("Checkout error:", error);
    }
  };

  return (
    <div className="bg-white p-5 border border-[#E4D9C4] flex flex-col">
      <h3 className="font-serif text-base text-[#1E3A32] mb-1">{product.name}</h3>
      {product.tagline && <p className="text-xs text-[#D8B46B] mb-2">{product.tagline}</p>}
      <p className="text-xs text-[#2B2725]/70 mb-3 flex-1 line-clamp-2">{product.short_description}</p>
      <p className="text-lg font-bold text-[#1E3A32] mb-3">{formatPrice(product.price, product.billing_interval)}</p>
      <div className="flex gap-2">
        <Link
          to={createPageUrl(product.slug ? `ProductPage?slug=${product.slug}` : `Programs`)}
          className="flex-1 text-center text-xs py-2 border border-[#1E3A32] text-[#1E3A32] hover:bg-[#1E3A32] hover:text-white transition-colors"
        >
          Details
        </Link>
        <button
          onClick={handleBuy}
          className="flex-1 flex items-center justify-center gap-1 text-xs py-2 bg-[#1E3A32] text-white hover:bg-[#2B2725] transition-colors active:scale-95"
        >
          <ShoppingCart size={12} /> Buy
        </button>
      </div>
    </div>
  );
}