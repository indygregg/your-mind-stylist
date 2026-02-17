import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    const body = await req.json();

    // Support both entity automation payload and direct call
    let booking_id;
    if (body.event && body.event.entity_id) {
      booking_id = body.event.entity_id;
    } else {
      booking_id = body.booking_id;
    }

    if (!booking_id) {
      return Response.json({ error: 'booking_id is required' }, { status: 400 });
    }

    // Get booking
    const bookings = await base44.asServiceRole.entities.Booking.filter({ id: booking_id });
    if (!bookings || bookings.length === 0) {
      return Response.json({ error: 'Booking not found' }, { status: 404 });
    }

    const booking = bookings[0];

    // Get access token
    const accessToken = await base44.asServiceRole.connectors.getAccessToken('googlecalendar');
    
    if (!accessToken) {
      return Response.json({ error: 'Google Calendar not connected' }, { status: 400 });
    }

    // Create calendar event
    const eventData = {
      summary: `${booking.service_type} Session with ${booking.user_name}`,
      description: `Booking ID: ${booking.id}\nClient: ${booking.user_name}\nEmail: ${booking.user_email}\nPhone: ${booking.client_phone || 'N/A'}\n\n${booking.zoom_join_url ? `Join Zoom Meeting: ${booking.zoom_join_url}\nPassword: ${booking.zoom_password || 'N/A'}` : 'Zoom link will be added soon'}`,
      location: booking.zoom_join_url || 'Virtual - Zoom link pending',
      start: {
        dateTime: new Date(booking.scheduled_date).toISOString(),
        timeZone: 'America/Los_Angeles',
      },
      end: {
        dateTime: new Date(new Date(booking.scheduled_date).getTime() + 60 * 60 * 1000).toISOString(),
        timeZone: 'America/Los_Angeles',
      },
      attendees: [
        { email: booking.user_email },
      ],
      conferenceData: booking.zoom_join_url ? {
        entryPoints: [{
          entryPointType: 'video',
          uri: booking.zoom_join_url,
          label: 'Join Zoom Meeting',
        }],
      } : undefined,
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 },
          { method: 'popup', minutes: 60 },
        ],
      },
    };

    const response = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventData),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Google Calendar API error: ${error}`);
    }

    const event = await response.json();

    // Update booking with calendar event ID
    await base44.asServiceRole.entities.Booking.update(booking_id, {
      google_calendar_event_id: event.id,
    });

    return Response.json({
      success: true,
      event_id: event.id,
      event_link: event.htmlLink,
    });
  } catch (error) {
    console.error('Calendar sync error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});