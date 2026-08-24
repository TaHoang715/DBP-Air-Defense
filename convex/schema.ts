import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Phòng Đấu Trường Kiểu Kahoot (Classroom Battle Rooms)
  rooms: defineTable({
    code: v.string(), // Mã PIN phòng (vd: "DBP1954" hoặc "715902")
    hostName: v.string(), // Tên Giảng Viên / Host
    status: v.union(
      v.literal("waiting"),
      v.literal("playing"),
      v.literal("finished")
    ),
    durationSeconds: v.number(), // Thời lượng trận đánh (mặc định 180s = 3 phút)
    startedAt: v.optional(v.number()),
    finishedAt: v.optional(v.number()),
  }).index("by_code", ["code"]),

  // Danh sách sinh viên / pháo thủ trong phòng
  roomPlayers: defineTable({
    roomId: v.id("rooms"),
    name: v.string(),
    score: v.number(),
    planesDowned: v.number(),
    accuracy: v.number(),
    shotsFired: v.number(),
    questionsAnswered: v.number(),
    isHost: v.boolean(),
    isFinished: v.boolean(),
    lastEvent: v.optional(v.string()), // Sự kiện mới nhất: "Bắn hạ Bearcat F8F! +250đ"
    lastUpdated: v.number(),
  }).index("by_room", ["roomId"]),

  // Luồng nhật ký chiến sự realtime hiển thị trên màn hình máy chiếu
  battleLogs: defineTable({
    roomId: v.id("rooms"),
    playerName: v.string(),
    message: v.string(),
    type: v.string(), // "kill" | "reload" | "combo" | "medal"
    timestamp: v.number(),
  }).index("by_room_time", ["roomId", "timestamp"]),

  // Bảng Xếp Hạng Toàn Cầu
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
});
