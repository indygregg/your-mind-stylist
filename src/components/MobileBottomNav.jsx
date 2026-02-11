import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "../utils";
import { Home, BookOpen, ShoppingCart, Menu, X, Settings, Users, FileText, MessageSquare, Headphones, LayoutDashboard, UsersRound } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import haptics from "@/components/utils/haptics";

export default function MobileBottomNav({ user, currentPageName, navLinks, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleNavClick = (pageName) => {
    haptics.light();
    setMenuOpen(false);
    navigate(createPageUrl(pageName));
  };

  const getIcon = (pageName) => {
    const iconMap = {
      Dashboard: Home,
      AdminDashboard: LayoutDashboard,
      ManagerDashboard: LayoutDashboard,
      StudioDashboard: LayoutDashboard,
      Library: BookOpen,
      PurchaseCenter: ShoppingCart,
      Purchase: ShoppingCart,
      AdminRoadmap: FileText,
      Roadmap: FileText,
      AdminUsers: Users,
      Users: Users,
      StaffManagement: UsersRound,
      Staff: UsersRound,
      StudioSettings: Settings,
      Settings: Settings,
      BlogManager: FileText,
      Blog: FileText,
      CourseManager: BookOpen,
      Courses: BookOpen,
      AudioManager: Headphones,
      Audio: Headphones,
      MessagesManager: MessageSquare,
      Messages: MessageSquare,
    };
    return iconMap[pageName] || Home;
  };

  const quickLinks = navLinks.slice(0, 3);
  const moreLinks = navLinks.slice(3);

  return (
    <>
      {/* Bottom Navigation Bar - Mobile Only */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#1E3A32] border-t border-[#F9F5EF]/10 z-50 safe-area-bottom">
        <div className={`grid ${moreLinks.length > 0 ? 'grid-cols-4' : 'grid-cols-3'} h-16`}>
          {quickLinks.map((link) => {
            const Icon = getIcon(link.page);
            return (
              <button
                key={link.page}
                onClick={() => {
                  if (currentPageName === link.page) {
                    handleActiveTabClick(link.page);
                  } else {
                    handleNavClick(link.page);
                    window.location.href = createPageUrl(link.page);
                  }
                }}
                className={`flex flex-col items-center justify-center gap-1 transition-colors ${
                  currentPageName === link.page
                    ? "text-[#D8B46B]"
                    : "text-[#F9F5EF]/70"
                }`}
              >
                <Icon size={20} />
                <span className="text-[10px]">{link.name}</span>
              </button>
            );
          })}
          {moreLinks.length > 0 && (
            <button
              onClick={() => {
                haptics.light();
                setMenuOpen(!menuOpen);
              }}
              className={`flex flex-col items-center justify-center gap-1 transition-colors ${
                menuOpen ? "text-[#D8B46B]" : "text-[#F9F5EF]/70"
              }`}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
              <span className="text-[10px]">More</span>
            </button>
          )}
        </div>
      </nav>

      {/* Slide-up Menu Panel */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/50 z-40 pointer-events-auto"
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="lg:hidden fixed bottom-16 left-0 right-0 bg-[#1E3A32] rounded-t-3xl z-50 max-h-[70vh] overflow-y-auto safe-area-bottom"
            >
              <div className="px-6 py-6">
                {/* User Info */}
                <div className="pb-4 mb-4 border-b border-[#F9F5EF]/10">
                  <p className="text-[#F9F5EF] font-medium">
                    {user?.full_name || user?.email}
                  </p>
                  <p className="text-[#F9F5EF]/60 text-sm">{user?.email}</p>
                </div>

                {/* More Navigation Links */}
                <div className="space-y-2 mb-4">
                  {moreLinks.map((link) => (
                    <button
                      key={link.page}
                      onClick={() => {
                        if (currentPageName === link.page) {
                          handleActiveTabClick(link.page);
                        } else {
                          handleNavClick(link.page);
                          window.location.href = createPageUrl(link.page);
                        }
                      }}
                      className={`block w-full text-left py-3 px-4 rounded-lg transition-colors ${
                        currentPageName === link.page
                          ? "bg-[#D8B46B]/20 text-[#D8B46B]"
                          : "text-[#F9F5EF]/80 hover:bg-[#F9F5EF]/10"
                      }`}
                    >
                      {link.name}
                    </button>
                  ))}
                </div>

                {/* Logout Button */}
                <button
                  onClick={() => {
                    haptics.medium();
                    onLogout();
                  }}
                  className="w-full py-3 px-4 bg-[#F9F5EF]/10 hover:bg-[#F9F5EF]/20 text-[#F9F5EF] rounded-lg transition-colors min-h-[48px]"
                >
                  Logout
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}