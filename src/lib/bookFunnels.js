/**
 * Book + Quiz Funnel Configuration
 * ─────────────────────────────────
 * Each key is a book's URL slug. The object contains:
 *   - quiz:       intro content + all 12 questions
 *   - archetypes: keyed result content for each possible outcome
 *
 * To add a new book funnel:
 *   1. Add a new top-level key matching the book's slug in the Product entity.
 *   2. Define `quiz` with title, subtitle, intro, and questions.
 *   3. Define `archetypes` with one entry per possible quiz outcome key.
 *   That's it — BookLanding, QuizPage, and QuizResults will pick it up automatically.
 */

export const BOOK_FUNNELS = {
  "go-fetch-yourself": {
    quiz: {
      title: "Which Dog Archetype Are You?",
      subtitle: "A quick self-discovery quiz inspired by Go Fetch Your Self",
      intro:
        "You have access to all four archetypes — but one usually leads. This quick quiz will help you discover your dominant dog pattern and how it shows up in emotional intelligence, relationships, change, stress, and work.",
      questions: [
        {
          q: "When you walk into a new situation, you usually:",
          answers: [
            { text: "Take charge and figure out what needs to happen", archetype: "leader" },
            { text: "Start engaging and reading the room", archetype: "connector" },
            { text: "Observe quietly and settle in gently", archetype: "steady" },
            { text: "Watch carefully before deciding what to do", archetype: "thoughtful" },
          ],
        },
        {
          q: "When something goes wrong, your first instinct is to:",
          answers: [
            { text: "Fix it quickly", archetype: "leader" },
            { text: "Talk it through", archetype: "connector" },
            { text: "Keep things calm", archetype: "steady" },
            { text: "Understand exactly what happened", archetype: "thoughtful" },
          ],
        },
        {
          q: "People often describe you as:",
          answers: [
            { text: "Decisive", archetype: "leader" },
            { text: "Expressive", archetype: "connector" },
            { text: "Dependable", archetype: "steady" },
            { text: "Thoughtful", archetype: "thoughtful" },
          ],
        },
        {
          q: "In a group, your natural role is:",
          answers: [
            { text: "The driver", archetype: "leader" },
            { text: "The encourager", archetype: "connector" },
            { text: "The stabilizer", archetype: "steady" },
            { text: "The strategist", archetype: "thoughtful" },
          ],
        },
        {
          q: "When emotions run high, you tend to:",
          answers: [
            { text: "Push forward", archetype: "leader" },
            { text: "Express what you feel", archetype: "connector" },
            { text: "Stay steady and supportive", archetype: "steady" },
            { text: "Pull back and analyze", archetype: "thoughtful" },
          ],
        },
        {
          q: "Change feels:",
          answers: [
            { text: "Exciting if it moves things forward", archetype: "leader" },
            { text: "Energizing if people are involved", archetype: "connector" },
            { text: "Stressful unless it's gradual", archetype: "steady" },
            { text: "Unsettling unless it makes sense", archetype: "thoughtful" },
          ],
        },
        {
          q: "Under pressure, your biggest strength is:",
          answers: [
            { text: "Courage", archetype: "leader" },
            { text: "Optimism", archetype: "connector" },
            { text: "Patience", archetype: "steady" },
            { text: "Precision", archetype: "thoughtful" },
          ],
        },
        {
          q: "Your biggest challenge is:",
          answers: [
            { text: "Slowing down", archetype: "leader" },
            { text: "Staying focused", archetype: "connector" },
            { text: "Speaking up", archetype: "steady" },
            { text: "Letting go", archetype: "thoughtful" },
          ],
        },
        {
          q: "You feel most fulfilled when:",
          answers: [
            { text: "You make progress", archetype: "leader" },
            { text: "You inspire or connect", archetype: "connector" },
            { text: "People feel safe and supported", archetype: "steady" },
            { text: "Things are clear and well done", archetype: "thoughtful" },
          ],
        },
        {
          q: "In relationships, you value most:",
          answers: [
            { text: "Respect", archetype: "leader" },
            { text: "Fun and connection", archetype: "connector" },
            { text: "Trust", archetype: "steady" },
            { text: "Integrity", archetype: "thoughtful" },
          ],
        },
        {
          q: "When facing uncertainty, you usually:",
          answers: [
            { text: "Move forward anyway", archetype: "leader" },
            { text: "Reach out and process aloud", archetype: "connector" },
            { text: "Stay with what feels familiar", archetype: "steady" },
            { text: "Gather more information", archetype: "thoughtful" },
          ],
        },
        {
          q: "People rely on you to:",
          answers: [
            { text: "Lead", archetype: "leader" },
            { text: "Energize", archetype: "connector" },
            { text: "Support", archetype: "steady" },
            { text: "Protect and think ahead", archetype: "thoughtful" },
          ],
        },
      ],
    },
    archetypes: {
      leader: {
        title: "You're the Leader Dog",
        emoji: "🐕",
        summary:
          "You tend to move toward action, clarity, and forward motion. You're often the one who steps up, decides, organizes, and carries responsibility. You value momentum, competence, and progress.",
        strengths: ["Decisive", "Capable under pressure", "Courageous", "Naturally directive", "Able to move things forward"],
        growth:
          "Your challenge is not strength — it's softness. You may move so quickly toward solutions that you miss what needs to be felt, not fixed.",
        relationships:
          "You often show love through action, protection, and problem-solving. You may need reminders that presence, patience, and listening can be just as powerful as solutions.",
        stress:
          "You may become more controlling, impatient, blunt, or over-responsible. Stress can make everything feel like a problem to solve immediately.",
        restyle: "Am I leading right now — or protecting myself from discomfort?",
      },
      connector: {
        title: "You're the Connector Dog",
        emoji: "🐶",
        summary:
          "You lead with energy, expression, and connection. You're often the emotional bridge in a room — sensing people quickly, bringing warmth, and helping others feel included.",
        strengths: ["Expressive", "Intuitive with people", "Encouraging", "Relationally aware", "Emotionally vibrant"],
        growth:
          "You may spend so much energy reading, managing, or supporting others that you lose contact with your own emotional center.",
        relationships:
          "You bond quickly and bring warmth, enthusiasm, and emotional presence. Your deeper growth comes through consistency, grounding, and letting connection deepen beyond chemistry.",
        stress:
          "You may become scattered, overextended, reactive, or overly dependent on outside reassurance.",
        restyle: "What am I actually feeling before I reach outward for connection?",
      },
      steady: {
        title: "You're the Steady Companion Dog",
        emoji: "🐾",
        summary:
          "You bring calm, trust, and consistency. You're often the grounded one — the safe presence, the dependable heart, the person people lean on when life feels unstable.",
        strengths: ["Loyal", "Calming", "Patient", "Emotionally attuned", "Deeply trustworthy"],
        growth:
          "You may suppress your own needs to keep the peace. Your strength is steadiness — but your growth lies in letting your voice matter too.",
        relationships:
          "You love through presence, reliability, and care. You remember what matters. You stay. But staying connected should not require self-silencing.",
        stress:
          "You may withdraw, become passive, go quiet, or carry resentment internally instead of expressing what you need.",
        restyle: "What need have I not said out loud yet?",
      },
      thoughtful: {
        title: "You're the Thoughtful Observer Dog",
        emoji: "🦮",
        summary:
          "You lead with insight, pattern recognition, and careful awareness. You often notice what others miss and prefer to understand before you act.",
        strengths: ["Perceptive", "Thoughtful", "Precise", "Dependable", "Reflective"],
        growth:
          "You may overanalyze, hesitate, or wait for certainty that never fully comes. Your growth lies in trusting that clarity often arrives through movement, not before it.",
        relationships:
          "You show care through reliability, thoughtfulness, and depth. But others may not always see how much you feel unless you let more of yourself be visible.",
        stress:
          "You may retreat inward, become overly critical, freeze, delay action, or try to think your way out of emotion.",
        restyle: "Is my analysis helping me move — or helping me avoid?",
      },
    },
  },

  // ── Add future book funnels below ──────────────────────────────────────────
  // "next-book-slug": {
  //   quiz: { title: "...", subtitle: "...", intro: "...", questions: [...] },
  //   archetypes: { key1: { title, emoji, summary, strengths, growth, relationships, stress, restyle }, ... }
  // },
};

/** Returns the funnel config for a given book slug, or null if not found. */
export function getFunnel(slug) {
  return BOOK_FUNNELS[slug] || null;
}