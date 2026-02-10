import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, Edit2, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";

export default function ConsultationFormEditor() {
  const queryClient = useQueryClient();
  const [editingField, setEditingField] = useState(null);
  const [activeStep, setActiveStep] = useState(1);

  // Fetch form configuration
  const { data: formFields = [], isLoading } = useQuery({
    queryKey: ['consultationForm'],
    queryFn: () => base44.entities.ConsultationForm.list(),
  });

  // Update field mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.ConsultationForm.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['consultationForm'] });
      setEditingField(null);
    },
  });

  const fieldsByStep = React.useMemo(() => {
    const grouped = {};
    formFields.forEach(field => {
      if (!grouped[field.step]) grouped[field.step] = [];
      grouped[field.step].push(field);
    });
    return grouped;
  }, [formFields]);

  const steps = [
    { number: 1, title: "Personal Information" },
    { number: 2, title: "Reason for Consultation" },
    { number: 3, title: "Medical & Mental Health History" },
    { number: 4, title: "Goals & Expectations" },
    { number: 5, title: "Consent & Acknowledgment" }
  ];

  if (isLoading) {
    return <div className="p-8 text-center">Loading form configuration...</div>;
  }

  return (
    <div className="min-h-screen bg-[#F9F5EF] pt-24 pb-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-8">
          <h1 className="font-serif text-4xl text-[#1E3A32] mb-2">Consultation Form Editor</h1>
          <p className="text-[#2B2725]/70">Edit form fields, labels, and help text without rebuilding the form</p>
        </div>

        <Tabs value={`step-${activeStep}`} onValueChange={(val) => setActiveStep(parseInt(val.split('-')[1]))} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-6">
            {steps.map(step => (
              <TabsTrigger key={step.number} value={`step-${step.number}`} className="text-xs">
                Step {step.number}
              </TabsTrigger>
            ))}
          </TabsList>

          {steps.map(step => (
            <TabsContent key={step.number} value={`step-${step.number}`}>
              <Card>
                <CardHeader>
                  <CardTitle className="font-serif text-2xl text-[#1E3A32]">
                    {step.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {(fieldsByStep[step.number] || []).length === 0 ? (
                    <div className="text-center py-12 border-2 border-dashed border-[#D8B46B]/30 rounded-lg">
                      <p className="text-[#2B2725]/60 mb-2">No fields configured for this step yet</p>
                      <p className="text-sm text-[#2B2725]/40">
                        Fields will appear here once they're added to the ConsultationForm entity
                      </p>
                    </div>
                  ) : (
                    (fieldsByStep[step.number] || []).map((field, idx) => (
                      <motion.div
                        key={field.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="border border-[#E4D9C4] p-4 rounded-lg hover:border-[#D8B46B] transition-colors"
                      >
                        {editingField?.id === field.id ? (
                          <FormFieldEditor
                            field={field}
                            onSave={(data) => {
                              updateMutation.mutate({ id: field.id, data });
                            }}
                            onCancel={() => setEditingField(null)}
                          />
                        ) : (
                          <FormFieldPreview
                            field={field}
                            onEdit={() => setEditingField(field)}
                          />
                        )}
                      </motion.div>
                    ))
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}

function FormFieldPreview({ field, onEdit }) {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <p className="text-xs text-[#2B2725]/60 mb-1">Field: {field.field_name}</p>
          <h3 className="font-medium text-[#1E3A32] text-lg">{field.label}</h3>
          {field.required && <span className="text-red-500 text-sm ml-1">* Required</span>}
        </div>
        <Button
          variant="outline"
          size="default"
          onClick={onEdit}
          className="border-[#D8B46B] text-[#1E3A32] hover:bg-[#D8B46B]/10"
        >
          <Edit2 size={18} className="mr-2" />
          Edit Field
        </Button>
      </div>
      {field.help_text && (
        <p className="text-sm text-[#2B2725]/70 italic bg-[#F9F5EF] p-2 rounded border-l-2 border-[#D8B46B]">{field.help_text}</p>
      )}
      <div className="flex items-center gap-4 text-sm text-[#2B2725]/60">
        <span>Type: <span className="font-mono font-semibold text-[#1E3A32]">{field.field_type}</span></span>
        {field.order && <span>Order: {field.order}</span>}
      </div>
    </div>
  );
}

function FormFieldEditor({ field, onSave, onCancel }) {
  const [formData, setFormData] = useState(field);

  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label className="text-sm">Label Text</Label>
          <Input
            value={formData.label}
            onChange={(e) => setFormData({ ...formData, label: e.target.value })}
            className="mt-1"
          />
        </div>
        <div>
          <Label className="text-sm">Field Type</Label>
          <Select value={formData.field_type} onValueChange={(value) => setFormData({ ...formData, field_type: value })}>
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="text">Text Input</SelectItem>
              <SelectItem value="email">Email</SelectItem>
              <SelectItem value="tel">Phone</SelectItem>
              <SelectItem value="date">Date</SelectItem>
              <SelectItem value="number">Number</SelectItem>
              <SelectItem value="textarea">Text Area</SelectItem>
              <SelectItem value="radio">Radio Group</SelectItem>
              <SelectItem value="checkbox">Checkbox</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label className="text-sm">Help Text / Placeholder</Label>
        <Textarea
          value={formData.help_text || ""}
          onChange={(e) => setFormData({ ...formData, help_text: e.target.value })}
          className="mt-1 min-h-[80px]"
        />
      </div>

      <div className="flex gap-2">
        <Button
          onClick={() => onSave(formData)}
          className="bg-[#1E3A32] hover:bg-[#2B2725] text-[#F9F5EF]"
        >
          <Save size={16} className="mr-2" />
          Save Changes
        </Button>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
}