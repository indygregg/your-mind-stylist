import React from "react";
import SEO from "../components/SEO";
import HeroSection from "../components/home/HeroSection";
import SocialProofStrip from "../components/home/SocialProofStrip";
import WhatIDo from "../components/home/WhatIDo";
import MindStylingSuite from "../components/home/MindStylingSuite";
import FreeMasterclass from "../components/home/FreeMasterclass";
import Testimonials from "../components/home/Testimonials";
import ContentHub from "../components/home/ContentHub";
import FinalCTA from "../components/home/FinalCTA";

export default function Home() {
  return (
    <div className="bg-[#F9F5EF]">
      <SEO
        title="The Mind Stylist | Emotional Intelligence & Mindset Transformation"
        description="Emotional intelligence, mind styling, and inner transformation with The Mind Stylist, Roberta Fernandez. Rewrite your patterns and restyle your life from the inside out."
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