import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Save, Eye, Sparkles, BookTemplate, Monitor } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import CourseTypeSelector from "../components/courses/builder/CourseTypeSelector";
import CourseBasicsForm from "../components/courses/builder/CourseBasicsForm";
import CurriculumBuilder from "../components/courses/builder/CurriculumBuilder";
import LessonEditor from "../components/courses/builder/LessonEditor";
import CourseSettings from "../components/courses/builder/CourseSettings";
import AICourseGenerator from "../components/courses/builder/AICourseGenerator";
import CourseTemplates from "../components/courses/builder/CourseTemplates";
import { createPageUrl } from "../utils";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

export default function CourseBuilder() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    type: "",
    status: "draft",
    visibility: "public",
  });
  const [modules, setModules] = useState([]);
  const [editingLesson, setEditingLesson] = useState(null);
  const [showAIGenerator, setShowAIGenerator] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);

  // Get course ID from URL if editing
  const urlParams = new URLSearchParams(window.location.search);
  const courseId = urlParams.get("id");

  // Load existing course if editing
  useEffect(() => {
    if (courseId) {
      const loadCourse = async () => {
        const courses = await base44.entities.Course.filter({ id: courseId });
        if (courses[0]) {
          setFormData(courses[0]);
          // Load modules and lessons
          const courseModules = await base44.entities.Module.filter(
            { course_id: courseId },
            "order"
          );
          const modulesWithLessons = await Promise.all(
            courseModules.map(async (mod) => {
              const lessons = await base44.entities.Lesson.filter(
                { module_id: mod.id },
                "order"
              );
              return { ...mod, lessons };
            })
          );
          setModules(modulesWithLessons);
        }
      };
      loadCourse();
    }
  }, [courseId]);

  // Save course
  const saveMutation = useMutation({
    mutationFn: async () => {
      // Generate slug from title
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

      const courseData = { ...formData, slug };

      let savedCourse;
      if (courseId) {
        savedCourse = await base44.entities.Course.update(courseId, courseData);
      } else {
        savedCourse = await base44.entities.Course.create(courseData);
      }

      // Save modules and lessons
      for (const module of modules) {
        const moduleData = {
          course_id: savedCourse.id,
          title: module.title,
          description: module.description,
          order: module.order,
        };

        let savedModule;
        if (module.id.startsWith("temp-")) {
          savedModule = await base44.entities.Module.create(moduleData);
        } else {
          savedModule = await base44.entities.Module.update(module.id, moduleData);
        }

        // Save lessons
        for (const lesson of module.lessons || []) {
          const lessonData = {
            module_id: savedModule.id,
            title: lesson.title,
            type: lesson.type,
            content: lesson.content,
            media_url: lesson.media_url,
            embed_url: lesson.embed_url,
            duration: lesson.duration,
            key_takeaways: lesson.key_takeaways,
            resources: lesson.resources,
            attached_resource_ids: lesson.attached_resource_ids || [],
            order: lesson.order,
          };

          if (lesson.id.startsWith("temp-")) {
            await base44.entities.Lesson.create(lessonData);
          } else {
            await base44.entities.Lesson.update(lesson.id, lessonData);
          }
        }
      }

      // Auto-sync with Stripe
      try {
        const syncResult = await base44.functions.invoke('syncCourseStripe', {
          course_id: savedCourse.id,
          title: savedCourse.title,
          description: savedCourse.short_description || savedCourse.long_description,
        });

        if (syncResult.data.success && syncResult.data.product_id) {
          // Update course with Stripe product ID
          await base44.entities.Course.update(savedCourse.id, {
            product_linkage: [syncResult.data.product_id],
          });
        }
      } catch (error) {
        console.error('Stripe sync failed:', error);
      }

      return savedCourse;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
  });

  const handleSave = async () => {
    await saveMutation.mutateAsync();
    toast.success("Course saved and synced with Stripe!");
  };

  const handlePublish = async () => {
    setFormData({ ...formData, status: "published" });
    await saveMutation.mutateAsync();
    toast.success("Course published and synced with Stripe!");
    navigate(createPageUrl("CourseManager"));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setFormData({ ...formData, thumbnail: file_url });
    }
  };

  const handleMediaUpload = async (e, lessonId, moduleId) => {
    const file = e.target.files[0];
    if (file) {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      const updatedModules = modules.map((mod) => {
        if (mod.id === moduleId) {
          return {
            ...mod,
            lessons: mod.lessons.map((l) =>
              l.id === lessonId ? { ...l, media_url: file_url } : l
            ),
          };
        }
        return mod;
      });
      setModules(updatedModules);
    }
  };

  const handleAIGenerate = (generatedCourse) => {
    setFormData({ ...formData, ...generatedCourse });
    setModules(generatedCourse.modules);
    setStep(2); // Go to basics to review
  };

  const handleTemplateSelect = (template) => {
    setFormData({ ...formData, ...template });
    setModules(template.modules);
    setStep(2); // Go to basics to review
  };

  const steps = [
    { number: 1, title: "Type" },
    { number: 2, title: "Basics" },
    { number: 3, title: "Curriculum" },
    { number: 4, title: "Settings" },
  ];

  const canProceed = () => {
    if (step === 1) return formData.type;
    if (step === 2) return formData.title;
    if (step === 3) return modules.length > 0;
    return true;
  };

  const currentLesson = editingLesson
    ? modules
        .find((m) => m.id === editingLesson.moduleId)
        ?.lessons.find((l) => l.id === editingLesson.lessonId)
    : null;

  return (
    <div className="min-h-screen bg-[#F9F5EF] py-8">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate(createPageUrl("CourseManager"))}
            className="mb-4"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to Courses
          </Button>
          <div className="flex justify-between items-center">
            <h1 className="font-serif text-4xl text-[#1E3A32]">
              {courseId ? "Edit Course" : "Create New Course"}
            </h1>
            {!courseId && step === 1 && (
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowTemplates(true)}
                  className="border-[#D8B46B] hover:bg-[#D8B46B]/10"
                >
                  <BookTemplate size={16} className="mr-2" />
                  Use Template
                </Button>
                <Button
                  onClick={() => setShowAIGenerator(true)}
                  className="bg-gradient-to-r from-[#6E4F7D] to-[#8B659B] hover:from-[#5D3E6C] hover:to-[#7A5487] text-white"
                >
                  <Sparkles size={16} className="mr-2" />
                  AI Generate
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-between mb-12">
          {steps.map((s, index) => (
            <div key={s.number} className="flex-1 flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-medium ${
                  step >= s.number
                    ? "bg-[#1E3A32] text-[#F9F5EF]"
                    : "bg-[#E4D9C4] text-[#2B2725]/60"
                }`}
              >
                {s.number}
              </div>
              <div className="ml-3">
                <p
                  className={`text-sm font-medium ${
                    step >= s.number ? "text-[#1E3A32]" : "text-[#2B2725]/60"
                  }`}
                >
                  {s.title}
                </p>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-4 ${
                    step > s.number ? "bg-[#1E3A32]" : "bg-[#E4D9C4]"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-lg p-8 mb-8 min-h-[500px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              {step === 1 && (
                <CourseTypeSelector
                  selectedType={formData.type}
                  onSelect={(type) => setFormData({ ...formData, type })}
                />
              )}
              {step === 2 && (
                <CourseBasicsForm
                  formData={formData}
                  onChange={setFormData}
                  onImageUpload={handleImageUpload}
                />
              )}
              {step === 3 && (
                <CurriculumBuilder modules={modules} onUpdate={setModules} />
              )}
              {step === 4 && (
                <CourseSettings formData={formData} onChange={setFormData} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => setStep(Math.max(1, step - 1))}
            disabled={step === 1}
          >
            <ArrowLeft size={16} className="mr-2" />
            Previous
          </Button>

          <div className="flex gap-3">
            <Button variant="outline" onClick={handleSave} disabled={saveMutation.isPending}>
              <Save size={16} className="mr-2" />
              Save Draft
            </Button>

            {courseId && (
              <Button
                variant="outline"
                onClick={async () => {
                  await handleSave();
                  navigate(createPageUrl("CoursePreview?id=" + courseId));
                }}
                disabled={saveMutation.isPending}
              >
                <Monitor size={16} className="mr-2" />
                Preview
              </Button>
            )}

            {step < 4 ? (
              <Button
                onClick={() => setStep(Math.min(4, step + 1))}
                disabled={!canProceed()}
                className="bg-[#1E3A32] hover:bg-[#2B2725] text-[#F9F5EF]"
              >
                Next
                <ArrowRight size={16} className="ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handlePublish}
                disabled={!formData.title || saveMutation.isPending}
                className="bg-[#1E3A32] hover:bg-[#2B2725] text-[#F9F5EF]"
              >
                <Eye size={16} className="mr-2" />
                Publish Course
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* AI Generator */}
      {showAIGenerator && (
        <AICourseGenerator
          onGenerate={handleAIGenerate}
          onClose={() => setShowAIGenerator(false)}
        />
      )}

      {/* Templates */}
      {showTemplates && (
        <CourseTemplates
          onSelectTemplate={handleTemplateSelect}
          onClose={() => setShowTemplates(false)}
        />
      )}

      {/* Lesson Editor Modal */}
      {editingLesson && currentLesson && (
        <LessonEditor
          lesson={currentLesson}
          allLessons={modules.flatMap(m => m.lessons || [])}
          modules={modules}
          onUpdate={(updatedLesson) => {
            const updatedModules = modules.map((mod) => {
              if (mod.id === editingLesson.moduleId) {
                return {
                  ...mod,
                  lessons: mod.lessons.map((l) =>
                    l.id === editingLesson.lessonId ? updatedLesson : l
                  ),
                };
              }
              return mod;
            });
            setModules(updatedModules);
          }}
          onClose={() => setEditingLesson(null)}
          onMediaUpload={(e) =>
            handleMediaUpload(e, editingLesson.lessonId, editingLesson.moduleId)
          }
        />
      )}
    </div>
  );
}