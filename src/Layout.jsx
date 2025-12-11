import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "./utils";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Layout({ children, currentPageName }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", page: "Home" },
    { name: "About", page: "About" },
    { name: "Certification", page: "Certification" },
    { name: "Private Work", page: "PrivateSessions" },
    { name: "Inner Rehearsal", page: "InnerRehearsal" },
    { name: "Speaking", page: "SpeakingTraining" },
    { name: "Podcast", page: "Podcast" },
    { name: "Blog", page: "Blog" },
    { name: "Contact", page: "Contact" },
  ];

  return (
    <div className="min-h-screen bg-[#F9F5EF]">
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
        {/* Micro Header */}
        <div className="hidden lg:block border-b border-[#D8B46B]/20">
          <div className="max-w-7xl mx-auto px-6 py-2 flex justify-between items-center">
            <p className="text-xs tracking-[0.2em] text-[#2B2725]/60 uppercase font-light">
              Las Vegas • Emotional Intelligence • Mind Styling • Leadership & Personal Transformation
            </p>
            <Link
              to={createPageUrl("Contact")}
              className="text-xs tracking-wide text-[#1E3A32] hover:text-[#D8B46B] transition-colors font-medium"
            >
              Schedule Your Complimentary Consultation
            </Link>
          </div>
        </div>

        {/* Main Nav */}
        <nav className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link to={createPageUrl("Home")} className="group">
            <div className="flex flex-col">
              <span className="text-[10px] md:text-xs text-[#2B2725]/60 tracking-[0.2em] uppercase">
                Roberta Fernandez
              </span>
              <span className="font-serif font-bold text-lg md:text-xl text-[#1E3A32] tracking-wide">
                The Mind Stylist
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.page}
                to={createPageUrl(link.page)}
                className={`text-sm tracking-wide transition-all duration-300 relative group ${
                  currentPageName === link.page
                    ? "text-[#1E3A32]"
                    : "text-[#2B2725]/70 hover:text-[#1E3A32]"
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
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-[#1E3A32]"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-[#F9F5EF] border-t border-[#D8B46B]/20"
            >
              <div className="px-6 py-8 flex flex-col gap-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.page}
                    to={createPageUrl(link.page)}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`text-lg py-2 border-b border-[#E4D9C4] ${
                      currentPageName === link.page
                        ? "text-[#1E3A32] font-medium"
                        : "text-[#2B2725]/70"
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
                <Link
                  to={createPageUrl("Contact")}
                  onClick={() => setMobileMenuOpen(false)}
                  className="mt-4 px-6 py-3 bg-[#1E3A32] text-[#F9F5EF] text-center text-sm tracking-wide"
                >
                  Book Consultation
                </Link>
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
              <p className="text-[#F9F5EF]/60 text-xs tracking-[0.2em] uppercase mb-2">
                Roberta Fernandez
              </p>
              <h3 className="font-serif font-bold text-3xl md:text-4xl text-[#F9F5EF] mb-6">
                The Mind Stylist
              </h3>
              <p className="text-[#F9F5EF]/70 text-sm leading-relaxed">
                Emotional Intelligence • Mind Styling
                <br />
                Leadership & Personal Transformation
              </p>
              <p className="text-[#F9F5EF]/50 text-sm mt-4">Las Vegas, NV</p>
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
              © {new Date().getFullYear()} The Mind Stylist. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-xs text-[#F9F5EF]/40 hover:text-[#D8B46B] transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-xs text-[#F9F5EF]/40 hover:text-[#D8B46B] transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}