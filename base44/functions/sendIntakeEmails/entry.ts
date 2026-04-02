import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';
import { jsPDF } from 'npm:jspdf@2.5.1';
import { Resend } from 'npm:resend@2.0.0';

const resend = new Resend(Deno.env.get('RESEND_API_KEY'));
const ROBERTA_EMAIL = 'roberta@yourmindstylist.com';

function buildPDF(data) {
  const doc = new jsPDF();
  let y = 20;

  const addPage = () => { doc.addPage(); y = 20; };
  const checkY = (needed = 10) => { if (y + needed > 275) addPage(); };

  const addText = (text, size = 10, bold = false) => {
    checkY(size + 4);
    doc.setFontSize(size);
    doc.setFont('helvetica', bold ? 'bold' : 'normal');
    const lines = doc.splitTextToSize(text, 170);
    doc.text(lines, 20, y);
    y += lines.length * (size * 0.45 + 2);
  };

  const addField = (label, value) => {
    checkY(12);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(`${label}:`, 20, y);
    doc.setFont('helvetica', 'normal');
    const val = Array.isArray(value) ? value.join(', ') : (value || 'N/A');
    const lines = doc.splitTextToSize(val, 130);
    doc.text(lines, 65, y);
    y += Math.max(lines.length * 6, 7);
  };

  const addSection = (title) => {
    checkY(16);
    y += 4;
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.text(title, 20, y);
    y += 8;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
  };

  addText('Initial Consultation Questionnaire', 18, true);
  y += 3;
  addText(`Submitted: ${new Date(data.submitted_date || Date.now()).toLocaleDateString()}`, 10);
  y += 5;

  addSection('Personal Information');
  addField('Name', data.name);
  addField('Date of Birth', data.birth_date);
  addField('Phone', data.phone);
  addField('Email', data.email);
  addField('Occupation', data.occupation);
  addField('Address', [data.address, data.city, data.state, data.zip].filter(Boolean).join(', '));
  addField('Emergency Contact', [data.emergency_contact_name, data.emergency_contact_phone].filter(Boolean).join(' — '));
  addField('Referring Party', data.referring_party);
  addField('How Did You Hear', data.how_did_you_hear);

  addSection('Reason for Consultation');
  if (data.primary_concerns) addText(data.primary_concerns);
  addField('Previous Hypnosis', data.previous_hypnosis === 'yes' ? 'Yes' : 'No');
  if (data.previous_hypnosis === 'yes') addText(data.previous_hypnosis_details || '');

  addSection('Medical & Mental Health History');
  addField('Health Conditions', data.health_conditions);
  if (data.health_conditions_other) addField('Other Conditions', data.health_conditions_other);
  if (data.current_medications) addField('Current Medications', data.current_medications);
  addField('Mental Health Diagnosis', data.mental_health_diagnosis === 'yes' ? 'Yes' : 'No');
  if (data.mental_health_diagnosis === 'yes') addText(data.mental_health_details || '');
  addField('Currently in Therapy', data.current_therapy === 'yes' ? 'Yes' : 'No');
  if (data.current_therapy === 'yes') addField('Therapist Aware', data.therapist_awareness);
  addField('Suicidal Thoughts (past 6 months)', data.suicidal_thoughts === 'yes' ? 'Yes' : 'No');
  addField('Substance Use', data.substance_use === 'yes' ? 'Yes' : 'No');
  if (data.substance_use === 'yes') addText(data.substance_details || '');
  addField('Excessive Emotions', data.excessive_emotions);
  addField('Life Events (past 5 years)', data.life_events);

  addSection('Goals & Expectations');
  if (data.goals_expectations) addText(data.goals_expectations);
  if (data.barriers_to_progress) addField('Barriers', data.barriers_to_progress);
  addField('Commitment Level', data.commitment_level);
  if (data.additional_info) addText(data.additional_info);

  addSection('Consent & Acknowledgment');
  addField('Signature', data.signature_name);
  addField('Date', data.signature_date);
  if (data.guardian_signature) addField('Parent/Guardian', `${data.guardian_signature} (${data.guardian_relationship})`);

  return doc.output('arraybuffer');
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { intake_id } = await req.json();

    const intakes = await base44.asServiceRole.entities.ConsultationIntake.filter({ id: intake_id });
    if (!intakes || intakes.length === 0) {
      return Response.json({ error: 'Intake not found' }, { status: 404 });
    }
    const data = intakes[0];

    const pdfBuffer = buildPDF(data);
    const pdfBase64 = btoa(String.fromCharCode(...new Uint8Array(pdfBuffer)));
    const clientName = data.name || 'New Client';
    const clientEmail = data.email;

    // 3. Upsert lead in CRM
    const intakeLink = `https://yourmindstylist.com/ConsultationQuestionnaire`;
    const existingLeads = clientEmail
      ? await base44.asServiceRole.entities.Lead.filter({ email: clientEmail })
      : [];

    if (existingLeads && existingLeads.length > 0) {
      // Update existing lead
      await base44.asServiceRole.entities.Lead.update(existingLeads[0].id, {
        first_name: data.name ? data.name.split(' ')[0] : existingLeads[0].first_name,
        last_name: data.name && data.name.split(' ').length > 1 ? data.name.split(' ').slice(1).join(' ') : existingLeads[0].last_name,
        phone: data.phone || existingLeads[0].phone,
        notes: (existingLeads[0].notes ? existingLeads[0].notes + '\n\n' : '') + `Intake form submitted on ${new Date().toLocaleDateString()}. View intake: ${intakeLink}`,
        what_inquired_about: 'Initial Consultation Intake Form',
        last_contact_date: new Date().toISOString(),
      });
    } else {
      // Create new lead
      const nameParts = (data.name || '').split(' ');
      await base44.asServiceRole.entities.Lead.create({
        email: clientEmail || '',
        first_name: nameParts[0] || '',
        last_name: nameParts.slice(1).join(' ') || '',
        phone: data.phone || '',
        source: 'website',
        stage: 'new',
        what_inquired_about: 'Initial Consultation Intake Form',
        notes: `Intake form submitted on ${new Date().toLocaleDateString()}. View intake: ${intakeLink}`,
        last_contact_date: new Date().toISOString(),
      });
    }

    // 1. Confirmation email to client
    if (clientEmail) {
      await resend.emails.send({
        from: 'Your Mind Stylist <noreply@yourmindstylist.com>',
        to: clientEmail,
        subject: 'Your Consultation Questionnaire Has Been Received',
        html: `
          <div style="font-family: 'Georgia', serif; max-width: 600px; margin: 0 auto; color: #2B2725;">
            <div style="background-color: #1E3A32; padding: 32px; text-align: center;">
              <h1 style="color: #D8B46B; font-size: 24px; margin: 0;">Your Mind Stylist</h1>
              <p style="color: #F9F5EF; margin: 8px 0 0; font-size: 13px; letter-spacing: 0.1em;">ROBERTA FERNANDEZ</p>
            </div>
            <div style="padding: 40px 32px; background-color: #F9F5EF;">
              <h2 style="color: #1E3A32; font-size: 22px; margin-top: 0;">Thank You, ${clientName}!</h2>
              <p style="line-height: 1.7; color: #2B2725;">Your Initial Consultation Questionnaire has been successfully received. Roberta will review your intake information and reach out to confirm the details of your upcoming session.</p>
              <p style="line-height: 1.7; color: #2B2725;">In the meantime, if you have any questions or need to make changes, please don't hesitate to reach out:</p>
              <div style="background: #fff; border-left: 3px solid #D8B46B; padding: 16px 20px; margin: 24px 0;">
                <p style="margin: 0 0 4px; font-size: 14px;"><strong>Email:</strong> roberta@yourmindstylist.com</p>
                <p style="margin: 0; font-size: 14px;"><strong>Phone:</strong> 612-839-2295</p>
              </div>
              <p style="line-height: 1.7; color: #2B2725; font-size: 13px; color: #777;">Please remember our 48-hour cancellation policy. Cancellations must be made at least 2 business days prior to your appointment.</p>
            </div>
            <div style="background-color: #2B2725; padding: 20px 32px; text-align: center;">
              <p style="color: #F9F5EF; font-size: 12px; margin: 0;">© ${new Date().getFullYear()} Your Mind Stylist · 8724 Spanish Ridge Ave #B, Las Vegas, NV 89148</p>
            </div>
          </div>
        `
      });
    }

    // 2. Notification email to Roberta with PDF attached
    await resend.emails.send({
      from: 'Your Mind Stylist <noreply@yourmindstylist.com>',
      to: ROBERTA_EMAIL,
      subject: `New Intake Form Submitted — ${clientName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #2B2725;">
          <div style="background-color: #1E3A32; padding: 24px 32px;">
            <h1 style="color: #D8B46B; font-size: 20px; margin: 0;">New Consultation Intake Received</h1>
          </div>
          <div style="padding: 32px; background-color: #F9F5EF;">
            <p>A new intake form has been submitted. Please find the full PDF attached.</p>
            <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-top: 16px;">
              <tr style="border-bottom: 1px solid #E4D9C4;"><td style="padding: 8px 4px; color: #777; width: 40%;">Name</td><td style="padding: 8px 4px; font-weight: bold;">${data.name || '—'}</td></tr>
              <tr style="border-bottom: 1px solid #E4D9C4;"><td style="padding: 8px 4px; color: #777;">Email</td><td style="padding: 8px 4px;">${data.email || '—'}</td></tr>
              <tr style="border-bottom: 1px solid #E4D9C4;"><td style="padding: 8px 4px; color: #777;">Phone</td><td style="padding: 8px 4px;">${data.phone || '—'}</td></tr>
              <tr style="border-bottom: 1px solid #E4D9C4;"><td style="padding: 8px 4px; color: #777;">Submitted</td><td style="padding: 8px 4px;">${new Date(data.submitted_date || Date.now()).toLocaleString()}</td></tr>
              <tr><td style="padding: 8px 4px; color: #777;">Primary Concerns</td><td style="padding: 8px 4px;">${data.primary_concerns || '—'}</td></tr>
            </table>
          </div>
        </div>
      `,
      attachments: [{
        filename: `intake_${(data.name || 'client').replace(/\s+/g, '_')}.pdf`,
        content: pdfBase64,
      }]
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error('sendIntakeEmails error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});