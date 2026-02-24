import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

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

    // Get availability settings
    const allSettings = await base44.asServiceRole.entities.AvailabilitySettings.list();
    if (!allSettings || allSettings.length === 0) {
      return Response.json({ error: 'No availability settings found.' }, { status: 400 });
    }

    const settings = allSettings[0];
    const managerId = settings.manager_id;
    const userTimezone = settings.timezone || 'America/Los_Angeles';
    console.log(`Syncing for manager ${managerId} timezone=${userTimezone}`);

    // Fetch all calendars the user has access to
    const calListRes = await fetch(
      'https://www.googleapis.com/calendar/v3/users/me/calendarList?minAccessRole=reader',
      { headers: { 'Authorization': `Bearer ${accessToken}` } }
    );
    if (!calListRes.ok) {
      const errText = await calListRes.text();
      console.error('CalendarList error:', errText);
      throw new Error(`CalendarList API error: ${calListRes.status}`);
    }
    const calListData = await calListRes.json();
    const calendars = (calListData.items || []).filter(c => !c.deleted && c.selected !== false);
    console.log(`Found ${calendars.length} calendars: ${calendars.map(c => c.summary || c.id).join(', ')}`);

    // Time window: now → 30 days out
    const now = new Date();
    const in30Days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    const todayStr = getDateInTimezone(now.toISOString(), userTimezone);
    const in30DaysStr = getDateInTimezone(in30Days.toISOString(), userTimezone);

    // Fetch events from ALL calendars
    const allEvents = [];
    for (const cal of calendars) {
      const calId = encodeURIComponent(cal.id);
      const eventsRes = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/${calId}/events?` +
        `timeMin=${now.toISOString()}&timeMax=${in30Days.toISOString()}&` +
        `singleEvents=true&maxResults=100&orderBy=startTime`,
        { headers: { 'Authorization': `Bearer ${accessToken}` } }
      );
      if (!eventsRes.ok) {
        console.warn(`Skipping calendar ${cal.summary}: ${eventsRes.status}`);
        continue;
      }
      const eventsData = await eventsRes.json();
      const events = (eventsData.items || []).filter(e => e.status !== 'cancelled');
      console.log(`  Calendar "${cal.summary}": ${events.length} events`);
      allEvents.push(...events);
      await sleep(100); // small pause between calendar requests
    }

    console.log(`Total events across all calendars: ${allEvents.length}`);

    // De-duplicate by event id (same event can appear in multiple calendars if shared)
    const seenIds = new Set();
    const uniqueEvents = allEvents.filter(e => {
      if (seenIds.has(e.id)) return false;
      seenIds.add(e.id);
      return true;
    });
    console.log(`Unique events after de-dup: ${uniqueEvents.length}`);

    // Build new blocked rules from events
    const newRules = [];
    for (const event of uniqueEvents) {
      // Skip events the user declined
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
        // All-day event
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

    // Delta sync: compare with existing rules in the window
    const newRuleKeys = new Set(newRules.map(r => `${r.external_event_id}::${r.specific_date}::${r.start_time}`));

    const existingRules = await base44.asServiceRole.entities.AvailabilityRule.filter({
      manager_id: managerId,
      source: 'calendar_sync'
    });

    const toDelete = existingRules.filter(r =>
      r.specific_date &&
      r.specific_date >= todayStr &&
      r.specific_date <= in30DaysStr &&
      r.external_event_id &&
      !newRuleKeys.has(`${r.external_event_id}::${r.specific_date}::${r.start_time}`)
    );

    const existingKeys = new Set(
      existingRules
        .filter(r => r.specific_date >= todayStr && r.specific_date <= in30DaysStr)
        .map(r => `${r.external_event_id}::${r.specific_date}::${r.start_time}`)
    );
    const toCreate = newRules.filter(r => !existingKeys.has(`${r.external_event_id}::${r.specific_date}::${r.start_time}`));

    console.log(`Delta: ${toDelete.length} to delete, ${toCreate.length} to create`);

    // Delete stale rules
    let deleted = 0;
    for (let i = 0; i < toDelete.length; i += 5) {
      const batch = toDelete.slice(i, i + 5);
      await Promise.all(batch.map(r => base44.asServiceRole.entities.AvailabilityRule.delete(r.id)));
      deleted += batch.length;
      await sleep(500);
    }

    // Create new rules
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
      calendars_synced: calendars.map(c => c.summary || c.id),
      unique_events: uniqueEvents.length,
      rules_deleted: deleted,
      rules_created: created,
      timezone: userTimezone,
      window: `${todayStr} to ${in30DaysStr}`,
      message: `Synced ${created} new / removed ${deleted} stale blocked slots from ${calendars.length} Google Calendars`
    });
  } catch (error) {
    console.error('Calendar sync error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});