import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Mail, Tag, Users, Plus, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";

const AVAILABLE_TAGS = [
  // Lead Tags
  { value: "lead_masterclass", label: "Masterclass Lead", category: "Lead Status" },
  { value: "lead_consultation", label: "Consultation Lead", category: "Lead Status" },
  { value: "lead_webinar", label: "Webinar Lead", category: "Lead Status" },
  
  // Purchase Tags
  { value: "purchased_pv", label: "Purchased PV", category: "Purchase" },
  { value: "purchased_webinar", label: "Purchased Webinar", category: "Purchase" },
  { value: "purchased_private", label: "Purchased Private Session", category: "Purchase" },
  { value: "purchased_cert", label: "Purchased Certification", category: "Purchase" },
  { value: "purchased_toolkit", label: "Purchased Toolkit Module", category: "Purchase" },
  
  // Engagement Tags
  { value: "active_student", label: "Active Student", category: "Engagement" },
  { value: "inactive_30d", label: "Inactive 30 Days", category: "Engagement" },
  { value: "high_engagement", label: "High Engagement", category: "Engagement" },
  
  // Sequence Tags
  { value: "seq_welcome", label: "Welcome Sequence", category: "Email Sequence" },
  { value: "seq_masterclass", label: "Masterclass Sequence", category: "Email Sequence" },
  { value: "seq_pv_onboarding", label: "PV Onboarding", category: "Email Sequence" },
  { value: "seq_rejoin", label: "Re-engagement", category: "Email Sequence" },
];

const EMAIL_SEQUENCES = [
  { id: "welcome", name: "Welcome Sequence", emails: 3 },
  { id: "masterclass", name: "Masterclass Follow-up", emails: 3 },
  { id: "pv_onboarding", name: "PV Onboarding", emails: 5 },
  { id: "rejoin", name: "Re-engagement", emails: 4 },
];

