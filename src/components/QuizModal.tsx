import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { QUIZ_QUESTIONS, QuizQuestion } from '../data/quizData';
import { sound } from '../audio/SoundEngine';
import {
  HelpCircle,
  Zap,
  CheckCircle2,
  XCircle,
  Crosshair,
  ArrowRight,
  Sparkles,
  BookOpen,
  Timer,
  Award
} from 'lucide-react';

interface QuizModalProps {
  isOpen: boolean;
  onAddAmmo: (shells37mm: number, flakBonus: number) => void;
  onCloseToBattle: () => void;
  currentAmmo: number;
}

const OPTION_STYLES = [
  {
    letter: 'A',
    bg: 'bg-sky-500/15',
    border: 'border-sky-500/40',
    badge: 'bg-sky-600 text-white',
    hover: 'hover:bg-sky-500/25 hover:border-sky-400',
    activeRing: 'ring-sky-500'
  },
  {
    letter: 'B',
    bg: 'bg-emerald-500/15',
    border: 'border-emerald-500/40',
    badge: 'bg-emerald-600 text-white',
    hover: 'hover:bg-emerald-500/25 hover:border-emerald-400',
    activeRing: 'ring-emerald-500'
  },
  {
    letter: 'C',
    bg: 'bg-amber-500/15',
    border: 'border-amber-500/40',
    badge: 'bg-amber-600 text-white',
    hover: 'hover:bg-amber-500/25 hover:border-amber-400',
    activeRing: 'ring-amber-500'
  },
  {
    letter: 'D',
    bg: 'bg-purple-500/15',
    border: 'border-purple-500/40',
    badge: 'bg-purple-600 text-white',
    hover: 'hover:bg-purple-500/25 hover:border-purple-400',
    activeRing: 'ring-purple-500'
  }
];

