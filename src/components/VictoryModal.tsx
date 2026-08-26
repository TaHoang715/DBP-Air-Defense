import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { sound } from '../audio/SoundEngine';
import {
  Trophy,
  Award,
  Flame,
  Star,
  CheckCircle2,
  Target,
  Crown,
  LogOut,
  Medal
} from 'lucide-react';

export interface RoomPlayerStat {
  _id?: string;
  name: string;
  score: number;
  planesDowned: number;
  accuracy: number;
  isHost?: boolean;
}

interface VictoryModalProps {
  isOpen?: boolean;
  score: number;
  planesDownedCount: number;
  shotsFired: number;
  questionsAnswered: number;
  roomPlayers?: RoomPlayerStat[];
  currentPlayerName?: string;
  onRestart?: () => void;
  onExit?: () => void;
  onLeaveRoom?: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  isOpen = true,
  score,
  planesDownedCount,
  shotsFired,
  questionsAnswered,
  roomPlayers = [],
  currentPlayerName = '',
  onRestart,
  onExit,
  onLeaveRoom,
}) => {
  const handleExit = onLeaveRoom || onExit || onRestart || (() => {});

  useEffect(() => {
    if (isOpen) {
      sound.playVictoryFanfare();
      confetti({
        particleCount: 140,
        spread: 90,
        origin: { y: 0.55 },
        colors: ['#ffd700', '#8b0000', '#ff4500', '#2d3b27', '#ffffff']
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const accuracy = shotsFired > 0 ? Math.min(100, Math.round((planesDownedCount / shotsFired) * 100)) : 0;

  // Filter students and sort by score descending
  const sortedStudents = [...roomPlayers]
    .filter((p) => !p.isHost)
    .sort((a, b) => b.score - a.score);

  // Find my current rank in the classroom
  const myRankIndex = sortedStudents.findIndex(
    (p) => currentPlayerName && p.name.toLowerCase() === currentPlayerName.toLowerCase()
  );
  const myRank = myRankIndex !== -1 ? myRankIndex + 1 : 1;

  // Compute Military Honor Title
  let militaryRank = 'Chiến sĩ Trận địa Phòng không';
  let badgeColor = 'text-gray-300';
  if (myRank === 1) {
    militaryRank = '🏆 Quán Quân Phòng Không Điện Biên Phủ';
    badgeColor = 'text-yellow-400';
  } else if (planesDownedCount >= 8) {
    militaryRank = 'Anh hùng Pháo cao xạ Tô Vĩnh Diện';
    badgeColor = 'text-amber-400';
  } else if (planesDownedCount >= 4) {
    militaryRank = 'Dũng sĩ Diệt Máy bay Giặc Pháp';
    badgeColor = 'text-emerald-400';
  } else {
    militaryRank = 'Chiến sĩ Thi đua Điện Biên Phủ';
    badgeColor = 'text-blue-400';
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 25 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 25 }}
          className="w-full max-w-2xl bg-[#1c2419] border-2 border-[#d4af37] rounded-3xl shadow-2xl overflow-hidden text-[#f7f6f2] flex flex-col max-h-[92vh]"
        >
          {/* Victory Banner */}
          <div className="bg-gradient-to-r from-[#8b0000] to-[#b22222] px-6 py-4 text-center border-b border-[#d4af37]/50 relative overflow-hidden shrink-0 shadow-lg">
            <div className="space-y-1">
              <span className="text-xs font-military font-bold tracking-widest text-[#ffd700] uppercase">
                ★ TỔNG KẾT CHIẾN DỊCH PHÒNG KHÔNG 1954 ★
              </span>
              <h2 className="text-xl sm:text-2xl font-black font-military text-white tracking-wide">
                BẢNG VINH DANH THÀNH TÍCH CẢ LỚP
              </h2>
            </div>
          </div>

          {/* Body Content */}
          <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1 custom-scrollbar">
            {/* My Result & Rank Card */}
            <div className="bg-black/50 p-4 sm:p-5 rounded-2xl border border-[#d4af37]/60 text-center space-y-2 shadow-inner">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#8b0000] rounded-full border border-[#ffd700]/50 text-[#ffd700] text-xs font-military font-bold uppercase shadow-sm">
                <Crown className="w-3.5 h-3.5" /> Thứ Hạng Của Bạn: #{myRank} / {sortedStudents.length || 1}
              </div>

              <h3 className={`text-xl sm:text-2xl font-black font-military ${badgeColor}`}>
                {militaryRank}
              </h3>
              {currentPlayerName && (
                <p className="text-xs text-gray-300">
                  Chiến sĩ: <strong className="text-white">{currentPlayerName}</strong>
                </p>
              )}
            </div>

            {/* 4 Score Badges Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center font-military">
              <div className="p-3 bg-black/40 rounded-2xl border border-white/10 shadow-sm">
                <Award className="w-5 h-5 text-[#ffd700] mx-auto mb-1" />
                <span className="text-[10px] text-gray-400 block">TỔNG ĐIỂM</span>
                <strong className="text-base sm:text-lg text-[#ffd700] font-mono">{score}</strong>
              </div>

              <div className="p-3 bg-black/40 rounded-2xl border border-white/10 shadow-sm">
                <Flame className="w-5 h-5 text-orange-400 mx-auto mb-1" />
                <span className="text-[10px] text-gray-400 block">MÁY BAY HẠ</span>
                <strong className="text-base sm:text-lg text-white font-mono">{planesDownedCount}</strong>
              </div>

              <div className="p-3 bg-black/40 rounded-2xl border border-white/10 shadow-sm">
                <Target className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
                <span className="text-[10px] text-gray-400 block">CHÍNH XÁC</span>
                <strong className="text-base sm:text-lg text-emerald-300 font-mono">{accuracy}%</strong>
              </div>

              <div className="p-3 bg-black/40 rounded-2xl border border-white/10 shadow-sm">
                <CheckCircle2 className="w-5 h-5 text-blue-400 mx-auto mb-1" />
                <span className="text-[10px] text-gray-400 block">CÂU ĐÚNG</span>
                <strong className="text-base sm:text-lg text-blue-300 font-mono">{questionsAnswered}</strong>
              </div>
            </div>

            {/* 📋 BẢNG XẾP HẠNG CẢ LỚP (FULL LEADERBOARD & TOP 5 HIGHLIGHT) */}
            <div className="space-y-3 pt-1">
              <div className="flex items-center justify-between font-military text-xs border-b border-white/15 pb-2">
                <span className="text-[#ffd700] font-bold flex items-center gap-1.5 uppercase">
                  <Trophy className="w-4 h-4 text-[#ffd700]" />
                  Bảng Xếp Hạng Toàn Bộ Lớp ({sortedStudents.length} Học Sinh)
                </span>
                <span className="text-emerald-400 text-[11px] font-bold">Top 5 Vinh Danh</span>
              </div>

              <div className="space-y-2 max-h-56 overflow-y-auto pr-1 custom-scrollbar">
                {sortedStudents.map((p, idx) => {
                  const rank = idx + 1;
                  const isMe = currentPlayerName && p.name.toLowerCase() === currentPlayerName.toLowerCase();
                  const isTop1 = rank === 1;
                  const isTop2 = rank === 2;
                  const isTop3 = rank === 3;
                  const isTop5 = rank <= 5;

                  return (
                    <div
                      key={p._id || idx}
                      className={`p-3 rounded-2xl border flex items-center justify-between gap-3 font-military text-xs transition-all ${
                        isMe
                          ? 'bg-[#44563a]/80 border-emerald-400 ring-2 ring-emerald-500/40 shadow-lg'
                          : isTop1
                          ? 'bg-gradient-to-r from-[#8b0000]/70 to-[#b22222]/50 border-[#ffd700]'
                          : isTop2
                          ? 'bg-black/50 border-gray-300/60'
                          : isTop3
                          ? 'bg-black/50 border-amber-700/60'
                          : isTop5
                          ? 'bg-emerald-950/30 border-emerald-500/40'
                          : 'bg-black/35 border-white/10'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${
                            isTop1
                              ? 'bg-[#ffd700] text-black font-black'
                              : isTop2
                              ? 'bg-gray-300 text-black'
                              : isTop3
                              ? 'bg-amber-700 text-white'
                              : isTop5
                              ? 'bg-emerald-700 text-emerald-100'
                              : 'bg-black/60 text-gray-400 border border-white/10'
                          }`}
                        >
                          {rank}
                        </div>

                        <div className="truncate">
                          <div className="flex items-center gap-1.5">
                            <span className={`font-bold text-sm truncate ${isMe ? 'text-yellow-300' : 'text-white'}`}>
                              {p.name} {isMe && '(Bạn)'}
                            </span>
                            {isTop1 && <Crown className="w-3.5 h-3.5 text-[#ffd700] shrink-0" />}
                            {isTop5 && !isTop1 && <Medal className="w-3 h-3 text-emerald-400 shrink-0" />}
                          </div>
                          <span className="text-[10px] text-gray-400 font-mono block">
                            Hạ {p.planesDowned} máy bay · Chính xác {p.accuracy}%
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 font-mono shrink-0">
                        <strong className="text-[#ffd700] text-base font-black">{p.score} Đ</strong>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Footer Action */}
          <div className="p-4 bg-black/40 border-t border-[#44563a] flex justify-end shrink-0">
            <button
              onClick={handleExit}
              className="w-full sm:w-auto px-8 py-3 rounded-2xl bg-gradient-to-r from-[#8b0000] to-[#b22222] hover:from-[#a00000] hover:to-[#c41e3a] text-white font-military font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-red-950/60 transition-transform hover:scale-105 cursor-pointer"
            >
              <LogOut className="w-4 h-4" /> RỜI PHÒNG VỀ TRANG CHỦ
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
