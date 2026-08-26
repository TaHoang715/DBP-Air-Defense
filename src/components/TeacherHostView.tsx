import React, { useEffect, useState, useCallback, useId } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { sound } from '../audio/SoundEngine';
import {
  Users,
  Trophy,
  Play,
  Copy,
  Check,
  Crown,
  Clock,
  Radio,
  RotateCcw,
  Maximize2,
  QrCode,
  X,
  LogOut,
  Sliders,
  Plus,
  Award,
  Flame,
  Target,
  CheckCircle2,
  Medal
} from 'lucide-react';

export interface RoomPlayer {
  _id: string;
  name: string;
  score: number;
  planesDowned: number;
  accuracy: number;
  shotsFired: number;
  questionsAnswered: number;
  isHost: boolean;
  isFinished: boolean;
  lastEvent?: string;
}

export interface BattleLog {
  _id: string;
  playerName: string;
  message: string;
  type: string;
  timestamp: number;
}

interface TeacherHostViewProps {
  roomCode: string;
  players: RoomPlayer[];
  logs: BattleLog[];
  status: 'waiting' | 'playing' | 'finished';
  durationSeconds: number;
  startedAt?: number;
  onStartGame: () => void;
  onFinishGame: () => void;
  onUpdateDuration?: (newDurationSeconds: number) => void;
  onExit: () => void;
}

