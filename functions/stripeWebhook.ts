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
        if (event.type === 'checkout.session.completed') {
            const session = event.data.object;
            const bookingId = session.metadata.booking_id;

            if (bookingId) {
                // Update booking status
                await base44.asServiceRole.entities.Booking.update(bookingId, {
                    payment_status: 'paid',
                    booking_status: 'confirmed',
                    stripe_payment_intent_id: session.payment_intent
                });

                // Send confirmation email
                await base44.asServiceRole.integrations.Core.SendEmail({
                    to: session.customer_email,
                    subject: 'Private Session Booking Confirmed',
                    body: `
                        <h2>Your booking is confirmed!</h2>
                        <p>Thank you for booking private Mind Styling sessions with Roberta.</p>
                        <p>You'll receive a follow-up email within 24-48 hours to schedule your sessions.</p>
                        <p>Looking forward to working with you!</p>
                        <br>
                        <p>Roberta Fernandez<br>Your Mind Stylist</p>
                    `
                });
            }
        }

        return Response.json({ received: true });

    } catch (error) {
        console.error('Webhook error:', error);
        return Response.json({ error: error.message }, { status: 500 });
    }
});