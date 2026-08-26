import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { QUIZ_QUESTIONS, QuizQuestion } from '../data/quizData';
import { sound } from '../audio/SoundEngine';
import {
  HelpCircle,
  Zap,
  CheckCircle2,
  XCircle,
  Sparkles,
  BookOpen,
  Timer,
  Clock,
  Crosshair,
  ShieldAlert
} from 'lucide-react';

interface QuizModalProps {
  isOpen: boolean;
  onAddAmmo: (shells37mm: number, flakBonus: number) => void;
  onCloseToBattle: () => void;
  currentAmmo: number;
}

const BATCH_SIZE = 5; // Cố định 5 câu hỏi mỗi đợt nạp đạn
const PENALTY_SECONDS = 5; // Thời gian phạt đọc lại kiến thức khi trả lời sai (5s ngang hồ sơ máy bay)

const OPTION_STYLES = [
  {
    letter: 'A',
    bg: 'bg-sky-500/15',
    border: 'border-sky-500/40',
    badge: 'bg-sky-600 text-white',
    hover: 'hover:bg-sky-500/25 hover:border-sky-400',
  },
  {
    letter: 'B',
    bg: 'bg-emerald-500/15',
    border: 'border-emerald-500/40',
    badge: 'bg-emerald-600 text-white',
    hover: 'hover:bg-emerald-500/25 hover:border-emerald-400',
  },
  {
    letter: 'C',
    bg: 'bg-amber-500/15',
    border: 'border-amber-500/40',
    badge: 'bg-amber-600 text-white',
    hover: 'hover:bg-amber-500/25 hover:border-amber-400',
  },
  {
    letter: 'D',
    bg: 'bg-purple-500/15',
    border: 'border-purple-500/40',
    badge: 'bg-purple-600 text-white',
    hover: 'hover:bg-purple-500/25 hover:border-purple-400',
  }
];

