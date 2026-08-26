import { query, mutation } from "./_generated/server";
import { ConvexError, v } from "convex/values";

// 1. Giảng viên / Host tạo phòng thi đấu mới với mã PIN
export const createRoom = mutation({
  args: {
    hostName: v.string(),
    durationSeconds: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // Generate PIN 6 chữ số dễ nhớ (ví dụ: 195401, 715902...)
    const pin = Math.floor(100000 + Math.random() * 900000).toString();
    const roomId = await ctx.db.insert("dbpRooms", {
      code: pin,
      hostName: args.hostName.trim(),
      status: "waiting",
      durationSeconds: args.durationSeconds ?? 300, // Default 5 minutes
    });

    // Tạo bản ghi Host
    const hostPlayerId = await ctx.db.insert("dbpPlayers", {
      roomId,
      name: args.hostName.trim() + " (Giảng Viên)",
      score: 0,
      planesDowned: 0,
      accuracy: 0,
      shotsFired: 0,
      questionsAnswered: 0,
      isHost: true,
      isFinished: false,
      lastEvent: "Đã mở phòng thi đấu",
      lastUpdated: Date.now(),
    });

    await ctx.db.insert("dbpBattleLogs", {
      roomId,
      playerName: args.hostName.trim(),
      message: "Đã tạo phòng thi đấu. Đang chờ sinh viên tham gia!",
      type: "medal",
      timestamp: Date.now(),
    });

    return { roomId, code: pin, playerId: hostPlayerId };
  },
});

// 2. Sinh viên tham gia phòng bằng Mã PIN (Khóa khi đã bắt đầu & Cấm trùng tên)
export const joinRoom = mutation({
  args: {
    code: v.string(),
    playerName: v.string(),
  },
  handler: async (ctx, args) => {
    const cleanPin = args.code.trim();
    const cleanName = args.playerName.trim();

    if (!cleanName) {
      throw new ConvexError("Vui lòng nhập Họ & Tên của bạn!");
    }

    const room = await ctx.db
      .query("dbpRooms")
      .withIndex("by_code", (q) => q.eq("code", cleanPin))
      .first();

    if (!room) {
      throw new ConvexError("Không tìm thấy phòng với mã PIN này! Vui lòng kiểm tra lại.");
    }

    // 🔒 1. Khóa phòng: Không cho phép vào giữa chừng khi trận đấu đã bắt đầu
    if (room.status === "playing") {
      throw new ConvexError("Trận đấu đang diễn ra! Phòng đã bị khóa, không thể tham gia giữa chừng.");
    }

    if (room.status === "finished") {
      throw new ConvexError("Trận đấu trong phòng này đã kết thúc!");
    }

    // 🚫 2. Kiểm tra trùng tên: Tuyệt đối không cho phép đặt tên trùng nhau
    const existingPlayers = await ctx.db
      .query("dbpPlayers")
      .withIndex("by_room", (q) => q.eq("roomId", room._id))
      .collect();

    const isDuplicate = existingPlayers.some(
      (p) => p.name.trim().toLowerCase() === cleanName.toLowerCase()
    );

    if (isDuplicate) {
      throw new ConvexError(`Tên "${cleanName}" đã có người sử dụng trong phòng! Vui lòng chọn tên khác.`);
    }

    const playerId = await ctx.db.insert("dbpPlayers", {
      roomId: room._id,
      name: cleanName,
      score: 0,
      planesDowned: 0,
      accuracy: 0,
      shotsFired: 0,
      questionsAnswered: 0,
      isHost: false,
      isFinished: false,
      lastEvent: "Đã tham gia phòng chờ",
      lastUpdated: Date.now(),
    });

    // Add log
    await ctx.db.insert("dbpBattleLogs", {
      roomId: room._id,
      playerName: cleanName,
      message: `${cleanName} đã vào trận địa!`,
      type: "reload",
      timestamp: Date.now(),
    });

    return { roomId: room._id, code: room.code, playerId, room, playerName: cleanName };
  },
});

