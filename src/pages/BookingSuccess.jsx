import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "../utils";
import { Button } from "@/components/ui/button";
import { CheckCircle, Calendar, Mail, Loader2, Video, Download, Bell, Plus, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import ReflectionPrompt from "../components/transformation/ReflectionPrompt";

export default function BookingSuccess() {
  const [sessionId, setSessionId] = useState(null);
  const [showReflection, setShowReflection] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sid = params.get("session_id");
    setSessionId(sid);

    // Celebrate with confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  }, []);

  // Fetch booking details
  const { data: booking, isLoading } = useQuery({
    queryKey: ["booking-success", sessionId],
    queryFn: async () => {
      if (!sessionId) return null;
      const bookings = await base44.entities.Booking.filter({
        stripe_checkout_session_id: sessionId,
      });
      return bookings[0] || null;
    },
    enabled: !!sessionId,
  });

  const formatAmount = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount / 100);
  };

  const handleAddToCalendar = () => {
    if (!booking || !booking.scheduled_date) return;
    
    const startDate = new Date(booking.scheduled_date);
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // 1 hour later
    
    const title = `Mind Styling Session - ${booking.service_type?.replace(/_/g, ' ')}`;
    const description = `Private Mind Styling session with Roberta Fernandez${booking.zoom_join_url ? `\n\nZoom Link: ${booking.zoom_join_url}` : ''}`;
    const location = booking.zoom_join_url || "Virtual";

    // Generate Google Calendar URL
    const googleCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${startDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z/${endDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z&details=${encodeURIComponent(description)}&location=${encodeURIComponent(location)}`;
    
    window.open(googleCalUrl, '_blank');
  };

  const handleDownloadICS = () => {
    if (!booking || !booking.scheduled_date) return;
    
    const startDate = new Date(booking.scheduled_date);
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);
    
    const formatDate = (date) => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'BEGIN:VEVENT',
      `DTSTART:${formatDate(startDate)}`,
      `DTEND:${formatDate(endDate)}`,
      `SUMMARY:Mind Styling Session - ${booking.service_type?.replace(/_/g, ' ')}`,
      `DESCRIPTION:Private Mind Styling session with Roberta Fernandez${booking.zoom_join_url ? `\\n\\nZoom Link: ${booking.zoom_join_url}` : ''}`,
      `LOCATION:${booking.zoom_join_url || 'Virtual'}`,
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'mind-styling-session.ics';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  if (isLoading && sessionId) {
    return (
      <div className="min-h-screen bg-[#F9F5EF] flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={48} className="animate-spin text-[#D8B46B] mx-auto mb-4" />
          <p className="text-[#2B2725]/70">Loading your booking details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F5EF] pt-32 pb-24">
      <div className="max-w-3xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="mb-8">
            <CheckCircle size={80} className="text-[#A6B7A3] mx-auto" />
          </div>

          <h1 className="font-serif text-4xl md:text-5xl text-[#1E3A32] mb-6">
            Your Booking is Confirmed!
          </h1>

          <p className="text-[#2B2725]/80 text-lg leading-relaxed mb-8 max-w-2xl mx-auto">
            Thank you for investing in your transformation. Your payment has been received, 
            and your private Mind Styling sessions are confirmed.
          </p>

          {/* Booking Summary */}
          {booking && (
            <div className="bg-white border border-[#E4D9C4] p-6 mb-8 max-w-xl mx-auto">
              <h3 className="font-medium text-[#1E3A32] mb-4">Booking Summary</h3>
              <div className="space-y-2 text-left">
                <div className="flex justify-between">
                  <span className="text-[#2B2725]/70">Service:</span>
                  <span className="text-[#1E3A32] font-medium">
                    {booking.service_type?.replace("_", " ").toUpperCase()}
                  </span>
                </div>
                {booking.session_count && (
                  <div className="flex justify-between">
                    <span className="text-[#2B2725]/70">Sessions:</span>
                    <span className="text-[#1E3A32] font-medium">{booking.session_count}</span>
                  </div>
                )}
                {booking.scheduled_date && (
                  <div className="flex justify-between">
                    <span className="text-[#2B2725]/70">Scheduled:</span>
                    <span className="text-[#1E3A32] font-medium">
                      {format(new Date(booking.scheduled_date), 'MMM d, yyyy • h:mm a')}
                    </span>
                  </div>
                )}
                <div className="flex justify-between pt-2 border-t border-[#E4D9C4]">
                  <span className="text-[#2B2725]/70">Total:</span>
                  <span className="text-[#1E3A32] font-medium text-lg">
                    {formatAmount(booking.amount)}
                  </span>
                </div>
              </div>

              {/* Calendar Actions */}
              {booking.scheduled_date && (
                <div className="mt-6 pt-6 border-t border-[#E4D9C4]">
                  <p className="text-sm text-[#2B2725]/70 mb-3 flex items-center gap-2">
                    <Calendar size={16} className="text-[#D8B46B]" />
                    Add to your calendar
                  </p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleAddToCalendar}
                      className="flex-1"
                    >
                      <Plus size={14} className="mr-2" />
                      Google Calendar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleDownloadICS}
                      className="flex-1"
                    >
                      <Download size={14} className="mr-2" />
                      Download .ics
                    </Button>
                  </div>
                </div>
              )}

              {/* Zoom Meeting Link */}
              {booking.zoom_status === 'created' && booking.zoom_join_url && (
                <div className="mt-6 pt-6 border-t border-[#E4D9C4]">
                  <div className="flex items-center gap-2 mb-3">
                    <Video size={20} className="text-[#2D8CFF]" />
                    <h4 className="font-medium text-[#1E3A32]">Your Zoom Meeting</h4>
                  </div>
                  <p className="text-sm text-[#2B2725]/70 mb-3">
                    Your virtual session link is ready. You'll also receive this in your confirmation email.
                  </p>
                  <a
                    href={booking.zoom_join_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#2D8CFF] text-white text-sm hover:bg-[#2D8CFF]/90 transition-colors w-full justify-center"
                  >
                    <Video size={16} />
                    Join Zoom Meeting
                  </a>
                  {booking.zoom_password && (
                    <p className="text-xs text-[#2B2725]/60 mt-3">
                      Meeting Password: <span className="font-mono font-medium">{booking.zoom_password}</span>
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Next Steps */}
          <div className="bg-white p-8 mb-8 text-left">
            <h2 className="font-serif text-2xl text-[#1E3A32] mb-6 text-center">
              What Happens Next
            </h2>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-[#D8B46B]/20 flex items-center justify-center flex-shrink-0">
                  <Mail size={24} className="text-[#D8B46B]" />
                </div>
                <div>
                  <h3 className="text-[#1E3A32] font-medium mb-2">
                    1. Check Your Email
                  </h3>
                  <p className="text-[#2B2725]/70 text-sm">
                    You'll receive a confirmation email with your booking details, Zoom link, and next steps within minutes.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-[#D8B46B]/20 flex items-center justify-center flex-shrink-0">
                  <Bell size={24} className="text-[#D8B46B]" />
                </div>
                <div>
                  <h3 className="text-[#1E3A32] font-medium mb-2">
                    2. Receive Reminders
                  </h3>
                  <p className="text-[#2B2725]/70 text-sm">
                    You'll get automated reminders 24 hours and 1 hour before your session to help you prepare.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-[#D8B46B]/20 flex items-center justify-center flex-shrink-0">
                  <Calendar size={24} className="text-[#D8B46B]" />
                </div>
                <div>
                  <h3 className="text-[#1E3A32] font-medium mb-2">
                    3. Prepare for Your Session
                  </h3>
                  <p className="text-[#2B2725]/70 text-sm">
                    Add the session to your calendar using the buttons above. Find a quiet space where you can focus without distractions.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-[#D8B46B]/20 flex items-center justify-center flex-shrink-0">
                  <CheckCircle size={24} className="text-[#D8B46B]" />
                </div>
                <div>
                  <h3 className="text-[#1E3A32] font-medium mb-2">
                    4. Begin Your Transformation
                  </h3>
                  <p className="text-[#2B2725]/70 text-sm">
                    Show up ready to explore, shift, and design the patterns that will serve you moving forward.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Helpful Tips */}
          <div className="bg-[#F9F5EF] border-2 border-[#D8B46B]/30 p-6 mb-12 max-w-2xl mx-auto">
            <h3 className="font-medium text-[#1E3A32] mb-3 text-center">💡 Quick Tips</h3>
            <ul className="space-y-2 text-sm text-[#2B2725]/80">
              <li className="flex items-start gap-2">
                <span className="text-[#D8B46B] mt-1">•</span>
                <span>Test your Zoom connection before the session to ensure everything works smoothly</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#D8B46B] mt-1">•</span>
                <span>Have a notebook handy to capture insights and action steps</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#D8B46B] mt-1">•</span>
                <span>Need to reschedule? You can manage your bookings from your dashboard</span>
              </li>
            </ul>
          </div>

          {/* Reflection Prompt */}
          {booking && (
            <div className="mb-8">
              <Button
                onClick={() => setShowReflection(true)}
                variant="outline"
                className="border-[#D8B46B] text-[#D8B46B] hover:bg-[#D8B46B] hover:text-[#1E3A32]"
              >
                <Sparkles size={18} className="mr-2" />
                Reflect on Your Decision
              </Button>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={createPageUrl("Dashboard")}>
              <Button className="bg-[#1E3A32] hover:bg-[#2B2725] px-8">
                Go to Dashboard
              </Button>
            </Link>
            <Link to={createPageUrl("Home")}>
              <Button variant="outline" className="border-[#1E3A32] text-[#1E3A32] px-8">
                Return Home
              </Button>
            </Link>
          </div>
          
          {showReflection && booking && (
            <ReflectionPrompt
              reflectionType="consultation"
              relatedId={booking.id}
              relatedTitle={`${booking.service_type?.replace("_", " ")} Session - ${format(new Date(booking.scheduled_date || Date.now()), 'MMM d, yyyy')}`}
              onComplete={() => setShowReflection(false)}
              onSkip={() => setShowReflection(false)}
              promptText="You've just committed to your transformation. What are you feeling right now?"
              showMoodTracking={true}
              showBreakthroughTag={false}
            />
          )}

          {sessionId && (
            <p className="text-[#2B2725]/40 text-xs mt-8">
              Session ID: {sessionId}
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
}