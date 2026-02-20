import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';
import Stripe from 'npm:stripe@17.5.0';

const stripe = new Stripe(Deno.env.get("STRIPE_API_KEY"));
const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");

Deno.serve(async (req) => {
    try {
        // Get raw body text for signature verification
        const body = await req.text();
        const signature = req.headers.get('stripe-signature');

        if (!signature) {
            return Response.json({ error: 'No signature' }, { status: 400 });
        }

        // Initialize base44 AFTER getting the body
        const base44 = createClientFromRequest(req);

        // Helper to track affiliate referral
        const trackAffiliate = async (session) => {
            const affiliateCode = session.metadata?.affiliate_code || session.client_reference_id;
            if (affiliateCode) {
                try {
                    await base44.asServiceRole.functions.invoke('trackAffiliateReferral', {
                        affiliate_code: affiliateCode,
                        referred_user_email: session.customer_email,
                        referred_user_id: session.metadata?.user_id,
                        conversion_type: session.metadata?.type || 'product',
                        product_id: session.metadata?.product_id,
                        product_name: session.metadata?.product_name,
                        purchase_amount: session.amount_total,
                        stripe_payment_intent_id: session.payment_intent
                    });
                } catch (affError) {
                    console.error('Affiliate tracking failed:', affError);
                }
            }
        };

        // Verify webhook signature
        let event;
        try {
            event = await stripe.webhooks.constructEventAsync(
                body,
                signature,
                webhookSecret
            );
        } catch (err) {
            console.error('Webhook signature verification failed:', err.message);
            return Response.json({ error: 'Invalid signature' }, { status: 400 });
        }

        // Handle the event
        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object;
                
                // Track affiliate referral for all conversions
                await trackAffiliate(session);
                
                // Handle Booking (Private Sessions)
                if (session.metadata.booking_id) {
                    await base44.asServiceRole.entities.Booking.update(session.metadata.booking_id, {
                        payment_status: 'paid',
                        booking_status: 'confirmed',
                        stripe_payment_intent_id: session.payment_intent
                    });

                    // Auto-tag user for booking completion
                    if (session.metadata.user_id) {
                        try {
                            await base44.asServiceRole.functions.invoke('autoTagUser', {
                                user_id: session.metadata.user_id,
                                event_type: 'booking_completed'
                            });
                        } catch (tagError) {
                            console.error('Auto-tagging failed:', tagError);
                        }
                    }

                    // Auto-create Zoom meeting
                    try {
                        await base44.asServiceRole.functions.invoke('createZoomMeeting', {
                            booking_id: session.metadata.booking_id
                        });
                    } catch (zoomError) {
                        console.error('Zoom meeting creation failed:', zoomError);
                        // Continue even if Zoom fails
                    }

                    // Send professional booking confirmation emails
                    try {
                        // Send client confirmation
                        await base44.asServiceRole.functions.invoke('sendBookingNotifications', {
                            booking_id: session.metadata.booking_id,
                            notification_type: 'booking_confirmation_client'
                        });

                        // Send manager notification
                        await base44.asServiceRole.functions.invoke('sendBookingNotifications', {
                            booking_id: session.metadata.booking_id,
                            notification_type: 'booking_confirmation_manager'
                        });
                    } catch (emailError) {
                        console.error('Email send failed:', emailError);
                        // Don't fail the webhook if emails fail
                    }
                }
                
                // Handle Webinar Purchase
                else if (session.metadata.type === 'webinar_purchase' && session.metadata.webinar_id && session.metadata.user_id) {
                    // Grant webinar access
                    await base44.asServiceRole.entities.UserWebinarAccess.create({
                        user_id: session.metadata.user_id,
                        webinar_id: session.metadata.webinar_id,
                        access_type: 'purchased',
                        access_granted_date: new Date().toISOString(),
                        purchase_date: new Date().toISOString(),
                        stripe_payment_intent_id: session.payment_intent
                    });

                    // Increment registration count
                    const webinars = await base44.asServiceRole.entities.Webinar.filter({ id: session.metadata.webinar_id });
                    if (webinars.length > 0) {
                        const webinar = webinars[0];
                        await base44.asServiceRole.entities.Webinar.update(webinar.id, {
                            registration_count: (webinar.registration_count || 0) + 1
                        });
                    }

                    await base44.asServiceRole.integrations.Core.SendEmail({
                        to: session.customer_email,
                        subject: 'Webinar Access Granted',
                        body: `
                            <h2>Welcome! Your webinar access is confirmed.</h2>
                            <p>Your payment has been processed and you now have access to watch anytime.</p>
                            <p>Access your webinar: https://yourmindstylist.com/WebinarPage?slug=${session.metadata.webinar_slug || ''}</p>
                            <br>
                            <p>Roberta Fernandez<br>Your Mind Stylist</p>
                        `
                    });
                }
                
                // Handle Product Purchase (universal)
                else if (session.metadata.product_id && session.metadata.user_id) {
                    // Get the product to see what access it grants
                    const products = await base44.asServiceRole.entities.Product.filter({ 
                        id: session.metadata.product_id 
                    });
                    
                    if (products.length > 0) {
                        const product = products[0];
                        
                        // Grant access based on product configuration
                        const courseIds = [];
                        
                        // Add related course if exists
                        if (product.related_course_id) {
                            courseIds.push(product.related_course_id);
                        }
                        
                        // Add all access grants
                        if (product.access_grants && product.access_grants.length > 0) {
                            courseIds.push(...product.access_grants);
                        }
                        
                        // Grant course access for each course
                        for (const courseId of courseIds) {
                            // Check if access already exists
                            const existing = await base44.asServiceRole.entities.UserCourseProgress.filter({
                                user_id: session.metadata.user_id,
                                course_id: courseId
                            });
                            
                            if (existing.length === 0) {
                                await base44.asServiceRole.entities.UserCourseProgress.create({
                                    user_id: session.metadata.user_id,
                                    course_id: courseId,
                                    status: 'not_started',
                                    completion_percentage: 0
                                });
                            }
                        }

                        // Auto-tag user based on purchase
                        try {
                            await base44.asServiceRole.functions.invoke('autoTagUser', {
                                user_id: session.metadata.user_id,
                                product_key: product.key
                            });
                        } catch (tagError) {
                            console.error('Auto-tagging failed:', tagError);
                            // Continue even if tagging fails
                        }

                        // Add to CRM as lead
                        try {
                            const existingLeads = await base44.asServiceRole.entities.Lead.filter({
                                email: session.customer_email
                            });

                            if (existingLeads.length > 0) {
                                await base44.asServiceRole.entities.Lead.update(existingLeads[0].id, {
                                    last_activity_date: new Date().toISOString(),
                                    notes: `${existingLeads[0].notes || ''}\n[${new Date().toLocaleDateString()}] Purchased: ${product.name}`
                                });
                            } else {
                                await base44.asServiceRole.entities.Lead.create({
                                    full_name: session.customer_details?.name || '',
                                    email: session.customer_email,
                                    stage: 'won',
                                    source: 'product_purchase',
                                    interest_level: 'hot',
                                    lead_score: 80,
                                    last_activity_date: new Date().toISOString(),
                                    notes: `Purchased: ${product.name}`
                                });
                            }
                        } catch (crmError) {
                            console.error('Failed to add to CRM (non-critical):', crmError.message);
                        }

                        // Check if this is Pocket Mindset purchase - send special email
                        if (product.key === 'pocket-mindset' || product.slug === 'pocket-mindset') {
                            await base44.asServiceRole.functions.invoke('sendTemplatedEmail', {
                                template_key: 'pocket_mindset_purchase',
                                recipient: session.customer_email,
                                variables: {
                                    customer_name: session.customer_details?.name || 'there',
                                    access_code: '935384',
                                    current_year: new Date().getFullYear().toString()
                                }
                            });
                        } else {
                            // Standard product purchase email for all other products
                            await base44.asServiceRole.integrations.Core.SendEmail({
                                to: session.customer_email,
                                subject: `Welcome to ${product.name}`,
                                body: `
                                    <h2>Your purchase is confirmed!</h2>
                                    <p>Thank you for purchasing ${product.name}.</p>
                                    <p>You now have access to all included content.</p>
                                    <p>Log in to your dashboard to get started: https://yourmindstylist.com/login</p>
                                    <br>
                                    <p>Roberta Fernandez<br>Your Mind Stylist</p>
                                `
                            });
                        }
                    }
                }
                
                // Handle Subscription Start (e.g., Pocket Visualization)
                else if (session.mode === 'subscription' && session.subscription) {
                    // Update user subscription info
                    const userId = session.metadata.user_id;
                    if (userId) {
                        await base44.asServiceRole.entities.User.update(userId, {
                            stripe_customer_id: session.customer,
                            stripe_subscription_id: session.subscription,
                            subscription_status: 'active'
                        });

                        // Auto-tag for subscription (e.g., Pocket Visualization)
                        try {
                            await base44.asServiceRole.functions.invoke('autoTagUser', {
                                user_id: userId,
                                product_key: 'pocket-visualization' // Default to PV
                            });
                        } catch (tagError) {
                            console.error('Auto-tagging failed:', tagError);
                        }

                        await base44.asServiceRole.integrations.Core.SendEmail({
                            to: session.customer_email,
                            subject: 'Subscription Activated',
                            body: `
                                <h2>Your subscription is now active!</h2>
                                <p>Thank you for subscribing. You now have full access to all subscription features.</p>
                                <p>Log in to get started: https://yourmindstylist.com/login</p>
                                <br>
                                <p>Roberta Fernandez<br>Your Mind Stylist</p>
                            `
                        });
                    }
                }
                
                // Handle Masterclass Signup (free access)
                else if (session.metadata.type === 'masterclass_signup' && session.metadata.user_id) {
                    // Mark user as needing onboarding
                    await base44.asServiceRole.entities.User.update(session.metadata.user_id, {
                        needs_masterclass_onboarding: true,
                        masterclass_signup_date: new Date().toISOString()
                    });

                    // Auto-tag masterclass lead and trigger email sequence
                    try {
                        await base44.asServiceRole.functions.invoke('autoTagUser', {
                            user_id: session.metadata.user_id,
                            event_type: 'masterclass_signup'
                        });
                    } catch (tagError) {
                        console.error('Auto-tagging failed:', tagError);
                    }

                    // Add to CRM as lead
                    try {
                        const existingLeads = await base44.asServiceRole.entities.Lead.filter({
                            email: session.customer_email
                        });

                        if (existingLeads.length > 0) {
                            await base44.asServiceRole.entities.Lead.update(existingLeads[0].id, {
                                last_activity_date: new Date().toISOString(),
                                notes: `${existingLeads[0].notes || ''}\n[${new Date().toLocaleDateString()}] Signed up for free masterclass`
                            });
                        } else {
                            await base44.asServiceRole.entities.Lead.create({
                                name: session.customer_details?.name || 'Unknown',
                                email: session.customer_email,
                                stage: 'masterclass_lead',
                                source: 'free_masterclass',
                                last_activity_date: new Date().toISOString(),
                                notes: 'Signed up for free masterclass'
                            });
                        }
                    } catch (crmError) {
                        console.error('Failed to add to CRM (non-critical):', crmError.message);
                    }

                    // Send welcome email with masterclass access
                    await base44.asServiceRole.integrations.Core.SendEmail({
                        to: session.customer_email,
                        subject: 'Welcome! Your Masterclass Is Ready',
                        body: `
                            <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto;">
                                <h1 style="font-family: 'Playfair Display', serif; color: #1E3A32; font-size: 32px; margin-bottom: 16px;">Welcome to Your Mind Stylist</h1>
                                
                                <p style="color: #2B2725; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                                    Thank you for signing up for the <strong>Imposter Syndrome & Other Myths to Ditch</strong> masterclass.
                                </p>
                                
                                <p style="color: #2B2725; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                                    Your masterclass is now available in your personal dashboard. You can watch it anytime, pause, rewatch sections, and take notes as you go.
                                </p>
                                
                                <div style="background: #F9F5EF; padding: 24px; margin: 24px 0; border-left: 4px solid #D8B46B;">
                                    <p style="color: #1E3A32; font-size: 16px; margin: 0;">
                                        <strong>What's included:</strong>
                                    </p>
                                    <ul style="color: #2B2725; margin-top: 12px;">
                                        <li>Full masterclass video (on-demand)</li>
                                        <li>Your Mind Styling Studio™ dashboard</li>
                                        <li>Progress tracking and notes</li>
                                        <li>Access to Style Pauses™</li>
                                    </ul>
                                </div>
                                
                                <div style="text-align: center; margin: 32px 0;">
                                    <a href="https://yourmindstylist.com/login?from_masterclass=true" 
                                       style="display: inline-block; background: #1E3A32; color: #F9F5EF; padding: 16px 32px; text-decoration: none; font-weight: 500; letter-spacing: 0.5px;">
                                        ACCESS YOUR DASHBOARD
                                    </a>
                                </div>
                                
                                <p style="color: #2B2725; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                                    If the masterclass resonates with you, I'd love to continue supporting your work. You'll find information about private coaching, certification training, and group programs inside your dashboard.
                                </p>
                                
                                <p style="color: #2B2725; font-size: 16px; line-height: 1.6;">
                                    Welcome aboard,<br>
                                    <strong>Roberta Fernandez</strong><br>
                                    <span style="color: #D8B46B;">Your Mind Stylist</span>
                                </p>
                            </div>
                        `
                    });
                }
                break;
            }

            case 'payment_intent.payment_failed': {
                const paymentIntent = event.data.object;
                // Log failed payment
                console.error('Payment failed:', paymentIntent.id, paymentIntent.last_payment_error);
                break;
            }

            case 'customer.subscription.updated': {
                const subscription = event.data.object;
                
                // Update user subscription status
                const users = await base44.asServiceRole.entities.User.filter({ 
                    stripe_subscription_id: subscription.id 
                });
                
                if (users.length > 0) {
                    await base44.asServiceRole.entities.User.update(users[0].id, {
                        subscription_status: subscription.status
                    });
                    
                    // If payment plan completed, notify user
                    if (subscription.metadata.payment_plan === 'true' && subscription.cancel_at) {
                        const monthsRemaining = Math.ceil((subscription.cancel_at * 1000 - Date.now()) / (30 * 24 * 60 * 60 * 1000));
                        
                        if (monthsRemaining === 1) {
                            await base44.asServiceRole.integrations.Core.SendEmail({
                                to: users[0].email,
                                subject: 'Final Payment Plan Installment',
                                body: `
                                    <h2>Final Payment Coming Up</h2>
                                    <p>This is your last payment installment for ${subscription.metadata.plan_name}.</p>
                                    <p>After this payment, your plan will be complete and you'll retain full access to all content.</p>
                                    <br>
                                    <p>Roberta Fernandez<br>Your Mind Stylist</p>
                                `
                            });
                        }
                    }
                }
                break;
            }

            case 'customer.subscription.deleted': {
                const subscription = event.data.object;
                
                // Mark subscription as cancelled
                const users = await base44.asServiceRole.entities.User.filter({ 
                    stripe_subscription_id: subscription.id 
                });
                
                if (users.length > 0) {
                    await base44.asServiceRole.entities.User.update(users[0].id, {
                        subscription_status: 'cancelled'
                    });

                    // Different message for payment plan completion vs cancellation
                    if (subscription.metadata.payment_plan === 'true') {
                        await base44.asServiceRole.integrations.Core.SendEmail({
                            to: users[0].email,
                            subject: 'Payment Plan Complete!',
                            body: `
                                <h2>Congratulations! Your payment plan is complete</h2>
                                <p>You've successfully completed all ${subscription.metadata.total_months} installments for ${subscription.metadata.plan_name}.</p>
                                <p>You now have permanent access to all included content and materials.</p>
                                <p>Thank you for your commitment to your growth.</p>
                                <br>
                                <p>Roberta Fernandez<br>Your Mind Stylist</p>
                            `
                        });
                    } else {
                        await base44.asServiceRole.integrations.Core.SendEmail({
                            to: users[0].email,
                            subject: 'Subscription Cancelled',
                            body: `
                                <h2>Your subscription has been cancelled</h2>
                                <p>We're sorry to see you go. Your access will remain active until the end of your billing period.</p>
                                <p>You can reactivate anytime from your dashboard.</p>
                                <br>
                                <p>Roberta Fernandez<br>Your Mind Stylist</p>
                            `
                        });
                    }
                }
                break;
            }

            case 'invoice.payment_succeeded': {
                const invoice = event.data.object;
                // Subscription renewal successful
                console.log('Invoice paid:', invoice.id);
                break;
            }

            case 'invoice.payment_failed': {
                const invoice = event.data.object;
                // Notify user of failed payment
                const users = await base44.asServiceRole.entities.User.filter({ 
                    stripe_customer_id: invoice.customer 
                });
                
                if (users.length > 0) {
                    await base44.asServiceRole.entities.User.update(users[0].id, {
                        subscription_status: 'past_due'
                    });

                    await base44.asServiceRole.integrations.Core.SendEmail({
                        to: users[0].email,
                        subject: 'Payment Issue - Action Required',
                        body: `
                            <h2>We couldn't process your payment</h2>
                            <p>There was an issue processing your subscription payment.</p>
                            <p>Please update your payment method to continue your access.</p>
                            <p>Manage your subscription: https://yourmindstylist.com/dashboard</p>
                            <br>
                            <p>Roberta Fernandez<br>Your Mind Stylist</p>
                        `
                    });
                }
                break;
            }
        }

        return Response.json({ received: true });

    } catch (error) {
        console.error('Webhook error:', error);
        return Response.json({ error: error.message }, { status: 500 });
    }
});