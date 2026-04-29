import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Eye, Send, Mail } from "lucide-react";

function replaceVariables(text, vars) {
  let result = text || "";
  for (const [key, value] of Object.entries(vars)) {
    result = result.replace(new RegExp(`\\{\\{${key}\\}\\}`, "g"), value || "");
  }
  return result;
}

export default function InviteEmailPreview({ open, onOpenChange, recipientName, recipientEmail, onConfirmSend }) {
  const [selectedTemplateId, setSelectedTemplateId] = useState(null);
  const [subjectOverride, setSubjectOverride] = useState("");
  const [sending, setSending] = useState(false);

  // Fetch invite-related templates
  const { data: templates = [], isLoading } = useQuery({
    queryKey: ["invite-email-templates"],
    queryFn: async () => {
      const all = await base44.entities.EmailTemplate.filter({ active: true });
      // Show platform_invite first, then any user_notification templates
      return all.filter(
        (t) => t.key === "platform_invite" || t.category === "user_notification"
      ).sort((a, b) => {
        if (a.key === "platform_invite") return -1;
        if (b.key === "platform_invite") return 1;
        return a.name.localeCompare(b.name);
      });
    },
    enabled: open,
  });

  // Auto-select the branded invite template
  useEffect(() => {
    if (templates.length > 0 && !selectedTemplateId) {
      const branded = templates.find((t) => t.key === "platform_invite");
      setSelectedTemplateId(branded?.id || templates[0].id);
    }
  }, [templates, selectedTemplateId]);

  const selectedTemplate = templates.find((t) => t.id === selectedTemplateId);
  const displayName = recipientName || recipientEmail?.split("@")[0] || "there";

  const previewVars = {
    name: displayName,
    user_name: displayName,
    login_link: "https://yourmindstylist.com/login",
    current_year: new Date().getFullYear().toString(),
  };

  const previewSubject = replaceVariables(subjectOverride || selectedTemplate?.subject || "", previewVars);
  const previewBody = replaceVariables(selectedTemplate?.body || "", previewVars);

  const handleSend = async () => {
    setSending(true);
    try {
      await onConfirmSend({
        templateId: selectedTemplateId,
        subject: previewSubject,
        body: previewBody,
        templateKey: selectedTemplate?.key,
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail size={20} className="text-[#6E4F7D]" />
            Preview Invite Email
          </DialogTitle>
          <DialogDescription>
            This branded email from Roberta will be sent first. Then the system will send a separate account setup email.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Template Selector */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-[#2B2725]">Email Template</Label>
            {isLoading ? (
              <div className="flex items-center gap-2 text-sm text-[#2B2725]/60">
                <Loader2 size={14} className="animate-spin" /> Loading templates...
              </div>
            ) : (
              <Select value={selectedTemplateId || ""} onValueChange={setSelectedTemplateId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a template" />
                </SelectTrigger>
                <SelectContent>
                  {templates.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.name} {t.key === "platform_invite" ? "(Recommended)" : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Subject override */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-[#2B2725]">Subject Line</Label>
            <Input
              value={subjectOverride || selectedTemplate?.subject || ""}
              onChange={(e) => setSubjectOverride(e.target.value)}
              placeholder="Email subject..."
            />
          </div>

          {/* Recipient info */}
          <div className="flex items-center gap-3 p-3 bg-[#F9F5EF] rounded-lg text-sm">
            <span className="text-[#2B2725]/60">To:</span>
            <span className="font-medium text-[#1E3A32]">{displayName}</span>
            <span className="text-[#2B2725]/50">&lt;{recipientEmail}&gt;</span>
          </div>

          {/* Preview */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-[#2B2725]">
              <Eye size={14} />
              Email Preview
            </div>
            <div
              className="border border-[#E4D9C4] rounded-lg overflow-hidden bg-[#F9F5EF]"
              style={{ maxHeight: "400px", overflowY: "auto" }}
            >
              <div dangerouslySetInnerHTML={{ __html: previewBody }} />
            </div>
          </div>

          {/* Info box */}
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
            <strong>What happens next:</strong> After this branded email is sent, the system will 
            automatically send a second email with the account setup link and password creation.
          </div>

          {/* Actions */}
          <div className="flex justify-between pt-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSend}
              disabled={sending || !selectedTemplate}
              className="bg-[#6E4F7D] hover:bg-[#5A3F69] text-white"
            >
              {sending ? (
                <>
                  <Loader2 size={16} className="animate-spin mr-2" /> Sending...
                </>
              ) : (
                <>
                  <Send size={16} className="mr-2" /> Send Invite
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}