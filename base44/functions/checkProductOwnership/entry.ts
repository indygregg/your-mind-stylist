import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { product_key } = await req.json();

    if (!product_key) {
      return Response.json({ error: 'product_key is required' }, { status: 400 });
    }

    // Get the product
    const products = await base44.entities.Product.filter({ key: product_key });
    if (!products || products.length === 0) {
      return Response.json({ 
        owns_product: false, 
        product_found: false 
      });
    }

    const product = products[0];

    // Check if product has related course/webinar access grants
    let hasAccess = false;
    let accessDetails = null;

    // Check for course access via related_course_id OR access_grants
    const courseIdsToCheck = [];
    if (product.related_course_id) courseIdsToCheck.push(product.related_course_id);
    if (product.access_grants?.length > 0) courseIdsToCheck.push(...product.access_grants);

    for (const courseId of courseIdsToCheck) {
      const courseProgress = await base44.entities.UserCourseProgress.filter({
        user_id: user.id,
        course_id: courseId
      });
      if (courseProgress.length > 0) {
        hasAccess = true;
        accessDetails = {
          type: 'course',
          id: courseId,
          link: `CoursePage?id=${courseId}`
        };
        break;
      }
    }

    // Check for webinar access
    if (!hasAccess && product.related_webinar_id) {
      const webinarAccess = await base44.entities.UserWebinarAccess.filter({
        user_email: user.email,
        webinar_id: product.related_webinar_id
      });
      
      if (webinarAccess.length > 0) {
        hasAccess = true;
        accessDetails = {
          type: 'webinar',
          id: product.related_webinar_id,
          link: `WebinarPage?id=${product.related_webinar_id}`
        };
      }
    }

    // Check for active subscription (for Pocket Visualization)
    if (!hasAccess && product.key === 'pocket-visualization') {
      // Check if user has active subscription via Stripe
      // This would be tracked in user data or a subscription entity
      if (user.pocket_visualization_active) {
        hasAccess = true;
        accessDetails = {
          type: 'subscription',
          link: 'StylePauses'
        };
      }
    }

    // Check for bookings (for consultation/certification products)
    if (!hasAccess && ['consultation', 'certification', 'private_sessions'].includes(product.type)) {
      const bookings = await base44.entities.Booking.filter({
        user_email: user.email,
        booking_status: 'confirmed'
      });
      
      if (bookings.length > 0) {
        hasAccess = true;
        accessDetails = {
          type: 'booking',
          link: 'ClientBookings'
        };
      }
    }

    return Response.json({
      owns_product: hasAccess,
      product_found: true,
      product_name: product.name,
      access_details: accessDetails
    });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});