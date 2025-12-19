import React, { useState } from "react";
import { Bug } from "lucide-react";
import BugReportModal from "./BugReportModal";
import { motion, AnimatePresence } from "framer-motion";

export default function BugReportButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 z-50 w-14 h-14 rounded-full bg-[#D8B46B] hover:bg-[#C9A55A] text-white shadow-lg flex items-center justify-center transition-colors"
        title="Report a Bug"
      >
        <Bug size={24} />
      </motion.button>

      <AnimatePresence>
        {isOpen && <BugReportModal onClose={() => setIsOpen(false)} />}
      </AnimatePresence>
    </>
  );
}