import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "../utils";
import { base44 } from "@/api/base44Client";
import { Menu, X, LogOut, User, Settings, ChevronDown, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import MobileBottomNav from "./MobileBottomNav";
import GlobalSearch from "./GlobalSearch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function AuthLayout({ children, currentPageName }) {
  const [user, setUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

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
        { name: "Calendar", page: "ManagerCalendar" },
        { name: "Staff", page: "StaffManagement" },
        { name: "Library", page: "Library" },
        { name: "Studio", page: "StudioDashboard" },
        { name: "Roadmap", page: "AdminRoadmap" },
        { name: "Users", page: "AdminUsers" },
        { name: "Settings", page: "StudioSettings" },
      ];
    }

    if (user.role === "manager") {
      return [
        ...commonLinks,
        { name: "Calendar", page: "ManagerCalendar" },
        { name: "Staff", page: "StaffManagement" },
        { name: "Library", page: "Library" },
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
      { name: "Client Portal", page: "ClientPortal" },
      { name: "Studio", page: "Dashboard" },
      { name: "Style Pauses™", page: "StylePauses" },
      { name: "My Bookings", page: "ClientBookings" },
      { name: "Library", page: "Library" },
      { name: "Buy Programs", page: "BuyPrograms" },
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

            {/* Search Button */}
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 hover:bg-[#F9F5EF]/10 rounded-full transition-colors"
              aria-label="Search"
            >
              <Search size={20} className="text-[#F9F5EF]/70" />
            </button>

            {/* User Menu */}
            <div className="flex items-center gap-4 border-l border-[#F9F5EF]/20 pl-6">
              <DropdownMenu open={profileDropdownOpen} onOpenChange={setProfileDropdownOpen}>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                    <div className="w-9 h-9 rounded-full bg-[#D8B46B]/30 flex items-center justify-center overflow-hidden">
                      {user?.profile_photo ? (
                        <img
                          src={user.profile_photo}
                          alt={user.full_name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User size={18} className="text-[#F9F5EF]" />
                      )}
                    </div>
                    <span className="text-[#F9F5EF] text-sm font-medium">
                      {user?.full_name || user?.email}
                    </span>
                    <ChevronDown size={16} className="text-[#F9F5EF]/70" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-white">
                  <div className="px-3 py-2 border-b border-[#E4D9C4]">
                    <p className="text-sm font-medium text-[#1E3A32]">
                      {user?.full_name || "User"}
                    </p>
                    <p className="text-xs text-[#2B2725]/60">{user?.email}</p>
                  </div>
                  <DropdownMenuItem asChild>
                    <Link
                      to={createPageUrl("ProfileSettings")}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <User size={16} />
                      Profile Settings
                    </Link>
                  </DropdownMenuItem>
                  {(user?.role === "admin" || user?.role === "manager") && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link
                          to={createPageUrl("StudioSettings")}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <Settings size={16} />
                          Studio Settings
                        </Link>
                      </DropdownMenuItem>
                      {user?.role === "admin" && (
                        <DropdownMenuItem asChild>
                          <Link
                            to={createPageUrl("AdminDashboard")}
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <Settings size={16} />
                            Admin Dashboard
                          </Link>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem asChild>
                        <Link
                          to={createPageUrl("ManagerDashboard")}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <Settings size={16} />
                          Manager Dashboard
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="flex items-center gap-2 cursor-pointer text-red-600"
                  >
                    <LogOut size={16} />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="lg:hidden bg-[#1E3A32] border-t border-[#F9F5EF]/10"
            >
              <div className="px-6 py-8 flex flex-col gap-4 max-h-[calc(100vh-100px)] overflow-y-auto">
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

      {/* Global Search */}
      <GlobalSearch isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
}