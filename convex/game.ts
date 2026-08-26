import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// 1. Host starts the game
export const startGame = mutation({
  args: { roomId: v.id("rooms"), playerId: v.id("players") },
  handler: async (ctx, args) => {
    const room = await ctx.db.get(args.roomId);
    if (!room) throw new Error("Phòng không tồn tại!");

    const player = await ctx.db.get(args.playerId);
    if (!player || !player.isHost)
      throw new Error("Chỉ chủ phòng mới có thể bắt đầu!");

    if (room.status !== "lobby")
      throw new Error("Trò chơi đã bắt đầu rồi!");

    const players = await ctx.db
      .query("players")
      .withIndex("by_roomId", (q) => q.eq("roomId", args.roomId))
      .collect();

    const hasAnyPlayer = players.some((p) => !p.isHost);
    if (!hasAnyPlayer) {
      throw new Error("Cần ít nhất 1 người chơi để bắt đầu!");
    }

    // Reset score and submission state for all players
    for (const p of players) {
      await ctx.db.patch(p._id, {
        score: 0,
        lastScoreIncrement: 0,
        hasSubmitted: false,
        currentChoice: null,
      });
    }

    await ctx.db.patch(room._id, {
      status: "playing",
      currentRound: 1,
      phase: "choosing",
    });
  },
});

// 2. Player submits answer in real-time
export const submitChoice = mutation({
  args: {
    playerId: v.id("players"),
    answer: v.string(),
    scoreIncrement: v.number(),
  },
  handler: async (ctx, args) => {
    const player = await ctx.db.get(args.playerId);
    if (!player) throw new Error("Người chơi không tồn tại!");
    if (player.hasSubmitted) throw new Error("Bạn đã trả lời câu này rồi!");

    const room = await ctx.db.get(player.roomId);
    if (!room || room.status !== "playing" || room.phase !== "choosing") {
      throw new Error("Không thể trả lời lúc này!");
    }

    // Update cumulative score and status
    const currentScore = player.score ?? 0;
    await ctx.db.patch(args.playerId, {
      currentChoice: args.answer,
      score: currentScore + args.scoreIncrement,
      lastScoreIncrement: args.scoreIncrement,
      hasSubmitted: true,
    });

    // Check if all non-host players submitted
    const allPlayers = await ctx.db
      .query("players")
      .withIndex("by_roomId", (q) => q.eq("roomId", player.roomId))
      .collect();

    const nonHostPlayers = allPlayers.filter((p) => !p.isHost);
    const allSubmitted = nonHostPlayers.every((p) => p.hasSubmitted);

    if (allSubmitted) {
      // Advance to results phase to show answer and leaderboard
      await ctx.db.patch(player.roomId, {
        phase: "results",
      });
    }
  },
});

// 3. Force end current round (timeout or host skip)
export const forceProcessRound = mutation({
  args: { roomId: v.id("rooms"), playerId: v.id("players") },
  handler: async (ctx, args) => {
    const room = await ctx.db.get(args.roomId);
    if (!room) throw new Error("Phòng không tồn tại!");

    const player = await ctx.db.get(args.playerId);
    if (!player || !player.isHost)
      throw new Error("Chỉ chủ phòng mới có thể dùng chức năng này!");

    const players = await ctx.db
      .query("players")
      .withIndex("by_roomId", (q) => q.eq("roomId", args.roomId))
      .collect();

    for (const p of players) {
      if (p.isHost || p.hasSubmitted) continue;

      await ctx.db.patch(p._id, {
        currentChoice: "KHÔNG TRẢ LỜI",
        lastScoreIncrement: 0,
        hasSubmitted: true,
      });
    }

    await ctx.db.patch(args.roomId, {
      phase: "results",
    });
  },
});

// 4. Advance to next round (Total 16 rounds for 1945 - 1946 History)
export const nextRound = mutation({
  args: { roomId: v.id("rooms"), playerId: v.id("players"), totalRounds: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const room = await ctx.db.get(args.roomId);
    if (!room) throw new Error("Phòng không tồn tại!");

    const player = await ctx.db.get(args.playerId);
    if (!player || !player.isHost)
      throw new Error("Chỉ chủ phòng mới có thể tiếp tục!");

    const maxRounds = args.totalRounds ?? 16;

    // Reset submission state for all players
    const players = await ctx.db
      .query("players")
      .withIndex("by_roomId", (q) => q.eq("roomId", args.roomId))
      .collect();

    for (const p of players) {
      await ctx.db.patch(p._id, {
        hasSubmitted: false,
        currentChoice: null,
        lastScoreIncrement: 0,
      });
    }

    // Finish when reached maximum rounds
    if (room.currentRound >= maxRounds) {
      await ctx.db.patch(args.roomId, {
        status: "finished",
        phase: "results",
      });
    } else {
      await ctx.db.patch(args.roomId, {
        currentRound: room.currentRound + 1,
        phase: "choosing",
      });
    }
  },
});

// 5. Host prematurely ends game
export const endGame = mutation({
  args: { roomId: v.id("rooms"), playerId: v.id("players") },
  handler: async (ctx, args) => {
    const room = await ctx.db.get(args.roomId);
    if (!room) throw new Error("Phòng không tồn tại!");

    const player = await ctx.db.get(args.playerId);
    if (!player || !player.isHost)
      throw new Error("Chỉ chủ phòng mới có thể kết thúc trò chơi!");

    await ctx.db.patch(args.roomId, {
      status: "finished",
      phase: "results",
    });
  },
});
