import React from 'react';
import {
  Clock,
  Crosshair,
  Award,
  Zap,
  Volume2,
  VolumeX,
  Flame,
  HelpCircle,
  Trophy
} from 'lucide-react';
import { sound } from '../audio/SoundEngine';

interface HeaderProps {
  score: number;
  planesDownedCount: number;
  timeRemaining: number;
  ammo37mm: number;
  ammoFlak: number;
  useFlak: boolean;
  onToggleFlak: () => void;
  onOpenQuiz: () => void;
  onOpenLeaderboard: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  score,
  planesDownedCount,
  timeRemaining,
  ammo37mm,
  ammoFlak,
  useFlak,
  onToggleFlak,
  onOpenQuiz,
  onOpenLeaderboard,
  isMuted,
  onToggleMute
}) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-[#121a10]/90 backdrop-blur-md border-b border-[#44563a]/60 px-4 py-2.5 text-[#f7f6f2] shadow-lg">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Title & Badge */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#8b0000] border border-[#d4af37]/60 flex items-center justify-center font-black text-[#ffd700] shadow-md shadow-red-950/50">
            ★
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm md:text-base font-black font-military text-white tracking-wider">
                ĐIỆN BIÊN PHỦ 1954
              </h1>
              <span className="hidden sm:inline-block px-2 py-0.5 bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#d4af37] text-[10px] font-military font-bold rounded">
                PHÒNG KHÔNG 37MM
              </span>
            </div>
            <p className="text-[11px] text-gray-400 hidden md:block">
              Khống chế bầu trời Mường Thanh · Cắt đứt cầu hàng không Pháp
            </p>
          </div>
        </div>

        {/* Game Stats (Timer, Score, Planes Downed) */}
        <div className="flex items-center gap-2 sm:gap-4 font-military">
          {/* Battle Timer */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-black/40 border border-white/10 rounded-xl">
            <Clock className={`w-4 h-4 ${timeRemaining <= 30 ? 'text-red-500 animate-pulse' : 'text-[#ffd700]'}`} />
            <span className={`text-xs md:text-sm font-bold font-mono ${timeRemaining <= 30 ? 'text-red-400' : 'text-white'}`}>
              {formatTime(timeRemaining)}
            </span>
          </div>

          {/* Planes Downed */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-black/40 border border-white/10 rounded-xl">
            <Flame className="w-4 h-4 text-orange-400" />
            <span className="text-xs md:text-sm font-bold text-white">
              {planesDownedCount} <span className="text-[10px] text-gray-400">HẠ</span>
            </span>
          </div>

          {/* Score */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-black/40 border border-white/10 rounded-xl">
            <Award className="w-4 h-4 text-[#ffd700]" />
            <span className="text-xs md:text-sm font-bold text-[#ffd700] font-mono">
              {score}
            </span>
          </div>
        </div>

        {/* Ammunition Bar & Controls */}
        <div className="flex items-center gap-2">
          {/* Ammo Selector */}
          <div className="flex items-center bg-black/50 p-1 rounded-xl border border-[#44563a]">
            {/* Standard 37mm */}
            <button
              onClick={() => useFlak && onToggleFlak()}
              className={`px-3 py-1 rounded-lg text-xs font-military font-bold flex items-center gap-1.5 transition-all ${
                !useFlak
                  ? 'bg-[#2d3b27] text-yellow-300 border border-yellow-500/40 shadow-sm'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <Crosshair className="w-3.5 h-3.5" />
              <span>37MM: {ammo37mm}</span>
            </button>

            {/* Special Flak */}
            <button
              onClick={() => !useFlak && onToggleFlak()}
              className={`px-3 py-1 rounded-lg text-xs font-military font-bold flex items-center gap-1.5 transition-all ${
                useFlak
                  ? 'bg-amber-700 text-amber-100 border border-amber-400 shadow-sm animate-pulse'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-amber-300" />
              <span>FLAK: {ammoFlak}</span>
            </button>
          </div>

          {/* Nạp đạn Button */}
          <button
            onClick={onOpenQuiz}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#8b0000] to-[#b22222] hover:from-[#a00000] hover:to-[#c41e3a] text-white font-military font-bold text-xs flex items-center gap-1.5 border border-[#d4af37]/40 shadow-md shadow-red-950/40 cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5 text-[#ffd700]" />
            <span className="hidden sm:inline">NẠP ĐẠN</span>
          </button>

          {/* Leaderboard Button */}
          <button
            onClick={onOpenLeaderboard}
            className="p-2 rounded-xl bg-black/40 hover:bg-black/60 border border-white/10 text-gray-300 hover:text-yellow-400 transition-colors"
            title="Bảng Xếp Hạng"
          >
            <Trophy className="w-4 h-4" />
          </button>

          {/* Mute Button */}
          <button
            onClick={onToggleMute}
            className="p-2 rounded-xl bg-black/40 hover:bg-black/60 border border-white/10 text-gray-300 hover:text-white transition-colors"
            title={isMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>
        </div>
      </div>
    </header>
  );
};
