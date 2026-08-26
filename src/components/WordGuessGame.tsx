import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { WORD_GUESS_ROUNDS, WordGuessRound } from '../data/wordGuessData';
import { sound } from '../audio/SoundEngine';
import {
  Sparkles,
  Trophy,
  HelpCircle,
  Clock,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Eye,
  EyeOff,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  BookOpen,
  Volume2,
  VolumeX,
  Award,
  Flame,
  Star,
  Info,
  Maximize2
} from 'lucide-react';

interface WordGuessGameProps {
  onBackToHub: () => void;
}

export const WordGuessGame: React.FC<WordGuessGameProps> = ({ onBackToHub }) => {
  // Navigation & Game State
  const [currentRoundIdx, setCurrentRoundIdx] = useState<number | null>(null);
  const [completedRoundIds, setCompletedRoundIds] = useState<Set<number>>(new Set());
  const [showRules, setShowRules] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Round Interactive State
  const [isRevealed, setIsRevealed] = useState<boolean>(false);
  const [revealedIndices, setRevealedIndices] = useState<Set<number>>(new Set());
  const [showClue, setShowClue] = useState<boolean>(true);
  const [timerSeconds, setTimerSeconds] = useState<number>(60);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  const currentRound: WordGuessRound | null =
    currentRoundIdx !== null ? WORD_GUESS_ROUNDS[currentRoundIdx] : null;

  // ═══ 1. TIMER COUNTDOWN ═══
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            sound.playQuizWrong();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, timerSeconds]);

  // Open a specific round
  const openRound = (idx: number) => {
    setCurrentRoundIdx(idx);
    setIsRevealed(completedRoundIds.has(idx + 1));
    setRevealedIndices(new Set());
    setShowClue(true);
    setTimerSeconds(60);
    setIsTimerRunning(false);
  };

  // Reveal Entire Answer
  const handleRevealAll = () => {
    if (!currentRound) return;
    setIsRevealed(true);
    setIsTimerRunning(false);
    sound.playQuizSuccess();

    // Mark as completed
    const newCompleted = new Set(completedRoundIds);
    newCompleted.add(currentRound.id);
    setCompletedRoundIds(newCompleted);

    // Confetti celebration
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#ffd700', '#c8102e', '#ff4500', '#ffffff']
    });

    // If all 16 rounds are completed, play victory fanfare!
    if (newCompleted.size === WORD_GUESS_ROUNDS.length) {
      setTimeout(() => {
        sound.playVictoryFanfare();
      }, 500);
    }
  };

  // Reveal a random letter
  const handleRevealRandomLetter = () => {
    if (!currentRound || isRevealed) return;
    const cleanAnswer = currentRound.answer.replace(/\s+/g, '');
    const unrevealedIdxs: number[] = [];

    for (let i = 0; i < cleanAnswer.length; i++) {
      if (!revealedIndices.has(i)) {
        unrevealedIdxs.push(i);
      }
    }

    if (unrevealedIdxs.length === 0) {
      handleRevealAll();
      return;
    }

    const randomIdx = unrevealedIdxs[Math.floor(Math.random() * unrevealedIdxs.length)];
    const newRevealed = new Set(revealedIndices);
    newRevealed.add(randomIdx);
    setRevealedIndices(newRevealed);
    sound.playHitSound();

    if (newRevealed.size === cleanAnswer.length) {
      handleRevealAll();
    }
  };

  // Next / Prev navigation
  const handleNextRound = () => {
    if (currentRoundIdx !== null && currentRoundIdx < WORD_GUESS_ROUNDS.length - 1) {
      openRound(currentRoundIdx + 1);
    }
  };

  const handlePrevRound = () => {
    if (currentRoundIdx !== null && currentRoundIdx > 0) {
      openRound(currentRoundIdx - 1);
    }
  };

  // Reset entire game progress
  const handleResetAllProgress = () => {
    if (window.confirm('Bạn có chắc chắn muốn làm mới tiến độ chơi lại từ đầu không?')) {
      setCompletedRoundIds(new Set());
      setCurrentRoundIdx(null);
    }
  };

  // Split word answer into groups
  const renderWordTiles = (answer: string) => {
    const words = answer.split(' ');
    let globalCharIndex = 0;

    return (
      <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 my-3">
        {words.map((word, wIdx) => {
          const chars = Array.from(word);
          return (
            <div key={wIdx} className="flex items-center gap-1.5 bg-black/30 p-1.5 sm:p-2 rounded-2xl border border-yellow-500/20 shadow-inner">
              {chars.map((char, cIdx) => {
                const thisCharIdx = globalCharIndex++;
                const isCharRevealed = isRevealed || revealedIndices.has(thisCharIdx);

                return (
                  <motion.div
                    key={cIdx}
                    initial={{ scale: 0.9, rotateY: 90 }}
                    animate={{ scale: 1, rotateY: isCharRevealed ? 0 : 0 }}
                    transition={{ duration: 0.25 }}
                    className={`w-9 h-11 sm:w-11 sm:h-14 rounded-xl font-military font-black text-lg sm:text-2xl flex items-center justify-center border-2 transition-all duration-300 select-none shadow-md ${
                      isCharRevealed
                        ? 'bg-gradient-to-b from-[#b22222] to-[#8b0000] border-[#ffd700] text-[#ffd700] shadow-red-950/80 scale-105'
                        : 'bg-black/60 border-yellow-500/40 text-transparent hover:border-yellow-400/80'
                    }`}
                  >
                    {isCharRevealed ? char : ''}
                  </motion.div>
                );
              })}
            </div>
          );
        })}
      </div>
    );
  };

  const totalCompleted = completedRoundIds.size;
  const progressPercent = Math.round((totalCompleted / WORD_GUESS_ROUNDS.length) * 100);

  return (
    <div className="min-h-screen w-full bg-[#121910] text-[#f7f6f2] font-sans flex flex-col justify-between overflow-x-hidden selection:bg-red-700 selection:text-white">
      {/* ═══ TOP GLOBAL NAVIGATION BAR ═══ */}
      <header className="sticky top-0 z-40 bg-[#1a2317]/90 backdrop-blur-md border-b border-[#44563a] px-4 sm:px-8 py-3 flex items-center justify-between shadow-lg">
        {/* Left: Back to Hub & Game Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToHub}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/40 hover:bg-black/60 border border-yellow-500/30 text-yellow-400 text-xs sm:text-sm font-military font-bold transition-all hover:scale-105 cursor-pointer shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">CHỌN GAME KHÁC</span>
          </button>

          <div className="h-6 w-[1px] bg-white/10 hidden sm:block" />

          <div>
            <h1 className="text-sm sm:text-base font-black font-military text-[#ffd700] tracking-wide flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse" />
              <span>NHÌN HÌNH ĐOÁN CHỮ (1945 - 1946)</span>
            </h1>
            <p className="text-[11px] text-gray-300 font-military hidden md:block">
              Lịch sử Đảng Cộng sản Việt Nam · 16 Câu hỏi Ô chữ & Tư liệu hình ảnh
            </p>
          </div>
        </div>

        {/* Right: Actions & Progress Badge */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/50 border border-yellow-500/30 font-military text-xs font-bold text-yellow-300">
            <Trophy className="w-3.5 h-3.5 text-yellow-400" />
            <span>{totalCompleted}/16 CÂU ({progressPercent}%)</span>
          </div>

          <button
            onClick={() => setShowRules(true)}
            className="p-2 rounded-xl bg-black/40 hover:bg-black/60 border border-white/10 text-gray-200 hover:text-yellow-300 transition-colors cursor-pointer"
            title="Xem Luật Chơi"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsMuted(sound.toggleMute())}
            className="p-2 rounded-xl bg-black/40 hover:bg-black/60 border border-white/10 text-gray-200 hover:text-yellow-300 transition-colors cursor-pointer"
            title={isMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>
        </div>
      </header>

      {/* ═══ MAIN BODY VIEW (ROUND SELECTOR OR SINGLE ROUND SOLVER) ═══ */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 flex flex-col items-center justify-center">
        {currentRoundIdx === null ? (
          // ══════════════════════════════════════════════════════════════════
          // VIEW 1: 16-ROUND GRID SELECTOR (MÀN HÌNH CHỌN CÂU HỎI)
          // ══════════════════════════════════════════════════════════════════
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full space-y-6 py-4"
          >
            {/* Banner Intro */}
            <div className="text-center space-y-2 max-w-2xl mx-auto">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-[#8b0000] to-[#b22222] text-[#ffd700] shadow-lg shadow-red-950/60 border border-yellow-500/40 mb-1">
                <Star className="w-6 h-6 fill-yellow-400" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-black font-military text-[#ffd700] tracking-wide uppercase drop-shadow-md">
                ĐẤU TRƯỜNG GIẢI MÃ LỊCH SỬ ĐẢNG
              </h2>
              <p className="text-xs sm:text-sm text-gray-300 font-military leading-relaxed">
                Khám phá 16 sự kiện, phong trào, chỉ thị và danh hiệu lịch sử hào hùng giai đoạn 1945–1946. Nhìn hình ảnh manh mối, bấm chọn câu hỏi và giải mã ô chữ bí mật!
              </p>
            </div>

            {/* 16 Round Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto">
              {WORD_GUESS_ROUNDS.map((round, idx) => {
                const isDone = completedRoundIds.has(round.id);
                return (
                  <motion.button
                    key={round.id}
                    whileHover={{ scale: 1.04, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => openRound(idx)}
                    className={`relative p-5 sm:p-6 rounded-2xl border-2 text-center transition-all duration-200 cursor-pointer shadow-lg overflow-hidden flex flex-col items-center justify-center gap-1.5 ${
                      isDone
                        ? 'bg-gradient-to-b from-[#2a3824] to-[#1c2618] border-emerald-500/80 shadow-emerald-950/40 text-emerald-300'
                        : 'bg-gradient-to-b from-[#8b0000] to-[#600000] border-[#ffd700]/60 hover:border-[#ffd700] shadow-red-950/60 text-white'
                    }`}
                  >
                    {/* Completion Badge */}
                    {isDone && (
                      <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold shadow-md">
                        ✓
                      </div>
                    )}

                    <span className="text-2xl sm:text-3xl font-black font-military text-yellow-300">
                      {round.id < 10 ? `0${round.id}` : round.id}
                    </span>
                    <span className="text-[10px] sm:text-xs font-military uppercase font-bold tracking-wider opacity-90">
                      {isDone ? 'ĐÃ HOÀN THÀNH' : 'CÂU HỎI'}
                    </span>
                    <span className="text-[10px] text-gray-200 font-military truncate max-w-full px-1">
                      {round.prompt}
                    </span>
                  </motion.button>
                );
              })}
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
              <button
                onClick={() => openRound(0)}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-military font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-emerald-950/60 cursor-pointer transition-all hover:scale-105"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>BẮT ĐẦU CHƠI TỪ CÂU 01</span>
              </button>

              {totalCompleted > 0 && (
                <button
                  onClick={handleResetAllProgress}
                  className="px-4 py-2.5 rounded-xl bg-black/40 hover:bg-black/60 border border-white/20 text-gray-300 hover:text-white font-military text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>LÀM MỚI TIẾN ĐỘ</span>
                </button>
              )}
            </div>
          </motion.div>
        ) : (
          // ══════════════════════════════════════════════════════════════════
          // VIEW 2: SINGLE ROUND SOLVER (MÀN HÌNH GIẢI Ô CHỮ CÂU ĐANG CHỌN)
          // ══════════════════════════════════════════════════════════════════
          <motion.div
            key={currentRound.id}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-4xl space-y-4"
          >
            {/* Round Top Navigation Bar */}
            <div className="flex items-center justify-between gap-3 bg-black/40 p-3 rounded-2xl border border-yellow-500/30">
              <button
                onClick={() => setCurrentRoundIdx(null)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/60 hover:bg-black/80 border border-white/20 text-gray-200 hover:text-yellow-300 font-military text-xs font-bold transition-all cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>DANH SÁCH CÂU</span>
              </button>

              <div className="flex items-center gap-2 font-military">
                <span className="px-3 py-1 rounded-full bg-red-950/80 border border-red-500 text-yellow-300 font-bold text-xs sm:text-sm">
                  CÂU HỎI {currentRound.id} / 16
                </span>
                {completedRoundIds.has(currentRound.id) && (
                  <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-950 border border-emerald-500 text-emerald-300 text-xs font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" /> ĐÃ MỞ
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={handlePrevRound}
                  disabled={currentRoundIdx === 0}
                  className="p-2 rounded-xl bg-black/60 hover:bg-black/80 disabled:opacity-30 disabled:cursor-not-allowed border border-white/20 text-yellow-400 cursor-pointer"
                  title="Câu trước"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNextRound}
                  disabled={currentRoundIdx === WORD_GUESS_ROUNDS.length - 1}
                  className="p-2 rounded-xl bg-black/60 hover:bg-black/80 disabled:opacity-30 disabled:cursor-not-allowed border border-white/20 text-yellow-400 cursor-pointer"
                  title="Câu tiếp theo"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Split Panel: Image (Left) + Puzzle & Controls (Right) */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch">
              {/* Left Panel: Photo / SVG & Prompt */}
              <div className="md:col-span-5 bg-black/50 p-4 rounded-3xl border border-[#d4af37]/40 flex flex-col justify-between gap-3 shadow-inner">
                {/* Prompt Banner */}
                <div className="bg-gradient-to-r from-[#8b0000] to-[#b22222] p-2.5 rounded-2xl border border-yellow-500/40 text-center shadow-md">
                  <span className="text-[10px] font-military uppercase text-yellow-300 tracking-wider block font-bold">
                    CÂU HỎI TRỌNG TÂM
                  </span>
                  <h3 className="text-base sm:text-lg font-black font-military text-white tracking-wide">
                    {currentRound.prompt}
                  </h3>
                </div>

                {/* Historical Image / SVG Presentation */}
                <div className="relative rounded-2xl overflow-hidden border-2 border-yellow-500/30 bg-black/80 flex items-center justify-center min-h-[190px] sm:min-h-[220px]">
                  {currentRound.photo ? (
                    <img
                      src={currentRound.photo}
                      alt={currentRound.prompt}
                      className="w-full h-48 sm:h-56 object-cover object-center transition-all duration-300 hover:scale-105"
                    />
                  ) : (
                    <div
                      className="w-44 h-44 flex items-center justify-center p-2"
                      dangerouslySetInnerHTML={{ __html: currentRound.iconSvg }}
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute bottom-2 left-3 right-3 text-[11px] font-military text-yellow-300/90 font-bold truncate">
                    📷 Tư liệu Lịch sử Đảng CSVN 1945–1946
                  </div>
                </div>

                {/* Clue Accordion */}
                <div className="p-3 bg-[#172115] rounded-2xl border border-[#44563a] space-y-1 text-xs font-military">
                  <div className="flex items-center justify-between text-yellow-400 font-bold">
                    <span className="flex items-center gap-1.5">
                      <Info className="w-3.5 h-3.5" /> GỢI Ý MANH MỐI:
                    </span>
                    <button
                      onClick={() => setShowClue(!showClue)}
                      className="text-[10px] text-gray-400 hover:text-white underline cursor-pointer"
                    >
                      {showClue ? 'Ẩn gợi ý' : 'Hiện gợi ý'}
                    </button>
                  </div>
                  {showClue && (
                    <p className="text-gray-200 text-justify leading-relaxed italic">
                      "{currentRound.clue}"
                    </p>
                  )}
                </div>
              </div>

              {/* Right Panel: Word Tiles, Countdown & Action Buttons */}
              <div className="md:col-span-7 bg-black/50 p-4 sm:p-5 rounded-3xl border border-[#d4af37]/40 flex flex-col justify-between gap-4 shadow-inner">
                {/* Timer Bar */}
                <div className="flex items-center justify-between bg-black/60 p-3 rounded-2xl border border-white/10">
                  <div className="flex items-center gap-2">
                    <Clock className={`w-5 h-5 ${timerSeconds <= 10 ? 'text-red-400 animate-bounce' : 'text-yellow-400'}`} />
                    <div>
                      <span className="text-[10px] text-gray-400 block font-military">THỜI GIAN SUY NGHĨ</span>
                      <strong className={`font-mono text-lg ${timerSeconds <= 10 ? 'text-red-400 animate-pulse' : 'text-yellow-300'}`}>
                        {timerSeconds} GIÂY
                      </strong>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsTimerRunning(!isTimerRunning)}
                      className={`px-3 py-1.5 rounded-xl font-military text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                        isTimerRunning
                          ? 'bg-amber-600/80 hover:bg-amber-500 text-white'
                          : 'bg-emerald-600/80 hover:bg-emerald-500 text-white'
                      }`}
                    >
                      {isTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-white" />}
                      <span>{isTimerRunning ? 'TẠM DỪNG' : 'TÍNH GIỜ'}</span>
                    </button>
                    <button
                      onClick={() => {
                        setTimerSeconds(60);
                        setIsTimerRunning(false);
                      }}
                      className="p-1.5 rounded-xl bg-black/40 hover:bg-black/60 border border-white/10 text-gray-300 cursor-pointer"
                      title="Đặt lại 60s"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Word Tiles Display */}
                <div className="space-y-2 text-center my-auto py-2">
                  <div className="flex items-center justify-between text-xs text-gray-400 font-military px-2">
                    <span>Số từ: <strong className="text-yellow-400">{currentRound.answer.split(' ').length} từ</strong></span>
                    <span>Số chữ cái: <strong className="text-yellow-400">{currentRound.answer.replace(/\s+/g, '').length} ký tự</strong></span>
                  </div>

                  {renderWordTiles(currentRound.answer)}
                </div>

                {/* Interactive Action Toolbar */}
                <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
                  <button
                    onClick={handleRevealAll}
                    className="flex-1 min-w-[140px] py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#8b0000] to-[#b22222] hover:from-[#a00000] hover:to-[#c41e3a] text-white font-military font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-red-950/60 transition-all hover:scale-105 cursor-pointer"
                  >
                    <Eye className="w-4 h-4" />
                    <span>MỞ TOÀN BỘ ĐÁP ÁN</span>
                  </button>

                  <button
                    onClick={handleRevealRandomLetter}
                    disabled={isRevealed}
                    className="py-2.5 px-4 rounded-xl bg-yellow-600/80 hover:bg-yellow-500 disabled:opacity-40 disabled:cursor-not-allowed text-black font-military font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>MỞ 1 KÝ TỰ</span>
                  </button>
                </div>

                {/* Historical Note / Educational Debrief (Shown when answer is revealed) */}
                <AnimatePresence>
                  {isRevealed && (
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-[#141b12] rounded-2xl border border-emerald-500/50 space-y-2 shadow-md"
                    >
                      <div className="flex items-center gap-2 text-xs font-military font-bold text-emerald-400 uppercase">
                        <BookOpen className="w-4 h-4" /> BÀI HỌC & TƯ LIỆU LỊCH SỬ CHÍNH THỐNG
                      </div>
                      <p className="text-xs sm:text-sm text-gray-200 font-military leading-relaxed text-justify">
                        {currentRound.note}
                      </p>

                      {currentRoundIdx < WORD_GUESS_ROUNDS.length - 1 && (
                        <div className="pt-2 flex justify-end">
                          <button
                            onClick={handleNextRound}
                            className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-military font-bold text-xs flex items-center gap-1.5 shadow-md cursor-pointer transition-all hover:scale-105"
                          >
                            <span>SANG CÂU TIẾP THEO</span>
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </main>

      {/* ═══ RULES MODAL ═══ */}
      <AnimatePresence>
        {showRules && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-[#1c2419] border-2 border-[#d4af37] rounded-3xl p-6 max-w-lg w-full text-white space-y-4 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-[#44563a] pb-3">
                <h3 className="text-lg font-black font-military text-[#ffd700] flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-yellow-400" />
                  LUẬT CHƠI NHÌN HÌNH ĐOÁN CHỮ
                </h3>
                <button
                  onClick={() => setShowRules(false)}
                  className="p-1 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3 text-xs sm:text-sm font-military text-gray-200 leading-relaxed text-justify">
                <p>
                  1. <strong>Mục tiêu:</strong> Giải mã 16 ô chữ lịch sử về chủ trương, phong trào và sự kiện của Đảng CSVN trong giai đoạn 1945–1946 (Diệt giặc đói, giặc dốt, giặc ngoại xâm, Hiệp định Sơ bộ, Tạm ước Việt Pháp,...).
                </p>
                <p>
                  2. <strong>Cách chơi:</strong> Chọn một câu hỏi từ danh sách. Quan sát hình ảnh và manh mối gợi ý để suy nghĩ đáp án trong thời gian đếm ngược 60 giây.
                </p>
                <p>
                  3. <strong>Hỗ trợ:</strong> Người thuyết trình / sinh viên có thể bấm "Mở 1 ký tự" để gợi ý từng chữ cái, hoặc bấm "Mở toàn bộ đáp án" để khám phá trọn vẹn lời giải thích lịch sử.
                </p>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setShowRules(false)}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#8b0000] to-[#b22222] text-white font-military font-bold text-xs uppercase cursor-pointer"
                >
                  ĐÃ HIỂU LUẬT CHƠI
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ═══ FOOTER ═══ */}
      <footer className="bg-black/60 border-t border-[#44563a]/60 px-4 py-2.5 text-center text-gray-400 font-military text-[11px]">
        <span>Hệ Thống Trò Chơi Giáo Dục Lịch Sử Đảng CSVN · Phát Triển Cho Giảng Đường & Thuyết Trình</span>
      </footer>
    </div>
  );
};
