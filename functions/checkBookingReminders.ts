import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    // This function should be called periodically (e.g., via cron or scheduled task)
    // For now, it can be triggered manually or via webhook

    const now = new Date();
    
    // Get all confirmed bookings that haven't been completed
    const bookings = await base44.asServiceRole.entities.Booking.filter({
      booking_status: 'confirmed'
    });

    const remindersToSend = [];

    for (const booking of bookings) {
      if (!booking.scheduled_date) continue;

      const scheduledDate = new Date(booking.scheduled_date);
      const hoursUntil = (scheduledDate - now) / (1000 * 60 * 60);

      // Send 24h reminder
      if (hoursUntil <= 24 && hoursUntil > 23 && !booking.reminder_24h_sent) {
        remindersToSend.push({
          booking_id: booking.id,
          notification_type: 'reminder_24h'
        });
      }

      // Send 1h reminder
      if (hoursUntil <= 1 && hoursUntil > 0.5 && !booking.reminder_1h_sent) {
        remindersToSend.push({
          booking_id: booking.id,
          notification_type: 'reminder_1h'
        });
      }
    }

    // Send all reminders
    const results = [];
    for (const reminder of remindersToSend) {
      try {
        const response = await base44.asServiceRole.functions.invoke('sendBookingNotifications', reminder);
        results.push({
          booking_id: reminder.booking_id,
          type: reminder.notification_type,
          success: true
        });
      } catch (error) {
        results.push({
          booking_id: reminder.booking_id,
          type: reminder.notification_type,
          success: false,
          error: error.message
        });
      }
    }

    return Response.json({
      success: true,
      checked: bookings.length,
      reminders_sent: results.filter(r => r.success).length,
      results
    });

  } catch (error) {
    console.error('Check reminders error:', error);
    return Response.json({ 
      error: error.message 
    }, { status: 500 });
  }
});