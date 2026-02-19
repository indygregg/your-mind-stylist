import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createPageUrl } from "../utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Edit, Trash2, Eye, EyeOff, DollarSign, Sparkles, RefreshCw, ExternalLink, Download, Upload, Package, BookOpen, Video, GraduationCap, Info } from "lucide-react";
import { toast } from "react-hot-toast";
import ReactQuill from "react-quill";
import BundleCreator from "../components/manager/BundleCreator";

export default function ManagerProducts() {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [bundleDialogOpen, setBundleDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingBundle, setEditingBundle] = useState(null);
  const [syncing, setSyncing] = useState(false);
  const [importing, setImporting] = useState(false);
  const fileInputRef = React.useRef(null);

  const [formData, setFormData] = useState({
    key: "",
    slug: "",
    name: "",
    tagline: "",
    short_description: "",
    long_description: "",
    type: "one_time",
    product_subtype: "",
    category: "foundation",
    price: "",
    currency: "usd",
    billing_interval: "one_time",
    features: [""],
    icon: "",
    color: "#1E3A32",
    status: "draft",
    ui_group: "standard",
    display_order: 0,
    template_choice: "detailed",
    related_course_id: "",
    access_grants: [],
    payment_plan_options: [],
  });
  const [enablePaymentPlans, setEnablePaymentPlans] = useState(false);

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: () => base44.entities.Product.list("-created_date"),
  });

  const { data: courses = [] } = useQuery({
    queryKey: ["courses"],
    queryFn: () => base44.entities.Course.list("title"),
  });

  const createMutation = useMutation({
    mutationFn: async (productData) => {
      const created = await base44.entities.Product.create(productData);
      
      // Auto-sync with Stripe
      const syncResult = await base44.functions.invoke('syncProductStripe', {
        product_id: created.id,
        key: productData.key,
        name: productData.name,
        description: productData.short_description,
        price: parseInt(productData.price) || 0,
        currency: productData.currency,
        billing_interval: productData.billing_interval,
        type: productData.type,
      });

      if (syncResult.data.success) {
        await base44.entities.Product.update(created.id, {
          stripe_product_id: syncResult.data.stripe_product_id,
          stripe_price_id: syncResult.data.stripe_price_id,
          stripe_price_ids: syncResult.data.stripe_price_ids,
        });
      }

      return created;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product created and synced with Stripe!");
      setDialogOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast.error(`Failed to create product: ${error.message}`);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      const updated = await base44.entities.Product.update(id, data);
      
      // Auto-sync with Stripe
      const syncResult = await base44.functions.invoke('syncProductStripe', {
        product_id: id,
        key: data.key,
        name: data.name,
        description: data.short_description,
        price: parseInt(data.price) || 0,
        currency: data.currency,
        billing_interval: data.billing_interval,
        type: data.type,
      });

      if (syncResult.data.success) {
        await base44.entities.Product.update(id, {
          stripe_product_id: syncResult.data.stripe_product_id,
          stripe_price_id: syncResult.data.stripe_price_id,
          stripe_price_ids: syncResult.data.stripe_price_ids,
        });
      }

      return updated;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product updated and synced with Stripe!");
      setDialogOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast.error(`Failed to update product: ${error.message}`);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Product.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product deleted");
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: ({ id, status }) => 
      base44.entities.Product.update(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  const handleSyncAll = async () => {
    setSyncing(true);
    try {
      for (const product of products) {
        await base44.functions.invoke('syncProductStripe', {
          product_id: product.id,
          key: product.key,
          name: product.name,
          description: product.short_description,
          price: product.price || 0,
          currency: product.currency,
          billing_interval: product.billing_interval,
          type: product.type,
        });
      }
      toast.success("All products synced with Stripe!");
      queryClient.invalidateQueries({ queryKey: ["products"] });
    } catch (error) {
      toast.error("Failed to sync some products");
    } finally {
      setSyncing(false);
    }
  };

  const resetForm = () => {
    setFormData({
      key: "",
      slug: "",
      name: "",
      tagline: "",
      short_description: "",
      long_description: "",
      type: "one_time",
      product_subtype: "",
      category: "foundation",
      price: "",
      currency: "usd",
      billing_interval: "one_time",
      features: [""],
      icon: "",
      color: "#1E3A32",
      status: "draft",
      ui_group: "standard",
      display_order: 0,
      template_choice: "detailed",
      related_course_id: "",
      access_grants: [],
      payment_plan_options: [],
    });
    setEditingProduct(null);
    setEnablePaymentPlans(false);
  };

  const handleEdit = (product) => {
    // If it's a bundle, open the bundle editor
    if (product.is_bundle || product.type === "bundle") {
      setEditingBundle(product);
      setBundleDialogOpen(true);
      return;
    }
    
    setEditingProduct(product);
    const hasPlan = product.payment_plan_options && product.payment_plan_options.length > 0;
    setFormData({
      ...product,
      slug: product.slug || "",
      price: product.price ? (product.price / 100).toString() : "",
      features: product.features || [""],
      template_choice: product.template_choice || "detailed",
      product_subtype: product.product_subtype || "",
      related_course_id: product.related_course_id || "",
      access_grants: product.access_grants || [],
      payment_plan_options: product.payment_plan_options || [],
    });
    setEnablePaymentPlans(hasPlan);
    setDialogOpen(true);
  };

  const handleSubmit = () => {
    const dataToSave = {
      ...formData,
      price: formData.price ? parseInt(parseFloat(formData.price) * 100) : 0,
      features: formData.features.filter(f => f.trim() !== ""),
    };

    if (editingProduct) {
      updateMutation.mutate({ id: editingProduct.id, data: dataToSave });
    } else {
      createMutation.mutate(dataToSave);
    }
  };

  const addFeature = () => {
    setFormData({ ...formData, features: [...formData.features, ""] });
  };

  const updateFeature = (index, value) => {
    const updated = [...formData.features];
    updated[index] = value;
    setFormData({ ...formData, features: updated });
  };

  const removeFeature = (index) => {
    const updated = formData.features.filter((_, i) => i !== index);
    setFormData({ ...formData, features: updated });
  };

  const handleExportJSON = () => {
    const dataStr = JSON.stringify(products, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `products-export-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Products exported as JSON');
  };

  const handleExportCSV = () => {
    const headers = ['key', 'slug', 'name', 'tagline', 'short_description', 'type', 'category', 'price', 'currency', 'billing_interval', 'status', 'ui_group', 'template_choice'];
    const csvContent = [
      headers.join(','),
      ...products.map(p => [
        p.key || '',
        p.slug || '',
        `"${(p.name || '').replace(/"/g, '""')}"`,
        `"${(p.tagline || '').replace(/"/g, '""')}"`,
        `"${(p.short_description || '').replace(/"/g, '""')}"`,
        p.type || '',
        p.category || '',
        p.price || 0,
        p.currency || 'usd',
        p.billing_interval || 'one_time',
        p.status || 'draft',
        p.ui_group || 'standard',
        p.template_choice || 'detailed'
      ].join(','))
    ].join('\n');

    const dataBlob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `products-export-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Products exported as CSV');
  };

  const handleImport = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setImporting(true);
    try {
      const text = await file.text();
      let importData = [];

      if (file.name.endsWith('.json')) {
        importData = JSON.parse(text);
      } else if (file.name.endsWith('.csv')) {
        const lines = text.split('\n').filter(line => line.trim());
        const headers = lines[0].split(',');
        importData = lines.slice(1).map(line => {
          const values = line.match(/(".*?"|[^,]+)(?=\s*,|\s*$)/g);
          const obj = {};
          headers.forEach((header, i) => {
            let value = values[i]?.trim().replace(/^"(.*)"$/, '$1').replace(/""/g, '"');
            if (header === 'price') value = parseInt(value) || 0;
            obj[header] = value;
          });
          return obj;
        });
      }

      let created = 0;
      let errors = [];

      for (const item of importData) {
        try {
          const existing = products.find(p => p.key === item.key);
          if (existing) {
            await base44.entities.Product.update(existing.id, item);
          } else {
            await base44.entities.Product.create(item);
            created++;
          }
        } catch (error) {
          errors.push(`Failed to import ${item.key}: ${error.message}`);
        }
      }

      queryClient.invalidateQueries({ queryKey: ["products"] });
      
      if (errors.length > 0) {
        toast.error(`Imported with ${errors.length} errors. Check console.`);
        console.error('Import errors:', errors);
      } else {
        toast.success(`Successfully imported ${created} new products`);
      }
    } catch (error) {
      toast.error(`Import failed: ${error.message}`);
    } finally {
      setImporting(false);
      event.target.value = '';
    }
  };

  const categoryLabels = {
    foundation: "Tier 1: Foundation",
    mid_level: "Tier 2: Mid-Level",
    high_touch: "Tier 3: High-Touch",
    advanced: "Advanced",
  };

  if (isLoading) {
    return <div className="p-8">Loading products...</div>;
  }

  return (
    <div className="min-h-screen bg-[#F9F5EF] p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="font-serif text-4xl text-[#1E3A32] mb-2">Product Manager</h1>
            <p className="text-[#2B2725]/70">
              Manage your offerings and sync with Stripe automatically
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={() => {
                setEditingBundle(null);
                setBundleDialogOpen(true);
              }}
              className="bg-[#6E4F7D] hover:bg-[#8B659B]"
            >
              <Package size={16} className="mr-2" />
              Create Bundle
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                const menu = document.createElement('div');
                menu.style.cssText = 'position:absolute;background:white;border:1px solid #E4D9C4;border-radius:4px;padding:8px;z-index:100;';
                menu.innerHTML = `
                  <button class="export-json" style="display:block;width:100%;text-align:left;padding:8px;border:none;background:none;cursor:pointer;font-size:14px;">Export as JSON</button>
                  <button class="export-csv" style="display:block;width:100%;text-align:left;padding:8px;border:none;background:none;cursor:pointer;font-size:14px;">Export as CSV</button>
                `;
                document.body.appendChild(menu);
                const rect = event.target.getBoundingClientRect();
                menu.style.top = rect.bottom + 5 + 'px';
                menu.style.left = rect.left + 'px';

                menu.querySelector('.export-json').onclick = () => {
                  handleExportJSON();
                  document.body.removeChild(menu);
                };
                menu.querySelector('.export-csv').onclick = () => {
                  handleExportCSV();
                  document.body.removeChild(menu);
                };

                setTimeout(() => {
                  const closeMenu = () => document.body.contains(menu) && document.body.removeChild(menu);
                  document.addEventListener('click', closeMenu, { once: true });
                }, 100);
              }}
              className="border-[#D8B46B]"
            >
              <Download size={16} className="mr-2" />
              Export
            </Button>
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={importing}
              className="border-[#D8B46B]"
            >
              <Upload size={16} className={`mr-2 ${importing ? "animate-pulse" : ""}`} />
              Import
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json,.csv"
              onChange={handleImport}
              style={{ display: 'none' }}
            />
            <Button
              variant="outline"
              onClick={handleSyncAll}
              disabled={syncing}
              className="border-[#D8B46B]"
            >
              <RefreshCw size={16} className={`mr-2 ${syncing ? "animate-spin" : ""}`} />
              Sync All
            </Button>
            <Button
              onClick={() => {
                resetForm();
                setDialogOpen(true);
              }}
              className="bg-[#1E3A32] hover:bg-[#2B2725]"
            >
              <Plus size={16} className="mr-2" />
              Add Product
            </Button>
          </div>
        </div>

        {/* Products by Category */}
        {Object.entries(categoryLabels).map(([category, label]) => {
          const categoryProducts = products.filter((p) => p.category === category);
          if (categoryProducts.length === 0) return null;

          return (
            <div key={category} className="mb-12">
              <h2 className="font-serif text-2xl text-[#1E3A32] mb-4">{label}</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoryProducts.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white p-6 rounded-lg border border-[#E4D9C4] relative"
                  >
                    {/* Status Badge */}
                    <div className="absolute top-4 right-4">
                      {product.status === "published" ? (
                        <Eye size={16} className="text-[#A6B7A3]" />
                      ) : (
                        <EyeOff size={16} className="text-[#2B2725]/40" />
                      )}
                    </div>

                    <h3 className="font-serif text-xl text-[#1E3A32] mb-2">{product.name}</h3>
                    {product.tagline && (
                      <p className="text-sm text-[#2B2725]/60 mb-3">{product.tagline}</p>
                    )}
                    
                    <div className="flex items-center gap-2 mb-4">
                      <DollarSign size={16} className="text-[#D8B46B]" />
                      <span className="font-medium">
                        {product.price ? `$${(product.price / 100).toFixed(2)}` : "Free"}
                      </span>
                      {product.billing_interval && product.billing_interval !== "one_time" && (
                        <span className="text-sm text-[#2B2725]/60">/ {product.billing_interval}</span>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {product.product_subtype && (
                        <span className="text-xs px-2 py-1 bg-[#D8B46B]/20 text-[#1E3A32] rounded font-medium">
                          {product.product_subtype === 'webinar' ? '📹 Webinar' :
                           product.product_subtype === 'book' ? '📖 Book' :
                           product.product_subtype === 'course' ? '🎓 Course' :
                           product.product_subtype}
                        </span>
                      )}
                      <span className="text-xs px-2 py-1 bg-[#F9F5EF] text-[#2B2725]/70 rounded">
                        {product.type}
                      </span>
                      {(product.is_bundle || product.type === "bundle") && (
                        <span className="text-xs px-2 py-1 bg-[#6E4F7D]/20 text-[#6E4F7D] rounded flex items-center gap-1">
                          <Package size={12} />
                          Bundle ({product.bundled_product_ids?.length || 0})
                        </span>
                      )}
                      {product.stripe_product_id && (
                        <span className="text-xs px-2 py-1 bg-[#A6B7A3]/20 text-[#A6B7A3] rounded">
                          Synced
                        </span>
                      )}
                    </div>

                    <div className="flex flex-col gap-2 mt-4">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(product)}
                          className="flex-1"
                        >
                          <Edit size={14} className="mr-1" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            if (product.slug) {
                              window.open(`/ProductPage?slug=${product.slug}&preview=true`, '_blank');
                            } else {
                              alert("Please add a slug to preview this product");
                            }
                          }}
                          className="flex-1"
                        >
                          <ExternalLink size={14} className="mr-1" />
                          Preview
                        </Button>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            toggleStatusMutation.mutate({
                              id: product.id,
                              status: product.status === "published" ? "draft" : "published",
                            })
                          }
                          className="flex-1"
                        >
                          {product.status === "published" ? "Unpublish" : "Publish"}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            if (confirm("Delete this product?")) {
                              deleteMutation.mutate(product.id);
                            }
                          }}
                          className="text-red-600 flex-1"
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {products.length === 0 && (
          <div className="text-center py-16 bg-white rounded-lg">
            <Sparkles size={48} className="mx-auto mb-4 text-[#D8B46B]" />
            <p className="text-[#2B2725]/60 mb-4">No products yet. Create your first offering!</p>
            <Button
              onClick={() => {
                resetForm();
                setDialogOpen(true);
              }}
              className="bg-[#1E3A32] hover:bg-[#2B2725]"
            >
              <Plus size={16} className="mr-2" />
              Add Your First Product
            </Button>
          </div>
        )}
      </div>

      {/* Product Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl">
              {editingProduct ? "Edit Product" : "Create New Product"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">

            {/* Quick Guide */}
            {!editingProduct && (
              <div className="bg-[#1E3A32]/5 border border-[#1E3A32]/20 rounded-lg p-4 text-sm text-[#1E3A32]">
                <p className="font-semibold mb-2 flex items-center gap-2"><Info size={14}/> What type of product are you creating?</p>
                <div className="grid grid-cols-3 gap-3 mt-3">
                  <button
                    type="button"
                    onClick={() => setFormData(f => ({ ...f, product_subtype: 'webinar', type: 'one_time', category: 'foundation' }))}
                    className={`p-3 rounded border text-center transition-all ${formData.product_subtype === 'webinar' ? 'border-[#1E3A32] bg-[#1E3A32] text-white' : 'border-[#D8B46B] hover:bg-[#D8B46B]/10'}`}
                  >
                    <Video size={18} className="mx-auto mb-1"/>
                    <span className="text-xs font-medium">Webinar</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData(f => ({ ...f, product_subtype: 'book', type: 'one_time', category: 'foundation' }))}
                    className={`p-3 rounded border text-center transition-all ${formData.product_subtype === 'book' ? 'border-[#1E3A32] bg-[#1E3A32] text-white' : 'border-[#D8B46B] hover:bg-[#D8B46B]/10'}`}
                  >
                    <BookOpen size={18} className="mx-auto mb-1"/>
                    <span className="text-xs font-medium">Book</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData(f => ({ ...f, product_subtype: 'course', type: 'one_time', category: 'mid_level' }))}
                    className={`p-3 rounded border text-center transition-all ${formData.product_subtype === 'course' ? 'border-[#1E3A32] bg-[#1E3A32] text-white' : 'border-[#D8B46B] hover:bg-[#D8B46B]/10'}`}
                  >
                    <GraduationCap size={18} className="mx-auto mb-1"/>
                    <span className="text-xs font-medium">Hypnosis Class / Course</span>
                  </button>
                </div>
                {formData.product_subtype === 'webinar' && (
                  <p className="mt-3 text-xs text-[#2B2725]/70 bg-white p-2 rounded">Webinars appear in the <strong>Webinars & Live Events</strong> section on your Programs page. After saving, they'll be visible there automatically.</p>
                )}
                {formData.product_subtype === 'book' && (
                  <p className="mt-3 text-xs text-[#2B2725]/70 bg-white p-2 rounded">Books appear in the <strong>Books & Resources</strong> section on your Programs page. After saving, they'll be visible there automatically.</p>
                )}
                {formData.product_subtype === 'course' && (
                  <p className="mt-3 text-xs text-[#2B2725]/70 bg-white p-2 rounded">This creates a <strong>sellable product</strong> for your hypnosis class. Link it to your actual course content using the "Linked Course" field below.</p>
                )}
              </div>
            )}

            {/* Basic Info */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Product Key * <span className="text-xs font-normal text-[#2B2725]/50">(short internal ID, no spaces)</span></Label>
                <Input
                  value={formData.key}
                  onChange={(e) => {
                    const key = e.target.value;
                    setFormData({ 
                      ...formData, 
                      key,
                      slug: formData.slug || key.toLowerCase().replace(/[^a-z0-9]+/g, '-')
                    });
                  }}
                  placeholder="certification"
                />
              </div>
              <div>
                <Label>URL Slug *</Label>
                <Input
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') })}
                  placeholder="certification-program"
                />
                <p className="text-xs text-[#2B2725]/60 mt-1">
                  yourmindstylist.com/product/{formData.slug || 'slug'}
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="foundation">Tier 1: Foundation</SelectItem>
                    <SelectItem value="mid_level">Tier 2: Mid-Level</SelectItem>
                    <SelectItem value="high_touch">Tier 3: High-Touch</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Page Template</Label>
                <Select
                  value={formData.template_choice}
                  onValueChange={(value) => setFormData({ ...formData, template_choice: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="minimal">Minimal (Clean & Simple)</SelectItem>
                    <SelectItem value="detailed">Detailed (Full Features)</SelectItem>
                    <SelectItem value="immersive">Immersive (Visual Story)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Product Name *</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="The Mind Styling Certification™"
              />
            </div>

            <div>
              <Label>Tagline</Label>
              <Input
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                placeholder="3-Part Inner Redesign"
              />
            </div>

            <div>
              <Label>Short Description</Label>
              <Textarea
                value={formData.short_description}
                onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                placeholder="Brief description for cards"
                rows={3}
              />
            </div>

            <div>
              <Label>Long Description</Label>
              <ReactQuill
                value={formData.long_description}
                onChange={(value) => setFormData({ ...formData, long_description: value })}
                className="bg-white"
              />
            </div>

            {/* Pricing */}
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label>Product Subtype <span className="text-xs font-normal text-[#2B2725]/50">(what kind of product is this?)</span></Label>
                <Select
                  value={formData.product_subtype || ""}
                  onValueChange={(value) => setFormData({ ...formData, product_subtype: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select subtype..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="webinar">📹 Webinar / Live Event</SelectItem>
                    <SelectItem value="book">📖 Book</SelectItem>
                    <SelectItem value="course">🎓 Course / Hypnosis Class</SelectItem>
                    <SelectItem value="digital_service">💻 Digital Service</SelectItem>
                    <SelectItem value="physical_product">📦 Physical Product</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-[#2B2725]/50 mt-1">Webinars & books auto-appear in correct sections on Programs page</p>
              </div>
              <div>
                <Label>Pricing Type * <span className="text-xs font-normal text-[#2B2725]/50">(how it's charged)</span></Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData({ ...formData, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="one_time">One-Time Purchase</SelectItem>
                    <SelectItem value="subscription">Subscription (recurring)</SelectItem>
                    <SelectItem value="payment_plan">Payment Plan (installments)</SelectItem>
                    <SelectItem value="consultation">Consultation (free/booking)</SelectItem>
                    <SelectItem value="bundle">Bundle (multiple products)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Price (USD) <span className="text-xs font-normal text-[#2B2725]/50">(enter the full dollar amount)</span></Label>
                <Input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="9.00"
                  step="0.01"
                />
                <p className="text-xs text-[#2B2725]/60 mt-1">
                  e.g. enter 9 for $9.00, or 997 for $997.00
                </p>
              </div>

              {formData.type === "subscription" && (
                <div>
                  <Label>Billing Interval</Label>
                  <Select
                    value={formData.billing_interval}
                    onValueChange={(value) => setFormData({ ...formData, billing_interval: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            {/* Payment Plans */}
            <div className="border border-[#E4D9C4] rounded-lg p-4">
              <div className="mb-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={enablePaymentPlans}
                    onChange={(e) => {
                      setEnablePaymentPlans(e.target.checked);
                      if (!e.target.checked) {
                        setFormData({ ...formData, payment_plan_options: [] });
                      } else {
                        setFormData({ ...formData, payment_plan_options: [
                          { name: "Pay in Full", months: 1, monthly_price: parseInt(formData.price) || 0 },
                          { name: "3 Monthly Payments", months: 3, monthly_price: Math.round((parseInt(formData.price) || 0) / 3) }
                        ]});
                      }
                    }}
                    className="w-4 h-4"
                  />
                  <span className="font-medium text-[#1E3A32]">Offer Payment Plans</span>
                </label>
              </div>

              {enablePaymentPlans && (
                <div className="space-y-3">
                  {formData.payment_plan_options.map((plan, idx) => (
                    <div key={idx} className="bg-[#F9F5EF] p-3 rounded space-y-2">
                      <div className="grid grid-cols-3 gap-2">
                        <Input
                          placeholder="Plan name"
                          value={plan.name}
                          onChange={(e) => {
                            const updated = [...formData.payment_plan_options];
                            updated[idx].name = e.target.value;
                            setFormData({ ...formData, payment_plan_options: updated });
                          }}
                        />
                        <Input
                          type="number"
                          placeholder="Months"
                          min="1"
                          max="12"
                          value={plan.months}
                          onChange={(e) => {
                            const updated = [...formData.payment_plan_options];
                            updated[idx].months = parseInt(e.target.value) || 1;
                            setFormData({ ...formData, payment_plan_options: updated });
                          }}
                        />
                        <div className="flex gap-1">
                          <Input
                            type="number"
                            placeholder="Monthly $"
                            value={plan.monthly_price / 100}
                            onChange={(e) => {
                              const updated = [...formData.payment_plan_options];
                              updated[idx].monthly_price = Math.round((parseFloat(e.target.value) || 0) * 100);
                              setFormData({ ...formData, payment_plan_options: updated });
                            }}
                          />
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              const updated = formData.payment_plan_options.filter((_, i) => i !== idx);
                              setFormData({ ...formData, payment_plan_options: updated });
                            }}
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </div>
                      <p className="text-xs text-[#2B2725]/60">
                        Total: ${((plan.monthly_price * plan.months) / 100).toFixed(2)}
                      </p>
                    </div>
                  ))}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      const newPrice = Math.round((parseInt(formData.price) || 0) / 2);
                      setFormData({
                        ...formData,
                        payment_plan_options: [
                          ...formData.payment_plan_options,
                          { name: `Pay in ${formData.payment_plan_options.length + 1}`, months: formData.payment_plan_options.length + 1, monthly_price: newPrice }
                        ]
                      });
                    }}
                    className="w-full"
                  >
                    <Plus size={14} className="mr-1" />
                    Add Plan Option
                  </Button>
                </div>
              )}
            </div>

            {/* Features */}
            <div>
              <Label>Features</Label>
              {formData.features.map((feature, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <Input
                    value={feature}
                    onChange={(e) => updateFeature(index, e.target.value)}
                    placeholder="Feature description"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => removeFeature(index)}
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              ))}
              <Button size="sm" variant="outline" onClick={addFeature} className="mt-2">
                <Plus size={14} className="mr-1" />
                Add Feature
              </Button>
            </div>

            {/* Access Control */}
            <div>
              <Label>Related Course (optional)</Label>
              <Select
                value={formData.related_course_id}
                onValueChange={(value) => setFormData({ ...formData, related_course_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a course" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={null}>None</SelectItem>
                  {courses.map((course) => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-[#2B2725]/60 mt-1">
                Link this product to a single course (for simple products)
              </p>
            </div>

            <div>
              <Label>Access Grants (Course IDs)</Label>
              <Textarea
                value={formData.access_grants.join("\n")}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  access_grants: e.target.value.split("\n").filter(id => id.trim()) 
                })}
                placeholder="693a6b978867f6e147e25e8d&#10;693a6b978867f6e147e25e8e"
                rows={4}
              />
              <p className="text-xs text-[#2B2725]/60 mt-1">
                Course IDs this product unlocks (one per line). Used for bundles or multi-course products.
              </p>
            </div>

            {/* Display Settings */}
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label>Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>UI Group</Label>
                <Select
                  value={formData.ui_group}
                  onValueChange={(value) => setFormData({ ...formData, ui_group: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hero">Hero (Featured)</SelectItem>
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="hidden">Hidden</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Display Order</Label>
                <Input
                  type="number"
                  value={formData.display_order}
                  onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={createMutation.isPending || updateMutation.isPending}
              className="bg-[#1E3A32] hover:bg-[#2B2725]"
            >
              {editingProduct ? "Update Product" : "Create Product"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Bundle Creator Dialog */}
      <BundleCreator
        open={bundleDialogOpen}
        onClose={() => {
          setBundleDialogOpen(false);
          setEditingBundle(null);
        }}
        existingBundle={editingBundle}
      />
    </div>
  );
}