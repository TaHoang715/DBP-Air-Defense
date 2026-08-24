import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Users, Trophy, Play, Plus, LogIn, X, Crown, Sparkles, BookOpen } from 'lucide-react';

interface MultiplayerRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateHostRoom: (hostName: string) => void;
  onJoinStudentRoom: (roomPin: string, studentName: string) => void;
}

export const MultiplayerRoomModal: React.FC<MultiplayerRoomModalProps> = ({
  isOpen,
  onClose,
  onCreateHostRoom,
  onJoinStudentRoom,
}) => {
  const [tab, setTab] = useState<'HOST' | 'JOIN'>('HOST');
  const [hostName, setHostName] = useState('');
  const [studentName, setStudentName] = useState('');
  const [roomPinInput, setRoomPinInput] = useState('');

  if (!isOpen) return null;

  const handleCreateHost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hostName.trim()) return;
    onCreateHostRoom(hostName.trim());
    onClose();
  };

  const handleJoinStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim() || !roomPinInput.trim()) return;
    onJoinStudentRoom(roomPinInput.trim(), studentName.trim());
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          className="w-full max-w-xl bg-[#1c2419] border-2 border-[#d4af37] rounded-3xl shadow-2xl overflow-hidden text-[#f7f6f2]"
        >
          {/* Header */}
          <div className="bg-[#2d3b27] px-6 py-4 flex items-center justify-between border-b border-[#44563a]">
            <div className="flex items-center gap-2.5">
              <Users className="w-6 h-6 text-[#ffd700]" />
              <div>
                <h3 className="font-military font-bold text-base text-white">
                  ĐẤU TRƯỜNG PHÒNG HỌC · KAHOOT STYLE
                </h3>
                <p className="text-xs text-gray-300">
                  Tổ chức thi đấu pháo thủ trực tiếp trong giờ học
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

          {/* Lobby Content */}
          <div className="p-6 md:p-8 space-y-6">
            {/* Tab selector */}
            <div className="flex rounded-2xl bg-black/40 p-1 border border-white/10 font-military text-xs font-bold">
              <button
                onClick={() => setTab('HOST')}
                className={`flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 ${
                  tab === 'HOST'
                    ? 'bg-[#8b0000] text-white shadow-md'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Crown className="w-4 h-4 text-[#ffd700]" /> DÀNH CHO GIẢNG VIÊN (TẠO PHÒNG)
              </button>
              <button
                onClick={() => setTab('JOIN')}
                className={`flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 ${
                  tab === 'JOIN'
                    ? 'bg-[#44563a] text-white shadow-md'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <LogIn className="w-4 h-4" /> DÀNH CHO SINH VIÊN (VÀO PHÒNG)
              </button>
            </div>

            {tab === 'HOST' ? (
              <form onSubmit={handleCreateHost} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-military text-gray-300">
                    Tên Giảng Viên / Chỉ Huy Trưởng:
                  </label>
                  <input
                    type="text"
                    value={hostName}
                    onChange={(e) => setHostName(e.target.value)}
                    placeholder="Ví dụ: Thầy Hoàng / Cô Linh"
                    required
                    className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-3 text-xs md:text-sm font-military text-white placeholder:text-gray-500 focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                <div className="p-4 bg-black/25 rounded-2xl border border-white/5 space-y-2 text-xs font-military text-gray-300">
                  <div className="flex items-center gap-2 text-yellow-400 font-bold">
                    <Sparkles className="w-4 h-4" /> Tính Năng Màn Hình Máy Chiếu Lớp Học:
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-gray-300 text-[11px] leading-relaxed">
                    <li>Hiển thị Mã PIN khổng lồ cho cả lớp quét/nhập tham gia.</li>
                    <li>Bảng điểm Live Leaderboard nhảy điểm từng giây theo thời gian thực.</li>
                    <li>Bục vinh danh Top 3 Podium (Hạng 1, 2, 3) khi kết thúc trận đấu.</li>
                  </ul>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#8b0000] to-[#b22222] hover:from-[#a00000] hover:to-[#c41e3a] text-white font-military font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-red-950/50 cursor-pointer"
                >
                  <Crown className="w-4 h-4 text-[#ffd700]" /> MỞ PHÒNG MÁY CHIẾU (GIẢNG VIÊN)
                </button>
              </form>
            ) : (
              <form onSubmit={handleJoinStudent} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-military text-gray-300">
                    Mã PIN Phòng (Xem trên máy chiếu):
                  </label>
                  <input
                    type="text"
                    value={roomPinInput}
                    onChange={(e) => setRoomPinInput(e.target.value)}
                    placeholder="Ví dụ: 715902 hoặc DBP123"
                    required
                    maxLength={8}
                    className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-3 text-base font-mono uppercase text-yellow-400 placeholder:text-gray-500 focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-military text-gray-300">
                    Họ Tên Sinh Viên / Chiến Sĩ:
                  </label>
                  <input
                    type="text"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="Ví dụ: Nguyễn Văn A - Nhóm 1"
                    required
                    className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-3 text-xs md:text-sm font-military text-white placeholder:text-gray-500 focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-[#44563a] hover:bg-[#556b2f] text-white font-military font-bold text-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <LogIn className="w-4 h-4" /> VÀO TRẬN ĐỊA THI ĐẤU
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
