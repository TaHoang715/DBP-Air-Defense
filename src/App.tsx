import React, { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../convex/_generated/api';
import type { Id } from '../convex/_generated/dataModel';
import { CanvasGame } from './game/CanvasGame';
import { Header } from './components/Header';
import { QuizModal } from './components/QuizModal';
import { PlaneDossierModal } from './components/PlaneDossierModal';
import { VictoryModal } from './components/VictoryModal';
import { LeaderboardModal } from './components/LeaderboardModal';
import { TeacherHostView } from './components/TeacherHostView';
import { RulesModal } from './components/RulesModal';
import type { LeaderboardEntry } from './components/LeaderboardModal';
import type { HistoricalPlane } from './data/planesData';
import { sound } from './audio/SoundEngine';
import {
  Crosshair,
  Trophy,
  Users,
  Crown,
  Play,
  Flame,
  Clock,
  Award,
  Lock,
  LogIn,
  Shield,
  Sparkles,
  ScrollText,
  AlertCircle,
  X
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
  // Game Mode: 'MENU' | 'TEACHER_HOST' | 'STUDENT_PLAYING' | 'SINGLE_PLAYING' | 'DEBRIEF'
  const [appMode, setAppMode] = useState<'MENU' | 'TEACHER_HOST' | 'STUDENT_PLAYING' | 'SINGLE_PLAYING' | 'DEBRIEF'>('MENU');
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
  const [isRulesOpen, setIsRulesOpen] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Admin / Host Login State
  const [showAdminLoginModal, setShowAdminLoginModal] = useState<boolean>(false);
  const [adminUsername, setAdminUsername] = useState<string>('');
  const [adminPassword, setAdminPassword] = useState<string>('');
  const [adminDuration, setAdminDuration] = useState<number>(180);
  const [adminError, setAdminError] = useState<string>('');

  // Student Join State
  const [studentPin, setStudentPin] = useState<string>('');
  const [studentName, setStudentName] = useState<string>('');
  const [studentError, setStudentError] = useState<string>('');

  // Multiplayer Tournament Room Info
  const [currentRoomId, setCurrentRoomId] = useState<Id<"rooms"> | null>(null);
  const [currentRoomCode, setCurrentRoomCode] = useState<string>('');
  const [currentStudentPlayerId, setCurrentStudentPlayerId] = useState<Id<"roomPlayers"> | null>(null);

  // Convex Mutations & Queries
  const createRoomMutation = useMutation(api.rooms.createRoom);
  const joinRoomMutation = useMutation(api.rooms.joinRoom);
  const startRoomBattleMutation = useMutation(api.rooms.startRoomBattle);
  const syncPlayerProgressMutation = useMutation(api.rooms.syncPlayerProgress);
  const finishRoomBattleMutation = useMutation(api.rooms.finishRoomBattle);
  const submitGlobalScoreMutation = useMutation(api.leaderboard.submitScore);

  // Realtime Live Room Subscription for Teacher
  const roomLiveState = useQuery(
    api.rooms.getRoomLiveState,
    currentRoomId ? { roomId: currentRoomId } : "skip"
  );

  // Persistent Local Leaderboard
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
    const isPlaying = appMode === 'SINGLE_PLAYING' || appMode === 'STUDENT_PLAYING';
    if (!isPlaying || isPaused || activeDossierPlane !== null || isQuizOpen) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setAppMode('DEBRIEF');
          return 0;
        }
        return prev - 1;
      });

      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [appMode, isPaused, activeDossierPlane, isQuizOpen]);

  // Sync Student Progress to Convex Backend in Realtime
  const syncToConvex = useCallback((recentEventText?: string, isDone = false) => {
    if (!currentStudentPlayerId) return;
    const accuracy = shotsFired > 0 ? Math.min(100, Math.round((planesDownedCount / shotsFired) * 100)) : 0;
    syncPlayerProgressMutation({
      playerId: currentStudentPlayerId,
      score,
      planesDowned: planesDownedCount,
      accuracy,
      shotsFired,
      questionsAnswered,
      isFinished: isDone,
      recentEvent: recentEventText,
    }).catch(() => {});
  }, [currentStudentPlayerId, score, planesDownedCount, shotsFired, questionsAnswered, syncPlayerProgressMutation]);

  useEffect(() => {
    if (appMode === 'STUDENT_PLAYING') {
      syncToConvex();
    }
  }, [score, planesDownedCount, shotsFired, questionsAnswered, appMode, syncToConvex]);

  // ═══ HANDLERS ═══

  // 1. Quản trò đăng nhập (Mật khẩu cố định Admin@123)
  const handleAdminLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError('');

    if (adminPassword !== 'Admin@123') {
      setAdminError('Mật khẩu quản trò không chính xác! Vui lòng thử lại.');
      return;
    }

    try {
      const hostDisplay = adminUsername.trim() || 'Giảng Viên';
      const res = await createRoomMutation({ hostName: hostDisplay, durationSeconds: Number(adminDuration) || 180 });
      setCurrentRoomId(res.roomId);
      setCurrentRoomCode(res.code);
      setShowAdminLoginModal(false);
      setAppMode('TEACHER_HOST');
    } catch (err: any) {
      setAdminError('Lỗi khi mở phòng thi đấu: ' + err.message);
    }
  };

  // 2. Người chơi nhập PIN và Tên
  const handleStudentJoinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStudentError('');

    if (!studentPin.trim()) {
      setStudentError('Vui lòng nhập Mã PIN phòng!');
      return;
    }
    if (!studentName.trim()) {
      setStudentError('Vui lòng nhập Họ & Tên của bạn!');
      return;
    }

    try {
      const res = await joinRoomMutation({ code: studentPin.trim(), playerName: studentName.trim() });
      setCurrentRoomId(res.roomId);
      setCurrentRoomCode(res.code);
      setCurrentStudentPlayerId(res.playerId);

      // Reset match stats
      setScore(0);
      setPlanesDownedCount(0);
      setShotsFired(0);
      setQuestionsAnswered(0);
      setAmmo37mm(10);
      setAmmoFlak(2);
      setTimeRemaining(res.room?.durationSeconds || INITIAL_TIME);
      setElapsedSeconds(0);
      setAppMode('STUDENT_PLAYING');
      setIsPaused(false);
      sound.playAirRaidSiren();
    } catch (err: any) {
      setStudentError(err.message || 'Không thể vào phòng thi đấu. Vui lòng kiểm tra lại mã PIN!');
    }
  };

  // 3. Chơi luyện tập đơn (Solo)
  const handleStartSoloGame = () => {
    setScore(0);
    setPlanesDownedCount(0);
    setShotsFired(0);
    setQuestionsAnswered(0);
    setAmmo37mm(10);
    setAmmoFlak(2);
    setTimeRemaining(INITIAL_TIME);
    setElapsedSeconds(0);
    setCurrentRoomId(null);
    setCurrentRoomCode('');
    setCurrentStudentPlayerId(null);
    setAppMode('SINGLE_PLAYING');
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

  // Aircraft Downed Callback -> Triggers Phase 3 Mandatory Dossier (Strict No-Skip)
  const handlePlaneDowned = (plane: HistoricalPlane) => {
    setPlanesDownedCount((prev) => prev + 1);
    setActiveDossierPlane(plane);
    if (appMode === 'STUDENT_PLAYING') {
      syncToConvex(`Bắn hạ ${plane.name} (+${plane.baseScore}đ)!`);
    }
  };

  // Finished reading dossier (6s countdown elapsed)
  const handleFinishedReadingDossier = () => {
    setActiveDossierPlane(null);
  };

  // Add Ammo from Q&A Reload
  const handleAddAmmo = (shells37mm: number, flakBonus: number) => {
    setAmmo37mm((prev) => prev + shells37mm);
    setAmmoFlak((prev) => prev + flakBonus);
    setQuestionsAnswered((prev) => prev + 1);
    if (appMode === 'STUDENT_PLAYING') {
      syncToConvex(`Đã nạp ${shells37mm} viên đạn pháo 37mm!`);
    }
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

    // Submit to Convex global leaderboard
    submitGlobalScoreMutation({
      name,
      score,
      planesDowned: planesDownedCount,
      accuracy,
      badge,
      shotsFired,
      questionsAnswered,
    }).catch(() => {});
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#0a0f08] text-[#f7f6f2] font-sans select-none">
      {/* ═══ 1. MÀN HÌNH MÁY CHIẾU CỦA QUẢN TRÒ / GIẢNG VIÊN ═══ */}
      {appMode === 'TEACHER_HOST' && currentRoomId && (
        <TeacherHostView
          roomCode={currentRoomCode}
          players={roomLiveState?.players || []}
          logs={roomLiveState?.logs || []}
          status={roomLiveState?.room?.status || 'waiting'}
          durationSeconds={roomLiveState?.room?.durationSeconds || 180}
          onStartGame={() => startRoomBattleMutation({ roomId: currentRoomId })}
          onFinishGame={() => finishRoomBattleMutation({ roomId: currentRoomId })}
          onExit={() => setAppMode('MENU')}
        />
      )}

      {/* ═══ 2. GIAO DIỆN TRANG CHỦ CHÍNH: 2 KHUNG RÕ RÀNG (QUẢN TRÒ & NGƯỜI CHƠI) ═══ */}
      {appMode === 'MENU' && (
        <div className="relative z-30 w-full h-full flex flex-col justify-between p-6 sm:p-10 camo-gradient trench-texture overflow-y-auto">
          {/* Top Title Banner & Rules Button */}
          <div className="text-center space-y-3 max-w-4xl mx-auto pt-2">
            <div className="flex items-center justify-center gap-3">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#8b0000] border border-[#ffd700]/60 text-[#ffd700] font-military font-bold text-xs uppercase tracking-widest shadow-lg shadow-red-950/60">
                ★ CHIẾN DỊCH ĐIỆN BIÊN PHỦ 1954 · ĐẤU TRƯỜNG PHÒNG KHÔNG ★
              </div>
              <button
                onClick={() => setIsRulesOpen(true)}
                className="px-3.5 py-1.5 rounded-full bg-[#2d3b27] hover:bg-[#3a4b32] border border-[#ffd700]/50 text-[#ffd700] font-military font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
              >
                <ScrollText className="w-3.5 h-3.5" /> LUẬT CHƠI
              </button>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-military text-white tracking-wide">
              PHÁO CAO XẠ 37MM BẮN MÁY BAY
            </h1>
            <p className="text-xs sm:text-sm text-gray-300 max-w-2xl mx-auto">
              Trò chơi giáo dục lịch sử tương tác 3 giai đoạn: Nạp đạn trắc nghiệm ➔ Bắn máy bay tăng tốc ➔ Đọc tư liệu lịch sử bắt buộc 6 giây.
            </p>
          </div>

          {/* ═══ 2 KHUNG LỰA CHỌN VAI TRÒ CHÍNH (QUẢN TRÒ & NGƯỜI CHƠI) ═══ */}
          <div className="max-w-5xl w-full mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 my-auto py-6">
            {/* 👑 KHUNG 1: QUẢN TRÒ (DÀNH CHO GIẢNG VIÊN / MÁY CHIẾU) */}
            <div className="bg-[#1c2419]/95 border-2 border-[#ffd700]/80 hover:border-[#ffd700] rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-2xl backdrop-blur-md relative overflow-hidden group transition-all">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#8b0000]/20 rounded-full blur-3xl -z-0 pointer-events-none" />

              <div className="space-y-4 relative z-10">
                <div className="flex items-center justify-between">
                  <div className="w-14 h-14 rounded-2xl bg-[#8b0000] border border-[#ffd700]/60 flex items-center justify-center text-[#ffd700] shadow-lg shadow-red-950/60">
                    <Crown className="w-8 h-8" />
                  </div>
                  <span className="px-3 py-1 bg-[#8b0000]/40 border border-[#ffd700]/40 text-[#ffd700] font-military font-bold text-xs rounded-full">
                    MÁY CHIẾU LỚP HỌC
                  </span>
                </div>

                <div>
                  <h2 className="text-2xl font-black font-military text-white">
                    1. QUẢN TRÒ
                  </h2>
                  <p className="text-xs text-gray-300 font-military mt-1 leading-relaxed">
                    Dành cho Giảng viên / Người điều hành lớp học. Tạo phòng thi đấu, phát mã PIN cho cả lớp, theo dõi Bảng điểm Live và Bục vinh danh Top 3.
                  </p>
                </div>
              </div>

              <div className="pt-8 relative z-10">
                <button
                  onClick={() => {
                    setAdminError('');
                    setAdminPassword('');
                    setShowAdminLoginModal(true);
                  }}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#8b0000] to-[#b22222] hover:from-[#a00000] hover:to-[#c41e3a] text-white font-military font-black text-sm md:text-base flex items-center justify-center gap-3 shadow-xl shadow-red-950/80 transition-all cursor-pointer hover:scale-[1.02]"
                >
                  <Lock className="w-5 h-5 text-[#ffd700]" />
                  ĐĂNG NHẬP QUẢN TRÒ & TẠO PHÒNG
                </button>
              </div>
            </div>

            {/* 🎯 KHUNG 2: NGƯỜI CHƠI (DÀNH CHO SINH VIÊN / PHÁO THỦ) */}
            <div className="bg-[#1c2419]/95 border-2 border-[#44563a] hover:border-emerald-500/80 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-2xl backdrop-blur-md relative overflow-hidden group transition-all">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -z-0 pointer-events-none" />

              <div className="space-y-4 relative z-10">
                <div className="flex items-center justify-between">
                  <div className="w-14 h-14 rounded-2xl bg-[#2d3b27] border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-lg">
                    <Crosshair className="w-8 h-8" />
                  </div>
                  <span className="px-3 py-1 bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 font-military font-bold text-xs rounded-full">
                    SINH VIÊN THAM CHIẾN
                  </span>
                </div>

                <div>
                  <h2 className="text-2xl font-black font-military text-white">
                    2. THAM GIA TRÒ CHƠI
                  </h2>
                  <p className="text-xs text-gray-300 font-military mt-1 leading-relaxed">
                    Dành cho Sinh viên tham gia trận đấu. Nhập mã PIN phòng hiển thị trên máy chiếu của Giảng viên để thi đấu cùng cả lớp.
                  </p>
                </div>

                {/* Form trực tiếp trên Card */}
                <form onSubmit={handleStudentJoinSubmit} className="space-y-3 pt-1">
                  <div>
                    <label className="block text-[11px] font-military text-gray-300 mb-1">
                      Mã PIN Phòng:
                    </label>
                    <input
                      type="text"
                      value={studentPin}
                      onChange={(e) => setStudentPin(e.target.value)}
                      placeholder="Nhập mã PIN"
                      maxLength={10}
                      className="w-full bg-black/60 border border-white/20 rounded-xl px-4 py-2.5 text-sm font-mono uppercase text-yellow-400 placeholder:text-gray-600 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-military text-gray-300 mb-1">
                      Họ & Tên Sinh Viên:
                    </label>
                    <input
                      type="text"
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      placeholder="Nhập họ và tên"
                      className="w-full bg-black/60 border border-white/20 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-military text-white placeholder:text-gray-600 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  {studentError && (
                    <div className="p-2.5 bg-red-950/60 border border-red-500/50 rounded-xl text-red-200 text-xs font-military flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                      <span>{studentError}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full py-3.5 mt-1 rounded-2xl bg-[#44563a] hover:bg-[#556b2f] text-white font-military font-black text-sm md:text-base flex items-center justify-center gap-3 shadow-xl shadow-green-950/50 transition-all cursor-pointer hover:scale-[1.02]"
                  >
                    <LogIn className="w-5 h-5 text-emerald-300" />
                    VÀO TRẬN ĐỊA THI ĐẤU
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Bottom Bar: Solo Practice & Leaderboard */}
          <div className="max-w-4xl w-full mx-auto flex flex-wrap items-center justify-center gap-4 text-xs font-military pt-2 pb-2">
            <button
              onClick={() => setIsRulesOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-black/40 hover:bg-black/60 border border-white/15 text-gray-300 hover:text-[#ffd700] flex items-center gap-2 transition-all cursor-pointer"
            >
              <ScrollText className="w-4 h-4 text-[#ffd700]" />
              Luật Chơi
            </button>

            <button
              onClick={handleStartSoloGame}
              className="px-5 py-2.5 rounded-xl bg-black/40 hover:bg-black/60 border border-white/15 text-gray-300 hover:text-white flex items-center gap-2 transition-all cursor-pointer"
            >
              <Play className="w-4 h-4 text-emerald-400" />
              Chơi Luyện Tập Cá Nhân (Solo)
            </button>

            <button
              onClick={() => setIsLeaderboardOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-black/40 hover:bg-black/60 border border-white/15 text-gray-300 hover:text-[#ffd700] flex items-center gap-2 transition-all cursor-pointer"
            >
              <Trophy className="w-4 h-4 text-[#ffd700]" />
              Bảng Vàng Danh Dự
            </button>
          </div>
        </div>
      )}

      {/* ═══ 3. MODAL ĐĂNG NHẬP QUẢN TRÒ ═══ */}
      {showAdminLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-md bg-[#1c2419] border-2 border-[#ffd700] rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 text-[#f7f6f2] relative">
            <button
              onClick={() => setShowAdminLoginModal(false)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-black/30 hover:bg-black/50 text-gray-300 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-2xl bg-[#8b0000] text-[#ffd700] flex items-center justify-center mx-auto shadow-lg shadow-red-950/60 font-bold">
                <Crown className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-black font-military text-white">
                XÁC THỰC QUẢN TRÒ
              </h3>
              <p className="text-xs text-gray-300">
                Đăng nhập để khởi tạo phòng thi đấu máy chiếu
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleAdminLoginSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-military text-gray-300">
                  Tên Quản Trò / Giảng Viên:
                </label>
                <input
                  type="text"
                  value={adminUsername}
                  onChange={(e) => setAdminUsername(e.target.value)}
                  placeholder="Nhập tên quản trò"
                  required
                  className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-military text-white placeholder:text-gray-600 focus:outline-none focus:border-[#ffd700]"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-military text-gray-300">
                  Mật Khẩu Quản Trò:
                </label>
                <input
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="Nhập mật khẩu"
                  required
                  className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-mono text-white placeholder:text-gray-600 focus:outline-none focus:border-[#ffd700]"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-military text-gray-300">
                  Thời lượng trận đánh:
                </label>
                <select
                  value={adminDuration}
                  onChange={(e) => setAdminDuration(Number(e.target.value))}
                  className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-military text-yellow-400 focus:outline-none focus:border-[#ffd700]"
                >
                  <option value={180}>180 Giây (3 Phút - Tiêu chuẩn)</option>
                  <option value={300}>300 Giây (5 Phút - Mở rộng)</option>
                  <option value={120}>120 Giây (2 Phút - Nhanh)</option>
                </select>
              </div>

              {adminError && (
                <div className="p-3 bg-red-950/80 border border-red-500/60 rounded-xl text-red-200 text-xs font-military flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                  <span>{adminError}</span>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAdminLoginModal(false)}
                  className="flex-1 py-3 rounded-xl bg-black/40 hover:bg-black/60 border border-white/20 text-gray-300 font-military text-xs font-bold cursor-pointer"
                >
                  HỦY BỎ
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#8b0000] to-[#b22222] hover:from-[#a00000] hover:to-[#c41e3a] text-white font-military font-bold text-xs shadow-lg shadow-red-950/60 cursor-pointer"
                >
                  TẠO PHÒNG
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ═══ 4. MÀN HÌNH BẮN PHÁO TRONG TRẬN ĐẤU (SINH VIÊN HOẶC SOLO) ═══ */}
      {(appMode === 'SINGLE_PLAYING' || appMode === 'STUDENT_PLAYING') && (
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
              isPlaying={appMode === 'SINGLE_PLAYING' || appMode === 'STUDENT_PLAYING'}
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

      {/* ═══ 5. PHASE 1 QUIZ RELOAD MODAL ═══ */}
      <QuizModal
        isOpen={isQuizOpen}
        currentAmmo={ammo37mm + ammoFlak}
        onAddAmmo={handleAddAmmo}
        onCloseToBattle={() => setIsQuizOpen(false)}
      />

      {/* ═══ 6. PHASE 3 MANDATORY HISTORICAL DOSSIER MODAL (STRICT NO-SKIP) ═══ */}
      <PlaneDossierModal
        plane={activeDossierPlane}
        countdownSeconds={6}
        onFinishedReading={handleFinishedReadingDossier}
      />

      {/* ═══ 7. DEBRIEF / VICTORY MODAL ═══ */}
      <VictoryModal
        isOpen={appMode === 'DEBRIEF'}
        score={score}
        planesDownedCount={planesDownedCount}
        shotsFired={shotsFired}
        questionsAnswered={questionsAnswered}
        onPlayAgain={handleStartSoloGame}
        onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
        onSaveScore={handleSaveScore}
      />

      {/* ═══ 8. LEADERBOARD MODAL ═══ */}
      <LeaderboardModal
        isOpen={isLeaderboardOpen}
        onClose={() => setIsLeaderboardOpen(false)}
        entries={leaderboard}
      />

      {/* ═══ 9. RULES MODAL ═══ */}
      <RulesModal
        isOpen={isRulesOpen}
        onClose={() => setIsRulesOpen(false)}
      />
    </div>
  );
}
