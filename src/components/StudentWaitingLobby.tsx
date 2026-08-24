import React from 'react';
import { motion } from 'motion/react';
import {
  Users,
  Crosshair,
  Radio,
  Clock,
  Shield,
  LogOut,
  Sparkles
} from 'lucide-react';
import type { RoomPlayer } from './TeacherHostView';

interface StudentWaitingLobbyProps {
  roomCode: string;
  playerName: string;
  hostName?: string;
  players: RoomPlayer[];
  onLeave: () => void;
}

export const StudentWaitingLobby: React.FC<StudentWaitingLobbyProps> = ({
  roomCode,
  playerName,
  hostName,
  players,
  onLeave,
}) => {
  const classmates = players.filter((p) => !p.isHost);

  return (
    <div className="fixed inset-0 z-40 bg-[#0a0f08] text-[#f7f6f2] flex flex-col justify-between p-6 camo-gradient trench-texture select-none overflow-y-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between max-w-4xl w-full mx-auto">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#8b0000] border border-[#ffd700]/60 flex items-center justify-center font-bold text-[#ffd700] shadow-md">
            ★
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-black font-military text-white tracking-wide">
              ĐIỆN BIÊN PHỦ 1954 · SẢNH CHỜ
            </h1>
            <span className="text-[11px] text-gray-400 font-military">
              Chỉ huy phòng: <strong className="text-amber-400">{hostName || 'Giảng Viên'}</strong>
            </span>
          </div>
        </div>

        <button
          onClick={onLeave}
          className="px-3.5 py-1.5 rounded-xl bg-black/40 hover:bg-black/60 border border-white/20 text-gray-300 hover:text-red-400 font-military text-xs flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" /> Rời Phòng
        </button>
      </div>

      {/* Main Waiting Card */}
      <div className="max-w-xl w-full mx-auto my-auto py-6">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-[#1c2419]/95 border-2 border-[#ffd700] rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md text-center space-y-6 relative overflow-hidden"
        >
          {/* Radar Scanning Effect */}
          <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border border-emerald-500/30 animate-ping" />
            <div className="absolute inset-2 rounded-full border border-emerald-500/50" />
            <div className="w-16 h-16 rounded-full bg-[#2d3b27] border-2 border-emerald-400 flex items-center justify-center text-emerald-300 shadow-lg">
              <Crosshair className="w-8 h-8 animate-spin" style={{ animationDuration: '8s' }} />
            </div>
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/50 text-emerald-300 font-military font-bold text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              ĐÃ ĐIỂM DANH THÀNH CÔNG!
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-military text-white">
              SẴN SÀNG VÀO TRẬN ĐỊA
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 font-military max-w-md mx-auto leading-relaxed">
              Chiến sĩ <strong className="text-yellow-400 text-base">{playerName}</strong> đã vào vị trí pháo cao xạ. Đang chờ Giảng Viên phát lệnh Bắt Đầu...
            </p>
          </div>

          {/* Room PIN Display */}
          <div className="bg-black/50 border border-[#d4af37]/40 rounded-2xl p-4 flex items-center justify-around">
            <div>
              <span className="text-[11px] text-gray-400 font-military block">MÃ PHÒNG</span>
              <span className="text-2xl sm:text-3xl font-black font-mono tracking-widest text-[#ffd700]">
                {roomCode}
              </span>
            </div>
            <div className="h-8 w-px bg-white/10" />
            <div>
              <span className="text-[11px] text-gray-400 font-military block">ĐỒNG ĐỘI ĐÃ VÀO</span>
              <span className="text-2xl sm:text-3xl font-black font-mono text-emerald-400">
                {classmates.length}
              </span>
            </div>
          </div>

          {/* Classmates Grid */}
          <div className="space-y-2 text-left">
            <div className="flex items-center justify-between text-xs font-military text-gray-400">
              <span className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-[#ffd700]" /> Danh sách các chiến sĩ trong lớp:
              </span>
            </div>

            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-1">
              {classmates.map((p, idx) => (
                <span
                  key={p._id || idx}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-military flex items-center gap-1.5 ${
                    p.name.toLowerCase() === playerName.toLowerCase()
                      ? 'bg-emerald-900/60 border-emerald-400 text-emerald-200 font-bold'
                      : 'bg-black/40 border-white/10 text-gray-300'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  {p.name} {p.name.toLowerCase() === playerName.toLowerCase() && '(Bạn)'}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom Tip */}
      <div className="text-center text-xs font-military text-gray-500 pb-2">
        Trò chơi sẽ tự động chuyển cảnh khi Giảng Viên bấm nút Bắt Đầu Trận Đấu trên máy chiếu.
      </div>
    </div>
  );
};
