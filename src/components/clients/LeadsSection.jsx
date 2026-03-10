import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Mail, Filter, Plus, Trash2, Upload } from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import LeadImport from "../manager/LeadImport";
import LeadDetailsDialog from "./LeadDetailsDialog";

export default function LeadsSection({ leads, isLoading }) {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [stageFilter, setStageFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [selectedLead, setSelectedLead] = useState(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [addLeadDialogOpen, setAddLeadDialogOpen] = useState(false);

  const stages = ["new", "contacted", "booked", "qualified", "proposal", "negotiation", "won", "lost"];
  const stageLabels = {
    new: "New",
    contacted: "Contacted",
    booked: "Booked",
    qualified: "Qualified",
    proposal: "Proposal",
    negotiation: "Negotiation",
    won: "Won",
    lost: "Lost",
  };

  const stageColors = {
    new: "bg-blue-100 text-blue-800",
    contacted: "bg-purple-100 text-purple-800",
    qualified: "bg-green-100 text-green-800",
    proposal: "bg-yellow-100 text-yellow-800",
    negotiation: "bg-orange-100 text-orange-800",
    won: "bg-emerald-100 text-emerald-800",
    lost: "bg-gray-100 text-gray-600",
  };

  const createLeadMutation = useMutation({
    mutationFn: (data) => base44.entities.Lead.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      setAddLeadDialogOpen(false);
      toast.success("Lead added!");
    },
  });

  const deleteLeadMutation = useMutation({
    mutationFn: (id) => base44.entities.Lead.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      toast.success("Lead deleted");
    },
  });

  // Filter leads
  const filteredLeads = leads.filter((lead) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      lead.email?.toLowerCase().includes(query) ||
      lead.full_name?.toLowerCase().includes(query) ||
      lead.phone?.includes(query);

    const matchesStage = stageFilter === "all" || lead.stage === stageFilter;
    const matchesSource = sourceFilter === "all" || lead.source === sourceFilter;

    return matchesSearch && matchesStage && matchesSource;
  });

  // Group by stage for pipeline
  const pipelineData = stages.map((stage) => ({
    stage,
    leads: filteredLeads.filter((l) => l.stage === stage),
  }));

  return (
    <div className="space-y-6">
      {/* Top Actions */}
      <div className="flex gap-3 flex-wrap">
        <Button
          onClick={() => setAddLeadDialogOpen(true)}
          className="bg-[#1E3A32] hover:bg-[#2B2725] text-[#F9F5EF]"
        >
          <Plus size={16} className="mr-2" />
          Add Lead
        </Button>
        <Button
          onClick={() => setImportDialogOpen(true)}
          variant="outline"
          className="border-[#D8B46B] text-[#1E3A32]"
        >
          <Upload size={16} className="mr-2" />
          Import Leads
        </Button>
      </div>

      <Tabs defaultValue="list" className="space-y-6">
        <TabsList>
          <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
        </TabsList>

        {/* Pipeline View */}
        <TabsContent value="pipeline">
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex gap-4 items-center">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#2B2725]/40" size={16} />
                  <Input
                    placeholder="Search leads..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select value={sourceFilter} onValueChange={setSourceFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="All Sources" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sources</SelectItem>
                    <SelectItem value="website">Website</SelectItem>
                    <SelectItem value="masterclass">Masterclass</SelectItem>
                    <SelectItem value="referral">Referral</SelectItem>
                    <SelectItem value="social_media">Social Media</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {pipelineData.map((column) => (
              <div key={column.stage}>
                <div className="bg-white rounded-lg border border-[#E4D9C4] p-4 min-h-[500px]">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium text-[#1E3A32] text-sm">{stageLabels[column.stage]}</h3>
                    <Badge variant="outline">{column.leads.length}</Badge>
                  </div>

                  <div className="space-y-2">
                    {column.leads.map((lead) => (
                      <motion.div
                        key={lead.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-[#F9F5EF] p-3 rounded-lg cursor-pointer hover:shadow-md transition-shadow text-sm"
                        onClick={() => {
                          setSelectedLead(lead);
                          setDetailsDialogOpen(true);
                        }}
                      >
                        <p className="font-medium text-[#1E3A32] truncate">{lead.full_name || lead.email}</p>
                        <p className="text-xs text-[#2B2725]/60 truncate">{lead.email}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* List View */}
        <TabsContent value="list">
          <Card>
            <CardHeader>
              <div className="flex gap-4 items-center">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#2B2725]/40" size={16} />
                  <Input
                    placeholder="Search leads..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select value={stageFilter} onValueChange={setStageFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="All Stages" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Stages</SelectItem>
                    {stages.map((stage) => (
                      <SelectItem key={stage} value={stage}>
                        {stageLabels[stage]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <p className="text-center py-8 text-[#2B2725]/60">Loading...</p>
              ) : filteredLeads.length === 0 ? (
                <p className="text-center py-8 text-[#2B2725]/60">No leads found</p>
              ) : (
                <div className="space-y-3">
                  {filteredLeads.map((lead) => (
                    <motion.div
                      key={lead.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="border border-[#E4D9C4] rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => {
                        setSelectedLead(lead);
                        setDetailsDialogOpen(true);
                      }}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-medium text-[#1E3A32]">{lead.full_name || lead.email}</h3>
                            <Badge className={stageColors[lead.stage]}>{stageLabels[lead.stage]}</Badge>
                          </div>
                          <p className="text-sm text-[#2B2725]/70">{lead.email}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteLeadMutation.mutate(lead.id);
                            }}
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Lead Details Dialog */}
      {selectedLead && (
        <LeadDetailsDialog
          open={detailsDialogOpen}
          onOpenChange={setDetailsDialogOpen}
          lead={selectedLead}
        />
      )}

      {/* Import Dialog */}
      <LeadImport
        open={importDialogOpen}
        onOpenChange={setImportDialogOpen}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ["leads"] });
          setImportDialogOpen(false);
        }}
      />
    </div>
  );
}