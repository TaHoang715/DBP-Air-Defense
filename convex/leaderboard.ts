import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getTopScores = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 10;
    return await ctx.db
      .query("dbpLeaderboard")
      .withIndex("by_score")
      .order("desc")
      .take(limit);
  },
});

export const submitScore = mutation({
  args: {
    name: v.string(),
    score: v.number(),
    planesDowned: v.number(),
    accuracy: v.number(),
    badge: v.string(),
    shotsFired: v.number(),
    questionsAnswered: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("dbpLeaderboard", {
      name: args.name.trim(),
      score: args.score,
      planesDowned: args.planesDowned,
      accuracy: args.accuracy,
      badge: args.badge,
      shotsFired: args.shotsFired,
      questionsAnswered: args.questionsAnswered,
      createdAt: Date.now(),
    });
  },
});
