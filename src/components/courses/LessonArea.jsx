import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, StickyNote } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import VideoPlayer from "./VideoPlayer";
import CourseAudioPlayer from "./CourseAudioPlayer";

export default function LessonArea({ lesson, isCompleted, onMarkComplete, onAddNote, onProgressUpdate, lastPosition }) {
  const getTypeLabel = (type) => {
    const labels = {
      video: "Video Lesson",
      audio: "Audio Lesson",
      text: "Reading",
      hybrid: "Video + Reading",
    };
    return labels[type] || "Lesson";
  };

  return (
    <div className="flex-1 bg-[#F9F5EF]">
      <div className="max-w-4xl mx-auto p-6 lg:p-12">
        {/* Lesson Header */}
        <div className="mb-8">
          <Badge className="bg-[#D8B46B]/20 text-[#1E3A32] mb-3">
            {getTypeLabel(lesson.type)}
          </Badge>
          <h1 className="font-serif text-3xl md:text-4xl text-[#1E3A32] mb-4">
            {lesson.title}
          </h1>
        </div>

        {/* Video Player */}
        {(lesson.type === "video" || lesson.type === "hybrid") && (
          <div className="mb-8 bg-black rounded-lg overflow-hidden">
            <VideoPlayer
              src={lesson.media_url}
              embedUrl={lesson.embed_url}
              onProgressUpdate={onProgressUpdate}
              lastPosition={lastPosition}
            />
          </div>
        )}

        {/* Audio Player */}
        {lesson.type === "audio" && lesson.media_url && (
          <div className="mb-8">
            <CourseAudioPlayer
              src={lesson.media_url}
              onProgressUpdate={onProgressUpdate}
              lastPosition={lastPosition}
            />
          </div>
        )}

        {/* Text Content */}
        {lesson.content && (
          <div
            className="prose prose-lg max-w-none mb-8"
            dangerouslySetInnerHTML={{ __html: lesson.content }}
          />
        )}

        {/* Key Takeaways */}
        {lesson.key_takeaways && lesson.key_takeaways.length > 0 && (
          <div className="bg-white p-6 rounded-lg mb-8">
            <h2 className="font-serif text-2xl text-[#1E3A32] mb-4">Key Takeaways</h2>
            <ul className="space-y-2">
              {lesson.key_takeaways.map((takeaway, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="text-[#D8B46B] mt-1">•</span>
                  <span className="text-[#2B2725]/80">{takeaway}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            onClick={onAddNote}
            variant="outline"
            className="flex-1 border-[#D8B46B] hover:bg-[#D8B46B]/10"
          >
            <StickyNote size={16} className="mr-2" />
            Add Note
          </Button>
          <Button
            onClick={onMarkComplete}
            disabled={isCompleted}
            className="flex-1 bg-[#1E3A32] hover:bg-[#2B2725] text-[#F9F5EF]"
          >
            <CheckCircle size={16} className="mr-2" />
            {isCompleted ? "Completed" : "Mark as Complete"}
          </Button>
        </div>

        {/* Resources */}
        {lesson.resources && lesson.resources.length > 0 && (
          <div className="mt-12">
            <h2 className="font-serif text-2xl text-[#1E3A32] mb-6">Resources</h2>
            <div className="grid gap-4">
              {lesson.resources.map((resource, index) => (
                <a
                  key={index}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 bg-white rounded-lg hover:shadow-md transition-shadow"
                >
                  <div>
                    <p className="font-medium text-[#1E3A32]">{resource.title}</p>
                    <p className="text-sm text-[#2B2725]/60 capitalize">{resource.type}</p>
                  </div>
                  <span className="text-[#D8B46B]">→</span>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}