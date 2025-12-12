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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Edit, Mail, Code, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import ReactQuill from "react-quill";

const TEMPLATE_CONFIGS = {
  booking_confirmation_client: {
    name: "Booking Confirmation - Client",
    variables: ["{{user_name}}", "{{service_type}}", "{{amount}}", "{{session_count}}", "{{scheduled_date}}", "{{zoom_join_url}}", "{{zoom_password}}", "{{notes}}"]
  },
  booking_confirmation_manager: {
    name: "Booking Confirmation - Manager",
    variables: ["{{user_name}}", "{{user_email}}", "{{service_type}}", "{{amount}}", "{{session_count}}", "{{scheduled_date}}", "{{zoom_start_url}}", "{{notes}}", "{{booking_id}}"]
  },
  booking_reminder: {
    name: "Booking Reminder",
    variables: ["{{user_name}}", "{{scheduled_date}}", "{{zoom_join_url}}", "{{service_type}}"]
  },
  zoom_link_ready: {
    name: "Zoom Link Ready",
    variables: ["{{user_name}}", "{{scheduled_date}}", "{{zoom_join_url}}", "{{zoom_password}}"]
  }
};

export default function ManagerEmailTemplates() {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    template_key: "booking_confirmation_client",
    subject: "",
    body_html: "",
    active: true
  });

  const { data: templates = [], isLoading } = useQuery({
    queryKey: ["emailTemplates"],
    queryFn: () => base44.entities.EmailTemplate.list(),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.EmailTemplate.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["emailTemplates"] });
      setIsDialogOpen(false);
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.EmailTemplate.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["emailTemplates"] });
      setIsDialogOpen(false);
      resetForm();
    },
  });

  const resetForm = () => {
    setFormData({
      name: "",
      template_key: "booking_confirmation_client",
      subject: "",
      body_html: "",
      active: true
    });
    setEditingTemplate(null);
    setPreviewMode(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const config = TEMPLATE_CONFIGS[formData.template_key];
    const dataToSave = {
      ...formData,
      available_variables: config.variables
    };

    if (editingTemplate) {
      updateMutation.mutate({ id: editingTemplate.id, data: dataToSave });
    } else {
      createMutation.mutate(dataToSave);
    }
  };

  const handleEdit = (template) => {
    setEditingTemplate(template);
    setFormData(template);
    setIsDialogOpen(true);
  };

  const insertVariable = (variable) => {
    setFormData({
      ...formData,
      body_html: formData.body_html + " " + variable
    });
  };

  const getPreviewHtml = () => {
    let html = formData.body_html;
    const config = TEMPLATE_CONFIGS[formData.template_key];
    
    // Replace variables with sample data
    const sampleData = {
      "{{user_name}}": "Jane Doe",
      "{{user_email}}": "jane@example.com",
      "{{service_type}}": "Private Sessions",
      "{{amount}}": "$300.00",
      "{{session_count}}": "3",
      "{{scheduled_date}}": "Monday, January 15, 2025 at 2:00 PM",
      "{{zoom_join_url}}": "https://zoom.us/j/123456789",
      "{{zoom_start_url}}": "https://zoom.us/s/123456789",
      "{{zoom_password}}": "abc123",
      "{{notes}}": "Looking forward to working on confidence and clarity.",
      "{{booking_id}}": "abc-123-xyz"
    };

    config.variables.forEach(variable => {
      html = html.replace(new RegExp(variable.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), sampleData[variable] || variable);
    });

    return html;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F9F5EF] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1E3A32] mx-auto mb-4"></div>
          <p className="text-[#2B2725]/70">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F5EF] py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="font-serif text-4xl text-[#1E3A32] mb-2">Email Templates</h1>
            <p className="text-[#2B2725]/70">Customize booking and notification emails</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#1E3A32] hover:bg-[#2B2725] text-[#F9F5EF]" onClick={resetForm}>
                <Plus size={20} className="mr-2" />
                Create Template
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingTemplate ? "Edit" : "Create"} Email Template</DialogTitle>
              </DialogHeader>
              
              <Tabs defaultValue="editor">
                <TabsList>
                  <TabsTrigger value="editor">
                    <Edit size={16} className="mr-2" />
                    Editor
                  </TabsTrigger>
                  <TabsTrigger value="preview">
                    <Eye size={16} className="mr-2" />
                    Preview
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="editor">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Template Type</Label>
                        <Select
                          value={formData.template_key}
                          onValueChange={(v) => setFormData({ 
                            ...formData, 
                            template_key: v,
                            name: TEMPLATE_CONFIGS[v].name 
                          })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(TEMPLATE_CONFIGS).map(([key, config]) => (
                              <SelectItem key={key} value={key}>{config.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Template Name</Label>
                        <Input
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="e.g., Booking Confirmation - Client"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label>Subject Line</Label>
                      <Input
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        placeholder="e.g., Your Booking is Confirmed"
                        required
                      />
                    </div>

                    <div>
                      <Label className="mb-2 block">Available Variables</Label>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {TEMPLATE_CONFIGS[formData.template_key].variables.map((variable) => (
                          <Button
                            key={variable}
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => insertVariable(variable)}
                          >
                            <Code size={12} className="mr-1" />
                            {variable}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label>Email Body (HTML)</Label>
                      <ReactQuill
                        theme="snow"
                        value={formData.body_html}
                        onChange={(value) => setFormData({ ...formData, body_html: value })}
                        className="bg-white"
                        modules={{
                          toolbar: [
                            [{ header: [1, 2, 3, false] }],
                            ["bold", "italic", "underline"],
                            [{ list: "ordered" }, { list: "bullet" }],
                            ["link"],
                            [{ color: [] }, { background: [] }],
                            ["clean"]
                          ]
                        }}
                      />
                    </div>

                    <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                      {editingTemplate ? "Update Template" : "Create Template"}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="preview">
                  <div className="space-y-4">
                    <div className="bg-[#F9F5EF] p-4">
                      <Label className="text-sm text-[#2B2725]/60">Subject:</Label>
                      <p className="font-medium text-[#1E3A32]">{formData.subject || "(No subject)"}</p>
                    </div>
                    <div className="bg-white p-6 border border-[#E4D9C4] min-h-[400px]">
                      <div dangerouslySetInnerHTML={{ __html: getPreviewHtml() }} />
                    </div>
                    <p className="text-xs text-[#2B2725]/60">
                      Preview shows sample data. Variables will be replaced with actual booking information when sent.
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </DialogContent>
          </Dialog>
        </div>

        {/* Templates List */}
        <div className="grid gap-6">
          {templates.length === 0 ? (
            <div className="bg-white p-12 text-center">
              <Mail size={48} className="text-[#2B2725]/20 mx-auto mb-4" />
              <p className="text-[#2B2725]/50 mb-4">No email templates yet</p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus size={16} className="mr-2" />
                Create Your First Template
              </Button>
            </div>
          ) : (
            templates.map((template) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-6"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-serif text-2xl text-[#1E3A32]">{template.name}</h3>
                      <Badge>{template.template_key}</Badge>
                      {template.active && <Badge variant="default">Active</Badge>}
                    </div>
                    <p className="text-[#2B2725]/70 mb-3">
                      <strong>Subject:</strong> {template.subject}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {template.available_variables?.map((variable) => (
                        <span key={variable} className="text-xs bg-[#F9F5EF] px-2 py-1 font-mono text-[#2B2725]/70">
                          {variable}
                        </span>
                      ))}
                    </div>
                  </div>
                  <Button variant="outline" size="icon" onClick={() => handleEdit(template)}>
                    <Edit size={16} />
                  </Button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}