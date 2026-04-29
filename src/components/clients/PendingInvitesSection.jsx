import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, RefreshCw, Loader2, Clock, Mail, Info } from "lucide-react";
import { format } from "date-fns";
import toast from "react-hot-toast";
import PersonDetailPanel from "./PersonDetailPanel";
import InviteEmailPreview from "./InviteEmailPreview";

export default function PendingInvitesSection({ leads, users }) {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [resendingId, setResendingId] = useState(null);
  const [personPanelOpen, setPersonPanelOpen] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [invitePreviewOpen, setInvitePreviewOpen] = useState(false);
  const [invitePreviewTarget, setInvitePreviewTarget] = useState(null);

  // People who were invited (converted_to_client or user_id set) but don't have active User records
  const userEmails = new Set((users || []).map((u) => u.email?.toLowerCase()));
  const pendingLeads = leads.filter((l) => {
    if (!l.converted_to_client && !l.user_id) return false;
    return !userEmails.has(l.email?.toLowerCase());
  });

  const filtered = pendingLeads.filter((l) => {
    const q = searchTerm.toLowerCase();
    const name = l.full_name || `${l.first_name || ""} ${l.last_name || ""}`.trim() || l.email;
    return name.toLowerCase().includes(q) || l.email?.toLowerCase().includes(q);
  });

  const getFullName = (lead) => {
    if (lead.full_name) return lead.full_name;
    if (lead.first_name && lead.last_name) return `${lead.first_name} ${lead.last_name}`;
    if (lead.first_name) return lead.first_name;
    return lead.email;
  };

  const handleResend = async (lead) => {
    setResendingId(lead.id);
    try {
      await base44.functions.invoke("inviteUserToApp", {
        email: lead.email.toLowerCase(),
        role: "user",
      });
      toast.success(`Invite resent to ${lead.email}`);
      queryClient.invalidateQueries({ queryKey: ["leads"] });
    } catch (error) {
      if (error.response?.data?.userExists) {
        toast.success("They already set up their account!");
        queryClient.invalidateQueries({ queryKey: ["admin-all-users"] });
        queryClient.invalidateQueries({ queryKey: ["leads"] });
      } else {
        toast.error(error.response?.data?.error || error.message);
      }
    } finally {
      setResendingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Info Banner */}
      <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
        <Info size={18} className="text-amber-600 mt-0.5 flex-shrink-0" />
        <div className="text-sm text-amber-900">
          <p className="font-medium mb-1">What are Pending Invites?</p>
          <p className="text-amber-800">
            These people were invited to the platform but haven't set up their account yet. 
            They won't appear as active users until they accept the invite email and create a password.
            You can resend the invite if they didn't receive it.
          </p>
        </div>
      </div>

      {/* Search */}
      <Card className="bg-white">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#2B2725]/40" size={16} />
            <Input
              placeholder="Search pending invites..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Pending List */}
      <Card className="bg-white overflow-hidden">
        <CardContent className="p-0">
          {filtered.length === 0 ? (
            <div className="p-12 text-center">
              <Clock size={32} className="mx-auto text-[#2B2725]/20 mb-3" />
              <p className="text-[#2B2725]/60 font-medium">No pending invites</p>
              <p className="text-sm text-[#2B2725]/40 mt-1">
                Everyone you've invited has set up their account
              </p>
            </div>
          ) : (
            <div className="divide-y divide-[#E4D9C4]/60">
              {filtered.map((lead) => (
                <div
                  key={lead.id}
                  className="flex items-center justify-between px-6 py-4 hover:bg-[#F9F5EF]/50 transition-colors"
                >
                  <div className="flex items-center gap-4 min-w-0 flex-1">
                    <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                      <Clock size={18} className="text-amber-600" />
                    </div>
                    <div className="min-w-0">
                      <button
                        onClick={() => {
                          setSelectedPerson({ email: lead.email, name: getFullName(lead) });
                          setPersonPanelOpen(true);
                        }}
                        className="font-medium text-[#1E3A32] hover:text-[#6E4F7D] hover:underline transition-colors text-left truncate block"
                      >
                        {getFullName(lead)}
                      </button>
                      <div className="flex items-center gap-2 text-sm text-[#2B2725]/60">
                        <Mail size={12} />
                        <span className="truncate">{lead.email}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    <Badge className="bg-amber-100 text-amber-800 text-xs whitespace-nowrap">
                      Awaiting Setup
                    </Badge>
                    {lead.updated_date && (
                      <span className="text-xs text-[#2B2725]/40 hidden md:block whitespace-nowrap">
                        Invited {format(new Date(lead.updated_date), "MMM d")}
                      </span>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-amber-300 text-amber-700 hover:bg-amber-50"
                      onClick={() => handleResend(lead)}
                      disabled={resendingId === lead.id}
                    >
                      {resendingId === lead.id ? (
                        <Loader2 size={14} className="animate-spin mr-1.5" />
                      ) : (
                        <RefreshCw size={14} className="mr-1.5" />
                      )}
                      Resend
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="text-center text-sm text-[#2B2725]/60">
        {pendingLeads.length} pending invite{pendingLeads.length !== 1 ? "s" : ""}
      </div>

      {/* Person Detail Panel */}
      {selectedPerson && (
        <PersonDetailPanel
          open={personPanelOpen}
          onOpenChange={setPersonPanelOpen}
          email={selectedPerson.email}
          name={selectedPerson.name}
        />
      )}
    </div>
  );
}