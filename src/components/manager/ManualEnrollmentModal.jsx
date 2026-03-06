import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export default function ManualEnrollmentModal({ open, onOpenChange, onSuccess }) {
  const queryClient = useQueryClient();
  const [userEmail, setUserEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [sendNotification, setSendNotification] = useState(true);

  // Fetch all active courses
  const { data: courses = [] } = useQuery({
    queryKey: ["coursesForEnrollment"],
    queryFn: () => base44.entities.Course.filter({ status: "published" }),
    enabled: open,
  });

  // Enrollment mutation
  const enrollmentMutation = useMutation({
    mutationFn: () =>
      base44.functions.invoke("manualEnrollUser", {
        user_email: userEmail.toLowerCase(),
        course_id: selectedCourse,
        send_notification: sendNotification,
        first_name: firstName || undefined,
        last_name: lastName || undefined,
      }),
    onSuccess: (response) => {
      const message = response.data.message || "User enrolled successfully!";
      toast.success(message);
      if (response.data.send_notification) {
        toast.success("Notification email sent!");
      }
      setUserEmail("");
      setFirstName("");
      setLastName("");
      setSelectedCourse("");
      setSendNotification(true);
      onOpenChange(false);
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || error.message);
    },
  });

  const handleEnroll = () => {
    if (!userEmail.trim() || !selectedCourse) {
      toast.error("Please fill in all required fields");
      return;
    }
    enrollmentMutation.mutate();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Manually Enroll User</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="email" className="text-sm font-medium">
              User Email *
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="user@example.com"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              disabled={enrollmentMutation.isPending}
            />
            <p className="text-xs text-[#2B2725]/50 mt-1">
              Account will be auto-created if it doesn't exist
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="firstName" className="text-sm font-medium">
                First Name
              </Label>
              <Input
                id="firstName"
                placeholder="John"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                disabled={enrollmentMutation.isPending}
              />
            </div>
            <div>
              <Label htmlFor="lastName" className="text-sm font-medium">
                Last Name
              </Label>
              <Input
                id="lastName"
                placeholder="Doe"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                disabled={enrollmentMutation.isPending}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="course" className="text-sm font-medium">
              Select Course *
            </Label>
            <Select
              value={selectedCourse}
              onValueChange={setSelectedCourse}
              disabled={enrollmentMutation.isPending}
            >
              <SelectTrigger id="course">
                <SelectValue placeholder="Choose a course..." />
              </SelectTrigger>
              <SelectContent>
                {courses.map((course) => (
                  <SelectItem key={course.id} value={course.id}>
                    {course.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {courses.length === 0 && (
              <p className="text-xs text-[#2B2725]/50 mt-1">
                No published courses available
              </p>
            )}
          </div>

          <div className="flex items-center gap-3 p-3 bg-[#F9F5EF] rounded-lg">
            <Checkbox
              id="notify"
              checked={sendNotification}
              onCheckedChange={setSendNotification}
              disabled={enrollmentMutation.isPending}
            />
            <Label
              htmlFor="notify"
              className="text-sm cursor-pointer flex-1 mb-0"
            >
              Send enrollment notification email
            </Label>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-[#E4D9C4]">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={enrollmentMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={handleEnroll}
              disabled={
                !userEmail.trim() ||
                !selectedCourse ||
                enrollmentMutation.isPending
              }
              className="bg-[#1E3A32] hover:bg-[#2B2725] text-white"
            >
              {enrollmentMutation.isPending && (
                <Loader2 size={14} className="mr-2 animate-spin" />
              )}
              {enrollmentMutation.isPending ? "Enrolling..." : "Enroll User"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}