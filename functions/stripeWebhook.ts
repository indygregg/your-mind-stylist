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
                
                // Handle Booking (Private Sessions)
                if (session.metadata.booking_id) {
                    await base44.asServiceRole.entities.Booking.update(session.metadata.booking_id, {
                        payment_status: 'paid',
                        booking_status: 'confirmed',
                        stripe_payment_intent_id: session.payment_intent
                    });

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