import React, { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id, Doc } from "../../convex/_generated/dataModel";
import { motion, AnimatePresence } from "motion/react";
import confetti from "canvas-confetti";
import {
  BookOpen,
  MonitorPlay,
  Users,
  LogIn,
  ScrollText,
  X,
  Trophy,
  PlusCircle,
  Crown,
  Check,
  LogOut,
  Volume2,
  VolumeX,
  Timer,
  Send,
  Copy,
  Zap,
  Maximize2,
  HelpCircle,
  Sparkles,
  CheckCircle2,
  Image as ImageIcon,
  ArrowLeft
} from "lucide-react";

import { SCENARIOS } from "../data/wordGuessData";
import { sound } from "../audio/SoundEngine";

const ovtkMp3 = "/sound/astral.mp3";
const liberationMp3 = "/sound/symphony.mp3";
const winMp3 = "/sound/win.mp3";

const calculateQuickScore = (remainingMs: number) => {
  return Math.floor(remainingMs / 10); // Tính điểm: thời gian còn lại (ms) chia 10 (tối đa ~6000 điểm)
};

function sortPlayersByScore(players: Doc<"players">[]) {
  return [...players].sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
}

// ============================================================
// RULES MODAL
// ============================================================
function RulesModal({ show, onClose }: { show: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/75 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="bg-[#1c2419] rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col border-2 border-[#ffd700]"
          >
            <div className="bg-[#141b12] border-b border-[#44563a] p-5 md:p-6 text-white flex justify-between items-center shrink-0">
              <h2 className="text-xl md:text-2xl font-military font-bold flex items-center gap-3 tracking-tight text-[#ffd700]">
                <ScrollText className="w-6 h-6 md:w-7 md:h-7 text-yellow-400" /> Luật Chơi Đấu Trường Lịch Sử Đảng
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white hover:bg-white/10 p-2 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 md:p-8 overflow-y-auto space-y-6 text-gray-200 font-military custom-scrollbar">
              <div className="bg-[#8b0000]/20 border-l-4 border-yellow-400 p-5 rounded-r-xl">
                <p className="text-yellow-200 leading-relaxed italic text-base md:text-lg font-medium">
                  "Khám phá và giải mã 16 sự kiện, phong trào, chỉ thị và văn kiện lịch sử Đảng Cộng sản Việt Nam giai đoạn 1945–1946!"
                </p>
              </div>

              <section>
                <h3 className="font-bold text-xl text-[#ffd700] mb-3">
                  🎯 Thể Thức Thi Đấu (Tổng {SCENARIOS.length} Vòng)
                </h3>
                <div className="space-y-3 text-sm md:text-base">
                  <div className="p-4 rounded-2xl bg-black/40 border border-white/10">
                    <div className="font-bold text-yellow-300 flex items-center gap-2 mb-1">
                      <ImageIcon className="w-5 h-5" /> Đuổi Hình Bắt Chữ Trực Tiếp
                    </div>
                    <p className="text-gray-300">
                      Quan sát ảnh tư liệu lịch sử, manh mối và số lượng ô chữ. Gõ đáp án chính xác càng nhanh càng nhận được nhiều điểm thưởng.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="font-bold text-xl text-[#ffd700] mb-3">
                  🏆 Cơ Chế Tính Điểm Mili-giây
                </h3>
                <div className="bg-black/50 p-5 rounded-2xl border border-yellow-500/30 text-center">
                  <div className="text-2xl font-bold text-yellow-400 mb-1">Thời gian là điểm số!</div>
                  <p className="text-sm text-gray-300">
                    Mỗi vòng có 60 giây. Người chơi gửi đáp án đúng càng sớm sẽ nhận điểm số càng cao (tối đa ~6000 điểm mỗi vòng).
                  </p>
                </div>
              </section>
            </div>

            <div className="p-5 border-t border-[#44563a] bg-[#141b12] flex justify-end shrink-0">
              <button
                onClick={onClose}
                className="bg-gradient-to-r from-[#8b0000] to-[#b22222] text-white px-8 py-2.5 rounded-xl font-bold text-base hover:scale-105 transition-all shadow-lg cursor-pointer"
              >
                Đã Hiểu, Sẵn Sàng!
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ============================================================
// LOBBY VIEW
// ============================================================
function LobbyView({
  onCreateRoom,
  onJoinRoom,
  error,
  loading,
}: {
  onCreateRoom: (name: string, password?: string) => void;
  onJoinRoom: (code: string, name: string) => void;
  error: string | null;
  loading: boolean;
}) {
  const [hostName, setHostName] = useState("");
  const [hostPassword, setHostPassword] = useState("");
  const [joinCode, setJoinCode] = useState(() => {
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const code = searchParams.get("code") || searchParams.get("room") || "";
      return code.replace(/\D/g, "").slice(0, 5);
    } catch {
      return "";
    }
  });
  const [joinName, setJoinName] = useState("");

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
  };

  return (
    <motion.main
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-5xl w-full px-4 flex-grow flex flex-col justify-center pb-12"
    >
      <motion.div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#8b0000] border border-[#ffd700]/50 text-[#ffd700] font-military font-bold text-xs uppercase tracking-widest mb-3 shadow-md shadow-red-950/60">
          <Sparkles className="w-4 h-4" /> Đấu Trường Tri Thức Lịch Sử Đảng · {SCENARIOS.length} Vòng Thi Đấu
        </div>
        <h1 className="font-military text-3xl md:text-5xl font-black text-white mb-3 tracking-wide uppercase drop-shadow-md">
          NHÌN HÌNH ĐOÁN CHỮ <span className="text-[#ffd700]">(1945 - 1946)</span>
        </h1>
        <p className="text-sm md:text-base text-gray-300 font-military max-w-2xl mx-auto leading-relaxed">
          Đấu trường giải mã ô chữ trực tuyến thời gian thực dành cho giảng đường và thuyết trình!
        </p>
      </motion.div>

      {error && (
        <motion.div className="max-w-md mx-auto mb-6 bg-red-950/80 border border-red-500/50 text-red-200 px-5 py-3 rounded-xl text-center font-military text-sm">
          {error}
        </motion.div>
      )}

      <div className="flex flex-col md:flex-row gap-6 justify-center">
        {/* Host card */}
        <motion.div className="group bg-[#1c2419]/95 rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-[#ffd700]/70 hover:border-[#ffd700] w-full md:w-1/2 flex flex-col items-center text-center backdrop-blur-md">
          <div className="bg-[#8b0000] p-4 rounded-2xl mb-4 text-[#ffd700] group-hover:scale-110 transition-transform shadow-lg shadow-red-950/60">
            <Crown className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black font-military mb-2 text-white">Bạn là Quản Trò?</h2>
          <p className="text-xs text-gray-300 font-military mb-6 leading-relaxed">
            Tạo phòng chơi mới, phát mã PIN/QR trình chiếu câu hỏi và bảng xếp hạng trên màn hình lớn.
          </p>
          <div className="mt-auto w-full space-y-3">
            <input
              type="text"
              placeholder="Tên Giảng viên / Quản trò"
              value={hostName}
              onChange={(e) => setHostName(e.target.value)}
              className="w-full bg-black/60 border border-white/20 text-white py-3 px-4 rounded-xl font-military text-center text-sm focus:outline-none focus:border-[#ffd700]"
            />
            <input
              type="password"
              placeholder="Mật khẩu tạo phòng (Admin@123)"
              value={hostPassword}
              onChange={(e) => setHostPassword(e.target.value)}
              className="w-full bg-black/60 border border-white/20 text-white py-3 px-4 rounded-xl font-military text-center text-sm focus:outline-none focus:border-[#ffd700]"
            />
            <button
              onClick={() => onCreateRoom(hostName.trim(), hostPassword)}
              disabled={!hostName.trim() || !hostPassword.trim() || loading}
              className="w-full bg-gradient-to-r from-[#8b0000] to-[#b22222] hover:from-[#a00000] hover:to-[#c41e3a] text-white py-3.5 rounded-xl font-military font-bold text-sm md:text-base flex justify-center items-center gap-2 shadow-lg shadow-red-950/80 disabled:opacity-50 cursor-pointer transition-all hover:scale-[1.02]"
            >
              <PlusCircle className="w-5 h-5" />
              {loading ? "Đang tạo..." : "TẠO PHÒNG MỚI"}
            </button>
          </div>
        </motion.div>

        {/* Player card */}
        <motion.div className="group bg-[#1c2419]/95 rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-[#44563a] hover:border-emerald-500/80 w-full md:w-1/2 flex flex-col items-center text-center backdrop-blur-md">
          <div className="bg-[#2d3b27] p-4 rounded-2xl mb-4 text-emerald-400 group-hover:scale-110 transition-transform shadow-lg">
            <Users className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black font-military mb-2 text-white">Bạn là Người Chơi?</h2>
          <p className="text-xs text-gray-300 font-military mb-6 leading-relaxed">
            Nhập mã PIN 5 số từ màn hình máy chiếu của quản trò để tham gia tranh tài trực tiếp.
          </p>
          <div className="w-full flex flex-col gap-3 mt-auto">
            <input
              type="text"
              placeholder="Nhập mã phòng (5 số)"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.replace(/\D/g, "").slice(0, 5))}
              className="w-full bg-black/60 border border-white/20 text-yellow-300 py-3 px-4 rounded-xl font-mono font-bold text-center text-lg tracking-widest uppercase focus:outline-none focus:border-emerald-500"
            />
            <input
              type="text"
              placeholder="Họ & Tên của bạn"
              value={joinName}
              onChange={(e) => setJoinName(e.target.value)}
              className="w-full bg-black/60 border border-white/20 text-white py-3 px-4 rounded-xl font-military text-center text-sm focus:outline-none focus:border-emerald-500"
            />
            <button
              onClick={() => onJoinRoom(joinCode.trim(), joinName.trim())}
              disabled={!joinCode.trim() || !joinName.trim() || loading}
              className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white py-3.5 rounded-xl font-military font-bold text-sm md:text-base flex justify-center items-center gap-2 shadow-lg shadow-emerald-950/80 disabled:opacity-50 cursor-pointer transition-all hover:scale-[1.02]"
            >
              <LogIn className="w-5 h-5" />
              {loading ? "Đang tham gia..." : "THAM GIA NGAY"}
            </button>
          </div>
        </motion.div>
      </div>
    </motion.main>
  );
}

