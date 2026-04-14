import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "../utils";

export default function Library() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate(createPageUrl("ClientPortal"), { replace: true });
  }, []);
  return null;
});

  const { pullY, isRefreshing, handlers: pullToRefreshHandlers } = usePullToRefresh(async () => {
    await queryClient.invalidateQueries({ queryKey: ["userCourseProgress"] });
    await queryClient.invalidateQueries({ queryKey: ["userLessonProgress"] });
    await queryClient.invalidateQueries({ queryKey: ["upcomingBookings"] });
    await queryClient.invalidateQueries({ queryKey: ["publishedResources"] });
    await queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    await queryClient.invalidateQueries({ queryKey: ["enrolledCourses"] });
  });

  // Single source of truth for user — uses shared cache key
  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ["currentUser"],
    queryFn: () => base44.auth.me(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const { data: userProgress = [], isLoading: progressLoading } = useQuery({
    queryKey: ["userCourseProgress", user?.id],
    queryFn: () => base44.entities.UserCourseProgress.filter({ user_id: user.id }),
    enabled: !!user?.id,
    staleTime: 2 * 60 * 1000,
  });

  const { data: courses = [], isLoading: coursesLoading } = useQuery({
    queryKey: ["enrolledCourses", user?.id],
    queryFn: async () => {
      // Only show courses where user has enrollment records
      const enrolledCourseIds = userProgress.map(p => p.course_id);
      if (enrolledCourseIds.length === 0) return [];
      // Fetch only the specific courses the user is enrolled in
      const enrolledCourses = await Promise.all(
        enrolledCourseIds.map(id => base44.entities.Course.get(id))
      );
      // Filter to only published courses
      return enrolledCourses.filter(c => c && c.status === "published");
    },
    enabled: !!user?.id && !progressLoading,
    staleTime: 2 * 60 * 1000,
  });

  const { data: userLessonProgress = [] } = useQuery({
    queryKey: ["userLessonProgress", user?.id],
    queryFn: () => base44.entities.UserLessonProgress.filter({ user_id: user.id }),
    enabled: !!user?.id,
    staleTime: 2 * 60 * 1000,
  });

  const { data: allModules = [] } = useQuery({
    queryKey: ["allModules"],
    queryFn: () => base44.entities.Module.list(),
    staleTime: 10 * 60 * 1000,
  });

  const { data: allLessons = [] } = useQuery({
    queryKey: ["allLessons"],
    queryFn: () => base44.entities.Lesson.list(),
    staleTime: 10 * 60 * 1000,
  });

  const { data: upcomingBookings = [] } = useQuery({
    queryKey: ["upcomingBookings", user?.id],
    queryFn: async () => {
      const bookings = await base44.entities.Booking.filter({ 
        user_email: user.email,
        booking_status: "confirmed"
      });
      return bookings
        .filter(b => new Date(b.scheduled_date) > new Date())
        .sort((a, b) => new Date(a.scheduled_date) - new Date(b.scheduled_date));
    },
    enabled: !!user?.email,
    staleTime: 2 * 60 * 1000,
  });

  const { data: resources = [] } = useQuery({
    queryKey: ["publishedResources"],
    queryFn: () => base44.entities.Resource.filter({ status: "published" }),
    staleTime: 5 * 60 * 1000,
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const loading = userLoading || (!!user?.id && progressLoading) || (!!user?.id && !progressLoading && coursesLoading);

  if (loading) {
    return (
      <div className="bg-[#F9F5EF] min-h-screen pt-32 flex items-center justify-center">
        <div className="animate-pulse text-[#1E3A32] text-lg">Loading your library...</div>
      </div>
    );
  }

  const isLibraryEmpty = courses.length === 0;

  const getCourseProgress = (courseId) => {
    const progress = userProgress.find(p => p.course_id === courseId);
    return progress?.completion_percentage || 0;
  };

  const getCourseStatus = (courseId) => {
    const progress = userProgress.find(p => p.course_id === courseId);
    if (!progress || progress.status === "not_started") return "Not Started";
    if (progress.status === "completed") return "Completed";
    return "In Progress";
  };

  const coursesByType = {
    toolkit: courses.filter(c => c.type === "Toolkit Module"),
    webinar: courses.filter(c => c.type === "Webinar"),
    audio: courses.filter(c => c.type === "Audio-Based Program"),
    training: courses.filter(c => c.type === "Training Program"),
  };

  const convertCourseToProgramCard = (course) => {
    const progress = getCourseProgress(course.id);
    const status = getCourseStatus(course.id);
    return {
      icon: Layers,
      title: course.title,
      description: course.short_description || course.subtitle,
      progress,
      status,
      primaryAction: { 
        label: status === "Not Started" ? "Start" : status === "Completed" ? "Revisit" : "Continue"
      },
      route: `CoursePage?slug=${course.slug}`,
      color: "#1E3A32"
    };
  };

  const LibrarySection = ({ title, children, sectionKey, emptyMessage }) => {
    const isExpanded = expandedSections[sectionKey];
    const hasContent = React.Children.count(children) > 0;
    if (!hasContent && !emptyMessage) return null;
    return (
      <div className="mb-8">
        <button
          onClick={() => toggleSection(sectionKey)}
          className="w-full flex items-center justify-between mb-4 group"
        >
          <h2 className="font-serif text-2xl text-[#1E3A32]">{title}</h2>
          {isExpanded ? (
            <ChevronUp className="text-[#D8B46B] group-hover:text-[#1E3A32] transition-colors" />
          ) : (
            <ChevronDown className="text-[#D8B46B] group-hover:text-[#1E3A32] transition-colors" />
          )}
        </button>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            {hasContent ? (
              <div className="grid gap-4">{children}</div>
            ) : (
              <div className="bg-white p-8 text-center">
                <p className="text-[#2B2725]/70 leading-relaxed">{emptyMessage}</p>
              </div>
            )}
          </motion.div>
        )}
      </div>
    );
  };

  if (isLibraryEmpty) {
    return (
      <div className="bg-[#F9F5EF] min-h-screen pt-32 pb-24">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="font-serif text-3xl md:text-4xl text-[#1E3A32] mb-4">
              Your Library is Empty (For Now)
            </h1>
            <p className="text-[#2B2725]/70 text-lg leading-relaxed mb-8 max-w-2xl mx-auto">
              You can start anytime. Pocket Visualization™ is a gentle place to begin, or explore all programs to see what resonates.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to={createPageUrl("Programs")}
                className="px-8 py-4 bg-[#1E3A32] text-[#F9F5EF] text-sm tracking-wide hover:bg-[#2B2725] transition-all duration-300"
              >
                Explore Programs
              </Link>
              <Link
                to={createPageUrl("PocketMindset")}
                className="px-8 py-4 border border-[#D8B46B] text-[#1E3A32] text-sm tracking-wide hover:bg-[#D8B46B]/10 transition-all duration-300"
              >
                Explore Pocket Mindset™
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F9F5EF] min-h-screen pt-32 pb-24" {...pullToRefreshHandlers}>
      <div className="max-w-6xl mx-auto px-6">
        {pullY > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: pullY / 100 }}
            className="flex justify-center py-4"
          >
            <div className={`text-[#D8B46B] ${isRefreshing ? 'animate-spin' : ''}`}>
              {isRefreshing ? '↻' : '↓'} {isRefreshing ? 'Refreshing...' : 'Pull to refresh'}
            </div>
          </motion.div>
        )}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="mb-12">
            <div className="flex items-center justify-between gap-4 mb-3">
              <div>
                <h1 className="font-serif text-3xl md:text-4xl text-[#1E3A32]">
                  Your Learning Library
                </h1>
                <p className="text-[#2B2725]/60 text-lg italic mt-2">
                  Your courses and learning progress. {userProgress.length > 0 ? "Continue where you left off." : "Start your transformation journey."}
                </p>
              </div>
              <Link 
                to={createPageUrl("ClientPortal")}
                className="whitespace-nowrap px-6 py-3 bg-[#1E3A32] text-white text-sm tracking-wide hover:bg-[#2B2725] transition-all"
              >
                View All Products →
              </Link>
            </div>
          </div>

          {/* Student Dashboard View */}
          {showDashboard && userProgress.length > 0 && (
            <StudentDashboard
              courses={courses}
              userProgress={userProgress}
              userLessonProgress={userLessonProgress}
              allLessons={allLessons}
              modules={allModules}
              upcomingBookings={upcomingBookings}
            />
          )}

          <>
            {/* Resources Card */}
            <Link to={createPageUrl("Resources")}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                className="bg-gradient-to-br from-[#D8B46B] to-[#C9A55B] p-8 mb-8 cursor-pointer shadow-lg hover:shadow-xl transition-all"
              >
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileText size={32} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-serif text-2xl text-white mb-2">Resource Library</h3>
                    <p className="text-white/90 mb-4">
                      Access worksheets, guides, audio sessions, and tools to support your journey.
                    </p>
                    <div className="flex items-center gap-6 text-sm text-white/80">
                      <span>{resources.length} Resources Available</span>
                      {resources.filter(r => r.featured).length > 0 && (
                        <span>• {resources.filter(r => r.featured).length} Featured</span>
                      )}
                      {resources.filter(r => r.access_level === "public").length > 0 && (
                        <span>• {resources.filter(r => r.access_level === "public").length} Free</span>
                      )}
                    </div>
                  </div>
                  <div className="text-white/60 self-center">
                    <ChevronDown size={24} className="rotate-[-90deg]" />
                  </div>
                </div>
              </motion.div>
            </Link>

            {/* Toolkit Modules */}
            <LibrarySection 
              title="Mind Style Toolkit" 
              sectionKey="programs"
              emptyMessage="Toolkit modules will appear here as they become available."
            >
              {coursesByType.toolkit.map((course) => (
                <ProgramCard key={course.id} program={convertCourseToProgramCard(course)} />
              ))}
            </LibrarySection>

            {/* Webinars */}
            <LibrarySection 
              title="Webinars" 
              sectionKey="webinars"
              emptyMessage="Webinars offer bite-sized insights to expand your Mind Style toolkit. Add any webinar to your library to watch instantly."
            >
              {coursesByType.webinar.map((course) => (
                <ProgramCard key={course.id} program={convertCourseToProgramCard(course)} />
              ))}
            </LibrarySection>

            {/* Audio Programs */}
            <LibrarySection 
              title="Audio Programs" 
              sectionKey="audio"
              emptyMessage="Audio-based programs will appear here."
            >
              {coursesByType.audio.map((course) => (
                <ProgramCard key={course.id} program={convertCourseToProgramCard(course)} />
              ))}
            </LibrarySection>

            {/* Training & Certification */}
            <LibrarySection 
              title="Training & Certification" 
              sectionKey="training"
              emptyMessage="Training and certification programs will appear here."
            >
              {coursesByType.training.map((course) => (
                <ProgramCard key={course.id} program={convertCourseToProgramCard(course)} />
              ))}
            </LibrarySection>
          </>
        </motion.div>
      </div>
    </div>
  );
}