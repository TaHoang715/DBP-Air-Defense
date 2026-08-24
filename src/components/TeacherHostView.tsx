import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import {
  Users,
  Trophy,
  Play,
  Copy,
  Check,
  Flame,
  Target,
  Award,
  Crown,
  Clock,
  Sparkles,
  Radio,
  RotateCcw,
  Zap,
  Star,
  X
} from 'lucide-react';

export interface RoomPlayer {
  _id: string;
  name: string;
  score: number;
  planesDowned: number;
  accuracy: number;
  shotsFired: number;
  questionsAnswered: number;
  isHost: boolean;
  isFinished: boolean;
  lastEvent?: string;
}

export interface BattleLog {
  _id: string;
  playerName: string;
  message: string;
  type: string;
  timestamp: number;
}

interface TeacherHostViewProps {
  roomCode: string;
  players: RoomPlayer[];
  logs: BattleLog[];
  status: 'waiting' | 'playing' | 'finished';
  durationSeconds: number;
  onStartGame: () => void;
  onFinishGame: () => void;
  onExit: () => void;
}

export const TeacherHostView: React.FC<TeacherHostViewProps> = ({
  roomCode,
  players,
  logs,
  status,
  durationSeconds,
  onStartGame,
  onFinishGame,
  onExit,
}) => {
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(durationSeconds);

  // Filter student players (exclude host from competition table)
  const studentPlayers = players.filter((p) => !p.isHost).sort((a, b) => b.score - a.score);

  // Timer in playing status
  useEffect(() => {
    if (status !== 'playing') return;
    setTimeLeft(durationSeconds);

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onFinishGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [status, durationSeconds, onFinishGame]);

  // Trigger Podium Confetti
  useEffect(() => {
    if (status === 'finished') {
      confetti({
        particleCount: 150,
        spread: 90,
        origin: { y: 0.5 },
        colors: ['#ffd700', '#8b0000', '#2d3b27', '#ffffff']
      });
    }
  }, [status]);

  const handleCopyPin = () => {
    navigator.clipboard.writeText(roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0d120c] text-[#f7f6f2] flex flex-col font-sans select-none overflow-hidden camo-gradient trench-texture">
      {/* ═══ TOP CONTROL BAR ═══ */}
      <header className="bg-[#121a10]/95 border-b border-[#44563a] px-6 py-3.5 flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#8b0000] border border-[#ffd700]/60 flex items-center justify-center font-black text-[#ffd700] shadow-md shadow-red-950/50">
            ★
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-military font-bold text-base text-white tracking-wider">
                MÀN HÌNH GIẢNG VIÊN · ĐẤU TRƯỜNG LỚP HỌC
              </h2>
              <span className="px-2.5 py-0.5 bg-red-500/20 border border-red-500/40 text-red-300 font-military text-xs font-bold rounded-lg flex items-center gap-1.5 animate-pulse">
                <Radio className="w-3.5 h-3.5" /> LIVE KAHOOT MODE
              </span>
            </div>
            <p className="text-xs text-gray-400">
              Chiến dịch Điện Biên Phủ 1954 · Khống chế Bầu trời Mường Thanh
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Room PIN Pill */}
          <div
            onClick={handleCopyPin}
            className="flex items-center gap-2 px-4 py-2 bg-black/60 border-2 border-[#ffd700] rounded-2xl cursor-pointer hover:bg-black/80 transition-all"
            title="Click để sao chép mã PIN"
          >
            <span className="text-xs font-military text-gray-400">MÃ PIN:</span>
            <strong className="text-xl md:text-2xl font-black font-mono tracking-widest text-[#ffd700]">
              {roomCode}
            </strong>
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-gray-400" />}
          </div>

          <button
            onClick={onExit}
            className="p-2.5 rounded-2xl bg-black/40 hover:bg-black/70 border border-white/10 text-gray-300 hover:text-white transition-colors"
            title="Thoát phòng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* ═══ 1. LOBBY WAITING SCREEN ═══ */}
      {status === 'waiting' && (
        <div className="flex-1 flex flex-col items-center justify-between p-8 max-w-6xl mx-auto w-full">
          {/* Giant PIN & Instructions */}
          <div className="text-center space-y-4 pt-4">
            <span className="px-4 py-1.5 rounded-full bg-[#8b0000]/80 border border-[#ffd700]/50 text-[#ffd700] font-military font-bold text-xs uppercase tracking-widest">
              HƯỚNG DẪN SINH VIÊN THAM GIA
            </span>
            <h1 className="text-3xl md:text-5xl font-black font-military text-white">
              Nhập Mã PIN Để Vào Trận Địa: <span className="text-[#ffd700] font-mono tracking-widest">{roomCode}</span>
            </h1>
            <p className="text-sm md:text-base text-gray-300">
              Sinh viên truy cập web trên điện thoại hoặc laptop, nhập tên chiến sĩ để sẵn sàng xuất kích!
            </p>
          </div>

          {/* Connected Students List */}
          <div className="w-full bg-[#1c2419]/90 border-2 border-[#44563a] rounded-3xl p-6 md:p-8 space-y-4 shadow-2xl backdrop-blur-md">
            <div className="flex items-center justify-between border-b border-white/10 pb-3 font-military">
              <span className="text-sm text-gray-300 flex items-center gap-2 font-bold">
                <Users className="w-4 h-4 text-[#ffd700]" />
                CHIẾN SĨ ĐÃ VÀO VỊ TRÍ ({studentPlayers.length})
              </span>
              <span className="text-xs text-amber-400 font-mono">
                Đang chờ lệnh xuất kích từ Giảng Viên
              </span>
            </div>

            {studentPlayers.length === 0 ? (
              <div className="text-center py-16 text-gray-400 font-military text-sm space-y-2">
                <Users className="w-10 h-10 mx-auto text-gray-600 animate-bounce" />
                <p>Chưa có chiến sĩ nào vào phòng. Hãy chia sẻ mã PIN cho lớp!</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 max-h-[35vh] overflow-y-auto pr-1">
                {studentPlayers.map((p, idx) => (
                  <motion.div
                    key={p._id || idx}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-3 bg-black/40 border border-[#d4af37]/40 rounded-2xl flex items-center gap-2 font-military text-xs text-white"
                  >
                    <div className="w-7 h-7 rounded-xl bg-[#2d3b27] text-[#ffd700] flex items-center justify-center font-bold shrink-0">
                      ★
                    </div>
                    <span className="truncate font-bold">{p.name}</span>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Start Battle Button */}
          <div className="w-full flex justify-center pb-4">
            <button
              onClick={onStartGame}
              disabled={studentPlayers.length === 0}
              className={`px-10 py-4 rounded-2xl font-military font-black text-lg flex items-center justify-center gap-3 shadow-2xl transition-all ${
                studentPlayers.length > 0
                  ? 'bg-gradient-to-r from-[#8b0000] to-[#b22222] hover:from-[#a00000] hover:to-[#c41e3a] text-white shadow-red-950/80 cursor-pointer hover:scale-105 animate-pulse'
                  : 'bg-gray-800 text-gray-500 border border-gray-700 cursor-not-allowed opacity-70'
              }`}
            >
              <Play className="w-6 h-6 fill-current text-[#ffd700]" />
              BẮT ĐẦU TRẬN ĐẤU CẢ LỚP ({studentPlayers.length} PHÁO THỦ)
            </button>
          </div>
        </div>
      )}

      {/* ═══ 2. LIVE BATTLE ARENA (PLAYING PHASE) ═══ */}
      {status === 'playing' && (
        <div className="flex-1 p-6 max-w-7xl mx-auto w-full flex flex-col gap-6 overflow-hidden">
          {/* Battle Progress Bar & Timer */}
          <div className="bg-[#1c2419] border-2 border-[#d4af37] rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="px-4 py-2 bg-[#8b0000] rounded-xl font-military font-black text-xl text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#ffd700] animate-pulse" />
                {formatTime(timeLeft)}
              </div>
              <div>
                <h3 className="font-military font-bold text-sm text-white">
                  TRẬN ĐẤU ĐANG DIỄN RA
                </h3>
                <p className="text-xs text-gray-300">
                  Tốc độ máy bay tăng dần theo thời gian · Lưới lửa phòng không khống chế Mường Thanh
                </p>
              </div>
            </div>

            <button
              onClick={onFinishGame}
              className="px-5 py-2.5 rounded-xl bg-red-950/80 hover:bg-red-900 border border-red-500/40 text-red-200 font-military text-xs font-bold transition-all cursor-pointer"
            >
              KẾT THÚC TRẬN ĐẤU SỚM
            </button>
          </div>

          {/* Main 2-Column Live Dashboard */}
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">
            {/* Left 8 Cols: Realtime Live Leaderboard */}
            <div className="lg:col-span-8 bg-[#1c2419]/95 border border-[#44563a] rounded-3xl p-6 flex flex-col shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4 font-military">
                <span className="text-base font-bold text-white flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-[#ffd700]" />
                  BẢNG ĐIỂM TRỰC TIẾP (LIVE LEADERBOARD)
                </span>
                <span className="text-xs text-gray-400 font-mono">
                  {studentPlayers.length} Pháo thủ tham chiến
                </span>
              </div>

              {/* Scrollable Player List */}
              <div className="flex-1 overflow-y-auto space-y-2.5 pr-2">
                {studentPlayers.map((p, idx) => {
                  const maxScore = studentPlayers[0]?.score || 1;
                  const scorePercent = Math.max(5, (p.score / Math.max(maxScore, 100)) * 100);

                  return (
                    <motion.div
                      layout
                      key={p._id || idx}
                      className="p-3.5 bg-black/40 border border-white/10 rounded-2xl flex items-center justify-between gap-4 font-military relative overflow-hidden"
                    >
                      {/* Live progress background bar */}
                      <div
                        className="absolute inset-y-0 left-0 bg-[#44563a]/30 transition-all duration-700 ease-out -z-0"
                        style={{ width: `${scorePercent}%` }}
                      />

                      <div className="flex items-center gap-3 relative z-10">
                        {/* Rank Badge */}
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-sm shrink-0 ${
                          idx === 0
                            ? 'bg-[#ffd700] text-black shadow-md shadow-yellow-500/40'
                            : idx === 1
                            ? 'bg-gray-300 text-black'
                            : idx === 2
                            ? 'bg-amber-700 text-white'
                            : 'bg-black/60 text-gray-300 border border-white/10'
                        }`}>
                          {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`}
                        </div>

                        <div>
                          <h4 className="font-bold text-sm text-white flex items-center gap-2">
                            {p.name}
                            {idx === 0 && <Crown className="w-3.5 h-3.5 text-[#ffd700]" />}
                          </h4>
                          <div className="flex items-center gap-3 text-xs text-gray-400 font-mono mt-0.5">
                            <span className="text-orange-400 flex items-center gap-1">
                              <Flame className="w-3 h-3" /> {p.planesDowned} máy bay
                            </span>
                            <span>Độ chính xác: {p.accuracy}%</span>
                            {p.lastEvent && (
                              <span className="text-emerald-400 italic hidden sm:inline">
                                ({p.lastEvent})
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="text-right relative z-10 shrink-0">
                        <span className="text-lg md:text-xl font-black text-[#ffd700] font-mono">
                          {p.score.toLocaleString()}
                        </span>
                        <span className="block text-[10px] text-gray-400">ĐIỂM</span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Right 4 Cols: Live Battle Event Stream (Nhật Ký Chiến Sự) */}
            <div className="lg:col-span-4 bg-[#1c2419]/95 border border-[#44563a] rounded-3xl p-6 flex flex-col shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4 font-military">
                <span className="text-sm font-bold text-white flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400" />
                  NHẬT KÝ CHIẾN SỰ (LIVE FEED)
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              </div>

              <div className="flex-1 overflow-y-auto space-y-2 pr-1 text-xs font-military">
                {logs.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    Đang theo dõi trận địa...
                  </div>
                ) : (
                  logs.map((log) => (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      key={log._id}
                      className="p-3 bg-black/40 border border-white/5 rounded-xl space-y-0.5"
                    >
                      <div className="flex items-center justify-between text-[11px] text-gray-400 font-mono">
                        <strong className="text-yellow-400">{log.playerName}</strong>
                        <span>{new Date(log.timestamp).toLocaleTimeString('vi-VN')}</span>
                      </div>
                      <p className="text-gray-200 text-xs leading-relaxed">
                        {log.message}
                      </p>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══ 3. KAHOOT-STYLE PODIUM (FINISHED PHASE) ═══ */}
      {status === 'finished' && (
        <div className="flex-1 flex flex-col items-center justify-between p-8 max-w-5xl mx-auto w-full overflow-y-auto">
          {/* Header */}
          <div className="text-center space-y-2 pt-2">
            <span className="text-xs font-military font-bold tracking-widest text-[#ffd700] uppercase">
              KẾT QUẢ ĐẤU TRƯỜNG LỚP HỌC
            </span>
            <h1 className="text-3xl md:text-5xl font-black font-military text-white">
              BỤC VINH DANH TOP 3 PHÁO THỦ
            </h1>
          </div>

          {/* 3D-Styled Podium */}
          <div className="w-full flex items-end justify-center gap-3 sm:gap-6 my-8 max-w-2xl px-4">
            {/* Rank 2 (Silver) */}
            {studentPlayers[1] && (
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex-1 flex flex-col items-center"
              >
                <div className="w-12 h-12 rounded-2xl bg-gray-300 text-black flex items-center justify-center font-black text-xl mb-2 shadow-lg">
                  🥈
                </div>
                <h4 className="font-bold font-military text-xs sm:text-sm text-white text-center truncate max-w-[120px]">
                  {studentPlayers[1].name}
                </h4>
                <span className="text-xs font-mono font-bold text-[#ffd700]">
                  {studentPlayers[1].score} Đ
                </span>
                {/* Podium Column */}
                <div className="w-full h-36 sm:h-44 bg-gradient-to-t from-gray-700 to-gray-500 rounded-t-3xl border-t-4 border-gray-300 mt-3 flex items-center justify-center font-black text-2xl text-white font-military shadow-2xl">
                  #2
                </div>
              </motion.div>
            )}

            {/* Rank 1 (Gold / Champion) */}
            {studentPlayers[0] && (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex-1 flex flex-col items-center"
              >
                <Crown className="w-8 h-8 text-[#ffd700] mb-1 animate-bounce" />
                <div className="w-16 h-16 rounded-3xl bg-[#ffd700] text-black flex items-center justify-center font-black text-3xl mb-2 shadow-2xl shadow-yellow-500/50">
                  🥇
                </div>
                <h4 className="font-black font-military text-sm sm:text-base text-yellow-300 text-center truncate max-w-[150px]">
                  {studentPlayers[0].name}
                </h4>
                <span className="text-sm font-mono font-black text-[#ffd700]">
                  {studentPlayers[0].score} Đ
                </span>
                {/* Podium Column */}
                <div className="w-full h-48 sm:h-60 bg-gradient-to-t from-[#8b0000] to-[#b22222] rounded-t-3xl border-t-4 border-[#ffd700] mt-3 flex items-center justify-center font-black text-3xl text-[#ffd700] font-military shadow-2xl shadow-red-950/80">
                  #1
                </div>
              </motion.div>
            )}

            {/* Rank 3 (Bronze) */}
            {studentPlayers[2] && (
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex-1 flex flex-col items-center"
              >
                <div className="w-12 h-12 rounded-2xl bg-amber-700 text-white flex items-center justify-center font-black text-xl mb-2 shadow-lg">
                  🥉
                </div>
                <h4 className="font-bold font-military text-xs sm:text-sm text-white text-center truncate max-w-[120px]">
                  {studentPlayers[2].name}
                </h4>
                <span className="text-xs font-mono font-bold text-[#ffd700]">
                  {studentPlayers[2].score} Đ
                </span>
                {/* Podium Column */}
                <div className="w-full h-28 sm:h-32 bg-gradient-to-t from-amber-900 to-amber-700 rounded-t-3xl border-t-4 border-amber-500 mt-3 flex items-center justify-center font-black text-xl text-white font-military shadow-2xl">
                  #3
                </div>
              </motion.div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pb-4">
            <button
              onClick={onExit}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#8b0000] to-[#b22222] hover:from-[#a00000] hover:to-[#c41e3a] text-white font-military font-bold text-sm flex items-center gap-2 shadow-xl shadow-red-950/60 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              TẠO TRẬN ĐẤU MỚI
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
