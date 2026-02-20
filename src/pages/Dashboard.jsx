import React, { useState, useEffect, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { Layers, Sparkles, BookOpen, Calendar, Play, User, Edit3, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "../utils";
import { useQuery } from "@tanstack/react-query";
import CmsText from "../components/cms/CmsText";
import OnboardingModal from "../components/onboarding/OnboardingModal";
import OnboardingQuickCards from "../components/onboarding/OnboardingQuickCards";
import DashboardTooltips from "../components/onboarding/DashboardTooltips";
import PaymentFailureBanner from "../components/purchase/PaymentFailureBanner";
import { base44 } from "@/api/base44Client";
import EmotionalWeather from "@/components/studio/EmotionalWeather";
import DailyPocketPrompt from "@/components/studio/DailyPocketPrompt";
import ConstellationMap from "@/components/studio/ConstellationMap";
import InnerMomentumMeter from "@/components/studio/InnerMomentumMeter";
import NotesDrawer from "@/components/studio/NotesDrawer";
import RecommendationCard from "@/components/studio/RecommendationCard";
import UpcomingSessions from "@/components/dashboard/UpcomingSessions";
import BookingHistory from "@/components/dashboard/BookingHistory";
import NextSessionWidget from "@/components/dashboard/NextSessionWidget";
import DailyStyleCheck from "@/components/studio/DailyStyleCheck";
import { Button } from "@/components/ui/button";
import MilestoneChecker from "@/components/transformation/MilestoneChecker";
import PostMasterclassOnboarding from "../components/onboarding/PostMasterclassOnboarding";
import AIClientAssistant from "@/components/ai/AIClientAssistant";
import { PersonalizedGreeting } from "../components/ui/PersonalizedGreeting";
import { SmartSuggestion } from "../components/ui/SmartSuggestion";
import { useSmartSuggestions } from "../components/ui/useSmartSuggestions";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import haptics from "@/components/utils/haptics";
import { usePullToRefresh } from "@/components/utils/usePullToRefresh";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);
  const [studioStats, setStudioStats] = useState(null);
  const [dailyPrompt, setDailyPrompt] = useState(null);
  const [notesDrawerOpen, setNotesDrawerOpen] = useState(false);
  const [showStyleCheck, setShowStyleCheck] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const [pastBookings, setPastBookings] = useState([]);
  const suggestions = useSmartSuggestions();
  const queryClient = useQueryClient();
  const { pullY, isRefreshing, handlers: pullToRefreshHandlers } = usePullToRefresh(async () => {
    await handleRefresh();
  });

  const fetchBookings = useCallback(async (currentUser) => {
    const allBookings = await base44.entities.Booking.filter({ user_email: currentUser.email });
    const now = new Date();
    
    const upcoming = allBookings.filter(b => 
      ['confirmed', 'scheduled', 'pending_payment'].includes(b.booking_status) &&
      (!b.scheduled_date || new Date(b.scheduled_date) >= now)
    ).sort((a, b) => {
      if (!a.scheduled_date) return 1;
      if (!b.scheduled_date) return -1;
      return new Date(a.scheduled_date) - new Date(b.scheduled_date);
    });
    
    const past = allBookings.filter(b => 
      b.booking_status === 'completed' || 
      b.booking_status === 'cancelled' ||
      b.booking_status === 'expired' ||
      (b.scheduled_date && new Date(b.scheduled_date) < now)
    ).sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
    
    setUpcomingBookings(upcoming);
    setPastBookings(past);
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
        
        // Auto-assign manager role if applicable
        if (currentUser && currentUser.email === 'roberta@robertafernandez.com' && currentUser.role === 'user') {
          await base44.functions.invoke('autoAssignManagerRole', {});
          window.location.reload();
        }
        
        // Fetch studio stats
        const stats = await base44.functions.invoke('getStudioStats', {});
        setStudioStats(stats.data);
        
        // Fetch daily prompt
        const prompts = await base44.entities.DailyPrompt.filter({ active: true });
        if (prompts.length > 0) {
          const today = new Date().getDate();
          setDailyPrompt(prompts[today % prompts.length]);
        }
        
        // Track app session and streak
        await base44.functions.invoke('trackEvent', {
          event_type: 'app_session',
          points: 1
        });
        
        await base44.functions.invoke('trackStreak', {
          action_type: 'dashboard_visited'
        });
        
        // Fetch personalized recommendations
        const recs = await base44.functions.invoke('getRecommendations', {});
        if (recs?.data?.recommendations) {
          setRecommendations(recs.data.recommendations);
        }
        
        // Fetch bookings
        await fetchBookings(currentUser);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    fetchUser();
  }, []);

  const handleUpdatePayment = () => {
    // TODO: Open Stripe billing portal
    // window.location.href = billingPortalUrl;
    console.log("Opening billing portal...");
  };

  const handleRefresh = async () => {
    try {
      await fetchBookings(user);
      const stats = await base44.functions.invoke('getStudioStats', {});
      setStudioStats(stats.data);
    } catch (error) {
      console.error('Refresh error:', error);
    }
  };
  
  const programs = useMemo(() => [
    {
      icon: Layers,
      title: "Cleaning Out Your Closet",
      status: "Not Enrolled",
      color: "#1E3A32",
      page: "CleaningOutYourCloset",
    },
    {
      icon: Sparkles,
      title: "Pocket Mindset™",
      status: "Not Enrolled",
      color: "#A6B7A3",
      page: "PocketMindset",
    },
  ], []);

  return (
    <div className="bg-[#F9F5EF] min-h-screen pt-32 pb-24">
      <AIClientAssistant variant="widget" />
      <PostMasterclassOnboarding />
      <MilestoneChecker />
      {user && <OnboardingModal role="user" />}
      <DashboardTooltips />
      <NotesDrawer
        isOpen={notesDrawerOpen}
        onClose={() => setNotesDrawerOpen(false)}
        sourceType="freeform"
      />
      
      {showStyleCheck && (
        <DailyStyleCheck
          onClose={() => setShowStyleCheck(false)}
          onComplete={(data) => {
            setShowStyleCheck(false);
            if (data?.showPauseSuggestion) {
              // Could show pause suggestion modal here
              // For now, user can navigate to Style Pauses via quick link
            }
          }}
        />
      )}
      
      <div 
        className="max-w-6xl mx-auto px-6"
        {...pullToRefreshHandlers}
      >
        <PaymentFailureBanner 
          status={subscriptionStatus}
          onUpdatePayment={handleUpdatePayment}
        />

        {/* Daily Style Check CTA - Featured at top */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-[#D8B46B] to-[#C9A55A] p-6 rounded-lg text-white">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h3 className="font-serif text-xl mb-2">
                  <CmsText cmsKey="dashboard.style_check.title" defaultText="Daily Style Check™" />
                </h3>
                <p className="text-white/90 text-sm">
                  <CmsText cmsKey="dashboard.style_check.subtitle" defaultText="Quick check-in • Everything optional" />
                </p>
              </div>
              <Button
                onClick={() => setShowStyleCheck(true)}
                className="bg-white text-[#1E3A32] hover:bg-white/90 min-h-[48px] px-6 w-full md:w-auto"
              >
                Check In Now
              </Button>
            </div>
          </div>
        </div>

        {/* Onboarding Quick Cards */}
         {user && <OnboardingQuickCards user={user} />}
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="touch-pan-y"
        >
          {/* Pull to Refresh Indicator */}
          {pullY > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: pullY / 100 }}
              className="flex justify-center py-4"
            >
              <div className={`text-[#D8B46B] ${isRefreshing ? 'animate-spin' : ''}`}>
                {isRefreshing ? '↻' : '↓'} {isRefreshing ? 'Refreshing...' : 'Pull to refresh'}
              </div>
            </motion.div>
          )}
          {/* Personalized Greeting */}
          <PersonalizedGreeting user={user} variant="dashboard" />

          {/* Next Session Widget - Featured */}
          {upcomingBookings.length > 0 && (
            <div className="mb-12">
              <NextSessionWidget booking={upcomingBookings[0]} />
            </div>
          )}



          {/* Mind Styling Studio Hub */}
          <div className="grid lg:grid-cols-2 gap-6 mb-12">
            <div data-tour="emotional-weather">
              <EmotionalWeather sentiment={studioStats?.sentiment} />
            </div>
            <div data-tour="daily-prompt">
              <DailyPocketPrompt 
                prompt={dailyPrompt?.prompt_text}
                onCreateNote={() => setNotesDrawerOpen(true)}
              />
            </div>
          </div>

          {/* Constellation & Momentum */}
          <div className="grid lg:grid-cols-2 gap-6 mb-12">
            <div data-tour="constellation">
              <ConstellationMap totalPoints={studioStats?.constellation?.totalPoints || 0} />
            </div>
            <div data-tour="momentum">
              <InnerMomentumMeter weeklyPoints={studioStats?.momentum?.weeklyPoints || 0} />
            </div>
          </div>

          {/* Upcoming Sessions */}
          {upcomingBookings.length > 0 && (
            <div className="mb-12">
              <h2 className="font-serif text-2xl text-[#1E3A32] mb-6">
                <CmsText cmsKey="dashboard.sessions.title" defaultText="Your Upcoming Sessions" />
              </h2>
              <UpcomingSessions 
                bookings={upcomingBookings} 
                onRefresh={async () => {
                  const currentUser = await base44.auth.me();
                  await fetchBookings(currentUser);
                }} 
              />
            </div>
          )}

          {/* Personalized Recommendations */}
          {recommendations.length > 0 && (
            <div className="mb-12">
              <h2 className="font-serif text-2xl text-[#1E3A32] mb-6">
                <CmsText cmsKey="dashboard.recommendations.title" defaultText="Suggested For You" />
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {recommendations.map((rec, index) => (
                  <RecommendationCard 
                    key={index} 
                    recommendation={rec}
                    onTakeAction={(prompt) => {
                      setDailyPrompt({ prompt_text: prompt });
                      setNotesDrawerOpen(true);
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Booking History */}
          {pastBookings.length > 0 && (
            <div className="mb-12">
              <h2 className="font-serif text-2xl text-[#1E3A32] mb-6">
                <CmsText cmsKey="dashboard.history.title" defaultText="Booking History" />
              </h2>
              <BookingHistory bookings={pastBookings} />
            </div>
          )}

          {/* Programs */}
          <div className="mb-12">
            <h2 className="font-serif text-xl text-[#1E3A32] mb-6">
              <CmsText cmsKey="dashboard.programs.title" defaultText="Your Programs" />
            </h2>
            {programs.length === 0 ? (
              <div className="bg-white p-8 text-center">
                <p className="text-[#2B2725]/70 leading-relaxed">
                  <CmsText 
                    cmsKey="dashboard.programs.empty" 
                    defaultText="You're not enrolled in any programs yet. Book a consultation with Roberta to explore Cleaning Out Your Closet™ or Pocket Mindset™ programs tailored to your transformation journey." 
                  />
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {programs.map((program) => (
                  <div
                    key={program.title}
                    className="bg-white p-8 border-l-4"
                    style={{ borderColor: program.color }}
                  >
                    <program.icon size={32} style={{ color: program.color }} className="mb-4" />
                    <h3 className="font-serif text-xl text-[#1E3A32] mb-3">{program.title}</h3>
                    <span className="inline-block px-3 py-1 bg-[#E4D9C4] text-[#2B2725]/70 text-sm rounded-full mb-4">
                      {program.status}
                    </span>
                    <div className="mt-4">
                      <Link 
                        to={createPageUrl(program.page)}
                        onClick={() => window.scrollTo(0, 0)}
                        className="text-[#1E3A32] text-sm font-medium hover:text-[#D8B46B] transition-colors"
                      >
                        Learn More →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div>
            <h2 className="font-serif text-xl text-[#1E3A32] mb-6">
              <CmsText cmsKey="dashboard.quicklinks.title" defaultText="Quick Links" />
            </h2>
            <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                { label: "Style Pauses™", page: "StylePauses", icon: Sparkles, descriptionKey: "dashboard.quicklinks.style_pauses", fallback: "1-3 minute resets." },
                { label: "Library", page: "Library", icon: Layers, descriptionKey: "dashboard.quicklinks.library", fallback: "Access your programs." },
                { label: "Pocket Mindset™", page: "PocketMindset", icon: Sparkles, descriptionKey: "dashboard.quicklinks.pocket_mindset", fallback: "Enter your favorite sessions in the notes section of your dashboard." },
                { label: "Notes", page: "StudioNotes", icon: Edit3, descriptionKey: "dashboard.quicklinks.notes", fallback: "Capture insights as you learn." },
                { label: "Free Masterclass", page: "FreeMasterclass", icon: Play, descriptionKey: "dashboard.quicklinks.masterclass", fallback: "Watch anytime." },
                { label: "Read Blog", page: "Blog", icon: BookOpen, descriptionKey: "dashboard.quicklinks.blog", fallback: "Articles and insights." },
              ].map((link) => (
                <Link
                  key={link.label}
                  to={createPageUrl(link.page)}
                  onClick={() => window.scrollTo(0, 0)}
                  className="bg-white p-4 hover:shadow-md transition-shadow flex flex-col gap-2 min-h-[100px] active:scale-98 touch-manipulation"
                >
                  <link.icon size={20} className="text-[#D8B46B]" />
                  <span className="text-[#1E3A32] text-sm font-medium">{link.label}</span>
                  <span className="text-[#2B2725]/60 text-xs">
                    <CmsText 
                      contentKey={link.descriptionKey}
                      page="Dashboard"
                      blockTitle={`Quick Link ${link.label} Description`}
                      fallback={link.fallback}
                      contentType="short_text"
                    />
                  </span>
                </Link>
              ))}
            </div>
          </div>
          </motion.div>

          {/* Smart Suggestions */}
          {suggestions.slice(0, 1).map((suggestion) => (
          <SmartSuggestion
            key={suggestion.id}
            trigger={suggestion.trigger}
            title={suggestion.title}
            description={suggestion.description}
            actionLabel={suggestion.actionLabel}
            actionLink={suggestion.actionLink}
          />
          ))}
          </div>
          </div>
          );
          }