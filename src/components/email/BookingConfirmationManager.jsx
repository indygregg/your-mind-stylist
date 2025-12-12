import React from "react";

export default function BookingConfirmationManager({ booking }) {
  const formatAmount = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount / 100);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif", maxWidth: "600px", margin: "0 auto", backgroundColor: "#F9F5EF" }}>
      {/* Header */}
      <div style={{ backgroundColor: "#1E3A32", padding: "40px 20px", textAlign: "center" }}>
        <h1 style={{ color: "#F9F5EF", fontFamily: "Georgia, serif", fontSize: "28px", margin: "0 0 10px 0" }}>
          New Booking Received
        </h1>
        <p style={{ color: "#D8B46B", fontSize: "14px", letterSpacing: "2px", textTransform: "uppercase", margin: 0 }}>
          Manager Notification
        </p>
      </div>

      {/* Content */}
      <div style={{ backgroundColor: "#FFFFFF", padding: "40px 30px" }}>
        <p style={{ color: "#2B2725", fontSize: "16px", lineHeight: "1.6", marginTop: 0 }}>
          Hi Roberta,
        </p>

        <p style={{ color: "#2B2725", fontSize: "16px", lineHeight: "1.6" }}>
          You have a new confirmed booking for private Mind Styling sessions.
        </p>

        {/* Client Details */}
        <div style={{ backgroundColor: "#F9F5EF", border: "2px solid #D8B46B", padding: "25px", marginTop: "30px", marginBottom: "30px" }}>
          <h2 style={{ color: "#1E3A32", fontFamily: "Georgia, serif", fontSize: "20px", marginTop: 0, marginBottom: "20px" }}>
            Client Information
          </h2>
          
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <tbody>
              <tr>
                <td style={{ padding: "8px 0", color: "#2B2725", fontSize: "14px", opacity: 0.7 }}>Name:</td>
                <td style={{ padding: "8px 0", color: "#1E3A32", fontSize: "14px", fontWeight: "600", textAlign: "right" }}>
                  {booking.user_name}
                </td>
              </tr>
              <tr>
                <td style={{ padding: "8px 0", color: "#2B2725", fontSize: "14px", opacity: 0.7 }}>Email:</td>
                <td style={{ padding: "8px 0", color: "#1E3A32", fontSize: "14px", fontWeight: "600", textAlign: "right" }}>
                  <a href={`mailto:${booking.user_email}`} style={{ color: "#1E3A32", textDecoration: "none" }}>
                    {booking.user_email}
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Booking Details */}
        <div style={{ backgroundColor: "#F9F5EF", border: "1px solid #E4D9C4", padding: "25px", marginBottom: "30px" }}>
          <h2 style={{ color: "#1E3A32", fontFamily: "Georgia, serif", fontSize: "18px", marginTop: 0, marginBottom: "20px" }}>
            Booking Details
          </h2>
          
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <tbody>
              <tr>
                <td style={{ padding: "8px 0", color: "#2B2725", fontSize: "14px", opacity: 0.7 }}>Service:</td>
                <td style={{ padding: "8px 0", color: "#1E3A32", fontSize: "14px", fontWeight: "600", textAlign: "right" }}>
                  {booking.service_type?.replace(/_/g, " ").toUpperCase()}
                </td>
              </tr>
              {booking.session_count && (
                <tr>
                  <td style={{ padding: "8px 0", color: "#2B2725", fontSize: "14px", opacity: 0.7 }}>Sessions:</td>
                  <td style={{ padding: "8px 0", color: "#1E3A32", fontSize: "14px", fontWeight: "600", textAlign: "right" }}>
                    {booking.session_count}
                  </td>
                </tr>
              )}
              <tr>
                <td style={{ padding: "8px 0", color: "#2B2725", fontSize: "14px", opacity: 0.7 }}>Amount Paid:</td>
                <td style={{ padding: "8px 0", color: "#1E3A32", fontSize: "16px", fontWeight: "700", textAlign: "right" }}>
                  {formatAmount(booking.amount)}
                </td>
              </tr>
              <tr>
                <td style={{ padding: "8px 0", color: "#2B2725", fontSize: "14px", opacity: 0.7 }}>Payment Status:</td>
                <td style={{ padding: "8px 0", textAlign: "right" }}>
                  <span style={{ backgroundColor: "#A6B7A3", color: "#FFFFFF", padding: "4px 12px", borderRadius: "4px", fontSize: "12px", fontWeight: "600" }}>
                    PAID
                  </span>
                </td>
              </tr>
              <tr>
                <td style={{ padding: "8px 0", color: "#2B2725", fontSize: "14px", opacity: 0.7 }}>Booking Date:</td>
                <td style={{ padding: "8px 0", color: "#1E3A32", fontSize: "14px", fontWeight: "600", textAlign: "right" }}>
                  {formatDate(booking.created_date)}
                </td>
              </tr>
              {booking.stripe_payment_intent_id && (
                <tr>
                  <td style={{ padding: "8px 0", color: "#2B2725", fontSize: "14px", opacity: 0.7 }}>Payment ID:</td>
                  <td style={{ padding: "8px 0", color: "#2B2725", fontSize: "12px", fontFamily: "monospace", textAlign: "right", opacity: 0.6 }}>
                    {booking.stripe_payment_intent_id.substring(0, 20)}...
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Client Notes */}
        {booking.notes && (
          <div style={{ backgroundColor: "#FFF9F0", padding: "20px", marginBottom: "30px", borderLeft: "4px solid #D8B46B" }}>
            <p style={{ color: "#2B2725", fontSize: "14px", margin: "0 0 8px 0", fontWeight: "600" }}>Client Notes:</p>
            <p style={{ color: "#2B2725", fontSize: "14px", lineHeight: "1.6", margin: 0 }}>
              {booking.notes}
            </p>
          </div>
        )}

        {/* Action Items */}
        <div style={{ backgroundColor: "#F9F5EF", padding: "25px", marginBottom: "20px" }}>
          <h3 style={{ color: "#1E3A32", fontFamily: "Georgia, serif", fontSize: "18px", marginTop: 0, marginBottom: "15px" }}>
            Next Steps
          </h3>
          <ul style={{ color: "#2B2725", fontSize: "14px", lineHeight: "1.8", paddingLeft: "20px", margin: 0 }}>
            <li>Review client information and any notes provided</li>
            <li>Reach out within 24-48 hours to schedule the first session</li>
            <li>Confirm time zone and preferred meeting method (Zoom/in-person)</li>
          </ul>
        </div>

        {/* CTA Button */}
        <div style={{ textAlign: "center", marginTop: "30px" }}>
          <a 
            href={`https://yourmindstylist.com${booking.id ? `?booking=${booking.id}` : ''}`}
            style={{ 
              display: "inline-block",
              backgroundColor: "#1E3A32", 
              color: "#F9F5EF", 
              padding: "14px 32px", 
              textDecoration: "none", 
              fontSize: "14px",
              fontWeight: "600",
              letterSpacing: "1px",
              textTransform: "uppercase"
            }}
          >
            View in Dashboard
          </a>
        </div>
      </div>

      {/* Footer */}
      <div style={{ backgroundColor: "#F9F5EF", padding: "30px 20px", textAlign: "center", borderTop: "1px solid #E4D9C4" }}>
        <p style={{ color: "#2B2725", fontSize: "12px", opacity: 0.6, margin: 0 }}>
          This is an automated notification from Your Mind Stylist booking system.
        </p>
      </div>
    </div>
  );
}