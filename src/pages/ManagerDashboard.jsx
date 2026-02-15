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



  // Check setup completion
  const hasAvailability = availabilityRules.length > 0;
  const hasAppointmentTypes = appointmentTypes.length > 0;
  const hasGoogleCalendar = user?.google_calendar_access_token ? true : false;
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
      id: 'google_calendar', 
      label: 'Connect your calendar (Google or Mac)', 
      completed: hasGoogleCalendar, 
      link: 'IntegrationSetup'
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