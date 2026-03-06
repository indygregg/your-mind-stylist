import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    // Only admins can enroll users
    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const { user_email, course_id, send_notification, first_name, last_name } = await req.json();

    if (!user_email || !course_id) {
      return Response.json({ error: 'user_email and course_id are required' }, { status: 400 });
    }

    // Find the user by email
    const allUsers = await base44.asServiceRole.entities.User.list();
    let targetUser = allUsers.find(u => u.email?.toLowerCase() === user_email.toLowerCase());
    
    // Auto-create user if doesn't exist - use the proper SDK method
    if (!targetUser) {
      await base44.asServiceRole.entities.User.inviteUser(user_email, 'user');
      // Fetch the newly created user
      const updatedUsers = await base44.asServiceRole.entities.User.list();
      targetUser = updatedUsers.find(u => u.email?.toLowerCase() === user_email.toLowerCase());
    }

    // Check if user already has progress for this course
    const allProgress = await base44.asServiceRole.entities.UserCourseProgress.list();
    const existingProgress = allProgress.find(p => p.user_id === targetUser.id && p.course_id === course_id);

    let progressRecord;
    if (existingProgress) {
      // User already enrolled, just return existing
      progressRecord = existingProgress;
    } else {
      // Create new enrollment
      progressRecord = await base44.asServiceRole.entities.UserCourseProgress.create({
        user_id: targetUser.id,
        course_id: course_id,
        status: 'not_started',
        completion_percentage: 0,
      });
    }

    // Fetch course details for notification
    const course = await base44.asServiceRole.entities.Course.get(course_id);

    // Send notification email if requested
    let emailSent = false;
    if (send_notification) {
      try {
        await base44.asServiceRole.integrations.Core.SendEmail({
          to: targetUser.email,
          from_name: 'Your Mind Stylist',
          subject: `You've been enrolled in ${course.title}!`,
          body: `
            <p>Hi ${targetUser.full_name || targetUser.email},</p>
            <p>You've been enrolled in <strong>${course.title}</strong>. You can access it in your account under the Library section.</p>
            <p>Get started whenever you're ready!</p>
            <p>Best,<br>Roberta</p>
          `,
        });
        emailSent = true;
      } catch (emailError) {
        console.error('Email send error:', emailError);
      }
    }

    return Response.json({
      success: true,
      message: `${targetUser.full_name || targetUser.email} enrolled in ${course.title}`,
      progressRecord,
      emailSent,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});