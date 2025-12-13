import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "../utils";
import { motion } from "framer-motion";
import { CheckCircle, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import SEO from "../components/SEO";

export default function PurchaseSuccess() {
  const [purchaseType, setPurchaseType] = useState("");
  const [paymentType, setPaymentType] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setPurchaseType(params.get("type") || "");
    setPaymentType(params.get("payment_type") || "");
  }, []);

  const getTitle = () => {
    if (purchaseType === "certification") {
      return "Welcome to Your Mind Styling Certification!";
    }
    return "Purchase Successful!";
  };

  const getDescription = () => {
    if (purchaseType === "certification") {
      if (paymentType.includes("payment_plan")) {
        return "Your payment plan is set up. Access your program now and start your transformation.";
      }
      return "Your full payment is confirmed. Access your program now and start your transformation.";
    }
    return "Thank you for your purchase. You now have access to your content.";
  };

  return (
    <div className="min-h-screen bg-[#F9F5EF] pt-32 pb-24">
      <SEO
        title="Purchase Successful | Your Mind Stylist"
        description="Your purchase was successful"
        canonical="/app/purchase/success"
      />
      <div className="max-w-3xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          {/* Success Icon */}
          <div className="w-24 h-24 bg-[#A6B7A3] rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle size={48} className="text-white" />
          </div>

          {/* Title */}
          <h1 className="font-serif text-3xl md:text-4xl text-[#1E3A32] mb-4">
            {getTitle()}
          </h1>
          
          {/* Description */}
          <p className="text-lg text-[#2B2725]/80 mb-12 max-w-xl mx-auto">
            {getDescription()}
          </p>

          {/* What's Next */}
          <div className="bg-white p-8 mb-8 text-left">
            <div className="flex items-center gap-3 mb-6">
              <Sparkles className="text-[#D8B46B]" size={24} />
              <h2 className="font-serif text-2xl text-[#1E3A32]">What's Next?</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-[#1E3A32] text-[#F9F5EF] flex items-center justify-center flex-shrink-0 font-medium">
                  1
                </div>
                <div>
                  <h3 className="font-medium text-[#1E3A32] mb-1">Check Your Email</h3>
                  <p className="text-[#2B2725]/70 text-sm">
                    You'll receive a confirmation email with your purchase details and access instructions.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-[#1E3A32] text-[#F9F5EF] flex items-center justify-center flex-shrink-0 font-medium">
                  2
                </div>
                <div>
                  <h3 className="font-medium text-[#1E3A32] mb-1">Access Your Content</h3>
                  <p className="text-[#2B2725]/70 text-sm">
                    Head to your library to start exploring your new program.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-[#1E3A32] text-[#F9F5EF] flex items-center justify-center flex-shrink-0 font-medium">
                  3
                </div>
                <div>
                  <h3 className="font-medium text-[#1E3A32] mb-1">Begin Your Journey</h3>
                  <p className="text-[#2B2725]/70 text-sm">
                    Start with the first module and move at your own pace.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={createPageUrl("Library")}>
              <Button className="bg-[#1E3A32] hover:bg-[#2B2725] text-[#F9F5EF] px-8 py-6 text-lg">
                Go to Library
                <ArrowRight size={20} className="ml-2" />
              </Button>
            </Link>
            <Link to={createPageUrl("Dashboard")}>
              <Button variant="outline" className="border-[#1E3A32] text-[#1E3A32] px-8 py-6 text-lg">
                View Dashboard
              </Button>
            </Link>
          </div>

          {/* Support */}
          <div className="mt-12 pt-8 border-t border-[#E4D9C4]">
            <p className="text-sm text-[#2B2725]/60">
              Have questions? <Link to={createPageUrl("Contact")} className="text-[#D8B46B] hover:underline">Contact us</Link> for support.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}