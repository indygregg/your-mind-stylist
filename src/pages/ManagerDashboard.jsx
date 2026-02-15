import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "../utils";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Mail, FileText, AlertCircle, Calendar, Clock, MessageSquare, DollarSign, TrendingUp, Users, BarChart3, Plus, ChevronDown, ChevronUp, Sparkles, Settings, Package, PenSquare, FileVideo, Headphones, Target, Image, Download, X, CheckCircle, Circle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import AIManagerAssistant from "@/components/ai/AIManagerAssistant";
import { PersonalizedGreeting } from "@/components/ui/PersonalizedGreeting";
import ManagerDashboardNow from "@/components/manager/ManagerDashboardNow";
import ManagerDashboardHealth from "@/components/manager/ManagerDashboardHealth";
import ManagerDashboardCreate from "@/components/manager/ManagerDashboardCreate";
import ManagerDashboardOperations from "@/components/manager/ManagerDashboardOperations";

export default function ManagerDashboard() {
  const [user, setUser] = useState(null);
  const [expandedSections, setExpandedSections] = useState({
    create: false,
    operations: false
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
        
        // Redirect non-managers
        const isManager = currentUser.role === 'manager' || currentUser.custom_role === 'manager';
        const isAdmin = currentUser.role === 'admin';
        
        if (!isManager && !isAdmin) {
          window.location.href = createPageUrl('Dashboard');
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };
    fetchUser();
  }, []);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

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

  const { data: consultationIntakes = [] } = useQuery({
    queryKey: ["consultationIntakes"],
    queryFn: () => base44.entities.ConsultationIntake.filter({ status: "submitted" }),
  });





  const { data: courses = [] } = useQuery({
    queryKey: ["allCourses"],
    queryFn: () => base44.entities.Course.list(),
  });

  return (
    <div className="min-h-screen bg-[#F9F5EF] py-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Personalized Welcome */}
        <PersonalizedGreeting user={user} variant="dashboard" />

        {/* Transition Guide Alert */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mb-8"
        >
          <Alert className="bg-gradient-to-r from-[#D8B46B]/20 to-[#D8B46B]/10 border-2 border-[#D8B46B] shadow-lg">
            <AlertCircle className="text-[#D8B46B]" size={24} />
            <AlertDescription>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-serif text-xl text-[#1E3A32] mb-2">
                    Transitioning from Acuity?
                  </h3>
                  <p className="text-[#2B2725]/80 mb-3">
                    Follow our step-by-step guide to smoothly migrate your booking system while keeping your existing clients happy.
                  </p>
                  <Link
                    to={createPageUrl("TransitionGuide")}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#1E3A32] text-white hover:bg-[#2B2725] transition-colors rounded"
                  >
                    View Transition Guide
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </AlertDescription>
          </Alert>
        </motion.div>

        {/* NOW Section */}
        <ManagerDashboardNow user={user} bookings={bookings} messages={messages} consultationIntakes={consultationIntakes} />

        {/* HEALTH Section */}
        <ManagerDashboardHealth courses={courses} bookings={bookings} />

        {/* CREATE Section (Collapsible) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <button
            onClick={() => toggleSection('create')}
            className="w-full flex items-center justify-between p-6 bg-white hover:shadow-lg transition-shadow group"
          >
            <h2 className="font-serif text-2xl text-[#1E3A32]">Create</h2>
            {expandedSections.create ? (
              <ChevronUp size={24} className="text-[#D8B46B]" />
            ) : (
              <ChevronDown size={24} className="text-[#2B2725]/40" />
            )}
          </button>
          {expandedSections.create && (
            <ManagerDashboardCreate />
          )}
        </motion.div>

        {/* OPERATIONS Section (Collapsible) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="mb-8"
        >
          <button
            onClick={() => toggleSection('operations')}
            className="w-full flex items-center justify-between p-6 bg-white hover:shadow-lg transition-shadow group"
          >
            <h2 className="font-serif text-2xl text-[#1E3A32]">Operations</h2>
            {expandedSections.operations ? (
              <ChevronUp size={24} className="text-[#D8B46B]" />
            ) : (
              <ChevronDown size={24} className="text-[#2B2725]/40" />
            )}
          </button>
          {expandedSections.operations && (
            <ManagerDashboardOperations />
          )}
        </motion.div>
      </div>
    </div>
  );
}