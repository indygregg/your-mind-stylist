import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, GripVertical, Edit, Trash2, ChevronDown, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function CurriculumBuilder({ modules, onUpdate }) {
  const [expandedModules, setExpandedModules] = useState({});
  const [editingModule, setEditingModule] = useState(null);
  const [editingLesson, setEditingLesson] = useState(null);

  const addModule = () => {
    const newModule = {
      id: `temp-${Date.now()}`,
      title: "New Module",
      description: "",
      order: modules.length + 1,
      lessons: [],
    };
    onUpdate([...modules, newModule]);
    setExpandedModules({ ...expandedModules, [newModule.id]: true });
    setEditingModule(newModule.id);
  };

  const addLesson = (moduleId) => {
    const updatedModules = modules.map((mod) => {
      if (mod.id === moduleId) {
        const newLesson = {
          id: `temp-${Date.now()}`,
          title: "New Lesson",
          type: "video",
          order: (mod.lessons || []).length + 1,
        };
        return { ...mod, lessons: [...(mod.lessons || []), newLesson] };
      }
      return mod;
    });
    onUpdate(updatedModules);
    setEditingLesson({ moduleId, lessonId: `temp-${Date.now()}` });
  };

  const updateModule = (moduleId, field, value) => {
    const updatedModules = modules.map((mod) =>
      mod.id === moduleId ? { ...mod, [field]: value } : mod
    );
    onUpdate(updatedModules);
  };

  const deleteModule = (moduleId) => {
    if (confirm("Delete this module and all its lessons?")) {
      onUpdate(modules.filter((mod) => mod.id !== moduleId));
    }
  };

  const deleteLesson = (moduleId, lessonId) => {
    if (confirm("Delete this lesson?")) {
      const updatedModules = modules.map((mod) => {
        if (mod.id === moduleId) {
          return { ...mod, lessons: mod.lessons.filter((l) => l.id !== lessonId) };
        }
        return mod;
      });
      onUpdate(updatedModules);
    }
  };

  const toggleModule = (moduleId) => {
    setExpandedModules({ ...expandedModules, [moduleId]: !expandedModules[moduleId] });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="font-serif text-3xl text-[#1E3A32] mb-3">
          Build Your Curriculum
        </h2>
        <p className="text-[#2B2725]/70">
          Organize your course into modules and lessons
        </p>
      </div>

      <div className="space-y-4 mb-6">
        <AnimatePresence>
          {modules.map((module, moduleIndex) => (
            <motion.div
              key={module.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white border border-[#E4D9C4] rounded-lg overflow-hidden"
            >
              {/* Module Header */}
              <div className="flex items-start gap-3 p-4 bg-[#F9F5EF]">
                <GripVertical className="text-[#2B2725]/40 mt-1 cursor-move" size={20} />
                <div className="flex-1">
                  {editingModule === module.id ? (
                    <div className="space-y-2">
                      <Input
                        value={module.title}
                        onChange={(e) => updateModule(module.id, "title", e.target.value)}
                        onBlur={() => setEditingModule(null)}
                        autoFocus
                        className="font-medium"
                      />
                      <Textarea
                        value={module.description || ""}
                        onChange={(e) => updateModule(module.id, "description", e.target.value)}
                        placeholder="Module description (optional)"
                        className="text-sm"
                      />
                    </div>
                  ) : (
                    <div>
                      <h3 className="font-medium text-[#1E3A32] mb-1">
                        Module {moduleIndex + 1}: {module.title}
                      </h3>
                      {module.description && (
                        <p className="text-sm text-[#2B2725]/70">{module.description}</p>
                      )}
                      <p className="text-xs text-[#2B2725]/50 mt-1">
                        {(module.lessons || []).length} lesson(s)
                      </p>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleModule(module.id)}
                  >
                    {expandedModules[module.id] ? (
                      <ChevronDown size={16} />
                    ) : (
                      <ChevronRight size={16} />
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditingModule(module.id)}
                  >
                    <Edit size={16} />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteModule(module.id)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>

              {/* Lessons */}
              <AnimatePresence>
                {expandedModules[module.id] && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: "auto" }}
                    exit={{ height: 0 }}
                    className="border-t border-[#E4D9C4]"
                  >
                    <div className="p-4 space-y-2">
                      {(module.lessons || []).map((lesson, lessonIndex) => (
                        <div
                          key={lesson.id}
                          className="flex items-center gap-3 p-3 bg-[#F9F5EF] rounded"
                        >
                          <GripVertical className="text-[#2B2725]/40 cursor-move" size={16} />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-[#1E3A32]">
                              {lessonIndex + 1}. {lesson.title}
                            </p>
                            <p className="text-xs text-[#2B2725]/60 capitalize">{lesson.type}</p>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingLesson({ moduleId: module.id, lessonId: lesson.id })}
                          >
                            <Edit size={14} />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteLesson(module.id, lesson.id)}
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => addLesson(module.id)}
                        className="w-full border-dashed"
                      >
                        <Plus size={16} className="mr-2" />
                        Add Lesson
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <Button
        type="button"
        onClick={addModule}
        className="w-full bg-[#1E3A32] hover:bg-[#2B2725] text-[#F9F5EF]"
      >
        <Plus size={16} className="mr-2" />
        Add Module
      </Button>
    </div>
  );
}