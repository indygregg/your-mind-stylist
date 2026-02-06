import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { confirmationText } = await req.json();

    // Verify confirmation text
    if (confirmationText !== 'DELETE MY ACCOUNT') {
      return Response.json({ 
        error: 'Invalid confirmation. Please type "DELETE MY ACCOUNT" exactly.' 
      }, { status: 400 });
    }

    // Mark account for deletion (soft delete)
    await base44.auth.updateMe({
      account_deletion_requested: true,
      account_deletion_date: new Date().toISOString(),
      account_status: 'pending_deletion'
    });

    // Log the deletion request
    await base44.asServiceRole.entities.ActivityLog.create({
      action: 'account_deletion_requested',
      actor: user.email,
      target: user.id,
      details: `User ${user.email} requested account deletion`
    });

    // Send notification email to admin
    await base44.integrations.Core.SendEmail({
      to: 'roberta@robertafernandez.com',
      subject: 'Account Deletion Request',
      body: `User ${user.full_name} (${user.email}) has requested account deletion. User ID: ${user.id}`
    });

    return Response.json({ 
      success: true,
      message: 'Account deletion request received. You will be logged out shortly.'
    });
  } catch (error) {
    console.error('Delete account error:', error);
    return Response.json({ 
      error: error.message || 'Failed to process deletion request' 
    }, { status: 500 });
  }
});