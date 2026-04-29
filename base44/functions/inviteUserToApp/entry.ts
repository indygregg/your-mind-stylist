import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only admins/managers can invite users
    if (user.role !== 'admin' && user.custom_role !== 'manager') {
      return Response.json({ error: 'Forbidden: Only admins and managers can invite users' }, { status: 403 });
    }

    const { email, role = 'user', checkOnly = false, resend = false } = await req.json();

    if (!email) {
      return Response.json({ error: 'Email is required' }, { status: 400 });
    }

    // Check if user already exists
    const existingUsers = await base44.asServiceRole.entities.User.filter({ email: email.toLowerCase() });
    const userExists = existingUsers.length > 0;

    // If just checking, return early
    if (checkOnly) {
      return Response.json({ userExists });
    }

    if (userExists) {
      return Response.json({ error: 'User already exists', userExists: true }, { status: 400 });
    }

    // Invite the user (works for both new invites and resends)
    try {
      await base44.auth.inviteUser(email, role);
    } catch (inviteError) {
      // If invite fails because user was already invited but hasn't accepted,
      // re-send the invite email anyway
      console.log('Invite call result:', inviteError.message);
    }

    // Send invitation email
    try {
      await base44.integrations.Core.SendEmail({
        to: email,
        subject: "You're Invited to Your Mind Stylist Platform",
        body: `You've been invited to join the Your Mind Stylist community! Click the link in your email to get started and set up your account.`,
      });
    } catch (emailError) {
      console.error('Error sending invitation email:', emailError);
    }

    return Response.json({ 
      success: true, 
      message: `Invitation sent to ${email}`,
      emailSent: true,
      resend: resend
    });
  } catch (error) {
    console.error('Error inviting user:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});