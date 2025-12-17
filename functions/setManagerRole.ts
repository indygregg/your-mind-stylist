import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        
        // Get current user
        const currentUser = await base44.auth.me();
        
        // Only allow admin users to set roles
        if (!currentUser || currentUser.role !== 'admin') {
            return Response.json({ error: 'Unauthorized - admin only' }, { status: 403 });
        }

        const { email } = await req.json();

        if (!email) {
            return Response.json({ error: 'Email required' }, { status: 400 });
        }

        // Get all users and find the one by email
        const allUsers = await base44.asServiceRole.entities.User.list('-created_date', 1000);
        const targetUser = allUsers.find(u => u.email === email);

        if (!targetUser) {
            return Response.json({ error: 'User not found' }, { status: 404 });
        }

        // Update to manager role
        await base44.asServiceRole.entities.User.update(targetUser.id, {
            role: 'manager'
        });

        return Response.json({ 
            success: true, 
            message: `Successfully set ${email} to manager role`,
            user: targetUser
        });

    } catch (error) {
        console.error('Set manager role error:', error);
        return Response.json({ error: error.message }, { status: 500 });
    }
});