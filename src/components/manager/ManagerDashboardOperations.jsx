import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Users, TrendingUp, Plus, Mail, Send, Loader2, HelpCircle, Clock, Settings, Zap, Package, AlertCircle, FileText, Calendar, ShoppingCart, CreditCard } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Link } from "react-router-dom";
import { createPageUrl } from "../../utils";
import toast from "react-hot-toast";
import LeadsSection from "../clients/LeadsSection.jsx";
import UsersSection from "../clients/UsersSection.jsx";
import ConvertLeadsDialog from "../clients/ConvertLeadsDialog.jsx";
import MassEmailDialog from "../crm/MassEmailDialog";

const operationsGroups = [
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
      {/* Clients Hub Section */}
      <div className="bg-white p-6">
        {/* Header */}
        <div className="mb-8 flex justify-between items-start flex-wrap gap-4">
          <div className="flex items-start gap-3">
            <div>
              <h3 className="font-serif text-2xl text-[#1E3A32] mb-2">Clients Hub</h3>
              <p className="text-[#2B2725]/70">Manage leads and user accounts</p>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="mt-2 p-2 text-[#2B2725]/60 hover:text-[#1E3A32] transition-colors">
                    <HelpCircle size={20} />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-sm bg-[#1E3A32] text-[#F9F5EF] border-0">
                  <div className="space-y-2 text-sm">
                    <p className="font-semibold">Workflow for Creating Users</p>
                    <ol className="list-decimal list-inside space-y-1">
                      <li><span className="font-medium">Create or Import Leads</span> — Add prospects to the Leads tab</li>
                      <li><span className="font-medium">Convert to Users</span> — Use "Convert to Users" button to create platform accounts from selected leads</li>
                      <li><span className="font-medium">Assign Courses</span> — During conversion, optionally assign courses to new users immediately</li>
                    </ol>
                    <p className="text-xs text-[#F9F5EF]/80 pt-2 border-t border-[#F9F5EF]/20">Converted leads are marked in the Leads tab and synced to MailerLite.</p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="flex gap-3 flex-wrap">
            <Button
              onClick={() => setMassEmailDialogOpen(true)}
              className="bg-[#D8B46B] hover:bg-[#C9A557] text-[#1E3A32]"
              size="sm"
            >
              <Mail size={16} className="mr-2" />
              Mass Email
            </Button>
            <Button
              onClick={async () => {
                setSyncing(true);
                try {
                  const response = await base44.functions.invoke('syncLeadsToMailerLite', {});
                  if (response.data.success) {
                    toast.success(`Synced ${response.data.syncedCount} leads to MailerLite`);
                  }
                } catch (e) {
                  toast.error("Sync failed: " + e.message);
                } finally {
                  setSyncing(false);
                }
              }}
              disabled={syncing}
              variant="outline"
              className="border-[#D8B46B] text-[#1E3A32]"
              size="sm"
            >
              {syncing ? <Loader2 size={16} className="animate-spin mr-2" /> : <Send size={16} className="mr-2" />}
              {syncing ? "Syncing..." : "Sync MailerLite"}
            </Button>
            <Button
              onClick={() => setConvertDialogOpen(true)}
              className="bg-[#6E4F7D] hover:bg-[#5A3F69] text-[#F9F5EF]"
              size="sm"
            >
              <Plus size={16} className="mr-2" />
              Convert to Users
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-[#F9F5EF] rounded-lg border border-[#E4D9C4] p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#2B2725]/60">Total Leads</p>
                <p className="text-2xl font-bold text-[#1E3A32] mt-1">{totalLeads}</p>
              </div>
              <Users size={32} className="text-[#D8B46B]" />
            </div>
          </div>

          <div className="bg-[#F9F5EF] rounded-lg border border-[#E4D9C4] p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#2B2725]/60">Platform Users</p>
                <p className="text-2xl font-bold text-[#1E3A32] mt-1">{users.length}</p>
              </div>
              <Users size={32} className="text-[#6E4F7D]" />
            </div>
          </div>

          <div className="bg-[#F9F5EF] rounded-lg border border-[#E4D9C4] p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#2B2725]/60">Conversion Rate</p>
                <p className="text-2xl font-bold text-[#1E3A32] mt-1">{conversionRate}%</p>
              </div>
              <TrendingUp size={32} className="text-green-600" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="leads" className="space-y-6">
          <TabsList className="bg-[#F9F5EF]">
            <TabsTrigger value="leads">Leads ({totalLeads})</TabsTrigger>
            <TabsTrigger value="users">Users ({users.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="leads">
            <LeadsSection leads={leads} isLoading={leadsLoading} />
          </TabsContent>

          <TabsContent value="users">
            <UsersSection users={users} isLoading={usersLoading} />
          </TabsContent>
        </Tabs>

        {/* Convert Leads Dialog */}
        <ConvertLeadsDialog
          open={convertDialogOpen}
          onOpenChange={setConvertDialogOpen}
          leads={leads}
          onSuccess={() => {
            queryClient.invalidateQueries({ queryKey: ["admin-all-users"] });
            queryClient.invalidateQueries({ queryKey: ["leads"] });
            setConvertDialogOpen(false);
          }}
        />

        {/* Mass Email Dialog */}
        <MassEmailDialog
          open={massEmailDialogOpen}
          onOpenChange={setMassEmailDialogOpen}
          leads={leads}
        />
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