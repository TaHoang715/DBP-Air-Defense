import React, { useState, useEffect } from 'react';
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
  ShieldAlert,
  Flame
} from 'lucide-react';

interface QuizModalProps {
  isOpen: boolean;
  questionOffset: number; // Offset vị trí trong 50 câu (xoay vòng sau mỗi lần nạp 5 câu)
  onAddAmmo: (shells37mm: number, flakBonus: number) => void;
  onCloseToBattle: () => void;
  currentAmmo: number;
}

const BATCH_SIZE = 5; // Cố định 5 câu hỏi mỗi đợt nạp đạn
const PENALTY_SECONDS = 5; // Thời gian phạt đọc lại kiến thức khi trả lời sai (5s)

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
  questionOffset = 0,
  onAddAmmo,
  onCloseToBattle,
  currentAmmo
}) => {
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

  // Rolling Index across 50 questions
  const totalQuestions = QUIZ_QUESTIONS.length;
  const currentGlobalIndex = (questionOffset + batchStep) % totalQuestions;
  const currentQ: QuizQuestion = QUIZ_QUESTIONS[currentGlobalIndex];

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
                <h3 className="text-base sm:text-lg font-black font-military text-[#ffd700] tracking-wide">
                  TRẠM NẠP ĐẠN PHÁO PHÒNG KHÔNG
                </h3>
                <div className="flex items-center gap-2 text-xs text-gray-300 font-mono">
                  <span>Kho tri thức: <strong className="text-yellow-400">Câu {currentGlobalIndex + 1}/{totalQuestions}</strong></span>
                  <span>•</span>
                  <span>Đợt này: <strong className="text-emerald-400">{batchStep + 1}/{BATCH_SIZE} câu</strong></span>
                </div>
              </div>
            </div>

            {/* Current Ammo Indicator & Question Timer */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/40 border border-yellow-500/30 text-xs font-mono text-yellow-300">
                <Zap className="w-4 h-4 text-yellow-400" />
                <span>Đạn hiện có: <strong>{currentAmmo}</strong></span>
              </div>

              {/* 15s Timer */}
              {!isAnswered && !isBatchFinished && (
                <div className={`flex items-center gap-1 px-3 py-1 rounded-xl border font-mono text-xs font-bold ${
                  questionTimeLeft <= 5
                    ? 'bg-red-900/60 border-red-500 text-red-300 animate-pulse'
                    : 'bg-black/50 border-[#d4af37]/40 text-yellow-400'
                }`}>
                  <Timer className="w-3.5 h-3.5" />
                  <span>{questionTimeLeft}s</span>
                </div>
              )}
            </div>
          </div>

          {/* 5-Step Batch Progress Track */}
          <div className="bg-black/60 px-5 py-2 border-b border-[#44563a]/60 flex items-center justify-between text-xs font-military">
            <div className="flex items-center gap-1.5">
              {[...Array(BATCH_SIZE)].map((_, i) => (
                <div
                  key={i}
                  className={`w-8 h-2 rounded-full transition-all duration-300 ${
                    i < batchStep
                      ? 'bg-emerald-500 shadow-sm shadow-emerald-500/50'
                      : i === batchStep
                      ? 'bg-yellow-400 shadow-sm shadow-yellow-400/80 scale-105'
                      : 'bg-gray-700/60'
                  }`}
                />
              ))}
            </div>
            <div className="text-gray-300 text-[11px] font-mono">
              Đúng: <strong className="text-emerald-400">{batchCorrectCount}/{BATCH_SIZE}</strong> | Tích lũy: <strong className="text-yellow-400">+{batchEarnedShells} đạn</strong>
            </div>
          </div>

          {/* Body Content */}
          <div className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1 custom-scrollbar">
            {isBatchFinished ? (
              // ═══ MÀN HÌNH NẠP ĐẠN THÀNH CÔNG SAU 5 CÂU ═══
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-8 text-center space-y-4"
              >
                <div className="w-16 h-16 mx-auto rounded-3xl bg-emerald-600/30 border-2 border-emerald-400 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-950/60">
                  <CheckCircle2 className="w-10 h-10 animate-bounce" />
                </div>
                <div>
                  <h4 className="text-xl sm:text-2xl font-black font-military text-white">
                    HOÀN THÀNH ĐỢT NẠP ĐẠN!
                  </h4>
                  <p className="text-sm text-gray-300 font-military mt-1">
                    Đã trả lời đúng <strong className="text-emerald-400">{batchCorrectCount}/{BATCH_SIZE}</strong> câu hỏi lịch sử.
                  </p>
                </div>

                <div className="inline-flex items-center gap-4 p-4 rounded-2xl bg-black/50 border border-yellow-500/40 text-yellow-300 font-military">
                  <div>
                    <span className="text-xs text-gray-400 block">ĐẠN PHÁO 37MM</span>
                    <strong className="text-2xl font-mono text-emerald-400">+{Math.max(3, batchEarnedShells)}</strong>
                  </div>
                  {batchEarnedFlak > 0 && (
                    <>
                      <div className="w-[1px] h-8 bg-white/20" />
                      <div>
                        <span className="text-xs text-gray-400 block">ĐẠN NỔ FLAK</span>
                        <strong className="text-2xl font-mono text-purple-400">+{batchEarnedFlak}</strong>
                      </div>
                    </>
                  )}
                </div>

                <p className="text-xs text-emerald-300 font-military animate-pulse">
                  ⚡ Đang tự động chuyển về trận địa phòng không...
                </p>
              </motion.div>
            ) : (
              // ═══ CÂU HỎI & CÁC LỰA CHỌN ═══
              <>
                {/* Question Box */}
                <div className="bg-black/40 p-4 sm:p-5 rounded-2xl border border-[#44563a] space-y-2">
                  <div className="flex items-center justify-between text-xs font-military text-gray-400">
                    <span className="px-2 py-0.5 rounded bg-black/60 border border-white/10 text-yellow-400 font-mono font-bold">
                      CÂU {currentGlobalIndex + 1} TRÊN 50
                    </span>
                    <span className="text-emerald-400 font-bold">
                      Phần thưởng: +{currentQ.ammoReward.shells37mm} đạn 37mm
                      {currentQ.ammoReward.flakBonus > 0 && ` +${currentQ.ammoReward.flakBonus} Flak`}
                    </span>
                  </div>
                  <h4 className="text-base sm:text-lg font-bold font-military text-white leading-snug">
                    {currentQ.question}
                  </h4>
                </div>

                {/* 4 Options Grid */}
                <div className="grid grid-cols-1 gap-2.5">
                  {currentQ.options.map((opt, idx) => {
                    const style = OPTION_STYLES[idx % OPTION_STYLES.length];
                    const isThisSelected = selectedOption === idx;
                    const isThisCorrect = idx === currentQ.correctAnswer;

                    let btnStyle = `${style.bg} ${style.border} ${style.hover} text-gray-200`;
                    let badgeStyle = style.badge;

                    if (isAnswered) {
                      if (isThisCorrect) {
                        btnStyle = 'bg-emerald-600/30 border-emerald-400 text-white ring-2 ring-emerald-400 shadow-lg shadow-emerald-950/60';
                        badgeStyle = 'bg-emerald-500 text-white';
                      } else if (isThisSelected) {
                        btnStyle = 'bg-red-600/30 border-red-500 text-red-200 ring-2 ring-red-500 shadow-lg shadow-red-950/60';
                        badgeStyle = 'bg-red-500 text-white';
                      } else {
                        btnStyle = 'bg-black/30 border-white/5 text-gray-500 opacity-40';
                        badgeStyle = 'bg-gray-700 text-gray-400';
                      }
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => handleSelectOption(idx)}
                        disabled={isAnswered}
                        className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between gap-3 transition-all duration-200 cursor-pointer ${btnStyle}`}
                      >
                        <div className="flex items-center gap-3">
                          <span className={`w-7 h-7 rounded-xl font-bold font-mono text-xs flex items-center justify-center shrink-0 ${badgeStyle}`}>
                            {style.letter}
                          </span>
                          <span className="font-military text-xs sm:text-sm font-semibold">
                            {opt}
                          </span>
                        </div>

                        {isAnswered && isThisCorrect && (
                          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 animate-bounce" />
                        )}
                        {isAnswered && isThisSelected && !isThisCorrect && (
                          <XCircle className="w-5 h-5 text-red-400 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Feedback / Educational Penalty Box */}
                {isAnswered && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-2xl border ${
                      isCorrect
                        ? 'bg-emerald-950/40 border-emerald-500/60 text-emerald-200'
                        : 'bg-red-950/50 border-red-500/70 text-red-200'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      {isCorrect ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                      ) : (
                        <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 mt-0.5 animate-pulse" />
                      )}
                      <div className="space-y-1 text-xs">
                        <div className="flex items-center justify-between gap-2">
                          <strong className={`font-military text-sm ${isCorrect ? 'text-emerald-300' : 'text-red-300'}`}>
                            {isCorrect ? 'CHÍNH XÁC! +ĐẠN PHÁO THÀNH CÔNG' : 'CHƯA CHÍNH XÁC · HÌNH PHẠT HỌC TẬP'}
                          </strong>
                          {!isCorrect && (
                            <span className="px-2 py-0.5 rounded-full bg-red-900/80 border border-red-400 text-yellow-300 font-mono font-bold text-[11px] animate-pulse">
                              Đợi {penaltyTimeLeft}s để đọc tư liệu...
                            </span>
                          )}
                        </div>

                        {/* Historical Explanation */}
                        <p className="text-gray-300 font-military text-xs leading-relaxed text-justify mt-1">
                          <strong className="text-yellow-400">Giải thích lịch sử: </strong>
                          {currentQ.historicalNote}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
