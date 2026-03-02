import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { X, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DocumentModal({ isOpen, onClose, title, url }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="sticky top-0 bg-white border-b border-[#E4D9C4] p-6 flex items-center justify-between">
          <DialogTitle className="text-[#1E3A32] font-serif text-2xl">{title}</DialogTitle>
          <div className="flex items-center gap-3">
            {url && url.toLowerCase().endsWith('.pdf') && (
              <a href={url} download className="inline-flex">
                <Button variant="outline" size="sm" className="border-[#D8B46B] text-[#1E3A32] hover:bg-[#D8B46B]/10">
                  <Download size={16} className="mr-1" />
                  Download
                </Button>
              </a>
            )}
            <DialogClose asChild>
              <button className="p-2 hover:bg-[#F9F5EF] rounded transition-colors">
                <X size={24} className="text-[#1E3A32]" />
              </button>
            </DialogClose>
          </div>
        </DialogHeader>
        <div className="p-6">
          {!url ? (
            <p className="text-[#2B2725] text-center py-8">Document URL not configured. Please add the document link in the CMS.</p>
          ) : url.toLowerCase().endsWith('.pdf') ? (
            <div className="space-y-4">
              <iframe
                src={`${url}#toolbar=0`}
                className="w-full h-[70vh] border border-[#E4D9C4] rounded"
                title={title}
                allow="web-share"
              />
              <p className="text-sm text-[#2B2725]/60 text-center">
                If the PDF doesn't display above,{' '}
                <a href={url} target="_blank" rel="noopener noreferrer" className="text-[#D8B46B] hover:text-[#1E3A32] underline">
                  open it in a new tab
                </a>
              </p>
            </div>
          ) : (
            <p className="text-[#2B2725] text-center py-8">
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