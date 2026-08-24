import React, { useState, useEffect, useRef } from 'react';
import { CanvasGame } from './game/CanvasGame';
import { Header } from './components/Header';
import { QuizModal } from './components/QuizModal';
import { PlaneDossierModal } from './components/PlaneDossierModal';
import { VictoryModal } from './components/VictoryModal';
import { LeaderboardModal } from './components/LeaderboardModal';
import { MultiplayerRoomModal } from './components/MultiplayerRoomModal';
import type { LeaderboardEntry } from './components/LeaderboardModal';
import type { HistoricalPlane } from './data/planesData';
import { sound } from './audio/SoundEngine';
import {
  Crosshair,
  Trophy,
  Users
} from 'lucide-react';

const INITIAL_TIME = 180; // 3 minutes battle session

const DEFAULT_LEADERBOARD: LeaderboardEntry[] = [
  {
    id: 'legend_1',
    name: 'Khẩu đội Anh hùng Tô Vĩnh Diện',
    score: 3850,
    planesDowned: 14,
    accuracy: 92,
    date: '13/03/1954',
    badge: 'Anh hùng LLVTND'
  },
  {
    id: 'legend_2',
    name: 'Tiểu đoàn Pháo cao xạ 383',
    score: 2920,
    planesDowned: 11,
    accuracy: 85,
    date: '15/03/1954',
    badge: 'Dũng sĩ Diệt Máy bay'
  },
  {
    id: 'legend_3',
    name: 'Đại đội 815 - Đồi Him Lam',
    score: 2150,
    planesDowned: 8,
    accuracy: 79,
    date: '17/03/1954',
    badge: 'Chiến sĩ Thi đua'
  }
];

