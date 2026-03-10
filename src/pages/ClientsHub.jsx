import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Users, TrendingUp, Plus, Upload, Mail, Send, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import LeadsSection from "../components/clients/LeadsSection.jsx";
import UsersSection from "../components/clients/UsersSection.jsx";
import ConvertLeadsDialog from "../components/clients/ConvertLeadsDialog.jsx";
import MassEmailDialog from "../components/crm/MassEmailDialog";

export default function ClientsHub() {
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
    <div className="min-h-screen bg-[#F9F5EF] py-12 px-6">
      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-start flex-wrap gap-4">
          <div>
            <h1 className="font-serif text-4xl text-[#1E3A32] mb-2">Clients Hub</h1>
            <p className="text-[#2B2725]/70">Manage leads and user accounts in one place</p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <Button
              onClick={() => setMassEmailDialogOpen(true)}
              className="bg-[#D8B46B] hover:bg-[#C9A557] text-[#1E3A32]"
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
            >
              {syncing ? <Loader2 size={16} className="animate-spin mr-2" /> : <Send size={16} className="mr-2" />}
              {syncing ? "Syncing..." : "Sync MailerLite"}
            </Button>
            <Button
              onClick={() => setConvertDialogOpen(true)}
              className="bg-[#6E4F7D] hover:bg-[#5A3F69] text-[#F9F5EF]"
            >
              <Plus size={16} className="mr-2" />
              Convert to Users
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg border border-[#E4D9C4] p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#2B2725]/60">Total Leads</p>
                <p className="text-3xl font-bold text-[#1E3A32] mt-2">{totalLeads}</p>
              </div>
              <Users size={40} className="text-[#D8B46B]" />
            </div>
          </div>

          <div className="bg-white rounded-lg border border-[#E4D9C4] p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#2B2725]/60">Platform Users</p>
                <p className="text-3xl font-bold text-[#1E3A32] mt-2">{users.length}</p>
              </div>
              <Users size={40} className="text-[#6E4F7D]" />
            </div>
          </div>

          <div className="bg-white rounded-lg border border-[#E4D9C4] p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#2B2725]/60">Conversion Rate</p>
                <p className="text-3xl font-bold text-[#1E3A32] mt-2">{conversionRate}%</p>
              </div>
              <TrendingUp size={40} className="text-green-600" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="leads" className="space-y-6">
          <TabsList className="bg-white">
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
    </div>
  );
}