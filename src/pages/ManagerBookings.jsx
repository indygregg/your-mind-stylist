import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Calendar, DollarSign, Mail, Phone, User, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function ManagerBookings() {
  const [selectedBooking, setSelectedBooking] = useState(null);

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ["manager-bookings"],
    queryFn: () => base44.entities.Booking.list("-created_date"),
  });

  const getStatusColor = (status) => {
    const colors = {
      pending_payment: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-green-100 text-green-800",
      scheduled: "bg-blue-100 text-blue-800",
      completed: "bg-gray-100 text-gray-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getPaymentStatusIcon = (status) => {
    switch (status) {
      case "paid":
        return <CheckCircle size={16} className="text-green-600" />;
      case "failed":
        return <XCircle size={16} className="text-red-600" />;
      case "refunded":
        return <AlertCircle size={16} className="text-orange-600" />;
      default:
        return <Clock size={16} className="text-yellow-600" />;
    }
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount / 100);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F9F5EF] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1E3A32] mx-auto mb-4"></div>
          <p className="text-[#2B2725]/70">Loading bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F5EF] py-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="font-serif text-4xl text-[#1E3A32] mb-3">
            Bookings & Payments
          </h1>
          <p className="text-[#2B2725]/70 text-lg">
            Manage all private session bookings and payment status
          </p>
        </motion.div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6">
            <div className="flex items-center justify-between mb-2">
              <Calendar className="text-[#D8B46B]" size={24} />
              <span className="text-2xl font-serif text-[#1E3A32]">
                {bookings.filter((b) => b.booking_status === "confirmed").length}
              </span>
            </div>
            <p className="text-sm text-[#2B2725]/70">Confirmed Bookings</p>
          </div>

          <div className="bg-white p-6">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="text-[#A6B7A3]" size={24} />
              <span className="text-2xl font-serif text-[#1E3A32]">
                {formatAmount(
                  bookings
                    .filter((b) => b.payment_status === "paid")
                    .reduce((sum, b) => sum + (b.amount || 0), 0)
                )}
              </span>
            </div>
            <p className="text-sm text-[#2B2725]/70">Total Revenue</p>
          </div>

          <div className="bg-white p-6">
            <div className="flex items-center justify-between mb-2">
              <Clock className="text-[#6E4F7D]" size={24} />
              <span className="text-2xl font-serif text-[#1E3A32]">
                {bookings.filter((b) => b.booking_status === "pending_payment").length}
              </span>
            </div>
            <p className="text-sm text-[#2B2725]/70">Pending Payment</p>
          </div>

          <div className="bg-white p-6">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="text-[#1E3A32]" size={24} />
              <span className="text-2xl font-serif text-[#1E3A32]">
                {bookings.filter((b) => b.booking_status === "completed").length}
              </span>
            </div>
            <p className="text-sm text-[#2B2725]/70">Completed</p>
          </div>
        </div>

        {/* Bookings Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white shadow-sm overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#F9F5EF] border-b border-[#E4D9C4]">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-[#1E3A32]">
                    Client
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-[#1E3A32]">
                    Service
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-[#1E3A32]">
                    Sessions
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-[#1E3A32]">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-[#1E3A32]">
                    Payment
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-[#1E3A32]">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-[#1E3A32]">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E4D9C4]">
                {bookings.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center text-[#2B2725]/50">
                      No bookings yet
                    </td>
                  </tr>
                ) : (
                  bookings.map((booking) => (
                    <tr
                      key={booking.id}
                      onClick={() => setSelectedBooking(booking)}
                      className="hover:bg-[#F9F5EF]/50 cursor-pointer transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-medium text-[#1E3A32]">
                            {booking.user_name}
                          </p>
                          <p className="text-xs text-[#2B2725]/60">{booking.user_email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-[#2B2725]">
                          {booking.service_type?.replace("_", " ").toUpperCase()}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-[#2B2725]">{booking.session_count || "N/A"}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-[#1E3A32]">
                          {formatAmount(booking.amount)}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {getPaymentStatusIcon(booking.payment_status)}
                          <span className="text-sm text-[#2B2725] capitalize">
                            {booking.payment_status}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge className={getStatusColor(booking.booking_status)}>
                          {booking.booking_status?.replace("_", " ")}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-[#2B2725]/70">
                          {format(new Date(booking.created_date), "MMM d, yyyy")}
                        </p>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Booking Detail Dialog */}
        <Dialog open={!!selectedBooking} onOpenChange={() => setSelectedBooking(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="font-serif text-2xl text-[#1E3A32]">
                Booking Details
              </DialogTitle>
              <DialogDescription>
                Complete information about this booking
              </DialogDescription>
            </DialogHeader>

            {selectedBooking && (
              <div className="space-y-6">
                {/* Client Info */}
                <div>
                  <h3 className="text-sm font-medium text-[#2B2725] mb-3 flex items-center gap-2">
                    <User size={16} className="text-[#D8B46B]" />
                    Client Information
                  </h3>
                  <div className="bg-[#F9F5EF] p-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-[#2B2725]/70">Name:</span>
                      <span className="text-sm font-medium text-[#1E3A32]">
                        {selectedBooking.user_name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-[#2B2725]/70">Email:</span>
                      <span className="text-sm font-medium text-[#1E3A32]">
                        {selectedBooking.user_email}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Booking Details */}
                <div>
                  <h3 className="text-sm font-medium text-[#2B2725] mb-3 flex items-center gap-2">
                    <Calendar size={16} className="text-[#A6B7A3]" />
                    Booking Details
                  </h3>
                  <div className="bg-[#F9F5EF] p-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-[#2B2725]/70">Service Type:</span>
                      <span className="text-sm font-medium text-[#1E3A32]">
                        {selectedBooking.service_type?.replace("_", " ").toUpperCase()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-[#2B2725]/70">Sessions:</span>
                      <span className="text-sm font-medium text-[#1E3A32]">
                        {selectedBooking.session_count || "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-[#2B2725]/70">Status:</span>
                      <Badge className={getStatusColor(selectedBooking.booking_status)}>
                        {selectedBooking.booking_status?.replace("_", " ")}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-[#2B2725]/70">Created:</span>
                      <span className="text-sm font-medium text-[#1E3A32]">
                        {format(new Date(selectedBooking.created_date), "PPpp")}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Payment Info */}
                <div>
                  <h3 className="text-sm font-medium text-[#2B2725] mb-3 flex items-center gap-2">
                    <DollarSign size={16} className="text-[#6E4F7D]" />
                    Payment Information
                  </h3>
                  <div className="bg-[#F9F5EF] p-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-[#2B2725]/70">Amount:</span>
                      <span className="text-sm font-medium text-[#1E3A32]">
                        {formatAmount(selectedBooking.amount)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-[#2B2725]/70">Payment Status:</span>
                      <div className="flex items-center gap-2">
                        {getPaymentStatusIcon(selectedBooking.payment_status)}
                        <span className="text-sm font-medium text-[#1E3A32] capitalize">
                          {selectedBooking.payment_status}
                        </span>
                      </div>
                    </div>
                    {selectedBooking.stripe_checkout_session_id && (
                      <div className="flex justify-between">
                        <span className="text-sm text-[#2B2725]/70">Stripe Session:</span>
                        <span className="text-xs font-mono text-[#2B2725]/60">
                          {selectedBooking.stripe_checkout_session_id.substring(0, 20)}...
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Notes */}
                {selectedBooking.notes && (
                  <div>
                    <h3 className="text-sm font-medium text-[#2B2725] mb-3">Client Notes</h3>
                    <div className="bg-[#F9F5EF] p-4">
                      <p className="text-sm text-[#2B2725]">{selectedBooking.notes}</p>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t border-[#E4D9C4]">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      window.location.href = `mailto:${selectedBooking.user_email}`;
                    }}
                  >
                    <Mail size={16} className="mr-2" />
                    Email Client
                  </Button>
                  <Button
                    className="flex-1 bg-[#1E3A32] hover:bg-[#2B2725]"
                    onClick={() => setSelectedBooking(null)}
                  >
                    Close
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}