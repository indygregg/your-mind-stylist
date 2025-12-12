import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "../utils";
import { Button } from "@/components/ui/button";
import { CheckCircle, Calendar, Mail } from "lucide-react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";

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

          <p className="text-[#2B2725]/80 text-lg leading-relaxed mb-12 max-w-2xl mx-auto">
            Thank you for investing in your transformation. Your payment has been received, 
            and your private Mind Styling sessions are confirmed.
          </p>

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