// ============================================================
// WAITING ROOM VIEW
// ============================================================
function WaitingRoom({
  room,
  players,
  isHost,
  onStart,
  onLeave,
  musicEnabled,
  onToggleMusic,
}: {
  room: Doc<"rooms">;
  players: Doc<"players">[];
  isHost: boolean;
  onStart: () => void;
  onLeave: () => void;
  musicEnabled: boolean;
  onToggleMusic: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [showLargeQr, setShowLargeQr] = useState(false);

  const nonHostPlayers = players.filter((p) => !p.isHost);
  const canStart = nonHostPlayers.length > 0;

  const copyCode = () => {
    navigator.clipboard.writeText(room.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const joinLink = `${window.location.origin}${window.location.pathname}?game=wordguess&code=${room.code}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(joinLink)}`;

  const copyLink = () => {
    navigator.clipboard.writeText(joinLink);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl w-full px-4 mx-auto">
      <div className="bg-[#1c2419] rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-[#ffd700]/70 text-white font-military">
        <div className="text-center mb-6">
          <h2 className="text-2xl sm:text-3xl font-black text-[#ffd700] mb-1 tracking-wide">PHÒNG CHỜ THI ĐẤU</h2>
          <p className="text-xs text-gray-300">Chia sẻ mã PIN hoặc quét mã QR bên dưới để tham gia</p>
        </div>

        {/* Room Code */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="bg-black/60 border-2 border-yellow-500/50 rounded-2xl px-6 py-3 shadow-inner">
            <span className="font-mono text-3xl sm:text-4xl font-black text-yellow-300 tracking-[0.25em]">{room.code}</span>
          </div>
          <button onClick={copyCode} title="Sao chép mã" className="p-3 rounded-xl bg-black/40 hover:bg-black/60 border border-white/20 text-yellow-400 cursor-pointer">
            {copied ? <Check className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5" />}
          </button>
          <button onClick={onToggleMusic} title="Bật/Tắt nhạc nền" className="p-3 rounded-xl bg-black/40 hover:bg-black/60 border border-white/20 text-yellow-400 cursor-pointer">
            {musicEnabled ? <Volume2 className="w-5 h-5 text-emerald-400" /> : <VolumeX className="w-5 h-5 text-red-400" />}
          </button>
        </div>

        {isHost && (
          <div className="flex flex-col items-center bg-black/40 border border-white/10 rounded-2xl p-4 mb-6 max-w-xs mx-auto text-center">
            <p className="text-xs font-bold text-yellow-300 mb-2">Quét mã QR để vào phòng:</p>
            <div 
              className="relative group bg-white p-3 rounded-xl border border-white/20 shadow-md cursor-pointer overflow-hidden"
              onClick={() => setShowLargeQr(true)}
            >
              <img src={qrUrl} alt="Join QR Code" className="w-36 h-36 object-contain animate-fade-in" />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-xs font-bold gap-1">
                <Maximize2 className="w-4 h-4" />
                <span>Phóng to</span>
              </div>
            </div>
            
            <div className="flex gap-2 mt-3 w-full justify-center">
              <button
                onClick={() => setShowLargeQr(true)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-black/60 hover:bg-black/80 text-yellow-300 border border-white/20 text-xs font-bold transition-all cursor-pointer"
              >
                <Maximize2 className="w-3.5 h-3.5" /> Phóng to
              </button>
              <button
                onClick={copyLink}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-black/60 hover:bg-black/80 text-yellow-300 border border-white/20 text-xs font-bold transition-all cursor-pointer min-w-[90px] justify-center"
              >
                {linkCopied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Đã chép</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Chép link</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Player List */}
        <div className="mb-6">
          <h3 className="text-xs uppercase tracking-wider text-gray-300 font-bold mb-3 flex items-center gap-2">
            <Users className="w-4 h-4 text-yellow-400" /> Danh sách người chơi ({players.length})
          </h3>
          <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar pr-1">
            {players.map((p) => (
              <div key={p._id} className="flex items-center gap-3 bg-black/40 border border-white/10 px-4 py-2.5 rounded-xl">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${p.isHost ? "bg-[#8b0000] text-yellow-300" : "bg-emerald-700 text-white"}`}>
                  {p.name.charAt(0).toUpperCase()}
                </div>
                <span className="font-bold text-white flex-1 truncate text-sm">{p.name}</span>
                {p.isHost && (
                  <span className="flex items-center gap-1 text-[11px] font-bold text-yellow-300 bg-[#8b0000]/60 border border-yellow-500/40 px-2.5 py-0.5 rounded-full shrink-0">
                    <Crown className="w-3 h-3 text-yellow-400" /> Quản trò
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2.5">
          {isHost ? (
            <button
              onClick={onStart}
              disabled={!canStart}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-military font-bold text-base flex justify-center items-center gap-2 shadow-lg shadow-emerald-950/80 disabled:opacity-40 cursor-pointer transition-all hover:scale-[1.02]"
            >
              <Zap className="w-5 h-5 fill-white" /> Bắt Đầu Trò Chơi ({SCENARIOS.length} Vòng)
            </button>
          ) : (
            <div className="text-center py-3 bg-black/40 rounded-xl border border-white/10 text-yellow-300 text-xs font-bold">
              Đang chờ Quản trò bấm bắt đầu trận đấu...
            </div>
          )}
          <button onClick={onLeave} className="w-full py-2.5 rounded-xl text-xs font-bold text-gray-300 hover:text-red-400 hover:bg-red-950/30 flex justify-center items-center gap-1.5 border border-white/10 transition-colors cursor-pointer">
            <LogOut className="w-4 h-4" /> Rời phòng
          </button>
        </div>
      </div>

      {/* Enlarged QR Modal */}
      <AnimatePresence>
        {showLargeQr && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/85 backdrop-blur-md z-[110] flex items-center justify-center p-4"
            onClick={() => setShowLargeQr(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#1c2419] rounded-3xl p-6 max-w-md w-full border-2 border-[#ffd700] shadow-2xl flex flex-col items-center relative text-white font-military"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowLargeQr(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white p-2 rounded-full cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>

              <h3 className="text-lg font-black text-center text-[#ffd700] mb-1">
                Quét Mã QR Tham Gia Đấu Trường
              </h3>
              <p className="text-xs text-gray-300 text-center mb-4">
                Mở camera điện thoại quét mã QR bên dưới để vào phòng ngay
              </p>

              <div className="bg-white p-4 rounded-2xl border shadow-md mb-4">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(joinLink)}`}
                  alt="Large Join QR Code"
                  className="w-60 h-60 object-contain"
                />
              </div>

              <div className="bg-black/60 px-4 py-2 rounded-xl border border-yellow-500/40 flex flex-col items-center gap-0.5 mb-4 w-full text-center">
                <span className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">Mã PIN Phòng:</span>
                <span className="font-mono text-2xl font-black text-yellow-300 tracking-[0.2em]">
                  {room.code}
                </span>
              </div>

              <button
                onClick={copyLink}
                className="w-full bg-gradient-to-r from-[#8b0000] to-[#b22222] text-white py-3 rounded-xl font-bold text-xs hover:scale-105 transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer"
              >
                {linkCopied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" /> Đã Sao Chép Link
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" /> Sao Chép Link Tham Gia
                  </>
                )}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ============================================================
// GAMEPLAY VIEW: ĐUỔI HÌNH BẮT CHỮ
// ============================================================
function GameplayView({
  room,
  currentPlayer,
  players,
  onChoice,
  onForceRound,
  onEndGame,
}: {
  room: Doc<"rooms">;
  currentPlayer: Doc<"players">;
  players: Doc<"players">[];
  onChoice: (answer: string, score: number) => void;
  onForceRound: () => void;
  onEndGame: () => void;
}) {
  const [answer, setAnswer] = useState("");
  const [isWrong, setIsWrong] = useState(false);
  const [startTime] = useState(Date.now());
  const [displayTime, setDisplayTime] = useState("60.0");

  const scenario = SCENARIOS[room.currentRound - 1];

  // Randomize indices to reveal characters gradually as time passes
  const revealOrder = React.useMemo(() => {
    if (!scenario) return [];
    const cleanAnswer = scenario.correctAnswer;
    const indices: number[] = [];
    for (let i = 0; i < cleanAnswer.length; i++) {
      if (cleanAnswer[i] !== " ") {
        indices.push(i);
      }
    }
    // Fisher-Yates shuffle
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    return indices;
  }, [scenario?.correctAnswer]);

  const remainingMs = Math.max(0, parseFloat(displayTime) * 1000);
  const elapsed = 60000 - remainingMs;
  const ratio = Math.min(1, elapsed / 60000);
  const numRevealed = Math.floor(ratio * revealOrder.length);
  const revealedIndices = new Set(revealOrder.slice(0, numRevealed));

  useEffect(() => {
    const timer = setInterval(() => {
      const el = Date.now() - startTime;
      const rem = Math.max(0, 60000 - el);
      setDisplayTime((rem / 1000).toFixed(2));

      if (rem <= 0) {
        clearInterval(timer);
        if (currentPlayer.isHost) onForceRound();
      }
    }, 16);
    return () => clearInterval(timer);
  }, [startTime, currentPlayer.isHost, onForceRound]);

  // Handle Catchphrase input
  const handleSendCatchphraseAnswer = () => {
    if (!scenario) return;
    const normalize = (s: string) =>
      s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").trim();

    const isCorrect = normalize(answer) === normalize(scenario.correctAnswer);

    if (isCorrect) {
      const el = Date.now() - startTime;
      const rem = Math.max(0, 60000 - el);
      const finalScore = calculateQuickScore(rem);
      sound.playQuizSuccess();
      onChoice(answer.trim(), finalScore);
    } else {
      setIsWrong(true);
      sound.playQuizWrong();
      setTimeout(() => setIsWrong(false), 500);
      setAnswer("");
    }
  };

  if (!scenario) return null;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl w-full px-4 mx-auto font-military">
      {/* Top Controls Bar */}
      <div className="flex justify-between items-center mb-4 bg-[#1c2419] p-3 sm:p-4 rounded-2xl shadow-lg border border-[#ffd700]/50">
        <div className="flex items-center gap-3">
          <span className="bg-[#8b0000] border border-[#ffd700]/50 text-yellow-300 px-3 py-1 rounded-full font-bold text-xs sm:text-sm">
            Câu {room.currentRound}/{SCENARIOS.length}
          </span>
          <span className="bg-amber-500/20 text-yellow-300 border border-yellow-500/40 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider hidden sm:flex items-center gap-1.5">
            <ImageIcon className="w-3.5 h-3.5" /> Đuổi Hình Bắt Chữ
          </span>

          {currentPlayer.isHost && (
            <div className="flex gap-2 ml-2">
              <button
                onClick={onForceRound}
                className="bg-amber-600 hover:bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-sm cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5" /> Hết giờ / Mở đáp án
              </button>
              <button
                onClick={onEndGame}
                className="bg-red-700 hover:bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" /> Kết thúc
              </button>
            </div>
          )}
        </div>

        <div className={`flex items-center gap-1.5 font-mono text-xl sm:text-2xl font-black ${parseFloat(displayTime) < 10 ? "text-red-400 animate-pulse" : "text-yellow-300"}`}>
          <Timer className="w-5 h-5" />
          {displayTime}s
        </div>
      </div>

      <div className="space-y-4 max-w-3xl mx-auto w-full">
        {/* Question Text */}
        <div className="bg-[#8b0000] border border-[#ffd700]/50 p-3 sm:p-4 rounded-2xl shadow-md text-center">
          <span className="text-[10px] uppercase text-yellow-300 font-bold tracking-wider block">
            CÂU HỎI TRỌNG TÂM
          </span>
          <h2 className="text-base sm:text-xl font-black text-white">
            {scenario.question}
          </h2>
        </div>

        {/* Image Presentation */}
        <motion.div
          key={room.currentRound}
          className="bg-black/70 p-2 sm:p-3 rounded-2xl shadow-xl border-2 border-yellow-500/40 min-h-[190px] sm:min-h-[240px] flex items-center justify-center overflow-hidden w-full relative"
        >
          {scenario.image ? (
            <img src={scenario.image} alt={scenario.question} className="max-h-56 sm:max-h-64 object-contain rounded-xl" />
          ) : scenario.iconSvg ? (
            <div className="w-48 h-48 flex items-center justify-center" dangerouslySetInnerHTML={{ __html: scenario.iconSvg }} />
          ) : (
            <div className="text-gray-400 text-sm">Hình ảnh tư liệu lịch sử</div>
          )}
          <div className="absolute bottom-2 left-3 right-3 text-[11px] text-yellow-300 font-bold truncate text-center bg-black/60 py-0.5 rounded">
            📷 Tư liệu Lịch sử Đảng CSVN (1945–1946)
          </div>
        </motion.div>

        {/* Input Box for Players */}
        {!currentPlayer.isHost && !currentPlayer.hasSubmitted ? (
          <motion.div
            animate={isWrong ? { x: [-10, 10, -10, 10, 0] } : {}}
            className="relative group"
          >
            <input
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendCatchphraseAnswer()}
              placeholder="Gõ đáp án chính xác (Enter để gửi)..."
              className="w-full bg-black/70 border-2 border-yellow-500/60 text-yellow-300 py-3 px-5 sm:py-4 sm:px-6 rounded-2xl font-black text-base sm:text-xl text-center focus:border-yellow-400 outline-none uppercase shadow-inner placeholder:text-gray-500"
            />
            <button
              onClick={handleSendCatchphraseAnswer}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-[#8b0000] to-[#b22222] text-white p-2.5 sm:p-3 rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg cursor-pointer"
            >
              <Send className="w-5 h-5 text-yellow-300" />
            </button>
          </motion.div>
        ) : (
          <div className="bg-emerald-950/60 border-2 border-emerald-500/50 p-4 rounded-2xl text-center">
            <p className="text-sm sm:text-base font-bold text-emerald-300">
              {currentPlayer.isHost ? "Quản trò đang trình chiếu câu đố cho cả lớp..." : "✓ Đã gửi đáp án đúng! Đang chờ tổng kết điểm vòng này..."}
            </p>
          </div>
        )}

        {scenario.suggestion && (
          <div className="flex justify-center">
            <p className="text-gray-300 italic font-medium bg-black/50 border border-white/10 px-4 py-1.5 rounded-full text-xs text-center">
              💡 Gợi ý: {scenario.suggestion}
            </p>
          </div>
        )}

        {/* HINT BOARD: Letter reveal boxes */}
        <div className="flex flex-wrap justify-center gap-x-2 sm:gap-x-4 gap-y-1.5 my-2">
          {scenario.correctAnswer.split(" ").map((word, wordIdx, wordsArr) => {
            const startIndex = wordsArr.slice(0, wordIdx).join(" ").length + (wordIdx > 0 ? 1 : 0);
            return (
              <div key={wordIdx} className="flex gap-x-1 bg-black/40 p-1 rounded-xl border border-yellow-500/20">
                {word.split("").map((char, charIdx) => {
                  const absoluteIdx = startIndex + charIdx;
                  const isRevealed = revealedIndices.has(absoluteIdx);
                  return (
                    <div
                      key={charIdx}
                      className={`w-7 h-9 sm:w-9 sm:h-11 rounded-lg flex items-center justify-center font-bold text-sm sm:text-lg border-2 transition-all duration-300
                        ${isRevealed ? "bg-[#8b0000] text-yellow-300 border-yellow-400 scale-105" : "bg-black/60 border-white/20 text-transparent"}`}
                    >
                      {isRevealed ? char.toUpperCase() : ""}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Live Feed Bar */}
        <div className="bg-[#1c2419] rounded-2xl p-4 border border-white/10 shadow-md w-full overflow-hidden">
          <h3 className="font-bold flex items-center gap-1.5 mb-2.5 uppercase text-xs tracking-wider text-yellow-400">
            <Zap className="w-4 h-4" /> Bảng nộp bài trực tiếp
          </h3>
          <div className="flex gap-3 overflow-x-auto pb-1 custom-scrollbar">
            <AnimatePresence>
              {players
                .filter(p => !p.isHost && p.hasSubmitted)
                .sort((a, b) => (b.lastScoreIncrement ?? 0) - (a.lastScoreIncrement ?? 0))
                .map(p => (
                  <motion.div
                    key={p._id}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex shrink-0 flex-col items-center justify-center bg-emerald-950/60 border border-emerald-500/40 px-4 py-1.5 rounded-xl min-w-[100px]"
                  >
                    <span className="font-bold text-xs truncate max-w-[90px] text-white">{p.name}</span>
                    <span className="font-black text-xs text-emerald-400">
                      {(p.lastScoreIncrement ?? 0) > 0 ? `+${p.lastScoreIncrement}` : "+0"}
                    </span>
                  </motion.div>
                ))}
            </AnimatePresence>
            {players.filter(p => !p.isHost && !p.hasSubmitted).length > 0 && (
              <div className="flex shrink-0 items-center text-gray-400 text-xs italic px-2">
                Đang chờ người chơi khác...
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ============================================================
// ANIMATED NUMBER HELPER
// ============================================================
function AnimatedNumber({ value }: { value: number }) {
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    if (display === value) return;
    const duration = 400;
    const steps = 20;
    const stepValue = (value - display) / steps;
    let current = display;
    let count = 0;
    const timer = setInterval(() => {
      count++;
      if (count >= steps) {
        setDisplay(value);
        clearInterval(timer);
      } else {
        current += stepValue;
        setDisplay(Math.round(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [value, display]);

  return <>{display}</>;
}

// ============================================================
// ROUND RESULTS VIEW
// ============================================================
function RoundResultsView({
  room,
  players,
  isHost,
  onNextRound,
}: {
  room: Doc<"rooms">;
  players: Doc<"players">[];
  isHost: boolean;
  onNextRound: () => void;
}) {
  const [showNewScore, setShowNewScore] = useState(false);
  const scenario = SCENARIOS[room.currentRound - 1];

  useEffect(() => {
    const t = setTimeout(() => setShowNewScore(true), 800);
    return () => clearTimeout(t);
  }, []);

  const sortedPlayers = [...players].filter(p => !p.isHost).sort((a, b) => {
    const aScore = showNewScore ? (a.score ?? 0) : ((a.score ?? 0) - (a.lastScoreIncrement ?? 0));
    const bScore = showNewScore ? (b.score ?? 0) : ((b.score ?? 0) - (b.lastScoreIncrement ?? 0));
    return bScore - aScore;
  });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl w-full px-4 mx-auto space-y-5 text-center font-military">
      <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-emerald-950 border border-emerald-500 text-emerald-300 font-bold text-xs">
        <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Kết Quả Vòng {room.currentRound}/{SCENARIOS.length}
      </div>

      <div className="bg-[#1c2419] border-2 border-emerald-500/60 rounded-3xl p-5 sm:p-6 shadow-xl space-y-3">
        <span className="text-xs uppercase tracking-wider font-bold text-emerald-400 block">
          ĐÁP ÁN CHÍNH XÁC
        </span>
        <h3 className="text-2xl sm:text-3xl font-black text-yellow-300 leading-tight uppercase">
          {scenario?.correctAnswer}
        </h3>
        <p className="text-gray-200 text-xs sm:text-sm leading-relaxed bg-black/60 p-4 rounded-2xl border border-white/10 text-justify">
          {scenario?.description}
        </p>
      </div>

      <div className="mt-6 flex flex-col gap-2.5 w-full max-w-xl mx-auto">
        <h3 className="font-bold text-base uppercase tracking-wider text-yellow-400 mb-1 flex items-center justify-center gap-1.5">
          <Trophy className="w-4 h-4 text-yellow-400" /> Bảng Xếp Hạng Vòng Này
        </h3>
        {sortedPlayers.map((p, index) => {
          const prevScore = (p.score ?? 0) - (p.lastScoreIncrement ?? 0);
          const currentScore = p.score ?? 0;
          const diff = p.lastScoreIncrement ?? 0;

          return (
            <motion.div
              key={p._id}
              layout
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className={`flex items-center justify-between px-5 py-3 rounded-2xl border shadow-sm w-full
                ${index === 0 ? "border-yellow-400 bg-yellow-950/40" : "border-white/10 bg-black/50"}
              `}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm
                  ${index === 0 ? "bg-amber-500 text-black font-black" : index === 1 ? "bg-slate-300 text-black" : index === 2 ? "bg-amber-700 text-white" : "bg-black/60 text-white"}
                `}>
                  {index + 1}
                </div>
                <span className="font-bold text-sm text-white truncate max-w-[150px]">{p.name}</span>
              </div>
              <div className="flex items-center gap-3 font-mono font-bold text-base">
                {diff > 0 && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0 }}
                    animate={showNewScore ? { opacity: 0, y: -15, scale: 0.5 } : { opacity: 1, y: 0, scale: 1 }}
                    className="text-emerald-400 text-xs"
                  >
                    +{diff}
                  </motion.span>
                )}
                <motion.span
                  animate={showNewScore && diff > 0 ? { scale: [1, 1.2, 1], color: ["#10b981", "#ffd700", "#ffffff"] } : {}}
                  transition={{ duration: 0.5 }}
                  className={showNewScore && diff > 0 ? "text-emerald-400" : "text-yellow-300"}
                >
                  <AnimatedNumber value={showNewScore ? currentScore : prevScore} />
                </motion.span>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="text-center mt-6">
        {isHost ? (
          <button
            onClick={onNextRound}
            className="bg-gradient-to-r from-[#8b0000] to-[#b22222] text-white px-8 py-3 rounded-xl font-bold text-sm hover:scale-105 transition-all shadow-lg flex items-center gap-2 mx-auto cursor-pointer"
          >
            {room.currentRound >= SCENARIOS.length ? "Xem Tổng Kết Bảng Vàng 🏆" : "Bắt Đầu Vòng Tiếp Theo ➔"}
          </button>
        ) : (
          <p className="text-gray-300 text-xs">Đang chờ Quản trò chuyển sang vòng kế tiếp...</p>
        )}
      </div>
    </motion.div>
  );
}

// ============================================================
// FINAL RESULTS VIEW: BẢNG VÀNG 
// ============================================================
function FinalResultsView({ players, onPlayAgain }: { players: Doc<"players">[], onPlayAgain: () => void }) {
  const sorted = sortPlayersByScore(players.filter(p => !p.isHost));

  useEffect(() => {
    sound.playVictoryFanfare();
    confetti({
      particleCount: 150,
      spread: 90,
      origin: { y: 0.5 },
      colors: ['#ffd700', '#c8102e', '#ff4500', '#ffffff']
    });
  }, []);

  return (
    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-w-2xl w-full mx-auto text-center space-y-6 font-military">
      <div className="bg-[#1c2419] p-8 rounded-3xl border-2 border-[#ffd700] shadow-2xl">
        <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-3 animate-bounce" />
        <h1 className="text-3xl font-black text-white uppercase tracking-wide">BẢNG VÀNG VINH DANH</h1>
        <p className="text-xs text-gray-300 mt-1">Hoàn thành xuất sắc toàn bộ {SCENARIOS.length} vòng thi Lịch Sử Đảng CSVN (1945–1946)</p>
      </div>

      <div className="space-y-2.5">
        {sorted.map((p, i) => (
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: i * 0.08 }}
            key={p._id}
            className={`flex items-center gap-4 p-4 rounded-2xl border-2 ${
              i === 0
                ? "bg-yellow-950/60 border-yellow-400 shadow-lg"
                : i === 1
                ? "bg-slate-900/60 border-slate-400"
                : i === 2
                ? "bg-amber-950/60 border-amber-500"
                : "bg-black/50 border-white/10"
            }`}
          >
            <span className={`w-10 h-10 flex items-center justify-center rounded-full font-black text-base ${
              i === 0 ? "bg-amber-400 text-black" : i === 1 ? "bg-slate-300 text-black" : i === 2 ? "bg-amber-700 text-white" : "bg-black/60 text-white"
            }`}>
              {i + 1}
            </span>
            <span className="flex-1 text-left font-bold text-base truncate text-white">{p.name}</span>
            <div className="text-right">
              <div className="text-xl font-mono font-black text-yellow-300">{p.score ?? 0}</div>
              <div className="text-[10px] uppercase font-bold text-gray-400">Điểm tích lũy</div>
            </div>
          </motion.div>
        ))}
      </div>

      <button onClick={onPlayAgain} className="bg-gradient-to-r from-[#8b0000] to-[#b22222] text-white px-8 py-3 rounded-xl font-bold text-sm shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2 mx-auto cursor-pointer">
        <LogOut className="w-4 h-4" /> Quay lại sảnh chờ
      </button>
    </motion.div>
  );
}

// ============================================================
// MAIN WORD GUESS COMPONENT
// ============================================================
export const WordGuessGame: React.FC<{ onBackToHub: () => void }> = ({ onBackToHub }) => {
  const [showRules, setShowRules] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const lobbyAudioRef = useRef<HTMLAudioElement | null>(null);
  const gameAudioRef = useRef<HTMLAudioElement | null>(null);
  const winAudioRef = useRef<HTMLAudioElement | null>(null);
  const [lobbyMusicEnabled, setLobbyMusicEnabled] = useState(true);

  const [playerId, setPlayerId] = useState<string | null>(() => {
    try {
      const stored = localStorage.getItem("partyGameSession");
      return stored ? JSON.parse(stored).playerId : null;
    } catch { return null; }
  });
  const [roomId, setRoomId] = useState<string | null>(() => {
    try {
      const stored = localStorage.getItem("partyGameSession");
      return stored ? JSON.parse(stored).roomId : null;
    } catch { return null; }
  });

  useEffect(() => {
    if (playerId && roomId) {
      localStorage.setItem("partyGameSession", JSON.stringify({ playerId, roomId }));
    }
  }, [playerId, roomId]);

  const room = useQuery(api.rooms.get, roomId ? { roomId: roomId as Id<"rooms"> } : "skip");
  const players = useQuery(api.rooms.getPlayers, roomId ? { roomId: roomId as Id<"rooms"> } : "skip");
  const currentPlayer = useQuery(api.rooms.getPlayer, playerId ? { playerId: playerId as Id<"players"> } : "skip");

  const createRoomMutation = useMutation(api.rooms.create);
  const joinRoomMutation = useMutation(api.rooms.join);
  const leaveRoomMutation = useMutation(api.rooms.leave);
  const startGameMutation = useMutation(api.game.startGame);
  const submitAnswerMutation = useMutation(api.game.submitChoice);
  const nextRoundMutation = useMutation(api.game.nextRound);
  const forceProcessRoundMutation = useMutation(api.game.forceProcessRound);
  const endGameMutation = useMutation(api.game.endGame);

  useEffect(() => {
    if (roomId && room === null) clearSession();
    if (playerId && currentPlayer === null) clearSession();
  }, [room, currentPlayer, roomId, playerId]);

  function clearSession() {
    localStorage.removeItem("partyGameSession");
    setPlayerId(null);
    setRoomId(null);
    setError(null);
  }

  async function handleLeaveGame() {
    if (!playerId) {
      clearSession();
      return;
    }
    try {
      await leaveRoomMutation({ playerId: playerId as Id<"players"> });
    } catch { } finally { clearSession(); }
  }

  async function handleCreateRoom(hostName: string, password?: string) {
    if (password !== "Admin@123") {
      setError("Mật khẩu quản trò không chính xác!");
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const result = await createRoomMutation({ hostName, password });
      setPlayerId(result.playerId);
      setRoomId(result.roomId);
    } catch (e: any) { setError(e.message || "Lỗi tạo phòng"); } finally { setLoading(false); }
  }

  async function handleJoinRoom(code: string, name: string) {
    try {
      setLoading(true);
      setError(null);
      const result = await joinRoomMutation({ code, name });
      setPlayerId(result.playerId);
      setRoomId(result.roomId);
    } catch (e: any) { setError(e.message || "Lỗi tham gia"); } finally { setLoading(false); }
  }

  async function handleStartGame() {
    try {
      await startGameMutation({ roomId: roomId as Id<"rooms">, playerId: playerId as Id<"players"> });
    } catch (e: any) { setError(e.message || "Lỗi bắt đầu"); }
  }

  const handleAnswerSubmit = async (val: string, quickScore: number) => {
    try {
      await submitAnswerMutation({
        playerId: playerId as Id<"players">,
        answer: val,
        scoreIncrement: quickScore
      });
    } catch (e: any) {
      console.error("Lỗi gửi đáp án", e);
      setError(e.message || "Lỗi gửi đáp án. Vui lòng thử lại!");
    }
  };

  async function handleForceProcessRound() {
    try {
      await forceProcessRoundMutation({ roomId: roomId as Id<"rooms">, playerId: playerId as Id<"players"> });
    } catch (e: any) { setError(e.message || "Không thể kết thúc vòng"); }
  }

  async function handleEndGame() {
    try {
      await endGameMutation({ roomId: roomId as Id<"rooms">, playerId: playerId as Id<"players"> });
    } catch (e: any) { setError(e.message || "Lỗi kết thúc trò chơi"); }
  }

  async function handleNextRound() {
    try {
      await nextRoundMutation({ roomId: roomId as Id<"rooms">, playerId: playerId as Id<"players">, totalRounds: SCENARIOS.length });
    } catch (e: any) { setError(e.message || "Không thể chuyển vòng"); }
  }

  const isHost = currentPlayer?.isHost ?? false;
  const isInRoom = roomId && playerId && room && currentPlayer;

  // Audio Playback Logic
  useEffect(() => {
    const lobbyAudio = lobbyAudioRef.current;
    const gameAudio = gameAudioRef.current;
    const winAudio = winAudioRef.current;

    if (!lobbyAudio || !gameAudio || !winAudio) return;

    lobbyAudio.pause();
    gameAudio.pause();
    winAudio.pause();

    if (lobbyMusicEnabled) {
      if (!isInRoom || room?.status === "lobby") {
        lobbyAudio.play().catch(() => {});
      } else if (room?.status === "playing") {
        gameAudio.play().catch(() => {});
      } else if (room?.status === "finished") {
        winAudio.play().catch(() => {});
      }
    }
  }, [isInRoom, room?.status, lobbyMusicEnabled]);

  let content: React.ReactNode;

  if (!isInRoom) {
    content = <LobbyView onCreateRoom={handleCreateRoom} onJoinRoom={handleJoinRoom} error={error} loading={loading} />;
  } else if (room.status === "lobby") {
    content = <WaitingRoom room={room} players={players ?? []} isHost={isHost} onStart={handleStartGame} onLeave={handleLeaveGame} musicEnabled={lobbyMusicEnabled} onToggleMusic={() => setLobbyMusicEnabled(v => !v)} />;
  } else if (room.status === "playing" && room.phase === "choosing") {
    content = <GameplayView room={room} currentPlayer={currentPlayer} players={players ?? []} onChoice={handleAnswerSubmit} onForceRound={handleForceProcessRound} onEndGame={handleEndGame} />;
  } else if (room.status === "playing" && room.phase === "results") {
    content = <RoundResultsView room={room} players={players ?? []} isHost={isHost} onNextRound={handleNextRound} />;
  } else if (room.status === "finished") {
    content = <FinalResultsView players={players ?? []} onPlayAgain={handleLeaveGame} />;
  }

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-between p-4 sm:p-6 bg-[#0a0f08] text-[#f7f6f2] font-sans camo-gradient trench-texture overflow-x-hidden selection:bg-red-700 selection:text-white">
      <audio ref={lobbyAudioRef} src={ovtkMp3} loop muted={!lobbyMusicEnabled} />
      <audio ref={gameAudioRef} src={liberationMp3} loop muted={!lobbyMusicEnabled} />
      <audio ref={winAudioRef} src={winMp3} muted={!lobbyMusicEnabled} />

      {/* Top Header Bar */}
      <div className="w-full max-w-5xl flex justify-between items-center mb-6 relative z-20">
        <button
          onClick={() => {
            if (isInRoom) {
              if (window.confirm("Bạn có chắc muốn rời phòng và quay về Trung tâm chọn game?")) {
                handleLeaveGame();
                onBackToHub();
              }
            } else {
              onBackToHub();
            }
          }}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-black/60 hover:bg-black/80 border border-yellow-500/40 text-yellow-300 font-military font-bold text-xs sm:text-sm transition-all cursor-pointer hover:scale-105 shadow-md"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>CHỌN GAME KHÁC</span>
        </button>

        {isInRoom && room.status !== "lobby" && (
          <div className="bg-[#8b0000] border border-[#ffd700]/50 text-yellow-300 px-4 py-1.5 rounded-full font-military font-bold text-xs shadow-md">
            Mã PIN: {room.code}
          </div>
        )}

        <div className="flex gap-2">
          <button
            onClick={() => setLobbyMusicEnabled(!lobbyMusicEnabled)}
            className="p-2.5 bg-black/40 hover:bg-black/60 rounded-xl border border-white/20 text-yellow-300 cursor-pointer"
            title="Bật/Tắt Âm thanh"
          >
            {lobbyMusicEnabled ? <Volume2 className="w-5 h-5 text-emerald-400" /> : <VolumeX className="w-5 h-5 text-red-400" />}
          </button>
          <button
            onClick={() => setShowRules(true)}
            className="p-2.5 bg-black/40 hover:bg-black/60 rounded-xl border border-white/20 text-yellow-300 cursor-pointer"
            title="Xem Luật Chơi"
          >
            <BookOpen className="w-5 h-5" />
          </button>
        </div>
      </div>

      {error && isInRoom && (
        <div className="relative z-20 max-w-md mx-auto mb-4 bg-red-950/80 border border-red-500/50 text-red-200 px-5 py-2.5 rounded-xl text-center font-military text-xs">
          {error}
        </div>
      )}

      <div className="relative z-10 w-full flex-1 flex flex-col items-center justify-center">
        {content}
      </div>

      {/* Footer */}
      <footer className="w-full max-w-5xl text-center text-gray-400 font-military text-[11px] pt-4 border-t border-white/10">
        <span>Hệ Thống Trò Chơi Lịch Sử Đảng CSVN (1945–1946) · Đấu Trường Trực Tuyến Thời Gian Thực</span>
      </footer>

      <RulesModal show={showRules} onClose={() => setShowRules(false)} />
    </div>
  );
};
