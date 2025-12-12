import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';
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

        // Import email components
        const BookingConfirmationClient = (await import('../components/email/BookingConfirmationClient.js')).default;
        const BookingConfirmationManager = (await import('../components/email/BookingConfirmationManager.js')).default;

        let emailHtml, subject, recipient;

        if (recipient_type === 'client') {
            emailHtml = renderToStaticMarkup(React.createElement(BookingConfirmationClient, { booking: bookingData }));
            subject = 'Your Private Session Booking is Confirmed';
            recipient = bookingData.user_email;
        } else if (recipient_type === 'manager') {
            emailHtml = renderToStaticMarkup(React.createElement(BookingConfirmationManager, { booking: bookingData }));
            subject = `New Booking: ${bookingData.user_name} - ${bookingData.service_type}`;
            recipient = 'roberta@yourmindstylist.com'; // Manager email
        } else {
            return Response.json({ error: 'Invalid recipient_type' }, { status: 400 });
        }

        // Send email
        await base44.asServiceRole.integrations.Core.SendEmail({
            to: recipient,
            subject: subject,
            body: emailHtml
        });

        return Response.json({ success: true, sent_to: recipient });

    } catch (error) {
        console.error('Email send error:', error);
        return Response.json({ error: error.message }, { status: 500 });
    }
});