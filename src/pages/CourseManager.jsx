import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Search, MoreVertical, Edit, Copy, Archive, Trash2, Eye, BarChart3, Monitor } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import CourseAnalytics from "@/components/courses/CourseAnalytics";
import { createPageUrl } from "../utils";
import { useNavigate } from "react-router-dom";

export default function CourseManager() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  // Fetch all courses
  const { data: courses = [], isLoading } = useQuery({
    queryKey: ["courses"],
    queryFn: () => base44.entities.Course.list("-created_date"),
  });

  // Fetch course progress data for analytics
  const { data: allProgress = [] } = useQuery({
    queryKey: ["courseProgress"],
    queryFn: () => base44.entities.UserCourseProgress.list(),
  });

  // Delete course
  const deleteMutation = useMutation({
    mutationFn: async (courseId) => {
      // Delete associated modules and lessons first
      const modules = await base44.entities.Module.filter({ course_id: courseId });
      for (const module of modules) {
        const lessons = await base44.entities.Lesson.filter({ module_id: module.id });
        for (const lesson of lessons) {
          await base44.entities.Lesson.delete(lesson.id);
        }
        await base44.entities.Module.delete(module.id);
      }
      await base44.entities.Course.delete(courseId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
  });

  // Duplicate course
  const duplicateMutation = useMutation({
    mutationFn: async (courseId) => {
      const course = courses.find(c => c.id === courseId);
      const newCourse = await base44.entities.Course.create({
        ...course,
        title: `${course.title} (Copy)`,
        slug: `${course.slug}-copy-${Date.now()}`,
        status: "draft",
      });

      // Duplicate modules and lessons
      const modules = await base44.entities.Module.filter({ course_id: courseId }, "order");
      for (const module of modules) {
        const newModule = await base44.entities.Module.create({
          course_id: newCourse.id,
          title: module.title,
          description: module.description,
          order: module.order,
        });

        const lessons = await base44.entities.Lesson.filter({ module_id: module.id }, "order");
        for (const lesson of lessons) {
          await base44.entities.Lesson.create({
            module_id: newModule.id,
            title: lesson.title,
            type: lesson.type,
            content: lesson.content,
            media_url: lesson.media_url,
            embed_url: lesson.embed_url,
            duration: lesson.duration,
            key_takeaways: lesson.key_takeaways,
            resources: lesson.resources,
            order: lesson.order,
          });
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
  });

  // Archive course
  const archiveMutation = useMutation({
    mutationFn: (courseId) => base44.entities.Course.update(courseId, { status: "archived" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
  });

  const handleDelete = (courseId) => {
    if (confirm("Delete this course and all its content? This cannot be undone.")) {
      deleteMutation.mutate(courseId);
    }
  };

  // Filter courses
  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || course.status === statusFilter;
    const matchesType = typeFilter === "all" || course.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  // Calculate analytics
  const getCourseStats = (courseId) => {
    const courseProgress = allProgress.filter(p => p.course_id === courseId);
    const enrolled = courseProgress.length;
    const completed = courseProgress.filter(p => p.status === "completed").length;
    const inProgress = courseProgress.filter(p => p.status === "in_progress").length;
    return { enrolled, completed, inProgress };
  };

  const getStatusBadge = (status) => {
    const config = {
      draft: { label: "Draft", className: "bg-gray-100 text-gray-800" },
      published: { label: "Published", className: "bg-green-100 text-green-800" },
      archived: { label: "Archived", className: "bg-orange-100 text-orange-800" },
    };
    return config[status] || config.draft;
  };

  return (
    <div className="min-h-screen bg-[#F9F5EF] py-8">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="font-serif text-4xl text-[#1E3A32] mb-2">Course Manager</h1>
            <p className="text-[#2B2725]/70">Create and manage your courses</p>
          </div>
          <Button
            onClick={() => window.location.href = createPageUrl("CourseBuilder")}
            className="bg-[#1E3A32] hover:bg-[#2B2725] text-[#F9F5EF]"
          >
            <Plus size={16} className="mr-2" />
            Create Course
          </Button>
        </div>

        <Tabs defaultValue="courses" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="courses" className="flex items-center gap-2">
              <Search size={16} />
              Courses
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 size={16} />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="courses">
            <div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg border border-[#E4D9C4]">
            <p className="text-sm text-[#2B2725]/70 mb-1">Total Courses</p>
            <p className="text-3xl font-serif text-[#1E3A32]">{courses.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg border border-[#E4D9C4]">
            <p className="text-sm text-[#2B2725]/70 mb-1">Published</p>
            <p className="text-3xl font-serif text-[#1E3A32]">
              {courses.filter(c => c.status === "published").length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg border border-[#E4D9C4]">
            <p className="text-sm text-[#2B2725]/70 mb-1">Drafts</p>
            <p className="text-3xl font-serif text-[#1E3A32]">
              {courses.filter(c => c.status === "draft").length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg border border-[#E4D9C4]">
            <p className="text-sm text-[#2B2725]/70 mb-1">Total Enrollments</p>
            <p className="text-3xl font-serif text-[#1E3A32]">{allProgress.length}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg border border-[#E4D9C4] mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#2B2725]/40" size={18} />
              <Input
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Toolkit Module">Toolkit Module</SelectItem>
                <SelectItem value="Webinar">Webinar</SelectItem>
                <SelectItem value="Audio-Based Program">Audio-Based Program</SelectItem>
                <SelectItem value="Training Program">Training Program</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

            {/* Course List */}
            {isLoading ? (
              <div className="text-center py-12 text-[#2B2725]/70">Loading courses...</div>
            ) : filteredCourses.length === 0 ? (
          <div className="bg-white p-12 rounded-lg border border-[#E4D9C4] text-center">
            <p className="text-[#2B2725]/70 mb-4">No courses found</p>
            <Button
              onClick={() => window.location.href = createPageUrl("CourseBuilder")}
              variant="outline"
            >
              <Plus size={16} className="mr-2" />
              Create Your First Course
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredCourses.map((course) => {
              const stats = getCourseStats(course.id);
              const statusBadge = getStatusBadge(course.status);
              
              return (
                <div
                  key={course.id}
                  className="bg-white border border-[#E4D9C4] rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex gap-6">
                    {/* Thumbnail */}
                    {course.thumbnail && (
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-48 h-32 object-cover rounded-lg flex-shrink-0"
                      />
                    )}

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-serif text-2xl text-[#1E3A32] mb-2">
                            {course.title}
                          </h3>
                          <div className="flex gap-2 flex-wrap">
                            <Badge className={statusBadge.className}>
                              {statusBadge.label}
                            </Badge>
                            <Badge variant="outline">{course.type}</Badge>
                            {course.difficulty && (
                              <Badge variant="outline">{course.difficulty}</Badge>
                            )}
                            {course.visibility === "clients_only" && (
                              <Badge className="bg-purple-100 text-purple-800">
                                Clients Only
                              </Badge>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical size={16} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => navigate(createPageUrl(`CoursePreview?id=${course.id}`))}
                            >
                              <Monitor size={14} className="mr-2" />
                              Preview
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => navigate(createPageUrl(`CourseBuilder?id=${course.id}`))}
                            >
                              <Edit size={14} className="mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => navigate(createPageUrl(`CoursePage?slug=${course.slug}`))}
                            >
                              <Eye size={14} className="mr-2" />
                              View as Student
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => duplicateMutation.mutate(course.id)}>
                              <Copy size={14} className="mr-2" />
                              Duplicate
                            </DropdownMenuItem>
                            {course.status !== "archived" && (
                              <DropdownMenuItem onClick={() => archiveMutation.mutate(course.id)}>
                                <Archive size={14} className="mr-2" />
                                Archive
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                              onClick={() => handleDelete(course.id)}
                              className="text-red-600"
                            >
                              <Trash2 size={14} className="mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      {course.short_description && (
                        <p className="text-[#2B2725]/70 mb-4 line-clamp-2">
                          {course.short_description}
                        </p>
                      )}

                      {/* Stats */}
                      <div className="flex gap-6 text-sm">
                        <div>
                          <span className="text-[#2B2725]/60">Enrolled: </span>
                          <span className="font-medium text-[#1E3A32]">{stats.enrolled}</span>
                        </div>
                        <div>
                          <span className="text-[#2B2725]/60">In Progress: </span>
                          <span className="font-medium text-[#1E3A32]">{stats.inProgress}</span>
                        </div>
                        <div>
                          <span className="text-[#2B2725]/60">Completed: </span>
                          <span className="font-medium text-[#1E3A32]">{stats.completed}</span>
                        </div>
                        {course.duration && (
                          <div>
                            <span className="text-[#2B2725]/60">Duration: </span>
                            <span className="font-medium text-[#1E3A32]">{course.duration}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
              </div>
            )}
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <CourseAnalytics courses={courses} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}