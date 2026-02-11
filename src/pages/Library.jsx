import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "../utils";
import { motion } from "framer-motion";
import { Layers, Sparkles, Play, Headphones, Users, Award, ChevronDown, ChevronUp, FileText } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import ProgramCard from "../components/library/ProgramCard";
import StudentDashboard from "../components/library/StudentDashboard";
import AILearningPathRecommender from "../components/library/AILearningPathRecommender";
import { base44 } from "@/api/base44Client";
import { usePullToRefresh } from "@/components/utils/usePullToRefresh";
import { useQueryClient } from "@tanstack/react-query";

export default function Library() {
  const [user, setUser] = useState(null);
  const [courses, setCourses] = useState([]);
  const [userProgress, setUserProgress] = useState([]);
  const [showDashboard, setShowDashboard] = useState(true);
  const [userAccess, setUserAccess] = useState({
    hasToolkit: false,
    hasPocketVisualization: false,
    hasWebinars: [],
    hasAudio: false,
    hasSalon: false,
    hasCouture: false,
    hasHypnosisTraining: false
  });
  const [expandedSections, setExpandedSections] = useState({
    featured: true,
    programs: true,
    pocketVisualization: true,
    webinars: true,
    audio: true,
    coaching: false,
    training: false,
    comingSoon: false
  });

  const { data: userLessonProgress = [] } = useQuery({
    queryKey: ["userLessonProgress", user?.id],
    queryFn: () => base44.entities.UserLessonProgress.filter({ user_id: user.id }),
    enabled: !!user?.id,
  });

  const { data: allModules = [] } = useQuery({
    queryKey: ["allModules"],
    queryFn: () => base44.entities.Module.list(),
  });

  const { data: allLessons = [] } = useQuery({
    queryKey: ["allLessons"],
    queryFn: () => base44.entities.Lesson.list(),
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
  });

  const { data: resources = [] } = useQuery({
    queryKey: ["publishedResources"],
    queryFn: () => base44.entities.Resource.filter({ status: "published" }),
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
        
        // Fetch all published courses
        const allCourses = await base44.entities.Course.filter({ status: "published" });
        
        // Fetch user's course progress
        const progress = await base44.entities.UserCourseProgress.filter({ user_id: currentUser.id });
        setUserProgress(progress);
        
        // TODO: Filter courses by product linkage and user's purchases
        // For now, showing all published courses
        setCourses(allCourses);
        
        // TODO: Fetch user's access flags and purchased products
        // For now, using mock data
        setUserAccess({
          hasToolkit: false,
          hasPocketVisualization: false,
          hasWebinars: [],
          hasAudio: false,
          hasSalon: false,
          hasCouture: false,
          hasHypnosisTraining: false
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchData();
  }, []);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Check if library is completely empty
  const isLibraryEmpty = !userAccess.hasToolkit && 
                         !userAccess.hasPocketVisualization && 
                         (!userAccess.hasWebinars || userAccess.hasWebinars.length === 0) &&
                         !userAccess.hasAudio &&
                         !userAccess.hasSalon &&
                         !userAccess.hasCouture &&
                         !userAccess.hasHypnosisTraining;

  // Featured Programs (top 3 most relevant)
  const featuredPrograms = [];
  if (userAccess.hasPocketVisualization) {
    featuredPrograms.push({
      icon: Sparkles,
      title: "Pocket Visualization™",
      description: "Your daily guided experiences for emotional resets.",
      status: "Subscription Active",
      primaryAction: { label: "Open", onClick: () => {} },
      route: "PocketVisualization",
      color: "#A6B7A3"
    });
  }
  if (userAccess.hasToolkit) {
    featuredPrograms.push({
      icon: Layers,
      title: "Mind Style Toolkit",
      description: "Your complete transformation program.",
      progress: 35,
      status: "In Progress",
      primaryAction: { label: "Continue" },
      route: "Evolution",
      color: "#1E3A32"
    });
  }

  // Convert courses to program cards
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
      progress: progress,
      status: status,
      primaryAction: { 
        label: status === "Not Started" ? "Start" : status === "Completed" ? "Revisit" : "Continue"
      },
      route: `CoursePage?slug=${course.slug}`,
      color: "#1E3A32"
    };
  };

  // Webinars
  const webinars = [
    {
      icon: Play,
      title: "Mini-Webinar: Imposter Myths to Ditch",
      description: "Stop letting imposter feelings run your decisions.",
      status: userAccess.hasWebinars?.includes("imposter") ? "Owned" : "Not Enrolled",
      primaryAction: { 
        label: userAccess.hasWebinars?.includes("imposter") ? "Watch Now" : "Get This Webinar ($9)"
      },
      color: "#6E4F7D"
    },
    {
      icon: Play,
      title: "Mini-Webinar: Don't Let Your Thoughts Think for You",
      description: "Learn to observe your thoughts without being controlled by them.",
      status: userAccess.hasWebinars?.includes("thoughts") ? "Owned" : "Not Enrolled",
      primaryAction: { 
        label: userAccess.hasWebinars?.includes("thoughts") ? "Watch Now" : "Get This Webinar ($9)"
      },
      color: "#6E4F7D"
    }
  ];

  // Audio Series
  const audioSeries = {
    icon: Headphones,
    title: "Mind Declutter Audio Series",
    description: "Clear your mental space with guided audio sessions.",
    status: userAccess.hasAudio ? "Owned" : "Not Enrolled",
    primaryAction: { 
      label: userAccess.hasAudio ? "Listen Now" : "Get Audio Series"
    },
    color: "#D8B46B"
  };

  // Coaching Programs
  const coachingPrograms = [];
  if (userAccess.hasSalon) {
    coachingPrograms.push({
      icon: Users,
      title: "Salon — Group Coaching",
      description: "Your cohort meets twice monthly for deep work.",
      status: "Active",
      primaryAction: { label: "Join Session" },
      secondaryAction: { label: "View Schedule", onClick: () => {} },
      color: "#1E3A32"
    });
  }
  if (userAccess.hasCouture) {
    coachingPrograms.push({
      icon: Award,
      title: "Couture — 1:1 Coaching",
      description: "Your private intensive coaching program.",
      status: "Active",
      primaryAction: { label: "Your Sessions" },
      secondaryAction: { label: "Upload Documents", onClick: () => {} },
      color: "#6E4F7D"
    });
  }

  // Training Programs
  const trainingPrograms = userAccess.hasHypnosisTraining ? [
    {
      icon: Award,
      title: "Hypnosis Training — Certification Track",
      description: "Professional hypnosis certification program.",
      progress: 20,
      status: "In Progress",
      primaryAction: { label: "Continue Training" },
      color: "#1E3A32"
    }
  ] : [];

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
              <div className="grid gap-4">
                {children}
              </div>
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
                to={createPageUrl("PocketVisualization")}
                className="px-8 py-4 border border-[#D8B46B] text-[#1E3A32] text-sm tracking-wide hover:bg-[#D8B46B]/10 transition-all duration-300"
              >
                Subscribe to Pocket Visualization™
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F9F5EF] min-h-screen pt-32 pb-24">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-3">
              <h1 className="font-serif text-3xl md:text-4xl text-[#1E3A32]">
                Your Library
              </h1>
              {userProgress.length > 0 && (
                <div className="flex gap-2">
                  <Button
                    variant={showDashboard ? "default" : "outline"}
                    size="sm"
                    onClick={() => setShowDashboard(true)}
                    className={showDashboard ? "bg-[#1E3A32]" : ""}
                  >
                    Dashboard
                  </Button>
                  <Button
                    variant={!showDashboard ? "default" : "outline"}
                    size="sm"
                    onClick={() => setShowDashboard(false)}
                    className={!showDashboard ? "bg-[#1E3A32]" : ""}
                  >
                    Browse All
                  </Button>
                </div>
              )}
            </div>
            <p className="text-[#2B2725]/60 text-lg italic">
              Everything you've unlocked lives here. Continue your journey at your own pace.
            </p>
          </div>

          {/* AI Learning Path Recommender */}
          {user && (
            <div className="mb-8">
              <AILearningPathRecommender />
            </div>
          )}

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

          {/* Traditional Library View */}
          {!showDashboard && (
            <div>

          {/* Resources Card - Prominent placement */}
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

          {/* Featured Programs */}
          {featuredPrograms.length > 0 && (
            <LibrarySection 
              title="Your Featured Programs" 
              sectionKey="featured"
            >
              {featuredPrograms.map((program, index) => (
                <ProgramCard key={index} program={program} />
              ))}
            </LibrarySection>
          )}

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

          {/* Pocket Visualization */}
          <LibrarySection 
            title="Pocket Visualization™" 
            sectionKey="pocketVisualization"
            emptyMessage="Pocket Visualization™ offers guided micro-sessions for emotional resets throughout your day. Subscribe to unlock daily access."
          >
            {userAccess.hasPocketVisualization && featuredPrograms[0] && (
              <ProgramCard program={featuredPrograms[0]} />
            )}
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

          {/* Coaching Programs */}
          {coachingPrograms.length > 0 && (
            <LibrarySection 
              title="Coaching Programs" 
              sectionKey="coaching"
            >
              {coachingPrograms.map((program, index) => (
                <ProgramCard key={index} program={program} />
              ))}
            </LibrarySection>
          )}

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

          {/* Contextual Suggestion */}
          {!userAccess.hasToolkit && userAccess.hasPocketVisualization && (
            <div className="mt-12 bg-[#A6B7A3]/20 p-8 border-l-4 border-[#A6B7A3]">
              <h3 className="font-serif text-xl text-[#1E3A32] mb-3">
                A next good step might be…
              </h3>
              <p className="text-[#2B2725]/70 mb-4">
                The Mind Style Toolkit would deepen what you're already exploring with Pocket Visualization™.
              </p>
              <Link
                to={createPageUrl("Programs")}
                className="inline-block px-6 py-3 bg-[#1E3A32] text-[#F9F5EF] text-sm tracking-wide hover:bg-[#2B2725] transition-all duration-300"
              >
                Explore Toolkit
              </Link>
            </div>
            )}
          </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}