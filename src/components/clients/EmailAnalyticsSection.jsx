import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import SequenceAnalytics from "../sequences/SequenceAnalytics";

export default function EmailAnalyticsSection() {
  const { data: sequences = [], isLoading: seqLoading } = useQuery({
    queryKey: ["emailSequences"],
    queryFn: () => base44.entities.EmailSequence.list("-created_date"),
  });

  const { data: allSteps = [] } = useQuery({
    queryKey: ["emailSequenceSteps"],
    queryFn: () => base44.entities.EmailSequenceStep.list("-sequence_id", 500),
  });

  const { data: enrollments = [], isLoading: enrollLoading } = useQuery({
    queryKey: ["userEmailSequences"],
    queryFn: () => base44.entities.UserEmailSequence.list("-created_date", 500),
  });

  if (seqLoading || enrollLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="animate-spin text-[#D8B46B]" size={24} />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="font-serif text-xl text-[#1E3A32]">Email Analytics</h2>
        <p className="text-sm text-[#2B2725]/60 mt-1">Performance metrics across all sequences and campaigns</p>
      </div>
      <SequenceAnalytics sequences={sequences} allSteps={allSteps} enrollments={enrollments} />
    </div>
  );
}