import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const isAdmin = user.role === 'admin';
    const isManager = user.role === 'manager' || user.custom_role === 'manager';
    if (!isAdmin && !isManager) return Response.json({ error: 'Forbidden' }, { status: 403 });

    const { users } = await req.json();
    if (!users || !Array.isArray(users)) return Response.json({ error: 'No users provided' }, { status: 400 });

    const results = { invited: 0, enrolled: 0, skipped: 0, errors: [] };

    for (const u of users) {
      const email = (u.email || '').trim().toLowerCase();
      if (!email) { results.skipped++; continue; }

      // 1. Invite the user to the platform
      try {
        await base44.users.inviteUser(email, 'user');
        results.invited++;
      } catch (err) {
        // User may already exist - that's fine, continue to enrollment
        const msg = err?.message || '';
        if (!msg.toLowerCase().includes('already')) {
          results.errors.push(`Invite failed for ${email}: ${msg}`);
        }
      }

      // 2. Find user in the system (they may be newly invited or already exist)
      // Wait a moment to let invite settle, then try to find them
      let targetUser = null;
      try {
        const foundUsers = await base44.asServiceRole.entities.User.filter({ email });
        targetUser = foundUsers[0];
      } catch (_) {}

      // 3. Enroll in each mapped course
      if (u.appCourseIds && u.appCourseIds.length > 0 && targetUser) {
        for (const courseId of u.appCourseIds) {
          try {
            // Check if already enrolled
            const existing = await base44.asServiceRole.entities.UserCourseProgress.filter({
              user_id: targetUser.id,
              course_id: courseId,
            });

            if (existing.length === 0) {
              await base44.asServiceRole.entities.UserCourseProgress.create({
                user_id: targetUser.id,
                course_id: courseId,
                status: 'not_started',
                completion_percentage: 0,
              });
              results.enrolled++;

              // Send enrollment notification email
              try {
                const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
                if (RESEND_API_KEY) {
                  const courses = await base44.asServiceRole.entities.Course.filter({ id: courseId });
                  const courseName = courses[0]?.title || 'your course';
                  const firstName = u.firstName || email.split('@')[0];

                  await fetch('https://api.resend.com/emails', {
                    method: 'POST',
                    headers: {
                      'Authorization': `Bearer ${RESEND_API_KEY}`,
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      from: 'Roberta Fernandez <roberta@yourmindstylist.com>',
                      to: email,
                      subject: `You're enrolled in ${courseName}`,
                      html: `
                        <div style="font-family: Georgia, serif; max-width: 580px; margin: 0 auto; color: #2B2725;">
                          <div style="background: #1E3A32; padding: 32px; text-align: center;">
                            <h1 style="color: #D8B46B; font-size: 24px; margin: 0;">Your Mind Stylist</h1>
                          </div>
                          <div style="padding: 40px 32px;">
                            <p style="font-size: 18px; color: #1E3A32; margin-bottom: 8px;">Hi ${firstName},</p>
                            <p style="line-height: 1.7;">You've been enrolled in <strong>${courseName}</strong> on the Your Mind Stylist platform.</p>
                            <p style="line-height: 1.7;">If you don't have an account yet, check your inbox for a separate invitation email to set up your login.</p>
                            <div style="text-align: center; margin: 32px 0;">
                              <a href="https://yourmindstylist.com/login" style="background: #1E3A32; color: #F9F5EF; padding: 14px 32px; text-decoration: none; font-size: 14px; letter-spacing: 0.1em;">ACCESS YOUR COURSE</a>
                            </div>
                            <p style="color: #2B2725; line-height: 1.7; font-size: 14px;">Warmly,<br><strong>Roberta Fernandez</strong><br>Your Mind Stylist</p>
                          </div>
                        </div>
                      `,
                    }),
                  });
                }
              } catch (emailErr) {
                results.errors.push(`Enrollment email failed for ${email}: ${emailErr.message}`);
              }
            }
          } catch (enrollErr) {
            results.errors.push(`Enrollment failed for ${email} in course ${courseId}: ${enrollErr.message}`);
          }
        }
      } else if (u.appCourseIds && u.appCourseIds.length > 0 && !targetUser) {
        // User was just invited, won't have an ID yet — log it
        results.errors.push(`${email}: invited but couldn't enroll yet (account not active). Please manually enroll after they accept the invitation.`);
        results.skipped++;
      }
    }

    return Response.json(results);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});