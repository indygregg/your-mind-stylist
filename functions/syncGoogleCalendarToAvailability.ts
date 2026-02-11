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
    if (user.role !== 'admin') {
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
    
    // Fetch events from Google Calendar (next 90 days)
    const now = new Date();
    const in90Days = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);
    
    const calendarRes = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events?` +
      `timeMin=${now.toISOString()}&` +
      `timeMax=${in90Days.toISOString()}&` +
      `singleEvents=true&` +
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

    // Clear existing synced rules for this manager
    const existingRules = await base44.asServiceRole.entities.AvailabilityRule.filter({
      manager_id: user.id,
      source: 'calendar_sync'
    });

    // Delete old synced rules
    for (const rule of existingRules) {
      await base44.asServiceRole.entities.AvailabilityRule.delete(rule.id);
    }

    // Create blocked rules for each calendar event
    const rulesToCreate = [];
    for (const event of events) {
      if (event.status === 'cancelled') continue;

      const startTime = new Date(event.start.dateTime || event.start.date);
      const endTime = new Date(event.end.dateTime || event.end.date);

      rulesToCreate.push({
        manager_id: user.id,
        rule_type: 'blocked',
        specific_date: startTime.toISOString().split('T')[0],
        start_time: String(startTime.getHours()).padStart(2, '0') + ':' + String(startTime.getMinutes()).padStart(2, '0'),
        end_time: String(endTime.getHours()).padStart(2, '0') + ':' + String(endTime.getMinutes()).padStart(2, '0'),
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