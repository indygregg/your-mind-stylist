import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
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

      // Send 24h reminder — window: 24h to 20h before (covers 4-hour window for scheduler reliability)
      if (hoursUntil <= 24 && hoursUntil > 20 && !booking.reminder_24h_sent) {
        remindersToSend.push({
          booking_id: booking.id,
          notification_type: 'reminder_24h'
        });
      }

      // Send 1h reminder — window: 1.5h to 0.25h before
      if (hoursUntil <= 1.5 && hoursUntil > 0.25 && !booking.reminder_1h_sent) {
        remindersToSend.push({
          booking_id: booking.id,
          notification_type: 'reminder_1h'
        });
      }
    }

    // Send all reminders and log each
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
        console.error(`Reminder failed for booking ${reminder.booking_id}:`, error.message);
        results.push({
          booking_id: reminder.booking_id,
          type: reminder.notification_type,
          success: false,
          error: error.message
        });
        // Log the failure
        try {
          const booking = bookings.find(b => b.id === reminder.booking_id);
          await base44.asServiceRole.entities.EmailSendLog.create({
            recipient_email: booking?.user_email || 'unknown',
            subject: `Booking reminder (${reminder.notification_type})`,
            email_type: 'booking_reminder',
            send_type: 'automated',
            provider: 'base44',
            status: 'failed',
            error_message: error.message,
            sent_by: 'system',
          });
        } catch (logErr) {
          console.error('Failed to log reminder error:', logErr.message);
        }
      }
    }

    return Response.json({
      success: true,
      checked: bookings.length,
      reminders_sent: results.filter(r => r.success).length,
      reminders_failed: results.filter(r => !r.success).length,
      results
    });

  } catch (error) {
    console.error('Check reminders error:', error);
    return Response.json({ 
      error: error.message 
    }, { status: 500 });
  }
});