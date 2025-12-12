import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "../utils";
import { Button } from "@/components/ui/button";
import { CheckCircle, Calendar, Mail, Loader2, Video } from "lucide-react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";

export default function BookingSuccess() {
  const [sessionId, setSessionId] = useState(null);

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
                <div className="flex justify-between pt-2 border-t border-[#E4D9C4]">
                  <span className="text-[#2B2725]/70">Total:</span>
                  <span className="text-[#1E3A32] font-medium text-lg">
                    {formatAmount(booking.amount)}
                  </span>
                </div>
              </div>

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
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#2D8CFF] text-white text-sm hover:bg-[#2D8CFF]/90 transition-colors"
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
          <div className="bg-white p-8 mb-12 text-left">
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
                    You'll receive a confirmation email with your booking details and next steps.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-[#D8B46B]/20 flex items-center justify-center flex-shrink-0">
                  <Calendar size={24} className="text-[#D8B46B]" />
                </div>
                <div>
                  <h3 className="text-[#1E3A32] font-medium mb-2">
                    2. Schedule Your Sessions
                  </h3>
                  <p className="text-[#2B2725]/70 text-sm">
                    Within 24-48 hours, you'll receive a personalized email from Roberta to 
                    schedule your first session at a time that works for you.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-[#D8B46B]/20 flex items-center justify-center flex-shrink-0">
                  <CheckCircle size={24} className="text-[#D8B46B]" />
                </div>
                <div>
                  <h3 className="text-[#1E3A32] font-medium mb-2">
                    3. Begin Your Transformation
                  </h3>
                  <p className="text-[#2B2725]/70 text-sm">
                    Show up ready to explore, shift, and design the patterns that will serve 
                    you moving forward.
                  </p>
                </div>
              </div>
            </div>
          </div>

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