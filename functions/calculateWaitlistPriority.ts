import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user || (user.role !== 'admin' && user.role !== 'manager')) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { waitlist_id } = await req.json();

    // Get waitlist entry
    const entries = await base44.asServiceRole.entities.WaitingList.filter({ id: waitlist_id });
    if (!entries || entries.length === 0) {
      return Response.json({ error: 'Waitlist entry not found' }, { status: 404 });
    }

    const entry = entries[0];

    // Calculate priority factors
    const factors = {};

    // 1. Wait time (0-40 points) - longer wait = higher priority
    const waitDays = Math.floor((Date.now() - new Date(entry.requested_date).getTime()) / (1000 * 60 * 60 * 24));
    factors.wait_time_days = waitDays;
    const waitScore = Math.min(40, waitDays * 2); // 2 points per day, max 40

    // 2. Flexibility (0-15 points) - more flexible = higher priority (easier to match)
    const flexScore = entry.flexible ? 15 : 5;
    factors.flexibility = flexScore;

    // 3. Client history (0-25 points) - check for previous bookings
    const previousBookings = await base44.asServiceRole.entities.Booking.filter({
      user_email: entry.user_email,
      booking_status: 'completed'
    });
    const historyScore = Math.min(25, previousBookings.length * 5); // 5 points per completed booking
    factors.client_history = historyScore;

    // 4. Urgency (0-20 points) - self-reported urgency
    const urgencyMap = { low: 5, medium: 10, high: 15, critical: 20 };
    const urgencyScore = urgencyMap[entry.urgency_level] || 10;
    factors.urgency = urgencyScore;

    // Total priority score (0-100)
    const priorityScore = waitScore + flexScore + historyScore + urgencyScore;

    // Update waitlist entry
    await base44.asServiceRole.entities.WaitingList.update(waitlist_id, {
      priority_score: priorityScore,
      priority_factors: factors
    });

    return Response.json({
      success: true,
      priority_score: priorityScore,
      factors
    });

  } catch (error) {
    console.error('Calculate priority error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});