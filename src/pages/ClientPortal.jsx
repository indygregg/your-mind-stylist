import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  CreditCard, 
  FileText, 
  BookOpen, 
  Video,
  Download,
  Lock,
  CheckCircle,
  DollarSign,
  ExternalLink
} from "lucide-react";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { createPageUrl } from "../utils";

export default function ClientPortal() {
  if (typeof window !== 'undefined') {
    window.__USE_AUTH_LAYOUT = true;
  }

  const { data: user } = useQuery({
    queryKey: ["currentUser"],
    queryFn: () => base44.auth.me(),
  });

  const { data: bookings = [] } = useQuery({
    queryKey: ["myBookings", user?.email],
    queryFn: () => base44.entities.Booking.filter({ user_email: user.email }),
    enabled: !!user,
  });

  const { data: courses = [] } = useQuery({
    queryKey: ["myCourses"],
    queryFn: async () => {
      const progress = await base44.entities.UserCourseProgress.filter({ user_id: user.id });
      const courseIds = progress.map(p => p.course_id);
      if (courseIds.length === 0) return [];
      
      const allCourses = await base44.entities.Course.list();
      return allCourses.filter(c => courseIds.includes(c.id));
    },
    enabled: !!user,
  });

  const { data: webinars = [] } = useQuery({
    queryKey: ["myWebinars"],
    queryFn: async () => {
      const access = await base44.entities.UserWebinarAccess.filter({ user_id: user.id });
      const webinarIds = access.map(a => a.webinar_id);
      if (webinarIds.length === 0) return [];
      
      const allWebinars = await base44.entities.Webinar.list();
      return allWebinars.filter(w => webinarIds.includes(w.id));
    },
    enabled: !!user,
  });

  const completedBookings = bookings.filter(b => 
    b.booking_status === 'completed' && b.session_notes
  );

  const paidBookings = bookings.filter(b => 
    b.payment_status === 'paid'
  ).sort((a, b) => new Date(b.created_date) - new Date(a.created_date));

  const formatAmount = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount / 100);
  };

  const totalSpent = paidBookings.reduce((sum, b) => sum + (b.amount || 0), 0);

  return (
    <div className="min-h-screen bg-[#F9F5EF] py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="font-serif text-4xl text-[#1E3A32] mb-2">Client Portal</h1>
          <p className="text-[#2B2725]/70">Your complete account overview</p>
        </motion.div>

        <Tabs defaultValue="materials" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="materials">
              <BookOpen size={16} className="mr-2" />
              My Materials
            </TabsTrigger>
            <TabsTrigger value="sessions">
              <FileText size={16} className="mr-2" />
              Session Notes
            </TabsTrigger>
            <TabsTrigger value="payments">
              <CreditCard size={16} className="mr-2" />
              Payment History
            </TabsTrigger>
            <TabsTrigger value="bookings">
              <Calendar size={16} className="mr-2" />
              My Bookings
            </TabsTrigger>
          </TabsList>

          {/* Materials Tab */}
          <TabsContent value="materials">
            <div className="space-y-8">
              {/* Courses */}
              {courses.length > 0 && (
                <div>
                  <h2 className="font-serif text-2xl text-[#1E3A32] mb-4">Your Courses</h2>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map((course) => (
                      <Card key={course.id} className="p-6 hover:shadow-lg transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                          <BookOpen size={32} className="text-[#1E3A32]" />
                          <Badge className="bg-green-100 text-green-800">
                            <CheckCircle size={12} className="mr-1" />
                            Enrolled
                          </Badge>
                        </div>
                        <h3 className="font-serif text-xl text-[#1E3A32] mb-2">
                          {course.title}
                        </h3>
                        <p className="text-sm text-[#2B2725]/70 mb-4 line-clamp-2">
                          {course.short_description}
                        </p>
                        <Link to={createPageUrl(`CoursePage?slug=${course.slug}`)}>
                          <Button className="w-full bg-[#1E3A32] hover:bg-[#2B2725]">
                            Continue Learning
                          </Button>
                        </Link>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Webinars */}
              {webinars.length > 0 && (
                <div>
                  <h2 className="font-serif text-2xl text-[#1E3A32] mb-4">Your Webinars</h2>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {webinars.map((webinar) => (
                      <Card key={webinar.id} className="p-6 hover:shadow-lg transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                          <Video size={32} className="text-[#6E4F7D]" />
                          <Badge className="bg-purple-100 text-purple-800">
                            Full Access
                          </Badge>
                        </div>
                        <h3 className="font-serif text-xl text-[#1E3A32] mb-2">
                          {webinar.title}
                        </h3>
                        <p className="text-sm text-[#2B2725]/70 mb-4 line-clamp-2">
                          {webinar.short_description}
                        </p>
                        <Link to={createPageUrl(`WebinarPage?slug=${webinar.slug}`)}>
                          <Button className="w-full bg-[#6E4F7D] hover:bg-[#5a3f66]">
                            Watch Now
                          </Button>
                        </Link>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Empty State */}
              {courses.length === 0 && webinars.length === 0 && (
                <Card className="p-12 text-center">
                  <Lock size={48} className="mx-auto mb-4 text-[#2B2725]/30" />
                  <h3 className="font-serif text-2xl text-[#1E3A32] mb-2">
                    No Materials Yet
                  </h3>
                  <p className="text-[#2B2725]/70 mb-6">
                    Explore our programs and unlock transformational content
                  </p>
                  <Link to={createPageUrl("Programs")}>
                    <Button className="bg-[#1E3A32] hover:bg-[#2B2725]">
                      Browse Programs
                    </Button>
                  </Link>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Session Notes Tab */}
          <TabsContent value="sessions">
            {completedBookings.length === 0 ? (
              <Card className="p-12 text-center">
                <FileText size={48} className="mx-auto mb-4 text-[#2B2725]/30" />
                <h3 className="font-serif text-2xl text-[#1E3A32] mb-2">
                  No Session Notes Yet
                </h3>
                <p className="text-[#2B2725]/70">
                  After each session, your notes will appear here
                </p>
              </Card>
            ) : (
              <div className="space-y-4">
                {completedBookings.map((booking) => (
                  <Card key={booking.id} className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-serif text-xl text-[#1E3A32] mb-1">
                          {booking.service_type?.replace(/_/g, " ")}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-[#2B2725]/70">
                          <Calendar size={14} />
                          <span>
                            {format(new Date(booking.scheduled_date), "MMMM d, yyyy")}
                          </span>
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-800">
                        Completed
                      </Badge>
                    </div>
                    
                    <div className="bg-[#F9F5EF] p-4 border-l-4 border-[#D8B46B]">
                      <p className="text-sm font-medium text-[#1E3A32] mb-2">
                        Session Notes
                      </p>
                      <p className="text-[#2B2725] whitespace-pre-wrap">
                        {booking.session_notes}
                      </p>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Payment History Tab */}
          <TabsContent value="payments">
            <div className="mb-6">
              <Card className="p-6 bg-gradient-to-br from-[#1E3A32] to-[#2B4A40] text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/80 text-sm mb-1">Total Invested</p>
                    <p className="text-3xl font-serif">{formatAmount(totalSpent)}</p>
                  </div>
                  <DollarSign size={40} className="text-white/30" />
                </div>
              </Card>
            </div>

            {paidBookings.length === 0 ? (
              <Card className="p-12 text-center">
                <CreditCard size={48} className="mx-auto mb-4 text-[#2B2725]/30" />
                <h3 className="font-serif text-2xl text-[#1E3A32] mb-2">
                  No Payment History
                </h3>
                <p className="text-[#2B2725]/70">
                  Your payment records will appear here
                </p>
              </Card>
            ) : (
              <div className="space-y-3">
                {paidBookings.map((booking) => (
                  <Card key={booking.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                          <CheckCircle size={20} className="text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium text-[#1E3A32]">
                            {booking.service_type?.replace(/_/g, " ")}
                          </p>
                          <p className="text-sm text-[#2B2725]/70">
                            {format(new Date(booking.created_date), "MMM d, yyyy")}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-serif text-xl text-[#1E3A32]">
                          {formatAmount(booking.amount)}
                        </p>
                        <Badge className="bg-green-100 text-green-800">
                          Paid
                        </Badge>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Bookings Tab */}
          <TabsContent value="bookings">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-serif text-2xl text-[#1E3A32]">
                  All Bookings
                </h3>
                <Link to={createPageUrl("ClientBookings")}>
                  <Button variant="outline">
                    <ExternalLink size={16} className="mr-2" />
                    Manage Bookings
                  </Button>
                </Link>
              </div>
              <p className="text-[#2B2725]/70">
                View and manage all your bookings in the dedicated bookings page
              </p>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}