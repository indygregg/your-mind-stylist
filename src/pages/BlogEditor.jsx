import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "../utils";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Save, Eye, Trash2, ArrowLeft, Calendar } from "lucide-react";
import AIHelper from "../components/ai/AIHelper";

export default function BlogEditor() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const urlParams = new URLSearchParams(window.location.search);
  const mode = urlParams.get("mode");
  const id = urlParams.get("id");

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    category: "Emotional Intelligence",
    excerpt: "",
    content: "",
    featured_image: "",
    tags: [],
    status: "draft",
    publish_date: "",
    meta_title: "",
    meta_description: "",
  });

  const { data: existingPost, isLoading } = useQuery({
    queryKey: ["blogPost", id],
    queryFn: async () => {
      if (!id) return null;
      const posts = await base44.entities.BlogPost.filter({ id });
      return posts[0];
    },
    enabled: !!id,
  });

  useEffect(() => {
    if (existingPost) {
      setFormData(existingPost);
    }
  }, [existingPost]);

  useEffect(() => {
    if (formData.title && !id) {
      setFormData(prev => ({
        ...prev,
        slug: prev.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      }));
    }
  }, [formData.title, id]);

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.BlogPost.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogPosts"] });
      navigate(createPageUrl("BlogManager"));
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.BlogPost.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogPosts"] });
      navigate(createPageUrl("BlogManager"));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.BlogPost.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogPosts"] });
      navigate(createPageUrl("BlogManager"));
    },
  });

  const handleSave = (status) => {
    const dataToSave = { ...formData, status };
    if (id) {
      updateMutation.mutate({ id, data: dataToSave });
    } else {
      createMutation.mutate(dataToSave);
    }
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleAIInsert = (content) => {
    setFormData(prev => ({ ...prev, content: prev.content + "\n\n" + content }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F9F5EF] py-12 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-[#2B2725]/60">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F5EF] py-12 px-6 pr-[25rem]">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate(createPageUrl("BlogManager"))}
            className="mb-4"
          >
            <ArrowLeft size={18} className="mr-2" />
            Back to Blog Manager
          </Button>
          <h1 className="font-serif text-4xl text-[#1E3A32] mb-2">
            {id ? "Edit Blog Post" : "New Blog Post"}
          </h1>
          <p className="text-[#2B2725]/70">The Mind Styling Journal</p>
        </div>

        <div className="bg-white p-8 space-y-6">
          {/* Title */}
          <div>
            <Label>Title *</Label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter your post title…"
            />
          </div>

          {/* Slug */}
          <div>
            <Label>Slug (URL)</Label>
            <Input
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            />
            <p className="text-xs text-[#2B2725]/60 mt-1">This becomes the URL of your post</p>
          </div>

          {/* Category */}
          <div>
            <Label>Category</Label>
            <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Monday Mentions">Monday Mentions</SelectItem>
                <SelectItem value="Thursday Thoughts">Thursday Thoughts</SelectItem>
                <SelectItem value="Emotional Intelligence">Emotional Intelligence</SelectItem>
                <SelectItem value="Communication">Communication</SelectItem>
                <SelectItem value="Leadership & Teams">Leadership & Teams</SelectItem>
                <SelectItem value="Identity & Confidence">Identity & Confidence</SelectItem>
                <SelectItem value="Stress & Regulation">Stress & Regulation</SelectItem>
                <SelectItem value="Relationships">Relationships</SelectItem>
                <SelectItem value="Inner Rehearsal">Inner Rehearsal</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Excerpt */}
          <div>
            <Label>Excerpt</Label>
            <Textarea
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              placeholder="Write a short summary to show on the blog list"
              rows={3}
            />
          </div>

          {/* Content */}
          <div>
            <Label className="mb-2 block">Main Content</Label>
            <ReactQuill
              value={formData.content}
              onChange={(content) => setFormData({ ...formData, content })}
              theme="snow"
              style={{ minHeight: "400px" }}
            />
          </div>

          {/* Featured Image */}
          <div>
            <Label>Cover Image (optional)</Label>
            <Input
              value={formData.featured_image}
              onChange={(e) => setFormData({ ...formData, featured_image: e.target.value })}
              placeholder="Image URL"
            />
          </div>

          {/* SEO */}
          <div className="border-t pt-6">
            <h3 className="font-medium text-[#1E3A32] mb-4">SEO Settings</h3>
            <div className="space-y-4">
              <div>
                <Label>Meta Title</Label>
                <Input
                  value={formData.meta_title}
                  onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
                />
              </div>
              <div>
                <Label>Meta Description</Label>
                <Textarea
                  value={formData.meta_description}
                  onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                  rows={2}
                />
              </div>
            </div>
          </div>

          {/* Publish Settings */}
          <div className="border-t pt-6">
            <h3 className="font-medium text-[#1E3A32] mb-4">Publish Settings</h3>
            <div className="space-y-4">
              <div>
                <Label>Status</Label>
                <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Publish Date & Time</Label>
                <Input
                  type="datetime-local"
                  value={formData.publish_date}
                  onChange={(e) => setFormData({ ...formData, publish_date: e.target.value })}
                />
                <p className="text-xs text-[#2B2725]/60 mt-1">Schedule this post to go live automatically</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-between border-t pt-6">
            <div>
              {id && (
                <Button variant="outline" className="text-red-600" onClick={handleDelete}>
                  <Trash2 size={18} className="mr-2" />
                  Delete Post
                </Button>
              )}
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => handleSave("draft")}>
                <Save size={18} className="mr-2" />
                Save Draft
              </Button>
              {formData.status === "published" ? (
                <Button onClick={() => handleSave("published")} className="bg-[#1E3A32] hover:bg-[#2B2725]">
                  <Save size={18} className="mr-2" />
                  Update
                </Button>
              ) : (
                <Button onClick={() => handleSave("published")} className="bg-[#1E3A32] hover:bg-[#2B2725]">
                  <Calendar size={18} className="mr-2" />
                  Publish
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <AIHelper
        mode="blog"
        onInsert={handleAIInsert}
        context={{
          topic: formData.title,
          category: formData.category,
          content: formData.content,
        }}
      />
    </div>
  );
}