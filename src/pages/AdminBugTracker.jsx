import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Bug, ArrowLeft, ExternalLink } from "lucide-react";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { createPageUrl } from "../utils";

export default function AdminBugTracker() {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [selectedBug, setSelectedBug] = useState(null);
  const [adminNotes, setAdminNotes] = useState("");

  const { data: bugReports = [], isLoading } = useQuery({
    queryKey: ["bugReports"],
    queryFn: () => base44.entities.BugReport.list("-created_date"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.BugReport.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bugReports"] });
    },
  });

  const handleStatusChange = (bugId, newStatus) => {
    updateMutation.mutate({
      id: bugId,
      data: { 
        status: newStatus,
        ...(newStatus === "Resolved" && { resolved_date: new Date().toISOString() })
      }
    });
  };

  const handlePriorityChange = (bugId, newPriority) => {
    updateMutation.mutate({
      id: bugId,
      data: { priority: newPriority }
    });
  };

  const handleSaveNotes = () => {
    if (selectedBug) {
      updateMutation.mutate({
        id: selectedBug.id,
        data: { admin_notes: adminNotes }
      });
    }
  };

  const filteredBugs = bugReports.filter(bug => {
    const statusMatch = statusFilter === "all" || bug.status === statusFilter;
    const priorityMatch = priorityFilter === "all" || bug.priority === priorityFilter;
    return statusMatch && priorityMatch;
  });

  const newBugsCount = bugReports.filter(b => b.status === "New").length;

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "Critical": return "bg-red-100 text-red-800";
      case "High": return "bg-orange-100 text-orange-800";
      case "Medium": return "bg-yellow-100 text-yellow-800";
      case "Low": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "New": return "bg-blue-100 text-blue-800";
      case "In Progress": return "bg-purple-100 text-purple-800";
      case "Resolved": return "bg-green-100 text-green-800";
      case "Archived": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F5EF] py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link to={createPageUrl("AdminDashboard")}>
            <Button variant="outline" size="icon">
              <ArrowLeft size={20} />
            </Button>
          </Link>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <Bug size={32} className="text-[#D8B46B]" />
              <h1 className="font-serif text-4xl text-[#1E3A32]">Bug Tracker</h1>
              {newBugsCount > 0 && (
                <Badge className="bg-red-500 text-white">
                  {newBugsCount} New
                </Badge>
              )}
            </div>
            <p className="text-[#2B2725]/70">Review, prioritize, and manage bug reports.</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 mb-6 flex gap-4">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="New">New</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Resolved">Resolved</SelectItem>
              <SelectItem value="Archived">Archived</SelectItem>
            </SelectContent>
          </Select>

          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="Critical">Critical</SelectItem>
              <SelectItem value="High">High</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Bug List */}
        <div className="bg-white shadow-lg">
          {isLoading ? (
            <div className="p-12 text-center text-[#2B2725]/60">Loading bug reports...</div>
          ) : filteredBugs.length === 0 ? (
            <div className="p-12 text-center text-[#2B2725]/60">No bug reports found.</div>
          ) : (
            <div className="divide-y divide-[#E4D9C4]">
              {filteredBugs.map((bug) => (
                <motion.div
                  key={bug.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-6 hover:bg-[#F9F5EF] transition-colors cursor-pointer"
                  onClick={() => {
                    setSelectedBug(bug);
                    setAdminNotes(bug.admin_notes || "");
                  }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-[#1E3A32] mb-2">
                        {bug.title || bug.description.substring(0, 100) + "..."}
                      </h3>
                      <p className="text-sm text-[#2B2725]/70 mb-3 line-clamp-2">
                        {bug.description}
                      </p>
                      <div className="flex items-center gap-3 flex-wrap">
                        <Badge className={getStatusColor(bug.status)}>
                          {bug.status}
                        </Badge>
                        <Badge className={getPriorityColor(bug.priority)}>
                          {bug.priority}
                        </Badge>
                        <span className="text-xs text-[#2B2725]/60">
                          {bug.reporter_email}
                        </span>
                        <span className="text-xs text-[#2B2725]/60">
                          {format(new Date(bug.created_date), "MMM d, yyyy")}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Detail Modal */}
        <Dialog open={!!selectedBug} onOpenChange={() => setSelectedBug(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            {selectedBug && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-2xl flex items-center gap-3">
                    <Bug size={24} className="text-[#D8B46B]" />
                    {selectedBug.title || "Bug Report"}
                  </DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                  {/* Status & Priority Controls */}
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="text-sm font-medium text-[#1E3A32] mb-2 block">
                        Status
                      </label>
                      <Select
                        value={selectedBug.status}
                        onValueChange={(value) => handleStatusChange(selectedBug.id, value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="New">New</SelectItem>
                          <SelectItem value="In Progress">In Progress</SelectItem>
                          <SelectItem value="Resolved">Resolved</SelectItem>
                          <SelectItem value="Archived">Archived</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex-1">
                      <label className="text-sm font-medium text-[#1E3A32] mb-2 block">
                        Priority
                      </label>
                      <Select
                        value={selectedBug.priority}
                        onValueChange={(value) => handlePriorityChange(selectedBug.id, value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Low">Low</SelectItem>
                          <SelectItem value="Medium">Medium</SelectItem>
                          <SelectItem value="High">High</SelectItem>
                          <SelectItem value="Critical">Critical</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Reporter Info */}
                  <div className="bg-[#F9F5EF] p-4 rounded-lg">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-[#2B2725]/60">Reported by:</span>
                        <span className="ml-2 text-[#1E3A32] font-medium">
                          {selectedBug.reporter_email}
                        </span>
                      </div>
                      <div>
                        <span className="text-[#2B2725]/60">Page:</span>
                        <a
                          href={selectedBug.page_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-2 text-[#D8B46B] hover:underline inline-flex items-center gap-1"
                        >
                          View Page <ExternalLink size={12} />
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* User Description */}
                  <div>
                    <h3 className="font-medium text-[#1E3A32] mb-2">User Description</h3>
                    <p className="text-[#2B2725]/80 leading-relaxed whitespace-pre-wrap bg-white p-4 rounded-lg border border-[#E4D9C4]">
                      {selectedBug.description}
                    </p>
                  </div>

                  {/* AI Reproduction Steps */}
                  {selectedBug.reproduction_steps && (
                    <div>
                      <h3 className="font-medium text-[#1E3A32] mb-2">Reproduction Steps</h3>
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <ol className="list-decimal list-inside space-y-2 text-sm text-blue-900">
                          {selectedBug.reproduction_steps.split('\n').map((step, idx) => (
                            <li key={idx}>{step}</li>
                          ))}
                        </ol>
                      </div>
                    </div>
                  )}

                  {/* AI Analysis */}
                  {selectedBug.ai_analysis && (
                    <div>
                      <h3 className="font-medium text-[#1E3A32] mb-2">AI Analysis</h3>
                      <p className="text-[#2B2725]/80 leading-relaxed bg-purple-50 p-4 rounded-lg border border-purple-200">
                        {selectedBug.ai_analysis}
                      </p>
                    </div>
                  )}

                  {/* Attachments */}
                  {(selectedBug.screenshot_url || (selectedBug.additional_screenshots && selectedBug.additional_screenshots.length > 0)) && (
                    <div>
                      <h3 className="font-medium text-[#1E3A32] mb-2">Attachments</h3>
                      <div className="grid grid-cols-2 gap-4">
                        {selectedBug.screenshot_url && (
                          <a
                            href={selectedBug.screenshot_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block"
                          >
                            <img
                              src={selectedBug.screenshot_url}
                              alt="Screenshot"
                              className="w-full h-48 object-cover rounded-lg border border-[#E4D9C4] hover:opacity-80 transition-opacity"
                            />
                          </a>
                        )}
                        {selectedBug.additional_screenshots?.map((url, idx) => (
                          <a
                            key={idx}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block"
                          >
                            <img
                              src={url}
                              alt={`Additional ${idx + 1}`}
                              className="w-full h-48 object-cover rounded-lg border border-[#E4D9C4] hover:opacity-80 transition-opacity"
                            />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Browser Information */}
                  <div>
                    <h3 className="font-medium text-[#1E3A32] mb-2">Browser Information</h3>
                    <p className="text-xs text-[#2B2725]/70 font-mono bg-gray-50 p-3 rounded-lg border border-gray-200">
                      {selectedBug.browser_info}
                    </p>
                  </div>

                  {/* Admin Notes */}
                  <div>
                    <h3 className="font-medium text-[#1E3A32] mb-2">Admin Notes</h3>
                    <Textarea
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      placeholder="Add internal notes about this bug..."
                      rows={4}
                      className="mb-2"
                    />
                    <Button
                      onClick={handleSaveNotes}
                      className="bg-[#1E3A32] hover:bg-[#2B4A40]"
                    >
                      Save Notes
                    </Button>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}