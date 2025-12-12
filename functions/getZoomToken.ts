import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        
        // Verify admin/manager access
        const user = await base44.auth.me();
        if (!user || (user.role !== 'admin' && user.role !== 'manager')) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const ZOOM_ACCOUNT_ID = Deno.env.get('ZOOM_ACCOUNT_ID');
        const ZOOM_CLIENT_ID = Deno.env.get('ZOOM_CLIENT_ID');
        const ZOOM_CLIENT_SECRET = Deno.env.get('ZOOM_CLIENT_SECRET');

        if (!ZOOM_ACCOUNT_ID || !ZOOM_CLIENT_ID || !ZOOM_CLIENT_SECRET) {
            return Response.json({ 
                error: 'Zoom credentials not configured',
                details: 'Missing ZOOM_ACCOUNT_ID, ZOOM_CLIENT_ID, or ZOOM_CLIENT_SECRET'
            }, { status: 500 });
        }

        // Server-to-Server OAuth token request
        const tokenUrl = `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${ZOOM_ACCOUNT_ID}`;
        const credentials = btoa(`${ZOOM_CLIENT_ID}:${ZOOM_CLIENT_SECRET}`);

        const response = await fetch(tokenUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${credentials}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Zoom token error:', errorText);
            return Response.json({ 
                error: 'Failed to get Zoom token',
                details: errorText
            }, { status: response.status });
        }

        const tokenData = await response.json();

        return Response.json({
            access_token: tokenData.access_token,
            expires_in: tokenData.expires_in,
            token_type: tokenData.token_type
        });

    } catch (error) {
        console.error('getZoomToken error:', error);
        return Response.json({ error: error.message }, { status: 500 });
    }
});