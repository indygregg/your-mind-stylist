import React from "react";
import { Calendar, Globe, UserCheck } from "lucide-react";

export function getSourceInfo(item) {
  // Determine source type
  if (item.type === 'booking') {
    return {
      source: 'booking',
      label: 'Website Booking',
      icon: Globe,
      bgClass: 'bg-emerald-100',
      textClass: 'text-emerald-700',
      borderClass: 'border-emerald-300',
      badgeBg: 'bg-emerald-500',
    };
  }
  
  if (item.type === 'blocked') {
    if (item.source === 'calendar_sync') {
      return {
        source: 'google',
        label: 'Google Calendar',
        icon: Calendar,
        bgClass: 'bg-slate-100',
        textClass: 'text-slate-700',
        borderClass: 'border-slate-300',
        badgeBg: 'bg-slate-500',
      };
    }
    return {
      source: 'manual',
      label: 'Manual Block',
      icon: UserCheck,
      bgClass: 'bg-purple-100',
      textClass: 'text-purple-700',
      borderClass: 'border-purple-300',
      badgeBg: 'bg-purple-500',
    };
  }

  return {
    source: 'unknown',
    label: 'Unknown',
    icon: Calendar,
    bgClass: 'bg-gray-100',
    textClass: 'text-gray-700',
    borderClass: 'border-gray-300',
    badgeBg: 'bg-gray-500',
  };
}

export default function CalendarItemBadge({ item, size = "sm" }) {
  const { label, icon: Icon, badgeBg } = getSourceInfo(item);

  if (size === "xs") {
    return (
      <span className={`inline-flex items-center gap-0.5 px-1 py-0.5 rounded text-[8px] font-medium text-white ${badgeBg}`}>
        <Icon size={8} />
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium text-white ${badgeBg}`}>
      <Icon size={10} />
      <span>{label}</span>
    </span>
  );
}