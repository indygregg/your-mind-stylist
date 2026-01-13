import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "../utils";
import { base44 } from "@/api/base44Client";
import { Play, CheckCircle, Calendar, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import ExitIntentPopup from "@/components/masterclass/ExitIntentPopup";
import CmsText from "../components/cms/CmsText";
import VideoEmbed from "../components/cms/VideoEmbed";

export default function Masterclass() {
  const [user, setUser] = useState(null);
  const [signup, setSignup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const videoRef = React.useRef(null);

  useEffect(() => {
    const init = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);

        // Check if they've already signed up
        const signups = await base44.entities.MasterclassSignup.filter({
          email: currentUser.email
        });

        if (signups.length > 0) {
          setSignup(signups[0]);
        } else {
          // Auto-register them for the masterclass
          const newSignup = await base44.entities.MasterclassSignup.create({
            user_id: currentUser.id,
            email: currentUser.email,
            full_name: currentUser.full_name,
            signup_date: new Date().toISOString()
          });
          setSignup(newSignup);

          // Send confirmation email
          await base44.functions.invoke('sendMasterclassConfirmation', {
            email: currentUser.email,
            full_name: currentUser.full_name
          });
        }
      } catch (error) {
        console.error("Error loading masterclass:", error);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.code === 'Space' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
        e.preventDefault();
        togglePlay();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isPlaying]);

  // Track watch segments
  const trackWatchSegment = async (action, timestamp = 0) => {
    if (!signup) return;

    const newSegment = {
      timestamp,
      action,
      date: new Date().toISOString()
    };

    const currentSegments = signup.watch_segments || [];
    const updatedSegments = [...currentSegments, newSegment];

    await base44.entities.MasterclassSignup.update(signup.id, {
      watch_segments: updatedSegments
    });
  };

  // Auto-track at 90%+ watched
  const handleVideoProgress = async (currentTime, duration) => {
    const percentage = (currentTime / duration) * 100;
    
    if (percentage >= 90 && signup && !signup.watched) {
      await base44.entities.MasterclassSignup.update(signup.id, {
        watched: true,
        watch_date: new Date().toISOString(),
        watch_percentage: Math.floor(percentage)
      });
      setSignup({ ...signup, watched: true, watch_percentage: Math.floor(percentage) });
      trackWatchSegment('complete', currentTime);
    }
  };

  // Track CTA clicks
  const trackCTAClick = async (ctaType, source = 'masterclass_page') => {
    if (!signup) return;

    const newClick = {
      cta_type: ctaType,
      source,
      date: new Date().toISOString()
    };

    const currentClicks = signup.cta_clicks || [];
    const updatedClicks = [...currentClicks, newClick];

    await base44.entities.MasterclassSignup.update(signup.id, {
      clicked_cta: true,
      cta_clicks: updatedClicks
    });
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    // When real video player is integrated: videoRef.current?.play() or pause()
  };

  const handleWatchComplete = async () => {
    if (signup && !signup.watched) {
      await base44.entities.MasterclassSignup.update(signup.id, {
        watched: true,
        watch_date: new Date().toISOString(),
        watch_percentage: 100
      });
      setSignup({ ...signup, watched: true, watch_percentage: 100 });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9F5EF] flex items-center justify-center">
        <p className="text-[#2B2725]/60">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F5EF] pt-32 pb-24">
      <div className="max-w-5xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-[#D8B46B] text-xs tracking-[0.3em] uppercase mb-4 block">
            Free Masterclass
          </span>
          <h1 className="font-serif text-4xl md:text-5xl text-[#1E3A32] mb-4">
            Imposter Syndrome & Other Myths to Ditch
          </h1>
          <p className="text-[#2B2725]/70 text-lg max-w-2xl mx-auto">
            A practical, psychologically grounded class to help you stop feeling like you're faking it
            — and start trusting your abilities.
          </p>
        </div>

        {/* Video Player */}
        <div className="mb-12">
          <div className="aspect-video bg-[#2B2725] relative overflow-hidden rounded-lg shadow-xl">
            <VideoEmbed
              contentKey="masterclass.video.embed"
              page="Masterclass"
              blockTitle="Masterclass Video - Paste Vimeo embed code here"
              fallback="https://player.vimeo.com/video/1153727233?badge=0&autopause=0&player_id=0&app_id=58479"
            />
          </div>

          {/* Video Controls Info */}
          <div className="mt-4 flex items-center justify-between text-sm text-[#2B2725]/60">
            <button
              onClick={() => setShowTranscript(!showTranscript)}
              className="hover:text-[#1E3A32] transition-colors"
            >
              {showTranscript ? "Hide" : "Show"} Transcript
            </button>
            <span className="text-xs">Keyboard: Space = Play/Pause</span>
          </div>

          {/* Transcript */}
          {showTranscript && (
            <div className="mt-6 bg-white p-6 rounded-lg">
              <h3 className="font-medium text-[#1E3A32] mb-3">Transcript</h3>
              <p className="text-[#2B2725]/70 text-sm leading-relaxed">
                [Transcript will be available when video is embedded. This ensures accessibility for all users, improves SEO, and allows users to read along or reference specific sections.]
              </p>
            </div>
          )}
          
          {/* Mark Complete Button */}
          {!signup?.watched && (
            <div className="mt-6 text-center">
              <Button
                onClick={handleWatchComplete}
                className="bg-[#1E3A32] hover:bg-[#2B2725]"
              >
                <CheckCircle size={18} className="mr-2" />
                Mark as Complete
              </Button>
            </div>
          )}

          {signup?.watched && (
            <div className="mt-6 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#A6B7A3]/20 text-[#1E3A32] rounded-full">
                <CheckCircle size={18} className="text-[#A6B7A3]" />
                <span className="text-sm font-medium">Completed</span>
              </div>
            </div>
          )}
        </div>

        {/* Key Takeaways */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6">
            <div className="w-12 h-12 rounded-full bg-[#D8B46B]/20 flex items-center justify-center mb-4">
              <Calendar size={24} className="text-[#D8B46B]" />
            </div>
            <h3 className="font-serif text-lg text-[#1E3A32] mb-2">45 Minutes</h3>
            <p className="text-[#2B2725]/70 text-sm">Watch at your own pace</p>
          </div>

          <div className="bg-white p-6">
            <div className="w-12 h-12 rounded-full bg-[#D8B46B]/20 flex items-center justify-center mb-4">
              <Award size={24} className="text-[#D8B46B]" />
            </div>
            <h3 className="font-serif text-lg text-[#1E3A32] mb-2">Practical Tools</h3>
            <p className="text-[#2B2725]/70 text-sm">Not just theory—real strategies</p>
          </div>

          <div className="bg-white p-6">
            <div className="w-12 h-12 rounded-full bg-[#D8B46B]/20 flex items-center justify-center mb-4">
              <CheckCircle size={24} className="text-[#D8B46B]" />
            </div>
            <h3 className="font-serif text-lg text-[#1E3A32] mb-2">Lifetime Access</h3>
            <p className="text-[#2B2725]/70 text-sm">Rewatch any time</p>
          </div>
        </div>

        {/* What's Next */}
        <div className="bg-white p-8 rounded-lg">
          <h2 className="font-serif text-2xl text-[#1E3A32] mb-4">What's Next?</h2>
          <p className="text-[#2B2725]/70 mb-6">
            If this masterclass resonates with you, there are several ways to continue your work with
            The Mind Stylist:
          </p>
          <div className="space-y-3">
            <Link
              to={createPageUrl("Evolution")}
              onClick={() => trackCTAClick('certification')}
              className="block p-4 border border-[#E4D9C4] hover:border-[#D8B46B] transition-colors"
            >
              <h3 className="font-medium text-[#1E3A32] mb-1">The Mind Styling Certification™</h3>
              <p className="text-[#2B2725]/60 text-sm">
                For identity-level change and emotional intelligence
              </p>
            </Link>
            <Link
              to={createPageUrl("PrivateSessions")}
              onClick={() => trackCTAClick('private_sessions')}
              className="block p-4 border border-[#E4D9C4] hover:border-[#D8B46B] transition-colors"
            >
              <h3 className="font-medium text-[#1E3A32] mb-1">Private Mind Styling (1:1)</h3>
              <p className="text-[#2B2725]/60 text-sm">
                Personalized support in shifting long-held patterns
              </p>
            </Link>
            <Link
              to={createPageUrl("InnerRehearsal")}
              onClick={() => trackCTAClick('inner_rehearsal')}
              className="block p-4 border border-[#E4D9C4] hover:border-[#D8B46B] transition-colors"
            >
              <h3 className="font-medium text-[#1E3A32] mb-1">The Inner Rehearsal Sessions™</h3>
              <p className="text-[#2B2725]/60 text-sm">
                Ongoing internal resets and future-self rehearsal
              </p>
            </Link>
          </div>
        </div>

        {/* Exit Intent Popup */}
        <ExitIntentPopup
          signup={signup}
          onCaptured={(email) => {
            console.log('Exit intent captured:', email);
          }}
        />
      </div>
    </div>
  );
}