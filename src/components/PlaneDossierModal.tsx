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
  Plane,
  Crosshair,
  Target,
  Zap,
  Bomb,
  Radio,
  Camera,
  Image as ImageIcon
} from 'lucide-react';

interface PlaneDossierModalProps {
  plane: HistoricalPlane | null;
  onFinishedReading: () => void;
  onFinishReading?: () => void; // Support both naming styles
  countdownSeconds?: number;
}

export const PlaneDossierModal: React.FC<PlaneDossierModalProps> = ({
  plane,
  onFinishedReading,
  onFinishReading,
  countdownSeconds = 5
}) => {
  const [timeLeft, setTimeLeft] = useState<number>(countdownSeconds);
  const [canProceed, setCanProceed] = useState<boolean>(false);
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);
  const [imageError, setImageError] = useState<boolean>(false);

  const handleClose = () => {
    if (onFinishedReading) onFinishedReading();
    if (onFinishReading) onFinishReading();
  };

  useEffect(() => {
    if (!plane) return;
    setTimeLeft(countdownSeconds);
    setCanProceed(false);
    setImageLoaded(false);
    setImageError(false);

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

  // Keyboard shortcut: Press Space or Enter to continue once countdown completes
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (canProceed && (e.code === 'Space' || e.code === 'Enter')) {
        e.preventDefault();
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [canProceed]);

  if (!plane) return null;

  const progressPercent = ((countdownSeconds - timeLeft) / countdownSeconds) * 100;

  // Visual Aircraft Type Badge & Icon
  const getAircraftTypeBadge = (type: HistoricalPlane['aircraftType']) => {
    switch (type) {
      case 'B52':
        return { label: 'PHÁO ĐÀI BAY B-52', color: 'bg-red-950/90 text-red-300 border-red-500/60 shadow-red-950/50' };
      case 'SWING_WING':
        return { label: 'CÁNH CỤP CÁNH XÒE', color: 'bg-amber-950/90 text-amber-300 border-amber-500/60 shadow-amber-950/50' };
      case 'JET_FIGHTER':
        return { label: 'TIÊM KÍCH PHẢN LỰC', color: 'bg-blue-950/90 text-blue-300 border-blue-500/60 shadow-blue-950/50' };
      case 'ATTACK_BOMBER':
        return { label: 'CƯỜNG KÍCH OANH TẠC', color: 'bg-emerald-950/90 text-emerald-300 border-emerald-500/60 shadow-emerald-950/50' };
      case 'HELICOPTER':
        return { label: 'TRỰC THĂNG CỨU HỘ', color: 'bg-purple-950/90 text-purple-300 border-purple-500/60 shadow-purple-950/50' };
      case 'DRONE':
        return { label: 'UAV KHÔNG NGƯỜI LÁI', color: 'bg-cyan-950/90 text-cyan-300 border-cyan-500/60 shadow-cyan-950/50' };
      default:
        return { label: 'MÁY BAY TRINH SÁT', color: 'bg-gray-950/90 text-gray-300 border-gray-500/60' };
    }
  };

  const typeBadge = getAircraftTypeBadge(plane.aircraftType);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 25 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 25 }}
          transition={{ duration: 0.3 }}
          className="relative w-full max-w-2xl bg-[#182015] border-2 border-[#d4af37] rounded-3xl shadow-2xl overflow-hidden text-[#f7f6f2] flex flex-col max-h-[92vh]"
        >
          {/* Top Banner Stamp */}
          <div className="bg-gradient-to-r from-[#8b0000] via-[#a30000] to-[#b22222] px-5 sm:px-6 py-3 flex items-center justify-between border-b border-[#d4af37]/40 shrink-0 shadow-md">
            <div className="flex items-center gap-2.5">
              <Flame className="w-5 h-5 text-[#ffd700] animate-bounce shrink-0" />
              <span className="font-military font-black text-xs sm:text-sm uppercase tracking-wider text-[#ffd700] drop-shadow-sm">
                CHIẾN CÔNG PHÒNG KHÔNG · 12 NGÀY ĐÊM 1972
              </span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-black/50 rounded-full border border-[#ffd700]/40 font-military text-xs text-[#ffd700] font-black shadow-inner">
              <Award className="w-3.5 h-3.5" /> +{plane.baseScore} ĐIỂM
            </div>
          </div>

          {/* Linear Progress Bar */}
          <div className="w-full bg-black/70 h-1.5 shrink-0 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-yellow-500 via-amber-400 to-emerald-400 transition-all duration-1000 ease-linear shadow-sm"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Body Content */}
          <div className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1 custom-scrollbar">
            {/* Plane Header Info Card */}
            <div className="bg-black/60 p-4 rounded-2xl border border-[#d4af37]/40 space-y-2.5 shadow-inner">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className={`px-3 py-0.5 rounded-full border text-[11px] font-military font-bold shadow-sm ${typeBadge.color}`}>
                  {typeBadge.label}
                </span>
                {plane.serialNumber && (
                  <span className="px-3 py-0.5 rounded-full bg-black/80 border border-yellow-500/50 text-yellow-300 font-mono text-[11px] font-bold shadow-sm">
                    SỐ HIỆU: {plane.serialNumber}
                  </span>
                )}
              </div>

              <div>
                <h2 className="text-xl sm:text-2xl font-black font-military text-white tracking-wide">
                  {plane.name}
                </h2>
                <p className="text-xs text-yellow-400/90 font-mono mt-0.5">
                  Mã định danh: {plane.code}
                </p>
              </div>

              {/* Role & Bomb payload banner */}
              <div className="p-2.5 bg-red-950/50 border border-red-500/30 rounded-xl text-xs font-military text-red-200 flex items-start gap-2">
                <Bomb className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-yellow-300">Vai trò / Sức công phá: </span>
                  <span>{plane.role}</span>
                </div>
              </div>
            </div>

            {/* Real Historical Photo Section */}
            <div className="relative rounded-2xl overflow-hidden border-2 border-[#d4af37]/40 bg-black/80 group">
              <div className="relative h-44 sm:h-52 w-full flex items-center justify-center bg-black/60">
                {!imageError ? (
                  <>
                    <img
                      src={plane.imageUrl}
                      alt={plane.name}
                      onLoad={() => setImageLoaded(true)}
                      onError={() => setImageError(true)}
                      className={`w-full h-full object-cover object-center transition-all duration-700 ${
                        imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                      }`}
                    />
                    {!imageLoaded && (
                      <div className="absolute inset-0 flex items-center justify-center gap-2 text-yellow-500 font-military text-xs animate-pulse">
                        <Camera className="w-5 h-5 animate-spin" /> Đang tải ảnh tư liệu lịch sử...
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center p-6 text-gray-400 font-military text-xs gap-2">
                    <Plane className="w-12 h-12 text-yellow-500/40" />
                    <span>Ảnh tư liệu: {plane.name}</span>
                  </div>
                )}
                {/* Photo Vignette Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />
                {/* Historical Archival Stamp */}
                <div className="absolute top-2.5 right-2.5 px-2.5 py-1 bg-black/80 backdrop-blur-md rounded-lg border border-[#d4af37]/40 text-[10px] font-military font-bold text-yellow-300 flex items-center gap-1.5 shadow-md">
                  <Camera className="w-3.5 h-3.5 text-yellow-400" /> ẢNH TƯ LIỆU QUÂN SỰ
                </div>
                {/* Caption Bar */}
                <div className="absolute bottom-2 left-3 right-3 text-[11px] font-military text-gray-200 truncate">
                  <span className="text-yellow-400 font-bold">Tư liệu: </span>
                  {plane.imageCaption}
                </div>
              </div>
            </div>

            {/* Time & Credited Unit Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-military text-xs">
              <div className="p-3 bg-black/40 rounded-2xl border border-white/10 flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-[#ffd700] shrink-0 mt-0.5" />
                <div>
                  <span className="text-gray-400 block text-[11px]">NGÀY BỊ BẮN RƠI</span>
                  <strong className="text-white text-xs sm:text-sm">{plane.shotDownDate}</strong>
                </div>
              </div>

              <div className="p-3 bg-black/40 rounded-2xl border border-white/10 flex items-start gap-2.5">
                <Crosshair className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-gray-400 block text-[11px]">ĐƠN VỊ LẬP CÔNG</span>
                  <strong className="text-emerald-300 text-xs sm:text-sm">{plane.creditedUnit}</strong>
                </div>
              </div>
            </div>

            {/* Historical Context Description */}
            <div className="p-4 bg-[#121910] rounded-2xl border border-[#44563a] space-y-2 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-military font-bold text-[#d4af37] uppercase">
                <FileText className="w-4 h-4" /> DIỄN BIẾN CHIẾN CÔNG LỊCH SỬ
              </div>
              <p className="text-xs sm:text-sm text-gray-200 font-military leading-relaxed text-justify">
                {plane.historicalContext}
              </p>
            </div>

            {/* Specs Grid */}
            <div className="p-3.5 bg-black/35 rounded-2xl border border-white/10 space-y-2">
              <span className="text-[11px] font-military font-bold text-gray-400 uppercase block">
                THÔNG SỐ KỸ THUẬT QUÂN SỰ
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono text-gray-300">
                <div className="bg-black/50 p-2 rounded-xl border border-white/5">
                  <span className="text-gray-500 block text-[10px]">XUẤT XỨ</span>
                  <strong className="text-white truncate block">{plane.specs.origin}</strong>
                </div>
                <div className="bg-black/50 p-2 rounded-xl border border-white/5">
                  <span className="text-gray-500 block text-[10px]">TỐC ĐỘ</span>
                  <strong className="text-yellow-400 truncate block">{plane.specs.maxSpeed}</strong>
                </div>
                <div className="bg-black/50 p-2 rounded-xl border border-white/5">
                  <span className="text-gray-500 block text-[10px]">SẢI CÁNH</span>
                  <strong className="text-white truncate block">{plane.specs.wingspan}</strong>
                </div>
                <div className="bg-black/50 p-2 rounded-xl border border-white/5">
                  <span className="text-gray-500 block text-[10px]">TẢI BOM</span>
                  <strong className="text-orange-400 truncate block">{plane.specs.bombLoad}</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Action Footer */}
          <div className="p-4 bg-black/60 border-t border-[#44563a] flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
            <div className="text-xs font-military text-gray-400 text-center sm:text-left">
              {canProceed ? (
                <span className="text-emerald-400 flex items-center gap-1.5 font-bold">
                  <CheckCircle2 className="w-4 h-4" /> Đã hoàn thành đọc tư liệu! Nhấn tiếp tục hoặc phím Space/Enter.
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-yellow-300 font-bold">
                  <Lock className="w-4 h-4 text-yellow-400 animate-pulse" /> Bắt buộc đọc tư liệu: còn {timeLeft} giây...
                </span>
              )}
            </div>

            <button
              onClick={handleClose}
              disabled={!canProceed}
              className={`w-full sm:w-auto px-8 py-2.5 rounded-2xl font-military font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all ${
                canProceed
                  ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white cursor-pointer hover:scale-105 shadow-emerald-950/60 animate-pulse'
                  : 'bg-gray-800 text-gray-500 cursor-not-allowed border border-white/10'
              }`}
            >
              <span>TIẾP TỤC CHIẾN ĐẤU</span>
              {canProceed && <span className="text-[10px] opacity-80">(Space / Enter)</span>}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
