import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Trash2, Calendar } from "lucide-react";
import { format } from "date-fns";

export default function AdminRoadmap() {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Feature",
    priority: "Medium",
    status: "Planned",
    assigned_to: "",
    due_date: "",
    notes: "",
  });

  const { data: roadmapItems = [], isLoading } = useQuery({
    queryKey: ["roadmapItems"],
    queryFn: () => base44.entities.RoadmapItem.list("-created_date"),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.RoadmapItem.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roadmapItems"] });
      setIsDialogOpen(false);
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.RoadmapItem.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roadmapItems"] });
      setIsDialogOpen(false);
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.RoadmapItem.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roadmapItems"] });
    },
  });

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      category: "Feature",
      priority: "Medium",
      status: "Planned",
      assigned_to: "",
      due_date: "",
      notes: "",
    });
    setEditingItem(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingItem) {
      updateMutation.mutate({ id: editingItem.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData(item);
    setIsDialogOpen(true);
  };

  const handleDelete = (id, title) => {
    if (window.confirm(`Delete "${title}"?`)) {
      deleteMutation.mutate(id);
    }
  };

  const filteredItems = statusFilter === "all" 
    ? roadmapItems 
    : roadmapItems.filter(item => item.status === statusFilter);

  const groupedByStatus = {
    "Planned": filteredItems.filter(i => i.status === "Planned"),
    "In Progress": filteredItems.filter(i => i.status === "In Progress"),
    "Testing": filteredItems.filter(i => i.status === "Testing"),
    "Completed": filteredItems.filter(i => i.status === "Completed"),
    "On Hold": filteredItems.filter(i => i.status === "On Hold"),
  };

  return (
    <div className="min-h-screen bg-[#F9F5EF] py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="font-serif text-4xl text-[#1E3A32] mb-2">Roadmap</h1>
            <p className="text-[#2B2725]/70">Track features, bugs, and enhancements</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#1E3A32] hover:bg-[#2B2725] text-[#F9F5EF]" onClick={resetForm}>
                <Plus size={20} className="mr-2" />
                Add Roadmap Item
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingItem ? "Edit" : "Add"} Roadmap Item</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label>Title *</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Category</Label>
                    <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Feature">Feature</SelectItem>
                        <SelectItem value="Bug Fix">Bug Fix</SelectItem>
                        <SelectItem value="Enhancement">Enhancement</SelectItem>
                        <SelectItem value="Content">Content</SelectItem>
                        <SelectItem value="Integration">Integration</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Priority</Label>
                    <Select value={formData.priority} onValueChange={(v) => setFormData({ ...formData, priority: v })}>
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
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Status</Label>
                    <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Planned">Planned</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="Testing">Testing</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                        <SelectItem value="On Hold">On Hold</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Assigned To</Label>
                    <Input
                      value={formData.assigned_to}
                      onChange={(e) => setFormData({ ...formData, assigned_to: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <Label>Due Date</Label>
                  <Input
                    type="date"
                    value={formData.due_date}
                    onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Internal Notes</Label>
                  <Textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={2}
                  />
                </div>
                <Button type="submit" className="w-full">
                  {editingItem ? "Update" : "Create"} Item
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filter */}
        <div className="bg-white p-4 mb-6">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-64">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Planned">Planned</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Testing">Testing</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
              <SelectItem value="On Hold">On Hold</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Kanban Board */}
        <div className="grid lg:grid-cols-5 gap-6">
          {Object.entries(groupedByStatus).map(([status, items]) => (
            <div key={status} className="bg-white p-4">
              <h3 className="font-medium text-[#1E3A32] mb-4 flex items-center justify-between">
                {status}
                <span className="text-sm text-[#2B2725]/60">({items.length})</span>
              </h3>
              <div className="space-y-3">
                {items.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-[#F9F5EF] p-4 rounded hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-sm text-[#1E3A32]">{item.title}</h4>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleEdit(item)}>
                          <Edit size={14} />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-6 w-6 text-red-600" onClick={() => handleDelete(item.id, item.title)}>
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </div>
                    <div className="flex gap-2 mb-2">
                      <span className={`text-xs px-2 py-1 ${
                        item.priority === "Critical" ? "bg-red-100 text-red-800" :
                        item.priority === "High" ? "bg-orange-100 text-orange-800" :
                        item.priority === "Medium" ? "bg-yellow-100 text-yellow-800" :
                        "bg-gray-100 text-gray-800"
                      }`}>
                        {item.priority}
                      </span>
                      <span className="text-xs px-2 py-1 bg-[#D8B46B]/20 text-[#2B2725]">
                        {item.category}
                      </span>
                    </div>
                    {item.due_date && (
                      <p className="text-xs text-[#2B2725]/60 flex items-center gap-1">
                        <Calendar size={12} />
                        {format(new Date(item.due_date), "MMM d")}
                      </p>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}