import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import {
  Trophy,
  Award,
  Flame,
  RotateCcw,
  Star,
  CheckCircle2,
  Users,
  Target,
  Crown,
  LogOut
} from 'lucide-react';

export interface RoomPlayerStat {
  _id: string;
  name: string;
  score: number;
  planesDowned: number;
  accuracy: number;
  isHost: boolean;
}

interface VictoryModalProps {
  isOpen: boolean;
  score: number;
  planesDownedCount: number;
  shotsFired: number;
  questionsAnswered: number;
  roomPlayers: RoomPlayerStat[];
  currentPlayerName: string;
  onLeaveRoom: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  isOpen,
  score,
  planesDownedCount,
  shotsFired,
  questionsAnswered,
  roomPlayers,
  currentPlayerName,
  onLeaveRoom,
}) => {
  useEffect(() => {
    if (isOpen) {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#ffd700', '#8b0000', '#ff4500', '#2d3b27']
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
  const myRankIndex = sortedStudents.findIndex((p) => p.name.toLowerCase() === currentPlayerName.toLowerCase());
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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.88, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.88, y: 30 }}
          className="w-full max-w-2xl bg-[#1c2419] border-2 border-[#d4af37] rounded-3xl shadow-2xl overflow-hidden text-[#f7f6f2] flex flex-col max-h-[90vh]"
        >
          {/* Victory Banner */}
          <div className="bg-[#8b0000] px-6 py-4 text-center border-b border-[#d4af37]/50 relative overflow-hidden shrink-0">
            <div className="space-y-1">
              <span className="text-xs font-military font-bold tracking-widest text-[#ffd700] uppercase">
                KẾT QUẢ ĐẤU TRƯỜNG PHÒNG THI ĐẤU
              </span>
              <h2 className="text-2xl md:text-3xl font-black font-military text-white tracking-wide">
                TỔNG KẾT TRẬN ĐÁNH CẢ LỚP
              </h2>
            </div>
          </div>

          {/* Body Content */}
          <div className="p-6 overflow-y-auto space-y-6 flex-1">
            {/* My Result & Rank Card */}
            <div className="bg-black/40 p-5 rounded-2xl border border-[#d4af37]/50 text-center space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#8b0000]/60 rounded-full border border-[#ffd700]/40 text-[#ffd700] text-xs font-military font-bold uppercase">
                <Crown className="w-3.5 h-3.5" /> Hạng Của Bạn Trong Lớp: #{myRank} / {sortedStudents.length || 1}
              </div>

              <h3 className={`text-xl md:text-2xl font-black font-military ${badgeColor}`}>
                {militaryRank}
              </h3>
              <p className="text-xs text-gray-300">
                Chiến sĩ: <strong className="text-white">{currentPlayerName}</strong>
              </p>
            </div>

            {/* Score Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center font-military">
              <div className="p-3 bg-black/30 rounded-2xl border border-white/10">
                <Award className="w-5 h-5 text-[#ffd700] mx-auto mb-1" />
                <span className="text-[11px] text-gray-400 block">ĐIỂM SỐ</span>
                <strong className="text-lg text-[#ffd700] font-mono">{score}</strong>
              </div>

              <div className="p-3 bg-black/30 rounded-2xl border border-white/10">
                <Flame className="w-5 h-5 text-orange-400 mx-auto mb-1" />
                <span className="text-[11px] text-gray-400 block">MÁY BAY HẠ</span>
                <strong className="text-lg text-white font-mono">{planesDownedCount}</strong>
              </div>

              <div className="p-3 bg-black/30 rounded-2xl border border-white/10">
                <Target className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
                <span className="text-[11px] text-gray-400 block">CHÍNH XÁC</span>
                <strong className="text-lg text-emerald-300 font-mono">{accuracy}%</strong>
              </div>

              <div className="p-3 bg-black/30 rounded-2xl border border-white/10">
                <CheckCircle2 className="w-5 h-5 text-blue-400 mx-auto mb-1" />
                <span className="text-[11px] text-gray-400 block">CÂU ĐÚNG</span>
                <strong className="text-lg text-blue-300 font-mono">{questionsAnswered}</strong>
              </div>
            </div>

            {/* Room Leaderboard Table */}
            <div className="space-y-3">
              <div className="flex items-center justify-between font-military text-xs border-b border-white/10 pb-2">
                <span className="text-[#ffd700] font-bold flex items-center gap-1.5 uppercase">
                  <Trophy className="w-4 h-4" /> Bảng Xếp Hạng Phòng Hiện Tại ({sortedStudents.length} Học Sinh)
                </span>
                <span className="text-gray-400">Đồng bộ Realtime</span>
              </div>

              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {sortedStudents.map((p, idx) => {
                  const isMe = p.name.toLowerCase() === currentPlayerName.toLowerCase();
                  return (
                    <div
                      key={p._id || idx}
                      className={`p-3 rounded-xl border flex items-center justify-between gap-3 font-military text-xs transition-all ${
                        isMe
                          ? 'bg-[#44563a]/60 border-emerald-400 shadow-md'
                          : 'bg-black/30 border-white/10'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs ${
                          idx === 0
                            ? 'bg-[#ffd700] text-black font-black'
                            : idx === 1
                            ? 'bg-gray-300 text-black'
                            : idx === 2
                            ? 'bg-amber-700 text-white'
                            : 'bg-black/50 text-gray-400'
                        }`}>
                          {idx + 1}
                        </div>
                        <span className={`font-bold ${isMe ? 'text-yellow-300' : 'text-white'}`}>
                          {p.name} {isMe && '(Bạn)'}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 font-mono">
                        <span className="text-orange-400">{p.planesDowned} máy bay</span>
                        <strong className="text-[#ffd700] text-sm">{p.score} Đ</strong>
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
              onClick={onLeaveRoom}
              className="w-full sm:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-[#8b0000] to-[#b22222] hover:from-[#a00000] hover:to-[#c41e3a] text-white font-military font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-red-950/60 cursor-pointer"
            >
              <LogOut className="w-4 h-4" /> RỜI PHÒNG VỀ TRANG CHỦ
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
