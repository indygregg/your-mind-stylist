import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

// Also trigger MailerLite automation
async function addToMailerLite(email, name, bookingData) {
  try {
    const apiKey = Deno.env.get('MAILERLITE_API_KEY');
    if (!apiKey) return;

    await fetch('https://connect.mailerlite.com/api/subscribers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        email,
        fields: {
          name: name || '',
          last_booking_date: new Date().toISOString(),
          last_booking_type: bookingData.service_type
        }
      })
    });
  } catch (error) {
    console.log('MailerLite sync failed (non-critical):', error.message);
  }
}
import { renderToStaticMarkup } from 'npm:react-dom@18.2.0/server';
import React from 'npm:react@18.2.0';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const { booking_id, recipient_type } = await req.json();

        if (!booking_id || !recipient_type) {
            return Response.json({ error: 'booking_id and recipient_type required' }, { status: 400 });
        }

        // Fetch booking details
        const booking = await base44.asServiceRole.entities.Booking.filter({ id: booking_id });
        if (!booking || booking.length === 0) {
            return Response.json({ error: 'Booking not found' }, { status: 404 });
        }

        const bookingData = booking[0];

        // Get custom email template if exists
        const templateKey = recipient_type === 'manager' 
            ? 'booking_confirmation_manager'
            : 'booking_confirmation_client';
        
        const templates = await base44.asServiceRole.entities.EmailTemplate.filter({
            template_key: templateKey,
            active: true
        });
        
        let emailHtml, subject, recipient;

        if (templates.length > 0) {
            // Use custom template
            const template = templates[0];
            subject = template.subject;
            emailHtml = template.body_html;

            // Helper functions
            const formatAmount = (amount) => {
                return new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                }).format(amount / 100);
            };

            const formatDate = (date) => {
                if (!date) return "Not scheduled yet";
                return new Date(date).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit"
                });
            };

            // Replace variables
            emailHtml = emailHtml
                .replace(/\{\{user_name\}\}/g, bookingData.user_name || '')
                .replace(/\{\{user_email\}\}/g, bookingData.user_email || '')
                .replace(/\{\{service_type\}\}/g, bookingData.service_type?.replace(/_/g, " ").toUpperCase() || '')
                .replace(/\{\{amount\}\}/g, formatAmount(bookingData.amount))
                .replace(/\{\{session_count\}\}/g, bookingData.session_count || '1')
                .replace(/\{\{scheduled_date\}\}/g, formatDate(bookingData.scheduled_date))
                .replace(/\{\{zoom_join_url\}\}/g, bookingData.zoom_join_url || '')
                .replace(/\{\{zoom_start_url\}\}/g, bookingData.zoom_start_url || '')
                .replace(/\{\{zoom_password\}\}/g, bookingData.zoom_password || '')
                .replace(/\{\{notes\}\}/g, bookingData.notes || '')
                .replace(/\{\{booking_id\}\}/g, bookingData.id || '');

            recipient = recipient_type === 'manager' 
                ? 'roberta@yourmindstylist.com'
                : bookingData.user_email;

        } else {
            // Fallback to default React components
            const BookingConfirmationClient = (await import('../components/email/BookingConfirmationClient.js')).default;
            const BookingConfirmationManager = (await import('../components/email/BookingConfirmationManager.js')).default;

            if (recipient_type === 'client') {
                emailHtml = renderToStaticMarkup(React.createElement(BookingConfirmationClient, { booking: bookingData }));
                subject = 'Your Private Session Booking is Confirmed';
                recipient = bookingData.user_email;
            } else if (recipient_type === 'manager') {
                emailHtml = renderToStaticMarkup(React.createElement(BookingConfirmationManager, { booking: bookingData }));
                subject = `New Booking: ${bookingData.user_name} - ${bookingData.service_type}`;
                recipient = 'roberta@yourmindstylist.com';
            } else {
                return Response.json({ error: 'Invalid recipient_type' }, { status: 400 });
            }
        }

        // Try to send email via Core.SendEmail, but if it fails (unregistered user), use MailerLite
        let emailSent = false;
        try {
            await base44.asServiceRole.integrations.Core.SendEmail({
                to: recipient,
                subject: subject,
                body: emailHtml
            });
            emailSent = true;
        } catch (emailError) {
            console.log('Core.SendEmail failed (likely unregistered user), will use MailerLite:', emailError.message);
        }

        // If Core.SendEmail failed, try to send via MailerLite API directly
        if (!emailSent && recipient_type === 'client') {
            try {
                const apiKey = Deno.env.get('MAILERLITE_API_KEY');
                if (apiKey) {
                    // First ensure subscriber exists
                    await fetch('https://connect.mailerlite.com/api/subscribers', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${apiKey}`,
                        },
                        body: JSON.stringify({
                            email: bookingData.user_email,
                            fields: {
                                name: bookingData.user_name || '',
                            }
                        })
                    });

                    // Send transactional email
                    const emailResponse = await fetch('https://connect.mailerlite.com/api/campaigns', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${apiKey}`,
                        },
                        body: JSON.stringify({
                            type: 'regular',
                            name: `Booking Confirmation - ${bookingData.id}`,
                            emails: [bookingData.user_email],
                            groups: [],
                            from: 'roberta@yourmindstylist.com',
                            from_name: 'Roberta Fernandez - Your Mind Stylist',
                            subject: subject,
                            content: emailHtml
                        })
                    });

                    if (emailResponse.ok) {
                        emailSent = true;
                        console.log('Email sent via MailerLite');
                    } else {
                        console.error('MailerLite campaign failed:', await emailResponse.text());
                    }
                }
            } catch (mlError) {
                console.error('MailerLite send error:', mlError.message);
            }
        }

        // Add to MailerLite for automation sequences (client only)
        if (recipient_type === 'client') {
            await addToMailerLite(bookingData.user_email, bookingData.user_name, bookingData);
        }

        return Response.json({ success: emailSent, sent_to: recipient, method: emailSent ? 'email_sent' : 'email_failed' });

    } catch (error) {
        console.error('Email send error:', error);
        return Response.json({ error: error.message }, { status: 500 });
    }
});