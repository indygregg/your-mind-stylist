import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SEO from "../components/SEO";
import HeroSection from "../components/home/HeroSection";
import SocialProofStrip from "../components/home/SocialProofStrip";
import WhatIDo from "../components/home/WhatIDo";
import MindStylingSuite from "../components/home/MindStylingSuite";
import FreeMasterclass from "../components/home/FreeMasterclass";
import Testimonials from "../components/home/Testimonials";
import ContentHub from "../components/home/ContentHub";
import FinalCTA from "../components/home/FinalCTA";
import { base44 } from "@/api/base44Client";
import { createPageUrl } from "../utils";

export default function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthAndRedirect = async () => {
      const isAuth = await base44.auth.isAuthenticated();
      if (isAuth) {
        const user = await base44.auth.me();
        const userRole = user?.custom_role || user?.role;
        // Only redirect regular users, let managers/admins view marketing pages
        if (userRole !== "manager" && userRole !== "admin") {
          navigate(createPageUrl("Dashboard"));
        }
      }
    };
    checkAuthAndRedirect();
  }, [navigate]);
  return (
    <div className="bg-[#F9F5EF]">
      <SEO
        title="Your Mind Stylist | Emotional Intelligence & Mindset Transformation"
        description="Emotional intelligence, mind styling, and inner transformation with Your Mind Stylist, Roberta Fernandez. Rewrite your patterns and restyle your life from the inside out."
        canonical="/"
      />
      <HeroSection />
      <SocialProofStrip />
      <WhatIDo />
      <MindStylingSuite />
      <FreeMasterclass />
      <Testimonials />
      <ContentHub />
      <FinalCTA />
    </div>
  );
}