export const QuizModal: React.FC<QuizModalProps> = ({
  isOpen,
  onAddAmmo,
  onCloseToBattle,
  currentAmmo
}) => {
  // Global question pool index
  const [globalQuestionIndex, setGlobalQuestionIndex] = useState<number>(0);

  // Index within current 5-question batch (0, 1, 2, 3, 4)
  const [batchStep, setBatchStep] = useState<number>(0);

  // Batch accumulated rewards
  const [batchEarnedShells, setBatchEarnedShells] = useState<number>(0);
  const [batchEarnedFlak, setBatchEarnedFlak] = useState<number>(0);
  const [batchCorrectCount, setBatchCorrectCount] = useState<number>(0);

  // Question answering states
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [penaltyTimeLeft, setPenaltyTimeLeft] = useState<number>(PENALTY_SECONDS);
  const [isBatchFinished, setIsBatchFinished] = useState<boolean>(false);

  // Question answer timer (15s limit per question)
  const [questionTimeLeft, setQuestionTimeLeft] = useState<number>(15);

  // Reset batch when modal opens
  useEffect(() => {
    if (isOpen) {
      setBatchStep(0);
      setBatchEarnedShells(0);
      setBatchEarnedFlak(0);
      setBatchCorrectCount(0);
      setSelectedOption(null);
      setIsAnswered(false);
      setIsCorrect(false);
      setIsBatchFinished(false);
      setQuestionTimeLeft(15);
      setPenaltyTimeLeft(PENALTY_SECONDS);
    }
  }, [isOpen]);

  const currentQ: QuizQuestion = QUIZ_QUESTIONS[(globalQuestionIndex + batchStep) % QUIZ_QUESTIONS.length];

  // 1. 15-second response countdown timer
  useEffect(() => {
    if (!isOpen || isAnswered || isBatchFinished) return;
    setQuestionTimeLeft(15);

    const timer = setInterval(() => {
      setQuestionTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Hết giờ coi như trả lời sai -> Bắt đầu phạt 5s đọc tư liệu
          handleTimeOut();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, isAnswered, batchStep, isBatchFinished]);

  // 2. Phạt 5 giây đọc tư liệu khi trả lời sai (Tự động đếm lùi 5s -> chuyển câu tiếp theo)
  useEffect(() => {
    if (!isAnswered || isCorrect || isBatchFinished) return;

    setPenaltyTimeLeft(PENALTY_SECONDS);
    const penaltyTimer = setInterval(() => {
      setPenaltyTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(penaltyTimer);
          advanceToNextInBatch();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(penaltyTimer);
  }, [isAnswered, isCorrect, isBatchFinished, batchStep]);

  // Xử lý khi hết 15s mà chưa chọn
  const handleTimeOut = () => {
    setIsAnswered(true);
    setIsCorrect(false);
    setSelectedOption(-1);
    sound.playQuizWrong();
  };

  // Chọn đáp án
  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);

    const correct = idx === currentQ.correctAnswer;
    setIsCorrect(correct);

    if (correct) {
      sound.playQuizSuccess();
      const shellsGained = currentQ.ammoReward.shells37mm;
      const flakGained = currentQ.ammoReward.flakBonus;

      setBatchEarnedShells((prev) => prev + shellsGained);
      setBatchEarnedFlak((prev) => prev + flakGained);
      setBatchCorrectCount((prev) => prev + 1);

      // Trả lời ĐÚNG -> Tự động chuyển câu tiếp theo sau 0.8s
      setTimeout(() => {
        advanceToNextInBatch();
      }, 800);
    } else {
      // Trả lời SAI -> Phát âm thanh sai, timer 5s phạt tự động chạy ở useEffect
      sound.playQuizWrong();
    }
  };

  // Tự động chuyển câu hoặc kết thúc đợt 5 câu
  const advanceToNextInBatch = () => {
    if (batchStep + 1 >= BATCH_SIZE) {
      // ĐÃ XONG 5 CÂU CỦA ĐỢT NÀY!
      finishBatch();
    } else {
      // Chuyển sang câu tiếp theo trong đợt 5 câu
      setBatchStep((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setIsCorrect(false);
      setQuestionTimeLeft(15);
      setPenaltyTimeLeft(PENALTY_SECONDS);
    }
  };

  // Kết thúc đợt 5 câu: Nạp đạn và tự động quay lại trận địa
  const finishBatch = () => {
    setIsBatchFinished(true);

    // Tính tổng đạn: ít nhất cấp 3 viên cơ bản để học sinh tiếp tục chiến đấu nếu trả lời sai nhiều
    const finalShells = Math.max(3, batchEarnedShells);
    const finalFlak = batchEarnedFlak;

    // Nạp đạn cho player
    onAddAmmo(finalShells, finalFlak);

    // Tự động đóng màn hình câu hỏi sau 1.8s để học sinh thấy thông báo nạp đạn thành công
    setTimeout(() => {
      setGlobalQuestionIndex((prev) => (prev + BATCH_SIZE) % QUIZ_QUESTIONS.length);
      onCloseToBattle();
    }, 1800);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          className="w-full max-w-2xl bg-[#1c2419] border-2 border-[#d4af37] rounded-3xl shadow-2xl overflow-hidden text-[#f7f6f2] flex flex-col max-h-[92vh]"
        >
          {/* Header Bar */}
          <div className="bg-[#2d3b27] px-5 py-3.5 flex items-center justify-between border-b border-[#44563a] shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#8b0000] text-[#ffd700] flex items-center justify-center font-bold shadow-md shadow-red-950/60 shrink-0">
                <HelpCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-military font-bold text-xs sm:text-sm text-white">
                  TRẠM NẠP ĐẠN CAO XẠ (ĐỢT 5 CÂU HỎI)
                </h3>
                <p className="text-[11px] text-gray-300">
                  Trả lời đúng để nạp đạn · Trả lời sai cần đọc lại tư liệu lịch sử
                </p>
              </div>
            </div>

            {/* Batch Progress (1/5 -> 5/5) */}
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-[#8b0000] border border-[#ffd700]/50 rounded-xl text-xs font-military text-[#ffd700] font-black shadow-sm">
                CÂU {batchStep + 1} / {BATCH_SIZE}
              </span>
            </div>
          </div>

          {/* Question Countdown Timer Bar (Khi chưa trả lời) */}
          {!isAnswered && !isBatchFinished && (
            <div className="w-full bg-black/40 h-1.5 shrink-0 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-emerald-500 via-amber-500 to-red-500"
                initial={{ width: '100%' }}
                animate={{ width: `${(questionTimeLeft / 15) * 100}%` }}
                transition={{ duration: 1, ease: 'linear' }}
              />
            </div>
          )}

          {/* ═══ MÀN HÌNH HOÀN THÀNH 5 CÂU (TỰ ĐỘNG CHUYỂN VỀ GAME) ═══ */}
          {isBatchFinished ? (
            <div className="p-8 text-center space-y-5 my-auto">
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-emerald-600 to-emerald-800 text-white flex items-center justify-center mx-auto shadow-xl animate-bounce">
                <Sparkles className="w-9 h-9 text-[#ffd700]" />
              </div>

              <div className="space-y-1.5">
                <span className="text-xs font-military font-bold tracking-widest text-emerald-400 uppercase">
                  ★ HOÀN THÀNH ĐỢT NẠP ĐẠN 5 CÂU ★
                </span>
                <h2 className="text-2xl sm:text-3xl font-black font-military text-white">
                  ĐÃ CẤP {Math.max(3, batchEarnedShells)} VIÊN ĐẠN PHÁO 37MM!
                </h2>
                <p className="text-xs text-gray-300 font-military">
                  Đúng {batchCorrectCount} / {BATCH_SIZE} câu hỏi · Đang tự động quay trở lại trận địa bắn...
                </p>
              </div>

              <div className="inline-flex items-center gap-2 px-4 py-2 bg-black/50 border border-emerald-500/40 rounded-2xl text-xs font-military text-yellow-300">
                <Crosshair className="w-4 h-4 text-emerald-400 animate-spin" />
                <span>Nòng pháo 37mm đã sẵn sàng khai hỏa!</span>
              </div>
            </div>
          ) : (
            /* ═══ NỘI DUNG CÂU HỎI VÀ ĐÁP ÁN ═══ */
            <div className="p-5 sm:p-7 space-y-5 overflow-y-auto flex-1 custom-scrollbar">
              {/* Question Text */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-military text-[#d4af37]">
                  <span className="font-bold">TIẾN TRÌNH: CÂU {batchStep + 1} / {BATCH_SIZE}</span>
                  {!isAnswered && (
                    <span className="flex items-center gap-1 font-mono font-bold text-yellow-400">
                      <Timer className="w-3.5 h-3.5" /> Còn {questionTimeLeft}s
                    </span>
                  )}
                </div>
                <h2 className="text-base sm:text-lg font-bold font-military text-white leading-snug">
                  {currentQ.question}
                </h2>
              </div>

              {/* Options Grid */}
              <div className="grid grid-cols-1 gap-2.5">
                {currentQ.options.map((opt, idx) => {
                  const style = OPTION_STYLES[idx % OPTION_STYLES.length];
                  let cardClass = `${style.bg} ${style.border} ${style.hover}`;

                  if (isAnswered) {
                    if (idx === currentQ.correctAnswer) {
                      cardClass = 'bg-emerald-950/90 border-emerald-400 text-emerald-100 ring-2 ring-emerald-400 shadow-lg';
                    } else if (selectedOption === idx) {
                      cardClass = 'bg-red-950/80 border-red-500 text-red-200 ring-2 ring-red-500';
                    } else {
                      cardClass = 'bg-black/20 border-white/5 opacity-40 text-gray-500';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(idx)}
                      disabled={isAnswered}
                      className={`w-full p-3.5 rounded-2xl border text-left font-military text-xs sm:text-sm transition-all flex items-center justify-between gap-3 cursor-pointer ${cardClass}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-7 h-7 rounded-xl ${style.badge} flex items-center justify-center font-bold text-xs shrink-0 shadow-md`}>
                          {style.letter}
                        </span>
                        <span className="font-medium text-white">{opt}</span>
                      </div>

                      {isAnswered && idx === currentQ.correctAnswer && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                      )}
                      {isAnswered && selectedOption === idx && idx !== currentQ.correctAnswer && (
                        <XCircle className="w-5 h-5 text-red-400 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* 🛑 PHẠT ĐỌC TƯ LIỆU KHI TRẢ LỜI SAI (5s COUNTDOWN TỰ ĐỘNG CHUYỂN CÂU) */}
              {isAnswered && !isCorrect && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-red-950/70 border-2 border-red-500/60 rounded-2xl space-y-2 text-xs font-military shadow-lg"
                >
                  <div className="flex items-center justify-between font-bold text-red-200">
                    <span className="flex items-center gap-1.5 text-red-300">
                      <ShieldAlert className="w-4 h-4 text-red-400" />
                      CHƯA CHÍNH XÁC! HÃY ĐỌC VÀ GHI NHỚ LỊCH SỬ
                    </span>
                    <span className="px-2.5 py-0.5 bg-red-900/80 border border-red-400 text-yellow-300 rounded-full font-mono text-xs flex items-center gap-1 font-black animate-pulse">
                      <Clock className="w-3 h-3" /> Chuyển câu sau: {penaltyTimeLeft}s
                    </span>
                  </div>

                  <p className="text-gray-200 text-xs leading-relaxed italic border-t border-red-500/30 pt-2">
                    📖 {currentQ.historicalNote}
                  </p>
                </motion.div>
              )}

              {/* ✨ THÔNG BÁO KHI TRẢ LỜI ĐÚNG */}
              {isAnswered && isCorrect && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3.5 bg-emerald-950/70 border border-emerald-500/60 rounded-2xl text-xs font-military text-emerald-200 flex items-center justify-between"
                >
                  <span className="flex items-center gap-2 font-bold text-yellow-300">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    CHÍNH XÁC! +{currentQ.ammoReward.shells37mm} ĐẠN 37MM
                  </span>
                  <span className="text-[11px] text-emerald-300 font-bold">
                    Đang chuyển câu tiếp theo...
                  </span>
                </motion.div>
              )}
            </div>
          )}

          {/* Footer Stats Summary (Đã bỏ hoàn toàn nút bấm chuyển câu thủ công) */}
          <div className="p-3.5 bg-black/50 border-t border-[#44563a] flex items-center justify-between text-xs font-military shrink-0">
            <span className="text-gray-400">
              Đạn tích lũy trong đợt này: <strong className="text-[#ffd700] font-mono font-bold text-sm">+{batchEarnedShells} 37mm</strong>
            </span>
            <span className="text-gray-400">
              Đúng: <strong className="text-emerald-400 font-mono font-bold">{batchCorrectCount}/{batchStep + (isAnswered ? 1 : 0)}</strong>
            </span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
