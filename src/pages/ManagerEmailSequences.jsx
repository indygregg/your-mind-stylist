import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, Plus, Play, Pause, Edit, Trash2, Users, TrendingUp, Clock, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

export default function ManagerEmailSequences() {
  const queryClient = useQueryClient();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedSequence, setSelectedSequence] = useState(null);
  const [editStepDialogOpen, setEditStepDialogOpen] = useState(false);
  const [selectedStep, setSelectedStep] = useState(null);

  const [newSequence, setNewSequence] = useState({
    name: "",
    description: "",
    trigger_type: "manual",
    active: true
  });

  const [newStep, setNewStep] = useState({
    step_number: 1,
    delay_days: 0,
    delay_hours: 0,
    subject: "",
    body_html: ""
  });

  // Fetch sequences
  const { data: sequences = [], isLoading } = useQuery({
    queryKey: ["emailSequences"],
    queryFn: () => base44.entities.EmailSequence.list("-created_date"),
  });

  // Fetch steps
  const { data: allSteps = [] } = useQuery({
    queryKey: ["emailSequenceSteps"],
    queryFn: () => base44.entities.EmailSequenceStep.list("-sequence_id", 200),
  });

  // Fetch enrollments
  const { data: enrollments = [] } = useQuery({
    queryKey: ["userEmailSequences"],
    queryFn: () => base44.entities.UserEmailSequence.list("-created_date", 100),
  });

  // Create sequence
  const createSequenceMutation = useMutation({
    mutationFn: (data) => base44.entities.EmailSequence.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["emailSequences"] });
      setCreateDialogOpen(false);
      setNewSequence({ name: "", description: "", trigger_type: "manual", active: true });
      toast.success("Sequence created!");
    },
  });

  // Update sequence
  const updateSequenceMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.EmailSequence.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["emailSequences"] });
      toast.success("Sequence updated!");
    },
  });

  // Delete sequence
  const deleteSequenceMutation = useMutation({
    mutationFn: (id) => base44.entities.EmailSequence.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["emailSequences"] });
      toast.success("Sequence deleted!");
    },
  });

  // Create step
  const createStepMutation = useMutation({
    mutationFn: (data) => base44.entities.EmailSequenceStep.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["emailSequenceSteps"] });
      queryClient.invalidateQueries({ queryKey: ["emailSequences"] });
      setEditStepDialogOpen(false);
      setNewStep({
        step_number: 1,
        delay_days: 0,
        delay_hours: 0,
        subject: "",
        body_html: ""
      });
      toast.success("Email added to sequence!");
    },
  });

  // Update step
  const updateStepMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.EmailSequenceStep.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["emailSequenceSteps"] });
      setEditStepDialogOpen(false);
      setSelectedStep(null);
      toast.success("Email updated!");
    },
  });

  // Delete step
  const deleteStepMutation = useMutation({
    mutationFn: (id) => base44.entities.EmailSequenceStep.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["emailSequenceSteps"] });
      queryClient.invalidateQueries({ queryKey: ["emailSequences"] });
      toast.success("Email deleted!");
    },
  });

  // Process sequences
  const processSequencesMutation = useMutation({
    mutationFn: () => base44.functions.invoke("processEmailSequences", {}),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["userEmailSequences"] });
      const summary = result.data.summary;
      toast.success(`Processed: ${summary.processed}, Completed: ${summary.completed}, Failed: ${summary.failed}`);
    },
  });

  // Get steps for a sequence
  const getStepsForSequence = (sequenceId) => {
    return allSteps
      .filter((s) => s.sequence_id === sequenceId)
      .sort((a, b) => a.step_number - b.step_number);
  };

  // Calculate stats
  const totalEnrollments = enrollments.length;
  const activeEnrollments = enrollments.filter((e) => e.status === "active").length;
  const completedEnrollments = enrollments.filter((e) => e.status === "completed").length;

  return (
    <div className="min-h-screen bg-[#F9F5EF] py-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="font-serif text-4xl text-[#1E3A32] mb-2">Email Marketing Sequences</h1>
            <p className="text-[#2B2725]/70">Automated email campaigns and nurture sequences</p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={() => processSequencesMutation.mutate()}
              disabled={processSequencesMutation.isPending}
              variant="outline"
            >
              <Play size={16} className="mr-2" />
              Process Now
            </Button>
            <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#1E3A32] hover:bg-[#2B2725]">
                  <Plus size={16} className="mr-2" />
                  New Sequence
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create Email Sequence</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Sequence Name</Label>
                    <Input
                      value={newSequence.name}
                      onChange={(e) => setNewSequence({ ...newSequence, name: e.target.value })}
                      placeholder="e.g., Masterclass Welcome Series"
                    />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Textarea
                      value={newSequence.description}
                      onChange={(e) => setNewSequence({ ...newSequence, description: e.target.value })}
                      placeholder="Internal notes about this sequence..."
                    />
                  </div>
                  <div>
                    <Label>Trigger Type</Label>
                    <Select
                      value={newSequence.trigger_type}
                      onValueChange={(value) => setNewSequence({ ...newSequence, trigger_type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="manual">Manual</SelectItem>
                        <SelectItem value="signup">User Signup</SelectItem>
                        <SelectItem value="masterclass_signup">Masterclass Signup</SelectItem>
                        <SelectItem value="product_purchase">Product Purchase</SelectItem>
                        <SelectItem value="booking_completed">Booking Completed</SelectItem>
                        <SelectItem value="course_started">Course Started</SelectItem>
                        <SelectItem value="course_completed">Course Completed</SelectItem>
                        <SelectItem value="abandoned_cart">Abandoned Cart</SelectItem>
                        <SelectItem value="inactive_user">Inactive User</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    onClick={() => createSequenceMutation.mutate(newSequence)}
                    disabled={!newSequence.name || createSequenceMutation.isPending}
                    className="w-full"
                  >
                    Create Sequence
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#2B2725]/60">Total Sequences</p>
                  <p className="text-2xl font-bold text-[#1E3A32]">{sequences.length}</p>
                </div>
                <Mail size={32} className="text-[#D8B46B]" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#2B2725]/60">Active Subscribers</p>
                  <p className="text-2xl font-bold text-[#1E3A32]">{activeEnrollments}</p>
                </div>
                <Users size={32} className="text-[#A6B7A3]" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#2B2725]/60">Completed</p>
                  <p className="text-2xl font-bold text-[#1E3A32]">{completedEnrollments}</p>
                </div>
                <CheckCircle size={32} className="text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#2B2725]/60">Total Steps</p>
                  <p className="text-2xl font-bold text-[#1E3A32]">{allSteps.length}</p>
                </div>
                <TrendingUp size={32} className="text-[#6E4F7D]" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sequences List */}
        <Card>
          <CardHeader>
            <CardTitle>All Sequences</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-center py-8 text-[#2B2725]/60">Loading...</p>
            ) : sequences.length === 0 ? (
              <div className="text-center py-12">
                <Mail size={48} className="mx-auto text-[#2B2725]/20 mb-4" />
                <p className="text-[#2B2725]/60 mb-4">No sequences yet</p>
                <Button onClick={() => setCreateDialogOpen(true)}>
                  <Plus size={16} className="mr-2" />
                  Create Your First Sequence
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {sequences.map((sequence) => {
                  const steps = getStepsForSequence(sequence.id);
                  const seqEnrollments = enrollments.filter((e) => e.sequence_id === sequence.id);

                  return (
                    <motion.div
                      key={sequence.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="border border-[#E4D9C4] rounded-lg p-6"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-serif text-xl text-[#1E3A32]">{sequence.name}</h3>
                            <Badge
                              variant={sequence.active ? "default" : "secondary"}
                              className={
                                sequence.active
                                  ? "bg-green-100 text-green-800"
                                  : "bg-gray-100 text-gray-600"
                              }
                            >
                              {sequence.active ? "Active" : "Paused"}
                            </Badge>
                            <Badge variant="outline">{sequence.trigger_type}</Badge>
                          </div>
                          {sequence.description && (
                            <p className="text-sm text-[#2B2725]/60 mb-2">{sequence.description}</p>
                          )}
                          <div className="flex gap-6 text-sm text-[#2B2725]/70">
                            <span>{steps.length} emails</span>
                            <span>{seqEnrollments.length} subscribers</span>
                            <span>
                              {seqEnrollments.filter((e) => e.status === "completed").length} completed
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              updateSequenceMutation.mutate({
                                id: sequence.id,
                                data: { active: !sequence.active },
                              })
                            }
                          >
                            {sequence.active ? <Pause size={14} /> : <Play size={14} />}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedSequence(sequence);
                              setEditDialogOpen(true);
                            }}
                          >
                            <Edit size={14} />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => {
                              if (confirm("Delete this sequence?")) {
                                deleteSequenceMutation.mutate(sequence.id);
                              }
                            }}
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </div>

                      {/* Steps */}
                      <div className="space-y-2 mt-4">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="text-sm font-medium text-[#1E3A32]">Email Steps</h4>
                          <Button
                            size="sm"
                            onClick={() => {
                              setSelectedSequence(sequence);
                              setNewStep({
                                ...newStep,
                                sequence_id: sequence.id,
                                step_number: steps.length + 1,
                              });
                              setEditStepDialogOpen(true);
                            }}
                          >
                            <Plus size={12} className="mr-1" />
                            Add Email
                          </Button>
                        </div>

                        {steps.length === 0 ? (
                          <p className="text-sm text-[#2B2725]/40 italic py-4">
                            No emails in this sequence yet
                          </p>
                        ) : (
                          <div className="space-y-2">
                            {steps.map((step) => (
                              <div
                                key={step.id}
                                className="flex items-center justify-between p-3 bg-[#F9F5EF] rounded-lg"
                              >
                                <div className="flex items-center gap-4">
                                  <Badge variant="outline" className="font-mono">
                                    #{step.step_number}
                                  </Badge>
                                  <div>
                                    <p className="font-medium text-sm text-[#1E3A32]">{step.subject}</p>
                                    <p className="text-xs text-[#2B2725]/60">
                                      Send after: {step.delay_days}d {step.delay_hours}h •{" "}
                                      {step.sent_count || 0} sent
                                    </p>
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => {
                                      setSelectedStep(step);
                                      setNewStep(step);
                                      setEditStepDialogOpen(true);
                                    }}
                                  >
                                    <Edit size={12} />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => {
                                      if (confirm("Delete this email?")) {
                                        deleteStepMutation.mutate(step.id);
                                      }
                                    }}
                                  >
                                    <Trash2 size={12} />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Edit Step Dialog */}
        <Dialog open={editStepDialogOpen} onOpenChange={setEditStepDialogOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedStep ? "Edit Email" : "Add Email to Sequence"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Step Number</Label>
                  <Input
                    type="number"
                    value={newStep.step_number}
                    onChange={(e) => setNewStep({ ...newStep, step_number: parseInt(e.target.value) })}
                  />
                </div>
                <div>
                  <Label>Delay (Days)</Label>
                  <Input
                    type="number"
                    value={newStep.delay_days}
                    onChange={(e) => setNewStep({ ...newStep, delay_days: parseInt(e.target.value) })}
                  />
                </div>
                <div>
                  <Label>Delay (Hours)</Label>
                  <Input
                    type="number"
                    value={newStep.delay_hours}
                    onChange={(e) => setNewStep({ ...newStep, delay_hours: parseInt(e.target.value) })}
                  />
                </div>
              </div>

              <div>
                <Label>Subject Line</Label>
                <Input
                  value={newStep.subject}
                  onChange={(e) => setNewStep({ ...newStep, subject: e.target.value })}
                  placeholder="Email subject..."
                />
              </div>

              <div>
                <Label>Preview Text (optional)</Label>
                <Input
                  value={newStep.preview_text || ""}
                  onChange={(e) => setNewStep({ ...newStep, preview_text: e.target.value })}
                  placeholder="Shown in inbox preview..."
                />
              </div>

              <div>
                <Label>Email Body (HTML)</Label>
                <Textarea
                  value={newStep.body_html}
                  onChange={(e) => setNewStep({ ...newStep, body_html: e.target.value })}
                  className="min-h-[300px] font-mono text-sm"
                  placeholder="<html>...</html>"
                />
                <p className="text-xs text-[#2B2725]/60 mt-1">
                  Variables: {`{{name}}`}, {`{{email}}`}, {`{{product_name}}`}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>CTA Button Text (optional)</Label>
                  <Input
                    value={newStep.cta_text || ""}
                    onChange={(e) => setNewStep({ ...newStep, cta_text: e.target.value })}
                    placeholder="Get Started"
                  />
                </div>
                <div>
                  <Label>CTA Button URL (optional)</Label>
                  <Input
                    value={newStep.cta_url || ""}
                    onChange={(e) => setNewStep({ ...newStep, cta_url: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditStepDialogOpen(false);
                    setSelectedStep(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    if (selectedStep) {
                      updateStepMutation.mutate({ id: selectedStep.id, data: newStep });
                    } else {
                      createStepMutation.mutate(newStep);
                    }
                  }}
                  disabled={!newStep.subject || !newStep.body_html}
                >
                  {selectedStep ? "Update Email" : "Add Email"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}