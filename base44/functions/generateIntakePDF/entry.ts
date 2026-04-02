import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';
import { jsPDF } from 'npm:jspdf@2.5.1';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { intake_id } = await req.json();
    const intake = await base44.asServiceRole.entities.ConsultationIntake.filter({ id: intake_id });

    if (!intake || intake.length === 0) {
      return Response.json({ error: 'Intake not found' }, { status: 404 });
    }

    const data = intake[0];
    const doc = new jsPDF();
    let y = 20;

    // Header
    doc.setFontSize(20);
    doc.text('Initial Consultation Questionnaire', 20, y);
    y += 10;
    doc.setFontSize(10);
    doc.text(`Submitted: ${new Date(data.submitted_date).toLocaleDateString()}`, 20, y);
    y += 15;

    // Personal Information
    doc.setFontSize(14);
    doc.text('Personal Information', 20, y);
    y += 8;
    doc.setFontSize(10);

    const addField = (label, value) => {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
      doc.text(`${label}: ${value || 'N/A'}`, 20, y);
      y += 6;
    };

    const addSection = (title) => {
      if (y > 265) {
        doc.addPage();
        y = 20;
      }
      y += 5;
      doc.setFontSize(14);
      doc.text(title, 20, y);
      y += 8;
      doc.setFontSize(10);
    };

    addField('Name', data.name);
    addField('Date of Birth', data.birth_date);
    addField('Address', `${data.address || ''}, ${data.city || ''}, ${data.state || ''} ${data.zip || ''}`);
    addField('Phone', data.phone);
    addField('Email', data.email);
    addField('Occupation', data.occupation);
    addField('Emergency Contact', `${data.emergency_contact_name || ''} - ${data.emergency_contact_phone || ''}`);
    addField('Referring Party', data.referring_party);
    addField('How Did You Hear', data.how_did_you_hear);

    addSection('Reason for Consultation');
    const primaryConcerns = data.primary_concerns || '';
    const splitText = doc.splitTextToSize(primaryConcerns, 170);
    doc.text(splitText, 20, y);
    y += splitText.length * 6;

    addField('Previous Hypnosis', data.previous_hypnosis === 'yes' ? 'Yes' : 'No');
    if (data.previous_hypnosis === 'yes' && data.previous_hypnosis_details) {
      const details = doc.splitTextToSize(data.previous_hypnosis_details, 170);
      doc.text(details, 20, y);
      y += details.length * 6;
    }

    addSection('Medical & Mental Health History');
    if (data.health_conditions && data.health_conditions.length > 0) {
      addField('Health Conditions', data.health_conditions.join(', '));
    }
    if (data.health_conditions_other) {
      addField('Other Conditions', data.health_conditions_other);
    }
    if (data.current_medications) {
      const meds = doc.splitTextToSize(`Medications: ${data.current_medications}`, 170);
      doc.text(meds, 20, y);
      y += meds.length * 6;
    }
    addField('Mental Health Diagnosis', data.mental_health_diagnosis === 'yes' ? 'Yes' : 'No');
    if (data.mental_health_diagnosis === 'yes' && data.mental_health_details) {
      const mhDetails = doc.splitTextToSize(data.mental_health_details, 170);
      doc.text(mhDetails, 20, y);
      y += mhDetails.length * 6;
    }
    addField('Currently in Therapy', data.current_therapy === 'yes' ? 'Yes' : 'No');
    if (data.current_therapy === 'yes') {
      addField('Therapist Aware', data.therapist_awareness);
    }
    addField('Suicidal Thoughts (past 6 months)', data.suicidal_thoughts === 'yes' ? 'Yes' : 'No');
    addField('Substance Use', data.substance_use === 'yes' ? 'Yes' : 'No');
    if (data.substance_use === 'yes' && data.substance_details) {
      const substanceDetails = doc.splitTextToSize(data.substance_details, 170);
      doc.text(substanceDetails, 20, y);
      y += substanceDetails.length * 6;
    }

    addSection('Goals & Expectations');
    if (data.goals_expectations) {
      const goals = doc.splitTextToSize(data.goals_expectations, 170);
      doc.text(goals, 20, y);
      y += goals.length * 6;
    }
    if (data.barriers_to_progress) {
      const barriers = doc.splitTextToSize(`Barriers: ${data.barriers_to_progress}`, 170);
      doc.text(barriers, 20, y);
      y += barriers.length * 6;
    }
    addField('Commitment Level', data.commitment_level);
    if (data.additional_info) {
      const addInfo = doc.splitTextToSize(`Additional: ${data.additional_info}`, 170);
      doc.text(addInfo, 20, y);
      y += addInfo.length * 6;
    }

    addSection('Consent & Acknowledgment');
    addField('Medical Advice Disclaimer', data.consent_no_medical_advice ? 'Acknowledged' : 'Not acknowledged');
    addField('Not Therapy Disclaimer', data.consent_not_therapy ? 'Acknowledged' : 'Not acknowledged');
    addField('Confidentiality', data.consent_confidentiality ? 'Acknowledged' : 'Not acknowledged');
    addField('Voluntary Participation', data.consent_voluntary ? 'Acknowledged' : 'Not acknowledged');
    addField('Questions Answered', data.consent_questions_answered ? 'Acknowledged' : 'Not acknowledged');
    
    y += 5;
    addField('Signature', data.signature_name);
    addField('Date', data.signature_date);
    if (data.guardian_signature) {
      addField('Parent/Guardian', `${data.guardian_signature} (${data.guardian_relationship})`);
    }

    const pdfBytes = doc.output('arraybuffer');

    return new Response(pdfBytes, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename=intake_${data.name.replace(/\s+/g, '_')}_${Date.now()}.pdf`
      }
    });
  } catch (error) {
    console.error('PDF generation error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});