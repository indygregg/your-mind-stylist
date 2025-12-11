import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { X, Plus, Upload } from "lucide-react";
import ReactQuill from "react-quill";

export default function LessonEditor({ lesson, onUpdate, onClose, onMediaUpload }) {
  const addKeyTakeaway = () => {
    const takeaways = lesson.key_takeaways || [];
    onUpdate({ ...lesson, key_takeaways: [...takeaways, ""] });
  };

  const updateKeyTakeaway = (index, value) => {
    const takeaways = [...(lesson.key_takeaways || [])];
    takeaways[index] = value;
    onUpdate({ ...lesson, key_takeaways: takeaways });
  };

  const removeKeyTakeaway = (index) => {
    const takeaways = lesson.key_takeaways.filter((_, i) => i !== index);
    onUpdate({ ...lesson, key_takeaways: takeaways });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 overflow-y-auto">
      <div className="min-h-screen p-6 flex items-start justify-center">
        <div className="bg-white rounded-lg max-w-4xl w-full p-8 my-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-serif text-2xl text-[#1E3A32]">Edit Lesson</h2>
            <button onClick={onClose} className="text-[#2B2725]/40 hover:text-[#2B2725]">
              <X size={24} />
            </button>
          </div>

          <div className="space-y-6">
            {/* Title */}
            <div>
              <Label htmlFor="lesson-title">Lesson Title *</Label>
              <Input
                id="lesson-title"
                value={lesson.title || ""}
                onChange={(e) => onUpdate({ ...lesson, title: e.target.value })}
                placeholder="e.g., Understanding Emotional Triggers"
              />
            </div>

            {/* Type */}
            <div>
              <Label>Lesson Type</Label>
              <Select
                value={lesson.type || "video"}
                onValueChange={(value) => onUpdate({ ...lesson, type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="video">Video</SelectItem>
                  <SelectItem value="audio">Audio</SelectItem>
                  <SelectItem value="text">Text / Reading</SelectItem>
                  <SelectItem value="hybrid">Video + Text</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Duration */}
            <div>
              <Label htmlFor="lesson-duration">Duration</Label>
              <Input
                id="lesson-duration"
                value={lesson.duration || ""}
                onChange={(e) => onUpdate({ ...lesson, duration: e.target.value })}
                placeholder="e.g., 12:35 or 15 minutes"
              />
            </div>

            {/* Media Upload */}
            {(lesson.type === "video" || lesson.type === "audio" || lesson.type === "hybrid") && (
              <div>
                <Label>Media File</Label>
                {lesson.media_url ? (
                  <div className="p-4 bg-[#F9F5EF] rounded flex justify-between items-center">
                    <span className="text-sm text-[#2B2725]">Media uploaded</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => onUpdate({ ...lesson, media_url: "" })}
                    >
                      Remove
                    </Button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-[#E4D9C4] rounded-lg p-6 text-center">
                    <Upload className="mx-auto text-[#D8B46B] mb-2" size={32} />
                    <input
                      type="file"
                      accept={lesson.type === "audio" ? "audio/*" : "video/*"}
                      onChange={onMediaUpload}
                      className="hidden"
                      id="media-upload"
                    />
                    <label htmlFor="media-upload">
                      <Button type="button" variant="outline" asChild>
                        <span>Upload {lesson.type === "audio" ? "Audio" : "Video"}</span>
                      </Button>
                    </label>
                  </div>
                )}
              </div>
            )}

            {/* Embed URL (alternative to upload) */}
            {lesson.type === "video" && (
              <div>
                <Label htmlFor="embed-url">Or use Embed URL</Label>
                <Input
                  id="embed-url"
                  value={lesson.embed_url || ""}
                  onChange={(e) => onUpdate({ ...lesson, embed_url: e.target.value })}
                  placeholder="YouTube, Vimeo, etc."
                />
              </div>
            )}

            {/* Content */}
            <div>
              <Label>Lesson Content</Label>
              <ReactQuill
                value={lesson.content || ""}
                onChange={(value) => onUpdate({ ...lesson, content: value })}
                className="bg-white"
              />
            </div>

            {/* Key Takeaways */}
            <div>
              <Label>Key Takeaways</Label>
              <div className="space-y-2">
                {(lesson.key_takeaways || []).map((takeaway, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={takeaway}
                      onChange={(e) => updateKeyTakeaway(index, e.target.value)}
                      placeholder={`Takeaway ${index + 1}`}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeKeyTakeaway(index)}
                    >
                      <X size={16} />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addKeyTakeaway}
                  className="w-full border-dashed"
                >
                  <Plus size={16} className="mr-2" />
                  Add Takeaway
                </Button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                type="button"
                onClick={onClose}
                className="bg-[#1E3A32] hover:bg-[#2B2725] text-[#F9F5EF]"
              >
                Save Lesson
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}