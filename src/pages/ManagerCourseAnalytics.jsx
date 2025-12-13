import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { TrendingUp, Users, CheckCircle, Clock, BookOpen, MessageCircle, BarChart3, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function ManagerCourseAnalytics() {
  const [selectedCourse, setSelectedCourse] = useState(null);

  const { data: courses = [] } = useQuery({
    queryKey: ["allCourses"],
    queryFn: () => base44.entities.Course.list(),
  });

  const { data: analytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ["courseAnalytics", selectedCourse],
    queryFn: async () => {
      if (!selectedCourse) return null;

      // Get all progress records for this course
      const allProgress = await base44.entities.UserCourseProgress.filter({
        course_id: selectedCourse
      });

      // Get lesson progress
      const lessons = await base44.entities.Lesson.filter({ course_id: selectedCourse });
      const lessonProgress = await base44.entities.UserLessonProgress.list();

      // Calculate metrics
      const totalEnrollments = allProgress.length;
      const completed = allProgress.filter(p => p.status === 'completed').length;
      const inProgress = allProgress.filter(p => p.status === 'in_progress').length;
      
      // Get active students (accessed in last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const activeStudents = allProgress.filter(p => 
        new Date(p.last_accessed_date) > thirtyDaysAgo
      ).length;

      // Calculate average completion rate
      const avgCompletionRate = totalEnrollments > 0
        ? allProgress.reduce((sum, p) => sum + (p.completion_percentage || 0), 0) / totalEnrollments
        : 0;

      // Get lesson completion stats
      const lessonStats = lessons.map(lesson => {
        const lessonProgressRecords = lessonProgress.filter(lp => lp.lesson_id === lesson.id);
        const completedCount = lessonProgressRecords.filter(lp => lp.completed).length;
        const completionRate = totalEnrollments > 0 ? (completedCount / totalEnrollments) * 100 : 0;

        return {
          lesson_id: lesson.id,
          lesson_title: lesson.title,
          completion_rate: completionRate,
          completed_count: completedCount
        };
      });

      // Top performing lessons (highest completion)
      const topLessons = [...lessonStats]
        .sort((a, b) => b.completion_rate - a.completion_rate)
        .slice(0, 5);

      // Struggling lessons (lowest completion)
      const strugglingLessons = [...lessonStats]
        .sort((a, b) => a.completion_rate - b.completion_rate)
        .slice(0, 5);

      // Get comments count
      const comments = await base44.entities.LessonComment.filter({ course_id: selectedCourse });
      const questions = comments.filter(c => c.is_question);
      const unansweredQuestions = questions.filter(q => !q.is_answered);

      return {
        total_enrollments: totalEnrollments,
        active_students: activeStudents,
        completed_count: completed,
        in_progress_count: inProgress,
        avg_completion_rate: avgCompletionRate,
        top_performing_lessons: topLessons,
        struggling_lessons: strugglingLessons,
        total_comments: comments.length,
        total_questions: questions.length,
        unanswered_questions: unansweredQuestions.length,
        lesson_stats: lessonStats
      };
    },
    enabled: !!selectedCourse,
  });

  const selectedCourseData = courses.find(c => c.id === selectedCourse);

  return (
    <div className="min-h-screen bg-[#F9F5EF] py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="font-serif text-4xl text-[#1E3A32] mb-2">Course Analytics</h1>
          <p className="text-[#2B2725]/70">Track student progress, engagement, and course performance</p>
        </div>

        {/* Course Selector */}
        <div className="bg-white p-6 mb-8">
          <Select value={selectedCourse} onValueChange={setSelectedCourse}>
            <SelectTrigger className="w-full md:w-96">
              <SelectValue placeholder="Select a course to analyze..." />
            </SelectTrigger>
            <SelectContent>
              {courses.map(course => (
                <SelectItem key={course.id} value={course.id}>
                  {course.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedCourse && analytics && !analyticsLoading && (
          <>
            {/* Key Metrics */}
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2 text-[#2B2725]/70">
                    <Users size={16} />
                    Total Enrollments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-[#1E3A32]">{analytics.total_enrollments}</p>
                  <p className="text-xs text-[#2B2725]/60 mt-1">
                    {analytics.active_students} active (30 days)
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2 text-[#2B2725]/70">
                    <CheckCircle size={16} />
                    Completions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-[#1E3A32]">{analytics.completed_count}</p>
                  <p className="text-xs text-[#2B2725]/60 mt-1">
                    {analytics.in_progress_count} in progress
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2 text-[#2B2725]/70">
                    <TrendingUp size={16} />
                    Avg Completion
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-[#1E3A32]">
                    {Math.round(analytics.avg_completion_rate)}%
                  </p>
                  <p className="text-xs text-[#2B2725]/60 mt-1">
                    Across all students
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2 text-[#2B2725]/70">
                    <MessageCircle size={16} />
                    Engagement
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-[#1E3A32]">{analytics.total_comments}</p>
                  <p className="text-xs text-[#2B2725]/60 mt-1">
                    {analytics.total_questions} questions
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Unanswered Questions Alert */}
            {analytics.unanswered_questions > 0 && (
              <Card className="mb-8 border-orange-200 bg-orange-50">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <AlertTriangle size={24} className="text-orange-600" />
                    <div>
                      <p className="font-medium text-orange-900">
                        {analytics.unanswered_questions} unanswered question{analytics.unanswered_questions > 1 ? 's' : ''}
                      </p>
                      <p className="text-sm text-orange-700">
                        Students are waiting for responses in course discussions
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="grid lg:grid-cols-2 gap-6">
              {/* Top Performing Lessons */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp size={20} className="text-green-600" />
                    Top Performing Lessons
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analytics.top_performing_lessons.map((lesson, index) => (
                      <div key={lesson.lesson_id} className="flex items-center justify-between p-3 bg-[#F9F5EF] rounded">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge className="bg-green-100 text-green-800 text-xs">
                              #{index + 1}
                            </Badge>
                            <p className="font-medium text-[#1E3A32] text-sm">{lesson.lesson_title}</p>
                          </div>
                          <p className="text-xs text-[#2B2725]/60">
                            {lesson.completed_count} / {analytics.total_enrollments} completed
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-green-600">
                            {Math.round(lesson.completion_rate)}%
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Struggling Lessons */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle size={20} className="text-orange-600" />
                    Lessons Needing Attention
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analytics.struggling_lessons.map((lesson) => (
                      <div key={lesson.lesson_id} className="flex items-center justify-between p-3 bg-[#F9F5EF] rounded">
                        <div className="flex-1">
                          <p className="font-medium text-[#1E3A32] text-sm mb-1">{lesson.lesson_title}</p>
                          <p className="text-xs text-[#2B2725]/60">
                            {lesson.completed_count} / {analytics.total_enrollments} completed
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-orange-600">
                            {Math.round(lesson.completion_rate)}%
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* All Lessons Performance */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen size={20} />
                  All Lessons Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {analytics.lesson_stats.map((lesson) => (
                    <div key={lesson.lesson_id} className="flex items-center gap-3 p-3 hover:bg-[#F9F5EF] rounded transition-colors">
                      <div className="flex-1">
                        <p className="font-medium text-[#1E3A32] text-sm">{lesson.lesson_title}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <p className="text-sm text-[#2B2725]/60">
                          {lesson.completed_count} / {analytics.total_enrollments}
                        </p>
                        <div className="w-32 bg-[#E4D9C4] rounded-full h-2">
                          <div 
                            className="bg-[#D8B46B] h-2 rounded-full transition-all"
                            style={{ width: `${lesson.completion_rate}%` }}
                          />
                        </div>
                        <p className="text-sm font-medium text-[#1E3A32] w-12 text-right">
                          {Math.round(lesson.completion_rate)}%
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {selectedCourse && analyticsLoading && (
          <div className="text-center py-12 text-[#2B2725]/60">
            Loading analytics...
          </div>
        )}

        {!selectedCourse && (
          <div className="text-center py-12 text-[#2B2725]/60">
            Select a course to view analytics
          </div>
        )}
      </div>
    </div>
  );
}