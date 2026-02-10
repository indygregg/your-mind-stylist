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

        const { service_type, session_count, amount, notes, scheduled_date, appointment_type_id, staff_id, intake_data, affiliate_code } = await req.json();

        // Free consultations - no payment required
        if (amount === 0) {
            const booking = await base44.asServiceRole.entities.Booking.create({
                user_email: user.email,
                user_name: user.full_name,
                staff_id,
                appointment_type_id,
                service_type,
                session_count: session_count || 1,
                amount: 0,
                currency: 'usd',
                payment_status: 'not_required',
                booking_status: 'confirmed',
                scheduled_date,
                notes,
                client_phone: intake_data?.phone,
                client_contact_preference: intake_data?.contact_preference
            });

            // Send confirmation emails asynchronously (don't wait)
            fetch(`${req.headers.get('origin')}/api/functions/sendBookingEmail`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ booking_id: booking.id, recipient_type: 'client' })
            }).catch(() => {});
            
            fetch(`${req.headers.get('origin')}/api/functions/sendBookingEmail`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ booking_id: booking.id, recipient_type: 'manager' })
            }).catch(() => {});

            return Response.json({
                success: true,
                booking_id: booking.id,
                redirect_url: `${req.headers.get('origin')}/booking-success?booking_id=${booking.id}`
            });
        }

        // Paid sessions - create Stripe checkout
        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + 30);

        const booking = await base44.asServiceRole.entities.Booking.create({
            user_email: user.email,
            user_name: user.full_name,
            staff_id,
            appointment_type_id,
            service_type,
            session_count,
            amount,
            currency: 'usd',
            payment_status: 'pending',
            booking_status: 'pending_payment',
            scheduled_date,
            checkout_expires_at: expiresAt.toISOString(),
            notes,
            client_phone: intake_data?.phone,
            client_contact_preference: intake_data?.contact_preference
        });

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            customer_email: user.email,
            client_reference_id: affiliate_code || null,
            metadata: {
                booking_id: booking.id,
                user_id: user.id,
                service_type,
                affiliate_code: affiliate_code || null
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
            cancel_url: `${req.headers.get('origin')}/bookings`
        });

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