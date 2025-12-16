import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const data = await req.json();

        const { email, full_name, phone, source, interested_products, utm_source, utm_medium, utm_campaign, first_page_visited } = data;

        if (!email) {
            return Response.json({ error: 'Email required' }, { status: 400 });
        }

        // Check if lead exists
        const existingLeads = await base44.asServiceRole.entities.Lead.filter({ email });
        
        if (existingLeads.length > 0) {
            // Update existing lead
            const lead = existingLeads[0];
            const updates = {};
            
            if (full_name) updates.full_name = full_name;
            if (phone) updates.phone = phone;
            if (interested_products) {
                // Merge with existing interests
                const currentInterests = lead.interested_products || [];
                updates.interested_products = [...new Set([...currentInterests, ...interested_products])];
            }
            
            // Update UTM data only if not already set
            if (utm_source && !lead.utm_source) updates.utm_source = utm_source;
            if (utm_medium && !lead.utm_medium) updates.utm_medium = utm_medium;
            if (utm_campaign && !lead.utm_campaign) updates.utm_campaign = utm_campaign;
            if (first_page_visited && !lead.first_page_visited) updates.first_page_visited = first_page_visited;

            // Recalculate lead score
            const newScore = calculateLeadScore({
                ...lead,
                ...updates
            });
            updates.lead_score = newScore;

            await base44.asServiceRole.entities.Lead.update(lead.id, updates);

            // Log activity
            await base44.asServiceRole.entities.LeadActivity.create({
                lead_id: lead.id,
                activity_type: 'form_submitted',
                description: 'Lead information updated'
            });

            return Response.json({ 
                success: true, 
                lead_id: lead.id,
                is_new: false 
            });
        } else {
            // Create new lead
            const leadScore = calculateLeadScore(data);
            
            const newLead = await base44.asServiceRole.entities.Lead.create({
                email,
                full_name,
                phone,
                source: source || 'website',
                interested_products: interested_products || [],
                stage: 'new',
                lead_score: leadScore,
                interest_level: 'warm',
                utm_source,
                utm_medium,
                utm_campaign,
                first_page_visited,
                tags: []
            });

            // Log activity
            await base44.asServiceRole.entities.LeadActivity.create({
                lead_id: newLead.id,
                activity_type: 'form_submitted',
                description: 'New lead created'
            });

            // Enroll in welcome sequence if available
            try {
                const sequences = await base44.asServiceRole.entities.EmailSequence.filter({
                    trigger_type: 'signup',
                    active: true
                });
                
                if (sequences.length > 0) {
                    await base44.asServiceRole.functions.invoke('enrollUserInSequence', {
                        user_email: email,
                        sequence_id: sequences[0].id,
                        metadata: { lead_id: newLead.id, source }
                    });
                }
            } catch (err) {
                console.error('Failed to enroll in sequence:', err);
            }

            return Response.json({ 
                success: true, 
                lead_id: newLead.id,
                is_new: true 
            });
        }

    } catch (error) {
        console.error('Create/update lead error:', error);
        return Response.json({ error: error.message }, { status: 500 });
    }
});

// Lead scoring algorithm
function calculateLeadScore(lead) {
    let score = 50; // Base score

    // Source quality
    const sourceScores = {
        referral: 15,
        masterclass: 10,
        paid_ad: 5,
        organic_search: 8,
        social_media: 5,
        website: 5,
        email_campaign: 7
    };
    score += sourceScores[lead.source] || 0;

    // Interest indicators
    if (lead.interested_products && lead.interested_products.length > 0) {
        score += Math.min(lead.interested_products.length * 5, 15);
    }

    if (lead.phone) score += 10; // Gave phone number = more serious
    if (lead.budget_range) score += 10;

    // Timeline urgency
    const timelineScores = {
        immediate: 20,
        '1-3_months': 15,
        '3-6_months': 10,
        '6+_months': 5,
        'not_sure': 0
    };
    score += timelineScores[lead.timeline] || 0;

    return Math.min(Math.max(score, 0), 100);
}