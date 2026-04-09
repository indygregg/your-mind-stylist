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
              fallback="<iframe src='https://player.vimeo.com/video/1153707003?h=70226bd374&badge=0&autopause=0&player_id=0&app_id=58479' allow='autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media' referrerpolicy='strict-origin-when-cross-origin' style='width: 100%; height: 100%; border: 0;' title='Your Mind Stylist'></iframe>"
              contentType="rich_text"
              className="w-full h-full [&_iframe]:w-full [&_iframe]:h-full [&_iframe]:border-0"
            />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}