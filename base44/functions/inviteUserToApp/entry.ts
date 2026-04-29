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

    const { email, role = 'user', checkOnly = false, resend = false, brandedSubject, brandedBody } = await req.json();

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

    // STEP 1: Send branded email from Roberta FIRST
    let brandedEmailSent = false;
    try {
      const finalSubject = brandedSubject || "Your Mind Stylist access from Roberta Fernandez";
      const finalBody = brandedBody || getDefaultBrandedBody(email);

      await base44.integrations.Core.SendEmail({
        to: email,
        from_name: "Roberta Fernandez",
        subject: finalSubject,
        body: finalBody,
      });
      brandedEmailSent = true;
      console.log('Branded invite email sent to', email);
    } catch (emailError) {
      console.error('Error sending branded invite email:', emailError);
    }

    // STEP 2: Send system invite (triggers account setup email from Base44)
    try {
      await base44.auth.inviteUser(email, role);
      console.log('System invite sent to', email);
    } catch (inviteError) {
      // If invite fails because user was already invited but hasn't accepted,
      // that's OK — the branded email was already sent above
      console.log('Invite call result:', inviteError.message);
    }

    return Response.json({ 
      success: true, 
      message: `Invitation sent to ${email}`,
      brandedEmailSent,
      resend: resend
    });
  } catch (error) {
    console.error('Error inviting user:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});

function getDefaultBrandedBody(email) {
  const name = email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  return `<div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #F9F5EF; padding: 0;">
  <div style="text-align: center; padding: 32px 24px 16px;">
    <img src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/693a98b3e154ab3b36c88ebb/fad26f1a8_mind-stylist-whie-gold-logo2x.png" alt="Your Mind Stylist" style="height: 60px; width: auto;" />
  </div>
  <div style="background: white; border-radius: 12px; margin: 0 24px; padding: 32px 28px; border: 1px solid #E4D9C4;">
    <p style="font-family: Georgia, serif; color: #1E3A32; font-size: 18px; margin: 0 0 16px;">Hi ${name},</p>
    <p style="color: #2B2725; font-size: 15px; line-height: 1.7; margin: 0 0 16px;">Roberta here. I've created access for you inside Your Mind Stylist so you can access your programs, courses, and resources.</p>
    <p style="color: #2B2725; font-size: 15px; line-height: 1.7; margin: 0 0 16px;">You'll receive a separate setup email shortly. Please use that link to create your login.</p>
    <p style="color: #2B2725; font-size: 15px; line-height: 1.7; margin: 0 0 24px;">Once inside, you'll be able to find your materials, appointments, and resources in your client area.</p>
    <p style="color: #1E3A32; font-size: 15px; font-weight: 500; margin: 0;">Warmly,</p>
    <p style="color: #1E3A32; font-size: 15px; margin: 4px 0 0;">Roberta Fernandez<br/><span style="color: #6E4F7D; font-size: 13px;">Your Mind Stylist</span></p>
  </div>
  <div style="text-align: center; padding: 24px; color: #2B2725; opacity: 0.5; font-size: 12px;">
    <p style="margin: 0;">© ${new Date().getFullYear()} Your Mind Stylist · Las Vegas, NV</p>
    <p style="margin: 4px 0 0;"><a href="https://yourmindstylist.com" style="color: #6E4F7D;">yourmindstylist.com</a></p>
  </div>
</div>`;
}