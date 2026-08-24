import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Tạo phòng thi đấu mới
export const createRoom = mutation({
  args: {
    hostName: v.string(),
    durationSeconds: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // Generate 6-digit uppercase room code (e.g. DBP88)
    const code = "DBP" + Math.floor(100 + Math.random() * 900);
    const roomId = await ctx.db.insert("rooms", {
      code,
      hostName: args.hostName,
      status: "waiting",
      durationSeconds: args.durationSeconds ?? 180,
    });

    // Add host as first player
    const playerId = await ctx.db.insert("roomPlayers", {
      roomId,
      name: args.hostName,
      score: 0,
      planesDowned: 0,
      accuracy: 0,
      isHost: true,
      isFinished: false,
      lastUpdated: Date.now(),
    });

    return { roomId, code, playerId };
  },
});

// Tham gia phòng thi đấu
export const joinRoom = mutation({
  args: {
    code: v.string(),
    playerName: v.string(),
  },
  handler: async (ctx, args) => {
    const room = await ctx.db
      .query("rooms")
      .withIndex("by_code", (q) => q.eq("code", args.code.toUpperCase().trim()))
      .first();

    if (!room) {
      throw new Error("Không tìm thấy phòng thi đấu với mã này!");
    }

    if (room.status === "finished") {
      throw new Error("Trận đấu trong phòng này đã kết thúc!");
    }

    const playerId = await ctx.db.insert("roomPlayers", {
      roomId: room._id,
      name: args.playerName,
      score: 0,
      planesDowned: 0,
      accuracy: 0,
      isHost: false,
      isFinished: false,
      lastUpdated: Date.now(),
    });

    return { roomId: room._id, code: room.code, playerId, room };
  },
});

// Lấy thông tin phòng & danh sách người chơi trực tiếp (Realtime subscription)
export const getRoomData = query({
  args: { roomId: v.id("rooms") },
  handler: async (ctx, args) => {
    const room = await ctx.db.get(args.roomId);
    if (!room) return null;

    const players = await ctx.db
      .query("roomPlayers")
      .withIndex("by_room", (q) => q.eq("roomId", args.roomId))
      .collect();

    // Sort players by score descending
    players.sort((a, b) => b.score - a.score);

    return { room, players };
  },
});

// Host bắt đầu trận đấu
export const startRoomGame = mutation({
  args: { roomId: v.id("rooms") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.roomId, {
      status: "playing",
      startedAt: Date.now(),
    });
  },
});

// Cập nhật điểm số người chơi trong trận
export const updatePlayerStats = mutation({
  args: {
    playerId: v.id("roomPlayers"),
    score: v.number(),
    planesDowned: v.number(),
    accuracy: v.number(),
    isFinished: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.playerId, {
      score: args.score,
      planesDowned: args.planesDowned,
      accuracy: args.accuracy,
      isFinished: args.isFinished ?? false,
      lastUpdated: Date.now(),
    });
  },
});
