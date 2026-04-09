import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

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
        const userCourses = lead.course_ids || [];
        return filters.courses.some(course => userCourses.includes(course));
      });
    }

    const validLeads = leads.filter(l => l.email);

    if (validLeads.length === 0) {
      return Response.json({ error: 'No leads match the selected filters' }, { status: 400 });
    }

    // Build the full HTML email body with Roberta's branding
    const fullHtml = `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; color: #2B2725;">
        <div style="background: #1E3A32; padding: 24px; text-align: center;">
          <h2 style="color: #D8B46B; margin: 0; font-size: 18px; letter-spacing: 2px;">YOUR MIND STYLIST</h2>
          <p style="color: #F9F5EF; margin: 4px 0 0; font-size: 12px;">Roberta Fernandez</p>
        </div>
        <div style="padding: 32px 24px; background: #F9F5EF;">
          ${body}
        </div>
        ${attachments.length > 0 ? `
          <div style="padding: 16px 24px; background: #F9F5EF; border-top: 1px solid #E4D9C4;">
            <p style="font-size: 14px; color: #2B2725; margin: 0 0 8px;"><strong>Attachments:</strong></p>
            ${attachments.map(att => `<p style="margin: 4px 0;"><a href="${att.url}" style="color: #1E3A32;">${att.name}</a></p>`).join('')}
          </div>
        ` : ''}
        <div style="background: #1E3A32; padding: 16px 24px; text-align: center;">
          <p style="color: #F9F5EF; font-size: 11px; margin: 0;">© ${new Date().getFullYear()} Your Mind Stylist. All rights reserved.</p>
          <p style="color: #F9F5EF; font-size: 11px; margin: 4px 0 0;">8724 Spanish Ridge Ave #B, Las Vegas, NV 89148</p>
        </div>
      </div>
    `;

    // Send individual emails using the built-in SendEmail integration
    let successCount = 0;
    let failCount = 0;
    const errors = [];

    // Send in batches of 5 to avoid rate limits
    const batchSize = 5;
    for (let i = 0; i < validLeads.length; i += batchSize) {
      const batch = validLeads.slice(i, i + batchSize);
      const results = await Promise.allSettled(
        batch.map(lead =>
          base44.asServiceRole.integrations.Core.SendEmail({
            to: lead.email,
            subject: subject,
            body: fullHtml,
            from_name: 'Roberta Fernandez',
          })
        )
      );

      for (let j = 0; j < results.length; j++) {
        if (results[j].status === 'fulfilled') {
          successCount++;
        } else {
          failCount++;
          errors.push({ email: batch[j].email, error: results[j].reason?.message });
        }
      }

      // Small delay between batches
      if (i + batchSize < validLeads.length) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    // Log activity for successfully sent leads
    for (const lead of validLeads) {
      try {
        await base44.asServiceRole.entities.LeadActivity.create({
          lead_id: lead.id,
          activity_type: 'mass_email_sent',
          description: `Mass email sent: "${subject}"`,
        });
      } catch (e) {
        // Don't fail the whole operation for activity logging
        console.warn(`Failed to log activity for lead ${lead.id}:`, e.message);
      }
    }

    return Response.json({
      success: true,
      recipientCount: successCount,
      failedCount: failCount,
      errors: errors.length > 0 ? errors : undefined,
      message: `Email sent to ${successCount} lead(s)${failCount > 0 ? `, ${failCount} failed` : ''}`,
    });
  } catch (error) {
    console.error('sendMassEmailViaCRM error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});