import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const user = await base44.auth.me();

        if (!user) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (user.role !== 'admin') {
            return Response.json({ error: 'Forbidden' }, { status: 403 });
        }

        // Get user's stored tokens
        const userData = await base44.asServiceRole.entities.User.filter({ id: user.id });
        const userRecord = userData[0];

        if (!userRecord?.google_calendar_access_token) {
            return Response.json({ 
                connected: false, 
                message: 'No Google Calendar tokens found' 
            });
        }

        // Try to fetch calendar events as a verification
        const calendarRes = await fetch(
            'https://www.googleapis.com/calendar/v3/calendars/primary/events?maxResults=1',
            {
                headers: {
                    'Authorization': `Bearer ${userRecord.google_calendar_access_token}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        if (calendarRes.status === 401) {
            return Response.json({ 
                connected: false, 
                message: 'Token is invalid or expired',
                hasTokens: true,
                needsRefresh: true
            });
        }

        if (!calendarRes.ok) {
            return Response.json({ 
                connected: false, 
                message: `Calendar API returned ${calendarRes.status}: ${calendarRes.statusText}`,
                hasTokens: true
            });
        }

        return Response.json({ 
            connected: true, 
            message: 'Successfully connected to Google Calendar',
            hasTokens: true
        });
    } catch (error) {
        console.error('Verification error:', error);
        return Response.json({ 
            connected: false, 
            error: error.message 
        }, { status: 500 });
    }
});