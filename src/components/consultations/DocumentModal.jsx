import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { X } from "lucide-react";

export default function DocumentModal({ isOpen, onClose, title, url }) {
  if (!url) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="sticky top-0 bg-white border-b border-[#E4D9C4] p-6 flex items-center justify-between">
          <DialogTitle className="text-[#1E3A32] font-serif text-2xl">{title}</DialogTitle>
          <DialogClose asChild>
            <button className="p-2 hover:bg-[#F9F5EF] rounded transition-colors">
              <X size={24} className="text-[#1E3A32]" />
            </button>
          </DialogClose>
        </DialogHeader>
        <div className="p-6">
          {url.toLowerCase().endsWith('.pdf') ? (
            <iframe
              src={url}
              className="w-full h-[70vh] border border-[#E4D9C4] rounded"
              title={title}
            />
          ) : (
            <p className="text-[#2B2725] text-center">
              <a href={url} target="_blank" rel="noopener noreferrer" className="text-[#D8B46B] hover:text-[#1E3A32] underline">
                Open document in new tab
              </a>
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}