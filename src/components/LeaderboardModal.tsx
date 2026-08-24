import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Award, Medal, X, Star, Flame, Shield } from 'lucide-react';

export interface LeaderboardEntry {
  id: string;
  name: string;
  score: number;
  planesDowned: number;
  accuracy: number;
  date: string;
  badge: string;
}

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  entries: LeaderboardEntry[];
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  isOpen,
  onClose,
  entries
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          className="w-full max-w-2xl bg-[#1c2419] border-2 border-[#d4af37] rounded-3xl shadow-2xl overflow-hidden text-[#f7f6f2]"
        >
          {/* Header */}
          <div className="bg-[#2d3b27] px-6 py-4 flex items-center justify-between border-b border-[#44563a]">
            <div className="flex items-center gap-2.5">
              <Trophy className="w-6 h-6 text-[#ffd700]" />
              <div>
                <h3 className="font-military font-bold text-base md:text-lg text-white">
                  BẢNG VÀNG CHIẾN CÔNG PHÒNG KHÔNG
                </h3>
                <p className="text-xs text-gray-300">
                  Vinh danh các pháo thủ xuất sắc nhất trong chiến dịch Điện Biên Phủ
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-black/30 hover:bg-black/50 text-gray-300 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* List Content */}
          <div className="p-6 space-y-3 max-h-[60vh] overflow-y-auto">
            {entries.length === 0 ? (
              <div className="text-center py-12 text-gray-400 font-military text-sm">
                Chưa có chiến sĩ nào ghi danh. Hãy tham chiến ngay!
              </div>
            ) : (
              entries.map((entry, idx) => {
                let rankBadge = (
                  <span className="w-8 h-8 rounded-xl bg-black/40 flex items-center justify-center font-bold font-mono text-gray-400 text-sm">
                    #{idx + 1}
                  </span>
                );

                if (idx === 0) {
                  rankBadge = (
                    <div className="w-8 h-8 rounded-xl bg-[#ffd700] text-black flex items-center justify-center font-black text-sm shadow-md shadow-yellow-500/30">
                      🥇
                    </div>
                  );
                } else if (idx === 1) {
                  rankBadge = (
                    <div className="w-8 h-8 rounded-xl bg-gray-300 text-black flex items-center justify-center font-black text-sm">
                      🥈
                    </div>
                  );
                } else if (idx === 2) {
                  rankBadge = (
                    <div className="w-8 h-8 rounded-xl bg-amber-700 text-white flex items-center justify-center font-black text-sm">
                      🥉
                    </div>
                  );
                }

                return (
                  <div
                    key={entry.id}
                    className="p-4 bg-black/30 hover:bg-black/45 border border-white/10 rounded-2xl flex items-center justify-between gap-4 font-military transition-all"
                  >
                    <div className="flex items-center gap-3">
                      {rankBadge}
                      <div>
                        <h4 className="font-bold text-sm md:text-base text-white flex items-center gap-2">
                          {entry.name}
                          {idx === 0 && <Star className="w-3.5 h-3.5 text-[#ffd700] fill-current" />}
                        </h4>
                        <div className="flex items-center gap-3 text-xs text-gray-400 font-mono mt-0.5">
                          <span className="text-orange-400 flex items-center gap-1">
                            <Flame className="w-3 h-3" /> {entry.planesDowned} máy bay
                          </span>
                          <span>Độ chính xác: {entry.accuracy}%</span>
                          <span className="hidden sm:inline text-gray-500">{entry.date}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-sm md:text-base font-black text-[#ffd700] font-mono">
                        {entry.score.toLocaleString()} Đ
                      </span>
                      <span className="block text-[10px] text-gray-400 uppercase">
                        {entry.badge}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="p-4 bg-black/40 border-t border-[#44563a] text-center">
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-[#44563a] hover:bg-[#556b2f] text-white font-military text-xs font-bold transition-all cursor-pointer"
            >
              ĐÓNG BẢNG VÀNG
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
