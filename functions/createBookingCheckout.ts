import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';
import Stripe from 'npm:stripe@17.5.0';

const stripe = new Stripe(Deno.env.get("STRIPE_API_KEY"));

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const user = await base44.auth.me();

        if (!user) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { service_type, session_count, amount, notes, scheduled_date } = await req.json();

        // Calculate checkout expiry (30 minutes from now)
        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + 30);

        // Create booking record with soft-hold
        const booking = await base44.asServiceRole.entities.Booking.create({
            user_email: user.email,
            user_name: user.full_name,
            service_type,
            session_count,
            amount,
            currency: 'usd',
            payment_status: 'pending',
            booking_status: 'pending_payment',
            scheduled_date,
            checkout_expires_at: expiresAt.toISOString(),
            notes
        });

        // Create Stripe checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            customer_email: user.email,
            metadata: {
                booking_id: booking.id,
                user_id: user.id,
                service_type
            },
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: `Private Mind Styling - ${session_count} Session${session_count > 1 ? 's' : ''}`,
                            description: `1:1 coaching sessions with Roberta Fernandez`
                        },
                        unit_amount: amount
                    },
                    quantity: 1
                }
            ],
            success_url: `${req.headers.get('origin')}/booking-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${req.headers.get('origin')}/private-sessions-purchase`
        });

        // Update booking with checkout session ID
        await base44.asServiceRole.entities.Booking.update(booking.id, {
            stripe_checkout_session_id: session.id
        });

        return Response.json({
            sessionId: session.id,
            url: session.url
        });

    } catch (error) {
        console.error('Checkout error:', error);
        return Response.json({ error: error.message }, { status: 500 });
    }
});