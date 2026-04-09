import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Copy } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";

export default function PurchaseOptionsEditor({ options = [], onChange, currentProductId }) {
  const { data: allProducts = [] } = useQuery({
    queryKey: ["products"],
    queryFn: () => base44.entities.Product.list("-created_date"),
  });

  // Filter out current product from available variants
  const availableProducts = allProducts.filter(p => p.id !== currentProductId && p.product_subtype === 'book');

  const handleAddOption = () => {
    const newOption = {
      type: "digital",
      product_id: "",
      enabled: true,
      display_label: "",
      badge: "",
      sort_order: (options?.length || 0),
    };
    onChange([...(options || []), newOption]);
  };

  const handleUpdateOption = (index, field, value) => {
    const updated = [...(options || [])];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const handleRemoveOption = (index) => {
    const updated = options.filter((_, i) => i !== index);
    onChange(updated);
  };

  const getProductName = (productId) => {
    const product = allProducts.find(p => p.id === productId);
    return product?.name || "Unknown Product";
  };

  return (
    <div className="space-y-4 p-4 bg-[#1E3A32]/5 border border-[#1E3A32]/20 rounded-lg">
      <div className="flex items-center justify-between">
        <div>
          <Label className="text-base font-semibold text-[#1E3A32]">Purchase Options (Variants)</Label>
          <p className="text-xs text-[#2B2725]/60 mt-1">Add Digital, Paperback, Bundle, or other purchase formats for this book</p>
        </div>
        <Button
          type="button"
          size="sm"
          onClick={handleAddOption}
          className="bg-[#1E3A32] hover:bg-[#2B2725]"
        >
          <Plus size={14} className="mr-1" />
          Add Variant
        </Button>
      </div>

      {(!options || options.length === 0) && (
        <div className="text-center py-8 bg-white rounded border border-[#E4D9C4] border-dashed">
          <p className="text-sm text-[#2B2725]/60 mb-3">No purchase options configured yet</p>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={handleAddOption}
          >
            <Plus size={14} className="mr-1" />
            Add First Variant
          </Button>
        </div>
      )}

      {options && options.map((option, index) => (
        <div key={index} className="bg-white border border-[#E4D9C4] rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-[#1E3A32]">Variant {index + 1}</span>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => handleRemoveOption(index)}
              className="text-red-600 hover:bg-red-50"
            >
              <Trash2 size={14} />
            </Button>
          </div>

          <div className="grid md:grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Type *</Label>
              <Select
                value={option.type || "digital"}
                onValueChange={(value) => handleUpdateOption(index, "type", value)}
              >
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="digital">📱 Digital</SelectItem>
                  <SelectItem value="physical">📦 Paperback / Physical</SelectItem>
                  <SelectItem value="bundle">🎁 Bundle</SelectItem>
                  <SelectItem value="custom">✨ Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-xs">Related Product *</Label>
              <Select
                value={option.product_id || ""}
                onValueChange={(value) => handleUpdateOption(index, "product_id", value)}
              >
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Select a book variant..." />
                </SelectTrigger>
                <SelectContent>
                  {availableProducts.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name} (${(product.price / 100).toFixed(2)})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {option.product_id && (
                <p className="text-xs text-[#2B2725]/60 mt-1">
                  Selected: {getProductName(option.product_id)}
                </p>
              )}
            </div>
          </div>

          <div>
            <Label className="text-xs">Display Label</Label>
            <Input
              size="sm"
              value={option.display_label || ""}
              onChange={(e) => handleUpdateOption(index, "display_label", e.target.value)}
              placeholder="e.g., 'Digital Book', 'Paperback', 'Bundle Deal'"
              className="h-9 text-sm"
            />
            <p className="text-xs text-[#2B2725]/60 mt-1">How this option appears to customers</p>
          </div>

          <div className="grid md:grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Badge (Optional)</Label>
              <Input
                size="sm"
                value={option.badge || ""}
                onChange={(e) => handleUpdateOption(index, "badge", e.target.value)}
                placeholder="e.g., 'Best Value', 'Most Popular'"
                className="h-9 text-sm"
              />
            </div>

            <div>
              <Label className="text-xs">Display Order</Label>
              <Input
                type="number"
                size="sm"
                value={option.sort_order ?? index}
                onChange={(e) => handleUpdateOption(index, "sort_order", parseInt(e.target.value) || 0)}
                className="h-9 text-sm"
              />
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={option.enabled !== false}
              onChange={(e) => handleUpdateOption(index, "enabled", e.target.checked)}
              className="w-4 h-4"
            />
            <span className="text-sm text-[#1E3A32]">Enabled (show to customers)</span>
          </label>
        </div>
      ))}
    </div>
  );
}