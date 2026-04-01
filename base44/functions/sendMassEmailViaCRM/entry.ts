import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { subject, body, attachments = [], filters } = await req.json();

    if (!subject || !body) {
      return Response.json({ error: 'Subject and body are required' }, { status: 400 });
    }

    const MAILERLITE_API_KEY = Deno.env.get('MAILERLITE_API_KEY');
    if (!MAILERLITE_API_KEY) {
      return Response.json({ error: 'MailerLite API key not configured' }, { status: 500 });
    }

    // Fetch leads with applied filters
    let leads = await base44.asServiceRole.entities.Lead.list('', 500);

    // Apply filters
    if (filters?.tags && filters.tags.length > 0) {
      leads = leads.filter(lead =>
        filters.tags.some(tag => lead.tags?.includes(tag))
      );
    }

    if (filters?.stages && filters.stages.length > 0) {
      leads = leads.filter(lead => filters.stages.includes(lead.stage));
    }

    if (filters?.courses && filters.courses.length > 0) {
      leads = leads.filter(lead => {
        const userProgress = lead.course_ids || [];
        return filters.courses.some(course => userProgress.includes(course));
      });
    }

    const validEmails = leads.filter(l => l.email).map(l => l.email);

    if (validEmails.length === 0) {
      return Response.json({ error: 'No leads match the selected filters' }, { status: 400 });
    }

    // Build campaign payload
    const campaignPayload = {
      name: `CRM Campaign - ${new Date().toISOString()}`,
      subject,
      from_name: 'Roberta Fernandez',
      from: 'roberta@yourmindstylist.com',
      content: body,
      recipients: {
        emails: validEmails,
      },
    };

    // Add attachments if provided
    if (attachments.length > 0) {
      campaignPayload.attachments = attachments.map(att => ({
        filename: att.name,
        url: att.url,
      }));
    }

    // Send via MailerLite API - create a campaign and send
    const campaignResponse = await fetch('https://connect.mailerlite.com/api/campaigns', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${MAILERLITE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(campaignPayload),
    });

    if (!campaignResponse.ok) {
      const error = await campaignResponse.json();
      return Response.json({ error: 'Failed to create campaign in MailerLite', details: error }, { status: 500 });
    }

    const campaign = await campaignResponse.json();

    // Log activity for each lead
    for (const lead of leads) {
      if (lead.email) {
        await base44.asServiceRole.entities.LeadActivity.create({
          lead_id: lead.id,
          activity_type: 'mass_email_sent',
          description: `Mass email sent: "${subject}" (Campaign: ${campaign.id})`,
        });
      }
    }

    return Response.json({
      success: true,
      recipientCount: validEmails.length,
      campaignId: campaign.id,
      message: `Campaign sent to ${validEmails.length} leads via MailerLite`,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});