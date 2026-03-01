import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    // Only allow admin/managers to run this
    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    // Get all availability rules created by indy.gregg@yourmindstylist.com or similar
    const allRules = await base44.asServiceRole.entities.AvailabilityRule.list();
    
    // Filter for rules created by Indy Gregg (check created_by email)
    const indyRules = allRules.filter(rule => 
      rule.created_by && rule.created_by.toLowerCase().includes('indy')
    );

    console.log(`Found ${indyRules.length} rules created by Indy Gregg`);

    // Delete each rule
    let deletedCount = 0;
    for (const rule of indyRules) {
      try {
        await base44.asServiceRole.entities.AvailabilityRule.delete(rule.id);
        deletedCount++;
      } catch (err) {
        console.error(`Failed to delete rule ${rule.id}:`, err.message);
      }
    }

    return Response.json({ 
      success: true,
      message: `Deleted ${deletedCount} availability rules created by Indy Gregg`,
      total_found: indyRules.length
    });
  } catch (error) {
    console.error('Error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});