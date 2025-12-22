import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import CmsText from "../cms/CmsText";

export default function VideoModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="relative w-full max-w-5xl aspect-video bg-black"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute -top-12 right-0 text-white/80 hover:text-white transition-colors z-10"
          >
            <X size={32} />
          </button>

          <div className="w-full h-full">
            <CmsText
              contentKey="home.hero.welcome_video_embed"
              page="Home"
              blockTitle="Hero Welcome Video Embed (Paste Vimeo/YouTube iframe code)"
              fallback="<div class='w-full h-full flex items-center justify-center text-white/60 text-center p-8'><div><p class='text-xl mb-2'>Welcome Video Coming Soon</p><p class='text-sm'>Paste your Vimeo or YouTube embed code in Edit Mode</p></div></div>"
              contentType="rich_text"
              className="w-full h-full [&_iframe]:w-full [&_iframe]:h-full [&_iframe]:border-0"
            />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}