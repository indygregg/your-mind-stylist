import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { base44 } from "@/api/base44Client";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

export default function LeadDetailsDialog({ open, onOpenChange, lead }) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editData, setEditData] = useState(lead);
  const queryClient = useQueryClient();

  // Re-sync editData when lead changes (e.g. clicking a different lead)
  useEffect(() => {
    setEditData(lead);
    setEditing(false);
  }, [lead?.id]);

  const getDisplayName = (l) => {
    if (!l) return "";
    if (l.first_name || l.last_name) return `${l.first_name || ""} ${l.last_name || ""}`.trim();
    return l.full_name || l.email;
  };

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
          <DialogTitle>{getDisplayName(lead)}</DialogTitle>
        </DialogHeader>

        {editData && (
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>First Name</Label>
                <Input
                  value={editData.first_name || ""}
                  onChange={(e) => setEditData({ ...editData, first_name: e.target.value, full_name: `${e.target.value} ${editData.last_name || ""}`.trim() })}
                  disabled={!editing}
                />
              </div>
              <div>
                <Label>Last Name</Label>
                <Input
                  value={editData.last_name || ""}
                  onChange={(e) => setEditData({ ...editData, last_name: e.target.value, full_name: `${editData.first_name || ""} ${e.target.value}`.trim() })}
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
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Street Address</Label>
                <Input value={editData.address_line1 || ""} onChange={(e) => setEditData({ ...editData, address_line1: e.target.value })} disabled={!editing} placeholder="123 Main St" />
              </div>
              <div>
                <Label>City</Label>
                <Input value={editData.city || ""} onChange={(e) => setEditData({ ...editData, city: e.target.value })} disabled={!editing} />
              </div>
              <div>
                <Label>State</Label>
                <Input value={editData.state || ""} onChange={(e) => setEditData({ ...editData, state: e.target.value })} disabled={!editing} />
              </div>
              <div>
                <Label>ZIP</Label>
                <Input value={editData.zip || ""} onChange={(e) => setEditData({ ...editData, zip: e.target.value })} disabled={!editing} />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>What They Inquired About</Label>
                <Input value={editData.what_inquired_about || ""} onChange={(e) => setEditData({ ...editData, what_inquired_about: e.target.value })} disabled={!editing} />
              </div>
              <div>
                <Label>What They Bought</Label>
                <Input value={editData.what_they_bought || ""} onChange={(e) => setEditData({ ...editData, what_they_bought: e.target.value })} disabled={!editing} />
              </div>
              <div>
                <Label>Date of Purchase</Label>
                <Input type="date" value={editData.date_of_purchase || ""} onChange={(e) => setEditData({ ...editData, date_of_purchase: e.target.value })} disabled={!editing} />
              </div>
              <div>
                <Label>Follow-Up Actions</Label>
                <Input value={editData.follow_up_actions || ""} onChange={(e) => setEditData({ ...editData, follow_up_actions: e.target.value })} disabled={!editing} />
              </div>
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