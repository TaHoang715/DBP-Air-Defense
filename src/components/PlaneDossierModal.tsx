import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import type { HistoricalPlane } from '../data/planesData';
import { sound } from '../audio/SoundEngine';
import {
  FileText,
  Clock,
  MapPin,
  Shield,
  Award,
  Lock,
  CheckCircle2,
  Flame,
  Crosshair,
  Sparkles,
  ShieldAlert
} from 'lucide-react';

interface PlaneDossierModalProps {
  plane: HistoricalPlane | null;
  onFinishedReading: () => void;
  countdownSeconds?: number;
}

export const PlaneDossierModal: React.FC<PlaneDossierModalProps> = ({
  plane,
  onFinishedReading,
  countdownSeconds = 6
}) => {
  const [timeLeft, setTimeLeft] = useState<number>(countdownSeconds);
  const [canProceed, setCanProceed] = useState<boolean>(false);

  useEffect(() => {
    if (!plane) return;
    setTimeLeft(countdownSeconds);
    setCanProceed(false);

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setCanProceed(true);
          sound.playQuizSuccess();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [plane, countdownSeconds]);

  if (!plane) return null;

  const progressPercent = ((countdownSeconds - timeLeft) / countdownSeconds) * 100;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 25 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 25 }}
          transition={{ duration: 0.35 }}
          className="relative w-full max-w-2xl bg-[#1c2419] border-2 border-[#d4af37] rounded-3xl shadow-2xl overflow-hidden text-[#f7f6f2] flex flex-col max-h-[90vh]"
        >
          {/* Top Banner Stamp */}
          <div className="bg-[#8b0000] px-6 py-3.5 flex items-center justify-between border-b border-[#d4af37]/40 shrink-0">
            <div className="flex items-center gap-2.5">
              <Flame className="w-5 h-5 text-[#ffd700] animate-bounce" />
              <span className="font-military font-bold text-sm md:text-base uppercase tracking-widest text-[#ffd700]">
                CHIẾN CÔNG PHÒNG KHÔNG · HỒ SƠ CHIẾN TÍCH
              </span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-black/40 rounded-full border border-[#ffd700]/30 font-military text-xs text-[#ffd700] font-bold">
              <Award className="w-3.5 h-3.5" /> +{plane.baseScore} ĐIỂM
            </div>
          </div>

          {/* Linear Progress Bar */}
          <div className="w-full bg-black/50 h-1.5 shrink-0 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-yellow-500 to-emerald-400 transition-all duration-1000 ease-linear"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Body Content */}
          <div className="p-6 md:p-8 space-y-6 overflow-y-auto flex-1 custom-scrollbar">
            {/* Plane Header Info */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-black/35 p-4 rounded-2xl border border-[#44563a]">
              <div>
                <span className="text-xs font-military uppercase text-[#d4af37] tracking-wider font-bold">
                  PHIÊN HIỆU MÁY BAY THỰC DÂN PHÁP
                </span>
                <h2 className="text-xl md:text-2xl font-black font-military text-white">
                  {plane.name}
                </h2>
                <p className="text-xs text-gray-300 font-mono mt-0.5">
                  Mã định danh: <span className="text-yellow-400">{plane.code}</span> · {plane.frenchUnit}
                </p>
              </div>
              <div className="px-3.5 py-1.5 bg-[#44563a]/40 border border-[#44563a] rounded-xl text-xs font-mono text-gray-200 self-start md:self-auto font-bold">
                Nhiệm vụ: {plane.role}
              </div>
            </div>

            {/* Time & Location Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 font-military text-xs md:text-sm">
              <div className="p-3.5 bg-black/25 rounded-2xl border border-white/10 flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-[#ffd700] shrink-0 mt-0.5" />
                <div>
                  <span className="text-gray-400 block text-xs">THỜI ĐIỂM BẮN RƠI</span>
                  <strong className="text-white">{plane.shotDownTime}</strong> · {plane.shotDownDate}
                </div>
              </div>

              <div className="p-3.5 bg-black/25 rounded-2xl border border-white/10 flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-gray-400 block text-xs">ĐỊA ĐIỂM RƠI</span>
                  <strong className="text-white">{plane.shotDownLocation}</strong>
                </div>
              </div>

              <div className="sm:col-span-2 p-3.5 bg-black/25 rounded-2xl border border-white/10 flex items-start gap-2.5">
                <Shield className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-gray-400 block text-xs">ĐƠN VỊ LẬP CHIẾN CÔNG</span>
                  <strong className="text-emerald-300">{plane.creditedUnit}</strong>
                </div>
              </div>
            </div>

            {/* Historical Context / Ý nghĩa lịch sử */}
            <div className="p-4 bg-[#2d3b27]/70 rounded-2xl border border-[#d4af37]/40 space-y-2">
              <div className="flex items-center gap-2 text-[#d4af37] font-military font-bold text-xs uppercase tracking-wider">
                <FileText className="w-4 h-4" /> Ý Nghĩa & Bối Cảnh Lịch Sử
              </div>
              <p className="text-xs md:text-sm text-gray-200 leading-relaxed italic">
                "{plane.historicalContext}"
              </p>
            </div>

            {/* Aircraft Tech Specs */}
            <div className="p-3.5 bg-black/30 rounded-2xl border border-white/5 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono text-gray-300">
              <div><span className="text-gray-500 block text-[10px]">Xuất xứ:</span> {plane.specs.origin}</div>
              <div><span className="text-gray-500 block text-[10px]">Tốc độ:</span> {plane.specs.maxSpeed}</div>
              <div><span className="text-gray-500 block text-[10px]">Sải cánh:</span> {plane.specs.wingspan}</div>
              <div><span className="text-gray-500 block text-[10px]">Hỏa lực:</span> {plane.specs.armament}</div>
            </div>
          </div>

          {/* Footer Mandatory Countdown Action (Strict No-Skip) */}
          <div className="p-4 bg-black/40 border-t border-[#44563a] flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-2 text-xs font-military text-gray-400">
              <Lock className="w-4 h-4 text-amber-400" />
              <span>Yêu cầu đọc tư liệu để ghi nhớ kiến thức lịch sử (Không có nút Skip)</span>
            </div>

            <button
              onClick={onFinishedReading}
              disabled={!canProceed}
              className={`w-full sm:w-auto px-8 py-3 rounded-xl font-military font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                canProceed
                  ? 'bg-gradient-to-r from-emerald-700 to-emerald-800 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-lg shadow-emerald-950/60 cursor-pointer animate-pulse hover:scale-105'
                  : 'bg-gray-800 text-gray-400 cursor-not-allowed border border-white/10'
              }`}
            >
              {canProceed ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-yellow-300" /> TIẾP TỤC CHIẾN ĐẤU
                </>
              ) : (
                <>
                  <Clock className="w-4 h-4 animate-spin text-amber-400" /> ĐỌC TƯ LIỆU ({timeLeft}S)
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
