import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { createPageUrl } from "../utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Lock } from "lucide-react";
import { motion } from "framer-motion";

export default function ConsultationQuestionnaire() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [formFields, setFormFields] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch form fields from ConsultationForm entity
  useEffect(() => {
    const fetchFields = async () => {
      try {
        setLoading(true);
        const fields = await base44.entities.ConsultationForm.list();
        console.log('Fetched ConsultationForm fields:', fields);
        setFormFields(fields || []);
      } catch (error) {
        console.error("Error fetching form fields:", error);
        setFormFields([]);
      } finally {
        setLoading(false);
      }
    };
    fetchFields();
  }, []);

  const totalSteps = 5;
  const progress = (step / totalSteps) * 100;
  
  // Get fields for current step
  const currentStepFields = formFields
    .filter(field => field.step === step)
    .sort((a, b) => a.order - b.order);

  const healthConditionOptions = [
    "Epilepsy or seizure disorder",
    "Heart conditions",
    "High blood pressure",
    "Diabetes",
    "Respiratory conditions",
    "Chronic pain",
    "Sleep disorders",
    "Pregnancy",
    "Recent surgery",
    "Other (please specify)"
  ];

  const handleCheckboxChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(v => v !== value)
        : [...prev[field], value]
    }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const intake = await base44.entities.ConsultationIntake.create({
        ...formData,
        status: "submitted",
        submitted_date: new Date().toISOString()
      });

      // Generate PDF
      await base44.functions.invoke('generateIntakePDF', { intake_id: intake.id });

      // Navigate to confirmation
      navigate(createPageUrl('ConsultationSubmitted'));
    } catch (error) {
      console.error("Failed to submit:", error);
      alert("There was an error submitting your form. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const isStepValid = () => {
    // If no fields are configured for this step, allow progression
    if (currentStepFields.length === 0) {
      return true;
    }
    // Check if all required fields for current step are filled
    const requiredFields = currentStepFields.filter(field => field.required);
    // If no required fields, allow progression
    if (requiredFields.length === 0) {
      return true;
    }
    // Validate all required fields are filled
    return requiredFields.every(field => {
      const value = formData[field.field_name];
      if (field.field_type === 'checkbox') {
        return value === true;
      }
      return value && value.toString().trim().length > 0;
    });
  };
  
  const renderField = (field) => {
    // Handle conditional fields
    if (field.conditional_field && formData[field.conditional_field] !== field.conditional_value) {
      return null;
    }
    
    const value = formData[field.field_name] || '';
    const onChange = (newValue) => {
      setFormData(prev => ({...prev, [field.field_name]: newValue}));
    };
    
    switch (field.field_type) {
      case 'text':
      case 'email':
      case 'tel':
      case 'date':
      case 'number':
        return (
          <div key={field.field_name}>
            <Label htmlFor={field.field_name}>
              {field.label} {field.required && '*'}
            </Label>
            {field.help_text && (
              <p className="text-xs text-[#2B2725]/60 mt-1">{field.help_text}</p>
            )}
            <Input
              id={field.field_name}
              type={field.field_type}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="mt-1"
              placeholder={field.help_text}
            />
          </div>
        );
        
      case 'textarea':
      case 'conditional_text':
        return (
          <div key={field.field_name}>
            <Label htmlFor={field.field_name}>
              {field.label} {field.required && '*'}
            </Label>
            {field.help_text && (
              <p className="text-xs text-[#2B2725]/60 mt-1">{field.help_text}</p>
            )}
            <Textarea
              id={field.field_name}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="mt-1 min-h-[100px]"
              placeholder={field.help_text}
            />
          </div>
        );
        
      case 'radio':
        return (
          <div key={field.field_name}>
            <Label>
              {field.label} {field.required && '*'}
            </Label>
            {field.help_text && (
              <p className="text-xs text-[#2B2725]/60 mt-1">{field.help_text}</p>
            )}
            <RadioGroup
              value={value}
              onValueChange={onChange}
              className="mt-2"
            >
              {field.options && field.options.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`${field.field_name}-${option}`} />
                  <Label htmlFor={`${field.field_name}-${option}`} className="cursor-pointer capitalize">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        );
        
      case 'checkbox':
        return (
          <div key={field.field_name} className="flex items-start gap-3">
            <Checkbox
              id={field.field_name}
              checked={value === true}
              onCheckedChange={onChange}
            />
            <Label htmlFor={field.field_name} className="cursor-pointer leading-relaxed">
              {field.label} {field.required && '*'}
              {field.help_text && (
                <span className="block text-xs text-[#2B2725]/60 mt-1">{field.help_text}</span>
              )}
            </Label>
          </div>
        );
        
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9F5EF] pt-32 pb-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D8B46B] mx-auto mb-4"></div>
          <p className="text-[#2B2725]/60">Loading questionnaire...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F5EF] pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Lock className="text-[#D8B46B]" size={20} />
            <span className="text-sm text-[#2B2725]/60">Secure & Confidential</span>
          </div>
          <h1 className="font-serif text-4xl md:text-5xl text-[#1E3A32] mb-4">
            Initial Consultation Questionnaire
          </h1>
          <p className="text-[#2B2725]/70 max-w-2xl mx-auto">
            This form is completed online for your convenience and privacy. Information submitted is stored securely and accessed only for the purpose of your consultation.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-[#2B2725]/60">Step {step} of {totalSteps}</span>
            <span className="text-sm text-[#2B2725]/60">{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Form Steps */}
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
        >
          <Card>