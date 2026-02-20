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

        const { product_id, product_ids, selected_price_id, affiliate_code } = await req.json();

        // Support both single and multiple products
        const ids = product_ids || (product_id ? [product_id] : []);
        
        if (ids.length === 0) {
            return Response.json({ error: 'product_id or product_ids is required' }, { status: 400 });
        }

        // Ensure affiliate_code is either a non-empty string or null
        const affiliateCodeValue = affiliate_code && affiliate_code.trim() ? affiliate_code.trim() : null;

        // Get all product details
        const allProducts = await base44.asServiceRole.entities.Product.filter({});
        const products = allProducts.filter(p => ids.includes(p.id));

        if (products.length === 0) {
            return Response.json({ error: 'No products found' }, { status: 404 });
        }

        // Validate all products have stripe prices
        for (const product of products) {
            if (!product.stripe_price_id) {
                return Response.json({ 
                    error: `No Stripe price configured for product: ${product.name}` 
                }, { status: 400 });
            }
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

        // Check if any product is recurring/subscription
        let mode = 'payment';
        const hasRecurring = products.some(p => p.type === 'subscription');
        if (hasRecurring) {
            mode = 'subscription';
        }

        // Build line items for all products
        const line_items = products.map(product => ({
            price: product.stripe_price_id,
            quantity: 1,
        }));

        // Create checkout session
        const sessionConfig = {
            customer: customer.id,
            mode: mode,
            line_items: line_items,
            success_url: `${req.headers.get('origin')}/PurchaseSuccess?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${req.headers.get('origin')}/Cart`,
            metadata: {
                user_id: user.id,
                product_ids: products.map(p => p.id).join(','),
                product_keys: products.map(p => p.key).join(','),
                product_names: products.map(p => p.name).join('; '),
                affiliate_code: affiliateCodeValue || '',
            },
        };
        
        // Only set client_reference_id if affiliate_code is provided and non-empty
        if (affiliateCodeValue) {
            sessionConfig.client_reference_id = affiliateCodeValue;
        }
        
        const session = await stripe.checkout.sessions.create(sessionConfig);

        return Response.json({
            url: session.url,
            session_id: session.id,
        });

    } catch (error) {
        console.error('createProductCheckout error:', error);
        return Response.json({ error: error.message }, { status: 500 });
    }
});