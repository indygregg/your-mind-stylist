import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

// Small helper to pause execution
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

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
    console.log(`Syncing for manager ${managerId} timezone=${userTimezone}`);

    // Fetch events from Google Calendar (next 30 days — keeps volume manageable)
    const now = new Date();
    const in30Days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    const calendarRes = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events?` +
      `timeMin=${now.toISOString()}&` +
      `timeMax=${in30Days.toISOString()}&` +
      `singleEvents=true&maxResults=100&orderBy=startTime`,
      { headers: { 'Authorization': `Bearer ${accessToken}` } }
    );

    if (!calendarRes.ok) {
      const errText = await calendarRes.text();
      console.error('Google Calendar API error:', errText);
      throw new Error(`Google Calendar API error: ${calendarRes.status}`);
    }

    const calendarData = await calendarRes.json();
    const events = (calendarData.items || []).filter(e => e.status !== 'cancelled');
    console.log(`Fetched ${events.length} active events from Google Calendar`);

    // Timezone helpers
    const getDateInTimezone = (isoStr, tz) =>
      new Intl.DateTimeFormat('en-CA', { timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit' })
        .format(new Date(isoStr));

    const getTimeInTimezone = (isoStr, tz) => {
      const parts = new Intl.DateTimeFormat('en-US', {
        timeZone: tz, hour: '2-digit', minute: '2-digit', hour12: false
      }).formatToParts(new Date(isoStr));
      let h = parts.find(p => p.type === 'hour')?.value || '00';
      const m = parts.find(p => p.type === 'minute')?.value || '00';
      if (h === '24') h = '00';
      return `${h}:${m}`;
    };

    const todayStr = getDateInTimezone(now.toISOString(), userTimezone);
    const in30DaysStr = getDateInTimezone(in30Days.toISOString(), userTimezone);

    // Build new rules from Google Calendar
    const newRules = [];
    for (const event of events) {
      // Skip declined events
      if (event.attendees) {
        const self = event.attendees.find(a => a.self);
        if (self && self.responseStatus === 'declined') continue;
      }

      if (event.start?.dateTime) {
        newRules.push({
          manager_id: managerId,
          rule_type: 'blocked',
          specific_date: getDateInTimezone(event.start.dateTime, userTimezone),
          start_time: getTimeInTimezone(event.start.dateTime, userTimezone),
          end_time: getTimeInTimezone(event.end.dateTime, userTimezone),
          is_available: false,
          reason: `Calendar: ${event.summary || 'Busy'}`,
          source: 'calendar_sync',
          external_event_id: event.id,
          active: true
        });
      } else if (event.start?.date) {
        // All-day event — block entire day(s)
        let d = new Date(event.start.date + 'T12:00:00Z');
        const endD = new Date((event.end?.date || event.start.date) + 'T12:00:00Z');
        while (d < endD) {
          newRules.push({
            manager_id: managerId,
            rule_type: 'blocked',
            specific_date: getDateInTimezone(d.toISOString(), userTimezone),
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

    // Build a lookup of new rules by external_event_id + date for comparison
    const newRuleKeys = new Set(newRules.map(r => `${r.external_event_id}::${r.specific_date}::${r.start_time}`));

    // Fetch existing Google-sourced rules only in the 30-day window
    const existingRules = await base44.asServiceRole.entities.AvailabilityRule.filter({
      manager_id: managerId,
      source: 'calendar_sync'
    });

    // Only delete rules within the window that are NOT in the new set and not Acuity imports
    const toDelete = existingRules.filter(r =>
      r.specific_date &&
      r.specific_date >= todayStr &&
      r.specific_date <= in30DaysStr &&
      r.external_event_id &&
      !r.external_event_id.startsWith('acuity_') &&
      !newRuleKeys.has(`${r.external_event_id}::${r.specific_date}::${r.start_time}`)
    );

    // Only create rules that don't already exist (by key)
    const existingKeys = new Set(
      existingRules
        .filter(r => r.specific_date >= todayStr && r.specific_date <= in30DaysStr)
        .map(r => `${r.external_event_id}::${r.specific_date}::${r.start_time}`)
    );
    const toCreate = newRules.filter(r => !existingKeys.has(`${r.external_event_id}::${r.specific_date}::${r.start_time}`));

    console.log(`Delta sync: ${toDelete.length} to delete, ${toCreate.length} to create`);

    // Delete in batches of 5 with pauses
    let deleted = 0;
    for (let i = 0; i < toDelete.length; i += 5) {
      const batch = toDelete.slice(i, i + 5);
      await Promise.all(batch.map(r => base44.asServiceRole.entities.AvailabilityRule.delete(r.id)));
      deleted += batch.length;
      await sleep(500);
    }

    // Create in batches of 10 with pauses
    let created = 0;
    for (let i = 0; i < toCreate.length; i += 10) {
      const batch = toCreate.slice(i, i + 10);
      await base44.asServiceRole.entities.AvailabilityRule.bulkCreate(batch);
      created += batch.length;
      if (i + 10 < toCreate.length) await sleep(500);
    }

    console.log(`Sync complete: ${deleted} deleted, ${created} created`);

    return Response.json({
      success: true,
      calendar_events_fetched: events.length,
      rules_deleted: deleted,
      rules_created: created,
      timezone: userTimezone,
      window: `${todayStr} to ${in30DaysStr}`,
      message: `Synced ${created} new / removed ${deleted} stale blocked slots from Google Calendar`
    });
  } catch (error) {
    console.error('Calendar sync error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});