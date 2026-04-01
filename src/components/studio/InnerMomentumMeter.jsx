import React, { useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Info } from "lucide-react";

export default function InnerMomentumMeter({ weeklyPoints = 0, className = "" }) {
  const [showTooltip, setShowTooltip] = useState(false);

  const getMomentumLevel = () => {
    if (weeklyPoints >= 41) return { 
      name: "Deepening Practice", 
      message: "Presence compounds. You're doing beautifully.",
      color: "#D8B46B" 
    };
    if (weeklyPoints >= 26) return { 
      name: "Strong Presence", 
      message: "You've arrived for yourself this week.",
      color: "#A6B7A3" 
    };
    if (weeklyPoints >= 11) return { 
      name: "Growing Momentum", 
      message: "You're building gentle momentum.",
      color: "#6E4F7D" 
    };
    return { 
      name: "Getting Started", 
      message: "Every moment of presence matters. You're building a foundation.",
      tooltip: "You're in the early stages of building your presence practice.",
      color: "#E4D9C4" 
    };
  };

  const level = getMomentumLevel();
  const maxPoints = 70; // 7 days × 10 points
  const progress = Math.min((weeklyPoints / maxPoints) * 100, 100);
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className={`bg-white p-6 rounded-lg ${className}`}
    >
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp size={20} className="text-[#A6B7A3]" />
        <p className="text-xs text-[#2B2725]/60 uppercase tracking-wider">
          Inner Momentum
        </p>
      </div>

      <div className="flex items-center gap-6">
        {/* Circular progress */}
        <div className="relative">
          <svg width="120" height="120" className="transform -rotate-90">
            {/* Background circle */}
            <circle
              cx="60"
              cy="60"
              r="45"
              stroke="#E4D9C4"
              strokeWidth="8"
              fill="none"
            />
            {/* Progress circle */}
            <motion.circle
              cx="60"
              cy="60"
              r="45"
              stroke={level.color}
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1, ease: "easeOut" }}
              style={{
                strokeDasharray: circumference,
              }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <p className="font-serif text-2xl text-[#1E3A32]">{weeklyPoints}</p>
              <p className="text-xs text-[#2B2725]/60">this week</p>
            </div>
          </div>
        </div>

        {/* Text */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-serif text-xl text-[#1E3A32]">
              {level.name}
            </h3>
            {level.tooltip && (
              <div className="relative">
                <button
                  onMouseEnter={() => setShowTooltip(true)}
                  onMouseLeave={() => setShowTooltip(false)}
                  className="text-[#D8B46B] hover:text-[#C9A55A] transition-colors"
                  title={level.tooltip}
                >
                  <Info size={16} />
                </button>
                {showTooltip && (
                  <div className="absolute bottom-full left-0 mb-2 bg-[#1E3A32] text-white text-xs px-3 py-2 rounded whitespace-nowrap z-10">
                    {level.tooltip}
                  </div>
                )}
              </div>
            )}
          </div>
          <p className="text-sm text-[#2B2725]/70 leading-relaxed italic">
            {level.message}
          </p>
        </div>
      </div>
    </motion.div>
  );
}