import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, SendHorizonal } from "lucide-react";
import { base44 } from "@/api/base44Client";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import toast from "react-hot-toast";

const QUILL_MODULES = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link"],
    ["clean"],
  ],
};

export default function SendIndividualEmailDialog({ open, onOpenChange, recipientEmail, recipientName }) {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!subject.trim() || !body.trim()) {
      toast.error("Subject and body are required");
      return;
    }
    setSending(true);
    try {
      await base44.integrations.Core.SendEmail({
        to: recipientEmail,
        subject,
        body: `<div style="max-width:600px;margin:0 auto;font-family:'Inter',Arial,sans-serif;color:#2B2725;padding:24px;">${body}</div>`,
        from_name: "Your Mind Stylist",
      });
      toast.success(`Email sent to ${recipientName || recipientEmail}`);
      setSubject("");
      setBody("");
      onOpenChange(false);
    } catch (err) {
      toast.error("Failed to send: " + (err.message || "Unknown error"));
    } finally {
      setSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Send Email to {recipientName || recipientEmail}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label className="text-xs text-[#2B2725]/60">To</Label>
            <p className="text-sm font-medium text-[#1E3A32]">{recipientEmail}</p>
          </div>
          <div>
            <Label>Subject</Label>
            <Input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Email subject..."
              className="mt-1"
            />
          </div>
          <div>
            <Label>Message</Label>
            <div className="border rounded-lg bg-white mt-1">
              <ReactQuill
                value={body}
                onChange={setBody}
                modules={QUILL_MODULES}
                theme="snow"
                placeholder="Write your message..."
                style={{ minHeight: "200px" }}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={sending}>
              Cancel
            </Button>
            <Button
              onClick={handleSend}
              disabled={sending || !subject.trim() || !body.trim()}
              className="bg-[#1E3A32] hover:bg-[#2B2725] text-white"
            >
              {sending ? (
                <Loader2 size={14} className="animate-spin mr-2" />
              ) : (
                <SendHorizonal size={14} className="mr-2" />
              )}
              {sending ? "Sending..." : "Send Email"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}