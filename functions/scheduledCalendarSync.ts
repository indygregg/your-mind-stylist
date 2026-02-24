import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    // Get access token via service role connector (this is authorized at app level)
    let accessToken;
    try {
      accessToken = await base44.asServiceRole.connectors.getAccessToken('googlecalendar');
    } catch (err) {
      console.error('Google Calendar connector error:', err.message);
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

    // Fetch events from Google Calendar (next 60 days only to avoid rate limits)
    const now = new Date();
    const in60Days = new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000);

    const calendarRes = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events?` +
      `timeMin=${now.toISOString()}&` +
      `timeMax=${in60Days.toISOString()}&` +
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
      const errText = await calendarRes.text();
      console.error('Google Calendar API error:', errText);
      throw new Error(`Google Calendar API error: ${calendarRes.status} ${calendarRes.statusText}`);
    }

    const calendarData = await calendarRes.json();
    const events = calendarData.items || [];
    console.log(`Fetched ${events.length} events from Google Calendar`);

    // Helper: format time in timezone as HH:MM
    const formatTimeInTimezone = (dateStr, timezone) => {
      return new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      }).format(new Date(dateStr));
    };

    // Helper: get YYYY-MM-DD date in timezone
    const getDateInTimezone = (dateStr, timezone) => {
      return new Intl.DateTimeFormat('en-CA', {
        timeZone: timezone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }).format(new Date(dateStr));
    };

    // Build the set of rules we want to create
    const rulesToCreate = [];
    for (const event of events) {
      if (event.status === 'cancelled') continue;
      // Skip events the user has declined
      if (event.attendees) {
        const selfAttendee = event.attendees.find(a => a.self);
        if (selfAttendee && selfAttendee.responseStatus === 'declined') continue;
      }

      if (event.start?.dateTime) {
        // Timed event
        const localDate = getDateInTimezone(event.start.dateTime, userTimezone);
        const localStartTime = formatTimeInTimezone(event.start.dateTime, userTimezone);
        const localEndTime = formatTimeInTimezone(event.end.dateTime, userTimezone);

        rulesToCreate.push({
          manager_id: managerId,
          rule_type: 'blocked',
          specific_date: localDate,
          start_time: localStartTime,
          end_time: localEndTime,
          is_available: false,
          reason: `Calendar: ${event.summary || 'Busy'}`,
          source: 'calendar_sync',
          external_event_id: event.id,
          active: true
        });
      } else if (event.start?.date) {
        // All-day event — block entire day
        const dateStr = event.start.date;
        const endDateStr = event.end?.date || dateStr;

        let d = new Date(dateStr + 'T12:00:00Z'); // use noon to avoid DST edge cases
        const endD = new Date(endDateStr + 'T12:00:00Z');
        while (d < endD) {
          const dayStr = getDateInTimezone(d.toISOString(), userTimezone);
          rulesToCreate.push({
            manager_id: managerId,
            rule_type: 'blocked',
            specific_date: dayStr,
            start_time: '00:00',
            end_time: '23:59',
            is_available: false,
            reason: `All-day: ${event.summary || 'Busy'}`,
            source: 'calendar_sync',
            external_event_id: event.id,
            active: true
          });
          d.setUTCDate(d.getUTCDate() + 1);
        }
      }
    }

    // Build a map of external_event_id -> rule for deduplication
    const existingRules = await base44.asServiceRole.entities.AvailabilityRule.filter({
      manager_id: managerId,
      source: 'calendar_sync'
    });

    const todayStr = getDateInTimezone(now.toISOString(), userTimezone);
    const existingByEventId = {};
    const staleFutureIds = [];

    for (const rule of existingRules) {
      if (rule.specific_date && rule.specific_date >= todayStr) {
        if (rule.external_event_id) {
          existingByEventId[rule.external_event_id] = rule;
        }
        staleFutureIds.push(rule.id);
      }
    }

    // Delete stale future rules in small batches to avoid rate limits
    const BATCH_SIZE = 20;
    for (let i = 0; i < staleFutureIds.length; i += BATCH_SIZE) {
      const batch = staleFutureIds.slice(i, i + BATCH_SIZE);
      await Promise.all(batch.map(id => base44.asServiceRole.entities.AvailabilityRule.delete(id)));
      if (i + BATCH_SIZE < staleFutureIds.length) {
        await new Promise(r => setTimeout(r, 200)); // small pause between batches
      }
    }

    // Create new rules in batches
    let createdCount = 0;
    for (let i = 0; i < rulesToCreate.length; i += BATCH_SIZE) {
      const batch = rulesToCreate.slice(i, i + BATCH_SIZE);
      await base44.asServiceRole.entities.AvailabilityRule.bulkCreate(batch);
      createdCount += batch.length;
      if (i + BATCH_SIZE < rulesToCreate.length) {
        await new Promise(r => setTimeout(r, 200));
      }
    }

    console.log(`Calendar sync complete: deleted ${staleFutureIds.length} old rules, created ${createdCount} new rules`);

    return Response.json({
      success: true,
      calendar_events_fetched: events.length,
      rules_deleted: staleFutureIds.length,
      rules_created: createdCount,
      message: `Synced ${createdCount} blocked slots from Google Calendar`
    });
  } catch (error) {
    console.error('Scheduled calendar sync error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});