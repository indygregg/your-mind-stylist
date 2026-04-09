import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { ShoppingCart, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BookPurchaseOptions({
  product,
  productId,
  ctaLabel = "Buy Now",
  onAddToCart,
  defaultSelected = null,
}) {
  // Fetch the parent product if only productId is provided
  const { data: fetchedProduct } = useQuery({
    queryKey: ["book-product", productId],
    queryFn: async () => {
      if (!productId) return null;
      const prods = await base44.entities.Product.filter({ id: productId });
      return prods[0] || null;
    },
    enabled: !!productId && !product,
  });

  const parentProduct = product || fetchedProduct;

  // If no parent product yet, show loading
  if (!parentProduct) {
    return <div className="py-4 text-sm text-gray-500">Loading...</div>;
  }
  const [selectedProductId, setSelectedProductId] = useState(defaultSelected);
  const [isAdding, setIsAdding] = useState(false);

  // Load all variant products
  const { data: variantProducts = {}, isLoading: variantsLoading } = useQuery({
    queryKey: ["book-variants", parentProduct?.id],
    queryFn: async () => {
      if (!parentProduct?.id) return {};
      
      // If purchase_options are configured, fetch those variants
      if (parentProduct?.purchase_options && parentProduct.purchase_options.length > 0) {
        const variants = {};
        for (const option of parentProduct.purchase_options) {
          if (option.product_id) {
            const prods = await base44.entities.Product.filter({ id: option.product_id });
            if (prods[0]) {
              variants[option.product_id] = prods[0];
            }
          }
        }
        return variants;
      }
      
      // Fallback: If no purchase_options, try to fetch products with same slug
      // This is for products that have variants but haven't configured purchase_options
      return {};
    },
    enabled: !!parentProduct?.id,
  });

  // Filter enabled options and sort
  const enabledOptions = (parentProduct?.purchase_options || [])
    .filter((opt) => (opt.enabled !== false) && variantProducts[opt.product_id])
    .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));

  // Set default selection if not already set
  React.useEffect(() => {
    if (!selectedProductId && enabledOptions.length > 0) {
      setSelectedProductId(enabledOptions[0].product_id);
    }
  }, [enabledOptions, selectedProductId]);

  const selectedVariant = selectedProductId ? variantProducts[selectedProductId] : null;

  const handleAddToCart = async () => {
    if (!selectedVariant) return;
    setIsAdding(true);
    try {
      if (onAddToCart) {
        await onAddToCart(selectedVariant);
      } else {
        // Default: trigger checkout
        const response = await base44.functions.invoke("createProductCheckout", {
          product_id: selectedVariant.id,
        });
        if (response.data?.url) {
          window.location.href = response.data.url;
        }
      }
    } finally {
      setIsAdding(false);
    }
  };

  if (variantsLoading) {
    return <div className="py-4 text-sm text-gray-500">Loading options...</div>;
  }

  if (enabledOptions.length === 0) {
    // Fallback: if no options configured, show simple button for the product itself
    if (parentProduct?.price) {
      const price = (parentProduct.price / 100).toFixed(2);
      return (
        <Button
          onClick={handleAddToCart}
          disabled={isAdding}
          className="w-full bg-[#1E3A32] hover:bg-[#2B2725] text-white py-6"
        >
          {isAdding ? <Loader2 size={18} className="animate-spin mr-2" /> : null}
          <ShoppingCart size={18} className="mr-2" />
          {ctaLabel} — €{price}
        </Button>
      );
    }
    return (
      <div className="py-8 text-center text-gray-500">
        No purchase options available.
      </div>
    );
  }

  // If only one option, show simplified display
  if (enabledOptions.length === 1) {
    const option = enabledOptions[0];
    const variant = variantProducts[option.product_id];
    const price = variant?.price ? (variant.price / 100).toFixed(2) : "0.00";
    const comparePrice = variant?.compare_at_price
      ? (variant.compare_at_price / 100).toFixed(2)
      : null;
    const savings = comparePrice ? (
      <span className="text-sm text-green-600">
        Save €{(comparePrice - price).toFixed(2)}
      </span>
    ) : null;

    return (
      <div className="space-y-4">
        <div className="bg-white border border-[#E4D9C4] p-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-semibold text-[#1E3A32]">{option.display_label}</h3>
              {option.badge && (
                <span className="text-xs bg-[#D8B46B]/20 text-[#D8B46B] px-2 py-1 rounded mt-1 inline-block">
                  {option.badge}
                </span>
              )}
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-[#1E3A32]">€{price}</div>
              {comparePrice && comparePrice !== price && (
                <div className="text-sm text-gray-500 line-through">€{comparePrice}</div>
              )}
            </div>
          </div>
          {savings}
        </div>

        <Button
          onClick={handleAddToCart}
          disabled={isAdding}
          className="w-full bg-[#1E3A32] hover:bg-[#2B2725] text-white py-6"
        >
          {isAdding ? <Loader2 size={18} className="animate-spin mr-2" /> : null}
          <ShoppingCart size={18} className="mr-2" />
          {ctaLabel}
        </Button>
      </div>
    );
  }

  // Multiple options: show as selectable cards
  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {enabledOptions.map((option) => {
          const variant = variantProducts[option.product_id];
          const price = variant?.price ? (variant.price / 100).toFixed(2) : "0.00";
          const comparePrice = variant?.compare_at_price
            ? (variant.compare_at_price / 100).toFixed(2)
            : null;
          const isSelected = selectedProductId === option.product_id;

          return (
            <button
              key={option.product_id}
              onClick={() => setSelectedProductId(option.product_id)}
              className={`w-full text-left border-2 p-4 rounded-lg transition-all ${
                isSelected
                  ? "border-[#1E3A32] bg-[#1E3A32]/5"
                  : "border-[#E4D9C4] bg-white hover:border-[#D8B46B]"
              }`}
            >
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-[#1E3A32]">{option.display_label}</h3>
                  {option.badge && (
                    <span className="text-xs bg-[#D8B46B]/20 text-[#D8B46B] px-2 py-1 rounded mt-1 inline-block">
                      {option.badge}
                    </span>
                  )}
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-lg font-bold text-[#1E3A32]">€{price}</div>
                  {comparePrice && comparePrice !== price && (
                    <div className="text-sm text-gray-500 line-through">€{comparePrice}</div>
                  )}
                </div>
              </div>
              {isSelected && (
                <div className="mt-2 text-xs text-[#D8B46B] font-medium">✓ Selected</div>
              )}
            </button>
          );
        })}
      </div>

      <Button
        onClick={handleAddToCart}
        disabled={isAdding || !selectedVariant}
        className="w-full bg-[#1E3A32] hover:bg-[#2B2725] text-white py-6"
      >
        {isAdding ? <Loader2 size={18} className="animate-spin mr-2" /> : null}
        <ShoppingCart size={18} className="mr-2" />
        {ctaLabel}
      </Button>
    </div>
  );
}