import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Send } from "lucide-react";
import toast from "react-hot-toast";

export default function MassEmailDialog({ open, onOpenChange, leads }) {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedStages, setSelectedStages] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);

  // Get unique tags and stages from leads
  const allTags = [...new Set(leads.flatMap(l => l.tags || []))];
  const stages = ["new", "contacted", "booked", "qualified", "proposal", "negotiation", "won", "lost"];

  // Fetch courses for filtering
  const { data: courses = [] } = useQuery({
    queryKey: ["courses"],
    queryFn: () => base44.entities.Course.list("", 100),
    enabled: open,
  });

  // Calculate filtered lead count
  const filteredLeadCount = leads.filter(lead => {
    const tagMatch = selectedTags.length === 0 || selectedTags.some(tag => lead.tags?.includes(tag));
    const stageMatch = selectedStages.length === 0 || selectedStages.includes(lead.stage);
    const courseMatch = selectedCourses.length === 0 || (lead.course_ids?.some(c => selectedCourses.includes(c)) ?? false);
    return tagMatch && stageMatch && courseMatch;
  }).length;

  const handleSend = async () => {
    if (!subject.trim() || !body.trim()) {
      toast.error("Subject and message are required");
      return;
    }

    if (filteredLeadCount === 0) {
      toast.error("No leads match your filters");
      return;
    }

    setSending(true);
    try {
      const response = await base44.functions.invoke('sendMassEmailViaCRM', {
        subject,
        body,
        filters: {
          tags: selectedTags,
          stages: selectedStages,
          courses: selectedCourses,
        },
      });

      if (response.data.success) {
        toast.success(`Email sent to ${response.data.recipientCount} leads!`);
        setSubject("");
        setBody("");
        setSelectedTags([]);
        setSelectedStages([]);
        setSelectedCourses([]);
        onOpenChange(false);
      }
    } catch (error) {
      toast.error(`Failed to send: ${error.message}`);
    } finally {
      setSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Send Mass Email</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Filters */}
          <div className="border rounded-lg p-4 bg-gray-50">
            <h3 className="font-medium text-sm mb-4">Filter Recipients</h3>

            {/* Tags */}
            {allTags.length > 0 && (
              <div className="mb-4">
                <Label className="text-xs font-semibold mb-2 block">By Tags</Label>
                <div className="flex flex-wrap gap-2">
                  {allTags.map(tag => (
                    <label key={tag} className="flex items-center gap-2 cursor-pointer">
                      <Checkbox
                        checked={selectedTags.includes(tag)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedTags([...selectedTags, tag]);
                          } else {
                            setSelectedTags(selectedTags.filter(t => t !== tag));
                          }
                        }}
                      />
                      <span className="text-sm">{tag}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Stages */}
            <div className="mb-4">
              <Label className="text-xs font-semibold mb-2 block">By Pipeline Stage</Label>
              <div className="flex flex-wrap gap-2">
                {stages.map(stage => {
                  const count = leads.filter(l => l.stage === stage).length;
                  return (
                    <label key={stage} className="flex items-center gap-2 cursor-pointer">
                      <Checkbox
                        checked={selectedStages.includes(stage)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedStages([...selectedStages, stage]);
                          } else {
                            setSelectedStages(selectedStages.filter(s => s !== stage));
                          }
                        }}
                      />
                      <span className="text-sm">{stage} ({count})</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Courses */}
            {courses.length > 0 && (
              <div>
                <Label className="text-xs font-semibold mb-2 block">By Enrolled Course</Label>
                <div className="flex flex-wrap gap-2">
                  {courses.map(course => (
                    <label key={course.id} className="flex items-center gap-2 cursor-pointer">
                      <Checkbox
                        checked={selectedCourses.includes(course.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedCourses([...selectedCourses, course.id]);
                          } else {
                            setSelectedCourses(selectedCourses.filter(c => c !== course.id));
                          }
                        }}
                      />
                      <span className="text-sm">{course.title}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            <p className="text-xs text-gray-600 mt-4 pt-4 border-t">
              <strong>{filteredLeadCount}</strong> lead(s) will receive this email
            </p>
          </div>

          {/* Email Content */}
          <div className="space-y-4">
            <div>
              <Label>Subject Line</Label>
              <Input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Email subject..."
                className="mt-1"
              />
            </div>

            <div>
              <Label>Message</Label>
              <Textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Write your message here..."
                className="min-h-[200px] mt-1"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={sending}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSend}
              disabled={sending || filteredLeadCount === 0}
              className="bg-[#1E3A32] hover:bg-[#2B2725] text-white"
            >
              {sending ? (
                <>
                  <Loader2 size={14} className="animate-spin mr-2" />
                  Sending...
                </>
              ) : (
                <>
                  <Send size={14} className="mr-2" />
                  Send to {filteredLeadCount} Lead{filteredLeadCount !== 1 ? 's' : ''}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}