export const QuizModal: React.FC<QuizModalProps> = ({
  isOpen,
  onAddAmmo,
  onCloseToBattle,
  currentAmmo
}) => {
  const [questionIndex, setQuestionIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [comboStreak, setComboStreak] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(15);

  // 15-second response countdown timer
  useEffect(() => {
    if (!isOpen || isAnswered) return;
    setTimeLeft(15);

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Timeout counts as incorrect
          setIsAnswered(true);
          setIsCorrect(false);
          sound.playQuizWrong();
          setComboStreak(0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, isAnswered, questionIndex]);

  if (!isOpen) return null;

  const currentQ: QuizQuestion = QUIZ_QUESTIONS[questionIndex % QUIZ_QUESTIONS.length];

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);

    const correct = idx === currentQ.correctAnswer;
    setIsCorrect(correct);

    if (correct) {
      sound.playQuizSuccess();
      const streakBonus = comboStreak >= 2 ? 1 : 0;
      setComboStreak((prev) => prev + 1);
      onAddAmmo(currentQ.ammoReward.shells37mm, currentQ.ammoReward.flakBonus + streakBonus);
    } else {
      sound.playQuizWrong();
      setComboStreak(0);
    }
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setIsAnswered(false);
    setIsCorrect(false);
    setQuestionIndex((prev) => (prev + 1) % QUIZ_QUESTIONS.length);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          className="w-full max-w-2xl bg-[#1c2419] border-2 border-[#d4af37] rounded-3xl shadow-2xl overflow-hidden text-[#f7f6f2] flex flex-col max-h-[90vh]"
        >
          {/* Header Bar */}
          <div className="bg-[#2d3b27] px-6 py-4 flex items-center justify-between border-b border-[#44563a] shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#8b0000] text-[#ffd700] flex items-center justify-center font-bold shadow-md shadow-red-950/60">
                <HelpCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-military font-bold text-sm md:text-base text-white">
                  TRẠM NẠP ĐẠN CAO XẠ · KHẢO SÁT LỊCH SỬ
                </h3>
                <p className="text-xs text-gray-300">
                  Trả lời chính xác để nhận đạn pháo 37mm & đạn nổ phân mảnh Flak
                </p>
              </div>
            </div>

            {/* Streak & Ammo Counter */}
            <div className="flex items-center gap-2">
              {comboStreak >= 2 && (
                <span className="px-2.5 py-1 bg-amber-500/20 border border-amber-500/40 rounded-xl text-amber-300 font-military text-xs flex items-center gap-1 font-bold animate-pulse">
                  <Sparkles className="w-3.5 h-3.5 text-yellow-400" /> COMBO x{comboStreak}
                </span>
              )}
              <span className="px-3 py-1 bg-black/50 border border-white/15 rounded-xl text-xs font-military text-yellow-400 font-bold">
                ĐẠN CỦA BẠN: {currentAmmo}
              </span>
            </div>
          </div>

          {/* Countdown Timer Bar */}
          {!isAnswered && (
            <div className="w-full bg-black/40 h-1.5 shrink-0 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-emerald-500 via-amber-500 to-red-500"
                initial={{ width: '100%' }}
                animate={{ width: `${(timeLeft / 15) * 100}%` }}
                transition={{ duration: 1, ease: 'linear' }}
              />
            </div>
          )}

          {/* Question & Options Content */}
          <div className="p-6 md:p-8 space-y-6 overflow-y-auto flex-1 custom-scrollbar">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-military text-[#d4af37]">
                <span>CÂU HỎI {currentQ.id} / {QUIZ_QUESTIONS.length}</span>
                <span className="flex items-center gap-1">
                  <Timer className="w-3.5 h-3.5" /> Còn {timeLeft}s
                </span>
              </div>
              <h2 className="text-lg md:text-xl font-bold font-military text-white leading-snug">
                {currentQ.question}
              </h2>
            </div>

            {/* Options Grid (Kahoot Theme Styles) */}
            <div className="grid grid-cols-1 gap-3">
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
                    className={`w-full p-4 rounded-2xl border text-left font-military text-xs md:text-sm transition-all flex items-center justify-between gap-3 cursor-pointer ${cardClass}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-8 h-8 rounded-xl ${style.badge} flex items-center justify-center font-bold text-sm shrink-0 shadow-md`}>
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

            {/* Historical Fact Explanation Reveal */}
            {isAnswered && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-2xl border space-y-2 text-xs font-military ${
                  isCorrect
                    ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-200'
                    : 'bg-red-950/60 border-red-500/50 text-red-200'
                }`}
              >
                <div className="flex items-center justify-between font-bold">
                  <span className="flex items-center gap-2">
                    {isCorrect ? (
                      <>
                        <Sparkles className="w-4 h-4 text-emerald-400" />
                        XUẤT SẮC! +{currentQ.ammoReward.shells37mm} ĐẠN 37MM {currentQ.ammoReward.flakBonus > 0 && '+ 1 FLAK'}
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4 text-red-400" />
                        CHƯA CHÍNH XÁC! HÃY GHI NHỚ KIẾN THỨC NÀY
                      </>
                    )}
                  </span>
                </div>
                <p className="text-gray-300 text-[11px] leading-relaxed italic border-t border-white/10 pt-2">
                  📖 {currentQ.historicalNote}
                </p>
              </motion.div>
            )}
          </div>

          {/* Footer Navigation */}
          <div className="p-4 bg-black/40 border-t border-[#44563a] flex items-center justify-between shrink-0">
            <button
              onClick={onCloseToBattle}
              className="px-5 py-2.5 rounded-xl bg-black/50 hover:bg-black/70 border border-white/20 text-gray-300 font-military text-xs font-bold transition-all cursor-pointer flex items-center gap-2"
            >
              <Crosshair className="w-4 h-4 text-emerald-400" /> TRỞ LẠI TRẬN ĐỊA BẮN
            </button>

            {isAnswered && (
              <button
                onClick={handleNextQuestion}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#8b0000] to-[#b22222] hover:from-[#a00000] hover:to-[#c41e3a] text-white font-military font-bold text-xs shadow-lg shadow-red-950/60 flex items-center gap-2 cursor-pointer hover:scale-105 transition-all"
              >
                CÂU HỎI TIẾP THEO <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
