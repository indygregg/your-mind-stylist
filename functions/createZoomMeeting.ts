import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        
        // Get request data
        const { booking_id, topic, start_time, duration, timezone } = await req.json();

        if (!booking_id) {
            return Response.json({ error: 'booking_id required' }, { status: 400 });
        }

        // Get booking to find assigned manager
        const bookings = await base44.asServiceRole.entities.Booking.filter({ id: booking_id });
        if (!bookings || bookings.length === 0) {
            return Response.json({ error: 'Booking not found' }, { status: 404 });
        }
        const booking = bookings[0];

        // Get manager's Zoom access token (use created_by or assigned manager)
        const managerId = booking.created_by;
        const tokenResponse = await base44.asServiceRole.functions.invoke('getZoomToken', {
            user_id: managerId
        });
        
        if (!tokenResponse.data.access_token) {
            return Response.json({ 
                error: 'Manager Zoom not connected',
                details: tokenResponse.data
            }, { status: 500 });
        }

        const accessToken = tokenResponse.data.access_token;



        // Configure meeting details
        const meetingData = {
            topic: topic || `Private Mind Styling Session - ${booking.user_name}`,
            type: 2, // Scheduled meeting
            start_time: start_time || new Date().toISOString(),
            duration: duration || 60, // Default 60 minutes
            timezone: timezone || 'America/Los_Angeles',
            settings: {
                host_video: true,
                participant_video: true,
                join_before_host: false,
                mute_upon_entry: false,
                waiting_room: true,
                audio: 'both',
                auto_recording: 'none',
                approval_type: 2 // No registration required
            }
        };

        // Create Zoom meeting via API
        const zoomResponse = await fetch('https://api.zoom.us/v2/users/me/meetings', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(meetingData)
        });

        if (!zoomResponse.ok) {
            const errorText = await zoomResponse.text();
            console.error('Zoom API error:', errorText);
            
            // Update booking with failed status
            await base44.asServiceRole.entities.Booking.update(booking_id, {
                zoom_status: 'failed'
            });

            return Response.json({ 
                error: 'Failed to create Zoom meeting',
                details: errorText
            }, { status: zoomResponse.status });
        }

        const meeting = await zoomResponse.json();

        // Update booking with Zoom meeting details
        await base44.asServiceRole.entities.Booking.update(booking_id, {
            zoom_meeting_id: meeting.id.toString(),
            zoom_join_url: meeting.join_url,
            zoom_start_url: meeting.start_url,
            zoom_password: meeting.password,
            zoom_status: 'created'
        });

        return Response.json({
            success: true,
            meeting_id: meeting.id,
            join_url: meeting.join_url,
            start_url: meeting.start_url,
            password: meeting.password
        });

    } catch (error) {
        console.error('createZoomMeeting error:', error);
        return Response.json({ error: error.message }, { status: 500 });
    }
});