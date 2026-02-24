import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    // Get access token via service role connector
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

    console.log(`Syncing for manager ${managerId} in timezone ${userTimezone}`);

    // Fetch events from Google Calendar (next 60 days)
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
        headers: { 'Authorization': `Bearer ${accessToken}` }
      }
    );

    if (!calendarRes.ok) {
      const errText = await calendarRes.text();
      console.error('Google Calendar API error:', errText);
      throw new Error(`Google Calendar API error: ${calendarRes.status}`);
    }

    const calendarData = await calendarRes.json();
    const events = (calendarData.items || []).filter(e => e.status !== 'cancelled');
    console.log(`Fetched ${events.length} active events from Google Calendar`);

    // Helper: format time in timezone as HH:MM
    const formatTimeInTimezone = (isoStr, timezone) => {
      const fmt = new Intl.DateTimeFormat('en-US', {
        timeZone: timezone, hour: '2-digit', minute: '2-digit', hour12: false
      });
      const parts = fmt.formatToParts(new Date(isoStr));
      const h = parts.find(p => p.type === 'hour')?.value || '00';
      const m = parts.find(p => p.type === 'minute')?.value || '00';
      // Intl can return '24' for midnight in some locales, normalize to '00'
      return `${h === '24' ? '00' : h}:${m}`;
    };

    // Helper: get YYYY-MM-DD date in timezone
    const getDateInTimezone = (isoStr, timezone) => {
      return new Intl.DateTimeFormat('en-CA', {
        timeZone: timezone, year: 'numeric', month: '2-digit', day: '2-digit'
      }).format(new Date(isoStr));
    };

    const todayStr = getDateInTimezone(now.toISOString(), userTimezone);

    // Build set of new rules to create from Google Calendar events
    const rulesToCreate = [];
    for (const event of events) {
      // Skip events the user declined
      if (event.attendees) {
        const self = event.attendees.find(a => a.self);
        if (self && self.responseStatus === 'declined') continue;
      }

      if (event.start?.dateTime) {
        // Timed event — convert to local timezone properly
        const localDate = getDateInTimezone(event.start.dateTime, userTimezone);
        const localStart = formatTimeInTimezone(event.start.dateTime, userTimezone);
        const localEnd = formatTimeInTimezone(event.end.dateTime, userTimezone);

        rulesToCreate.push({
          manager_id: managerId,
          rule_type: 'blocked',
          specific_date: localDate,
          start_time: localStart,
          end_time: localEnd,
          is_available: false,
          reason: `Calendar: ${event.summary || 'Busy'}`,
          source: 'calendar_sync',
          external_event_id: event.id,
          active: true
        });
      } else if (event.start?.date) {
        // All-day event — block entire day(s)
        // Use noon UTC to avoid DST issues when iterating days
        let d = new Date(event.start.date + 'T12:00:00Z');
        const endD = new Date((event.end?.date || event.start.date) + 'T12:00:00Z');
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

    // Get existing Google-Calendar-sourced rules for future dates (not Acuity imports)
    // We only delete rules whose external_event_id starts with Google-style IDs (not 'acuity_')
    const existingRules = await base44.asServiceRole.entities.AvailabilityRule.filter({
      manager_id: managerId,
      source: 'calendar_sync'
    });

    const staleIds = existingRules
      .filter(r =>
        r.specific_date &&
        r.specific_date >= todayStr &&
        r.external_event_id &&
        !r.external_event_id.startsWith('acuity_')  // preserve Acuity imports
      )
      .map(r => r.id);

    console.log(`Deleting ${staleIds.length} stale Google Calendar rules...`);

    // Delete in batches of 10 with pauses to avoid rate limiting
    const BATCH = 10;
    for (let i = 0; i < staleIds.length; i += BATCH) {
      const batch = staleIds.slice(i, i + BATCH);
      await Promise.all(batch.map(id => base44.asServiceRole.entities.AvailabilityRule.delete(id)));
      if (i + BATCH < staleIds.length) await new Promise(r => setTimeout(r, 300));
    }

    console.log(`Creating ${rulesToCreate.length} new blocked slots...`);

    // Create new rules in batches of 20
    const CREATE_BATCH = 20;
    let created = 0;
    for (let i = 0; i < rulesToCreate.length; i += CREATE_BATCH) {
      const batch = rulesToCreate.slice(i, i + CREATE_BATCH);
      await base44.asServiceRole.entities.AvailabilityRule.bulkCreate(batch);
      created += batch.length;
      if (i + CREATE_BATCH < rulesToCreate.length) await new Promise(r => setTimeout(r, 300));
    }

    console.log(`Sync complete: deleted ${staleIds.length}, created ${created} rules`);

    return Response.json({
      success: true,
      calendar_events_fetched: events.length,
      rules_deleted: staleIds.length,
      rules_created: created,
      timezone_used: userTimezone,
      message: `Synced ${created} blocked slots from Google Calendar (${userTimezone})`
    });
  } catch (error) {
    console.error('Scheduled calendar sync error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});