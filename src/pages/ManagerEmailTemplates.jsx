import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, Edit, Save, X, Send } from "lucide-react";
import { toast } from "react-hot-toast";

export default function ManagerEmailTemplates() {
  const queryClient = useQueryClient();
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editedTemplate, setEditedTemplate] = useState(null);
  const [testDialogOpen, setTestDialogOpen] = useState(false);
  const [testEmail, setTestEmail] = useState("");

  const { data: templates = [], isLoading } = useQuery({
    queryKey: ["emailTemplates"],
    queryFn: () => base44.entities.EmailTemplate.list(),
  });

  const updateTemplateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.EmailTemplate.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["emailTemplates"] });
      toast.success("Template updated");
      setEditMode(false);
      setSelectedTemplate(null);
    },
    onError: (error) => toast.error(error.message || "Failed to update template"),
  });

  const sendTestEmailMutation = useMutation({
    mutationFn: ({ template_key, recipient }) =>
      base44.functions.invoke("sendTemplatedEmail", {
        template_key,
        recipient,
        variables: generateTestVariables(selectedTemplate)
      }),
    onSuccess: () => {
      toast.success("Test email sent");
      setTestDialogOpen(false);
      setTestEmail("");
    },
    onError: (error) => toast.error(error.message || "Failed to send test email"),
  });

  const generateTestVariables = (template) => {
    const testVars = {};
    template.variables?.forEach(v => {
      switch (v) {
        case "name":
          testVars[v] = "John Doe";
          break;
        case "email":
          testVars[v] = "john@example.com";
          break;
        case "login_link":
        case "dashboard_link":
        case "reset_link":
        case "verification_link":
        case "admin_link":
          testVars[v] = "https://yourmindstylist.com/app/dashboard";
          break;
        case "product_name":
          testVars[v] = "Toolkit Module";
          break;
        case "timestamp":
          testVars[v] = new Date().toLocaleDateString();
          break;
        case "count":
          testVars[v] = "3";
          break;
        default:
          testVars[v] = `[${v}]`;
      }
    });
    return testVars;
  };

  const handleEditClick = (template) => {
    setSelectedTemplate(template);
    setEditedTemplate({ ...template });
    setEditMode(true);
  };

  const handleSave = () => {
    updateTemplateMutation.mutate({
      id: editedTemplate.id,
      data: {
        subject: editedTemplate.subject,
        body: editedTemplate.body,
        active: editedTemplate.active,
      },
    });
  };

  const handleCancel = () => {
    setEditMode(false);
    setEditedTemplate(null);
    setSelectedTemplate(null);
  };

  const handleSendTest = () => {
    if (!testEmail) {
      toast.error("Please enter an email address");
      return;
    }
    sendTestEmailMutation.mutate({
      template_key: selectedTemplate.key,
      recipient: testEmail,
    });
  };

  const categorizedTemplates = {
    manager_notification: templates.filter(t => t.category === "manager_notification"),
    user_notification: templates.filter(t => t.category === "user_notification"),
    admin_notification: templates.filter(t => t.category === "admin_notification"),
  };

  if (isLoading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-[#F9F5EF] py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="font-serif text-4xl text-[#1E3A32] mb-2">Email Templates</h1>
          <p className="text-[#2B2725]/70">
            Manage notification templates for the entire platform
          </p>
        </div>

        <Tabs defaultValue="manager_notification" className="space-y-6">
          <TabsList>
            <TabsTrigger value="manager_notification">Manager Notifications</TabsTrigger>
            <TabsTrigger value="user_notification">User Notifications</TabsTrigger>
            <TabsTrigger value="admin_notification">Admin Notifications</TabsTrigger>
          </TabsList>

          {Object.entries(categorizedTemplates).map(([category, categoryTemplates]) => (
            <TabsContent key={category} value={category}>
              <div className="grid md:grid-cols-2 gap-6">
                {categoryTemplates.map((template) => (
                  <Card key={template.id} className={!template.active ? "opacity-60" : ""}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{template.name}</CardTitle>
                          <CardDescription className="mt-1">
                            Key: <code className="text-xs bg-[#E4D9C4] px-1 rounded">{template.key}</code>
                          </CardDescription>
                        </div>
                        <Badge variant={template.active ? "default" : "secondary"}>
                          {template.active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <p className="text-xs text-[#2B2725]/60 mb-1">Subject:</p>
                          <p className="text-sm font-medium">{template.subject}</p>
                        </div>
                        <div>
                          <p className="text-xs text-[#2B2725]/60 mb-1">Variables:</p>
                          <div className="flex flex-wrap gap-2">
                            {template.variables?.map((v) => (
                              <Badge key={v} variant="outline" className="text-xs">
                                {v}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="flex gap-2 pt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditClick(template)}
                            className="flex-1"
                          >
                            <Edit size={14} className="mr-2" />
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedTemplate(template);
                              setTestDialogOpen(true);
                            }}
                            className="flex-1"
                          >
                            <Send size={14} className="mr-2" />
                            Test
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>

      {/* Edit Dialog */}
      <Dialog open={editMode} onOpenChange={(open) => !open && handleCancel()}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Template: {editedTemplate?.name}</DialogTitle>
          </DialogHeader>

          {editedTemplate && (
            <div className="space-y-6 py-4">
              <div className="flex items-center justify-between">
                <Label>Active</Label>
                <Switch
                  checked={editedTemplate.active}
                  onCheckedChange={(checked) =>
                    setEditedTemplate({ ...editedTemplate, active: checked })
                  }
                />
              </div>

              <div>
                <Label>Subject</Label>
                <Input
                  value={editedTemplate.subject}
                  onChange={(e) =>
                    setEditedTemplate({ ...editedTemplate, subject: e.target.value })
                  }
                  className="mt-2"
                />
              </div>

              <div>
                <Label>Body</Label>
                <Textarea
                  value={editedTemplate.body}
                  onChange={(e) =>
                    setEditedTemplate({ ...editedTemplate, body: e.target.value })
                  }
                  className="mt-2 min-h-[300px] font-mono text-sm"
                />
              </div>

              <div>
                <p className="text-xs text-[#2B2725]/60 mb-2">Available variables:</p>
                <div className="flex flex-wrap gap-2">
                  {editedTemplate.variables?.map((v) => (
                    <Badge key={v} variant="outline" className="text-xs">
                      {`{{${v}}}`}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  onClick={handleSave}
                  disabled={updateTemplateMutation.isPending}
                  className="flex-1"
                >
                  <Save size={16} className="mr-2" />
                  {updateTemplateMutation.isPending ? "Saving..." : "Save Changes"}
                </Button>
                <Button variant="outline" onClick={handleCancel} className="flex-1">
                  <X size={16} className="mr-2" />
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Test Email Dialog */}
      <Dialog open={testDialogOpen} onOpenChange={setTestDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Test Email</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label>Send to:</Label>
              <Input
                type="email"
                placeholder="your@email.com"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                className="mt-2"
              />
            </div>

            <p className="text-sm text-[#2B2725]/70">
              This will send the email with sample data to test how it looks.
            </p>

            <div className="flex gap-2 pt-4">
              <Button
                onClick={handleSendTest}
                disabled={sendTestEmailMutation.isPending}
                className="flex-1"
              >
                <Send size={16} className="mr-2" />
                {sendTestEmailMutation.isPending ? "Sending..." : "Send Test"}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setTestDialogOpen(false);
                  setTestEmail("");
                }}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}