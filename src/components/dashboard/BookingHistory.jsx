import React from "react";
import { motion } from "framer-motion";
import { Calendar, CheckCircle, XCircle, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export default function BookingHistory({ bookings }) {
  if (!bookings || bookings.length === 0) {
    return (
      <div className="bg-white p-8 text-center">
        <Calendar size={48} className="text-[#2B2725]/20 mx-auto mb-4" />
        <p className="text-[#2B2725]/60">No booking history yet</p>
      </div>
    );
  }

  const getStatusIcon = (status) => {
    switch(status) {
      case 'completed':
        return <CheckCircle size={16} className="text-[#A6B7A3]" />;
      case 'cancelled':
        return <XCircle size={16} className="text-red-500" />;
      case 'expired':
        return <Clock size={16} className="text-[#2B2725]/40" />;
      default:
        return <Calendar size={16} className="text-[#2B2725]/60" />;
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      completed: 'bg-[#A6B7A3]/30 text-[#1E3A32]',
      cancelled: 'bg-red-100 text-red-800',
      expired: 'bg-[#2B2725]/10 text-[#2B2725]',
      confirmed: 'bg-blue-100 text-blue-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount / 100);
  };

  return (
    <div className="space-y-3">
      {bookings.map((booking) => (
        <motion.div
          key={booking.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-4 hover:bg-[#F9F5EF] transition-colors"
        >
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                {getStatusIcon(booking.booking_status)}
                <h4 className="font-medium text-[#1E3A32]">
                  {booking.service_type?.replace(/_/g, ' ').toUpperCase()}
                </h4>
              </div>
              <div className="flex items-center gap-4 text-sm text-[#2B2725]/70">
                <span>
                  {booking.scheduled_date 
                    ? format(new Date(booking.scheduled_date), 'MMM d, yyyy')
                    : format(new Date(booking.created_date), 'MMM d, yyyy')}
                </span>
                <span>{formatAmount(booking.amount)}</span>
                {booking.session_count > 1 && (
                  <span>{booking.session_count} sessions</span>
                )}
              </div>
            </div>
            <Badge className={getStatusColor(booking.booking_status)}>
              {booking.booking_status?.replace(/_/g, ' ')}
            </Badge>
          </div>
        </motion.div>
      ))}
    </div>
  );
}