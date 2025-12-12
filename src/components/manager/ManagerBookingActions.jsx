import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Calendar, XCircle, StickyNote, Video, RefreshCw, AlertCircle } from "lucide-react";
import { base44 } from "@/api/base44Client";

export default function ManagerBookingActions({ booking, onSuccess }) {
  const [dialogOpen, setDialogOpen] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    session_notes: "",
    manager_notes: "",
    new_date: "",
    reason: ""
  });

  const handleAction = async (action) => {
    setLoading(true);
    try {
      const response = await base44.functions.invoke('managerBookingAction', {
        booking_id: booking.id,
        action: action,
        data: formData
      });

      if (response.data.success) {
        alert(response.data.message);
        setDialogOpen(null);
        setFormData({ session_notes: "", manager_notes: "", new_date: "", reason: "" });
        if (onSuccess) onSuccess();
      }
    } catch (error) {
      alert(error.response?.data?.error || 'Action failed');
    } finally {
      setLoading(false);
    }
  };

  const getMinDateTime = () => {
    const now = new Date();
    return now.toISOString().slice(0, 16);
  };

  return (
    <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-[#E4D9C4]">
      {/* Complete Session */}
      {['confirmed', 'scheduled'].includes(booking.booking_status) && (
        <Dialog open={dialogOpen === 'complete'} onOpenChange={(open) => setDialogOpen(open ? 'complete' : null)}>
          <DialogTrigger asChild>
            <Button size="sm" className="bg-[#A6B7A3] hover:bg-[#8DA08A] text-white">
              <CheckCircle size={14} className="mr-2" />
              Mark Complete
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Mark Session as Complete</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Session Notes (Optional)</Label>
                <Textarea
                  value={formData.session_notes}
                  onChange={(e) => setFormData({ ...formData, session_notes: e.target.value })}
                  placeholder="Add any notes about the session..."
                  rows={4}
                />
                <p className="text-xs text-[#2B2725]/60 mt-1">
                  These will be shared with the client
                </p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setDialogOpen(null)} disabled={loading} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={() => handleAction('complete')} disabled={loading} className="flex-1 bg-[#A6B7A3] hover:bg-[#8DA08A]">
                  {loading ? 'Completing...' : 'Mark Complete'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Add Manager Notes */}
      <Dialog open={dialogOpen === 'notes'} onOpenChange={(open) => setDialogOpen(open ? 'notes' : null)}>
        <DialogTrigger asChild>
          <Button size="sm" variant="outline">
            <StickyNote size={14} className="mr-2" />
            Add Notes
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Manager Notes</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {booking.manager_notes && (
              <div className="bg-[#F9F5EF] p-3 rounded">
                <p className="text-xs text-[#2B2725]/60 mb-1">Current Notes:</p>
                <p className="text-sm text-[#2B2725]">{booking.manager_notes}</p>
              </div>
            )}
            <div>
              <Label>Notes</Label>
              <Textarea
                value={formData.manager_notes}
                onChange={(e) => setFormData({ ...formData, manager_notes: e.target.value })}
                placeholder="Private notes about this booking..."
                rows={4}
              />
              <p className="text-xs text-[#2B2725]/60 mt-1">
                These are private and won't be shared with the client
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setDialogOpen(null)} disabled={loading} className="flex-1">
                Cancel
              </Button>
              <Button onClick={() => handleAction('add_notes')} disabled={loading} className="flex-1">
                {loading ? 'Saving...' : 'Save Notes'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Reschedule */}
      {!['cancelled', 'completed', 'expired'].includes(booking.booking_status) && (
        <Dialog open={dialogOpen === 'reschedule'} onOpenChange={(open) => setDialogOpen(open ? 'reschedule' : null)}>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline">
              <Calendar size={14} className="mr-2" />
              Reschedule
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Reschedule Session</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>New Date & Time *</Label>
                <Input
                  type="datetime-local"
                  value={formData.new_date}
                  onChange={(e) => setFormData({ ...formData, new_date: e.target.value })}
                  min={getMinDateTime()}
                  required
                />
              </div>
              <div>
                <Label>Reason (Optional)</Label>
                <Textarea
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  placeholder="Reason for rescheduling..."
                  rows={2}
                />
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setDialogOpen(null)} disabled={loading} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={() => handleAction('reschedule')} disabled={loading} className="flex-1">
                  {loading ? 'Rescheduling...' : 'Reschedule'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Cancel */}
      {!['cancelled', 'completed', 'expired'].includes(booking.booking_status) && (
        <Dialog open={dialogOpen === 'cancel'} onOpenChange={(open) => setDialogOpen(open ? 'cancel' : null)}>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
              <XCircle size={14} className="mr-2" />
              Cancel
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Cancel Session</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Reason *</Label>
                <Textarea
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  placeholder="Reason for cancellation..."
                  rows={3}
                  required
                />
                <p className="text-xs text-[#2B2725]/60 mt-1">
                  This will be shared with the client
                </p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setDialogOpen(null)} disabled={loading} className="flex-1">
                  Keep Session
                </Button>
                <Button onClick={() => handleAction('cancel')} disabled={loading} className="flex-1 bg-red-600 hover:bg-red-700 text-white">
                  {loading ? 'Cancelling...' : 'Cancel Session'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
      </div>
    </div>
  );
}