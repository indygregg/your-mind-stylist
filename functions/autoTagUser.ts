import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

// Product key to tags mapping
const PRODUCT_TAG_MAP = {
  // Pocket Mindset / Visualization
  'pocket-visualization': ['purchased_pv', 'active_student', 'seq_pv_onboarding'],
  'pocket-mindset': ['purchased_pocket_mindset', 'active_student', 'seq_pv_onboarding'],
  // Webinars & Audio
  'mini-webinars': ['purchased_webinar', 'active_student'],
  'mind-declutter-audio': ['purchased_audio', 'active_student'],
  // Toolkit
  'toolkit-module': ['purchased_toolkit', 'active_student'],
  'toolkit-bundle': ['purchased_toolkit', 'purchased_bundle', 'active_student'],
  // Group / 1:1 Coaching
  'salon-coaching': ['purchased_coaching', 'purchased_salon', 'active_student', 'high_engagement'],
  'couture-coaching': ['purchased_coaching', 'purchased_couture', 'active_student', 'high_engagement'],
  // Certification
  'hypnosis-certification': ['purchased_cert', 'active_student', 'high_engagement'],
  'hypnosis-audit': ['purchased_cert_audit', 'active_student'],
  // Retreat
  'annual-retreat': ['purchased_retreat', 'active_student', 'high_engagement'],
  // Inner Rehearsal / Cleaning Out Your Closet
  'inner-rehearsal': ['purchased_inner_rehearsal', 'active_student'],
  'cleaning-closet': ['purchased_cleaning_closet', 'active_student'],
  // LENS
  'lens': ['purchased_lens', 'active_student', 'high_engagement'],
};

// Event type to tags mapping
const EVENT_TAG_MAP = {
  // Lead generation events
  'masterclass_signup': ['lead_masterclass', 'seq_masterclass'],
  'consultation_request': ['lead_consultation'],
  'webinar_signup': ['lead_webinar'],
  'lead_magnet_download': ['lead_magnet', 'lead_freebie'],
  'contact_form_submitted': ['lead_contact'],

  // Booking / session events
  'booking_completed': ['purchased_private', 'active_student'],
  'booking_scheduled': ['has_scheduled_session'],
  'booking_cancelled': ['cancelled_booking'],
  'session_completed': ['completed_session', 'active_student'],
  'consultation_completed': ['completed_consultation'],

  // Course / content events
  'course_purchased': ['purchased_course', 'active_student'],
  'course_started': ['started_course', 'active_student'],
  'course_completed': ['completed_course', 'high_engagement'],
  'lesson_completed': ['active_learner', 'active_student'],
  'module_completed': ['active_learner', 'active_student'],
  'certificate_earned': ['certified_student', 'high_engagement'],

  // Engagement events
  'diary_entry_created': ['diary_user', 'active_student'],
  'style_pause_completed': ['style_pause_user', 'active_student'],
  'audio_session_played': ['audio_user', 'active_student'],
  'quiz_completed': ['quiz_taker', 'active_student'],
  'reflection_submitted': ['reflective_student', 'active_student'],

  // User lifecycle
  'user_registered': ['new_user', 'seq_welcome'],
  'user_inactive_30d': ['inactive_30d', 'seq_rejoin'],
  'user_inactive_60d': ['inactive_60d', 'seq_rejoin'],
  'subscription_cancelled': ['churned', 'seq_winback'],
  'subscription_renewed': ['active_subscriber'],
};

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    // Require admin/manager or service role
    const user = await base44.auth.me();
    if (!user || (user.role !== 'admin' && user.role !== 'manager')) {
      return Response.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { user_id, product_key, event_type, additional_tags } = await req.json();

    if (!user_id) {
      return Response.json({ error: 'user_id is required' }, { status: 400 });
    }

    // Get the user
    const targetUser = await base44.asServiceRole.entities.User.filter({ id: user_id });
    if (!targetUser || targetUser.length === 0) {
      return Response.json({ error: 'User not found' }, { status: 404 });
    }

    const userData = targetUser[0];
    const currentTags = userData.tags || [];
    let newTags = [...currentTags];

    // Add tags based on product purchase
    if (product_key && PRODUCT_TAG_MAP[product_key]) {
      const tagsToAdd = PRODUCT_TAG_MAP[product_key];
      tagsToAdd.forEach(tag => {
        if (!newTags.includes(tag)) {
          newTags.push(tag);
        }
      });
    }

    // Add tags based on event type
    if (event_type && EVENT_TAG_MAP[event_type]) {
      const tagsToAdd = EVENT_TAG_MAP[event_type];
      tagsToAdd.forEach(tag => {
        if (!newTags.includes(tag)) {
          newTags.push(tag);
        }
      });
    }

    // Add any additional custom tags
    if (additional_tags && Array.isArray(additional_tags)) {
      additional_tags.forEach(tag => {
        if (!newTags.includes(tag)) {
          newTags.push(tag);
        }
      });
    }

    // Update user tags in database
    await base44.asServiceRole.entities.User.update(user_id, {
      tags: newTags
    });

    // Sync tags to MailerLite
    try {
      // Update subscriber with tags in MailerLite
      await base44.asServiceRole.functions.invoke('mailerLiteUpdateSubscriber', {
        email: userData.email,
        fields: {
          name: userData.full_name
        },
        tags: newTags
      });

      // Check if any sequence tags were added and trigger automations
      const sequenceTags = newTags.filter(tag => tag.startsWith('seq_'));
      for (const seqTag of sequenceTags) {
        // Map sequence tags to MailerLite groups/automations
        let groupName = null;
        
        switch(seqTag) {
          case 'seq_masterclass':
            groupName = 'Masterclass Follow-up';
            break;
          case 'seq_pv_onboarding':
            groupName = 'PV Onboarding';
            break;
          case 'seq_welcome':
            groupName = 'Welcome Sequence';
            break;
          case 'seq_rejoin':
            groupName = 'Re-engagement';
            break;
        }

        if (groupName) {
          // Add to MailerLite group to trigger automation
          try {
            await base44.asServiceRole.functions.invoke('mailerLiteAddToGroup', {
              email: userData.email,
              group_name: groupName
            });
          } catch (groupError) {
            console.error('Failed to add to MailerLite group:', groupError);
            // Continue even if group add fails
          }
        }
      }
    } catch (mailerError) {
      console.error('MailerLite sync error:', mailerError);
      // Don't fail the whole operation if MailerLite fails
    }

    return Response.json({
      success: true,
      user_id,
      tags_added: newTags.filter(tag => !currentTags.includes(tag)),
      total_tags: newTags.length
    });

  } catch (error) {
    console.error('Auto tag error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});