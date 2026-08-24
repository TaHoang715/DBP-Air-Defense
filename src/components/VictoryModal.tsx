import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import {
  Trophy,
  Award,
  Flame,
  RotateCcw,
  Star,
  CheckCircle2,
  Share2,
  Users,
  Target
} from 'lucide-react';

interface VictoryModalProps {
  isOpen: boolean;
  score: number;
  planesDownedCount: number;
  shotsFired: number;
  questionsAnswered: number;
  onPlayAgain: () => void;
  onOpenLeaderboard: () => void;
  onSaveScore: (playerName: string) => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  isOpen,
  score,
  planesDownedCount,
  shotsFired,
  questionsAnswered,
  onPlayAgain,
  onOpenLeaderboard,
  onSaveScore
}) => {
  const [playerName, setPlayerName] = useState<string>('');
  const [isSaved, setIsSaved] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      // Fire victory confetti in gold and red
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

  // Compute Military Honor Title
  let militaryRank = 'Chiến sĩ Trận địa Phòng không';
  let badgeColor = 'text-gray-300';
  if (planesDownedCount >= 10) {
    militaryRank = 'Anh hùng Pháo cao xạ Tô Vĩnh Diện';
    badgeColor = 'text-yellow-400';
  } else if (planesDownedCount >= 6) {
    militaryRank = 'Dũng sĩ Diệt Máy bay Giặc Pháp';
    badgeColor = 'text-amber-400';
  } else if (planesDownedCount >= 3) {
    militaryRank = 'Chiến sĩ Thi đua Điện Biên Phủ';
    badgeColor = 'text-emerald-400';
  }

  const handleSubmitScore = (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerName.trim() || isSaved) return;
    onSaveScore(playerName.trim());
    setIsSaved(true);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.88, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.88, y: 30 }}
          className="w-full max-w-xl bg-[#1c2419] border-2 border-[#d4af37] rounded-3xl shadow-2xl overflow-hidden text-[#f7f6f2]"
        >
          {/* Victory Banner */}
          <div className="bg-[#8b0000] px-6 py-5 text-center border-b border-[#d4af37]/50 relative overflow-hidden">
            <div className="absolute inset-0 bg-radial from-transparent via-black/20 to-black/50" />
            <div className="relative z-10 space-y-1">
              <span className="text-xs font-military font-bold tracking-widest text-[#ffd700] uppercase">
                BÁO CÁO TỔNG KẾT CHIẾN DỊCH 1954
              </span>
              <h2 className="text-2xl md:text-3xl font-black font-military text-white tracking-wide">
                TOÀN THẮNG ĐIỆN BIÊN PHỦ
              </h2>
            </div>
          </div>

          {/* Stats & Rank Card */}
          <div className="p-6 md:p-8 space-y-6">
            {/* Rank Card */}
            <div className="bg-black/35 p-5 rounded-2xl border border-[#d4af37]/40 text-center space-y-2">
              <div className="inline-flex items-center gap-1 text-[#ffd700] text-xs font-military font-bold uppercase tracking-wider">
                <Star className="w-4 h-4 fill-current" /> Danh Hiệu Chiến Sĩ Được Vinh Danh <Star className="w-4 h-4 fill-current" />
              </div>
              <h3 className={`text-xl md:text-2xl font-black font-military ${badgeColor}`}>
                {militaryRank}
              </h3>
              <p className="text-xs text-gray-300 italic">
                Đã hoàn thành xuất sắc nhiệm vụ khống chế bầu trời Mường Thanh
              </p>
            </div>

            {/* Score Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center font-military">
              <div className="p-3.5 bg-black/25 rounded-2xl border border-white/10">
                <Award className="w-5 h-5 text-[#ffd700] mx-auto mb-1" />
                <span className="text-[11px] text-gray-400 block">TỔNG ĐIỂM</span>
                <strong className="text-lg md:text-xl text-[#ffd700] font-mono">{score}</strong>
              </div>

              <div className="p-3.5 bg-black/25 rounded-2xl border border-white/10">
                <Flame className="w-5 h-5 text-orange-400 mx-auto mb-1" />
                <span className="text-[11px] text-gray-400 block">MÁY BAY HẠ</span>
                <strong className="text-lg md:text-xl text-white font-mono">{planesDownedCount}</strong>
              </div>

              <div className="p-3.5 bg-black/25 rounded-2xl border border-white/10">
                <Target className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
                <span className="text-[11px] text-gray-400 block">CHÍNH XÁC</span>
                <strong className="text-lg md:text-xl text-emerald-300 font-mono">{accuracy}%</strong>
              </div>

              <div className="p-3.5 bg-black/25 rounded-2xl border border-white/10">
                <CheckCircle2 className="w-5 h-5 text-blue-400 mx-auto mb-1" />
                <span className="text-[11px] text-gray-400 block">CÂU ĐÚNG</span>
                <strong className="text-lg md:text-xl text-blue-300 font-mono">{questionsAnswered}</strong>
              </div>
            </div>

            {/* Name Input to save score */}
            {!isSaved ? (
              <form onSubmit={handleSubmitScore} className="space-y-2">
                <label className="block text-xs font-military text-gray-300">
                  Nhập tên chiến sĩ để ghi danh vào Bảng Vàng:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    placeholder="Ví dụ: Pháo thủ Nguyễn Văn A"
                    maxLength={30}
                    className="flex-1 bg-black/50 border border-white/20 rounded-xl px-4 py-2.5 text-xs md:text-sm font-military text-white placeholder:text-gray-500 focus:outline-none focus:border-[#d4af37]"
                  />
                  <button
                    type="submit"
                    disabled={!playerName.trim()}
                    className="px-5 py-2.5 bg-[#44563a] hover:bg-[#556b2f] text-white rounded-xl font-military font-bold text-xs md:text-sm disabled:opacity-50 cursor-pointer"
                  >
                    LƯU ĐIỂM
                  </button>
                </div>
              </form>
            ) : (
              <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 rounded-xl text-center text-xs font-military text-emerald-300 flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> Đã lưu thành tích chiến đấu vào Bảng Vàng!
              </div>
            )}
          </div>

          {/* Footer Navigation */}
          <div className="p-6 bg-black/40 border-t border-[#44563a] flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              onClick={onOpenLeaderboard}
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-black/50 hover:bg-black/70 border border-white/20 text-gray-200 font-military text-xs md:text-sm font-bold flex items-center justify-center gap-2 cursor-pointer"
            >
              <Trophy className="w-4 h-4 text-[#ffd700]" />
              BẢNG VÀNG DANH DỰ
            </button>

            <button
              onClick={onPlayAgain}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-[#8b0000] to-[#b22222] hover:from-[#a00000] hover:to-[#c41e3a] text-white font-military font-bold text-xs md:text-sm flex items-center justify-center gap-2 shadow-lg shadow-red-950/50 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              CHIẾN ĐẤU LẠI
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
