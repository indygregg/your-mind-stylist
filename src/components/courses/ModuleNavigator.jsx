import React from "react";
import { Headphones, Video, FileText, CheckCircle2, Circle, PlayCircle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export default function ModuleNavigator({ modules, lessons, userLessonProgress, currentLessonId, onLessonSelect }) {
  const getTypeIcon = (type) => {
    const iconMap = {
      audio: Headphones,
      video: Video,
      text: FileText,
      hybrid: Video,
    };
    const Icon = iconMap[type] || FileText;
    return <Icon size={14} />;
  };

  const getLessonStatus = (lessonId) => {
    const progress = userLessonProgress.find(p => p.lesson_id === lessonId);
    if (progress?.completed) return "completed";
    if (progress && progress.watch_time > 0) return "in_progress";
    return "not_started";
  };

  const getStatusIcon = (status) => {
    if (status === "completed") return <CheckCircle2 size={16} className="text-green-600" />;
    if (status === "in_progress") return <PlayCircle size={16} className="text-blue-600" />;
    return <Circle size={16} className="text-gray-400" />;
  };

  return (
    <div className="w-full lg:w-80 bg-white border-r border-[#E4D9C4]">
      <div className="p-6 border-b border-[#E4D9C4]">
        <h2 className="font-serif text-xl text-[#1E3A32]">Course Content</h2>
      </div>
      <ScrollArea className="h-[calc(100vh-240px)]">
        <div className="p-4">
          {modules.map((module) => {
            const moduleLessons = lessons.filter(l => l.module_id === module.id);
            return (
              <div key={module.id} className="mb-6">
                <h3 className="font-medium text-[#1E3A32] mb-3 px-2">
                  {module.title}
                </h3>
                <div className="space-y-1">
                  {moduleLessons.map((lesson) => {
                    const status = getLessonStatus(lesson.id);
                    const isActive = lesson.id === currentLessonId;
                    return (
                      <button
                        key={lesson.id}
                        onClick={() => onLessonSelect(lesson.id)}
                        className={cn(
                          "w-full text-left p-3 rounded-lg transition-colors",
                          isActive
                            ? "bg-[#D8B46B]/20 border border-[#D8B46B]"
                            : "hover:bg-[#F9F5EF]"
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5">
                            {getStatusIcon(status)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={cn(
                              "text-sm font-medium mb-1",
                              isActive ? "text-[#1E3A32]" : "text-[#2B2725]/80"
                            )}>
                              {lesson.title}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-[#2B2725]/60">
                              {getTypeIcon(lesson.type)}
                              {lesson.duration && <span>{lesson.duration}</span>}
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}