import React, { useState } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "../utils";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { PenSquare, FileVideo, Headphones, Mail, Users, FileText, ShoppingCart, Sparkles, Target, Image, Download, Calendar, BarChart3, TrendingUp, Video, Settings, Clock, CheckCircle, Circle, X, DollarSign, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ManagerDashboard() {
  // Set auth layout
  if (typeof window !== 'undefined') {
    window.__USE_AUTH_LAYOUT = true;
  }

  const [setupDismissed, setSetupDismissed] = useState(() => {
    return localStorage.getItem('booking_setup_dismissed') === 'true';
  });

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

  const { data: bookings = [] } = useQuery({
    queryKey: ["manager-bookings-count"],
    queryFn: () => base44.entities.Booking.list(),
  });

  const { data: appointmentTypes = [] } = useQuery({
    queryKey: ["appointmentTypes"],
    queryFn: () => base44.entities.AppointmentType.list(),
  });

  const { data: availabilityRules = [] } = useQuery({
    queryKey: ["availabilityRules"],
    queryFn: () => base44.entities.AvailabilityRule.list(),
  });

  const { data: user } = useQuery({
    queryKey: ["currentUser"],
    queryFn: () => base44.auth.me(),
  });

  // Check setup completion
  const hasAvailability = availabilityRules.length > 0;
  const hasAppointmentTypes = appointmentTypes.length > 0;
  const hasZoomConnected = user?.zoom_access_token ? true : false;
  const hasTestedBooking = bookings.length > 0;

  const setupSteps = [
    { 
      id: 'availability', 
      label: 'Set your availability', 
      completed: hasAvailability, 
      link: 'ManagerAvailability' 
    },
    { 
      id: 'appointment_types', 
      label: 'Create your appointment types', 
      completed: hasAppointmentTypes, 
      link: 'ManagerAppointments' 
    },
    { 
      id: 'zoom', 
      label: 'Connect Zoom (optional)', 
      completed: hasZoomConnected, 
      link: 'ZoomConnect' 
    },
    { 
      id: 'test', 
      label: 'Test a booking', 
      completed: hasTestedBooking, 
      link: 'Bookings' 
    },
  ];

  const completedSteps = setupSteps.filter(s => s.completed).length;
  const allComplete = completedSteps === setupSteps.length;

  const handleDismissSetup = () => {
    localStorage.setItem('booking_setup_dismissed', 'true');
    setSetupDismissed(true);
  };

  const quickActions = [
    { icon: PenSquare, label: "Create New Blog Post", link: "BlogEditor?mode=new" },
    { icon: Calendar, label: "Booking Calendar", link: "ManagerCalendar" },
    { icon: Clock, label: "Manage Availability", link: "ManagerAvailability" },
    { icon: Settings, label: "Manage Appointment Types", link: "ManagerAppointmentTypes" },
    { icon: Mail, label: "Email Templates", link: "ManagerEmailTemplates" },
    { icon: BarChart3, label: "Booking Analytics", link: "ManagerAnalytics" },
    { icon: Sparkles, label: "Transformation Analytics", link: "ManagerTransformationAnalytics" },
    { icon: Play, label: "Demo Setup & Preview", link: "DemoSetup" },
    { icon: TrendingUp, label: "Masterclass Funnel", link: "ManagerMasterclass" },
    { icon: Video, label: "Zoom Integration", link: "ZoomConnect" },
    { icon: Users, label: "CRM & Tags", link: "ManagerCRM" },
    { icon: FileVideo, label: "Course Manager", link: "CourseManager" },
    ];

  const { data: courses = [] } = useQuery({
    queryKey: ["allCourses"],
    queryFn: () => base44.entities.Course.list(),
  });

  const snapshotCards = [
    { icon: Calendar, label: "Active Bookings", value: bookings.filter(b => b.booking_status === 'confirmed').length, color: "#D8B46B", link: "ManagerBookings" },
    { icon: FileVideo, label: "Published Courses", value: courses.filter(c => c.status === 'published').length, color: "#6E4F7D", link: "CourseManager" },
    { icon: Mail, label: "Unanswered messages", value: messages.length, color: "#A6B7A3", link: "MessagesManager" },
    { icon: FileText, label: "Drafts waiting to publish", value: drafts.length, color: "#1E3A32", link: "BlogManager" },
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
          <h1 className="font-serif text-4xl md:text-5xl text-[#1E3A32] mb-3">
            Welcome back, Roberta.
          </h1>
          <p className="text-[#2B2725]/70 text-lg">
            Here's what's happening in your world today.
          </p>
        </motion.div>

        {/* Booking Setup Checklist */}
        {!setupDismissed && !allComplete && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-12"
          >
            <div className="bg-white border-2 border-[#D8B46B] p-8 shadow-lg relative">
              <button
                onClick={handleDismissSetup}
                className="absolute top-4 right-4 text-[#2B2725]/40 hover:text-[#2B2725] transition-colors"
              >
                <X size={20} />
              </button>

              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-[#D8B46B]/10 flex items-center justify-center flex-shrink-0">
                  <Settings size={24} className="text-[#D8B46B]" />
                </div>
                <div>
                  <h2 className="font-serif text-2xl text-[#1E3A32] mb-2">
                    Booking Setup Checklist
                  </h2>
                  <p className="text-[#2B2725]/70">
                    You're almost ready to accept bookings. Complete these steps once, then you're set.
                  </p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mb-6">
                <div className="flex items-center justify-between text-sm text-[#2B2725]/60 mb-2">
                  <span>{completedSteps} of {setupSteps.length} completed</span>
                  <span>{Math.round((completedSteps / setupSteps.length) * 100)}%</span>
                </div>
                <div className="h-2 bg-[#E4D9C4] rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(completedSteps / setupSteps.length) * 100}%` }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="h-full bg-[#D8B46B]"
                  />
                </div>
              </div>

              {/* Checklist */}
              <div className="space-y-3 mb-6">
                {setupSteps.map((step, idx) => (
                  <Link
                    key={step.id}
                    to={createPageUrl(step.link)}
                    className="flex items-center gap-3 p-3 rounded hover:bg-[#F9F5EF] transition-colors group"
                  >
                    {step.completed ? (
                      <CheckCircle size={20} className="text-green-600 flex-shrink-0" />
                    ) : (
                      <Circle size={20} className="text-[#2B2725]/30 flex-shrink-0" />
                    )}
                    <span className={`flex-1 ${step.completed ? 'text-[#2B2725]/60 line-through' : 'text-[#1E3A32] font-medium group-hover:text-[#D8B46B]'}`}>
                      {step.label}
                    </span>
                    <span className="text-xs text-[#2B2725]/40 opacity-0 group-hover:opacity-100 transition-opacity">
                      →
                    </span>
                  </Link>
                ))}
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => {
                    const firstIncomplete = setupSteps.find(s => !s.completed);
                    if (firstIncomplete) {
                      window.location.href = createPageUrl(firstIncomplete.link);
                    }
                  }}
                  className="bg-[#1E3A32] hover:bg-[#2B4A40]"
                >
                  Continue Setup
                </Button>
                <Button
                  variant="outline"
                  onClick={handleDismissSetup}
                >
                  Hide for now
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Setup Complete State */}
        {!setupDismissed && allComplete && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-12"
          >
            <div className="bg-gradient-to-r from-green-50 to-green-100 border-2 border-green-200 p-8 shadow-lg relative">
              <button
                onClick={handleDismissSetup}
                className="absolute top-4 right-4 text-green-600/40 hover:text-green-600 transition-colors"
              >
                <X size={20} />
              </button>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0">
                  <CheckCircle size={24} className="text-white" />
                </div>
                <div>
                  <h2 className="font-serif text-2xl text-green-900 mb-1">
                    You're ready to accept bookings!
                  </h2>
                  <p className="text-green-700">
                    Your booking system is fully configured. Clients can now schedule sessions with you.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Analytics Dashboard Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mb-12"
        >
          <Link to={createPageUrl("ManagerAnalytics")}>
            <div className="bg-gradient-to-br from-[#6E4F7D] to-[#8B659B] p-8 md:p-10 shadow-xl relative overflow-hidden hover:shadow-2xl transition-all duration-300 group cursor-pointer">
              {/* Decorative background */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32"></div>

              <div className="relative z-10">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <BarChart3 size={28} className="text-white" />
                      <span className="text-white/80 text-xs tracking-[0.2em] uppercase">Live Dashboard</span>
                    </div>
                    <h2 className="font-serif text-3xl md:text-4xl text-white mb-3">
                      Booking Analytics
                    </h2>
                    <p className="text-white/80 text-lg max-w-2xl">
                      Track your business performance, revenue trends, and client insights in real-time.
                    </p>
                  </div>
                  <div className="hidden md:block">
                    <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
                      <TrendingUp size={24} className="text-white" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
                    <DollarSign size={20} className="text-white/80 mb-2" />
                    <p className="text-white text-sm font-medium mb-1">Revenue Tracking</p>
                    <p className="text-white/60 text-xs">Daily, weekly, monthly</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
                    <Calendar size={20} className="text-white/80 mb-2" />
                    <p className="text-white text-sm font-medium mb-1">Booking Volume</p>
                    <p className="text-white/60 text-xs">Popular services</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
                    <Users size={20} className="text-white/80 mb-2" />
                    <p className="text-white text-sm font-medium mb-1">Client Retention</p>
                    <p className="text-white/60 text-xs">Returning clients</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
                    <TrendingUp size={20} className="text-white/80 mb-2" />
                    <p className="text-white text-sm font-medium mb-1">Performance</p>
                    <p className="text-white/60 text-xs">Service metrics</p>
                  </div>
                </div>

                <div className="mt-6 flex items-center gap-2 text-white group-hover:gap-3 transition-all">
                  <span className="text-sm font-medium">View Full Analytics Dashboard</span>
                  <span className="text-lg">→</span>
                </div>
              </div>
            </div>
          </Link>
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
                    <span className="text-[#D8B46B] text-xs tracking-[0.2em] uppercase">New</span>
                  </div>
                  <h2 className="font-serif text-3xl md:text-4xl text-[#F9F5EF] mb-3">
                    Content Alchemy Suite
                  </h2>
                  <p className="text-[#F9F5EF]/80 text-lg max-w-2xl">
                    Transform every blog post into a content empire. Write once, distribute everywhere—with AI-powered magic.
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
                  <Target size={20} className="text-[#D8B46B] mb-2" />
                  <p className="text-[#F9F5EF] text-sm font-medium mb-1">Social Media Transformer</p>
                  <p className="text-[#F9F5EF]/60 text-xs">Platform-optimized posts</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
                  <Image size={20} className="text-[#D8B46B] mb-2" />
                  <p className="text-[#F9F5EF] text-sm font-medium mb-1">Visual Intelligence</p>
                  <p className="text-[#F9F5EF]/60 text-xs">AI-generated branded images</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
                  <Download size={20} className="text-[#D8B46B] mb-2" />
                  <p className="text-[#F9F5EF] text-sm font-medium mb-1">Lead Magnets</p>
                  <p className="text-[#F9F5EF]/60 text-xs">PDF guides & worksheets</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
                  <Sparkles size={20} className="text-[#D8B46B] mb-2" />
                  <p className="text-[#F9F5EF] text-sm font-medium mb-1">SEO & Quote Graphics</p>
                  <p className="text-[#F9F5EF]/60 text-xs">Optimize & share wisdom</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
                  <FileText size={20} className="text-[#D8B46B] mb-2" />
                  <p className="text-[#F9F5EF] text-sm font-medium mb-1">Script Writer</p>
                  <p className="text-[#F9F5EF]/60 text-xs">Blog, lesson, and webinar scripts</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
                  <Mail size={20} className="text-[#D8B46B] mb-2" />
                  <p className="text-[#F9F5EF] text-sm font-medium mb-1">Email Sequences</p>
                  <p className="text-[#F9F5EF]/60 text-xs">For launches, sales, and nurturing</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
                  <Headphones size={20} className="text-[#D8B46B] mb-2" />
                  <p className="text-[#F9F5EF] text-sm font-medium mb-1">Pocket Visualization™ Script Generator</p>
                  <p className="text-[#F9F5EF]/60 text-xs">Creates new tracks with guided language</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
                  <FileVideo size={20} className="text-[#D8B46B] mb-2" />
                  <p className="text-[#F9F5EF] text-sm font-medium mb-1">Course Outline Generator</p>
                  <p className="text-[#F9F5EF]/60 text-xs">Built from simple prompts or transcripts</p>
                </div>
              </div>

              <Link
                to={createPageUrl("ContentStudio")}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#D8B46B] text-[#1E3A32] font-medium hover:bg-[#F9F5EF] transition-all"
              >
                <Sparkles size={18} />
                Open Content Alchemy Suite
              </Link>
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
          <h2 className="font-serif text-2xl text-[#1E3A32] mb-6">Quick Actions</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
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
          transition={{ delay: 0.3 }}
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