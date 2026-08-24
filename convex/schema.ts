import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Bảng Xếp Hạng Toàn Server (Global Realtime Leaderboard)
  leaderboard: defineTable({
    name: v.string(),
    score: v.number(),
    planesDowned: v.number(),
    accuracy: v.number(),
    badge: v.string(),
    shotsFired: v.number(),
    questionsAnswered: v.number(),
    createdAt: v.number(),
  }).index("by_score", ["score"]),

  // Phòng Đấu Trường Nhiều Người (Multiplayer Battle Rooms)
  rooms: defineTable({
    code: v.string(), // Mã phòng ví dụ "DBP54"
    hostName: v.string(),
    status: v.union(
      v.literal("waiting"),
      v.literal("playing"),
      v.literal("finished")
    ),
    durationSeconds: v.number(),
    startedAt: v.optional(v.number()),
  }).index("by_code", ["code"]),

  // Người chơi trong phòng đấu
  roomPlayers: defineTable({
    roomId: v.id("rooms"),
    name: v.string(),
    score: v.number(),
    planesDowned: v.number(),
    accuracy: v.number(),
    isHost: v.boolean(),
    isFinished: v.boolean(),
    lastUpdated: v.number(),
  }).index("by_room", ["roomId"]),

  // Ngân hàng câu hỏi lịch sử Điện Biên Phủ trên Cloud
  questions: defineTable({
    question: v.string(),
    options: v.array(v.string()),
    correctAnswer: v.number(),
    historicalNote: v.string(),
    shells37mm: v.number(),
    flakBonus: v.number(),
  }),
});
