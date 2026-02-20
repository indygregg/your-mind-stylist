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

        // Check if selected price is recurring (payment plan)
        let mode = 'payment';
        let subscriptionData = null;
        
        if (selected_price_id) {
            const priceDetails = await stripe.prices.retrieve(selected_price_id);
            if (priceDetails.recurring) {
                mode = 'subscription';
                
                // If payment plan, set billing cycle count to auto-cancel after X months
                if (priceDetails.metadata.payment_plan === 'true' && priceDetails.metadata.total_months) {
                    const totalMonths = parseInt(priceDetails.metadata.total_months);
                    subscriptionData = {
                        metadata: {
                            payment_plan: 'true',
                            plan_name: priceDetails.metadata.plan_name,
                            total_months: totalMonths.toString(),
                            product_id: product.id,
                        },
                        // Auto-cancel after total_months
                        cancel_at: Math.floor(Date.now() / 1000) + (totalMonths * 30 * 24 * 60 * 60), // Approximate
                    };
                }
            }
        } else if (product.type === 'subscription') {
            mode = 'subscription';
        }

        // Create checkout session
        const sessionConfig = {
            customer: customer.id,
            mode: mode,
            line_items: [
                {
                    price: stripePriceId,
                    quantity: 1,
                },
            ],
            success_url: `${req.headers.get('origin')}/PurchaseSuccess?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${req.headers.get('origin')}/ProgramsCourses`,
            metadata: {
                user_id: user.id,
                product_id: product.id,
                product_key: product.key,
                product_name: product.name,
                selected_price_id: stripePriceId,
                is_payment_plan: selected_price_id ? 'true' : 'false',
                affiliate_code: affiliateCodeValue || '',
            },
        };
        
        // Only set client_reference_id if affiliate_code is provided and non-empty
        if (affiliateCodeValue) {
            sessionConfig.client_reference_id = affiliateCodeValue;
        }
        
        // Add subscription_data if payment plan
        if (subscriptionData) {
            sessionConfig.subscription_data = subscriptionData;
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