export default function ManagerCRM() {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [tagDialogOpen, setTagDialogOpen] = useState(false);
  const [sequenceDialogOpen, setSequenceDialogOpen] = useState(false);

  // Fetch all users
  const { data: users = [], isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: () => base44.entities.User.list("-created_date"),
  });

  // Filter users based on search
  const filteredUsers = users.filter((user) => {
    const query = searchQuery.toLowerCase();
    return (
      user.full_name?.toLowerCase().includes(query) ||
      user.email?.toLowerCase().includes(query) ||
      user.tags?.some((tag) => tag.toLowerCase().includes(query))
    );
  });

  const addTagMutation = useMutation({
    mutationFn: async ({ userId, tag }) => {
      const user = users.find((u) => u.id === userId);
      const currentTags = user.tags || [];
      if (!currentTags.includes(tag)) {
        return base44.asServiceRole.entities.User.update(userId, {
          tags: [...currentTags, tag],
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const removeTagMutation = useMutation({
    mutationFn: async ({ userId, tag }) => {
      const user = users.find((u) => u.id === userId);
      const currentTags = user.tags || [];
      return base44.asServiceRole.entities.User.update(userId, {
        tags: currentTags.filter((t) => t !== tag),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const handleAddTag = (userId, tag) => {
    addTagMutation.mutate({ userId, tag });
    setTagDialogOpen(false);
  };

  const handleRemoveTag = (userId, tag) => {
    if (window.confirm(`Remove tag "${tag}"?`)) {
      removeTagMutation.mutate({ userId, tag });
    }
  };

  const handleSendSequence = (userId, sequenceId) => {
    // Placeholder - would trigger email sequence
    console.log(`Sending ${sequenceId} sequence to user ${userId}`);
    setSequenceDialogOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#F9F5EF] py-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-serif text-4xl text-[#1E3A32] mb-2">CRM & Tag Management</h1>
          <p className="text-[#2B2725]/70">Manage user tags and email sequences</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#2B2725]/60">Total Users</p>
                  <p className="text-2xl font-bold text-[#1E3A32]">{users.length}</p>
                </div>
                <Users size={32} className="text-[#D8B46B]" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#2B2725]/60">Tagged Users</p>
                  <p className="text-2xl font-bold text-[#1E3A32]">
                    {users.filter((u) => u.tags?.length > 0).length}
                  </p>
                </div>
                <Tag size={32} className="text-[#A6B7A3]" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#2B2725]/60">Active Students</p>
                  <p className="text-2xl font-bold text-[#1E3A32]">
                    {users.filter((u) => u.tags?.includes("active_student")).length}
                  </p>
                </div>
                <Mail size={32} className="text-[#6E4F7D]" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#2B2725]/60">Leads</p>
                  <p className="text-2xl font-bold text-[#1E3A32]">
                    {users.filter((u) => u.tags?.some((t) => t.startsWith("lead_"))).length}
                  </p>
                </div>
                <Search size={32} className="text-[#D8B46B]" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#2B2725]/40" size={20} />
            <Input
              placeholder="Search by name, email, or tag..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Users List */}
        <Card>
          <CardHeader>
            <CardTitle>Users ({filteredUsers.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-center py-8 text-[#2B2725]/60">Loading users...</p>
            ) : filteredUsers.length === 0 ? (
              <p className="text-center py-8 text-[#2B2725]/60">No users found</p>
            ) : (
              <div className="space-y-3">
                <AnimatePresence>
                  {filteredUsers.map((user) => (
                    <motion.div
                      key={user.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="border border-[#E4D9C4] rounded-lg p-4 hover:border-[#D8B46B] transition-colors"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-medium text-[#1E3A32]">{user.full_name}</h3>
                          <p className="text-sm text-[#2B2725]/60">{user.email}</p>
                          <p className="text-xs text-[#2B2725]/40 mt-1">
                            Joined {new Date(user.created_date).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Dialog open={tagDialogOpen && selectedUser?.id === user.id} onOpenChange={(open) => {
                            setTagDialogOpen(open);
                            if (open) setSelectedUser(user);
                          }}>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <Plus size={14} className="mr-1" />
                                Add Tag
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Add Tag to {user.full_name}</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                {Object.entries(
                                  AVAILABLE_TAGS.reduce((acc, tag) => {
                                    if (!acc[tag.category]) acc[tag.category] = [];
                                    acc[tag.category].push(tag);
                                    return acc;
                                  }, {})
                                ).map(([category, tags]) => (
                                  <div key={category}>
                                    <p className="text-sm font-medium text-[#2B2725]/60 mb-2">
                                      {category}
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                      {tags.map((tag) => (
                                        <Button
                                          key={tag.value}
                                          variant="outline"
                                          size="sm"
                                          onClick={() => handleAddTag(user.id, tag.value)}
                                          disabled={user.tags?.includes(tag.value)}
                                        >
                                          {tag.label}
                                        </Button>
                                      ))}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </DialogContent>
                          </Dialog>

                          <Dialog open={sequenceDialogOpen && selectedUser?.id === user.id} onOpenChange={(open) => {
                            setSequenceDialogOpen(open);
                            if (open) setSelectedUser(user);
                          }}>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <Mail size={14} className="mr-1" />
                                Send Sequence
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Send Email Sequence to {user.full_name}</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-3">
                                {EMAIL_SEQUENCES.map((seq) => (
                                  <Button
                                    key={seq.id}
                                    variant="outline"
                                    className="w-full justify-between"
                                    onClick={() => handleSendSequence(user.id, seq.id)}
                                  >
                                    <span>{seq.name}</span>
                                    <span className="text-xs text-[#2B2725]/60">
                                      {seq.emails} emails
                                    </span>
                                  </Button>
                                ))}
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2">
                        {user.tags?.length > 0 ? (
                          user.tags.map((tag) => (
                            <Badge
                              key={tag}
                              variant="secondary"
                              className="bg-[#D8B46B]/20 text-[#1E3A32] hover:bg-[#D8B46B]/30"
                            >
                              {AVAILABLE_TAGS.find((t) => t.value === tag)?.label || tag}
                              <button
                                onClick={() => handleRemoveTag(user.id, tag)}
                                className="ml-2 hover:text-red-600"
                              >
                                <X size={12} />
                              </button>
                            </Badge>
                          ))
                        ) : (
                          <span className="text-sm text-[#2B2725]/40">No tags</span>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}