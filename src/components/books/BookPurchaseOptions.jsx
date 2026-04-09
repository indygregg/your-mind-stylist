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
          // Handle both single product_id and arrays (for bundles)
          const productIds = Array.isArray(option.product_id) ? option.product_id : (option.product_id ? [option.product_id] : []);
          for (const productId of productIds) {
            const prods = await base44.entities.Product.filter({ id: productId });
            if (prods[0]) {
              variants[productId] = prods[0];
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
      // For arrays (bundles), check if all products are loaded
      if (Array.isArray(opt.product_id)) {
        return opt.product_id.length > 0 && opt.product_id.every(id => variantProducts[id]);
      }
      // For single products, check if it's loaded
      return variantProducts[opt.product_id];
    })
    .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));

  // Set default selection if not already set
  React.useEffect(() => {
    if (!selectedProductId && enabledOptions.length > 0) {
      const firstOption = enabledOptions[0];
      // For arrays (bundles), use the first product ID; for single, use the product_id
      const defaultId = Array.isArray(firstOption.product_id) ? firstOption.product_id[0] : firstOption.product_id;
      setSelectedProductId(defaultId);
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

  // Multiple options: show as dropdown
  const selectedOption = enabledOptions.find(opt => {
    const productIds = Array.isArray(opt.product_id) ? opt.product_id : [opt.product_id];
    return selectedProductId === productIds[0];
  });
  const selectedProductIds = selectedOption ? (Array.isArray(selectedOption.product_id) ? selectedOption.product_id : [selectedOption.product_id]) : [];
  const selectedVariantForDropdown = selectedProductIds[0] ? variantProducts[selectedProductIds[0]] : null;
  const selectedPrice = selectedVariantForDropdown?.price ? (selectedVariantForDropdown.price / 100).toFixed(2) : "0.00";

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-[#1E3A32]">Select Format</label>
        <select
          value={selectedProductId || ""}
          onChange={(e) => setSelectedProductId(e.target.value)}
          className="w-full px-4 py-3 border border-[#E4D9C4] rounded-lg bg-white text-[#1E3A32] font-medium hover:border-[#D8B46B] transition-colors focus:outline-none focus:ring-2 focus:ring-[#D8B46B] focus:ring-offset-2"
        >
          <option value="">Choose a format...</option>
          {enabledOptions.map((option) => {
            const productIds = Array.isArray(option.product_id) ? option.product_id : [option.product_id];
            const variant = variantProducts[productIds[0]];
            const price = variant?.price ? (variant.price / 100).toFixed(2) : "0.00";
            return (
              <option key={productIds[0]} value={productIds[0]}>
                {option.display_label} — €{price}
              </option>
            );
          })}
        </select>
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
              <div className="text-2xl font-bold text-[#1E3A32]">€{selectedPrice}</div>
            </div>
          </div>
        </div>
      )}

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