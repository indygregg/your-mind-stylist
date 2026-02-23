import React, { useState } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "../utils";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import ResponsiveSelect from "@/components/ui/ResponsiveSelect";
import { PenSquare, Eye, Trash2, Plus, UserPlus, CheckCircle, XCircle, Mic, ExternalLink } from "lucide-react";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function BlogManager() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("posts");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Podcast state
  const [podcastDialog, setPodcastDialog] = useState(false);
  const [editingPodcast, setEditingPodcast] = useState(null);
  const [podcastForm, setPodcastForm] = useState({
    show_name: "", episode_title: "", description: "",
    episode_url: "", embed_url: "", thumbnail: "", air_date: "", status: "published"
  });

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ["blogPosts"],
    queryFn: () => base44.entities.BlogPost.list("-created_date"),
  });

  const { data: analytics = [] } = useQuery({
    queryKey: ["allAnalytics"],
    queryFn: () => base44.entities.BlogAnalytics.list(),
  });

  const { data: podcasts = [], isLoading: podcastsLoading } = useQuery({
    queryKey: ["podcastAppearances"],
    queryFn: () => base44.entities.PodcastAppearance.list("-air_date"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.BlogPost.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["blogPosts"] }),
  });

  const approveMutation = useMutation({
    mutationFn: (id) => base44.entities.BlogPost.update(id, { status: "published" }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["blogPosts"] }),
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, reason }) => base44.entities.BlogPost.update(id, { status: "rejected", rejection_reason: reason }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["blogPosts"] }),
  });

  const createPodcastMutation = useMutation({
    mutationFn: (data) => base44.entities.PodcastAppearance.create(data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["podcastAppearances"] }); closePodcastDialog(); },
  });

  const updatePodcastMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.PodcastAppearance.update(id, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["podcastAppearances"] }); closePodcastDialog(); },
  });

  const deletePodcastMutation = useMutation({
    mutationFn: (id) => base44.entities.PodcastAppearance.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["podcastAppearances"] }),
  });

  const filteredPosts = posts.filter((post) => {
    const statusMatch = statusFilter === "all" || post.status === statusFilter;
    const categoryMatch = categoryFilter === "all" || post.category === categoryFilter;
    return statusMatch && categoryMatch;
  });

  const handleDelete = (id, title) => {
    if (window.confirm(`Delete "${title}"? This can't be undone.`)) deleteMutation.mutate(id);
  };
  const handleApprove = (id) => {
    if (window.confirm("Approve and publish this guest post?")) approveMutation.mutate(id);
  };
  const handleReject = (id) => {
    const reason = window.prompt("Rejection reason (will be sent to author):");
    if (reason) rejectMutation.mutate({ id, reason });
  };
  const getAnalytics = (postId) => analytics.find(a => a.blog_post_id === postId) || { views: 0, likes: 0, shares: 0 };

  const openNewPodcast = () => {
    setEditingPodcast(null);
    setPodcastForm({ show_name: "", episode_title: "", description: "", episode_url: "", embed_url: "", thumbnail: "", air_date: "", status: "published" });
    setPodcastDialog(true);
  };
  const openEditPodcast = (p) => {
    setEditingPodcast(p);
    setPodcastForm({ show_name: p.show_name || "", episode_title: p.episode_title || "", description: p.description || "", episode_url: p.episode_url || "", embed_url: p.embed_url || "", thumbnail: p.thumbnail || "", air_date: p.air_date || "", status: p.status || "published" });
    setPodcastDialog(true);
  };
  const closePodcastDialog = () => { setPodcastDialog(false); setEditingPodcast(null); };
  const savePodcast = () => {
    if (editingPodcast) updatePodcastMutation.mutate({ id: editingPodcast.id, data: podcastForm });
    else createPodcastMutation.mutate(podcastForm);
  };

  return (
    <div className="min-h-screen bg-[#F9F5EF] py-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="font-serif text-4xl text-[#1E3A32] mb-2">Blog & Podcast Manager</h1>
            <p className="text-[#2B2725]/70">The Mind Styling Journal</p>
          </div>
          <div className="flex gap-3">
            {activeTab === "posts" ? (
              <>
                <Link to={createPageUrl("GuestAuthorInvite")}>
                  <Button variant="outline" className="border-[#D8B46B] text-[#1E3A32]">
                    <UserPlus size={18} className="mr-2" /> Invite Guest Author
                  </Button>
                </Link>
                <Link to={createPageUrl("BlogEditor?mode=new")}>
                  <Button className="bg-[#1E3A32] hover:bg-[#2B2725] text-[#F9F5EF]">
                    <Plus size={18} className="mr-2" /> New Blog Post
                  </Button>
                </Link>
              </>
            ) : (
              <Button className="bg-[#1E3A32] hover:bg-[#2B2725] text-[#F9F5EF]" onClick={openNewPodcast}>
                <Plus size={18} className="mr-2" /> Add Podcast Appearance
              </Button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-white p-1 w-fit">
          <button
            onClick={() => setActiveTab("posts")}
            className={`px-6 py-2 text-sm tracking-wide transition-colors ${activeTab === "posts" ? "bg-[#1E3A32] text-[#F9F5EF]" : "text-[#2B2725]/70 hover:text-[#1E3A32]"}`}
          >
            Blog Posts
          </button>
          <button
            onClick={() => setActiveTab("podcasts")}
            className={`px-6 py-2 text-sm tracking-wide transition-colors flex items-center gap-2 ${activeTab === "podcasts" ? "bg-[#1E3A32] text-[#F9F5EF]" : "text-[#2B2725]/70 hover:text-[#1E3A32]"}`}
          >
            <Mic size={14} /> Podcast Appearances
          </button>
        </div>

        {/* BLOG POSTS TAB */}
        {activeTab === "posts" && (
          <>
            <div className="bg-white p-6 mb-6">
              <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-[200px]">
                  <label className="text-sm text-[#2B2725]/70 mb-2 block">Status</label>
                  <ResponsiveSelect value={statusFilter} onValueChange={setStatusFilter} title="Filter by Status" placeholder="All Statuses"
                    options={[
                      { value: "all", label: "All Statuses" },
                      { value: "draft", label: "Draft" },
                      { value: "pending_review", label: "Pending Review" },
                      { value: "scheduled", label: "Scheduled" },
                      { value: "published", label: "Published" },
                      { value: "rejected", label: "Rejected" }
                    ]}
                  />
                </div>
                <div className="flex-1 min-w-[200px]">
                  <label className="text-sm text-[#2B2725]/70 mb-2 block">Category</label>
                  <ResponsiveSelect value={categoryFilter} onValueChange={setCategoryFilter} title="Filter by Category" placeholder="All Categories"
                    options={[
                      { value: "all", label: "All Categories" },
                      { value: "Restyle Monday", label: "Restyle Monday" },
                      { value: "Thursday Tailoring", label: "Thursday Tailoring" },
                      { value: "Emotional Intelligence", label: "Emotional Intelligence" },
                      { value: "Culture", label: "Culture" },
                      { value: "Leadership & Teams", label: "Leadership & Teams" },
                      { value: "Communication", label: "Communication" },
                      { value: "Identity & Confidence", label: "Identity & Confidence" },
                      { value: "Stress & Regulation", label: "Stress & Regulation" },
                      { value: "Relationships", label: "Relationships" },
                      { value: "Inner Rehearsal", label: "Inner Rehearsal" },
                      { value: "Hypnosis & the Brain", label: "Hypnosis & the Brain" },
                      { value: "Personal & Professional Development", label: "Personal & Professional Development" }
                    ]}
                  />
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden">
              {isLoading ? (
                <div className="p-12 text-center text-[#2B2725]/60">Loading your posts...</div>
              ) : filteredPosts.length === 0 ? (
                <div className="p-12 text-center">
                  <p className="text-[#2B2725]/60 mb-2">No posts here yet.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-[#F9F5EF]">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-medium text-[#2B2725]">Title</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-[#2B2725]">Type</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-[#2B2725]">Category</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-[#2B2725]">Status</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-[#2B2725]">Analytics</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-[#2B2725]">Published On</th>
                        <th className="px-6 py-4 text-right text-sm font-medium text-[#2B2725]">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E4D9C4]">
                      {filteredPosts.map((post) => (
                        <tr key={post.id} className="hover:bg-[#F9F5EF]/50">
                          <td className="px-6 py-4">
                            <p className="font-medium text-[#1E3A32]">{post.title}</p>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`text-xs px-2 py-1 ${post.post_type === "video" ? "bg-[#6E4F7D]/10 text-[#6E4F7D]" : "bg-[#E4D9C4] text-[#2B2725]/70"}`}>
                              {post.post_type === "video" ? "▶ Video" : "✍ Written"}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-[#2B2725]/70">{post.category}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex px-3 py-1 text-xs uppercase tracking-wide ${
                              post.status === "published" ? "bg-[#A6B7A3]/20 text-[#1E3A32]"
                              : post.status === "pending_review" ? "bg-[#D8B46B]/20 text-[#2B2725]"
                              : post.status === "scheduled" ? "bg-[#6E4F7D]/20 text-[#2B2725]"
                              : post.status === "rejected" ? "bg-red-100 text-red-800"
                              : "bg-[#E4D9C4] text-[#2B2725]/70"
                            }`}>
                              {post.status.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            {post.status === "published" && (() => {
                              const stats = getAnalytics(post.id);
                              return (
                                <div className="flex items-center gap-3 text-xs text-[#2B2725]/60">
                                  <span>{stats.views} 👁</span>
                                  <span>{stats.likes} ❤️</span>
                                  <span>{stats.shares} 📤</span>
                                </div>
                              );
                            })()}
                          </td>
                          <td className="px-6 py-4 text-sm text-[#2B2725]/70">
                            {post.publish_date ? format(new Date(post.publish_date), "MMM d, yyyy") : "—"}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-end gap-2">
                              {post.status === "pending_review" && (
                                <>
                                  <Button variant="ghost" size="icon" className="text-green-600" onClick={() => handleApprove(post.id)} title="Approve">
                                    <CheckCircle size={18} />
                                  </Button>
                                  <Button variant="ghost" size="icon" className="text-red-600" onClick={() => handleReject(post.id)} title="Reject">
                                    <XCircle size={18} />
                                  </Button>
                                </>
                              )}
                              <Link to={createPageUrl(`BlogEditor?mode=edit&id=${post.id}`)}>
                                <Button variant="ghost" size="icon" className="text-[#1E3A32]">
                                  <PenSquare size={18} />
                                </Button>
                              </Link>
                              {post.status === "published" && (
                                <Link to={createPageUrl(`BlogPost?slug=${post.slug}`)}>
                                  <Button variant="ghost" size="icon" className="text-[#1E3A32]">
                                    <Eye size={18} />
                                  </Button>
                                </Link>
                              )}
                              <Button variant="ghost" size="icon" className="text-red-600" onClick={() => handleDelete(post.id, post.title)}>
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
          </>
        )}

        {/* PODCASTS TAB */}
        {activeTab === "podcasts" && (
          <div>
            <p className="text-[#2B2725]/60 text-sm mb-6">Add podcast shows you've appeared on. These will display in the Mind-Styling Podcasts section of the Blog page.</p>
            {podcastsLoading ? (
              <div className="p-12 text-center text-[#2B2725]/60">Loading...</div>
            ) : podcasts.length === 0 ? (
              <div className="bg-white p-12 text-center">
                <Mic size={40} className="text-[#D8B46B] mx-auto mb-4" />
                <p className="text-[#2B2725]/60 mb-2">No podcast appearances added yet.</p>
                <p className="text-[#2B2725]/40 text-sm mb-6">Add the podcasts you've been featured on.</p>
                <Button className="bg-[#1E3A32] text-[#F9F5EF]" onClick={openNewPodcast}>
                  <Plus size={16} className="mr-2" /> Add First Appearance
                </Button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {podcasts.map((p) => (
                  <div key={p.id} className="bg-white p-6 hover:shadow-md transition-shadow">
                    {p.thumbnail && <img src={p.thumbnail} alt={p.show_name} className="w-full h-36 object-cover mb-4" />}
                    <p className="text-xs text-[#D8B46B] uppercase tracking-wide mb-1">{p.show_name}</p>
                    <h3 className="font-serif text-lg text-[#1E3A32] mb-2 leading-tight">{p.episode_title}</h3>
                    {p.description && <p className="text-sm text-[#2B2725]/70 mb-3 line-clamp-2">{p.description}</p>}
                    {p.air_date && <p className="text-xs text-[#2B2725]/50 mb-3">{format(new Date(p.air_date), "MMM d, yyyy")}</p>}
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        {p.episode_url && (
                          <a href={p.episode_url} target="_blank" rel="noopener noreferrer" className="text-xs text-[#D8B46B] hover:underline flex items-center gap-1">
                            <ExternalLink size={12} /> Listen
                          </a>
                        )}
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="text-[#1E3A32] h-8 w-8" onClick={() => openEditPodcast(p)}>
                          <PenSquare size={14} />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-red-500 h-8 w-8" onClick={() => { if (window.confirm("Delete this appearance?")) deletePodcastMutation.mutate(p.id); }}>
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Podcast Dialog */}
      <Dialog open={podcastDialog} onOpenChange={setPodcastDialog}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif text-[#1E3A32]">{editingPodcast ? "Edit Podcast Appearance" : "Add Podcast Appearance"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div>
              <Label>Show Name *</Label>
              <Input value={podcastForm.show_name} onChange={e => setPodcastForm(p => ({ ...p, show_name: e.target.value }))} placeholder="e.g. The Mind & Motivation Podcast" />
            </div>
            <div>
              <Label>Episode Title *</Label>
              <Input value={podcastForm.episode_title} onChange={e => setPodcastForm(p => ({ ...p, episode_title: e.target.value }))} placeholder="e.g. Rewiring Your Mind with Hypnosis" />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea value={podcastForm.description} onChange={e => setPodcastForm(p => ({ ...p, description: e.target.value }))} rows={3} placeholder="What did you discuss?" />
            </div>
            <div>
              <Label>Episode Link</Label>
              <Input value={podcastForm.episode_url} onChange={e => setPodcastForm(p => ({ ...p, episode_url: e.target.value }))} placeholder="https://..." />
              <p className="text-xs text-[#2B2725]/50 mt-1">Spotify, Apple Podcasts, show website, etc.</p>
            </div>
            <div>
              <Label>Embed URL (optional)</Label>
              <Input value={podcastForm.embed_url} onChange={e => setPodcastForm(p => ({ ...p, embed_url: e.target.value }))} placeholder="Spotify/podcast embed URL if available" />
            </div>
            <div>
              <Label>Thumbnail Image URL</Label>
              <Input value={podcastForm.thumbnail} onChange={e => setPodcastForm(p => ({ ...p, thumbnail: e.target.value }))} placeholder="https://..." />
            </div>
            <div>
              <Label>Air Date</Label>
              <Input type="date" value={podcastForm.air_date} onChange={e => setPodcastForm(p => ({ ...p, air_date: e.target.value }))} />
            </div>
            <div>
              <Label>Visibility</Label>
              <ResponsiveSelect value={podcastForm.status} onValueChange={v => setPodcastForm(p => ({ ...p, status: v }))} title="Visibility"
                options={[{ value: "published", label: "Published (visible on site)" }, { value: "draft", label: "Draft (hidden)" }]}
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={closePodcastDialog}>Cancel</Button>
              <Button className="bg-[#1E3A32] text-[#F9F5EF]" onClick={savePodcast}
                disabled={createPodcastMutation.isPending || updatePodcastMutation.isPending}>
                {editingPodcast ? "Save Changes" : "Add Appearance"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}