export default function App() {
  // Game States
  const [gameState, setGameState] = useState<'MENU' | 'PLAYING' | 'DEBRIEF'>('MENU');
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [timeRemaining, setTimeRemaining] = useState<number>(INITIAL_TIME);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);

  // Ammunition & Combat Stats
  const [ammo37mm, setAmmo37mm] = useState<number>(10);
  const [ammoFlak, setAmmoFlak] = useState<number>(2);
  const [useFlak, setUseFlak] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [planesDownedCount, setPlanesDownedCount] = useState<number>(0);
  const [shotsFired, setShotsFired] = useState<number>(0);
  const [questionsAnswered, setQuestionsAnswered] = useState<number>(0);

  // Modals
  const [isQuizOpen, setIsQuizOpen] = useState<boolean>(false);
  const [activeDossierPlane, setActiveDossierPlane] = useState<HistoricalPlane | null>(null);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState<boolean>(false);
  const [isMultiplayerOpen, setIsMultiplayerOpen] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Persistent Leaderboard
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(() => {
    const saved = localStorage.getItem('dbp_leaderboard');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return DEFAULT_LEADERBOARD;
      }
    }
    return DEFAULT_LEADERBOARD;
  });

  // Battle Countdown Timer
  useEffect(() => {
    if (gameState !== 'PLAYING' || isPaused || activeDossierPlane !== null || isQuizOpen) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setGameState('DEBRIEF');
          return 0;
        }
        return prev - 1;
      });

      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState, isPaused, activeDossierPlane, isQuizOpen]);

  // Start / Restart Battle
  const handleStartGame = () => {
    setScore(0);
    setPlanesDownedCount(0);
    setShotsFired(0);
    setQuestionsAnswered(0);
    setAmmo37mm(10);
    setAmmoFlak(2);
    setTimeRemaining(INITIAL_TIME);
    setElapsedSeconds(0);
    setGameState('PLAYING');
    setIsPaused(false);
    setActiveDossierPlane(null);
    setIsQuizOpen(false);
    sound.playAirRaidSiren();
  };

  // Consume Ammo Callback
  const handleConsumeAmmo = (flak: boolean): boolean => {
    if (flak) {
      if (ammoFlak <= 0) return false;
      setAmmoFlak((prev) => prev - 1);
    } else {
      if (ammo37mm <= 0) return false;
      setAmmo37mm((prev) => prev - 1);
    }
    setShotsFired((prev) => prev + 1);
    return true;
  };

  // Aircraft Downed Callback -> Triggers Phase 3 Mandatory Dossier!
  const handlePlaneDowned = (plane: HistoricalPlane) => {
    setPlanesDownedCount((prev) => prev + 1);
    setActiveDossierPlane(plane); // Pauses gameplay until 5-7s timer finishes
  };

  // Finished reading dossier (Countdown finished & user clicked continue)
  const handleFinishedReadingDossier = () => {
    setActiveDossierPlane(null);
  };

  // Add Ammo from Q&A Reload
  const handleAddAmmo = (shells37mm: number, flakBonus: number) => {
    setAmmo37mm((prev) => prev + shells37mm);
    setAmmoFlak((prev) => prev + flakBonus);
    setQuestionsAnswered((prev) => prev + 1);
  };

  // Save Score
  const handleSaveScore = (name: string) => {
    const accuracy = shotsFired > 0 ? Math.min(100, Math.round((planesDownedCount / shotsFired) * 100)) : 0;
    let badge = 'Chiến sĩ Điện Biên';
    if (planesDownedCount >= 10) badge = 'Anh hùng Pháo cao xạ';
    else if (planesDownedCount >= 5) badge = 'Dũng sĩ Diệt Máy bay';

    const newEntry: LeaderboardEntry = {
      id: Date.now().toString(),
      name,
      score,
      planesDowned: planesDownedCount,
      accuracy,
      date: new Date().toLocaleDateString('vi-VN'),
      badge
    };

    const updated = [newEntry, ...leaderboard].sort((a, b) => b.score - a.score).slice(0, 20);
    setLeaderboard(updated);
    localStorage.setItem('dbp_leaderboard', JSON.stringify(updated));
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#0d120c] font-sans select-none">
      {/* ═══ 1. MAIN BATTLE LOBBY / MENU ═══ */}
      {gameState === 'MENU' && (
        <div className="relative z-30 w-full h-full flex items-center justify-center p-6 camo-gradient trench-texture">
          {/* Decorative Spotlight & Radar Effect */}
          <div className="absolute inset-0 pointer-events-none opacity-20">
            <div className="w-[600px] h-[600px] rounded-full border border-green-500/30 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            <div className="w-[400px] h-[400px] rounded-full border border-green-500/20 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            <div className="w-full h-px bg-green-500/20 absolute top-1/2 left-0" />
            <div className="w-px h-full bg-green-500/20 absolute top-0 left-1/2" />
          </div>

          <div className="max-w-3xl w-full bg-[#1c2419]/95 border-2 border-[#d4af37] rounded-3xl shadow-2xl p-8 md:p-10 space-y-8 relative backdrop-blur-md">
            {/* National Star & Title */}
            <div className="text-center space-y-3">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#8b0000] border border-[#ffd700]/50 text-[#ffd700] font-military font-bold text-xs uppercase tracking-widest shadow-md shadow-red-950/60">
                ★ CHIẾN DỊCH ĐIỆN BIÊN PHỦ 1954 ★
              </div>
              <h1 className="text-3xl md:text-5xl font-black font-military text-white tracking-wide leading-tight">
                PHÁO CAO XẠ PHÒNG KHÔNG
              </h1>
              <p className="text-sm md:text-base text-gray-300 max-w-xl mx-auto leading-relaxed">
                Khống chế bầu trời Mường Thanh · Cắt đứt cầu hàng không tiếp tế của thực dân Pháp · Ghi danh sử vàng 56 ngày đêm lịch sử
              </p>
            </div>

            {/* 3 Core Gameplay Phases Briefing */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-military text-xs">
              <div className="p-4 bg-black/40 rounded-2xl border border-white/10 space-y-2">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold text-sm">
                  1
                </div>
                <h4 className="font-bold text-white text-sm">Giai đoạn 1: Nạp Đạn</h4>
                <p className="text-gray-400 leading-relaxed">
                  Trả lời câu hỏi trắc nghiệm lịch sử để nhận đạn pháo cao xạ 37mm và đạn Flak.
                </p>
              </div>

              <div className="p-4 bg-black/40 rounded-2xl border border-white/10 space-y-2">
                <div className="w-8 h-8 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center font-bold text-sm">
                  2
                </div>
                <h4 className="font-bold text-white text-sm">Giai đoạn 2: Bắn Máy Bay</h4>
                <p className="text-gray-400 leading-relaxed">
                  Ngắm bắn các máy bay Bearcat, Hellcat, C-47. <strong>Tốc độ máy bay tăng dần theo thời gian</strong>.
                </p>
              </div>

              <div className="p-4 bg-black/40 rounded-2xl border border-white/10 space-y-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm">
                  3
                </div>
                <h4 className="font-bold text-white text-sm">Giai đoạn 3: Đọc Hồ Sơ</h4>
                <p className="text-gray-400 leading-relaxed">
                  Khi hạ máy bay, bắt buộc đọc hồ sơ lịch sử trong <strong>5-7 giây (Không nút Skip)</strong> để ghi nhớ.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <button
                onClick={handleStartGame}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-[#8b0000] to-[#b22222] hover:from-[#a00000] hover:to-[#c41e3a] text-white font-military font-black text-base md:text-lg flex items-center justify-center gap-3 shadow-xl shadow-red-950/60 transition-all cursor-pointer hover:scale-105"
              >
                <Crosshair className="w-6 h-6 text-[#ffd700]" />
                XUẤT KÍCH VÀO TRẬN ĐỊA (3 PHÚT)
              </button>

              <button
                onClick={() => setIsMultiplayerOpen(true)}
                className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-[#2d3b27] hover:bg-[#3a4b32] border border-[#d4af37]/60 text-white font-military font-bold text-sm md:text-base flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Users className="w-5 h-5 text-emerald-400" />
                ĐẤU TRƯỜNG PHÒNG LỚP HỌC
              </button>

              <button
                onClick={() => setIsLeaderboardOpen(true)}
                className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-black/50 hover:bg-black/70 border border-[#d4af37]/60 text-[#ffd700] font-military font-bold text-sm md:text-base flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Trophy className="w-5 h-5" />
                BẢNG VÀNG DANH DỰ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══ 2. PLAYING / CANVAS VIEW ═══ */}
      {gameState === 'PLAYING' && (
        <div className="w-full h-full relative">
          <Header
            score={score}
            planesDownedCount={planesDownedCount}
            timeRemaining={timeRemaining}
            ammo37mm={ammo37mm}
            ammoFlak={ammoFlak}
            useFlak={useFlak}
            onToggleFlak={() => setUseFlak(!useFlak)}
            onOpenQuiz={() => setIsQuizOpen(true)}
            onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
            isMuted={isMuted}
            onToggleMute={() => setIsMuted(sound.toggleMute())}
          />

          {/* Canvas Engine */}
          <div className="w-full h-full pt-16">
            <CanvasGame
              isPlaying={gameState === 'PLAYING'}
              isPaused={isPaused || activeDossierPlane !== null || isQuizOpen}
              ammo37mm={ammo37mm}
              ammoFlak={ammoFlak}
              useFlak={useFlak}
              elapsedSeconds={elapsedSeconds}
              onConsumeAmmo={handleConsumeAmmo}
              onPlaneDowned={handlePlaneDowned}
              onScoreGained={(pts) => setScore((prev) => prev + pts)}
              onNeedAmmo={() => setIsQuizOpen(true)}
            />
          </div>
        </div>
      )}

      {/* ═══ 3. PHASE 1 QUIZ RELOAD MODAL ═══ */}
      <QuizModal
        isOpen={isQuizOpen}
        currentAmmo={ammo37mm + ammoFlak}
        onAddAmmo={handleAddAmmo}
        onCloseToBattle={() => setIsQuizOpen(false)}
      />

      {/* ═══ 4. PHASE 3 MANDATORY HISTORICAL DOSSIER MODAL (NO SKIP) ═══ */}
      <PlaneDossierModal
        plane={activeDossierPlane}
        countdownSeconds={6}
        onFinishedReading={handleFinishedReadingDossier}
      />

      {/* ═══ 5. DEBRIEF / VICTORY MODAL ═══ */}
      <VictoryModal
        isOpen={gameState === 'DEBRIEF'}
        score={score}
        planesDownedCount={planesDownedCount}
        shotsFired={shotsFired}
        questionsAnswered={questionsAnswered}
        onPlayAgain={handleStartGame}
        onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
        onSaveScore={handleSaveScore}
      />

      {/* ═══ 6. LEADERBOARD MODAL ═══ */}
      <LeaderboardModal
        isOpen={isLeaderboardOpen}
        onClose={() => setIsLeaderboardOpen(false)}
        entries={leaderboard}
      />

      {/* ═══ 7. MULTIPLAYER ROOM MODAL ═══ */}
      <MultiplayerRoomModal
        isOpen={isMultiplayerOpen}
        onClose={() => setIsMultiplayerOpen(false)}
        onStartBattle={(roomCode) => {
          handleStartGame();
        }}
      />
    </div>
  );
}
