import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

export default function CourseSettings({ formData, onChange }) {
  const handleProductToggle = (productId, checked) => {
    const current = formData.product_linkage || [];
    const updated = checked
      ? [...current, productId]
      : current.filter((id) => id !== productId);
    onChange({ ...formData, product_linkage: updated });
  };

  // Mock products - in real app, fetch from Product entity
  const products = [
    { id: "prod_1", name: "Mind Styling Toolkit" },
    { id: "prod_2", name: "Evolution Program" },
    { id: "prod_3", name: "Pocket Visualization" },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="text-center mb-8">
        <h2 className="font-serif text-3xl text-[#1E3A32] mb-3">
          Course Settings
        </h2>
        <p className="text-[#2B2725]/70">
          Configure visibility and access
        </p>
      </div>

      {/* Status */}
      <div>
        <Label className="text-[#2B2725] mb-2 block">Publication Status</Label>
        <Select
          value={formData.status || "draft"}
          onValueChange={(value) => onChange({ ...formData, status: value })}
        >
          <SelectTrigger className="border-[#E4D9C4]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-[#2B2725]/60 mt-1">
          Only published courses are visible to users
        </p>
      </div>

      {/* Visibility */}
      <div>
        <Label className="text-[#2B2725] mb-2 block">Visibility</Label>
        <Select
          value={formData.visibility || "public"}
          onValueChange={(value) => onChange({ ...formData, visibility: value })}
        >
          <SelectTrigger className="border-[#E4D9C4]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="public">Public (all users)</SelectItem>
            <SelectItem value="clients_only">Clients Only</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Product Linkage */}
      <div>
        <Label className="text-[#2B2725] mb-3 block">
          Access Control (Product Linkage)
        </Label>
        <p className="text-sm text-[#2B2725]/70 mb-4">
          Select which products unlock access to this course
        </p>
        <div className="space-y-3 bg-[#F9F5EF] p-4 rounded-lg">
          {products.map((product) => (
            <div key={product.id} className="flex items-center gap-3">
              <Checkbox
                id={product.id}
                checked={(formData.product_linkage || []).includes(product.id)}
                onCheckedChange={(checked) => handleProductToggle(product.id, checked)}
              />
              <label
                htmlFor={product.id}
                className="text-sm text-[#2B2725] cursor-pointer"
              >
                {product.name}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Learning Outcomes */}
      <div>
        <Label className="text-[#2B2725] mb-2 block">
          Learning Outcomes
        </Label>
        <p className="text-sm text-[#2B2725]/70 mb-3">
          What will students learn? (one per line, 3-7 recommended)
        </p>
        <textarea
          value={(formData.learning_outcomes || []).join("\n")}
          onChange={(e) =>
            onChange({
              ...formData,
              learning_outcomes: e.target.value.split("\n").filter((line) => line.trim()),
            })
          }
          className="w-full border border-[#E4D9C4] rounded-lg p-3 min-h-[120px]"
          placeholder="Learn to recognize emotional triggers&#10;Develop self-awareness practices&#10;Build resilience through mindful reflection"
        />
      </div>
    </div>
  );
}