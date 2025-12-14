import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "./utils";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet";
import CookieBanner from "./components/legal/CookieBanner";
import AuthLayout from "./components/AuthLayout";
import ScrollToTop from "./components/ScrollToTop";
import AccessibilityWidget from "./components/accessibility/AccessibilityWidget";
import { base44 } from "@/api/base44Client";
import { EditModeProvider } from "./components/cms/EditModeProvider";
import ManagerBar from "./components/cms/ManagerBar";
import haptics from "./components/utils/haptics";

export default function Layout({ children, currentPageName }) {
  const [useAuthLayout, setUseAuthLayout] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);

  useEffect(() => {
    const checkAuthPages = async () => {
      // Skip layout rendering for login/auth pages
      if (!currentPageName) return;
      
      // Pattern-based detection for authenticated pages
      const isAuthPage = 
        currentPageName.startsWith('Admin') ||
        currentPageName.startsWith('Studio') ||
        currentPageName.startsWith('Manager') ||
        ['Dashboard', 'PurchaseCenter', 'Library', 'TransformationStory', 'Resources'].includes(currentPageName) ||
        currentPageName.endsWith('Editor') ||
        currentPageName.endsWith('Manager');
      
      if (isAuthPage) {
        const isAuth = await base44.auth.isAuthenticated();
        setUseAuthLayout(isAuth);
      }
    };
    checkAuthPages();
  }, [currentPageName]);

  useEffect(() => {
    if (!useAuthLayout) {
      const handleScroll = () => {
        setIsScrolled(window.scrollY > 50);
      };
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, [useAuthLayout]);

  // Return AuthLayout if authenticated page
  if (useAuthLayout) {
    return <AuthLayout currentPageName={currentPageName}>{children}</AuthLayout>;
  }

  const navLinks = [
    { name: "Home", page: "Home" },
    { name: "About", page: "About" },
    { name: "Book a Session", page: "Bookings" },
    { name: "Podcast", page: "Podcast" },
    { name: "Blog", page: "Blog" },
    { name: "Contact", page: "Contact" },
  ];

  const servicesMenu = [
    {
      category: "Transformational Programs",
      items: [
        { name: "All Programs & Pricing", page: "Programs", description: "Explore all offerings" },
        { name: "Cleaning Out Your Closet", page: "CleaningOutYourCloset", description: "One-on-one hypnosis work" },
        { name: "Pocket Mindset™", page: "PocketVisualization", description: "Daily guided experiences" },
      ]
    },
    {
      category: "Professional Development",
      items: [
        { name: "Hypnosis Training", page: "LearnHypnosis", description: "Become a certified hypnotist" },
        { name: "Speaking & Training", page: "SpeakingTraining", description: "Mind Styling for Organizations" },
      ]
    },
    {
      category: "Private Work",
      items: [
        { name: "Private Sessions", page: "PrivateSessions", description: "Intensive personal coaching" },
      ]
    }
  ];

  // Don't render layout for pages without a name (like login)
  if (!currentPageName) {
    return <>{children}</>;
  }

  return (
    <EditModeProvider>
      <Helmet>
        <title>Your Mind Stylist</title>
        <link rel="icon" type="image/png" href="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/693a98b3e154ab3b36c88ebb/7d5c32b99_Mind-stylist-dark-icon2x.png" />
      </Helmet>
      <div className="min-h-screen bg-[#F9F5EF]">
        <ManagerBar />
        <ScrollToTop />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,500;1,600&family=Inter:wght@300;400;500;600;700&display=swap');
        
        :root {
          --forest-green: #1E3A32;
          --soft-gold: #D8B46B;
          --cream: #F9F5EF;
          --charcoal: #2B2725;
          --dusty-sage: #A6B7A3;
          --soft-plum: #6E4F7D;
          --warm-sand: #E4D9C4;
        }
        
        body {
          font-family: 'Inter', sans-serif;
          background-color: var(--cream);
        }
        
        h1, h2, h3, h4, h5, h6 {
          font-family: 'Playfair Display', serif;
        }
        
        .font-serif {
          font-family: 'Playfair Display', serif;
        }
        
        .font-sans {
          font-family: 'Inter', sans-serif;
        }
      `}</style>

      {/* Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-[#F9F5EF]/95 backdrop-blur-md shadow-sm"
            : "bg-transparent"
        }`}
      >
        {/* Determine if page has dark hero */}
        {(() => {
          const darkHeroPages = ['Bookings', 'Contact'];
          const hasDarkHero = darkHeroPages.includes(currentPageName) && !isScrolled;
          const textColorClass = hasDarkHero ? 'text-white' : 'text-[#2B2725]';
          const textColorOpacity = hasDarkHero ? 'text-white/80' : 'text-[#2B2725]/60';
          const logoSrc = hasDarkHero 
            ? 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/693a98b3e154ab3b36c88ebb/60b825e58_Mind-stylist-light-icon2x.png'
            : 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/693a98b3e154ab3b36c88ebb/7d5c32b99_Mind-stylist-dark-icon2x.png';
          
          return (
            <>
        {/* Micro Header */}
        <div className={`hidden lg:block border-b ${hasDarkHero ? 'border-white/20' : 'border-[#D8B46B]/20'}`}>
          <div className="max-w-7xl mx-auto px-6 py-2 flex justify-between items-center">
            <p className={`text-xs tracking-[0.2em] ${textColorOpacity} uppercase font-light`}>
              Las Vegas • Emotional Intelligence • Mind Styling • Hypnosis • Professional Development
            </p>
            <Link
              to={createPageUrl("Bookings")}
              className={`text-xs tracking-wide ${hasDarkHero ? 'text-white hover:text-[#D8B46B]' : 'text-[#1E3A32] hover:text-[#D8B46B]'} transition-colors font-medium`}
            >
              Schedule Your Complimentary Consultation
            </Link>
          </div>
        </div>

        {/* Main Nav */}
        <nav className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link to={createPageUrl("Home")} className="group flex items-center gap-3">
            <img 
              src={logoSrc} 
              alt="Your Mind Stylist Logo" 
              className="w-10 h-10 md:w-12 md:h-12 flex-shrink-0 object-contain"
            />
            <div className="flex flex-col">
              <span className={`text-[10px] md:text-xs ${textColorOpacity} tracking-[0.2em] uppercase`}>
                Roberta Fernandez
              </span>
              <span className={`font-serif font-bold text-lg md:text-xl ${hasDarkHero ? 'text-white' : 'text-[#1E3A32]'} tracking-wide`}>
                Your Mind Stylist
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-6">
            <Link
              to={createPageUrl("Home")}
              className={`text-sm tracking-wide transition-all duration-300 relative group ${
                currentPageName === "Home"
                  ? (hasDarkHero ? "text-white" : "text-[#1E3A32]")
                  : (hasDarkHero ? "text-white/80 hover:text-white" : "text-[#2B2725]/70 hover:text-[#1E3A32]")
              }`}
            >
              Home
              <span
                className={`absolute -bottom-1 left-0 h-[1px] bg-[#D8B46B] transition-all duration-300 ${
                  currentPageName === "Home" ? "w-full" : "w-0 group-hover:w-full"
                }`}
              />
            </Link>

            {/* Services Mega Menu */}
            <div 
              className="relative"
              onMouseEnter={() => setServicesOpen(true)}
              onMouseLeave={() => setServicesOpen(false)}
            >
              <button
                className={`text-sm tracking-wide transition-all duration-300 relative group ${
                  hasDarkHero ? "text-white/80 hover:text-white" : "text-[#2B2725]/70 hover:text-[#1E3A32]"
                }`}
              >
                Services
                <span
                  className={`absolute -bottom-1 left-0 h-[1px] bg-[#D8B46B] transition-all duration-300 ${
                    servicesOpen ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </button>

              <AnimatePresence>
                {servicesOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full right-0 mt-4 bg-white shadow-2xl border border-[#E4D9C4] min-w-[700px] z-50"
                  >
                    <div className="grid grid-cols-3 gap-6 p-8">
                      {servicesMenu.map((section) => (
                        <div key={section.category}>
                          <h3 className="font-serif text-sm text-[#D8B46B] tracking-wider uppercase mb-4">
                            {section.category}
                          </h3>
                          <div className="space-y-3">
                            {section.items.map((item) => (
                              <Link
                                key={item.page}
                                to={createPageUrl(item.page)}
                                className="block group"
                              >
                                <p className="text-[#1E3A32] font-medium mb-1 group-hover:text-[#D8B46B] transition-colors">
                                  {item.name}
                                </p>
                                <p className="text-xs text-[#2B2725]/60">
                                  {item.description}
                                </p>
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
                </AnimatePresence>
                </div>

                {navLinks.slice(1).map((link) => (
                <Link
                key={link.page}
                to={createPageUrl(link.page)}
                className={`text-sm tracking-wide transition-all duration-300 relative group ${
                  currentPageName === link.page
                    ? (hasDarkHero ? "text-white" : "text-[#1E3A32]")
                    : (hasDarkHero ? "text-white/80 hover:text-white" : "text-[#2B2725]/70 hover:text-[#1E3A32]")
                }`}
                >
                {link.name}
                <span
                  className={`absolute -bottom-1 left-0 h-[1px] bg-[#D8B46B] transition-all duration-300 ${
                    currentPageName === link.page ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
                </Link>
                ))}

                <div className={`flex items-center gap-3 ml-6 pl-6 border-l ${hasDarkHero ? 'border-white/20' : 'border-[#D8B46B]/20'}`}>
                  <a
                    href="https://yourmindstylist.com/login"
                    className={`text-sm tracking-wide ${hasDarkHero ? 'text-white/80 hover:text-white' : 'text-[#2B2725]/70 hover:text-[#1E3A32]'} transition-colors`}
                  >
                    Login
                  </a>
                  <a
                    href="https://yourmindstylist.com/login"
                    className={`px-5 py-2 ${hasDarkHero ? 'bg-white text-[#1E3A32] hover:bg-[#F9F5EF]' : 'bg-[#1E3A32] text-[#F9F5EF] hover:bg-[#2B2725]'} text-sm tracking-wide transition-all duration-300`}
                  >
                    Get Started
                  </a>
                </div>
                </div>

                {/* Mobile Menu Button */}
                <button
                  onClick={() => {
                    haptics.light();
                    setMobileMenuOpen(!mobileMenuOpen);
                  }}
                  className={`lg:hidden p-3 ${hasDarkHero ? 'text-white hover:bg-white/10' : 'text-[#1E3A32] hover:bg-[#1E3A32]/5'} rounded-lg transition-colors active:scale-95 min-w-[44px] min-h-[44px] flex items-center justify-center`}
                >
                  {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
                </nav>
                </>
                );
                })()}

        <CookieBanner />
        <AccessibilityWidget />

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-[#F9F5EF] border-t border-[#D8B46B]/20 max-h-[calc(100vh-80px)] overflow-y-auto"
            >
              <div className="px-6 py-8 flex flex-col gap-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.page}
                    to={createPageUrl(link.page)}
                    onClick={() => {
                      haptics.light();
                      setMobileMenuOpen(false);
                    }}
                    className={`text-lg py-4 px-4 rounded-lg transition-colors active:scale-98 min-h-[52px] flex items-center ${
                      currentPageName === link.page
                        ? "text-[#1E3A32] font-medium bg-[#D8B46B]/10"
                        : "text-[#2B2725]/70 hover:bg-[#E4D9C4]/50"
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
                <div className="mt-6 pt-4 border-t border-[#E4D9C4] flex flex-col gap-3">
                  <a
                    href="https://yourmindstylist.com/login"
                    onClick={() => haptics.light()}
                    className="px-6 py-4 border border-[#1E3A32] text-[#1E3A32] text-center text-sm tracking-wide rounded-lg hover:bg-[#1E3A32]/5 active:scale-98 transition-all min-h-[52px] flex items-center justify-center"
                  >
                    Login
                  </a>
                  <a
                    href="https://yourmindstylist.com/login"
                    onClick={() => haptics.medium()}
                    className="px-6 py-4 bg-[#1E3A32] text-[#F9F5EF] text-center text-sm tracking-wide rounded-lg hover:bg-[#2B2725] active:scale-98 transition-all min-h-[52px] flex items-center justify-center"
                  >
                    Get Started
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content */}
      <main>{children}</main>

      {/* Footer */}
      <footer className="bg-[#1E3A32] text-[#F9F5EF]">
        <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
          <div className="grid md:grid-cols-3 gap-12 md:gap-8">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                  <img 
                    src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/693a98b3e154ab3b36c88ebb/60b825e58_Mind-stylist-light-icon2x.png" 
                    alt="Your Mind Stylist Logo" 
                    className="w-12 h-12 flex-shrink-0 object-contain"
                  />
                <div>
                  <p className="text-[#F9F5EF]/60 text-xs tracking-[0.2em] uppercase mb-1">
                    Roberta Fernandez
                  </p>
                  <h3 className="font-serif font-bold text-2xl text-[#F9F5EF]">
                    Your Mind Stylist
                  </h3>
                </div>
              </div>
              <p className="text-[#F9F5EF]/70 text-sm leading-relaxed mb-4">
                Emotional Intelligence • Mind Styling • Hypnosis • Professional Development
              </p>
              <div className="text-[#F9F5EF]/70 text-sm space-y-1">
                <p>8724 Spanish Ridge Ave #B</p>
                <p>Las Vegas, NV 89148</p>
                <p className="mt-2">612-839-2295</p>
                <p>roberta@yourmindstylist.com</p>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-[#D8B46B] text-xs tracking-[0.2em] uppercase mb-6">
                Quick Links
              </h4>
              <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                {navLinks.map((link) => (
                  <Link
                    key={link.page}
                    to={createPageUrl(link.page)}
                    className="text-sm text-[#F9F5EF]/70 hover:text-[#D8B46B] transition-colors"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-[#D8B46B] text-xs tracking-[0.2em] uppercase mb-6">
                Connect
              </h4>
              <p className="text-[#F9F5EF]/70 text-sm mb-6 leading-relaxed">
                Ready to transform how you think?
                <br />
                Let's start a conversation.
              </p>
              <Link
                to={createPageUrl("Contact")}
                className="inline-flex items-center gap-2 px-6 py-3 border border-[#D8B46B] text-[#D8B46B] text-sm tracking-wide hover:bg-[#D8B46B] hover:text-[#1E3A32] transition-all duration-300"
              >
                Get in Touch
              </Link>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-16 pt-8 border-t border-[#F9F5EF]/10 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-[#F9F5EF]/40">
              © {new Date().getFullYear()} Your Mind Stylist. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link to={createPageUrl("LegalPage?slug=privacy-policy")} className="text-xs text-[#F9F5EF]/40 hover:text-[#D8B46B] transition-colors">
                Privacy Policy
              </Link>
              <Link to={createPageUrl("LegalPage?slug=terms-of-service")} className="text-xs text-[#F9F5EF]/40 hover:text-[#D8B46B] transition-colors">
                Terms of Service
              </Link>
              <Link to={createPageUrl("LegalPage?slug=cookie-policy")} className="text-xs text-[#F9F5EF]/40 hover:text-[#D8B46B] transition-colors">
                Cookies
              </Link>
              <Link to={createPageUrl("Accessibility")} className="text-xs text-[#F9F5EF]/40 hover:text-[#D8B46B] transition-colors">
                Accessibility
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
    </EditModeProvider>
  );
}