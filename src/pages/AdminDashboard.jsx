import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "../utils";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { 
  PenSquare, FileVideo, Headphones, Mail, Users, FileText, 
  ShoppingCart, ListTodo, Settings, BarChart3, Shield, Sparkles, Target, Image, Download 
} from "lucide-react";

export default function AdminDashboard() {
  const { data: blogPosts = [] } = useQuery({
    queryKey: ["admin-blogPosts"],
    queryFn: () => base44.entities.BlogPost.list("-created_date", 5),
  });

  const { data: messages = [] } = useQuery({
    queryKey: ["admin-messages", "new"],
    queryFn: () => base44.entities.Message.filter({ status: "new" }),
  });

  const { data: roadmapItems = [] } = useQuery({
    queryKey: ["admin-roadmap"],
    queryFn: () => base44.entities.RoadmapItem.filter({ status: "In Progress" }),
  });

  const { data: allUsers = [] } = useQuery({
    queryKey: ["admin-users"],
    queryFn: () => base44.entities.User.list("-created_date", 10),
  });

  const quickActions = [
    { icon: ListTodo, label: "Manage Roadmap", link: "AdminRoadmap", color: "#6E4F7D" },
    { icon: FileText, label: "Dev Docs", link: "StudioDevDocs", color: "#6E4F7D" },
    { icon: PenSquare, label: "Manage Blog Posts", link: "BlogManager", color: "#D8B46B" },
    { icon: FileVideo, label: "Manage Courses", link: "AdminCourses", color: "#A6B7A3" },
    { icon: Headphones, label: "Manage Audio Sessions", link: "AdminAudio", color: "#1E3A32" },
    { icon: Mail, label: "View All Messages", link: "MessagesManager", color: "#6E4F7D" },
    { icon: Users, label: "Manage Users", link: "AdminUsers", color: "#D8B46B" },
    { icon: BarChart3, label: "Analytics & Reports", link: "AdminAnalytics", color: "#A6B7A3" },
    { icon: Settings, label: "System Settings", link: "AdminSettings", color: "#2B2725" },
  ];

  const snapshotCards = [
    { icon: Users, label: "Total Users", value: allUsers.length, color: "#A6B7A3" },
    { icon: FileText, label: "Published Posts", value: blogPosts.filter(p => p.status === "published").length, color: "#D8B46B" },
    { icon: Mail, label: "New Messages", value: messages.length, color: "#6E4F7D", link: "MessagesManager" },
    { icon: ListTodo, label: "Active Roadmap Items", value: roadmapItems.length, color: "#1E3A32", link: "AdminRoadmap" },
  ];

  return (
    <div className="min-h-screen bg-[#F9F5EF] py-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-3">
            <Shield size={32} className="text-[#1E3A32]" />
            <h1 className="font-serif text-4xl md:text-5xl text-[#1E3A32]">
              Admin Dashboard
            </h1>
          </div>
          <p className="text-[#2B2725]/70 text-lg">
            Elevated access to manage all content, users, and system features.
          </p>
        </motion.div>

        {/* Content Alchemy Suite - Featured */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <div className="bg-gradient-to-br from-[#1E3A32] to-[#2B4A40] p-8 md:p-10 rounded-lg shadow-xl relative overflow-hidden">
            {/* Decorative background */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#D8B46B] opacity-10 rounded-full -mr-32 -mt-32"></div>
            
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles size={24} className="text-[#D8B46B]" />
                    <span className="text-[#D8B46B] text-xs tracking-[0.2em] uppercase">Content Tools</span>
                  </div>
                  <h2 className="font-serif text-3xl md:text-4xl text-[#F9F5EF] mb-3">
                    Content Alchemy Suite
                  </h2>
                  <p className="text-[#F9F5EF]/80 text-lg max-w-2xl">
                    Help Roberta transform every blog post into a multi-channel content empire. Build social strategy, create visuals, and drive organic reach.
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
                  <Target size={20} className="text-[#D8B46B] mb-2" />
                  <p className="text-[#F9F5EF] text-sm font-medium mb-1">Social Media Transformer</p>
                  <p className="text-[#F9F5EF]/60 text-xs">LinkedIn, Instagram, Twitter, Facebook</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
                  <Image size={20} className="text-[#D8B46B] mb-2" />
                  <p className="text-[#F9F5EF] text-sm font-medium mb-1">Visual Intelligence</p>
                  <p className="text-[#F9F5EF]/60 text-xs">AI cover images & quote graphics</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
                  <Download size={20} className="text-[#D8B46B] mb-2" />
                  <p className="text-[#F9F5EF] text-sm font-medium mb-1">Lead Magnet Generator</p>
                  <p className="text-[#F9F5EF]/60 text-xs">PDF guides, worksheets & checklists</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
                  <Sparkles size={20} className="text-[#D8B46B] mb-2" />
                  <p className="text-[#F9F5EF] text-sm font-medium mb-1">SEO Enchanter</p>
                  <p className="text-[#F9F5EF]/60 text-xs">Meta tags, keywords & readability</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  to={createPageUrl("BlogEditor?mode=new")}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#D8B46B] text-[#1E3A32] font-medium hover:bg-[#F9F5EF] transition-all"
                >
                  <PenSquare size={18} />
                  Create New Blog Post
                </Link>
                <Link
                  to={createPageUrl("BlogManager")}
                  className="inline-flex items-center gap-2 px-6 py-3 border border-[#F9F5EF]/30 text-[#F9F5EF] font-medium hover:bg-white/10 transition-all"
                >
                  Edit Existing Posts
                </Link>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <h2 className="font-serif text-2xl text-[#1E3A32] mb-6">Admin Actions</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                to={createPageUrl(action.link)}
                className="bg-white p-6 hover:shadow-lg transition-shadow group"
              >
                <action.icon size={32} style={{ color: action.color }} className="mb-4" />
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
          transition={{ delay: 0.3 }}
          className="mb-12"
        >
          <h2 className="font-serif text-2xl text-[#1E3A32] mb-6">System Overview</h2>
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
          transition={{ delay: 0.4 }}
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
                {blogPosts.slice(0, 5).map((post) => (
                  <div key={post.id} className="border-l-2 border-[#D8B46B] pl-3">
                    <p className="text-sm text-[#1E3A32] font-medium">{post.title}</p>
                    <p className="text-xs text-[#2B2725]/60">{post.status} • {post.category}</p>
                  </div>
                ))}
              </div>
              <Link
                to={createPageUrl("BlogManager")}
                className="text-sm text-[#1E3A32] hover:text-[#D8B46B] mt-4 inline-block"
              >
                Manage all posts →
              </Link>
            </div>

            {/* Active Roadmap Items */}
            <div className="bg-white p-6">
              <h3 className="font-medium text-[#1E3A32] mb-4 flex items-center gap-2">
                <ListTodo size={20} className="text-[#1E3A32]" />
                Active Roadmap
              </h3>
              <div className="space-y-3">
                {roadmapItems.slice(0, 5).map((item) => (
                  <div key={item.id} className="border-l-2 border-[#1E3A32] pl-3">
                    <p className="text-sm text-[#1E3A32] font-medium">{item.title}</p>
                    <p className="text-xs text-[#2B2725]/60">{item.priority} • {item.category}</p>
                  </div>
                ))}
              </div>
              <Link
                to={createPageUrl("AdminRoadmap")}
                className="text-sm text-[#1E3A32] hover:text-[#6E4F7D] mt-4 inline-block"
              >
                View roadmap →
              </Link>
            </div>

            {/* Recent Users */}
            <div className="bg-white p-6">
              <h3 className="font-medium text-[#1E3A32] mb-4 flex items-center gap-2">
                <Users size={20} className="text-[#A6B7A3]" />
                Recent Users
              </h3>
              <div className="space-y-3">
                {allUsers.slice(0, 5).map((user) => (
                  <div key={user.id} className="border-l-2 border-[#A6B7A3] pl-3">
                    <p className="text-sm text-[#1E3A32] font-medium">{user.full_name || user.email}</p>
                    <p className="text-xs text-[#2B2725]/60">{user.role}</p>
                  </div>
                ))}
              </div>
              <Link
                to={createPageUrl("AdminUsers")}
                className="text-sm text-[#1E3A32] hover:text-[#A6B7A3] mt-4 inline-block"
              >
                Manage users →
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}