import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    // Get access token via service role connector
    let accessToken;
    try {
      accessToken = await base44.asServiceRole.connectors.getAccessToken('googlecalendar');
    } catch (err) {
      return Response.json({ error: 'Google Calendar not connected.' }, { status: 400 });
    }

    // Get availability settings to find manager_id and timezone
    const allSettings = await base44.asServiceRole.entities.AvailabilitySettings.list();
    if (!allSettings || allSettings.length === 0) {
      return Response.json({ error: 'No availability settings found.' }, { status: 400 });
    }

    const settings = allSettings[0];
    const managerId = settings.manager_id;
    const userTimezone = settings.timezone || 'America/Los_Angeles';

    // Fetch events from Google Calendar (next 60 days)
    const now = new Date();
    const in60Days = new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000);

    const calendarRes = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events?` +
      `timeMin=${now.toISOString()}&` +
      `timeMax=${in60Days.toISOString()}&` +
      `singleEvents=true&` +
      `maxResults=250&` +
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

    // Helper to format time in timezone
    const formatTimeInTimezone = (date, timezone) => {
      return new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      }).format(new Date(date));
    };

    const getDateInTimezone = (date, timezone) => {
      return new Intl.DateTimeFormat('en-CA', {
        timeZone: timezone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }).format(new Date(date));
    };

    // Delete existing calendar_sync rules for future dates to avoid duplicates
    const existingRules = await base44.asServiceRole.entities.AvailabilityRule.filter({
      manager_id: managerId,
      source: 'calendar_sync'
    });

    const todayStr = getDateInTimezone(now, userTimezone);
    for (const rule of existingRules) {
      if (rule.specific_date && rule.specific_date >= todayStr) {
        await base44.asServiceRole.entities.AvailabilityRule.delete(rule.id);
      }
    }

    // Re-create blocked rules for each calendar event
    const rulesToCreate = [];
    for (const event of events) {
      if (event.status === 'cancelled') continue;

      if (event.start?.dateTime) {
        // Timed event
        const startTimeUTC = event.start.dateTime;
        const endTimeUTC = event.end.dateTime;

        rulesToCreate.push({
          manager_id: managerId,
          rule_type: 'blocked',
          specific_date: getDateInTimezone(startTimeUTC, userTimezone),
          start_time: formatTimeInTimezone(startTimeUTC, userTimezone),
          end_time: formatTimeInTimezone(endTimeUTC, userTimezone),
          is_available: false,
          reason: `Calendar event: ${event.summary || 'Busy'}`,
          source: 'calendar_sync',
          external_event_id: event.id,
          active: true
        });
      } else if (event.start?.date) {
        // All-day event — block the entire day (00:00 to 23:59)
        const dateStr = event.start.date; // already YYYY-MM-DD
        const endDateStr = event.end?.date || dateStr;

        // All-day events can span multiple days; create a rule per day
        let d = new Date(dateStr + 'T00:00:00Z');
        const endD = new Date(endDateStr + 'T00:00:00Z');
        while (d < endD) {
          const dayStr = d.toISOString().split('T')[0];
          rulesToCreate.push({
            manager_id: managerId,
            rule_type: 'blocked',
            specific_date: dayStr,
            start_time: '00:00',
            end_time: '23:59',
            is_available: false,
            reason: `All-day event: ${event.summary || 'Busy'}`,
            source: 'calendar_sync',
            external_event_id: event.id,
            active: true
          });
          d.setUTCDate(d.getUTCDate() + 1);
        }
      }
    }

    if (rulesToCreate.length > 0) {
      await base44.asServiceRole.entities.AvailabilityRule.bulkCreate(rulesToCreate);
    }

    console.log(`Synced ${rulesToCreate.length} calendar events to availability rules`);

    return Response.json({
      success: true,
      synced_events: rulesToCreate.length,
      message: `Synced ${rulesToCreate.length} calendar events as blocked slots`
    });
  } catch (error) {
    console.error('Scheduled calendar sync error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});