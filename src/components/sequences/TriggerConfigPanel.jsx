import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Zap } from "lucide-react";

const TRIGGER_LABELS = {
  manual: "Manual Enrollment",
  signup: "User Signup",
  masterclass_signup: "Masterclass Signup",
  product_purchase: "Product Purchase",
  booking_completed: "Booking Completed",
  course_started: "Course Started",
  course_completed: "Course Completed",
  abandoned_cart: "Abandoned Cart",
  inactive_user: "Inactive User",
};

const TRIGGER_DESCRIPTIONS = {
  manual: "Manually enroll users from the Client Hub or via API",
  signup: "Automatically enroll when a new user signs up",
  masterclass_signup: "Enroll when someone registers for a free masterclass",
  product_purchase: "Enroll after purchasing a specific product",
  booking_completed: "Enroll after completing a booking/session",
  course_started: "Enroll when a user starts a specific course",
  course_completed: "Enroll when a user completes a specific course",
  abandoned_cart: "Re-engage users who abandoned checkout",
  inactive_user: "Re-engage users who haven't been active",
};

// Triggers that need a product picker
const PRODUCT_TRIGGERS = ["product_purchase"];
// Triggers that need a course picker
const COURSE_TRIGGERS = ["course_started", "course_completed"];

export default function TriggerConfigPanel({ triggerType, triggerConditions, onTriggerTypeChange, onConditionsChange }) {
  const { data: products = [] } = useQuery({
    queryKey: ["products-for-trigger"],
    queryFn: () => base44.entities.Product.filter({ status: "published" }, "name", 50),
    enabled: PRODUCT_TRIGGERS.includes(triggerType),
  });

  const { data: courses = [] } = useQuery({
    queryKey: ["courses-for-trigger"],
    queryFn: () => base44.entities.Course.filter({ status: "published" }, "title", 50),
    enabled: COURSE_TRIGGERS.includes(triggerType),
  });

  const needsProduct = PRODUCT_TRIGGERS.includes(triggerType);
  const needsCourse = COURSE_TRIGGERS.includes(triggerType);
  const needsInactiveDays = triggerType === "inactive_user";

  return (
    <div className="space-y-4">
      <div>
        <Label className="flex items-center gap-2 mb-1">
          <Zap size={14} className="text-[#D8B46B]" /> Trigger Type
        </Label>
        <Select value={triggerType} onValueChange={onTriggerTypeChange}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(TRIGGER_LABELS).map(([key, label]) => (
              <SelectItem key={key} value={key}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-xs text-[#2B2725]/50 mt-1">{TRIGGER_DESCRIPTIONS[triggerType]}</p>
      </div>

      {/* Product picker */}
      {needsProduct && (
        <div>
          <Label>Trigger Product</Label>
          <Select
            value={triggerConditions?.product_id || "any"}
            onValueChange={(v) => onConditionsChange({ ...triggerConditions, product_id: v === "any" ? undefined : v })}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Any product" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any product purchase</SelectItem>
              {products.map((p) => (
                <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Course picker */}
      {needsCourse && (
        <div>
          <Label>Trigger Course</Label>
          <Select
            value={triggerConditions?.course_id || "any"}
            onValueChange={(v) => onConditionsChange({ ...triggerConditions, course_id: v === "any" ? undefined : v })}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Any course" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any course</SelectItem>
              {courses.map((c) => (
                <SelectItem key={c.id} value={c.id}>{c.title}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Inactive days */}
      {needsInactiveDays && (
        <div>
          <Label>Days of Inactivity</Label>
          <Input
            type="number"
            min={1}
            value={triggerConditions?.inactive_days || 30}
            onChange={(e) => onConditionsChange({ ...triggerConditions, inactive_days: parseInt(e.target.value) || 30 })}
            className="mt-1 w-32"
          />
          <p className="text-xs text-[#2B2725]/50 mt-1">Enroll users after this many days of no activity</p>
        </div>
      )}
    </div>
  );
}