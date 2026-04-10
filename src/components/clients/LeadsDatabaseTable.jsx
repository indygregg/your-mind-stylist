import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2, ChevronUp, ChevronDown, Mail } from "lucide-react";
import toast from "react-hot-toast";
import SendIndividualEmailDialog from "./SendIndividualEmailDialog";

const sourceLabels = {
  networking: "Networking", internet: "Internet", referral: "Referral",
  client: "Client", colleague: "Colleague", vendor: "Vendor",
  website: "Website", masterclass: "Masterclass", social_media: "Social Media",
  paid_ad: "Paid Ad", organic_search: "Organic Search", email_campaign: "Email Campaign",
  event: "Event", booking_system: "Booking", product_purchase: "Purchase",
  free_masterclass: "Free Masterclass", other: "Other",
};

const sourceColors = {
  networking: "bg-blue-100 text-blue-800", internet: "bg-cyan-100 text-cyan-800",
  referral: "bg-purple-100 text-purple-800", client: "bg-emerald-100 text-emerald-800",
  colleague: "bg-indigo-100 text-indigo-800", vendor: "bg-amber-100 text-amber-800",
  website: "bg-blue-100 text-blue-800", masterclass: "bg-pink-100 text-pink-800",
  social_media: "bg-violet-100 text-violet-800", other: "bg-gray-100 text-gray-600",
};

const getFullName = (lead) => {
  if (lead.first_name && lead.last_name) return `${lead.first_name} ${lead.last_name}`;
  if (lead.full_name) return lead.full_name;
  if (lead.first_name) return lead.first_name;
  return "—";
};

const getLocation = (lead) => {
  const parts = [lead.city, lead.state].filter(Boolean);
  return parts.length > 0 ? parts.join(", ") : "—";
};

export default function LeadsDatabaseTable({ leads, onSelectLead }) {
  const queryClient = useQueryClient();
  const [sortField, setSortField] = useState("created_date");
  const [sortDir, setSortDir] = useState("desc");
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [emailTarget, setEmailTarget] = useState(null);

  const deleteLeadMutation = useMutation({
    mutationFn: (id) => base44.entities.Lead.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      toast.success("Lead deleted");
    },
  });

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  const sorted = [...leads].sort((a, b) => {
    let aVal, bVal;
    switch (sortField) {
      case "name":
        aVal = getFullName(a).toLowerCase();
        bVal = getFullName(b).toLowerCase();
        break;
      case "email":
        aVal = (a.email || "").toLowerCase();
        bVal = (b.email || "").toLowerCase();
        break;
      case "date_of_purchase":
        aVal = a.date_of_purchase || "";
        bVal = b.date_of_purchase || "";
        break;
      case "source":
        aVal = a.source || "";
        bVal = b.source || "";
        break;
      default:
        aVal = a.created_date || "";
        bVal = b.created_date || "";
    }
    if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
    if (aVal > bVal) return sortDir === "asc" ? 1 : -1;
    return 0;
  });

  const SortIcon = ({ field }) => {
    if (sortField !== field) return null;
    return sortDir === "asc" ? <ChevronUp size={14} /> : <ChevronDown size={14} />;
  };

  const ColHeader = ({ field, children, className = "" }) => (
    <th
      className={`px-4 py-3 text-left text-xs font-semibold text-[#2B2725] uppercase tracking-wide cursor-pointer hover:bg-[#E4D9C4]/50 select-none whitespace-nowrap ${className}`}
      onClick={() => handleSort(field)}
    >
      <span className="flex items-center gap-1">
        {children}
        <SortIcon field={field} />
      </span>
    </th>
  );

  return (
    <div className="overflow-x-auto border border-[#E4D9C4] rounded-lg bg-white">
      <table className="w-full text-sm">
        <thead className="bg-[#F9F5EF] border-b border-[#E4D9C4]">
          <tr>
            <ColHeader field="name">Name</ColHeader>
            <ColHeader field="email">Email</ColHeader>
            <th className="px-4 py-3 text-left text-xs font-semibold text-[#2B2725] uppercase tracking-wide whitespace-nowrap">Phone</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-[#2B2725] uppercase tracking-wide whitespace-nowrap">Location</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-[#2B2725] uppercase tracking-wide whitespace-nowrap">What They Bought</th>
            <ColHeader field="date_of_purchase">Purchase Date</ColHeader>
            <ColHeader field="source">Source</ColHeader>
            <th className="px-4 py-3 text-left text-xs font-semibold text-[#2B2725] uppercase tracking-wide whitespace-nowrap">Follow-Up</th>
            <th className="px-4 py-3 w-12"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#E4D9C4]/60">
          {sorted.map((lead) => (
            <tr
              key={lead.id}
              className="hover:bg-[#F9F5EF]/50 cursor-pointer transition-colors"
              onClick={() => onSelectLead(lead)}
            >
              <td className="px-4 py-3 font-medium text-[#1E3A32] whitespace-nowrap">
                {getFullName(lead)}
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <div className="flex items-center gap-1.5">
                  <span className="text-[#2B2725]/70">{lead.email || "—"}</span>
                  {lead.email && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEmailTarget({ email: lead.email, name: getFullName(lead) });
                        setEmailDialogOpen(true);
                      }}
                      className="p-1 rounded hover:bg-[#D8B46B]/20 text-[#6E4F7D] hover:text-[#1E3A32] transition-colors flex-shrink-0"
                      title={`Email ${lead.email}`}
                    >
                      <Mail size={13} />
                    </button>
                  )}
                </div>
              </td>
              <td className="px-4 py-3 text-[#2B2725]/70 whitespace-nowrap">{lead.phone || "—"}</td>
              <td className="px-4 py-3 text-[#2B2725]/70 whitespace-nowrap">{getLocation(lead)}</td>
              <td className="px-4 py-3 text-[#2B2725]/70 max-w-[200px] truncate" title={lead.what_they_bought || ""}>
                {lead.what_they_bought || "—"}
              </td>
              <td className="px-4 py-3 text-[#2B2725]/70 whitespace-nowrap">{lead.date_of_purchase || "—"}</td>
              <td className="px-4 py-3 whitespace-nowrap">
                <Badge className={`text-xs ${sourceColors[lead.source] || "bg-gray-100 text-gray-600"}`}>
                  {sourceLabels[lead.source] || lead.source || "—"}
                </Badge>
              </td>
              <td className="px-4 py-3 text-[#2B2725]/70 max-w-[150px] truncate text-xs" title={lead.follow_up_actions || ""}>
                {lead.follow_up_actions || "—"}
              </td>
              <td className="px-4 py-3">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 text-[#2B2725]/40 hover:text-red-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteLeadMutation.mutate(lead.id);
                  }}
                >
                  <Trash2 size={14} />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {sorted.length === 0 && (
        <div className="py-12 text-center text-[#2B2725]/60 text-sm">No leads found</div>
      )}

      {emailTarget && (
        <SendIndividualEmailDialog
          open={emailDialogOpen}
          onOpenChange={setEmailDialogOpen}
          recipientEmail={emailTarget.email}
          recipientName={emailTarget.name}
        />
      )}
    </div>
  );
}