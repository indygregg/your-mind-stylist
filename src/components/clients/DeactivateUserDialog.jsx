import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQueryClient } from "@tanstack/react-query";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Loader2, UserX, Archive } from "lucide-react";
import toast from "react-hot-toast";

export default function DeactivateUserDialog({ open, onOpenChange, user, action = "deactivate" }) {
  const queryClient = useQueryClient();
  const [processing, setProcessing] = useState(false);

  const isDeactivate = action === "deactivate";
  const title = isDeactivate ? "Deactivate User" : "Archive User";
  const description = isDeactivate
    ? `This will disable ${user?.full_name || user?.email}'s ability to log in. Their data and history will be preserved. You can reactivate them later.`
    : `This will archive ${user?.full_name || user?.email}'s account. They will be hidden from active lists but all data will be preserved.`;

  const handleConfirm = async () => {
    if (!user?.id) return;
    setProcessing(true);
    try {
      const newStatus = isDeactivate ? "inactive" : "archived";
      await base44.functions.invoke("updateUserProfile", {
        userId: user.id,
        data: { account_status: newStatus },
      });
      toast.success(`User ${isDeactivate ? "deactivated" : "archived"} successfully`);
      queryClient.invalidateQueries({ queryKey: ["admin-all-users"] });
      onOpenChange(false);
    } catch (error) {
      toast.error(error.response?.data?.error || error.message);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            {isDeactivate ? <UserX size={18} className="text-amber-600" /> : <Archive size={18} className="text-[#2B2725]/60" />}
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={processing}>Cancel</AlertDialogCancel>
          <Button
            onClick={handleConfirm}
            disabled={processing}
            className={isDeactivate ? "bg-amber-600 hover:bg-amber-700" : "bg-[#2B2725] hover:bg-[#1E3A32]"}
          >
            {processing && <Loader2 size={14} className="mr-2 animate-spin" />}
            {processing ? "Processing..." : title}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}