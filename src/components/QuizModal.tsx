import React, { useState } from 'react';
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
  BookOpen
} from 'lucide-react';

interface QuizModalProps {
  isOpen: boolean;
  onAddAmmo: (shells37mm: number, flakBonus: number) => void;
  onCloseToBattle: () => void;
  currentAmmo: number;
}

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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          className="w-full max-w-2xl bg-[#1a2318] border-2 border-[#d4af37]/60 rounded-3xl shadow-2xl overflow-hidden text-[#f7f6f2]"
        >
          {/* Header Bar */}
          <div className="bg-[#2d3b27] px-6 py-4 flex items-center justify-between border-b border-[#44563a]">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#8b0000] text-[#ffd700] flex items-center justify-center font-bold">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-military font-bold text-sm md:text-base text-white">
                  TRẠM NẠP ĐẠN CAO XẠ · KHẢO SÁT LỊCH SỬ
                </h3>
                <p className="text-xs text-gray-300">
                  Trả lời đúng để nhận đạn pháo 37mm & đạn nổ Flak
                </p>
              </div>
            </div>

            {/* Streak & Current Ammo Pill */}
            <div className="flex items-center gap-2">
              {comboStreak >= 2 && (
                <span className="px-2.5 py-1 bg-amber-500/20 border border-amber-500/40 rounded-lg text-amber-300 font-military text-xs flex items-center gap-1 font-bold animate-pulse">
                  <Sparkles className="w-3.5 h-3.5" /> COMBO x{comboStreak}
                </span>
              )}
              <span className="px-3 py-1 bg-black/40 border border-white/15 rounded-lg text-xs font-military text-yellow-400">
                ĐẠN HIỆN CÓ: <strong>{currentAmmo}</strong>
              </span>
            </div>
          </div>

          {/* Question & Options */}
          <div className="p-6 md:p-8 space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-military text-[#d4af37]">
                <span>CÂU HỎI {currentQ.id} / {QUIZ_QUESTIONS.length}</span>
                <span>THƯỞNG: +{currentQ.ammoReward.shells37mm} ĐẠN 37MM {currentQ.ammoReward.flakBonus > 0 && '+ 1 FLAK'}</span>
              </div>
              <h2 className="text-lg md:text-xl font-bold font-military text-white leading-snug">
                {currentQ.question}
              </h2>
            </div>

            {/* Options List */}
            <div className="grid grid-cols-1 gap-3">
              {currentQ.options.map((opt, idx) => {
                let btnStyle = "bg-black/30 border-white/10 hover:border-[#d4af37]/60 hover:bg-black/50 text-gray-200";

                if (isAnswered) {
                  if (idx === currentQ.correctAnswer) {
                    btnStyle = "bg-emerald-950/80 border-emerald-500 text-emerald-200 shadow-md shadow-emerald-950/50";
                  } else if (selectedOption === idx) {
                    btnStyle = "bg-red-950/80 border-red-500 text-red-200";
                  } else {
                    btnStyle = "bg-black/20 border-white/5 opacity-50 text-gray-400";
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    disabled={isAnswered}
                    className={`w-full p-4 rounded-2xl border text-left font-military text-xs md:text-sm transition-all flex items-center justify-between gap-3 ${btnStyle}`}
                  >
                    <span>{opt}</span>
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

            {/* Answer Explanation & Historical Note */}
            {isAnswered && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-2xl border text-xs md:text-sm space-y-1.5 ${
                  isCorrect
                    ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                    : 'bg-red-950/40 border-red-500/40 text-red-200'
                }`}
              >
                <div className="flex items-center gap-2 font-bold font-military">
                  <BookOpen className="w-4 h-4" />
                  {isCorrect ? 'CHÍNH XÁC! ĐÃ NẠP ĐẠN THÀNH CÔNG' : 'CHƯA CHÍNH XÁC'}
                </div>
                <p className="text-gray-300 text-xs leading-relaxed italic">
                  {currentQ.historicalNote}
                </p>
              </motion.div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="p-6 bg-black/40 border-t border-[#44563a] flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              onClick={handleNextQuestion}
              disabled={!isAnswered}
              className={`w-full sm:w-auto px-5 py-3 rounded-xl font-military text-xs md:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                isAnswered
                  ? 'bg-[#44563a] hover:bg-[#556b2f] text-white cursor-pointer'
                  : 'bg-gray-800 text-gray-500 border border-gray-700 cursor-not-allowed'
              }`}
            >
              CÂU TIẾP THEO <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onCloseToBattle}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-[#8b0000] to-[#b22222] hover:from-[#a00000] hover:to-[#c41e3a] text-white font-military font-bold text-xs md:text-sm flex items-center justify-center gap-2 shadow-lg shadow-red-950/40 transition-all cursor-pointer"
            >
              <Crosshair className="w-4 h-4 text-[#ffd700]" />
              VÀO TRẬN ĐỊA BẮN PHÁO
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
