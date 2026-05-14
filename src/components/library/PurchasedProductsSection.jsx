import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "../../utils";
import { ShoppingBag, CheckCircle, ChevronDown, ChevronUp } from "lucide-react";

export default function PurchasedProductsSection({ products, expanded, onToggle }) {
  if (!products || products.length === 0) return null;

  return (
    <div className="mb-8">
      <button onClick={onToggle} className="w-full flex items-center justify-between mb-4 group">
        <div className="flex items-center gap-2">
          <ShoppingBag size={20} className="text-[#D8B46B]" />
          <h2 className="font-serif text-xl text-[#1E3A32]">Your Products</h2>
          <Badge className="bg-[#D8B46B]/10 text-[#D8B46B] text-[10px]">{products.length}</Badge>
        </div>
        {expanded ? <ChevronUp className="text-[#D8B46B]" /> : <ChevronDown className="text-[#D8B46B]" />}
      </button>
      {expanded && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <Card key={product.id} className="p-5 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <ShoppingBag size={28} className="text-[#D8B46B]" />
                <Badge className="bg-green-100 text-green-800">
                  <CheckCircle size={12} className="mr-1" />
                  Owned
                </Badge>
              </div>
              {product.thumbnail && (
                <img src={product.thumbnail} alt={product.name} className="w-full h-32 object-cover rounded mb-3" />
              )}
              <h3 className="font-serif text-lg text-[#1E3A32] mb-1">{product.name}</h3>
              {product.tagline && (
                <p className="text-xs text-[#6E4F7D] italic mb-2">{product.tagline}</p>
              )}
              <p className="text-xs text-[#2B2725]/60 mb-3 line-clamp-2">{product.short_description}</p>
              {product.slug && (
                <Link to={createPageUrl(`ProductPage?slug=${product.slug}`)}>
                  <Button variant="outline" className="w-full text-sm border-[#D8B46B] text-[#1E3A32]">
                    View Details
                  </Button>
                </Link>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}