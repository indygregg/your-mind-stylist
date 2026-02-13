import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    // Get authenticated user
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only admins/managers can sync
    const isManager = user.role === 'admin' || user.role === 'manager' || user.custom_role === 'manager';
    if (!isManager) {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get access token using app connector (already authorized)
    let accessToken;
    try {
      accessToken = await base44.asServiceRole.connectors.getAccessToken('googlecalendar');
    } catch (err) {
      return Response.json({ 
        error: 'Google Calendar not connected. Please authorize in Manager Settings first.' 
      }, { status: 400 });
    }
    
    // Fetch events from Google Calendar (next 30 days only - faster)
    const now = new Date();
    const in30Days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    const calendarRes = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events?` +
      `timeMin=${now.toISOString()}&` +
      `timeMax=${in30Days.toISOString()}&` +
      `singleEvents=true&` +
      `maxResults=100&` +
      `orderBy=startTime`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!calendarRes.ok) {
      throw new Error(`Google Calendar API error: ${calendarRes.statusText}`);
    }

    const calendarData = await calendarRes.json();
    const events = calendarData.items || [];

    // Get user's timezone from availability settings
    const settingsRes = await base44.asServiceRole.entities.AvailabilitySettings.filter(
      { manager_id: user.id },
      '-created_date',
      1
    );
    const userTimezone = settingsRes.length > 0 ? settingsRes[0].timezone : 'America/Los_Angeles';

    // Helper to convert UTC time to user's timezone
    const formatTimeInTimezone = (date, timezone) => {
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
      return formatter.format(new Date(date));
    };

    // Helper to convert UTC date to user's timezone date
    const getDateInTimezone = (date, timezone) => {
      const formatter = new Intl.DateTimeFormat('en-CA', {
        timeZone: timezone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
      return formatter.format(new Date(date));
    };

    // Create blocked rules for each calendar event
    const rulesToCreate = [];
    for (const event of events) {
      if (event.status === 'cancelled') continue;

      const startTimeUTC = event.start.dateTime || event.start.date;
      const endTimeUTC = event.end.dateTime || event.end.date;

      rulesToCreate.push({
        manager_id: user.id,
        rule_type: 'blocked',
        specific_date: getDateInTimezone(startTimeUTC, userTimezone),
        start_time: formatTimeInTimezone(startTimeUTC, userTimezone),
        end_time: formatTimeInTimezone(endTimeUTC, userTimezone),
        is_available: false,
        reason: `Calendar event: ${event.summary}`,
        source: 'calendar_sync',
        external_event_id: event.id,
        active: true
      });
    }

    // Bulk create rules
    if (rulesToCreate.length > 0) {
      await base44.asServiceRole.entities.AvailabilityRule.bulkCreate(rulesToCreate);
    }

    return Response.json({
      success: true,
      synced_events: rulesToCreate.length,
      message: `Synced ${rulesToCreate.length} calendar events to availability rules`
    });
  } catch (error) {
    console.error('Calendar sync error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});