import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // ═══ ĐIỆN BIÊN PHỦ AIR DEFENSE TABLES (DBP) ═══
  dbpRooms: defineTable({
    code: v.string(), // Mã PIN phòng (vd: "195401")
    hostName: v.string(), // Tên Giảng Viên / Host
    status: v.union(
      v.literal("waiting"),
      v.literal("playing"),
      v.literal("finished")
    ),
    durationSeconds: v.number(), // Thời lượng trận đánh (180s)
    startedAt: v.optional(v.number()),
    finishedAt: v.optional(v.number()),
  }).index("by_code", ["code"]),

  dbpPlayers: defineTable({
    roomId: v.id("dbpRooms"),
    name: v.string(),
    score: v.number(),
    planesDowned: v.number(),
    accuracy: v.number(),
    shotsFired: v.number(),
    questionsAnswered: v.number(),
    isHost: v.boolean(),
    isFinished: v.boolean(),
    lastEvent: v.optional(v.string()),
    lastUpdated: v.number(),
  }).index("by_room", ["roomId"]),

  dbpBattleLogs: defineTable({
    roomId: v.id("dbpRooms"),
    playerName: v.string(),
    message: v.string(),
    type: v.string(), // "kill" | "reload" | "combo" | "medal"
    timestamp: v.number(),
  }).index("by_room_time", ["roomId", "timestamp"]),

  dbpLeaderboard: defineTable({
    name: v.string(),
    score: v.number(),
    planesDowned: v.number(),
    accuracy: v.number(),
    badge: v.string(),
    shotsFired: v.number(),
    questionsAnswered: v.number(),
    createdAt: v.number(),
  }).index("by_score", ["score"]),

  // ═══ GAME 2 (LỊCH SỬ ĐẢNG 1945-1946) MULTIPLAYER TABLES ═══
  rooms: defineTable({
    code: v.string(),
    status: v.union(
      v.literal("lobby"),
      v.literal("playing"),
      v.literal("finished")
    ),
    currentRound: v.number(),
    phase: v.union(v.literal("choosing"), v.literal("results")),
    randomEvent: v.union(v.string(), v.null()),
    hostName: v.optional(v.string()),
    durationSeconds: v.optional(v.number()),
    startedAt: v.optional(v.number()),
    finishedAt: v.optional(v.number()),
  }).index("by_code", ["code"]),

  players: defineTable({
    name: v.string(),
    roomId: v.id("rooms"),
    isHost: v.boolean(),
    score: v.optional(v.number()),
    lastScoreIncrement: v.optional(v.number()),
    currentChoice: v.union(v.string(), v.null()),
    isAlive: v.boolean(),
    hasSubmitted: v.boolean(),
    money: v.optional(v.number()),
    alienation: v.optional(v.number()),
    freedom: v.optional(v.number()),
    inSurvivalCrisis: v.optional(v.boolean()),
  }).index("by_roomId", ["roomId"]),

  documents: defineTable({
    text: v.string(),
    embedding: v.array(v.float64()),
  }).vectorIndex("by_embedding", {
    vectorField: "embedding",
    dimensions: 768,
  }),

  quizQuestions: defineTable({
    questionId: v.number(),
    question: v.string(),
    options: v.array(v.string()),
    answer: v.string(),
  }).index("by_questionId", ["questionId"]),

  catchphraseQuestions: defineTable({
    image: v.string(),
    answer: v.string(),
    suggestion: v.string(),
  }),
});
