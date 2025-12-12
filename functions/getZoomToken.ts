import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        
        const { user_id } = await req.json();
        
        if (!user_id) {
            return Response.json({ error: 'user_id required' }, { status: 400 });
        }

        // Get user's Zoom tokens
        const users = await base44.asServiceRole.entities.User.filter({ id: user_id });
        if (!users || users.length === 0) {
            return Response.json({ error: 'User not found' }, { status: 404 });
        }

        const user = users[0];

        if (!user.zoom_connected || !user.zoom_access_token) {
            return Response.json({ 
                error: 'Zoom not connected',
                message: 'User needs to connect their Zoom account'
            }, { status: 403 });
        }

        // Check if token is expired or about to expire (within 5 minutes)
        const tokenExpiresAt = new Date(user.zoom_token_expires_at);
        const now = new Date();
        const fiveMinutesFromNow = new Date(now.getTime() + 5 * 60 * 1000);

        if (tokenExpiresAt <= fiveMinutesFromNow) {
            // Token expired or expiring soon, refresh it
            const refreshResponse = await base44.asServiceRole.functions.invoke('refreshZoomToken', {
                user_id: user_id
            });

            if (refreshResponse.data.error) {
                return Response.json({ 
                    error: 'Token refresh failed',
                    details: refreshResponse.data
                }, { status: 500 });
            }

            return Response.json({
                access_token: refreshResponse.data.access_token
            });
        }

        // Token is still valid
        return Response.json({
            access_token: user.zoom_access_token
        });

    } catch (error) {
        console.error('getZoomToken error:', error);
        return Response.json({ error: error.message }, { status: 500 });
    }
});