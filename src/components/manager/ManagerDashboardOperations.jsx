import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Users, TrendingUp, Plus, Mail, Send, Loader2, HelpCircle, Clock, Settings, Zap, Package, AlertCircle, FileText, Calendar, ShoppingCart, CreditCard, Upload, Database } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Link } from "react-router-dom";
import { createPageUrl } from "../../utils";
import toast from "react-hot-toast";
import MassEmailDialog from "../crm/MassEmailDialog";

const operationsGroups = [
  {
    title: "Client Management",
    items: [
      { icon: Database, label: "Client Hub", link: "ClientsHub" },
    ]
  },
  {
    title: "Booking System",
    items: [
      { icon: Clock, label: "Appointment Types", link: "ManagerAppointmentTypes" },
      { icon: Calendar, label: "Availability", link: "ManagerAvailability" },
      { icon: Calendar, label: "Booking Calendar", link: "ManagerCalendar" },
    ]
  },
  {
    title: "Products & Offers",
    items: [
      { icon: Package, label: "Product Manager", link: "ManagerProducts" },
      { icon: ShoppingCart, label: "Funnels", link: "ManagerMasterclass" },
      { icon: TrendingUp, label: "Payment Plans", link: "ManagerPaymentPlans" },
      { icon: CreditCard, label: "Subscriptions & Refunds", link: "ManagerSubscriptions" },
    ]
  },
  {
    title: "Integrations",
    items: [
      { icon: Zap, label: "Integration Setup", link: "IntegrationSetup" },
    ]
  },
  {
    title: "Advanced",
    items: [
      { icon: AlertCircle, label: "Bug Tracker", link: "AdminRoadmap" },
      { icon: Settings, label: "Settings", link: "ManagerSettings" },
    ]
  },
];

export default function ManagerDashboardOperations() {
  const queryClient = useQueryClient();
  const [convertDialogOpen, setConvertDialogOpen] = useState(false);
  const [massEmailDialogOpen, setMassEmailDialogOpen] = useState(false);
  const [syncing, setSyncing] = useState(false);

  // Fetch leads
  const { data: leads = [], isLoading: leadsLoading } = useQuery({
    queryKey: ["leads"],
    queryFn: () => base44.entities.Lead.list("-created_date", 500),
  });

  // Fetch users
  const { data: users = [], isLoading: usersLoading } = useQuery({
    queryKey: ["admin-all-users"],
    queryFn: async () => {
      const res = await base44.functions.invoke("getAllUsers");
      return res.data?.users || [];
    },
  });

  // Calculate stats
  const totalLeads = leads.length;
  const convertedLeads = leads.filter((l) => l.converted_to_client).length;
  const conversionRate = totalLeads > 0 ? ((convertedLeads / totalLeads) * 100).toFixed(1) : 0;

  return (
    <div className="border-t border-[#E4D9C4] space-y-6">
      {/* User Onboarding Section */}
      <div className="bg-white p-6">
        <h3 className="font-serif text-xl text-[#1E3A32] mb-6">User Onboarding</h3>
        <p className="text-[#2B2725]/70 text-sm mb-6">Import users from Kajabi, create manually, or manage enrollments</p>
        
        <div className="grid md:grid-cols-3 gap-4">
          <Link
            to={createPageUrl("ClientsHub")}
            className="flex items-center gap-3 p-4 bg-[#F9F5EF] border border-[#E4D9C4] hover:border-[#D8B46B] rounded-lg transition-all group"
          >
            <Upload size={20} className="text-[#D8B46B]" />
            <div>
              <p className="font-medium text-[#1E3A32] group-hover:text-[#D8B46B] transition-colors">Import from Kajabi</p>
              <p className="text-xs text-[#2B2725]/60">CSV → Users + Courses</p>
            </div>
          </Link>

          <Link
            to={createPageUrl("ClientsHub")}
            className="flex items-center gap-3 p-4 bg-[#F9F5EF] border border-[#E4D9C4] hover:border-[#6E4F7D] rounded-lg transition-all group"
          >
            <Plus size={20} className="text-[#6E4F7D]" />
            <div>
              <p className="font-medium text-[#1E3A32] group-hover:text-[#6E4F7D] transition-colors">Create User</p>
              <p className="text-xs text-[#2B2725]/60">Add manually</p>
            </div>
          </Link>

          <Link
            to={createPageUrl("ClientsHub")}
            className="flex items-center gap-3 p-4 bg-[#F9F5EF] border border-[#E4D9C4] hover:border-[#1E3A32] rounded-lg transition-all group"
          >
            <Database size={20} className="text-[#1E3A32]" />
            <div>
              <p className="font-medium text-[#1E3A32] group-hover:text-[#D8B46B] transition-colors">Manage Users</p>
              <p className="text-xs text-[#2B2725]/60">Roles, enrollments</p>
            </div>
          </Link>
        </div>
      </div>



      {/* Quick Links Section */}
      <div className="bg-white p-6 border-t border-[#E4D9C4]">
        <h3 className="font-serif text-lg text-[#1E3A32] mb-6">Quick Links</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {operationsGroups.map((group, idx) => (
            <div key={idx} className="space-y-3">
              <h4 className="text-xs text-[#1E3A32] uppercase tracking-wider font-medium opacity-60">{group.title}</h4>
              <div className="space-y-2">
                {group.items.map((item, itemIdx) => (
                  <Link
                    key={itemIdx}
                    to={createPageUrl(item.link)}
                    className="flex items-center gap-2 p-2 text-[#1E3A32] hover:bg-[#F9F5EF] rounded transition-colors group"
                  >
                    <item.icon size={16} className="text-[#2B2725]/40 group-hover:text-[#1E3A32] transition-colors" />
                    <span className="text-sm group-hover:text-[#1E3A32]/80 transition-colors">{item.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}