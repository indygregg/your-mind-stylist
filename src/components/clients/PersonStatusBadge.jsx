import React from "react";
import { Badge } from "@/components/ui/badge";
import { UserCheck, Mail, Clock, UserPlus, Users } from "lucide-react";

const STATUS_CONFIG = {
  active_user: {
    label: "Active Client",
    icon: UserCheck,
    className: "bg-green-100 text-green-800",
  },
  invited: {
    label: "Invite Sent",
    icon: Mail,
    className: "bg-blue-100 text-blue-800",
  },
  invite_pending: {
    label: "Waiting for Account Setup",
    icon: Clock,
    className: "bg-amber-100 text-amber-800",
  },
  lead: {
    label: "Lead",
    icon: UserPlus,
    className: "bg-purple-100 text-purple-800",
  },
  converted_lead: {
    label: "Converted Lead",
    icon: Users,
    className: "bg-emerald-100 text-emerald-800",
  },
};

export function getPersonStatus({ user, lead }) {
  if (user) return "active_user";
  if (lead?.converted_to_client) return "converted_lead";
  if (lead?.user_id) return "invite_pending";
  return "lead";
}

export default function PersonStatusBadge({ status }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.lead;
  const Icon = config.icon;

  return (
    <Badge className={`${config.className} gap-1.5 font-medium text-xs px-2.5 py-1`}>
      <Icon size={13} />
      {config.label}
    </Badge>
  );
}