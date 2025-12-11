import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "../utils";
import { base44 } from "@/api/base44Client";
import { Menu, X, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import MobileBottomNav from "./MobileBottomNav";

export default function AuthLayout({ children, currentPageName }) {
  const [user, setUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = () => {
    base44.auth.logout();
  };

  // Role-based navigation
  const getNavLinks = () => {
    if (!user) return [];

    const commonLinks = [
      { name: "Dashboard", page: user.role === "admin" ? "AdminDashboard" : user.role === "manager" ? "ManagerDashboard" : "Dashboard" },
    ];

    if (user.role === "admin") {
      return [
        ...commonLinks,
        { name: "Studio", page: "StudioDashboard" },
        { name: "Roadmap", page: "AdminRoadmap" },
        { name: "Users", page: "AdminUsers" },
        { name: "Settings", page: "StudioSettings" },
      ];
    }

    if (user.role === "manager") {
      return [
        ...commonLinks,
        { name: "Blog", page: "BlogManager" },
        { name: "Author Profile", page: "AuthorProfile" },
        { name: "Courses", page: "CourseManager" },
        { name: "Audio", page: "AudioManager" },
        { name: "Messages", page: "MessagesManager" },
      ];
    }

    // Regular user
    return [
      ...commonLinks,
      { name: "Library", page: "Library" },
      { name: "Programs", page: "Programs" },
      { name: "Notes", page: "StudioNotes" },
      { name: "Blog", page: "Blog" },
    ];
  };

  const navLinks = getNavLinks();

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
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#1E3A32] shadow-md">
        {/* Main Nav */}
        <nav className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link to={createPageUrl(navLinks[0]?.page || "Dashboard")} className="group">
            <div className="flex flex-col">
              <span className="text-[8px] md:text-[10px] text-[#F9F5EF]/60 tracking-[0.2em] uppercase">
                Roberta Fernandez
              </span>
              <span className="font-serif font-bold text-base md:text-lg text-[#F9F5EF] tracking-wide">
                Your Mind Stylist
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
                    ? "text-[#F9F5EF]"
                    : "text-[#F9F5EF]/70 hover:text-[#F9F5EF]"
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

            {/* User Menu */}
            <div className="flex items-center gap-4 border-l border-[#F9F5EF]/20 pl-6">
              <span className="text-[#F9F5EF]/70 text-sm">
                {user?.full_name || user?.email}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-[#F9F5EF]/10 hover:bg-[#F9F5EF]/20 text-[#F9F5EF] text-sm rounded transition-all"
              >
                <LogOut size={14} />
                Logout
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-[#F9F5EF]"
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
              className="lg:hidden bg-[#1E3A32] border-t border-[#F9F5EF]/10"
            >
              <div className="px-6 py-8 flex flex-col gap-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.page}
                    to={createPageUrl(link.page)}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`text-base py-2 border-b border-[#F9F5EF]/10 ${
                      currentPageName === link.page
                        ? "text-[#F9F5EF] font-medium"
                        : "text-[#F9F5EF]/70"
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
                <div className="pt-4 border-t border-[#F9F5EF]/10">
                  <p className="text-[#F9F5EF]/70 text-sm mb-2">
                    {user?.full_name || user?.email}
                  </p>
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-3 bg-[#F9F5EF]/10 hover:bg-[#F9F5EF]/20 text-[#F9F5EF] text-sm rounded flex items-center justify-center gap-2"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content */}
      <main className="pt-20 pb-20 lg:pb-0">{children}</main>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav 
        user={user}
        currentPageName={currentPageName}
        navLinks={navLinks}
        onLogout={handleLogout}
      />
    </div>
  );
}