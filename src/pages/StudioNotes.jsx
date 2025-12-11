import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BookOpen, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import NotesTimeline from "@/components/studio/NotesTimeline";
import NotesDrawer from "@/components/studio/NotesDrawer";
import EmotionalTrends from "@/components/studio/EmotionalTrends";

export default function StudioNotes() {
  const [notesDrawerOpen, setNotesDrawerOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: notes = [], isLoading } = useQuery({
    queryKey: ['notes'],
    queryFn: async () => {
      const allNotes = await base44.entities.Note.list('-created_date');
      return allNotes;
    },
  });

  const spotlightMutation = useMutation({
    mutationFn: async ({ noteId, spotlight }) => {
      await base44.entities.Note.update(noteId, { spotlight });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });

  // Format trends data for EmotionalTrends component
  const trendsData = notes
    .filter(note => note.sentiment_primary)
    .map(note => ({
      date: new Date(note.created_date).toLocaleDateString(),
      emotion: note.sentiment_primary,
    }));

  if (isLoading) {
    return (
      <div className="bg-[#F9F5EF] min-h-screen pt-32 pb-24">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex items-center justify-center py-20">
            <div className="animate-pulse text-[#2B2725]/60">Loading your notes...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F9F5EF] min-h-screen pt-32 pb-24">
      <NotesDrawer
        isOpen={notesDrawerOpen}
        onClose={() => setNotesDrawerOpen(false)}
        sourceType="freeform"
      />

      <div className="max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-[#D8B46B] text-xs tracking-[0.3em] uppercase mb-2 block">
                Mind Styling Studio
              </span>
              <h1 className="font-serif text-3xl md:text-4xl text-[#1E3A32] flex items-center gap-3">
                <BookOpen size={32} className="text-[#D8B46B]" />
                Your Notes
              </h1>
            </div>
            <Button
              onClick={() => setNotesDrawerOpen(true)}
              className="bg-[#1E3A32] hover:bg-[#2B2725] text-[#F9F5EF]"
            >
              <Plus size={18} className="mr-2" />
              New Note
            </Button>
          </div>

          {/* Emotional Trends */}
          {trendsData.length > 0 && (
            <div className="mb-8">
              <EmotionalTrends trendsData={trendsData} />
            </div>
          )}

          {/* Spotlighted Notes */}
          {notes.filter(n => n.spotlight).length > 0 && (
            <div className="mb-8">
              <h2 className="font-serif text-xl text-[#1E3A32] mb-4 flex items-center gap-2">
                Your Spotlights
              </h2>
              <NotesTimeline
                notes={notes.filter(n => n.spotlight)}
                onSpotlight={(id, value) => spotlightMutation.mutate({ noteId: id, spotlight: value })}
              />
            </div>
          )}

          {/* All Notes */}
          <div>
            <h2 className="font-serif text-xl text-[#1E3A32] mb-4">
              All Notes ({notes.length})
            </h2>
            <NotesTimeline
              notes={notes}
              onSpotlight={(id, value) => spotlightMutation.mutate({ noteId: id, spotlight: value })}
            />
          </div>

          {/* Empty State */}
          {notes.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <BookOpen size={64} className="text-[#D8B46B]/30 mx-auto mb-6" />
              <h3 className="font-serif text-2xl text-[#1E3A32] mb-3">
                Your notes will live here
              </h3>
              <p className="text-[#2B2725]/60 mb-8 max-w-md mx-auto">
                Start capturing your thoughts, insights, and emotional shifts as you move through
                your Mind Styling journey.
              </p>
              <Button
                onClick={() => setNotesDrawerOpen(true)}
                className="bg-[#1E3A32] hover:bg-[#2B2725] text-[#F9F5EF]"
              >
                <Plus size={18} className="mr-2" />
                Create Your First Note
              </Button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}