import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import type { HistoricalPlane } from '../data/planesData';
import {
  FileText,
  Clock,
  MapPin,
  Shield,
  Award,
  Lock,
  CheckCircle2,
  Flame
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
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.35 }}
          className="relative w-full max-w-2xl bg-[#1c2419] border-2 border-[#d4af37]/80 rounded-3xl shadow-2xl overflow-hidden text-[#f7f6f2]"
        >
          {/* Top Banner Stamp */}
          <div className="bg-[#8b0000] px-6 py-3.5 flex items-center justify-between border-b border-[#d4af37]/40">
            <div className="flex items-center gap-2.5">
              <Flame className="w-5 h-5 text-[#ffd700] animate-bounce" />
              <span className="font-military font-bold text-sm md:text-base uppercase tracking-widest text-[#ffd700]">
                CHIẾN CÔNG PHÒNG KHÔNG · BẮN HẠ MÁY BAY GIẶC
              </span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-black/40 rounded-full border border-[#ffd700]/30 font-military text-xs text-[#ffd700]">
              <Award className="w-3.5 h-3.5" /> +{plane.baseScore} ĐIỂM
            </div>
          </div>

          {/* Body Content */}
          <div className="p-6 md:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
            {/* Plane Header Info */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-black/30 p-4 rounded-2xl border border-[#44563a]">
              <div>
                <span className="text-xs font-military uppercase text-[#d4af37] tracking-wider font-bold">
                  PHIÊN HIỆU QUÂN PHÁP
                </span>
                <h2 className="text-xl md:text-2xl font-bold font-military text-white">
                  {plane.name}
                </h2>
                <p className="text-xs text-gray-300 font-mono mt-0.5">
                  Mã định danh: <span className="text-yellow-400">{plane.code}</span> · {plane.frenchUnit}
                </p>
              </div>
              <div className="px-3.5 py-1.5 bg-[#44563a]/40 border border-[#44563a] rounded-xl text-xs font-mono text-gray-200 self-start md:self-auto">
                Nhiệm vụ: {plane.role}
              </div>
            </div>

            {/* Time & Location Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 font-military text-xs md:text-sm">
              <div className="p-3.5 bg-black/25 rounded-xl border border-white/10 flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-[#ffd700] shrink-0 mt-0.5" />
                <div>
                  <span className="text-gray-400 block text-xs">THỜI ĐIỂM BẮN RƠI</span>
                  <strong className="text-white">{plane.shotDownTime}</strong> · {plane.shotDownDate}
                </div>
              </div>

              <div className="p-3.5 bg-black/25 rounded-xl border border-white/10 flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-gray-400 block text-xs">ĐỊA ĐIỂM RƠI</span>
                  <strong className="text-white">{plane.shotDownLocation}</strong>
                </div>
              </div>

              <div className="sm:col-span-2 p-3.5 bg-black/25 rounded-xl border border-white/10 flex items-start gap-2.5">
                <Shield className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-gray-400 block text-xs">ĐƠN VỊ LẬP CHIẾN CÔNG</span>
                  <strong className="text-emerald-300">{plane.creditedUnit}</strong>
                </div>
              </div>
            </div>

            {/* Historical Context / Ý nghĩa lịch sử */}
            <div className="p-4 bg-[#2d3b27]/60 rounded-2xl border border-[#d4af37]/30 space-y-2">
              <div className="flex items-center gap-2 text-[#d4af37] font-military font-bold text-xs uppercase tracking-wider">
                <FileText className="w-4 h-4" /> Ý Nghĩa & Bối Cảnh Lịch Sử
              </div>
              <p className="text-xs md:text-sm text-gray-200 leading-relaxed italic">
                "{plane.historicalContext}"
              </p>
            </div>

            {/* Aircraft Tech Specs */}
            <div className="p-3 bg-black/20 rounded-xl border border-white/5 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono text-gray-300">
              <div><span className="text-gray-500 block">Xuất xứ:</span> {plane.specs.origin}</div>
              <div><span className="text-gray-500 block">Tốc độ tối đa:</span> {plane.specs.maxSpeed}</div>
              <div><span className="text-gray-500 block">Sải cánh:</span> {plane.specs.wingspan}</div>
              <div><span className="text-gray-500 block">Hỏa lực:</span> {plane.specs.armament}</div>
            </div>
          </div>

          {/* Mandatory Reading Bar & Action Button (STRICT NO-SKIP) */}
          <div className="p-6 bg-black/40 border-t border-[#44563a] space-y-3">
            {/* Progress countdown */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-military">
                <span className="text-gray-400 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-amber-400" />
                  Yêu cầu bắt buộc: Đọc tư liệu lịch sử
                </span>
                <span className="text-amber-400 font-bold font-mono">
                  {timeLeft > 0 ? `Còn ${timeLeft} giây` : 'Hoàn thành ghi nhớ!'}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2 bg-black/60 rounded-full overflow-hidden border border-white/10">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-[#d4af37] transition-all duration-1000 ease-linear"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Action Button (Strictly disabled when timeLeft > 0) */}
            <button
              onClick={onFinishedReading}
              disabled={!canProceed}
              className={`w-full py-3.5 rounded-2xl font-military font-bold text-sm md:text-base flex items-center justify-center gap-2 transition-all ${
                canProceed
                  ? 'bg-gradient-to-r from-[#8b0000] to-[#b22222] hover:from-[#a00000] hover:to-[#c41e3a] text-white shadow-lg shadow-red-950/50 cursor-pointer scale-[1.01]'
                  : 'bg-gray-800 text-gray-400 border border-gray-700 cursor-not-allowed opacity-80'
              }`}
            >
              {canProceed ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-[#ffd700]" />
                  ĐÃ GHI NHỚ TƯ LIỆU · TIẾP TỤC CHIẾN ĐẤU
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 text-amber-400 animate-pulse" />
                  ĐANG ĐỌC HỒ SƠ CHIẾN DỊCH ({timeLeft}S)... [KHÔNG ĐƯỢC BỎ QUA]
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
