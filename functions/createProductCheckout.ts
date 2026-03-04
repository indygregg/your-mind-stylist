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

        const { product_id, product_ids, selected_price_id, affiliate_code, gift_code } = await req.json();

        // Support both single and multiple products
        const ids = product_ids || (product_id ? [product_id] : []);
        
        if (ids.length === 0) {
            return Response.json({ error: 'product_id or product_ids is required' }, { status: 400 });
        }

        // Ensure affiliate_code is either a non-empty string or null
        const affiliateCodeValue = affiliate_code && affiliate_code.trim() ? affiliate_code.trim() : null;

        // Get product details for only the requested IDs
        const productPromises = ids.map(id => base44.asServiceRole.entities.Product.get(id));
        const products = await Promise.all(productPromises);

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
                    product_key: products[0].key,
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

        // Handle gift code discount
        let giftCodeRecord = null;
        let discountConfig = {};
        if (gift_code) {
            const giftCodes = await base44.asServiceRole.entities.GiftCode.filter({ code: gift_code.toUpperCase() });
            const gc = giftCodes[0];
            if (gc && gc.is_active && gc.discount_percentage) {
                giftCodeRecord = gc;

                // If 100% off, skip Stripe entirely and fulfill directly
                if (gc.discount_percentage === 100) {
                    // Mark code as used
                    await base44.asServiceRole.entities.GiftCode.update(gc.id, {
                        times_used: (gc.times_used || 0) + 1,
                        is_active: gc.is_single_use ? false : gc.is_active,
                    });

                    // Grant access: create a pseudo-purchase record for each product
                    for (const product of products) {
                        // Grant course access if product has a related_course_id
                        if (product.related_course_id) {
                            const existing = await base44.asServiceRole.entities.UserCourseProgress.filter({
                                user_id: user.id,
                                course_id: product.related_course_id,
                            });
                            if (existing.length === 0) {
                                await base44.asServiceRole.entities.UserCourseProgress.create({
                                    user_id: user.id,
                                    course_id: product.related_course_id,
                                    status: 'not_started',
                                    completion_percentage: 0,
                                });
                            }
                        }
                    }

                    const origin = req.headers.get('origin') || 'https://yourmindstylist.com';
                    return Response.json({
                        url: `${origin}/PurchaseSuccess?gift=true&product_ids=${products.map(p => p.id).join(',')}`,
                        session_id: null,
                        free: true,
                    });
                }

                // Partial discount — create a Stripe coupon
                const coupon = await stripe.coupons.create({
                    percent_off: gc.discount_percentage,
                    duration: 'once',
                    name: `Gift Code: ${gift_code}`,
                });
                discountConfig = { discounts: [{ coupon: coupon.id }] };

                // Mark code as used
                await base44.asServiceRole.entities.GiftCode.update(gc.id, {
                    times_used: (gc.times_used || 0) + 1,
                    is_active: gc.is_single_use ? false : gc.is_active,
                });
            }
        }

        const origin = req.headers.get('origin') || 'https://yourmindstylist.com';

        // Create checkout session
        const sessionConfig = {
            customer: customer.id,
            mode: mode,
            line_items: line_items,
            success_url: `${origin}/PurchaseSuccess?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${origin}/Cart`,
            metadata: {
                user_id: user.id,
                product_ids: products.map(p => p.id).join(','),
                product_keys: products.map(p => p.key).join(','),
                product_names: products.map(p => p.name).join('; '),
                affiliate_code: affiliateCodeValue || '',
                gift_code: gift_code || '',
            },
            ...discountConfig,
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