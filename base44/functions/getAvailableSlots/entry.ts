import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    // Allow both authenticated and non-authenticated users to view slots
    // Authentication is not required for viewing availability

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

    // Get manager from appointment type
    const managerId = appointmentType.manager_id;
    
    if (!managerId) {
      return Response.json({ error: 'No manager assigned to this appointment type' }, { status: 400 });
    }

    // Get appointment-specific availability rules
    let availabilityRules = await base44.asServiceRole.entities.AvailabilityRule.filter({ 
      manager_id: managerId,
      appointment_type_id: appointment_type_id,
      active: true 
    });

    // If no specific rules, use default rules for generating slots
    if (availabilityRules.length === 0) {
      availabilityRules = await base44.asServiceRole.entities.AvailabilityRule.filter({ 
        manager_id: managerId,
        appointment_type_id: null,
        active: true 
      });
    }

    // ALWAYS also load the general blocked rules (appointment_type_id: null)
    // Calendar sync rules always have appointment_type_id: null — they must block ALL appointment types
    const generalBlockedRules = await base44.asServiceRole.entities.AvailabilityRule.filter({
      manager_id: managerId,
      appointment_type_id: null,
      rule_type: 'blocked',
      active: true
    });

    // Merge general blocked rules into availabilityRules (deduplicate by id)
    const ruleIds = new Set(availabilityRules.map(r => r.id));
    for (const r of generalBlockedRules) {
      if (!ruleIds.has(r.id)) {
        availabilityRules.push(r);
        ruleIds.add(r.id);
      }
    }

    // Get appointment-specific settings first, fallback to default settings
    let availabilitySettings = await base44.asServiceRole.entities.AvailabilitySettings.filter({ 
      manager_id: managerId,
      appointment_type_id: appointment_type_id 
    });

    if (availabilitySettings.length === 0) {
      availabilitySettings = await base44.asServiceRole.entities.AvailabilitySettings.filter({ 
        manager_id: managerId,
        appointment_type_id: null 
      });
    }

    const settings = availabilitySettings[0] || {
      buffer_minutes: 15,
      min_notice_hours: 24,
      max_advance_days: 90,
      timezone: 'America/Los_Angeles'
    };

    // Get existing bookings for this manager and appointment type in the date range
    const existingBookings = await base44.asServiceRole.entities.Booking.filter({
      staff_id: managerId,
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
      const dateStr = currentDate.toISOString().split('T')[0];
      
      // Find availability rules for this day (both recurring day_of_week and specific_date)
      const dayRules = availabilityRules.filter(rule => 
        (rule.day_of_week === dayOfWeek && !rule.specific_date && rule.is_available) ||
        (rule.specific_date === dateStr && rule.is_available)
      );
      
      // Find blocked rules for this day
      const blockedRules = availabilityRules.filter(rule =>
        ((rule.day_of_week === dayOfWeek && !rule.specific_date) ||
         (rule.specific_date === dateStr)) &&
        !rule.is_available
      );
      
      if (dayRules.length > 0) {
        for (const rule of dayRules) {
          // Parse start and end times
          const [startHour, startMinute] = rule.start_time.split(':').map(Number);
          const [endHour, endMinute] = rule.end_time.split(':').map(Number);
          
          // Create date string in manager's timezone
          const dateStr = currentDate.toISOString().split('T')[0];
          const startTimeStr = `${dateStr}T${rule.start_time}:00`;
          const endTimeStr = `${dateStr}T${rule.end_time}:00`;
          
          // Parse as local time in manager's timezone by creating a formatter
          const toManagerTime = (timeStr) => {
            const [datePart, timePart] = timeStr.split('T');
            const [year, month, day] = datePart.split('-').map(Number);
            const [hour, minute] = timePart.split(':').map(Number);
            
            // Create date parts in manager's timezone
            const formatter = new Intl.DateTimeFormat('en-US', {
              timeZone: settings.timezone,
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              hour12: false
            });
            
            // Create UTC date for the manager's local time
            const parts = formatter.formatToParts(new Date(year, month - 1, day, hour, minute, 0));
            const utcDate = new Date(Date.UTC(year, month - 1, day, hour, minute, 0));
            
            // Get offset for manager's timezone at this date
            const managerDate = new Date(`${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}T${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:00`);
            const managerStr = managerDate.toLocaleString('en-US', { timeZone: settings.timezone });
            const utcStr = managerDate.toLocaleString('en-US', { timeZone: 'UTC' });
            
            // Simple approach: create date in UTC, then adjust for timezone offset
            const testDate = new Date(year, month - 1, day, hour, minute, 0);
            const zonedStr = testDate.toLocaleString('en-US', { timeZone: settings.timezone, hour12: false });
            
            // Better approach: Use ISO string with timezone offset
            // For America/Los_Angeles, we need to add 7 or 8 hours to get UTC
            const isDST = new Date(year, month - 1, day).toLocaleString('en-US', { timeZone: settings.timezone, timeZoneName: 'short' }).includes('PDT');
            const offsetHours = isDST ? 7 : 8; // PDT is UTC-7, PST is UTC-8
            
            return new Date(Date.UTC(year, month - 1, day, hour + offsetHours, minute, 0));
          };
          
          const slotStart = toManagerTime(startTimeStr);
          const slotEnd = toManagerTime(endTimeStr);
          
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
              
              // Check for conflicts with blocked time rules
              const hasBlockedConflict = blockedRules.some(blockedRule => {
                const [blockStartHour, blockStartMinute] = blockedRule.start_time.split(':').map(Number);
                const [blockEndHour, blockEndMinute] = blockedRule.end_time.split(':').map(Number);
                
                const blockStartTimeStr = `${dateStr}T${blockedRule.start_time}:00`;
                const blockEndTimeStr = `${dateStr}T${blockedRule.end_time}:00`;
                
                const toManagerTime = (timeStr) => {
                  const [datePart, timePart] = timeStr.split('T');
                  const [year, month, day] = datePart.split('-').map(Number);
                  const [hour, minute] = timePart.split(':').map(Number);
                  
                  const isDST = new Date(year, month - 1, day).toLocaleString('en-US', { timeZone: settings.timezone, timeZoneName: 'short' }).includes('PDT');
                  const offsetHours = isDST ? 7 : 8;
                  
                  return new Date(Date.UTC(year, month - 1, day, hour + offsetHours, minute, 0));
                };
                
                const blockStart = toManagerTime(blockStartTimeStr);
                const blockEnd = toManagerTime(blockEndTimeStr);
                
                // Check if slot overlaps with blocked time
                return (currentSlot < blockEnd && slotEndTime > blockStart);
              });
              
              if (!hasConflict && !hasBlockedConflict) {
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