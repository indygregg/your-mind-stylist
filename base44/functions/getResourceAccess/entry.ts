import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    const { resource_id } = await req.json();

    if (!resource_id) {
      return Response.json({ error: 'resource_id is required' }, { status: 400 });
    }

    // Get the resource
    const resource = await base44.entities.Resource.get(resource_id);
    if (!resource) {
      return Response.json({ error: 'Resource not found' }, { status: 404 });
    }

    // Public resources - always accessible
    if (resource.access_level === 'public') {
      return Response.json({
        hasAccess: true,
        file_url: resource.file_url,
        resource_id: resource.id
      });
    }

    // Authenticated resources - only for logged-in users
    if (resource.access_level === 'authenticated') {
      if (!user) {
        return Response.json({ error: 'Authentication required' }, { status: 401 });
      }
      return Response.json({
        hasAccess: true,
        file_url: resource.file_url,
        resource_id: resource.id
      });
    }

    // Product-gated resources - verify ownership
    if (resource.access_level === 'product_gated') {
      if (!user) {
        return Response.json({ error: 'Authentication required' }, { status: 401 });
      }

      if (!resource.product_ids || resource.product_ids.length === 0) {
        return Response.json({ error: 'Resource misconfigured' }, { status: 500 });
      }

      let hasAccess = false;

      // Check 1: Direct product ownership via purchased_product_ids on User
      const userRecord = await base44.asServiceRole.entities.User.get(user.id);
      const purchasedIds = userRecord?.purchased_product_ids || [];
      if (purchasedIds.length > 0) {
        // Check if user purchased any product that gates this resource
        for (const productId of resource.product_ids) {
          if (purchasedIds.includes(productId)) {
            hasAccess = true;
            break;
          }
        }
        // Also check if user purchased any product whose purchase_options reference this resource
        if (!hasAccess) {
          const allProducts = await base44.asServiceRole.entities.Product.filter({});
          for (const product of allProducts) {
            if (!purchasedIds.includes(product.id)) continue;
            // Check if this product has purchase_options with digital_resource_id matching this resource
            if (product.purchase_options?.length > 0) {
              for (const opt of product.purchase_options) {
                if (opt.digital_resource_id === resource.id) {
                  hasAccess = true;
                  break;
                }
              }
            }
            // Check if this is a parent product with variants the user purchased
            if (!hasAccess && product.purchase_options?.length > 0) {
              for (const opt of product.purchase_options) {
                const variantId = opt.bundle_product_id || opt.product_id;
                if (variantId && purchasedIds.includes(variantId) && opt.digital_resource_id === resource.id) {
                  hasAccess = true;
                  break;
                }
              }
            }
            if (hasAccess) break;
          }
        }
      }

      // Check 2: Course enrollment via access_grants (existing logic)
      if (!hasAccess) {
        const productsToCheck = await base44.asServiceRole.entities.Product.filter({
          id: { $in: resource.product_ids }
        });

        for (const product of productsToCheck) {
          if (product.access_grants && product.access_grants.length > 0) {
            const userProgress = await base44.entities.UserCourseProgress.filter({
              user_id: user.id,
              course_id: { $in: product.access_grants }
            });
            if (userProgress.length > 0) {
              hasAccess = true;
              break;
            }
          }
        }
      }

      if (!hasAccess) {
        return Response.json({ 
          error: 'Access denied. This resource requires a paid product.',
          hasAccess: false
        }, { status: 403 });
      }

      return Response.json({
        hasAccess: true,
        file_url: resource.file_url,
        resource_id: resource.id
      });
    }

    return Response.json({ error: 'Invalid access level' }, { status: 500 });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});