export const TeacherHostView: React.FC<TeacherHostViewProps> = ({
  roomCode,
  players,
  logs,
  status,
  durationSeconds,
  startedAt,
  onStartGame,
  onFinishGame,
  onUpdateDuration,
  onExit,
}) => {
  const [copiedPin, setCopiedPin] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showLargeQr, setShowLargeQr] = useState(false);
  const [customMinutes, setCustomMinutes] = useState<string>(Math.round(durationSeconds / 60).toString());
  const customMinutesInputId = useId();

  // Filter student players (exclude host from competition table)
  const studentPlayers = players.filter((p) => !p.isHost).sort((a, b) => b.score - a.score);

  // Join Link & QR Code
  const joinLink = `${window.location.origin}${window.location.pathname}?code=${roomCode}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(joinLink)}`;

  // ═══ 1. CALCULATE TIME REMAINING FROM REAL SERVER TIMESTAMP ═══
  const calculateRemaining = useCallback(() => {
    if (status !== 'playing' || !startedAt) {
      return durationSeconds;
    }
    const elapsedSec = Math.floor((Date.now() - startedAt) / 1000);
    const rem = durationSeconds - elapsedSec;
    return Math.max(0, rem);
  }, [status, startedAt, durationSeconds]);

  const [timeLeft, setTimeLeft] = useState<number>(() => calculateRemaining());

  useEffect(() => {
    if (status !== 'playing') {
      setTimeLeft(durationSeconds);
      return;
    }

    const checkTimer = () => {
      const current = calculateRemaining();
      setTimeLeft(current);
      if (current <= 0) {
        onFinishGame();
      }
    };

    checkTimer();
    const timer = setInterval(checkTimer, 500);

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkTimer();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', checkTimer);

    return () => {
      clearInterval(timer);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', checkTimer);
    };
  }, [status, startedAt, durationSeconds, calculateRemaining, onFinishGame]);

  // Trigger Podium Confetti & Victory Fanfare Sound
  useEffect(() => {
    if (status === 'finished') {
      sound.playVictoryFanfare();
      confetti({
        particleCount: 160,
        spread: 100,
        origin: { y: 0.4 },
        colors: ['#ffd700', '#8b0000', '#2d3b27', '#ffffff']
      });
    }
  }, [status]);

  const handleCopyPin = () => {
    navigator.clipboard.writeText(roomCode);
    setCopiedPin(true);
    setTimeout(() => setCopiedPin(false), 2000);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(joinLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSelectDuration = (seconds: number) => {
    setCustomMinutes(Math.round(seconds / 60).toString());
    if (onUpdateDuration) {
      onUpdateDuration(seconds);
    }
  };

  const handleApplyCustomMinutes = () => {
    const parsed = parseInt(customMinutes, 10);
    if (!isNaN(parsed) && parsed > 0 && parsed <= 120) {
      const newSec = parsed * 60;
      if (onUpdateDuration) {
        onUpdateDuration(newSec);
      }
    }
  };

  const handleExtendMatch = (additionalSeconds: number) => {
    if (onUpdateDuration) {
      onUpdateDuration(durationSeconds + additionalSeconds);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0d120c] text-[#f7f6f2] flex flex-col font-sans select-none overflow-hidden camo-gradient trench-texture">
      {/* ═══ TOP CONTROL BAR ═══ */}
      <header className="bg-[#121a10]/95 border-b border-[#44563a] px-4 sm:px-6 py-3 flex items-center justify-between shadow-xl shrink-0 gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#8b0000] border border-[#ffd700]/60 flex items-center justify-center font-black text-[#ffd700] shadow-md shadow-red-950/50">
            ★
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#8b0000] text-[#ffd700] font-military font-bold border border-[#ffd700]/40">
                MÁY CHIẾU LỚP HỌC
              </span>
              <h1 className="text-sm sm:text-base font-black font-military text-white tracking-wide truncate max-w-[200px] sm:max-w-none">
                ĐẤU TRƯỜNG PHÒNG KHÔNG ĐIỆN BIÊN PHỦ
              </h1>
            </div>
            <span className="text-xs text-gray-400 font-military hidden md:inline">
              Trận địa pháo cao xạ 37mm · Khống chế bầu trời Mường Thanh 1954
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {status === 'waiting' && (
            <button
              onClick={onStartGame}
              disabled={studentPlayers.length === 0}
              className={`px-4 sm:px-6 py-2.5 rounded-xl font-military font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg transition-all cursor-pointer ${
                studentPlayers.length > 0
                  ? 'bg-gradient-to-r from-[#8b0000] to-[#b22222] hover:from-[#a00000] hover:to-[#c41e3a] text-white shadow-red-950/60 hover:scale-105 animate-pulse'
                  : 'bg-gray-800 text-gray-500 cursor-not-allowed border border-white/10'
              }`}
            >
              <Play className="w-4 h-4 fill-current text-[#ffd700]" />
              <span>BẮT ĐẦU TRẬN ĐẤU ({studentPlayers.length} CHIẾN SĨ)</span>
            </button>
          )}

          {status === 'playing' && (
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-xl bg-black/70 border border-[#d4af37]/60 text-[#ffd700] font-mono text-lg sm:text-xl font-black">
                <Clock className={`w-5 h-5 ${timeLeft <= 30 ? 'text-red-500 animate-pulse' : 'text-[#ffd700]'}`} />
                <span>{formatTime(timeLeft)}</span>
              </div>

              <button
                onClick={() => handleExtendMatch(60)}
                className="px-2.5 py-1.5 rounded-xl bg-[#2d3b27] hover:bg-[#3a4b32] border border-emerald-500/40 text-emerald-300 text-xs font-military font-bold flex items-center gap-1 transition-all cursor-pointer"
                title="Cộng thêm 1 phút thi đấu"
              >
                <Plus className="w-3.5 h-3.5" /> 1P
              </button>

              <button
                onClick={() => handleExtendMatch(120)}
                className="px-2.5 py-1.5 rounded-xl bg-[#2d3b27] hover:bg-[#3a4b32] border border-emerald-500/40 text-emerald-300 text-xs font-military font-bold flex items-center gap-1 transition-all cursor-pointer"
                title="Cộng thêm 2 phút thi đấu"
              >
                <Plus className="w-3.5 h-3.5" /> 2P
              </button>

              <button
                onClick={onFinishGame}
                className="px-3 sm:px-4 py-2 rounded-xl bg-red-900/60 hover:bg-red-900 border border-red-500/50 text-red-200 font-military text-xs font-bold transition-all cursor-pointer"
              >
                KẾT THÚC SỚM
              </button>
            </div>
          )}

          {status === 'finished' && (
            <button
              onClick={onStartGame}
              className="px-4 sm:px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-700 to-emerald-800 hover:from-emerald-600 hover:to-emerald-700 text-white font-military font-bold text-xs flex items-center gap-2 shadow-lg transition-all cursor-pointer"
            >
              <RotateCcw className="w-4 h-4 text-yellow-300" /> TÁI ĐẤU LƯỢT MỚI
            </button>
          )}

          <button
            onClick={onExit}
            className="p-2 rounded-xl bg-black/40 hover:bg-black/60 border border-white/10 text-gray-300 hover:text-white transition-all cursor-pointer"
            title="Thoát về trang chủ"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* ═══ 1. LOBBY VIEW (WAITING FOR STUDENTS TO JOIN) ═══ */}
      {status === 'waiting' && (
        <main className="flex-1 flex flex-col justify-between p-4 sm:p-8 overflow-y-auto">
          <div className="max-w-4xl w-full mx-auto text-center space-y-5 my-auto">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 font-military font-bold text-xs uppercase tracking-widest">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                PHÒNG CHỜ CHIẾN SĨ · SẴN SÀNG XUẤT KÍCH
              </div>
              <h2 className="text-lg sm:text-xl font-military font-bold text-gray-200">
                Học sinh quét mã QR hoặc nhập mã PIN trên máy chiếu để tham gia:
              </h2>
            </div>

            {/* Giant PIN Banner & Buttons */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 bg-[#1c2419]/90 border-2 border-[#ffd700] rounded-3xl p-5 sm:p-7 shadow-2xl backdrop-blur-md">
              <div
                onClick={() => setShowLargeQr(true)}
                className="bg-white p-3 rounded-2xl border-2 border-emerald-500/60 shadow-lg cursor-pointer hover:scale-105 transition-all group relative shrink-0"
              >
                <img src={qrUrl} alt="Mã QR tham gia" className="w-32 h-32 sm:w-36 sm:h-36 object-contain" />
                <div className="absolute inset-0 bg-black/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-xs font-bold gap-1 font-military">
                  <Maximize2 className="w-5 h-5 text-yellow-400" />
                  <span>Phóng to QR</span>
                </div>
              </div>

              <div className="space-y-3.5 text-center md:text-left">
                <div>
                  <span className="text-xs uppercase font-military tracking-widest text-gray-400 block mb-1">
                    MÃ PIN THAM GIA PHÒNG:
                  </span>
                  <div className="font-mono text-5xl sm:text-7xl font-black text-[#ffd700] tracking-widest drop-shadow-md">
                    {roomCode}
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                  <button
                    onClick={handleCopyPin}
                    className="px-3.5 py-2 rounded-xl bg-black/60 hover:bg-black/80 border border-white/20 text-[#ffd700] font-military font-bold text-xs flex items-center gap-2 transition-all cursor-pointer"
                  >
                    {copiedPin ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    {copiedPin ? 'ĐÃ SAO CHÉP PIN' : 'SAO CHÉP PIN'}
                  </button>

                  <button
                    onClick={handleCopyLink}
                    className="px-3.5 py-2 rounded-xl bg-[#2d3b27] hover:bg-[#3a4b32] border border-emerald-500/40 text-emerald-300 font-military font-bold text-xs flex items-center gap-2 transition-all cursor-pointer"
                  >
                    {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <QrCode className="w-4 h-4" />}
                    {copiedLink ? 'ĐÃ SAO CHÉP LINK' : 'SAO CHÉP LINK MỜI'}
                  </button>

                  <button
                    onClick={() => setShowLargeQr(true)}
                    className="px-3 py-2 rounded-xl bg-black/40 hover:bg-black/60 border border-white/20 text-gray-300 font-military text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Maximize2 className="w-3.5 h-3.5" /> Phóng To
                  </button>
                </div>
              </div>
            </div>

            {/* ⏱️ THIẾT LẬP THỜI LƯỢNG TRẬN ĐẤU */}
            <div className="bg-[#1c2419]/90 border border-[#44563a] rounded-2xl p-4 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4 font-military">
              <div className="flex items-center gap-2 text-yellow-300 text-xs font-bold">
                <Sliders className="w-4 h-4 text-[#ffd700]" />
                <span>THỜI LƯỢNG TRẬN ĐẤU:</span>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2">
                {[
                  { label: '3 Phút', sec: 180 },
                  { label: '5 Phút', sec: 300 },
                  { label: '10 Phút', sec: 600 },
                  { label: '15 Phút', sec: 900 },
                  { label: '20 Phút', sec: 1200 },
                ].map((preset) => {
                  const isSelected = durationSeconds === preset.sec;
                  return (
                    <button
                      key={preset.sec}
                      onClick={() => handleSelectDuration(preset.sec)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#8b0000] text-[#ffd700] border border-[#ffd700] shadow-md shadow-red-950/60 scale-105'
                          : 'bg-black/40 text-gray-300 hover:bg-black/60 border border-white/10'
                      }`}
                    >
                      {preset.label}
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center gap-2">
                <label htmlFor={customMinutesInputId} className="sr-only">
                  Nhập số phút
                </label>
                <input
                  id={customMinutesInputId}
                  type="number"
                  min={1}
                  max={120}
                  value={customMinutes}
                  onChange={(e) => setCustomMinutes(e.target.value)}
                  placeholder="Phút"
                  className="w-16 bg-black/60 border border-white/20 rounded-xl px-2.5 py-1 text-xs font-mono text-center text-yellow-300 focus:outline-none focus:border-[#ffd700]"
                />
                <button
                  onClick={handleApplyCustomMinutes}
                  className="px-3 py-1 bg-[#2d3b27] hover:bg-[#3a4b32] border border-emerald-500/50 rounded-xl text-emerald-300 text-xs font-bold transition-colors cursor-pointer"
                >
                  LƯU
                </button>
              </div>
            </div>

            {/* Connected Students Counter & Roster */}
            <div className="space-y-3">
              <div className="flex items-center justify-between max-w-4xl mx-auto px-2 font-military text-xs">
                <span className="text-gray-300 font-bold flex items-center gap-2 text-sm">
                  <Users className="w-4 h-4 text-[#ffd700]" />
                  CHIẾN SĨ ĐÃ VÀO VỊ TRÍ: <strong className="text-emerald-400 text-base">{studentPlayers.length}</strong>
                </span>
                <span className="text-gray-400">
                  {studentPlayers.length === 0 ? 'Đang chờ học sinh quét QR hoặc nhập PIN...' : 'Đã sẵn sàng! Hãy bấm Bắt Đầu'}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 max-h-48 overflow-y-auto p-1 custom-scrollbar">
                {studentPlayers.map((player, idx) => (
                  <motion.div
                    key={player._id}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="p-3 bg-[#1c2419]/90 border border-emerald-500/40 rounded-2xl flex items-center gap-2 text-left shadow-md"
                  >
                    <div className="w-7 h-7 rounded-xl bg-[#2d3b27] border border-emerald-400/50 flex items-center justify-center font-military font-black text-emerald-300 text-xs shrink-0">
                      {idx + 1}
                    </div>
                    <span className="font-military font-bold text-xs text-white truncate">
                      {player.name}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </main>
      )}

      {/* ═══ 2. LIVE BATTLE ARENA (PLAYING STATUS) ═══ */}
      {status === 'playing' && (
        <main className="flex-1 p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-hidden">
          {/* CỘT TRÁI (2/3 MÀN HÌNH): LIVE LEADERBOARD */}
          <div className="lg:col-span-2 bg-[#1c2419]/95 border-2 border-[#d4af37] rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col justify-between overflow-hidden">
            <div className="flex items-center justify-between border-b border-[#44563a] pb-3 mb-4 shrink-0">
              <div className="flex items-center gap-2">
                <Trophy className="w-6 h-6 text-[#ffd700]" />
                <h2 className="text-lg sm:text-xl font-black font-military text-white tracking-wide">
                  BẢNG XẾP HẠNG THỜI GIAN THỰC (REALTIME)
                </h2>
              </div>
              <span className="text-xs px-3 py-1 bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 rounded-full font-mono font-bold animate-pulse">
                LIVE SYNC
              </span>
            </div>

            {/* Leaderboard Table */}
            <div className="flex-1 overflow-y-auto space-y-2.5 pr-2 custom-scrollbar">
              {studentPlayers.map((player, idx) => {
                const isTop1 = idx === 0;
                const isTop2 = idx === 1;
                const isTop3 = idx === 2;

                return (
                  <motion.div
                    key={player._id}
                    layout
                    className={`p-3 sm:p-3.5 rounded-2xl border flex items-center justify-between gap-4 font-military transition-all ${
                      isTop1
                        ? 'bg-gradient-to-r from-[#8b0000]/70 to-[#b22222]/50 border-[#ffd700] shadow-lg shadow-red-950/50'
                        : isTop2
                        ? 'bg-black/50 border-gray-300/60'
                        : isTop3
                        ? 'bg-black/50 border-amber-700/60'
                        : 'bg-black/35 border-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-sm shrink-0 ${
                        isTop1
                          ? 'bg-[#ffd700] text-black shadow-md'
                          : isTop2
                          ? 'bg-gray-300 text-black'
                          : isTop3
                          ? 'bg-amber-700 text-white'
                          : 'bg-black/50 text-gray-400'
                      }`}>
                        {idx + 1}
                      </div>

                      <div className="truncate">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm sm:text-base text-white truncate">
                            {player.name}
                          </span>
                          {isTop1 && <Crown className="w-4 h-4 text-[#ffd700] shrink-0" />}
                        </div>
                        {player.lastEvent && (
                          <span className="text-[11px] text-yellow-400/90 truncate block">
                            ⚡ {player.lastEvent}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 sm:gap-4 shrink-0 font-mono text-xs sm:text-sm">
                      <div className="text-right hidden sm:block">
                        <span className="text-gray-400 text-[10px] block">MÁY BAY HẠ</span>
                        <span className="font-bold text-orange-400">{player.planesDowned}</span>
                      </div>
                      <div className="text-right hidden sm:block">
                        <span className="text-gray-400 text-[10px] block">CHÍNH XÁC</span>
                        <span className="font-bold text-emerald-400">{player.accuracy}%</span>
                      </div>
                      <div className="text-right bg-black/40 px-3 sm:px-3.5 py-1.5 rounded-xl border border-white/10">
                        <span className="text-[10px] text-gray-400 block">ĐIỂM SỐ</span>
                        <span className="font-black text-base sm:text-lg text-[#ffd700]">
                          {player.score}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* CỘT PHẢI (1/3 MÀN HÌNH): LIVE BATTLE LOGS */}
          <div className="bg-[#1c2419]/95 border border-[#44563a] rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col justify-between overflow-hidden">
            <div className="flex items-center gap-2 border-b border-[#44563a] pb-3 mb-4 shrink-0">
              <Radio className="w-5 h-5 text-red-500 animate-pulse" />
              <h3 className="text-base font-black font-military text-white">
                NHẬT KÝ CHIẾN SỰ MƯỜNG THANH
              </h3>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar text-xs font-military">
              {logs.map((log) => (
                <motion.div
                  key={log._id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-2.5 bg-black/40 border border-white/10 rounded-xl space-y-0.5"
                >
                  <div className="flex items-center justify-between text-[10px] text-gray-400 font-mono">
                    <span className="text-yellow-400 font-bold">{log.playerName}</span>
                    <span>{new Date(log.timestamp).toLocaleTimeString('vi-VN')}</span>
                  </div>
                  <p className="text-gray-200">{log.message}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </main>
      )}

      {/* ═══ 3. TOP 3 PODIUM & FULL CLASSROOM LEADERBOARD (FINISHED STATUS) ═══ */}
      {status === 'finished' && (
        <main className="flex-1 p-4 sm:p-8 flex flex-col justify-start overflow-y-auto custom-scrollbar">
          <div className="max-w-5xl w-full mx-auto space-y-8 text-center pb-8">
            {/* Title Banner */}
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full bg-[#8b0000] border border-[#ffd700] text-[#ffd700] font-military font-bold text-xs uppercase tracking-widest shadow-xl">
                ★ TOÀN THẮNG CHIẾN DỊCH ĐIỆN BIÊN PHỦ 1954 ★
              </div>
              <h2 className="text-2xl sm:text-4xl font-black font-military text-white tracking-wide">
                BẢNG VÀNG VINH DANH CHIẾN CÔNG CẢ LỚP
              </h2>
              <p className="text-xs sm:text-sm text-gray-300 font-military">
                Tổng kết thành tích thi đua bắn máy bay và giải câu hỏi lịch sử của toàn bộ chiến sĩ
              </p>
            </div>

            {/* 3D Top 3 Podium */}
            <div className="grid grid-cols-3 gap-3 sm:gap-6 items-end max-w-2xl mx-auto pt-4">
              {/* 🥈 Rank 2 */}
              <div className="flex flex-col items-center space-y-2">
                <span className="font-military font-bold text-xs sm:text-sm text-gray-200 truncate max-w-[120px]">
                  {studentPlayers[1]?.name || '---'}
                </span>
                <span className="font-mono font-bold text-xs sm:text-sm text-yellow-300">
                  {studentPlayers[1]?.score || 0} Đ
                </span>
                <div className="w-full h-28 sm:h-36 bg-gradient-to-t from-gray-700 to-gray-500 rounded-t-2xl border-t-4 border-gray-300 flex flex-col items-center justify-center shadow-2xl">
                  <span className="font-military font-black text-2xl sm:text-4xl text-black">2</span>
                  <span className="text-[10px] font-military font-bold text-gray-900 uppercase">Á QUÂN</span>
                </div>
              </div>

              {/* 🥇 Rank 1 */}
              <div className="flex flex-col items-center space-y-2">
                <Crown className="w-8 h-8 text-[#ffd700] animate-bounce" />
                <span className="font-military font-bold text-sm sm:text-base text-yellow-300 truncate max-w-[150px]">
                  {studentPlayers[0]?.name || '---'}
                </span>
                <span className="font-mono font-black text-sm sm:text-base text-[#ffd700]">
                  {studentPlayers[0]?.score || 0} Đ
                </span>
                <div className="w-full h-40 sm:h-52 bg-gradient-to-t from-[#8b0000] to-[#b22222] rounded-t-2xl border-t-4 border-[#ffd700] flex flex-col items-center justify-center shadow-2xl shadow-red-950">
                  <span className="font-military font-black text-4xl sm:text-6xl text-[#ffd700]">1</span>
                  <span className="text-[11px] font-military font-black text-yellow-300 uppercase tracking-wider">QUÁN QUÂN</span>
                </div>
              </div>

              {/* 🥉 Rank 3 */}
              <div className="flex flex-col items-center space-y-2">
                <span className="font-military font-bold text-xs sm:text-sm text-gray-200 truncate max-w-[120px]">
                  {studentPlayers[2]?.name || '---'}
                </span>
                <span className="font-mono font-bold text-xs sm:text-sm text-yellow-300">
                  {studentPlayers[2]?.score || 0} Đ
                </span>
                <div className="w-full h-20 sm:h-26 bg-gradient-to-t from-amber-900 to-amber-700 rounded-t-2xl border-t-4 border-amber-500 flex flex-col items-center justify-center shadow-2xl">
                  <span className="font-military font-black text-2xl sm:text-4xl text-white">3</span>
                  <span className="text-[10px] font-military font-bold text-amber-200 uppercase">HẠNG BA</span>
                </div>
              </div>
            </div>

            {/* 📋 BẢNG XẾP HẠNG TOÀN DIỆN CẢ LỚP (FULL LEADERBOARD LIST) */}
            <div className="bg-[#1c2419]/95 border-2 border-[#d4af37]/60 rounded-3xl p-5 sm:p-7 shadow-2xl text-left space-y-4 max-w-4xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#44563a] pb-3">
                <div className="flex items-center gap-2 text-white font-military font-black text-base sm:text-lg">
                  <Trophy className="w-5 h-5 text-[#ffd700]" />
                  <span>DANH SÁCH THỨ HẠNG CẢ LỚP ({studentPlayers.length} CHIẾN SĨ)</span>
                </div>
                <span className="text-xs text-yellow-400 font-military font-bold">
                  ★ Top 5 được tuyên dương dũng sĩ phòng không ★
                </span>
              </div>

              {/* Table List of All Players */}
              <div className="space-y-2 max-h-96 overflow-y-auto pr-1 custom-scrollbar">
                {studentPlayers.map((player, idx) => {
                  const rank = idx + 1;
                  const isTop1 = rank === 1;
                  const isTop2 = rank === 2;
                  const isTop3 = rank === 3;
                  const isTop5 = rank <= 5;

                  return (
                    <motion.div
                      key={player._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.03 }}
                      className={`p-3.5 rounded-2xl border flex items-center justify-between gap-4 font-military transition-all ${
                        isTop1
                          ? 'bg-gradient-to-r from-[#8b0000]/80 to-[#b22222]/60 border-[#ffd700] shadow-lg shadow-red-950/60'
                          : isTop2
                          ? 'bg-black/60 border-gray-300/70'
                          : isTop3
                          ? 'bg-black/60 border-amber-700/70'
                          : isTop5
                          ? 'bg-emerald-950/40 border-emerald-500/50'
                          : 'bg-black/40 border-white/10'
                      }`}
                    >
                      {/* Rank & Name */}
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-sm shrink-0 shadow-sm ${
                            isTop1
                              ? 'bg-[#ffd700] text-black'
                              : isTop2
                              ? 'bg-gray-300 text-black'
                              : isTop3
                              ? 'bg-amber-700 text-white'
                              : isTop5
                              ? 'bg-emerald-700 text-emerald-100'
                              : 'bg-black/60 text-gray-400 border border-white/10'
                          }`}
                        >
                          {rank}
                        </div>

                        <div className="truncate">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm sm:text-base text-white truncate">
                              {player.name}
                            </span>
                            {isTop1 && <Crown className="w-4 h-4 text-[#ffd700] shrink-0" />}
                            {isTop5 && !isTop1 && <Medal className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                          </div>
                          <span className="text-[11px] text-gray-400 font-mono">
                            Hạ {player.planesDowned} máy bay · {player.questionsAnswered} câu trắc nghiệm đúng
                          </span>
                        </div>
                      </div>

                      {/* Detailed Stats */}
                      <div className="flex items-center gap-3 sm:gap-5 shrink-0 font-mono text-xs sm:text-sm">
                        <div className="text-right hidden sm:block">
                          <span className="text-gray-400 text-[10px] block">MÁY BAY HẠ</span>
                          <span className="font-bold text-orange-400">{player.planesDowned}</span>
                        </div>

                        <div className="text-right hidden sm:block">
                          <span className="text-gray-400 text-[10px] block">CHÍNH XÁC</span>
                          <span className="font-bold text-emerald-400">{player.accuracy}%</span>
                        </div>

                        <div className="text-right bg-black/50 px-3.5 py-1.5 rounded-xl border border-white/15">
                          <span className="text-[10px] text-gray-400 block">TỔNG ĐIỂM</span>
                          <span className="font-black text-base sm:text-lg text-[#ffd700]">
                            {player.score}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </main>
      )}

      {/* ═══ LARGE QR CODE MODAL ═══ */}
      {showLargeQr && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="bg-[#1c2419] border-2 border-[#ffd700] rounded-3xl p-8 max-w-sm w-full text-center space-y-6 relative">
            <button
              onClick={() => setShowLargeQr(false)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-black/40 hover:bg-black/60 text-gray-300 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <h3 className="text-xl font-black font-military text-[#ffd700]">
                QUÉT MÃ QR THAM GIA
              </h3>
              <p className="text-xs text-gray-300">
                Mở camera điện thoại quét để vào trận địa
              </p>
            </div>

            <div className="bg-white p-4 rounded-2xl border-2 border-emerald-500 inline-block shadow-2xl">
              <img src={qrUrl} alt="Mã QR" className="w-56 h-56 object-contain mx-auto" />
            </div>

            <div className="bg-black/50 p-3 rounded-xl border border-white/10">
              <span className="text-xs text-gray-400 block font-military">MÃ PIN:</span>
              <span className="text-3xl font-mono font-black text-[#ffd700] tracking-widest">
                {roomCode}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
