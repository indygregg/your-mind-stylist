import React, { useState, useMemo } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calendar, ChevronLeft, ChevronRight, Video, Mail, Phone, Clock, DollarSign, ExternalLink } from "lucide-react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, startOfWeek, endOfWeek, isToday } from "date-fns";

export default function ManagerCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedBooking, setSelectedBooking] = useState(null);

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ["bookings"],
    queryFn: () => base44.entities.Booking.list("-scheduled_date"),
  });

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const bookingsByDate = useMemo(() => {
    const map = {};
    bookings.forEach((booking) => {
      if (booking.scheduled_date) {
        const dateKey = format(new Date(booking.scheduled_date), "yyyy-MM-dd");
        if (!map[dateKey]) map[dateKey] = [];
        map[dateKey].push(booking);
      }
    });
    return map;
  }, [bookings]);

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
          <p className="text-[#2B2725]/70">Loading calendar...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F5EF] py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="font-serif text-4xl text-[#1E3A32] mb-2">Booking Calendar</h1>
            <p className="text-[#2B2725]/70">View and manage all scheduled appointments</p>
          </div>
        </div>

        {/* Calendar Navigation */}
        <div className="bg-white p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentDate(subMonths(currentDate, 1))}
            >
              <ChevronLeft size={20} />
            </Button>
            <h2 className="font-serif text-2xl text-[#1E3A32]">
              {format(currentDate, "MMMM yyyy")}
            </h2>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentDate(addMonths(currentDate, 1))}
            >
              <ChevronRight size={20} />
            </Button>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2">
            {/* Day Headers */}
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="text-center font-medium text-[#2B2725]/70 text-sm py-2">
                {day}
              </div>
            ))}

            {/* Calendar Days */}
            {calendarDays.map((day) => {
              const dateKey = format(day, "yyyy-MM-dd");
              const dayBookings = bookingsByDate[dateKey] || [];
              const isCurrentMonth = isSameMonth(day, currentDate);
              const isCurrentDay = isToday(day);

              return (
                <motion.div
                  key={day.toISOString()}
                  whileHover={{ scale: 1.02 }}
                  className={`min-h-[120px] p-2 border transition-colors ${
                    isCurrentMonth ? "bg-white" : "bg-gray-50"
                  } ${isCurrentDay ? "border-[#D8B46B] border-2" : "border-[#E4D9C4]"}`}
                >
                  <div
                    className={`text-sm font-medium mb-2 ${
                      isCurrentMonth ? "text-[#2B2725]" : "text-[#2B2725]/40"
                    } ${isCurrentDay ? "text-[#D8B46B] font-bold" : ""}`}
                  >
                    {format(day, "d")}
                  </div>
                  <div className="space-y-1">
                    {dayBookings.map((booking) => (
                      <button
                        key={booking.id}
                        onClick={() => setSelectedBooking(booking)}
                        className="w-full text-left px-2 py-1 bg-[#1E3A32]/10 hover:bg-[#1E3A32]/20 transition-colors text-xs"
                      >
                        <div className="font-medium text-[#1E3A32] truncate">
                          {booking.user_name}
                        </div>
                        <div className="text-[#2B2725]/60 text-[10px]">
                          {booking.scheduled_date && format(new Date(booking.scheduled_date), "h:mm a")}
                        </div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Booking Details Modal */}
        <Dialog open={!!selectedBooking} onOpenChange={() => setSelectedBooking(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Booking Details</DialogTitle>
            </DialogHeader>
            {selectedBooking && (
              <div className="space-y-6">
                {/* Status Badge */}
                <div className="flex items-center gap-3">
                  <Badge className={getStatusColor(selectedBooking.booking_status)}>
                    {selectedBooking.booking_status?.replace(/_/g, " ").toUpperCase()}
                  </Badge>
                  <Badge className={getStatusColor(selectedBooking.payment_status)}>
                    Payment: {selectedBooking.payment_status?.toUpperCase()}
                  </Badge>
                </div>

                {/* Client Info */}
                <div className="bg-[#F9F5EF] p-4">
                  <h3 className="font-medium text-[#1E3A32] mb-3">Client Information</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-[#2B2725]/60 w-24">Name:</span>
                      <span className="text-[#1E3A32] font-medium">{selectedBooking.user_name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail size={14} className="text-[#D8B46B]" />
                      <a href={`mailto:${selectedBooking.user_email}`} className="text-[#1E3A32] hover:text-[#D8B46B]">
                        {selectedBooking.user_email}
                      </a>
                    </div>
                  </div>
                </div>

                {/* Booking Details */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Clock size={16} className="text-[#A6B7A3]" />
                    <div>
                      <div className="text-sm text-[#2B2725]/60">Scheduled</div>
                      <div className="font-medium text-[#1E3A32]">
                        {selectedBooking.scheduled_date
                          ? format(new Date(selectedBooking.scheduled_date), "EEEE, MMMM d, yyyy 'at' h:mm a")
                          : "Not scheduled yet"}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <DollarSign size={16} className="text-[#D8B46B]" />
                    <div>
                      <div className="text-sm text-[#2B2725]/60">Amount</div>
                      <div className="font-medium text-[#1E3A32]">{formatAmount(selectedBooking.amount)}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-sm text-[#2B2725]/60 w-24">Service:</span>
                    <span className="text-[#1E3A32] font-medium">
                      {selectedBooking.service_type?.replace(/_/g, " ").toUpperCase()}
                    </span>
                  </div>
                  {selectedBooking.session_count > 1 && (
                    <div className="flex items-start gap-3">
                      <span className="text-sm text-[#2B2725]/60 w-24">Sessions:</span>
                      <span className="text-[#1E3A32]">{selectedBooking.session_count}</span>
                    </div>
                  )}
                </div>

                {/* Zoom Meeting Info */}
                {selectedBooking.zoom_status === "created" && (
                  <div className="bg-[#E8F4FD] p-4 border border-[#2D8CFF]">
                    <div className="flex items-center gap-2 mb-3">
                      <Video size={18} className="text-[#2D8CFF]" />
                      <h3 className="font-medium text-[#1E3A32]">Zoom Meeting</h3>
                    </div>
                    <div className="space-y-2">
                      {selectedBooking.zoom_start_url && (
                        <div>
                          <div className="text-xs text-[#2B2725]/60 mb-1">Host Start URL:</div>
                          <a
                            href={selectedBooking.zoom_start_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-[#2D8CFF] hover:underline flex items-center gap-1"
                          >
                            Start Meeting <ExternalLink size={12} />
                          </a>
                        </div>
                      )}
                      {selectedBooking.zoom_join_url && (
                        <div>
                          <div className="text-xs text-[#2B2725]/60 mb-1">Client Join URL:</div>
                          <a
                            href={selectedBooking.zoom_join_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-[#2D8CFF] hover:underline flex items-center gap-1"
                          >
                            Join Meeting <ExternalLink size={12} />
                          </a>
                        </div>
                      )}
                      {selectedBooking.zoom_password && (
                        <div>
                          <div className="text-xs text-[#2B2725]/60 mb-1">Password:</div>
                          <code className="text-sm bg-white px-2 py-1 font-mono">
                            {selectedBooking.zoom_password}
                          </code>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Client Notes */}
                {selectedBooking.notes && (
                  <div className="bg-[#FFF9F0] p-4 border-l-4 border-[#D8B46B]">
                    <div className="text-sm text-[#2B2725]/60 mb-2">Client Notes:</div>
                    <p className="text-[#2B2725]">{selectedBooking.notes}</p>
                  </div>
                )}

                {/* Metadata */}
                <div className="text-xs text-[#2B2725]/50 space-y-1 pt-4 border-t border-[#E4D9C4]">
                  <div>Booking ID: {selectedBooking.id}</div>
                  <div>Created: {format(new Date(selectedBooking.created_date), "PPpp")}</div>
                  {selectedBooking.stripe_checkout_session_id && (
                    <div>Stripe Session: {selectedBooking.stripe_checkout_session_id}</div>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Upcoming Bookings List */}
        <div className="bg-white p-6">
          <h2 className="font-serif text-2xl text-[#1E3A32] mb-6">Upcoming Bookings</h2>
          <div className="space-y-3">
            {bookings
              .filter((b) => b.scheduled_date && new Date(b.scheduled_date) > new Date())
              .slice(0, 10)
              .map((booking) => (
                <button
                  key={booking.id}
                  onClick={() => setSelectedBooking(booking)}
                  className="w-full text-left p-4 bg-[#F9F5EF] hover:bg-[#E4D9C4] transition-colors flex items-center justify-between"
                >
                  <div>
                    <div className="font-medium text-[#1E3A32] mb-1">{booking.user_name}</div>
                    <div className="text-sm text-[#2B2725]/70">
                      {format(new Date(booking.scheduled_date), "EEEE, MMMM d 'at' h:mm a")}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {booking.zoom_status === "created" && (
                      <Video size={16} className="text-[#2D8CFF]" />
                    )}
                    <Badge className={getStatusColor(booking.booking_status)}>
                      {booking.booking_status?.replace(/_/g, " ")}
                    </Badge>
                  </div>
                </button>
              ))}
            {bookings.filter((b) => b.scheduled_date && new Date(b.scheduled_date) > new Date()).length === 0 && (
              <div className="text-center py-12 text-[#2B2725]/50">
                No upcoming bookings scheduled
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}