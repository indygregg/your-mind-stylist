import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import CourseHeader from "../components/courses/CourseHeader";
import ProgressBar from "../components/courses/ProgressBar";
import ModuleNavigator from "../components/courses/ModuleNavigator";
import LessonArea from "../components/courses/LessonArea";
import NotesDrawer from "../components/studio/NotesDrawer";

export default function CoursePage() {
  const queryClient = useQueryClient();
  const [currentLessonId, setCurrentLessonId] = useState(null);
  const [notesDrawerOpen, setNotesDrawerOpen] = useState(false);
  const [user, setUser] = useState(null);

  // Get course slug from URL
  const urlParams = new URLSearchParams(window.location.search);
  const courseSlug = urlParams.get("slug");

  // Fetch user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    fetchUser();
  }, []);

  // Fetch course
  const { data: courses = [] } = useQuery({
    queryKey: ["courses", courseSlug],
    queryFn: () => base44.entities.Course.filter({ slug: courseSlug, status: "published" }),
    enabled: !!courseSlug,
  });
  const course = courses[0];

  // Fetch modules
  const { data: modules = [] } = useQuery({
    queryKey: ["modules", course?.id],
    queryFn: () => base44.entities.Module.filter({ course_id: course.id }, "order"),
    enabled: !!course?.id,
  });

  // Fetch lessons
  const { data: allLessons = [] } = useQuery({
    queryKey: ["lessons", course?.id],
    queryFn: async () => {
      if (!modules.length) return [];
      const moduleIds = modules.map(m => m.id);
      const lessonPromises = moduleIds.map(moduleId =>
        base44.entities.Lesson.filter({ module_id: moduleId }, "order")
      );
      const lessonArrays = await Promise.all(lessonPromises);
      return lessonArrays.flat();
    },
    enabled: !!course?.id && modules.length > 0,
  });

  // Fetch user progress
  const { data: userProgress = [] } = useQuery({
    queryKey: ["userCourseProgress", course?.id, user?.id],
    queryFn: () =>
      base44.entities.UserCourseProgress.filter({
        user_id: user.id,
        course_id: course.id,
      }),
    enabled: !!course?.id && !!user?.id,
  });
  const progress = userProgress[0];

  // Fetch lesson progress
  const { data: userLessonProgress = [] } = useQuery({
    queryKey: ["userLessonProgress", user?.id],
    queryFn: () => base44.entities.UserLessonProgress.filter({ user_id: user.id }),
    enabled: !!user?.id,
  });

  // Set initial lesson
  useEffect(() => {
    if (allLessons.length > 0 && !currentLessonId) {
      // Find last accessed lesson or first lesson
      const lastLessonId = progress?.last_accessed_lesson_id;
      if (lastLessonId && allLessons.find(l => l.id === lastLessonId)) {
        setCurrentLessonId(lastLessonId);
      } else {
        setCurrentLessonId(allLessons[0].id);
      }
    }
  }, [allLessons, currentLessonId, progress]);

  // Create/update course progress
  const progressMutation = useMutation({
    mutationFn: async ({ status, lessonId }) => {
      if (progress) {
        return base44.entities.UserCourseProgress.update(progress.id, {
          status,
          last_accessed_lesson_id: lessonId,
        });
      } else {
        return base44.entities.UserCourseProgress.create({
          user_id: user.id,
          course_id: course.id,
          status,
          last_accessed_lesson_id: lessonId,
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userCourseProgress"] });
    },
  });

  // Update lesson progress (watch time)
  const progressUpdateMutation = useMutation({
    mutationFn: async ({ lessonId, watchTime }) => {
      const existingProgress = userLessonProgress.find(p => p.lesson_id === lessonId);
      if (existingProgress) {
        return base44.entities.UserLessonProgress.update(existingProgress.id, {
          watch_time: watchTime,
          last_position: watchTime,
        });
      } else {
        return base44.entities.UserLessonProgress.create({
          user_id: user.id,
          lesson_id: lessonId,
          watch_time: watchTime,
          last_position: watchTime,
        });
      }
    },
  });

  // Mark lesson complete
  const lessonCompleteMutation = useMutation({
    mutationFn: async (lessonId) => {
      const existingProgress = userLessonProgress.find(p => p.lesson_id === lessonId);
      if (existingProgress) {
        return base44.entities.UserLessonProgress.update(existingProgress.id, {
          completed: true,
          completed_date: new Date().toISOString(),
        });
      } else {
        return base44.entities.UserLessonProgress.create({
          user_id: user.id,
          lesson_id: lessonId,
          completed: true,
          completed_date: new Date().toISOString(),
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userLessonProgress"] });
      // Update course completion percentage
      const completedCount = userLessonProgress.filter(p => p.completed).length + 1;
      const percentage = (completedCount / allLessons.length) * 100;
      const newStatus = percentage === 100 ? "completed" : "in_progress";
      
      if (progress) {
        base44.entities.UserCourseProgress.update(progress.id, {
          completion_percentage: percentage,
          status: newStatus,
          ...(newStatus === "completed" && { completed_date: new Date().toISOString() }),
        });
      }
    },
  });

  const handleContinue = () => {
    if (!progress || progress.status === "not_started") {
      progressMutation.mutate({ status: "in_progress", lessonId: currentLessonId });
    }
    // Scroll to lesson area
    document.getElementById("lesson-area")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleLessonSelect = (lessonId) => {
    setCurrentLessonId(lessonId);
    progressMutation.mutate({ 
      status: progress?.status === "completed" ? "completed" : "in_progress", 
      lessonId 
    });
  };

  const handleMarkComplete = () => {
    lessonCompleteMutation.mutate(currentLessonId);
  };

  const handleProgressUpdate = (watchTime) => {
    progressUpdateMutation.mutate({ lessonId: currentLessonId, watchTime });
  };

  const currentLesson = allLessons.find(l => l.id === currentLessonId);
  const completedLessons = userLessonProgress.filter(p => p.completed).length;
  const currentLessonProgress = userLessonProgress.find(p => p.lesson_id === currentLessonId);
  const isCurrentLessonCompleted = currentLessonProgress?.completed;

  if (!course) {
    return (
      <div className="min-h-screen bg-[#F9F5EF] flex items-center justify-center">
        <p className="text-[#2B2725]/70">Loading course...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F5EF]">
      <CourseHeader course={course} userProgress={progress} />
      <ProgressBar
        userProgress={progress}
        totalLessons={allLessons.length}
        completedLessons={completedLessons}
        onContinue={handleContinue}
      />
      <div className="flex" id="lesson-area">
        <ModuleNavigator
          modules={modules}
          lessons={allLessons}
          userLessonProgress={userLessonProgress}
          currentLessonId={currentLessonId}
          onLessonSelect={handleLessonSelect}
        />
        {currentLesson && (
          <LessonArea
            lesson={currentLesson}
            isCompleted={isCurrentLessonCompleted}
            onMarkComplete={handleMarkComplete}
            onAddNote={() => setNotesDrawerOpen(true)}
            onProgressUpdate={handleProgressUpdate}
            lastPosition={currentLessonProgress?.last_position || 0}
          />
        )}
      </div>
      <NotesDrawer
        isOpen={notesDrawerOpen}
        onClose={() => setNotesDrawerOpen(false)}
        context={{
          source_type: "lesson",
          source_id: currentLessonId,
        }}
      />
    </div>
  );
}