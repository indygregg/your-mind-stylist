import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { ShoppingCart, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

// Parse product_id which can be: a string ID, a JSON-encoded array string, or an actual array
function parseProductIds(productId) {
  if (!productId) return [];
  if (Array.isArray(productId)) return productId;
  if (typeof productId === 'string' && productId.startsWith('[')) {
    try { return JSON.parse(productId); } catch (e) { return [productId]; }
  }
  return [productId];
}

export default function BookPurchaseOptions({
  product,
  productId,
  ctaLabel = "Buy Now",
  onAddToCart,
  defaultSelected = null,
  quiz = null,
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
          // Handle product_id: could be a string ID, a JSON-encoded array, or already an array
          const productIds = parseProductIds(option.product_id);
          // Also fetch the bundle product if it exists
          const allIds = [...productIds];
          if (option.bundle_product_id) allIds.push(option.bundle_product_id);
          for (const pid of allIds) {
            if (!pid) continue;
            const prods = await base44.entities.Product.filter({ id: pid });
            if (prods[0]) {
              variants[pid] = prods[0];
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
    .filter((opt) => {
      if (opt.enabled === false) return false;
      // For bundle options with a bundle_product_id, check that
      if (opt.type === 'bundle' && opt.bundle_product_id) {
        return !!variantProducts[opt.bundle_product_id];
      }
      // For arrays (bundles without bundle_product_id), check if products are loaded
      const ids = parseProductIds(opt.product_id);
      if (ids.length > 1) {
        return ids.every(id => variantProducts[id]);
      }
      // For single products, check if it's loaded
      return ids.length > 0 && variantProducts[ids[0]];
    })
    .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));

  // Don't auto-select - let user choose

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

  // If no parent product yet, show loading
  if (!parentProduct) {
    return <div className="py-4 text-sm text-gray-500">Loading...</div>;
  }

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
          {ctaLabel} — ${price}
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
    const ids = parseProductIds(option.product_id);
    const variant = (option.type === 'bundle' && option.bundle_product_id)
      ? variantProducts[option.bundle_product_id]
      : variantProducts[ids[0]];
    const rawPrice = (option.type === 'bundle' && option.bundle_price) ? option.bundle_price : variant?.price;
    const price = rawPrice ? (rawPrice / 100).toFixed(2) : "0.00";
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
              <div className="text-2xl font-bold text-[#1E3A32]">${price}</div>
              {comparePrice && comparePrice !== price && (
                <div className="text-sm text-gray-500 line-through">${comparePrice}</div>
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

  // Multiple options: show as radio list
  const selectedOption = enabledOptions.find(opt => {
    if (opt.type === 'bundle' && opt.bundle_product_id) return selectedProductId === opt.bundle_product_id;
    const pids = parseProductIds(opt.product_id);
    return selectedProductId === pids[0];
  });
  const selectedProductIds = selectedOption
    ? (selectedOption.type === 'bundle' && selectedOption.bundle_product_id ? [selectedOption.bundle_product_id] : parseProductIds(selectedOption.product_id))
    : [];
  const selectedVariantForDropdown = selectedProductIds[0] ? variantProducts[selectedProductIds[0]] : null;
  const selectedPrice = selectedVariantForDropdown?.price ? (selectedVariantForDropdown.price / 100).toFixed(2) : "0.00";

  const handleTakeQuiz = () => {
    if (quiz?.slug) {
      window.location.href = `/quiz/${quiz.slug}`;
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {enabledOptions.map((option) => {
          const productIds = (option.type === 'bundle' && option.bundle_product_id)
            ? [option.bundle_product_id]
            : parseProductIds(option.product_id);
          const variant = variantProducts[productIds[0]];
          const rawPrice = (option.type === 'bundle' && option.bundle_price) ? option.bundle_price : variant?.price;
          const price = rawPrice ? (rawPrice / 100).toFixed(2) : "0.00";
          const comparePrice = variant?.compare_at_price ? (variant.compare_at_price / 100).toFixed(2) : null;
          const isSelected = selectedProductId === productIds[0];
          
          return (
            <label key={productIds[0]} className="flex items-center gap-3 p-4 border border-[#E4D9C4] rounded-lg cursor-pointer hover:border-[#D8B46B] hover:bg-[#F9F5EF]/50 transition-all" style={{ borderColor: isSelected ? '#D8B46B' : '#E4D9C4', backgroundColor: isSelected ? '#1E3A32/5' : 'white' }}>
              <input
                type="radio"
                name="format"
                value={productIds[0]}
                checked={isSelected}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="w-5 h-5 cursor-pointer accent-[#D8B46B]"
              />
              <div className="flex-1">
                <div className="font-semibold text-[#1E3A32]">{option.display_label}</div>
                {option.badge && (
                  <div className="text-xs bg-[#D8B46B]/20 text-[#D8B46B] px-2 py-1 rounded mt-1 inline-block">
                    {option.badge}
                  </div>
                )}
              </div>
              <div className="text-right flex-shrink-0">
                <div className="font-bold text-[#1E3A32]">${price}</div>
                {comparePrice && comparePrice !== price && (
                  <div className="text-xs text-gray-500 line-through">${comparePrice}</div>
                )}
              </div>
            </label>
          );
        })}
      </div>

      {selectedOption && (
        <div className="bg-white border border-[#E4D9C4] p-4 rounded-lg">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-[#1E3A32]">{selectedOption.display_label}</h3>
              {selectedOption.badge && (
                <span className="text-xs bg-[#D8B46B]/20 text-[#D8B46B] px-2 py-1 rounded mt-1 inline-block">
                  {selectedOption.badge}
                </span>
              )}
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-[#1E3A32]">${selectedPrice}</div>
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-3">
        <Button
          onClick={handleAddToCart}
          disabled={isAdding || !selectedVariant}
          className="flex-1 bg-[#1E3A32] hover:bg-[#2B2725] text-white py-6"
        >
          {isAdding ? <Loader2 size={18} className="animate-spin mr-2" /> : null}
          <ShoppingCart size={18} className="mr-2" />
          {ctaLabel}
        </Button>
        {quiz && (
          <Button
            onClick={handleTakeQuiz}
            variant="outline"
            className="px-8 py-6 border-[#1E3A32] text-[#1E3A32] hover:bg-[#1E3A32]/5"
          >
            Take the Quiz →
          </Button>
        )}
      </div>
    </div>
  );
}