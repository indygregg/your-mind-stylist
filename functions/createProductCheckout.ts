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

        const { product_id, selected_price_id } = await req.json();

        if (!product_id) {
            return Response.json({ error: 'product_id is required' }, { status: 400 });
        }

        // Get product details
        const products = await base44.asServiceRole.entities.Product.filter({ id: product_id });
        const product = products[0];

        if (!product) {
            return Response.json({ error: 'Product not found' }, { status: 404 });
        }

        // Determine which price to use
        let stripePriceId = selected_price_id || product.stripe_price_id;
        
        if (!stripePriceId) {
            return Response.json({ error: 'No Stripe price configured for this product' }, { status: 400 });
        }

        // Get or create Stripe customer
        let customer;
        const customers = await stripe.customers.list({
            email: user.email,
            limit: 1,
        });

        if (customers.data.length > 0) {
            customer = customers.data[0];
        } else {
            customer = await stripe.customers.create({
                email: user.email,
                name: user.full_name,
                metadata: {
                    user_id: user.id,
                    product_key: product.key,
                },
            });
        }

        // Check if selected price is recurring (payment plan)
        let mode = 'payment';
        if (selected_price_id) {
            const priceDetails = await stripe.prices.retrieve(selected_price_id);
            mode = priceDetails.recurring ? 'subscription' : 'payment';
        } else if (product.type === 'subscription') {
            mode = 'subscription';
        }

        // Create checkout session
        const session = await stripe.checkout.sessions.create({
            customer: customer.id,
            mode: mode,
            line_items: [
                {
                    price: stripePriceId,
                    quantity: 1,
                },
            ],
            success_url: `${req.headers.get('origin')}/app/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${req.headers.get('origin')}/app/purchase-center`,
            metadata: {
                user_id: user.id,
                product_id: product.id,
                product_key: product.key,
                selected_price_id: stripePriceId,
                is_payment_plan: selected_price_id ? 'true' : 'false',
            },
        });

        return Response.json({
            url: session.url,
            session_id: session.id,
        });

    } catch (error) {
        console.error('createProductCheckout error:', error);
        return Response.json({ error: error.message }, { status: 500 });
    }
});