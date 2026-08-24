import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Users, Trophy, Play, Plus, LogIn, X, Crown, Flame, Target } from 'lucide-react';

interface MultiplayerRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartBattle: (roomCode?: string) => void;
}

export const MultiplayerRoomModal: React.FC<MultiplayerRoomModalProps> = ({
  isOpen,
  onClose,
  onStartBattle,
}) => {
  const [tab, setTab] = useState<'CREATE' | 'JOIN'>('CREATE');
  const [hostName, setHostName] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [roomCodeInput, setRoomCodeInput] = useState('');
  const [activeRoomCode, setActiveRoomCode] = useState<string | null>(null);
  const [isHost, setIsHost] = useState(false);

  if (!isOpen) return null;

  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hostName.trim()) return;
    const generatedCode = 'DBP' + Math.floor(100 + Math.random() * 900);
    setActiveRoomCode(generatedCode);
    setIsHost(true);
  };

  const handleJoinRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerName.trim() || !roomCodeInput.trim()) return;
    setActiveRoomCode(roomCodeInput.toUpperCase().trim());
    setIsHost(false);
  };

  const handleLaunchRoomBattle = () => {
    onStartBattle(activeRoomCode || undefined);
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
                  ĐẤU TRƯỜNG PHÒNG KHÔNG · NHIỀU NGƯỜI CHƠI
                </h3>
                <p className="text-xs text-gray-300">
                  Thi đấu pháo thủ thời gian thực theo phòng lớp học
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
            {!activeRoomCode ? (
              <>
                {/* Tab selector */}
                <div className="flex rounded-2xl bg-black/40 p-1 border border-white/10 font-military text-xs font-bold">
                  <button
                    onClick={() => setTab('CREATE')}
                    className={`flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 ${
                      tab === 'CREATE'
                        ? 'bg-[#44563a] text-white shadow-md'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <Plus className="w-4 h-4" /> TẠO PHÒNG MỚI
                  </button>
                  <button
                    onClick={() => setTab('JOIN')}
                    className={`flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 ${
                      tab === 'JOIN'
                        ? 'bg-[#44563a] text-white shadow-md'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <LogIn className="w-4 h-4" /> THAM GIA PHÒNG
                  </button>
                </div>

                {tab === 'CREATE' ? (
                  <form onSubmit={handleCreateRoom} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-military text-gray-300">
                        Tên Chỉ Huy / Trưởng Khẩu Đội:
                      </label>
                      <input
                        type="text"
                        value={hostName}
                        onChange={(e) => setHostName(e.target.value)}
                        placeholder="Ví dụ: Chỉ huy Nguyễn Văn A"
                        required
                        className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-3 text-xs md:text-sm font-military text-white placeholder:text-gray-500 focus:outline-none focus:border-[#d4af37]"
                      />
                    </div>

                    <div className="p-4 bg-black/25 rounded-2xl border border-white/5 space-y-2 text-xs font-military text-gray-300">
                      <div className="flex items-center justify-between text-gray-400">
                        <span>Thời lượng thi đấu:</span>
                        <strong className="text-white">180 Giây (3 Phút)</strong>
                      </div>
                      <div className="flex items-center justify-between text-gray-400">
                        <span>Bảng điểm:</span>
                        <strong className="text-emerald-400">Cập nhật Realtime</strong>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#8b0000] to-[#b22222] hover:from-[#a00000] hover:to-[#c41e3a] text-white font-military font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-red-950/50 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" /> TẠO MÃ PHÒNG THI ĐẤU
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleJoinRoom} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-military text-gray-300">
                        Mã Phòng (6 ký tự):
                      </label>
                      <input
                        type="text"
                        value={roomCodeInput}
                        onChange={(e) => setRoomCodeInput(e.target.value)}
                        placeholder="Ví dụ: DBP123"
                        required
                        maxLength={8}
                        className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-3 text-sm font-mono uppercase text-yellow-400 placeholder:text-gray-500 focus:outline-none focus:border-[#d4af37]"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-military text-gray-300">
                        Tên Pháo Thủ / Chiến Sĩ:
                      </label>
                      <input
                        type="text"
                        value={playerName}
                        onChange={(e) => setPlayerName(e.target.value)}
                        placeholder="Ví dụ: Pháo thủ Trần Văn B"
                        required
                        className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-3 text-xs md:text-sm font-military text-white placeholder:text-gray-500 focus:outline-none focus:border-[#d4af37]"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3.5 rounded-xl bg-[#44563a] hover:bg-[#556b2f] text-white font-military font-bold text-sm flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <LogIn className="w-4 h-4" /> VÀO PHÒNG CHỜ
                    </button>
                  </form>
                )}
              </>
            ) : (
              /* Waiting Room View */
              <div className="space-y-6 text-center">
                <div className="p-6 bg-black/40 rounded-3xl border-2 border-[#d4af37] space-y-2">
                  <span className="text-xs font-military uppercase text-[#d4af37] tracking-widest font-bold">
                    MÃ PHÒNG THI ĐẤU
                  </span>
                  <div className="text-4xl md:text-5xl font-black font-mono tracking-widest text-[#ffd700]">
                    {activeRoomCode}
                  </div>
                  <p className="text-xs text-gray-400 font-military">
                    Hãy chia sẻ mã phòng này cho các bạn trong lớp để cùng tham chiến!
                  </p>
                </div>

                <div className="p-4 bg-black/25 rounded-2xl border border-white/10 text-left font-military text-xs space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Trạng thái:</span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      ● Đang kết nối Backend Convex
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Vai trò của bạn:</span>
                    <span className="text-white font-bold">
                      {isHost ? 'Chỉ Huy Trưởng (Host)' : 'Pháo Thủ Thi Đấu'}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleLaunchRoomBattle}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#8b0000] to-[#b22222] hover:from-[#a00000] hover:to-[#c41e3a] text-white font-military font-black text-base flex items-center justify-center gap-3 shadow-xl shadow-red-950/60 cursor-pointer animate-pulse"
                >
                  <Play className="w-5 h-5 fill-current" />
                  BẮT ĐẦU TRẬN ĐẤU (XUẤT KÍCH)
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
