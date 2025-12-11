import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "../utils";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { PenSquare, FileVideo, Headphones, Mail, Users, FileText, ShoppingCart } from "lucide-react";

export default function ManagerDashboard() {
  // Set auth layout
  if (typeof window !== 'undefined') {
    window.__USE_AUTH_LAYOUT = true;
  }

  const { data: blogPosts = [] } = useQuery({
    queryKey: ["blogPosts"],
    queryFn: () => base44.entities.BlogPost.list("-created_date", 3),
  });

  const { data: messages = [] } = useQuery({
    queryKey: ["messages", "new"],
    queryFn: () => base44.entities.Message.filter({ status: "new" }),
  });

  const { data: drafts = [] } = useQuery({
    queryKey: ["drafts"],
    queryFn: () => base44.entities.BlogPost.filter({ status: "draft" }),
  });

  const quickActions = [
    { icon: PenSquare, label: "Create New Blog Post", link: "BlogEditor?mode=new" },
    { icon: FileVideo, label: "Create New Course", link: "CourseEditor?mode=new" },
    { icon: Headphones, label: "Upload Inner Rehearsal Session", link: "AudioEditor?mode=new" },
    { icon: Mail, label: "View Messages", link: "MessagesManager" },
  ];

  const snapshotCards = [
    { icon: Users, label: "New users this week", value: 12, color: "#A6B7A3" },
    { icon: ShoppingCart, label: "New purchases this week", value: 5, color: "#D8B46B" },
    { icon: Mail, label: "Unanswered messages", value: messages.length, color: "#6E4F7D", link: "MessagesManager" },
    { icon: FileText, label: "Drafts waiting to publish", value: drafts.length, color: "#1E3A32", link: "BlogManager" },
  ];

  return (
    <div className="min-h-screen bg-[#F9F5EF] py-12 px-6">
      {user && <OnboardingModal role="manager" />}
      <div className="max-w-7xl mx-auto">
        {/* Welcome Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="font-serif text-4xl md:text-5xl text-[#1E3A32] mb-3">
            Welcome back, Roberta.
          </h1>
          <p className="text-[#2B2725]/70 text-lg">
            Here's what's happening in your world today.
          </p>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <h2 className="font-serif text-2xl text-[#1E3A32] mb-6">Quick Actions</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                to={createPageUrl(action.link)}
                className="bg-white p-6 hover:shadow-lg transition-shadow group"
              >
                <action.icon size={32} className="text-[#D8B46B] mb-4" />
                <p className="text-[#1E3A32] font-medium group-hover:text-[#D8B46B] transition-colors">
                  {action.label}
                </p>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Snapshot Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <h2 className="font-serif text-2xl text-[#1E3A32] mb-6">At a Glance</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {snapshotCards.map((card, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + index * 0.05 }}
                className="bg-white p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <card.icon size={28} style={{ color: card.color }} />
                  <span className="text-3xl font-serif" style={{ color: card.color }}>
                    {card.value}
                  </span>
                </div>
                {card.link ? (
                  <Link
                    to={createPageUrl(card.link)}
                    className="text-[#2B2725]/70 hover:text-[#1E3A32] transition-colors"
                  >
                    {card.label} →
                  </Link>
                ) : (
                  <p className="text-[#2B2725]/70">{card.label}</p>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="font-serif text-2xl text-[#1E3A32] mb-6">Recent Activity</h2>
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Latest Blog Posts */}
            <div className="bg-white p-6">
              <h3 className="font-medium text-[#1E3A32] mb-4 flex items-center gap-2">
                <FileText size={20} className="text-[#D8B46B]" />
                Latest Blog Posts
              </h3>
              <div className="space-y-3">
                {blogPosts.slice(0, 3).map((post) => (
                  <div key={post.id} className="border-l-2 border-[#D8B46B] pl-3">
                    <p className="text-sm text-[#1E3A32] font-medium">{post.title}</p>
                    <p className="text-xs text-[#2B2725]/60">{post.category}</p>
                  </div>
                ))}
              </div>
              <Link
                to={createPageUrl("BlogManager")}
                className="text-sm text-[#1E3A32] hover:text-[#D8B46B] mt-4 inline-block"
              >
                View all posts →
              </Link>
            </div>

            {/* Latest Messages */}
            <div className="bg-white p-6">
              <h3 className="font-medium text-[#1E3A32] mb-4 flex items-center gap-2">
                <Mail size={20} className="text-[#6E4F7D]" />
                Recent Messages
              </h3>
              <div className="space-y-3">
                {messages.slice(0, 3).map((msg) => (
                  <div key={msg.id} className="border-l-2 border-[#6E4F7D] pl-3">
                    <p className="text-sm text-[#1E3A32] font-medium">{msg.name}</p>
                    <p className="text-xs text-[#2B2725]/60">{msg.type}</p>
                  </div>
                ))}
              </div>
              <Link
                to={createPageUrl("MessagesManager")}
                className="text-sm text-[#1E3A32] hover:text-[#6E4F7D] mt-4 inline-block"
              >
                View all messages →
              </Link>
            </div>

            {/* Drafts */}
            <div className="bg-white p-6">
              <h3 className="font-medium text-[#1E3A32] mb-4 flex items-center gap-2">
                <PenSquare size={20} className="text-[#A6B7A3]" />
                Drafts
              </h3>
              <div className="space-y-3">
                {drafts.slice(0, 3).map((draft) => (
                  <div key={draft.id} className="border-l-2 border-[#A6B7A3] pl-3">
                    <p className="text-sm text-[#1E3A32] font-medium">{draft.title}</p>
                    <p className="text-xs text-[#2B2725]/60">Draft</p>
                  </div>
                ))}
              </div>
              <Link
                to={createPageUrl("BlogManager")}
                className="text-sm text-[#1E3A32] hover:text-[#A6B7A3] mt-4 inline-block"
              >
                View all drafts →
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}