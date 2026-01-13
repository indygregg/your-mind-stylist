import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
    try {
        const url = new URL(req.url);
        const code = url.searchParams.get('code');
        const state = url.searchParams.get('state'); // user ID
        const error = url.searchParams.get('error');

        if (error) {
            return Response.redirect(`${url.origin}/CalendarSettings?error=${error}`);
        }

        if (!code || !state) {
            return Response.redirect(`${url.origin}/CalendarSettings?error=missing_params`);
        }

        const clientId = Deno.env.get('GOOGLE_CALENDAR_CLIENT_ID');
        const clientSecret = Deno.env.get('GOOGLE_CALENDAR_CLIENT_SECRET');
        const redirectUri = `${url.origin}/api/functions/googleCalendarCallback`;

        // Exchange code for tokens
        const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                code,
                client_id: clientId,
                client_secret: clientSecret,
                redirect_uri: redirectUri,
                grant_type: 'authorization_code'
            })
        });

        const tokens = await tokenResponse.json();

        if (!tokens.access_token) {
            return Response.redirect(`${url.origin}/CalendarSettings?error=token_exchange_failed`);
        }

        // Store tokens in user record
        const base44 = createClientFromRequest(req);
        await base44.asServiceRole.entities.User.update(state, {
            google_calendar_access_token: tokens.access_token,
            google_calendar_refresh_token: tokens.refresh_token,
            google_calendar_token_expiry: new Date(Date.now() + tokens.expires_in * 1000).toISOString()
        });

        return Response.redirect(`${url.origin}/CalendarSettings?success=true`);
    } catch (error) {
        console.error('Google Calendar OAuth error:', error);
        const url = new URL(req.url);
        return Response.redirect(`${url.origin}/CalendarSettings?error=server_error`);
    }
});