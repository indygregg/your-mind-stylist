import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  User, Mail, Phone, MapPin, Calendar, BookOpen,
  ShoppingBag, Send, GraduationCap, Loader2, RefreshCw, ExternalLink, Clock, Pencil
} from "lucide-react";
import { format } from "date-fns";
import toast from "react-hot-toast";
import PersonStatusBadge, { getPersonStatus } from "./PersonStatusBadge";
import PersonSummaryLine from "./PersonSummaryLine";
import SuggestedNextStep from "./SuggestedNextStep";
import ManualEnrollmentModal from "../manager/ManualEnrollmentModal";
import SendIndividualEmailDialog from "./SendIndividualEmailDialog";
import LeadDetailsDialog from "./LeadDetailsDialog";

function SectionLabel({ children }) {
  return (
    <p className="text-[10px] uppercase tracking-[0.15em] text-[#2B2725]/50 font-semibold mb-2">
      {children}
    </p>
  );
}

function EmptyState({ text }) {
  return <p className="text-sm text-[#2B2725]/40 italic">{text}</p>;
}

export default function PersonDetailPanel({ open, onOpenChange, email, name }) {
  const queryClient = useQueryClient();
  const [enrollModalOpen, setEnrollModalOpen] = useState(false);
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [inviting, setInviting] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  // Look up user by email
  const { data: userData } = useQuery({
    queryKey: ["person-user", email],
    queryFn: async () => {
      if (!email) return null;
      const res = await base44.functions.invoke("inviteUserToApp", {
        email: email.toLowerCase(),
        checkOnly: true,
      });
      if (res.data?.userExists) {
        // Fetch full user record
        const allUsers = await base44.functions.invoke("getAllUsers");
        const users = allUsers.data?.users || [];
        return users.find((u) => u.email?.toLowerCase() === email.toLowerCase()) || null;
      }
      return null;
    },
    enabled: open && !!email,
  });

  // Look up lead by email
  const { data: leadData } = useQuery({
    queryKey: ["person-lead", email],
    queryFn: async () => {
      if (!email) return null;
      const leads = await base44.entities.Lead.filter({ email: email.toLowerCase() });
      return leads.length > 0 ? leads[0] : null;
    },
    enabled: open && !!email,
  });

  // Fetch bookings for this person
  const { data: bookings = [] } = useQuery({
    queryKey: ["person-bookings", email],
    queryFn: async () => {
      if (!email) return [];
      return base44.entities.Booking.filter({ user_email: email.toLowerCase() });
    },
    enabled: open && !!email,
  });

  // Fetch course enrollments if user exists
  const { data: enrollments = [] } = useQuery({
    queryKey: ["person-enrollments", userData?.id],
    queryFn: async () => {
      if (!userData?.id) return [];
      const res = await base44.functions.invoke("getUserEnrollments", {
        email: userData.email,
      });
      return res.data?.enrollments || [];
    },
    enabled: open && !!userData?.id,
  });

  // Fetch courses for enrollment names
  const { data: courses = [] } = useQuery({
    queryKey: ["all-courses-lookup"],
    queryFn: () => base44.entities.Course.list(),
    enabled: open && enrollments.length > 0,
  });

  const personStatus = getPersonStatus({ user: userData, lead: leadData, enrollments });
  const displayName = userData?.full_name || name || leadData?.full_name ||
    (leadData?.first_name ? `${leadData.first_name} ${leadData.last_name || ""}`.trim() : email);
  const phone = userData?.phone || leadData?.phone || null;

  // Address from lead (populated by Stripe webhook)
  const address = leadData
    ? {
        line1: leadData.address_line1,
        line2: leadData.address_line2,
        city: leadData.city,
        state: leadData.state,
        zip: leadData.zip,
        country: leadData.country,
      }
    : null;
  const hasAddress = address && (address.line1 || address.city);

  // Purchased products from lead
  const whatBought = leadData?.what_they_bought;

  const handleInvite = async () => {
    setInviting(true);
    try {
      await base44.functions.invoke("inviteUserToApp", {
        email: email.toLowerCase(),
        role: "user",
      });
      toast.success("Invite sent! They'll receive an email to set up their account.");
      queryClient.invalidateQueries({ queryKey: ["person-user", email] });
    } catch (error) {
      if (error.response?.data?.userExists) {
        toast.success("This person already has an account.");
        queryClient.invalidateQueries({ queryKey: ["person-user", email] });
      } else {
        toast.error(error.response?.data?.error || error.message);
      }
    } finally {
      setInviting(false);
    }
  };

  const formatBookingStatus = (status) => {
    const labels = {
      pending_payment: "Pending Payment",
      confirmed: "Confirmed",
      scheduled: "Scheduled",
      completed: "Completed",
      cancelled: "Cancelled",
      expired: "Expired",
    };
    return labels[status] || status;
  };

  const statusColors = {
    confirmed: "bg-green-100 text-green-800",
    scheduled: "bg-blue-100 text-blue-800",
    completed: "bg-gray-100 text-gray-700",
    cancelled: "bg-red-100 text-red-700",
    pending_payment: "bg-yellow-100 text-yellow-800",
  };

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto bg-white">
          <SheetHeader className="pb-0">
            <SheetTitle className="font-serif text-2xl text-[#1E3A32]">
              {displayName}
            </SheetTitle>
          </SheetHeader>

          <div className="mt-4 space-y-6">
            {/* Status + Summary Line */}
            <div>
              <PersonStatusBadge status={personStatus} />
              <PersonSummaryLine
                personStatus={personStatus}
                bookings={bookings}
                whatBought={whatBought}
              />
            </div>

            <Separator className="bg-[#E4D9C4]" />

            {/* Identity */}
            <div>
              <SectionLabel>Contact Information</SectionLabel>
              <div className="space-y-2.5">
                <div className="flex items-center gap-3 text-sm">
                  <Mail size={15} className="text-[#D8B46B] flex-shrink-0" />
                  <span className="text-[#2B2725]">{email}</span>
                </div>
                {phone ? (
                  <div className="flex items-center gap-3 text-sm">
                    <Phone size={15} className="text-[#D8B46B] flex-shrink-0" />
                    <span className="text-[#2B2725]">{phone}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 text-sm">
                    <Phone size={15} className="text-[#2B2725]/20 flex-shrink-0" />
                    <span className="text-[#2B2725]/40 italic">No phone on file</span>
                  </div>
                )}
                {userData?.created_date && (
                  <div className="flex items-center gap-3 text-sm">
                    <Calendar size={15} className="text-[#D8B46B] flex-shrink-0" />
                    <span className="text-[#2B2725]">
                      Member since {format(new Date(userData.created_date), "MMM d, yyyy")}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <Separator className="bg-[#E4D9C4]" />

            {/* Shipping Address */}
            <div>
              <SectionLabel>Shipping Address</SectionLabel>
              {hasAddress ? (
                <div className="flex items-start gap-3 text-sm">
                  <MapPin size={15} className="text-[#D8B46B] flex-shrink-0 mt-0.5" />
                  <div className="text-[#2B2725]">
                    {address.line1 ? (
                      <>
                        <p>{address.line1}</p>
                        {address.line2 && <p>{address.line2}</p>}
                        <p>
                          {[address.city, address.state, address.zip].filter(Boolean).join(", ")}
                        </p>
                        {address.country && address.country !== "US" && (
                          <p>{address.country}</p>
                        )}
                      </>
                    ) : (
                      <>
                        <p>{[address.city, address.state].filter(Boolean).join(", ")}</p>
                        <p className="text-xs text-[#2B2725]/40 italic mt-0.5">City-level location only</p>
                      </>
                    )}
                  </div>
                </div>
              ) : (
                <EmptyState text="No shipping address on file yet" />
              )}
            </div>

            <Separator className="bg-[#E4D9C4]" />

            {/* Bookings */}
            <div>
              <SectionLabel>Bookings</SectionLabel>
              {bookings.length === 0 ? (
                <EmptyState text="No bookings yet" />
              ) : (
                <div className="space-y-2">
                  {bookings.slice(0, 10).map((b) => (
                    <div
                      key={b.id}
                      className="flex items-center justify-between p-2.5 bg-[#F9F5EF] rounded-lg"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-[#1E3A32] truncate">
                          {b.service_type?.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                        </p>
                        <p className="text-xs text-[#2B2725]/50">
                          {b.scheduled_date
                            ? format(new Date(b.scheduled_date), "MMM d, yyyy")
                            : format(new Date(b.created_date), "MMM d, yyyy")}
                        </p>
                      </div>
                      <Badge className={`text-[10px] ${statusColors[b.booking_status] || "bg-gray-100 text-gray-600"}`}>
                        {formatBookingStatus(b.booking_status)}
                      </Badge>
                    </div>
                  ))}
                  {bookings.length > 10 && (
                    <p className="text-xs text-[#2B2725]/50 text-center">
                      +{bookings.length - 10} more bookings
                    </p>
                  )}
                </div>
              )}
            </div>

            <Separator className="bg-[#E4D9C4]" />

            {/* Purchases */}
            <div>
              <SectionLabel>Purchases</SectionLabel>
              {whatBought ? (
                <div className="space-y-2">
                  {whatBought.split(",").map((product, i) => {
                    const trimmed = product.trim();
                    if (!trimmed) return null;
                    return (
                      <div key={i} className="flex items-start gap-3 text-sm">
                        <ShoppingBag size={15} className="text-[#D8B46B] flex-shrink-0 mt-0.5" />
                        <p className="text-[#2B2725]">
                          {trimmed}
                          {i === 0 && leadData?.date_of_purchase && (
                            <span className="text-[#2B2725]/50"> — Purchased {(() => {
                              try {
                                return format(new Date(leadData.date_of_purchase), "MMM d, yyyy");
                              } catch {
                                return leadData.date_of_purchase;
                              }
                            })()}</span>
                          )}
                          {leadData?.total_value > 0 && i === 0 && (
                            <span className="text-[#2B2725]/50"> — ${(leadData.total_value / 100).toFixed(0)}</span>
                          )}
                        </p>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <EmptyState text="No purchases yet" />
              )}
            </div>

            <Separator className="bg-[#E4D9C4]" />

            {/* Enrolled Programs */}
            <div>
              <SectionLabel>Enrolled Programs</SectionLabel>
              {!userData ? (
                <EmptyState text={personStatus === "invite_pending"
                  ? "They haven't set up their account yet — enrollment will be available once they accept the invite"
                  : "Send an invite first so they can create an account"
                } />
              ) : enrollments.length === 0 ? (
                <EmptyState text="No enrollments yet" />
              ) : (
                <div className="space-y-2">
                  {enrollments.map((e) => {
                    const course = courses.find((c) => c.id === e.course_id);
                    return (
                      <div
                        key={e.course_id}
                        className="flex items-center justify-between p-2.5 bg-[#F9F5EF] rounded-lg"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <GraduationCap size={14} className="text-[#6E4F7D] flex-shrink-0" />
                          <span className="text-sm text-[#1E3A32] truncate">
                            {course?.title || "Unknown Course"}
                          </span>
                        </div>
                        <Badge className="bg-[#A6B7A3]/20 text-[#1E3A32] text-[10px]">
                          {e.status?.replace(/_/g, " ") || "enrolled"}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <Separator className="bg-[#E4D9C4]" />

            {/* Account Status — only show when not an active user */}
            {!userData && (
              <>
                <div>
                  <SectionLabel>Account Status</SectionLabel>
                  {personStatus === "invite_pending" ? (
                    <div className="space-y-2">
                      <div className="flex items-start gap-3 text-sm">
                        <Clock size={15} className="text-amber-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-[#2B2725] font-medium">Invite sent — waiting for setup</p>
                          <p className="text-xs text-[#2B2725]/50 mt-0.5">
                            They haven't created their account yet. You can resend the invite if needed.
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-amber-300 text-amber-700 hover:bg-amber-50 ml-6"
                        onClick={handleInvite}
                        disabled={inviting}
                      >
                        {inviting ? <Loader2 size={13} className="mr-1.5 animate-spin" /> : <RefreshCw size={13} className="mr-1.5" />}
                        Resend Invite
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-start gap-3 text-sm">
                      <Mail size={15} className="text-[#2B2725]/25 flex-shrink-0 mt-0.5" />
                      <p className="text-[#2B2725]/40 italic">No invite sent yet</p>
                    </div>
                  )}
                </div>
                <Separator className="bg-[#E4D9C4]" />
              </>
            )}

            {/* Actions */}
            <div>
              <SectionLabel>Actions</SectionLabel>
              <div className="flex flex-col gap-2">
                {/* Edit Details */}
                {leadData && (
                  <Button
                    variant="outline"
                    className="justify-start border-[#E4D9C4]"
                    onClick={() => setEditDialogOpen(true)}
                  >
                    <Pencil size={15} className="mr-2 text-[#D8B46B]" />
                    Edit Details
                  </Button>
                )}

                {/* Email */}
                <Button
                  variant="outline"
                  className="justify-start border-[#E4D9C4]"
                  onClick={() => setEmailDialogOpen(true)}
                >
                  <Send size={15} className="mr-2 text-[#6E4F7D]" />
                  Send Email
                </Button>

                {/* Invite — only for leads who haven't been invited yet */}
                {!userData && personStatus === "lead" && (
                  <Button
                    variant="outline"
                    className="justify-start border-[#E4D9C4]"
                    onClick={handleInvite}
                    disabled={inviting}
                  >
                    {inviting ? (
                      <Loader2 size={15} className="mr-2 animate-spin" />
                    ) : (
                      <Mail size={15} className="mr-2 text-[#D8B46B]" />
                    )}
                    {inviting ? "Sending Invite..." : "Invite to Platform"}
                  </Button>
                )}

                {/* Enroll — smart behavior */}
                {userData ? (
                  <Button
                    className="justify-start bg-[#6E4F7D] hover:bg-[#5A3F69] text-white"
                    onClick={() => setEnrollModalOpen(true)}
                  >
                    <GraduationCap size={15} className="mr-2" />
                    Enroll in Course
                  </Button>
                ) : (
                  <Button
                    className="justify-start bg-[#6E4F7D]/80 hover:bg-[#6E4F7D] text-white"
                    onClick={async () => {
                      // Send invite first, then open enrollment
                      setInviting(true);
                      try {
                        await base44.functions.invoke("inviteUserToApp", {
                          email: email.toLowerCase(),
                          role: "user",
                        });
                        toast.success(
                          "Invite sent! Once they set up their account, you can enroll them in a course.",
                          { duration: 5000 }
                        );
                        queryClient.invalidateQueries({ queryKey: ["person-user", email] });
                      } catch (error) {
                        if (error.response?.data?.userExists) {
                          toast.success("They already have an account! You can enroll them now.");
                          queryClient.invalidateQueries({ queryKey: ["person-user", email] });
                          setEnrollModalOpen(true);
                        } else {
                          toast.error(error.response?.data?.error || error.message);
                        }
                      } finally {
                        setInviting(false);
                      }
                    }}
                    disabled={inviting}
                  >
                    {inviting ? (
                      <Loader2 size={15} className="mr-2 animate-spin" />
                    ) : (
                      <GraduationCap size={15} className="mr-2" />
                    )}
                    Invite + Enroll
                  </Button>
                )}
                {!userData && (
                  <p className="text-xs text-[#2B2725]/40 italic ml-1">
                    {personStatus === "invite_pending"
                      ? "They haven't set up their account yet. You can enroll them once they accept the invite."
                      : "They'll be enrolled after they create their account."}
                  </p>
                )}
              </div>
            </div>

            {/* Suggested Next Step */}
            <SuggestedNextStep
              personStatus={personStatus}
              userData={userData}
              bookings={bookings}
              whatBought={whatBought}
              enrollments={enrollments}
            />

            {/* Lead notes */}
            {leadData?.notes && (
              <>
                <Separator className="bg-[#E4D9C4]" />
                <div>
                  <SectionLabel>Notes</SectionLabel>
                  <p className="text-sm text-[#2B2725] whitespace-pre-line">
                    {leadData.notes}
                  </p>
                </div>
              </>
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* Enrollment modal — pre-filled with email */}
      <ManualEnrollmentModal
        open={enrollModalOpen}
        onOpenChange={setEnrollModalOpen}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ["person-enrollments", userData?.id] });
          setEnrollModalOpen(false);
        }}
      />

      {/* Email dialog */}
      {emailDialogOpen && (
        <SendIndividualEmailDialog
          open={emailDialogOpen}
          onOpenChange={setEmailDialogOpen}
          recipientEmail={email}
          recipientName={displayName}
        />
      )}

      {/* Edit lead details dialog */}
      {editDialogOpen && leadData && (
        <LeadDetailsDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          lead={leadData}
        />
      )}
    </>
  );
}