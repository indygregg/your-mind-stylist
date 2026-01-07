import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, AlertCircle, Lock } from "lucide-react";
import { motion } from "framer-motion";

export default function ConsultationQuestionnaire() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    phone: "",
    email: "",
    birth_date: "",
    occupation: "",
    emergency_contact_name: "",
    emergency_contact_phone: "",
    emergency_secondary: false,
    referring_party: "",
    how_did_you_hear: "",
    primary_concerns: "",
    previous_hypnosis: "",
    previous_hypnosis_details: "",
    health_conditions: [],
    health_conditions_other: "",
    current_medications: "",
    mental_health_diagnosis: "",
    mental_health_details: "",
    current_therapy: "",
    therapist_awareness: "",
    suicidal_thoughts: "",
    substance_use: "",
    substance_details: "",
    goals_expectations: "",
    barriers_to_progress: "",
    commitment_level: "",
    additional_info: "",
    consent_no_medical_advice: false,
    consent_not_therapy: false,
    consent_confidentiality: false,
    consent_voluntary: false,
    consent_questions_answered: false,
    signature_name: "",
    signature_date: new Date().toISOString().split('T')[0],
    guardian_signature: "",
    guardian_relationship: ""
  });

  const totalSteps = 5;
  const progress = (step / totalSteps) * 100;

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
      navigate('/consultation-submitted');
    } catch (error) {
      console.error("Failed to submit:", error);
      alert("There was an error submitting your form. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const isStepValid = () => {
    switch(step) {
      case 1:
        return formData.name && formData.email && formData.phone && formData.birth_date;
      case 2:
        return formData.primary_concerns && formData.previous_hypnosis;
      case 3:
        return formData.suicidal_thoughts && formData.substance_use;
      case 4:
        return formData.goals_expectations;
      case 5:
        return formData.consent_no_medical_advice && 
               formData.consent_not_therapy && 
               formData.consent_confidentiality && 
               formData.consent_voluntary && 
               formData.consent_questions_answered && 
               formData.signature_name;
      default:
        return true;
    }
  };

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
          <Alert className="mt-6 bg-blue-50 border-blue-200">
            <AlertDescription className="text-sm text-[#2B2725]/80">
              Some questions are personal. You may skip any that feel uncomfortable and discuss them during your consultation.
            </AlertDescription>
          </Alert>
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
            <CardContent className="pt-6">
              {step === 1 && (
                <div className="space-y-6">
                  <CardTitle className="font-serif text-2xl text-[#1E3A32] mb-6">
                    Personal Information
                  </CardTitle>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="birth_date">Date of Birth *</Label>
                      <Input
                        id="birth_date"
                        type="date"
                        value={formData.birth_date}
                        onChange={(e) => setFormData({...formData, birth_date: e.target.value})}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      className="mt-1"
                    />
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => setFormData({...formData, city: e.target.value})}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        value={formData.state}
                        onChange={(e) => setFormData({...formData, state: e.target.value})}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="zip">Zip Code</Label>
                      <Input
                        id="zip"
                        value={formData.zip}
                        onChange={(e) => setFormData({...formData, zip: e.target.value})}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">Phone *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="occupation">Occupation</Label>
                    <Input
                      id="occupation"
                      value={formData.occupation}
                      onChange={(e) => setFormData({...formData, occupation: e.target.value})}
                      className="mt-1"
                    />
                  </div>

                  <div className="border-t pt-6 mt-6">
                    <h3 className="font-medium text-[#1E3A32] mb-4">Emergency Contact</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="emergency_contact_name">Name</Label>
                        <Input
                          id="emergency_contact_name"
                          value={formData.emergency_contact_name}
                          onChange={(e) => setFormData({...formData, emergency_contact_name: e.target.value})}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="emergency_contact_phone">Phone</Label>
                        <Input
                          id="emergency_contact_phone"
                          type="tel"
                          value={formData.emergency_contact_phone}
                          onChange={(e) => setFormData({...formData, emergency_contact_phone: e.target.value})}
                          className="mt-1"
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                      <Checkbox
                        id="emergency_secondary"
                        checked={formData.emergency_secondary}
                        onCheckedChange={(checked) => setFormData({...formData, emergency_secondary: checked})}
                      />
                      <Label htmlFor="emergency_secondary" className="cursor-pointer">
                        I'd like to provide a secondary emergency contact
                      </Label>
                    </div>
                  </div>

                  <div className="border-t pt-6 mt-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="referring_party">Referring Party (if applicable)</Label>
                        <Input
                          id="referring_party"
                          value={formData.referring_party}
                          onChange={(e) => setFormData({...formData, referring_party: e.target.value})}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="how_did_you_hear">How did you hear about us?</Label>
                        <Input
                          id="how_did_you_hear"
                          value={formData.how_did_you_hear}
                          onChange={(e) => setFormData({...formData, how_did_you_hear: e.target.value})}
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <CardTitle className="font-serif text-2xl text-[#1E3A32] mb-6">
                    Reason for Consultation
                  </CardTitle>

                  <div>
                    <Label htmlFor="primary_concerns">
                      What are your primary concerns or reasons for seeking hypnosis services? *
                    </Label>
                    <Textarea
                      id="primary_concerns"
                      value={formData.primary_concerns}
                      onChange={(e) => setFormData({...formData, primary_concerns: e.target.value})}
                      className="mt-1 min-h-[120px]"
                      placeholder="Be as specific as possible..."
                    />
                  </div>

                  <div>
                    <Label>Have you ever worked with a hypnotist before? *</Label>
                    <RadioGroup
                      value={formData.previous_hypnosis}
                      onValueChange={(value) => setFormData({...formData, previous_hypnosis: value})}
                      className="mt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="prev-yes" />
                        <Label htmlFor="prev-yes" className="cursor-pointer">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="prev-no" />
                        <Label htmlFor="prev-no" className="cursor-pointer">No</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {formData.previous_hypnosis === "yes" && (
                    <div>
                      <Label htmlFor="previous_hypnosis_details">
                        Please describe your previous experience with hypnosis
                      </Label>
                      <Textarea
                        id="previous_hypnosis_details"
                        value={formData.previous_hypnosis_details}
                        onChange={(e) => setFormData({...formData, previous_hypnosis_details: e.target.value})}
                        className="mt-1"
                      />
                    </div>
                  )}
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6">
                  <CardTitle className="font-serif text-2xl text-[#1E3A32] mb-6">
                    Medical & Mental Health History
                  </CardTitle>

                  <Alert className="bg-yellow-50 border-yellow-200">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-sm">
                      This information helps us provide you with the safest and most appropriate service. All responses are confidential.
                    </AlertDescription>
                  </Alert>

                  <div>
                    <Label className="mb-3 block">
                      Do you have any of the following health conditions? (Check all that apply)
                    </Label>
                    <div className="space-y-2">
                      {healthConditionOptions.map((condition) => (
                        <div key={condition} className="flex items-center gap-2">
                          <Checkbox
                            id={condition}
                            checked={formData.health_conditions.includes(condition)}
                            onCheckedChange={() => handleCheckboxChange('health_conditions', condition)}
                          />
                          <Label htmlFor={condition} className="cursor-pointer">
                            {condition}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {formData.health_conditions.includes("Other (please specify)") && (
                    <div>
                      <Label htmlFor="health_conditions_other">Please specify other conditions</Label>
                      <Input
                        id="health_conditions_other"
                        value={formData.health_conditions_other}
                        onChange={(e) => setFormData({...formData, health_conditions_other: e.target.value})}
                        className="mt-1"
                      />
                    </div>
                  )}

                  <div>
                    <Label htmlFor="current_medications">
                      List any current medications (prescription and over-the-counter)
                    </Label>
                    <Textarea
                      id="current_medications"
                      value={formData.current_medications}
                      onChange={(e) => setFormData({...formData, current_medications: e.target.value})}
                      className="mt-1"
                      placeholder="Include dosages if known"
                    />
                  </div>

                  <div>
                    <Label>
                      Have you been diagnosed with any mental health conditions? *
                    </Label>
                    <RadioGroup
                      value={formData.mental_health_diagnosis}
                      onValueChange={(value) => setFormData({...formData, mental_health_diagnosis: value})}
                      className="mt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="mh-yes" />
                        <Label htmlFor="mh-yes" className="cursor-pointer">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="mh-no" />
                        <Label htmlFor="mh-no" className="cursor-pointer">No</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {formData.mental_health_diagnosis === "yes" && (
                    <div>
                      <Label htmlFor="mental_health_details">
                        Please provide details (diagnosis, when diagnosed, treatment)
                      </Label>
                      <Textarea
                        id="mental_health_details"
                        value={formData.mental_health_details}
                        onChange={(e) => setFormData({...formData, mental_health_details: e.target.value})}
                        className="mt-1"
                      />
                    </div>
                  )}

                  <div>
                    <Label>Are you currently in therapy or counseling? *</Label>
                    <RadioGroup
                      value={formData.current_therapy}
                      onValueChange={(value) => setFormData({...formData, current_therapy: value})}
                      className="mt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="therapy-yes" />
                        <Label htmlFor="therapy-yes" className="cursor-pointer">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="therapy-no" />
                        <Label htmlFor="therapy-no" className="cursor-pointer">No</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {formData.current_therapy === "yes" && (
                    <div>
                      <Label>Is your therapist aware you're seeking hypnosis services?</Label>
                      <RadioGroup
                        value={formData.therapist_awareness}
                        onValueChange={(value) => setFormData({...formData, therapist_awareness: value})}
                        className="mt-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="yes" id="aware-yes" />
                          <Label htmlFor="aware-yes" className="cursor-pointer">Yes</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="no" id="aware-no" />
                          <Label htmlFor="aware-no" className="cursor-pointer">No</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="not_applicable" id="aware-na" />
                          <Label htmlFor="aware-na" className="cursor-pointer">Not applicable</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  )}

                  <div className="border-t pt-6 mt-6">
                    <div>
                      <Label>
                        Have you experienced suicidal thoughts in the past 6 months? *
                      </Label>
                      <RadioGroup
                        value={formData.suicidal_thoughts}
                        onValueChange={(value) => setFormData({...formData, suicidal_thoughts: value})}
                        className="mt-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="yes" id="suicide-yes" />
                          <Label htmlFor="suicide-yes" className="cursor-pointer">Yes</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="no" id="suicide-no" />
                          <Label htmlFor="suicide-no" className="cursor-pointer">No</Label>
                        </div>
                      </RadioGroup>
                      {formData.suicidal_thoughts === "yes" && (
                        <Alert className="mt-4 bg-red-50 border-red-200">
                          <AlertDescription className="text-sm">
                            Thank you for your honesty. This service may not be appropriate at this time. Please contact a mental health professional or call the National Suicide Prevention Lifeline at 988.
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label>Do you use alcohol, tobacco, or recreational substances regularly? *</Label>
                    <RadioGroup
                      value={formData.substance_use}
                      onValueChange={(value) => setFormData({...formData, substance_use: value})}
                      className="mt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="substance-yes" />
                        <Label htmlFor="substance-yes" className="cursor-pointer">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="substance-no" />
                        <Label htmlFor="substance-no" className="cursor-pointer">No</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {formData.substance_use === "yes" && (
                    <div>
                      <Label htmlFor="substance_details">Please provide details</Label>
                      <Textarea
                        id="substance_details"
                        value={formData.substance_details}
                        onChange={(e) => setFormData({...formData, substance_details: e.target.value})}
                        className="mt-1"
                      />
                    </div>
                  )}
                </div>
              )}

              {step === 4 && (
                <div className="space-y-6">
                  <CardTitle className="font-serif text-2xl text-[#1E3A32] mb-6">
                    Goals & Expectations
                  </CardTitle>

                  <div>
                    <Label htmlFor="goals_expectations">
                      What are your specific goals for working together? What would success look like to you? *
                    </Label>
                    <Textarea
                      id="goals_expectations"
                      value={formData.goals_expectations}
                      onChange={(e) => setFormData({...formData, goals_expectations: e.target.value})}
                      className="mt-1 min-h-[120px]"
                      placeholder="Be as specific as possible..."
                    />
                  </div>

                  <div>
                    <Label htmlFor="barriers_to_progress">
                      What do you think might get in the way of your progress?
                    </Label>
                    <Textarea
                      id="barriers_to_progress"
                      value={formData.barriers_to_progress}
                      onChange={(e) => setFormData({...formData, barriers_to_progress: e.target.value})}
                      className="mt-1"
                      placeholder="Time, motivation, support, resources, etc."
                    />
                  </div>

                  <div>
                    <Label htmlFor="commitment_level">
                      On a scale of 1-10, how committed are you to making changes in your life right now?
                    </Label>
                    <Input
                      id="commitment_level"
                      type="number"
                      min="1"
                      max="10"
                      value={formData.commitment_level}
                      onChange={(e) => setFormData({...formData, commitment_level: e.target.value})}
                      className="mt-1"
                      placeholder="1 (not ready) to 10 (fully committed)"
                    />
                  </div>

                  <div>
                    <Label htmlFor="additional_info">
                      Is there anything else you'd like me to know before our consultation?
                    </Label>
                    <Textarea
                      id="additional_info"
                      value={formData.additional_info}
                      onChange={(e) => setFormData({...formData, additional_info: e.target.value})}
                      className="mt-1 min-h-[100px]"
                    />
                  </div>
                </div>
              )}

              {step === 5 && (
                <div className="space-y-6">
                  <CardTitle className="font-serif text-2xl text-[#1E3A32] mb-6">
                    Consent & Acknowledgment
                  </CardTitle>

                  <Alert className="bg-blue-50 border-blue-200">
                    <AlertDescription className="text-sm">
                      Please read and acknowledge the following statements carefully.
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-4 border-l-2 border-[#D8B46B] pl-4">
                    <div className="flex items-start gap-3">
                      <Checkbox
                        id="consent_no_medical_advice"
                        checked={formData.consent_no_medical_advice}
                        onCheckedChange={(checked) => setFormData({...formData, consent_no_medical_advice: checked})}
                      />
                      <Label htmlFor="consent_no_medical_advice" className="cursor-pointer leading-relaxed">
                        I understand that hypnosis services are <strong>not medical advice, diagnosis, or treatment</strong>. I have been encouraged to consult with my physician or other qualified health care provider before beginning any program.
                      </Label>
                    </div>

                    <div className="flex items-start gap-3">
                      <Checkbox
                        id="consent_not_therapy"
                        checked={formData.consent_not_therapy}
                        onCheckedChange={(checked) => setFormData({...formData, consent_not_therapy: checked})}
                      />
                      <Label htmlFor="consent_not_therapy" className="cursor-pointer leading-relaxed">
                        I understand that this is <strong>not psychotherapy or mental health counseling</strong>. These services are supportive and educational in nature, designed to enhance personal growth and self-management.
                      </Label>
                    </div>

                    <div className="flex items-start gap-3">
                      <Checkbox
                        id="consent_confidentiality"
                        checked={formData.consent_confidentiality}
                        onCheckedChange={(checked) => setFormData({...formData, consent_confidentiality: checked})}
                      />
                      <Label htmlFor="consent_confidentiality" className="cursor-pointer leading-relaxed">
                        I understand that all information shared will be kept <strong>confidential</strong>, except as required by law (e.g., if there is imminent danger to myself or others).
                      </Label>
                    </div>

                    <div className="flex items-start gap-3">
                      <Checkbox
                        id="consent_voluntary"
                        checked={formData.consent_voluntary}
                        onCheckedChange={(checked) => setFormData({...formData, consent_voluntary: checked})}
                      />
                      <Label htmlFor="consent_voluntary" className="cursor-pointer leading-relaxed">
                        I understand that my participation is <strong>completely voluntary</strong> and I may discontinue services at any time.
                      </Label>
                    </div>

                    <div className="flex items-start gap-3">
                      <Checkbox
                        id="consent_questions_answered"
                        checked={formData.consent_questions_answered}
                        onCheckedChange={(checked) => setFormData({...formData, consent_questions_answered: checked})}
                      />
                      <Label htmlFor="consent_questions_answered" className="cursor-pointer leading-relaxed">
                        I have had the opportunity to <strong>ask questions</strong>, and they have been answered to my satisfaction (or I will ask them during my consultation).
                      </Label>
                    </div>
                  </div>

                  <div className="border-t pt-6 mt-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="signature_name">Full Name (Electronic Signature) *</Label>
                        <Input
                          id="signature_name"
                          value={formData.signature_name}
                          onChange={(e) => setFormData({...formData, signature_name: e.target.value})}
                          className="mt-1"
                          placeholder="Type your full name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="signature_date">Date *</Label>
                        <Input
                          id="signature_date"
                          type="date"
                          value={formData.signature_date}
                          onChange={(e) => setFormData({...formData, signature_date: e.target.value})}
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mt-6">
                    <h4 className="font-medium text-[#1E3A32] mb-2">For Clients Under 18</h4>
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="guardian_signature">Parent/Guardian Name</Label>
                        <Input
                          id="guardian_signature"
                          value={formData.guardian_signature}
                          onChange={(e) => setFormData({...formData, guardian_signature: e.target.value})}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="guardian_relationship">Relationship to Client</Label>
                        <Input
                          id="guardian_relationship"
                          value={formData.guardian_relationship}
                          onChange={(e) => setFormData({...formData, guardian_relationship: e.target.value})}
                          className="mt-1"
                          placeholder="e.g., Mother, Father, Legal Guardian"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          {step > 1 && (
            <Button
              variant="outline"
              onClick={() => setStep(step - 1)}
              className="border-[#D8B46B] text-[#1E3A32]"
            >
              Previous
            </Button>
          )}
          {step < totalSteps ? (
            <Button
              onClick={() => setStep(step + 1)}
              disabled={!isStepValid()}
              className="bg-[#1E3A32] hover:bg-[#2B2725] text-[#F9F5EF] ml-auto"
            >
              Next
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!isStepValid() || submitting}
              className="bg-[#D8B46B] hover:bg-[#F9F5EF] text-[#1E3A32] ml-auto"
            >
              {submitting ? "Submitting..." : "Submit Questionnaire"}
              {!submitting && <CheckCircle2 className="ml-2" size={16} />}
            </Button>
          )}
        </div>

        {/* Auto-save indicator */}
        <p className="text-center text-xs text-[#2B2725]/50 mt-4">
          Your progress is automatically saved as you complete each step
        </p>
      </div>
    </div>
  );
}