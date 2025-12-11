import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, Users, Play, Download, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import VideoPlayer from "../components/courses/VideoPlayer";
import WebinarQA from "../components/courses/WebinarQA";
import WebinarResources from "../components/courses/WebinarResources";

export default function WebinarPage() {
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  const urlParams = new URLSearchParams(window.location.search);
  const slug = urlParams.get("slug");

  // Fetch webinar (it's a Course entity with type="Webinar")
  const { data: webinars = [] } = useQuery({
    queryKey: ["webinar", slug],
    queryFn: () => base44.entities.Course.filter({ slug, type: "Webinar" }),
    enabled: !!slug,
  });
  const webinar = webinars[0];

  // Fetch modules (webinar typically has 1 module)
  const { data: modules = [] } = useQuery({
    queryKey: ["webinar-modules", webinar?.id],
    queryFn: () => base44.entities.Module.filter({ course_id: webinar.id }, "order"),
    enabled: !!webinar?.id,
  });

  // Fetch lessons (webinar video/content)
  const { data: lessons = [] } = useQuery({
    queryKey: ["webinar-lessons", modules[0]?.id],
    queryFn: () => base44.entities.Lesson.filter({ module_id: modules[0].id }, "order"),
    enabled: !!modules[0]?.id,
  });

  // Fetch user progress
  const { data: userProgress = [] } = useQuery({
    queryKey: ["user-progress", user?.id, webinar?.id],
    queryFn: () => base44.entities.UserCourseProgress.filter({ 
      user_id: user.id, 
      course_id: webinar.id 
    }),
    enabled: !!user?.id && !!webinar?.id,
  });

  const progress = userProgress[0];
  const mainLesson = lessons[0]; // Webinars typically have one main video lesson

  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = await base44.auth.me();
      setUser(currentUser);
    };
    fetchUser();
  }, []);

  // Enroll in webinar
  const enrollMutation = useMutation({
    mutationFn: async () => {
      await base44.entities.UserCourseProgress.create({
        user_id: user.id,
        course_id: webinar.id,
        status: "in_progress",
        started_date: new Date().toISOString(),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-progress"] });
      setActiveTab("watch");
    },
  });

  // Mark as completed
  const completeMutation = useMutation({
    mutationFn: async () => {
      await base44.entities.UserCourseProgress.update(progress.id, {
        status: "completed",
        completion_percentage: 100,
        completed_date: new Date().toISOString(),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-progress"] });
    },
  });

  if (!webinar) {
    return (
      <div className="min-h-screen bg-[#F9F5EF] flex items-center justify-center">
        <p className="text-[#2B2725]/70">Loading webinar...</p>
      </div>
    );
  }

  const isEnrolled = !!progress;
  const isCompleted = progress?.status === "completed";

  return (
    <div className="min-h-screen bg-[#F9F5EF]">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-[#6E4F7D] to-[#1E3A32] text-white py-20">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="bg-white/20 text-white mb-4">Webinar</Badge>
            <h1 className="font-serif text-4xl md:text-5xl mb-4">{webinar.title}</h1>
            {webinar.subtitle && (
              <p className="text-xl text-white/90 mb-6">{webinar.subtitle}</p>
            )}

            {/* Metadata */}
            <div className="flex flex-wrap gap-6 text-sm">
              {webinar.duration && (
                <div className="flex items-center gap-2">
                  <Clock size={16} />
                  <span>{webinar.duration}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Users size={16} />
                <span>{userProgress.length} enrolled</span>
              </div>
              <div className="flex items-center gap-2">
                <Play size={16} />
                <span>Watch Anytime</span>
              </div>
            </div>

            {!isEnrolled && (
              <Button
                onClick={() => enrollMutation.mutate()}
                className="mt-8 bg-white text-[#6E4F7D] hover:bg-white/90"
                disabled={enrollMutation.isPending}
              >
                {enrollMutation.isPending ? "Enrolling..." : "Start Watching"}
              </Button>
            )}
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            {isEnrolled && <TabsTrigger value="watch">Watch</TabsTrigger>}
            <TabsTrigger value="resources">Resources</TabsTrigger>
            <TabsTrigger value="qa">Q&A</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="bg-white p-8 rounded-lg">
              <h2 className="font-serif text-2xl text-[#1E3A32] mb-4">
                What You'll Learn
              </h2>
              <div
                className="prose prose-lg max-w-none text-[#2B2725]/80 mb-8"
                dangerouslySetInnerHTML={{ __html: webinar.long_description }}
              />

              {webinar.learning_outcomes && webinar.learning_outcomes.length > 0 && (
                <div className="mb-8">
                  <h3 className="font-serif text-xl text-[#1E3A32] mb-4">
                    Key Takeaways
                  </h3>
                  <ul className="space-y-2">
                    {webinar.learning_outcomes.map((outcome, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="text-[#6E4F7D] mt-1">✦</span>
                        <span className="text-[#2B2725]/80">{outcome}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {!isEnrolled && (
                <Button
                  onClick={() => enrollMutation.mutate()}
                  className="bg-[#6E4F7D] hover:bg-[#1E3A32] text-white"
                  disabled={enrollMutation.isPending}
                >
                  {enrollMutation.isPending ? "Enrolling..." : "Start Watching"}
                </Button>
              )}
            </div>
          </TabsContent>

          {/* Watch Tab */}
          {isEnrolled && (
            <TabsContent value="watch">
              <div className="bg-white p-8 rounded-lg">
                {mainLesson ? (
                  <div>
                    <VideoPlayer
                      lesson={mainLesson}
                      onProgressUpdate={() => {}}
                      onComplete={() => completeMutation.mutate()}
                    />
                    
                    {mainLesson.content && (
                      <div
                        className="mt-8 prose prose-lg max-w-none"
                        dangerouslySetInnerHTML={{ __html: mainLesson.content }}
                      />
                    )}

                    {!isCompleted && (
                      <Button
                        onClick={() => completeMutation.mutate()}
                        className="mt-6 bg-[#6E4F7D] hover:bg-[#1E3A32] text-white"
                      >
                        Mark as Complete
                      </Button>
                    )}
                  </div>
                ) : (
                  <p className="text-[#2B2725]/70">
                    Webinar video will be available here.
                  </p>
                )}
              </div>
            </TabsContent>
          )}

          {/* Resources Tab */}
          <TabsContent value="resources">
            <WebinarResources lesson={mainLesson} />
          </TabsContent>

          {/* Q&A Tab */}
          <TabsContent value="qa">
            <WebinarQA webinarId={webinar.id} user={user} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}