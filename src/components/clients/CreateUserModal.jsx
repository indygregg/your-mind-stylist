import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { base44 } from "@/api/base44Client";

export default function CreateUserModal({ open, onOpenChange, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    full_name: "",
  });

  const handleCreate = async () => {
    if (!formData.email.trim() || !formData.full_name.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      // Invite user to platform
      await base44.users.inviteUser(formData.email, "user");
      toast.success("User invited! They will receive an email to set up their account");
      
      setFormData({ email: "", full_name: "" });
      onOpenChange(false);
      onSuccess();
    } catch (error) {
      toast.error("Failed to create user: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create New User</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Full Name *</Label>
            <Input
              placeholder="John Doe"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
            />
          </div>

          <div>
            <Label>Email *</Label>
            <Input
              type="email"
              placeholder="john@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="flex justify-between gap-3 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              disabled={loading}
              className="bg-[#1E3A32] hover:bg-[#2B2725] text-white"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin mr-2" /> Creating...
                </>
              ) : (
                "Create User"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}