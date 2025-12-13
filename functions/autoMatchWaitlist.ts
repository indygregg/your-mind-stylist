import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user || (user.role !== 'admin' && user.role !== 'manager')) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get all waiting entries ordered by priority
    const waitingEntries = await base44.asServiceRole.entities.WaitingList.filter({
      status: 'waiting',
      auto_match_enabled: true
    });

    // Sort by priority score (highest first)
    waitingEntries.sort((a, b) => (b.priority_score || 0) - (a.priority_score || 0));

    // Get available slots from next 30 days
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 30);

    const matches = [];

    for (const entry of waitingEntries) {
      try {
        // Get available slots for this service type
        const slotsResponse = await base44.asServiceRole.functions.invoke('getAvailableSlots', {
          appointment_type_id: entry.appointment_type_id,
          start_date: startDate.toISOString(),
          end_date: endDate.toISOString()
        });

        if (!slotsResponse.data.slots || slotsResponse.data.slots.length === 0) {
          continue;
        }

        const slots = slotsResponse.data.slots;

        // Find best matching slot
        let bestSlot = null;
        let bestScore = 0;

        for (const slot of slots) {
          const slotDate = new Date(slot.start);
          let matchScore = 0;

          // Check if slot matches preferred dates
          if (entry.preferred_dates && entry.preferred_dates.length > 0) {
            const slotDateStr = slotDate.toISOString().split('T')[0];
            if (entry.preferred_dates.includes(slotDateStr)) {
              matchScore += 50;
            }
          }

          // Check if slot matches preferred times
          if (entry.preferred_times && entry.preferred_times.length > 0) {
            const hour = slotDate.getHours();
            const timeOfDay = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening';
            if (entry.preferred_times.includes(timeOfDay)) {
              matchScore += 30;
            }
          }

          // Prefer earlier slots
          const daysFromNow = Math.floor((slotDate - new Date()) / (1000 * 60 * 60 * 24));
          matchScore += Math.max(0, 20 - daysFromNow); // Earlier is better

          if (matchScore > bestScore) {
            bestScore = matchScore;
            bestSlot = slot;
          }
        }

        if (bestSlot && bestScore > 30) { // Threshold for good match
          // Update waitlist entry
          await base44.asServiceRole.entities.WaitingList.update(entry.id, {
            status: 'matched',
            matched_date: new Date().toISOString(),
            matched_slot_date: bestSlot.start
          });

          // Send notification email
          await base44.asServiceRole.integrations.Core.SendEmail({
            to: entry.user_email,
            subject: 'Slot Available for Your Booking',
            body: `Hello ${entry.user_name},\n\nGood news! A slot matching your preferences is now available.\n\nDate: ${new Date(bestSlot.start).toLocaleString()}\n\nPlease log in to confirm your booking within 24 hours.\n\nBest regards,\nYour Mind Stylist`
          });

          matches.push({
            waitlist_id: entry.id,
            user_name: entry.user_name,
            user_email: entry.user_email,
            matched_slot: bestSlot.start,
            match_score: bestScore
          });
        }
      } catch (error) {
        console.error(`Error matching entry ${entry.id}:`, error);
      }
    }

    return Response.json({
      success: true,
      matches_found: matches.length,
      matches
    });

  } catch (error) {
    console.error('Auto-match error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});