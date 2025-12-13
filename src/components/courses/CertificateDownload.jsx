import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Award, Download, Loader2, Sparkles } from "lucide-react";
import { toast } from "react-hot-toast";
import confetti from "canvas-confetti";

export default function CertificateDownload({ courseId, courseTitle, completionDate }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [certificateUrl, setCertificateUrl] = useState(null);

  const handleGenerateCertificate = async () => {
    setIsGenerating(true);
    try {
      const response = await base44.functions.invoke('generateCertificate', {
        course_id: courseId
      });

      if (response.data.success) {
        setCertificateUrl(response.data.certificate_url);
        toast.success("Certificate generated!");
        
        // Celebration confetti
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    } catch (error) {
      console.error("Certificate generation error:", error);
      toast.error("Failed to generate certificate");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (certificateUrl) {
      window.open(certificateUrl, '_blank');
    }
  };

  return (
    <div className="bg-gradient-to-r from-[#D8B46B] to-[#C9A55A] p-8 rounded-lg text-white">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
          <Award size={24} />
        </div>
        <div className="flex-1">
          <h3 className="font-serif text-2xl mb-2">Congratulations!</h3>
          <p className="text-white/90 mb-4">
            You've completed <strong>{courseTitle}</strong>
          </p>
          <p className="text-sm text-white/80 mb-6">
            Download your certificate of completion to showcase your achievement.
          </p>

          {!certificateUrl ? (
            <Button
              onClick={handleGenerateCertificate}
              disabled={isGenerating}
              className="bg-white text-[#1E3A32] hover:bg-white/90"
            >
              {isGenerating ? (
                <>
                  <Loader2 size={16} className="mr-2 animate-spin" />
                  Generating Certificate...
                </>
              ) : (
                <>
                  <Sparkles size={16} className="mr-2" />
                  Generate Certificate
                </>
              )}
            </Button>
          ) : (
            <Button
              onClick={handleDownload}
              className="bg-white text-[#1E3A32] hover:bg-white/90"
            >
              <Download size={16} className="mr-2" />
              Download Certificate
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}