import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { email, full_name } = await req.json();

    const masterclassUrl = `${Deno.env.get('BASE_URL') || 'https://app.base44.com'}/app/masterclass`;

    await base44.asServiceRole.integrations.Core.SendEmail({
      to: email,
      from_name: 'Roberta Fernandez - The Mind Stylist',
      subject: 'Your Free Masterclass is Ready to Watch',
      body: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: Georgia, serif;">
  <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; background-color: #F9F5EF;">
    <!-- Header -->
    <div style="background-color: #1E3A32; padding: 40px 30px; text-align: center;">
      <h1 style="color: #F9F5EF; font-size: 24px; margin: 0 0 10px 0; font-weight: normal;">
        Roberta Fernandez
      </h1>
      <p style="color: #D8B46B; font-size: 14px; letter-spacing: 2px; margin: 0; text-transform: uppercase;">
        The Mind Stylist
      </p>
    </div>

    <!-- Content -->
    <div style="padding: 50px 30px; background-color: #FFFFFF;">
      <h2 style="font-size: 28px; color: #1E3A32; margin-bottom: 20px; font-family: Georgia, serif;">
        Your Free Masterclass is Ready
      </h2>

      <p style="font-size: 16px; color: #2B2725; line-height: 1.6; margin-bottom: 20px;">
        Hi ${full_name},
      </p>

      <p style="font-size: 16px; color: #2B2725; line-height: 1.6; margin-bottom: 20px;">
        Thank you for signing up. Your masterclass on imposter syndrome is ready to watch.
      </p>

      <p style="font-size: 16px; color: #2B2725; line-height: 1.6; margin-bottom: 30px;">
        In this session, we'll explore what's really happening beneath those feelings of "I'm not enough" — 
        and how to start shifting the patterns that keep you stuck.
      </p>

      <!-- CTA Button -->
      <div style="text-align: center; margin: 40px 0;">
        <a 
          href="${masterclassUrl}"
          style="display: inline-block; padding: 16px 40px; background-color: #1E3A32; color: #F9F5EF; text-decoration: none; font-size: 14px; letter-spacing: 1px; text-transform: uppercase;"
        >
          Watch the Masterclass
        </a>
      </div>

      <div style="border-left: 3px solid #D8B46B; padding-left: 20px; margin-top: 40px;">
        <p style="font-size: 16px; color: #2B2725; line-height: 1.6; font-style: italic; margin: 0;">
          "Awareness is always the first step. Simply noticing these patterns — without judgment — is the beginning of transformation."
        </p>
      </div>
    </div>

    <!-- Footer -->
    <div style="padding: 30px; background-color: #F9F5EF; text-align: center; border-top: 1px solid #E4D9C4;">
      <p style="font-size: 14px; color: #2B2725; opacity: 0.7; margin: 0 0 10px 0;">
        Questions? Reply to this email or visit our contact page.
      </p>
      <p style="font-size: 12px; color: #2B2725; opacity: 0.5; margin: 0;">
        © 2025 The Mind Stylist. Las Vegas, NV
      </p>
    </div>
  </div>
</body>
</html>
      `
    });

    // Update signup record
    const signups = await base44.asServiceRole.entities.MasterclassSignup.filter({ email });
    if (signups.length > 0) {
      await base44.asServiceRole.entities.MasterclassSignup.update(signups[0].id, {
        confirmation_sent: true
      });
    }

    // Add to MailerLite masterclass automation
    try {
      const apiKey = Deno.env.get('MAILERLITE_API_KEY');
      if (apiKey) {
        await fetch('https://connect.mailerlite.com/api/subscribers', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            email,
            fields: {
              name: full_name || '',
              masterclass_signup_date: new Date().toISOString()
            }
          })
        });
      }
    } catch (mlError) {
      console.log('MailerLite sync failed (non-critical):', mlError.message);
    }

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});