// 3. Realtime Subscription: Lấy trạng thái phòng, danh sách bảng điểm và nhật ký
export const getRoomLiveState = query({
  args: { roomId: v.id("dbpRooms") },
  handler: async (ctx, args) => {
    const room = await ctx.db.get(args.roomId);
    if (!room) return null;

    // Lấy toàn bộ người chơi
    const players = await ctx.db
      .query("dbpPlayers")
      .withIndex("by_room", (q) => q.eq("roomId", args.roomId))
      .collect();

    // Sắp xếp bảng điểm theo điểm số giảm dần
    players.sort((a, b) => b.score - a.score);

    // Lấy 15 nhật ký chiến sự mới nhất
    const logs = await ctx.db
      .query("dbpBattleLogs")
      .withIndex("by_room_time", (q) => q.eq("roomId", args.roomId))
      .order("desc")
      .take(15);

    return { room, players, logs };
  },
});

// 4. Giảng viên bấm Bắt đầu trận đấu (Đồng bộ tất cả màn hình)
export const startRoomBattle = mutation({
  args: { roomId: v.id("dbpRooms") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.roomId, {
      status: "playing",
      startedAt: Date.now(),
    });

    await ctx.db.insert("dbpBattleLogs", {
      roomId: args.roomId,
      playerName: "CHỈ HUY TRƯỞNG",
      message: "LỆNH TỔNG CÔNG KÍCH! TOÀN BỘ PHÁO CAO XẠ 37MM KHAI HỎA!",
      type: "medal",
      timestamp: Date.now(),
    });
  },
});

// 5. Sinh viên cập nhật điểm số & thành tích trực tiếp (Realtime Sync)
export const syncPlayerProgress = mutation({
  args: {
    playerId: v.id("dbpPlayers"),
    score: v.number(),
    planesDowned: v.number(),
    accuracy: v.number(),
    shotsFired: v.number(),
    questionsAnswered: v.number(),
    isFinished: v.optional(v.boolean()),
    recentEvent: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const player = await ctx.db.get(args.playerId);
    if (!player) return;

    await ctx.db.patch(args.playerId, {
      score: args.score,
      planesDowned: args.planesDowned,
      accuracy: args.accuracy,
      shotsFired: args.shotsFired,
      questionsAnswered: args.questionsAnswered,
      isFinished: args.isFinished ?? false,
      lastEvent: args.recentEvent ?? player.lastEvent,
      lastUpdated: Date.now(),
    });

    // Nếu có sự kiện bắn hạ máy bay thì đẩy vào Battle Log
    if (args.recentEvent && args.recentEvent.includes("Bắn hạ")) {
      await ctx.db.insert("dbpBattleLogs", {
        roomId: player.roomId,
        playerName: player.name,
        message: `${player.name} ${args.recentEvent}`,
        type: "kill",
        timestamp: Date.now(),
      });
    }
  },
});

// 6. Giảng viên kết thúc trận đấu
export const finishRoomBattle = mutation({
  args: { roomId: v.id("dbpRooms") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.roomId, {
      status: "finished",
      finishedAt: Date.now(),
    });

    await ctx.db.insert("dbpBattleLogs", {
      roomId: args.roomId,
      playerName: "HỆ THỐNG",
      message: "HẾT GIỜ! TOÀN THẮNG CHIẾN DỊCH ĐIỆN BIÊN PHỦ 1954!",
      type: "medal",
      timestamp: Date.now(),
    });
  },
});

// 7. Giảng viên cập nhật thời lượng trận đấu (3p, 5p, 10p, 15p hoặc tùy chỉnh)
export const updateRoomDuration = mutation({
  args: {
    roomId: v.id("dbpRooms"),
    durationSeconds: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.roomId, {
      durationSeconds: Math.max(30, args.durationSeconds),
    });
  },
});
