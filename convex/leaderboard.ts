import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Lấy danh sách Top bảng vàng toàn server theo thời gian thực
export const getTopScores = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 50;
    const scores = await ctx.db
      .query("leaderboard")
      .withIndex("by_score")
      .order("desc")
      .take(limit);

    return scores;
  },
});

// Lưu kết quả chiến đấu của người chơi
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
    const id = await ctx.db.insert("leaderboard", {
      name: args.name,
      score: args.score,
      planesDowned: args.planesDowned,
      accuracy: args.accuracy,
      badge: args.badge,
      shotsFired: args.shotsFired,
      questionsAnswered: args.questionsAnswered,
      createdAt: Date.now(),
    });
    return id;
  },
});

// Khởi tạo bảng vàng mẫu nếu chưa có dữ liệu
export const seedInitialData = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("leaderboard").first();
    if (existing) return;

    const sample = [
      {
        name: "Khẩu đội Anh hùng Tô Vĩnh Diện",
        score: 3850,
        planesDowned: 14,
        accuracy: 92,
        badge: "Anh hùng LLVTND",
        shotsFired: 15,
        questionsAnswered: 8,
        createdAt: Date.now() - 86400000 * 3,
      },
      {
        name: "Tiểu đoàn Pháo cao xạ 383",
        score: 2920,
        planesDowned: 11,
        accuracy: 85,
        badge: "Dũng sĩ Diệt Máy bay",
        shotsFired: 13,
        questionsAnswered: 6,
        createdAt: Date.now() - 86400000 * 2,
      },
      {
        name: "Đại đội 815 - Đồi Him Lam",
        score: 2150,
        planesDowned: 8,
        accuracy: 79,
        badge: "Chiến sĩ Thi đua",
        shotsFired: 11,
        questionsAnswered: 5,
        createdAt: Date.now() - 86400000,
      },
    ];

    for (const item of sample) {
      await ctx.db.insert("leaderboard", item);
    }
  },
});
