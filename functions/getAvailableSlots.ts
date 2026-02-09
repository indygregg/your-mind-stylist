import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { appointment_type_id, start_date, end_date } = await req.json();

    if (!appointment_type_id || !start_date || !end_date) {
      return Response.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    // Get appointment type details
    const appointmentTypes = await base44.asServiceRole.entities.AppointmentType.filter({ id: appointment_type_id });
    const appointmentType = appointmentTypes[0];
    
    if (!appointmentType) {
      return Response.json({ error: 'Appointment type not found' }, { status: 404 });
    }

    // Get manager's availability rules and settings
    const managerEmail = 'roberta@robertafernandez.com'; // Default manager
    const users = await base44.asServiceRole.entities.User.filter({ email: managerEmail });
    const manager = users[0];

    if (!manager) {
      return Response.json({ error: 'Manager not found' }, { status: 404 });
    }

    // Get appointment-specific rules first, fallback to default rules
    let availabilityRules = await base44.asServiceRole.entities.AvailabilityRule.filter({ 
      manager_id: manager.id,
      appointment_type_id: appointment_type_id,
      active: true 
    });

    // If no specific rules, use default rules
    if (availabilityRules.length === 0) {
      availabilityRules = await base44.asServiceRole.entities.AvailabilityRule.filter({ 
        manager_id: manager.id,
        appointment_type_id: null,
        active: true 
      });
    }

    // Get appointment-specific settings first, fallback to default settings
    let availabilitySettings = await base44.asServiceRole.entities.AvailabilitySettings.filter({ 
      manager_id: manager.id,
      appointment_type_id: appointment_type_id 
    });

    if (availabilitySettings.length === 0) {
      availabilitySettings = await base44.asServiceRole.entities.AvailabilitySettings.filter({ 
        manager_id: manager.id,
        appointment_type_id: null 
      });
    }

    const settings = availabilitySettings[0] || {
      buffer_minutes: 15,
      min_notice_hours: 24,
      max_advance_days: 90,
      timezone: 'America/Los_Angeles'
    };

    // Get existing bookings in the date range
    const existingBookings = await base44.asServiceRole.entities.Booking.filter({
      booking_status: { $in: ['confirmed', 'scheduled', 'pending_payment'] }
    });

    // Calculate available slots
    const startDate = new Date(start_date);
    const endDate = new Date(end_date);
    const now = new Date();
    const minBookingTime = new Date(now.getTime() + settings.min_notice_hours * 60 * 60 * 1000);
    const maxBookingTime = new Date(now.getTime() + settings.max_advance_days * 24 * 60 * 60 * 1000);

    const availableSlots = [];
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const dayOfWeek = currentDate.getDay();
      
      // Find availability rules for this day
      const dayRules = availabilityRules.filter(rule => rule.day_of_week === dayOfWeek);
      
      if (dayRules.length > 0) {
        for (const rule of dayRules) {
          // Parse start and end times
          const [startHour, startMinute] = rule.start_time.split(':').map(Number);
          const [endHour, endMinute] = rule.end_time.split(':').map(Number);
          
          const slotStart = new Date(currentDate);
          slotStart.setHours(startHour, startMinute, 0, 0);
          
          const slotEnd = new Date(currentDate);
          slotEnd.setHours(endHour, endMinute, 0, 0);
          
          // Generate time slots
          let currentSlot = new Date(slotStart);
          
          while (currentSlot < slotEnd) {
            const slotEndTime = new Date(currentSlot.getTime() + appointmentType.duration * 60 * 1000);
            
            // Check if slot is within bounds
            if (slotEndTime <= slotEnd && 
                currentSlot >= minBookingTime && 
                currentSlot <= maxBookingTime) {
              
              // Check for conflicts with existing bookings
              const hasConflict = existingBookings.some(booking => {
                if (!booking.scheduled_date) return false;
                
                const bookingStart = new Date(booking.scheduled_date);
                const bookingEnd = new Date(bookingStart.getTime() + (booking.session_count || 1) * 60 * 60 * 1000);
                
                // Add buffer time
                const bufferStart = new Date(bookingStart.getTime() - settings.buffer_minutes * 60 * 1000);
                const bufferEnd = new Date(bookingEnd.getTime() + settings.buffer_minutes * 60 * 1000);
                
                return (currentSlot < bufferEnd && slotEndTime > bufferStart);
              });
              
              if (!hasConflict) {
                availableSlots.push({
                  start: currentSlot.toISOString(),
                  end: slotEndTime.toISOString(),
                  date: currentSlot.toISOString().split('T')[0]
                });
              }
            }
            
            // Move to next slot (add duration + buffer)
            currentSlot = new Date(currentSlot.getTime() + (appointmentType.duration + settings.buffer_minutes) * 60 * 1000);
          }
        }
      }
      
      // Move to next day
      currentDate.setDate(currentDate.getDate() + 1);
      currentDate.setHours(0, 0, 0, 0);
    }

    return Response.json({ 
      slots: availableSlots,
      settings: {
        buffer_minutes: settings.buffer_minutes,
        min_notice_hours: settings.min_notice_hours,
        max_advance_days: settings.max_advance_days,
        timezone: settings.timezone
      }
    });

  } catch (error) {
    console.error('Error getting available slots:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});