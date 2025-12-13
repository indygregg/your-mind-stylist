import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { 
  TrendingUp, Users, Award, Heart, BookOpen, Calendar,
  BarChart, Target, Sparkles, Download
} from "lucide-react";
import { Button } from "@/components/ui/button";
import SEO from "../components/SEO";
import {
  BarChart as RechartsBar, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";

const COLORS = ['#D8B46B', '#1E3A32', '#A6B7A3', '#6E4F7D', '#2B4A40'];

export default function ManagerTransformationAnalytics() {
  const [timeframe, setTimeframe] = useState('30d'); // 30d, 90d, all

  const { data: allReflections = [] } = useQuery({
    queryKey: ["all-reflections"],
    queryFn: () => base44.entities.LearningReflection.list("-created_date")
  });

  const { data: allMilestones = [] } = useQuery({
    queryKey: ["all-milestones"],
    queryFn: () => base44.entities.Milestone.list("-unlocked_date")
  });

  const { data: allSnapshots = [] } = useQuery({
    queryKey: ["all-snapshots"],
    queryFn: () => base44.entities.TransformationSnapshot.list("-created_date")
  });

  const { data: allInsights = [] } = useQuery({
    queryKey: ["all-insights"],
    queryFn: () => base44.entities.GrowthInsight.list("-created_date")
  });

  const { data: users = [] } = useQuery({
    queryKey: ["all-users"],
    queryFn: () => base44.entities.User.list()
  });

  // Calculate aggregate stats
  const activeUsers = users.filter(u => u.role !== 'manager').length;
  const usersWithReflections = new Set(allReflections.map(r => r.created_by)).size;
  const avgReflectionsPerUser = activeUsers > 0 ? (allReflections.length / activeUsers).toFixed(1) : 0;
  const breakthroughRate = allReflections.length > 0 
    ? ((allReflections.filter(r => r.breakthrough_tagged).length / allReflections.length) * 100).toFixed(1)
    : 0;

  // Milestone distribution
  const milestoneDistribution = allMilestones.reduce((acc, m) => {
    acc[m.milestone_type] = (acc[m.milestone_type] || 0) + 1;
    return acc;
  }, {});

  const milestoneChartData = Object.entries(milestoneDistribution).map(([type, count]) => ({
    name: type.replace(/_/g, ' '),
    value: count
  }));

  // Reflection types distribution
  const reflectionTypes = allReflections.reduce((acc, r) => {
    acc[r.reflection_type] = (acc[r.reflection_type] || 0) + 1;
    return acc;
  }, {});

  const reflectionChartData = Object.entries(reflectionTypes).map(([type, count]) => ({
    type: type.replace(/_/g, ' '),
    count
  }));

  // Monthly growth trends (last 6 months)
  const last6Months = Array.from({ length: 6 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (5 - i));
    return date.toISOString().substring(0, 7);
  });

  const monthlyData = last6Months.map(month => {
    const reflections = allReflections.filter(r => r.created_date.startsWith(month));
    const milestones = allMilestones.filter(m => m.unlocked_date.startsWith(month));
    const snapshots = allSnapshots.filter(s => s.created_date.startsWith(month));
    
    return {
      month: new Date(month).toLocaleDateString('en-US', { month: 'short' }),
      reflections: reflections.length,
      milestones: milestones.length,
      snapshots: snapshots.length
    };
  });

  // Average emotional scores from snapshots
  const avgEmotionalScores = {
    calm: allSnapshots.reduce((sum, s) => sum + (s.calm_score || 0), 0) / allSnapshots.length || 0,
    grounded: allSnapshots.reduce((sum, s) => sum + (s.grounded_score || 0), 0) / allSnapshots.length || 0,
    open: allSnapshots.reduce((sum, s) => sum + (s.open_score || 0), 0) / allSnapshots.length || 0,
    energy: allSnapshots.reduce((sum, s) => sum + (s.energy_level || 0), 0) / allSnapshots.length || 0
  };

  // Top insights categories
  const insightCategories = allInsights.reduce((acc, i) => {
    acc[i.insight_category] = (acc[i.insight_category] || 0) + 1;
    return acc;
  }, {});

  const insightCategoryData = Object.entries(insightCategories).map(([category, count]) => ({
    category,
    count
  }));

  // Helpful insights rate
  const ratedInsights = allInsights.filter(i => i.helpful !== null && i.helpful !== undefined);
  const helpfulRate = ratedInsights.length > 0
    ? ((ratedInsights.filter(i => i.helpful).length / ratedInsights.length) * 100).toFixed(1)
    : 0;

  return (
    <>
      <SEO
        title="Transformation Analytics - Manager Dashboard"
        description="View aggregate transformation data and program impact across all users."
      />
      <div className="min-h-screen bg-[#F9F5EF] py-12 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="font-serif text-4xl text-[#1E3A32] mb-2">
                  Transformation Analytics
                </h1>
                <p className="text-[#2B2725]/70">
                  See how your programs are creating lasting change
                </p>
              </div>
              <Button
                variant="outline"
                className="border-[#1E3A32] text-[#1E3A32]"
              >
                <Download size={18} className="mr-2" />
                Export Report
              </Button>
            </div>
          </motion.div>

          {/* Key Metrics */}
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            {[
              { 
                label: "Active Users", 
                value: activeUsers, 
                icon: Users, 
                color: "#1E3A32",
                subtext: `${usersWithReflections} reflecting`
              },
              { 
                label: "Total Reflections", 
                value: allReflections.length, 
                icon: Heart, 
                color: "#D8B46B",
                subtext: `${avgReflectionsPerUser} avg/user`
              },
              { 
                label: "Milestones Achieved", 
                value: allMilestones.length, 
                icon: Award, 
                color: "#A6B7A3",
                subtext: `${breakthroughRate}% breakthrough rate`
              },
              { 
                label: "Transformation Snapshots", 
                value: allSnapshots.length, 
                icon: Target, 
                color: "#6E4F7D",
                subtext: "Emotional tracking"
              }
            ].map((metric) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white p-6 rounded-xl shadow-md"
              >
                <metric.icon size={28} style={{ color: metric.color }} className="mb-4" />
                <p className="text-4xl font-bold text-[#1E3A32] mb-2">{metric.value}</p>
                <p className="text-sm text-[#2B2725] mb-1">{metric.label}</p>
                <p className="text-xs text-[#2B2725]/50">{metric.subtext}</p>
              </motion.div>
            ))}
          </div>

          {/* Growth Trends */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl p-8 shadow-md mb-8"
          >
            <h2 className="font-serif text-2xl text-[#1E3A32] mb-6">
              6-Month Activity Trends
            </h2>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E4D9C4" />
                <XAxis dataKey="month" tick={{ fill: '#2B2725', fontSize: 12 }} />
                <YAxis tick={{ fill: '#2B2725', fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="reflections" stroke="#D8B46B" strokeWidth={2} name="Reflections" />
                <Line type="monotone" dataKey="milestones" stroke="#1E3A32" strokeWidth={2} name="Milestones" />
                <Line type="monotone" dataKey="snapshots" stroke="#A6B7A3" strokeWidth={2} name="Snapshots" />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Two Column Layout */}
          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            {/* Milestone Distribution */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl p-8 shadow-md"
            >
              <h2 className="font-serif text-2xl text-[#1E3A32] mb-6">
                Milestone Types
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={milestoneChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => entry.name}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {milestoneChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Reflection Types */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl p-8 shadow-md"
            >
              <h2 className="font-serif text-2xl text-[#1E3A32] mb-6">
                Reflection Types
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsBar data={reflectionChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E4D9C4" />
                  <XAxis dataKey="type" tick={{ fill: '#2B2725', fontSize: 11 }} />
                  <YAxis tick={{ fill: '#2B2725', fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#D8B46B" />
                </RechartsBar>
              </ResponsiveContainer>
            </motion.div>
          </div>

          {/* Average Emotional Scores */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl p-8 shadow-md mb-8"
          >
            <h2 className="font-serif text-2xl text-[#1E3A32] mb-6">
              Average Emotional Scores (All Users)
            </h2>
            <div className="grid md:grid-cols-4 gap-6">
              {[
                { label: "Calm", value: avgEmotionalScores.calm.toFixed(0), max: 100 },
                { label: "Grounded", value: avgEmotionalScores.grounded.toFixed(0), max: 100 },
                { label: "Open", value: avgEmotionalScores.open.toFixed(0), max: 100 },
                { label: "Energy", value: avgEmotionalScores.energy.toFixed(1), max: 10 }
              ].map((score) => (
                <div key={score.label} className="text-center">
                  <p className="text-4xl font-bold text-[#1E3A32] mb-2">
                    {score.value}
                    <span className="text-lg text-[#2B2725]/50">/{score.max}</span>
                  </p>
                  <p className="text-sm text-[#2B2725]/70">{score.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* AI Insights Performance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl p-8 shadow-md"
          >
            <h2 className="font-serif text-2xl text-[#1E3A32] mb-6">
              AI Insights Performance
            </h2>
            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <div className="text-center">
                <p className="text-4xl font-bold text-[#1E3A32] mb-2">{allInsights.length}</p>
                <p className="text-sm text-[#2B2725]/70">Insights Generated</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-[#1E3A32] mb-2">{helpfulRate}%</p>
                <p className="text-sm text-[#2B2725]/70">Marked Helpful</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-[#1E3A32] mb-2">
                  {allInsights.filter(i => i.viewed).length}
                </p>
                <p className="text-sm text-[#2B2725]/70">Viewed</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <RechartsBar data={insightCategoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E4D9C4" />
                <XAxis dataKey="category" tick={{ fill: '#2B2725', fontSize: 11 }} />
                <YAxis tick={{ fill: '#2B2725', fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#6E4F7D" />
              </RechartsBar>
            </ResponsiveContainer>
          </motion.div>
        </div>
      </div>
    </>
  );
}