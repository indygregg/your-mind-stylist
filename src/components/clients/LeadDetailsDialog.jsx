import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { base44 } from "@/api/base44Client";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Mail, Loader2 } from "lucide-react";

export default function LeadDetailsDialog({ open, onOpenChange, lead }) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editData, setEditData] = useState(lead);
  const queryClient = useQueryClient();

  const handleSave = async () => {
    setSaving(true);
    try {
      await base44.entities.Lead.update(lead.id, editData);
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      toast.success("Lead updated");
      setEditing(false);
    } catch (error) {
      toast.error("Failed to save: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{lead?.full_name || lead?.email}</DialogTitle>
        </DialogHeader>

        {editData && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label>Name</Label>
                <Input
                  value={editData.full_name || ""}
                  onChange={(e) => setEditData({ ...editData, full_name: e.target.value })}
                  disabled={!editing}
                />
              </div>

              <div>
                <Label>Email</Label>
                <Input value={editData.email} disabled className="bg-gray-50" />
              </div>

              <div>
                <Label>Phone</Label>
                <Input
                  value={editData.phone || ""}
                  onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                  disabled={!editing}
                />
              </div>

              <div>
                <Label>Stage</Label>
                <Input
                  value={editData.stage || ""}
                  disabled
                  className="bg-gray-50"
                />
              </div>
            </div>

            <div>
              <Label>What They Inquired About</Label>
              <Input
                value={editData.what_inquired_about || ""}
                onChange={(e) => setEditData({ ...editData, what_inquired_about: e.target.value })}
                disabled={!editing}
              />
            </div>

            <div>
              <Label>Notes</Label>
              <Textarea
                value={editData.notes || ""}
                onChange={(e) => setEditData({ ...editData, notes: e.target.value })}
                disabled={!editing}
                className="min-h-[100px]"
              />
            </div>

            {editData.converted_to_client && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <Badge className="bg-green-100 text-green-800">Converted to Client</Badge>
              </div>
            )}

            <div className="flex justify-between pt-4">
              <div>
                {editing && (
                  <Button variant="outline" onClick={() => {
                    setEditData(lead);
                    setEditing(false);
                  }}>
                    Cancel
                  </Button>
                )}
              </div>
              <div className="flex gap-2">
                {!editing && (
                  <Button
                    variant="outline"
                    onClick={() => setEditing(true)}
                  >
                    Edit
                  </Button>
                )}
                {editing && (
                  <Button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-[#1E3A32] hover:bg-[#2B2725] text-white"
                  >
                    {saving ? (
                      <>
                        <Loader2 size={16} className="animate-spin mr-2" /> Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}