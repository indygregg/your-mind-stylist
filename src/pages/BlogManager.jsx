import React, { useState } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "../utils";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PenSquare, Eye, Trash2, Plus } from "lucide-react";
import { format } from "date-fns";

export default function BlogManager() {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ["blogPosts"],
    queryFn: () => base44.entities.BlogPost.list("-created_date"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.BlogPost.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogPosts"] });
    },
  });

  const filteredPosts = posts.filter((post) => {
    const statusMatch = statusFilter === "all" || post.status === statusFilter;
    const categoryMatch = categoryFilter === "all" || post.category === categoryFilter;
    return statusMatch && categoryMatch;
  });

  const handleDelete = (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F5EF] py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="font-serif text-4xl text-[#1E3A32] mb-2">
              Blog Manager
            </h1>
            <p className="text-[#2B2725]/70">The Mind Styling Journal</p>
          </div>
          <Link to={createPageUrl("BlogEditor?mode=new")}>
            <Button className="bg-[#1E3A32] hover:bg-[#2B2725] text-[#F9F5EF]">
              <Plus size={20} className="mr-2" />
              Create New Blog Post
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 mb-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <label className="text-sm text-[#2B2725]/70 mb-2 block">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 min-w-[200px]">
              <label className="text-sm text-[#2B2725]/70 mb-2 block">Category</label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Monday Mentions">Monday Mentions</SelectItem>
                  <SelectItem value="Thursday Thoughts">Thursday Thoughts</SelectItem>
                  <SelectItem value="Emotional Intelligence">Emotional Intelligence</SelectItem>
                  <SelectItem value="Communication">Communication</SelectItem>
                  <SelectItem value="Leadership & Teams">Leadership & Teams</SelectItem>
                  <SelectItem value="Identity & Confidence">Identity & Confidence</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Posts Table */}
        <div className="bg-white overflow-hidden">
          {isLoading ? (
            <div className="p-12 text-center text-[#2B2725]/60">Loading posts...</div>
          ) : filteredPosts.length === 0 ? (
            <div className="p-12 text-center text-[#2B2725]/60">
              No posts found. Create your first one!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#F9F5EF]">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-[#2B2725]">
                      Title
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-[#2B2725]">
                      Category
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-[#2B2725]">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-[#2B2725]">
                      Published On
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-medium text-[#2B2725]">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E4D9C4]">
                  {filteredPosts.map((post) => (
                    <tr key={post.id} className="hover:bg-[#F9F5EF]/50">
                      <td className="px-6 py-4">
                        <p className="font-medium text-[#1E3A32]">{post.title}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-[#2B2725]/70">{post.category}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-3 py-1 text-xs uppercase tracking-wide ${
                            post.status === "published"
                              ? "bg-[#A6B7A3]/20 text-[#1E3A32]"
                              : post.status === "scheduled"
                              ? "bg-[#D8B46B]/20 text-[#2B2725]"
                              : "bg-[#E4D9C4] text-[#2B2725]/70"
                          }`}
                        >
                          {post.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-[#2B2725]/70">
                        {post.publish_date
                          ? format(new Date(post.publish_date), "MMM d, yyyy")
                          : "—"}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link to={createPageUrl(`BlogEditor?mode=edit&id=${post.id}`)}>
                            <Button variant="ghost" size="icon" className="text-[#1E3A32]">
                              <PenSquare size={18} />
                            </Button>
                          </Link>
                          <Link to={createPageUrl(`BlogPost?slug=${post.slug}`)}>
                            <Button variant="ghost" size="icon" className="text-[#1E3A32]">
                              <Eye size={18} />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => handleDelete(post.id, post.title)}
                          >
                            <Trash2 size={18} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}