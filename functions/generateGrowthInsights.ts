import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

/**
 * Generate AI-powered insights about user's transformation patterns
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Gather all user data
    const [reflections, milestones, snapshots, checkIns, lessonProgress, bookings] = await Promise.all([
      base44.asServiceRole.entities.LearningReflection.filter({ created_by: user.email }),
      base44.asServiceRole.entities.Milestone.filter({ created_by: user.email }),
      base44.asServiceRole.entities.TransformationSnapshot.filter({ created_by: user.email }),
      base44.asServiceRole.entities.DailyStyleCheck.filter({ created_by: user.email }),
      base44.asServiceRole.entities.UserLessonProgress.filter({ user_id: user.id }),
      base44.asServiceRole.entities.Booking.filter({ user_email: user.email })
    ]);

    // Check if we already generated insights recently (last 24 hours)
    const existingInsights = await base44.asServiceRole.entities.GrowthInsight.filter({
      created_by: user.email,
      viewed: false
    });

    const recentInsights = existingInsights.filter(insight => {
      const created = new Date(insight.created_date);
      const hoursSince = (Date.now() - created.getTime()) / (1000 * 60 * 60);
      return hoursSince < 24;
    });

    if (recentInsights.length > 0) {
      return Response.json({
        success: true,
        message: 'Recent insights already exist',
        insights: recentInsights
      });
    }

    // Build context for AI
    const context = {
      total_reflections: reflections.length,
      total_milestones: milestones.length,
      total_snapshots: snapshots.length,
      total_checkins: checkIns.length,
      lessons_completed: lessonProgress.filter(lp => lp.completed).length,
      sessions_booked: bookings.filter(b => b.booking_status === 'completed').length,
      breakthrough_moments: reflections.filter(r => r.breakthrough_tagged).length,
      recent_moods: checkIns.slice(0, 10).map(c => c.state_key === 'mood' ? c.state_value : null).filter(Boolean),
      snapshot_trends: snapshots.slice(0, 3).map(s => ({
        calm: s.calm_score,
        grounded: s.grounded_score,
        open: s.open_score,
        energy: s.energy_level
      })),
      recent_reflections: reflections.slice(0, 5).map(r => r.what_shifted).filter(Boolean)
    };

    // Call AI to generate insights
    const aiPrompt = `You are a compassionate transformation coach analyzing a user's personal growth data.

User Activity Summary:
- ${context.total_reflections} reflections written
- ${context.total_milestones} milestones achieved
- ${context.lessons_completed} lessons completed
- ${context.sessions_booked} coaching sessions completed
- ${context.breakthrough_moments} breakthrough moments tagged

Recent emotional patterns: ${JSON.stringify(context.recent_moods)}
Recent transformation snapshots: ${JSON.stringify(context.snapshot_trends)}
Recent reflection highlights: ${context.recent_reflections.join('; ')}

Generate 2-3 meaningful, specific insights about this person's transformation journey. Focus on:
1. Patterns you notice (emotional, behavioral, engagement)
2. Areas of growth or improvement
3. Encouragement based on their progress
4. Gentle suggestions for deepening their practice

Return as JSON array with this structure:
[{
  "insight_type": "pattern" | "trend" | "celebration" | "recommendation" | "observation",
  "insight_category": "emotional" | "learning" | "consistency" | "growth" | "connection" | "breakthrough",
  "insight_text": "Short, warm insight (1-2 sentences)",
  "insight_detail": "More context if helpful (optional)",
  "priority": "low" | "medium" | "high"
}]`;

    const aiResponse = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt: aiPrompt,
      response_json_schema: {
        type: "object",
        properties: {
          insights: {
            type: "array",
            items: {
              type: "object",
              properties: {
                insight_type: { type: "string" },
                insight_category: { type: "string" },
                insight_text: { type: "string" },
                insight_detail: { type: "string" },
                priority: { type: "string" }
              }
            }
          }
        }
      }
    });

    const insights = aiResponse.insights || [];
    const createdInsights = [];

    // Save insights to database
    for (const insight of insights) {
      const created = await base44.asServiceRole.entities.GrowthInsight.create({
        insight_type: insight.insight_type,
        insight_category: insight.insight_category,
        insight_text: insight.insight_text,
        insight_detail: insight.insight_detail || null,
        data_sources: ['reflections', 'snapshots', 'check_ins', 'milestones'],
        confidence_score: 85,
        generated_by: 'ai',
        viewed: false,
        priority: insight.priority || 'medium'
      });
      createdInsights.push(created);
    }

    return Response.json({
      success: true,
      insights_generated: createdInsights.length,
      insights: createdInsights
    });

  } catch (error) {
    console.error('Insight generation error:', error);
    return Response.json({ 
      error: error.message,
      success: false 
    }, { status: 500 });
  }
});