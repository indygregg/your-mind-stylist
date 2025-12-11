import React from "react";
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