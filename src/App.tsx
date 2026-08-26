import React, { useState, useEffect, useCallback, useId } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../convex/_generated/api';
import type { Id } from '../convex/_generated/dataModel';
import { CanvasGame } from './game/CanvasGame';
import { Header } from './components/Header';
import { QuizModal } from './components/QuizModal';
import { PlaneDossierModal } from './components/PlaneDossierModal';
import { VictoryModal } from './components/VictoryModal';
import { TeacherHostView } from './components/TeacherHostView';
import { StudentWaitingLobby } from './components/StudentWaitingLobby';
import { RulesModal } from './components/RulesModal';
import type { HistoricalPlane } from './data/planesData';
import { sound } from './audio/SoundEngine';
import {
  Crosshair,
  Crown,
  Lock,
  LogIn,
  ScrollText,
  AlertCircle,
  X,
  Clock,
  Sliders
} from 'lucide-react';

const INITIAL_TIME = 300; // 5 minutes default battle session

// Clean human-friendly error formatter for Convex server errors
const parseCleanErrorMessage = (err: any): string => {
  if (!err) return 'Đã xảy ra lỗi không xác định. Vui lòng thử lại!';
  if (err.data && typeof err.data === 'string') return err.data;
  let msg = err.message || String(err);
  msg = msg
    .replace(/\[CONVEX\s+[^\]]+\]/gi, '')
    .replace(/\[Request ID:[^\]]+\]/gi, '')
    .replace(/Server Error Called by client:\s*/gi, '')
    .replace(/Uncaught\s+Error:\s*/gi, '')
    .replace(/^Error:\s*/gi, '')
    .trim();
  return msg || 'Không thể vào phòng thi đấu. Vui lòng kiểm tra lại mã PIN!';
};

export default function App() {
  // Game Mode: 'MENU' | 'TEACHER_HOST' | 'STUDENT_WAITING' | 'STUDENT_PLAYING' | 'DEBRIEF'
  const [appMode, setAppMode] = useState<'MENU' | 'TEACHER_HOST' | 'STUDENT_WAITING' | 'STUDENT_PLAYING' | 'DEBRIEF'>('MENU');
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
  const [isRulesOpen, setIsRulesOpen] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Admin / Host Login State
  const [showAdminLoginModal, setShowAdminLoginModal] = useState<boolean>(false);
  const [adminUsername, setAdminUsername] = useState<string>('');
  const [adminPassword, setAdminPassword] = useState<string>('');
  const [adminDuration, setAdminDuration] = useState<number>(300); // 5 minutes default
  const [isCustomDuration, setIsCustomDuration] = useState<boolean>(false);
  const [customDurationMinutes, setCustomDurationMinutes] = useState<string>('5');
  const [adminError, setAdminError] = useState<string>('');
  const customDurationInputId = useId();

  // Student Join State: Auto-fill from URL query param ?code=195401 or ?room=195401
  const [studentPin, setStudentPin] = useState<string>(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code') || params.get('room') || '';
      return code.replace(/\D/g, '').slice(0, 6);
    } catch {
      return '';
    }
  });
  const [studentName, setStudentName] = useState<string>('');
  const [studentError, setStudentError] = useState<string>('');

  // Multiplayer Tournament Room Info
  const [currentRoomId, setCurrentRoomId] = useState<Id<"dbpRooms"> | null>(null);
  const [currentRoomCode, setCurrentRoomCode] = useState<string>('');
  const [currentStudentPlayerId, setCurrentStudentPlayerId] = useState<Id<"dbpPlayers"> | null>(null);

  // Convex Mutations & Queries
  const createRoomMutation = useMutation(api.rooms.createRoom);
  const joinRoomMutation = useMutation(api.rooms.joinRoom);
  const startRoomBattleMutation = useMutation(api.rooms.startRoomBattle);
  const syncPlayerProgressMutation = useMutation(api.rooms.syncPlayerProgress);
  const finishRoomBattleMutation = useMutation(api.rooms.finishRoomBattle);
  const updateRoomDurationMutation = useMutation(api.rooms.updateRoomDuration);

  // Realtime Live Room Subscription
  const roomLiveState = useQuery(
    api.rooms.getRoomLiveState,
    currentRoomId ? { roomId: currentRoomId } : "skip"
  );

  // ═══ 1. REACTIVE SYNCHRONIZATION FROM TEACHER COMMANDS ═══
  useEffect(() => {
    if (!roomLiveState?.room) return;
    const roomStatus = roomLiveState.room.status;

    // Khi Giảng Viên bấm "Bắt Đầu Trận Đấu", chuyển toàn bộ sinh viên đang ở phòng chờ vào trận địa
    if (appMode === 'STUDENT_WAITING' && roomStatus === 'playing') {
      setAppMode('STUDENT_PLAYING');
      setTimeRemaining(roomLiveState.room.durationSeconds || INITIAL_TIME);
      setElapsedSeconds(0);
      setIsPaused(false);
      sound.playAirRaidSiren();
    }

    // Khi Giảng Viên bấm "Kết Thúc Sớm" hoặc hết giờ, chuyển sang màn hình Bảng xếp hạng kết quả
    if (appMode === 'STUDENT_PLAYING' && roomStatus === 'finished') {
      setAppMode('DEBRIEF');
    }
  }, [roomLiveState?.room?.status, appMode, roomLiveState?.room?.durationSeconds]);

  // ═══ 2. SYNCHRONIZED COUNTDOWN TIMER FOR STUDENTS ═══
  // Sử dụng timestamp thực tế từ Convex Server để chống hoàn toàn lỗi dừng/reset khi chuyển tab
  useEffect(() => {
    if (appMode !== 'STUDENT_PLAYING') return;

    const startedAt = roomLiveState?.room?.startedAt || Date.now();
    const totalDuration = roomLiveState?.room?.durationSeconds || INITIAL_TIME;

    const updateStudentTimer = () => {
      const elapsed = Math.floor((Date.now() - startedAt) / 1000);
      const remaining = Math.max(0, totalDuration - elapsed);
      setTimeRemaining(remaining);
      setElapsedSeconds(elapsed);

      if (remaining <= 0) {
        setAppMode('DEBRIEF');
      }
    };

    updateStudentTimer();
    const timer = setInterval(updateStudentTimer, 500);

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        updateStudentTimer();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', updateStudentTimer);

    return () => {
      clearInterval(timer);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', updateStudentTimer);
    };
  }, [appMode, roomLiveState?.room?.startedAt, roomLiveState?.room?.durationSeconds]);

  // ═══ 3. SYNC STUDENT PROGRESS TO CONVEX IN REALTIME ═══
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
    if (appMode === 'STUDENT_PLAYING' || appMode === 'DEBRIEF') {
      syncToConvex(undefined, appMode === 'DEBRIEF');
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

    let finalDuration = adminDuration;
    if (isCustomDuration) {
      const parsed = parseInt(customDurationMinutes, 10);
      if (isNaN(parsed) || parsed <= 0 || parsed > 120) {
        setAdminError('Thời lượng tùy chỉnh phải từ 1 đến 120 phút!');
        return;
      }
      finalDuration = parsed * 60;
    }

    try {
      const hostDisplay = adminUsername.trim() || 'Giảng Viên';
      const res = await createRoomMutation({ hostName: hostDisplay, durationSeconds: finalDuration });
      setCurrentRoomId(res.roomId);
      setCurrentRoomCode(res.code);
      setShowAdminLoginModal(false);
      setAppMode('TEACHER_HOST');
    } catch (err: any) {
      setAdminError('Lỗi khi mở phòng thi đấu: ' + parseCleanErrorMessage(err));
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

      // Nếu phòng đang ở trạng thái chờ -> vào sảnh chờ STUDENT_WAITING
      if (res.room?.status === 'waiting') {
        setAppMode('STUDENT_WAITING');
      } else {
        setAppMode('STUDENT_PLAYING');
        sound.playAirRaidSiren();
      }
      setIsPaused(false);
    } catch (err: any) {
      setStudentError(parseCleanErrorMessage(err));
    }
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

  // Finished reading dossier (countdown elapsed & clicked continue)
  const handleFinishedReadingDossier = () => {
    setActiveDossierPlane(null);
  };

  // Add Ammo from Q&A Reload (Fixed 5-Question Batch)
  const handleAddAmmo = (shells37mm: number, flakBonus: number) => {
    setAmmo37mm((prev) => prev + shells37mm);
    setAmmoFlak((prev) => prev + flakBonus);
    setQuestionsAnswered((prev) => prev + 5);
    if (appMode === 'STUDENT_PLAYING') {
      syncToConvex(`Đã hoàn thành 5 câu hỏi lịch sử, nạp +${shells37mm} đạn 37mm!`);
    }
  };

  const handleLeaveRoom = () => {
    setCurrentRoomId(null);
    setCurrentRoomCode('');
    setCurrentStudentPlayerId(null);
    setAppMode('MENU');
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#0a0f08] text-[#f7f6f2] font-sans select-none">
      {/* ═══ 1. MÀN HÌNH MÁY CHIẾU CỦA QUẢN TRÒ / GIẢNG VIÊN ═══ */}
      {appMode === 'TEACHER_HOST' && currentRoomId && (
        <TeacherHostView
          roomCode={currentRoomCode}
          players={(roomLiveState?.players as any) || []}
          logs={(roomLiveState?.logs as any) || []}
          status={roomLiveState?.room?.status || 'waiting'}
          durationSeconds={roomLiveState?.room?.durationSeconds || 300}
          startedAt={roomLiveState?.room?.startedAt}
          onStartGame={() => startRoomBattleMutation({ roomId: currentRoomId })}
          onFinishGame={() => finishRoomBattleMutation({ roomId: currentRoomId })}
          onUpdateDuration={(newSec) => updateRoomDurationMutation({ roomId: currentRoomId, durationSeconds: newSec })}
          onExit={handleLeaveRoom}
        />
      )}

      {/* ═══ 2. SẢNH CHỜ CHIẾN SĨ (STUDENT WAITING LOBBY TRƯỚC KHI GIÁO VIÊN BẤM BẮT ĐẦU) ═══ */}
      {appMode === 'STUDENT_WAITING' && currentRoomId && (
        <StudentWaitingLobby
          roomCode={currentRoomCode}
          playerName={studentName}
          hostName={roomLiveState?.room?.hostName}
          players={(roomLiveState?.players as any) || []}
          onLeave={handleLeaveRoom}
        />
      )}

      {/* ═══ 3. GIAO DIỆN TRANG CHỦ CHÍNH (QUẢN TRÒ & NGƯỜI CHƠI) ═══ */}
      {appMode === 'MENU' && (
        <div className="relative z-30 w-full h-full flex flex-col justify-center items-center p-6 sm:p-10 camo-gradient trench-texture overflow-y-auto">
          {/* Top Title Banner & Rules Button */}
          <div className="text-center space-y-3 max-w-3xl w-full mb-8">
            <div className="flex items-center justify-center gap-3">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#8b0000] border border-[#ffd700]/60 text-[#ffd700] font-military font-bold text-xs uppercase tracking-widest shadow-lg shadow-red-950/60">
                ★ CHIẾN DỊCH ĐIỆN BIÊN PHỦ 1954 ★
              </div>
              <button
                onClick={() => setIsRulesOpen(true)}
                className="px-4 py-1.5 rounded-full bg-[#2d3b27] hover:bg-[#3a4b32] border border-[#ffd700]/50 text-[#ffd700] font-military font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
              >
                <ScrollText className="w-4 h-4" /> LUẬT CHƠI
              </button>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-military text-white tracking-wide">
              PHÁO CAO XẠ 37MM BẮN MÁY BAY
            </h1>
            <p className="text-xs sm:text-sm text-gray-300 max-w-xl mx-auto">
              Đấu trường phòng không thời gian thực dành cho lớp học. Nạp đạn bằng kiến thức lịch sử, bắn máy bay và đọc tư liệu bắt buộc.
            </p>
          </div>

          {/* ═══ 2 KHUNG VAI TRÒ DUY NHẤT (QUẢN TRÒ & NGƯỜI CHƠI) ═══ */}
          <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 👑 KHUNG 1: QUẢN TRÒ (TẠO PHÒNG MÁY CHIẾU) */}
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
                    Dành cho Giảng viên tạo phòng, phát mã PIN và mã QR cho học sinh quét vào, trình chiếu bảng điểm trực tiếp và bục vinh danh Top 3 của lớp.
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
                  ĐĂNG NHẬP & TẠO PHÒNG
                </button>
              </div>
            </div>

            {/* 🎯 KHUNG 2: NGƯỜI CHƠI (THAM GIA PHÒNG) */}
            <div className="bg-[#1c2419]/95 border-2 border-[#44563a] hover:border-emerald-500/80 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-2xl backdrop-blur-md relative overflow-hidden group transition-all">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -z-0 pointer-events-none" />

              <div className="space-y-4 relative z-10">
                <div className="flex items-center justify-between">
                  <div className="w-14 h-14 rounded-2xl bg-[#2d3b27] border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-lg">
                    <Crosshair className="w-8 h-8" />
                  </div>
                  <span className="px-3 py-1 bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 font-military font-bold text-xs rounded-full">
                    HỌC SINH THAM CHIẾN
                  </span>
                </div>

                <div>
                  <h2 className="text-2xl font-black font-military text-white">
                    2. THAM GIA PHÒNG
                  </h2>
                  <p className="text-xs text-gray-300 font-military mt-1 leading-relaxed">
                    Dành cho Học sinh tham gia trận đấu. Nhập mã PIN đang hiển thị trên máy chiếu của Giảng viên (hoặc quét mã QR) để vào thi đấu.
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
                      Họ & Tên Học Sinh:
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
                    VÀO PHÒNG THI ĐẤU
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══ 4. MODAL ĐĂNG NHẬP QUẢN TRÒ (KÈM CHỌN/NHẬP THỜI LƯỢNG) ═══ */}
      {showAdminLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-md bg-[#1c2419] border-2 border-[#ffd700] rounded-3xl shadow-2xl p-6 sm:p-8 space-y-5 text-[#f7f6f2] relative">
            <button
              onClick={() => setShowAdminLoginModal(false)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-black/30 hover:bg-black/50 text-gray-300 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="text-center space-y-1.5">
              <div className="w-12 h-12 rounded-2xl bg-[#8b0000] text-[#ffd700] flex items-center justify-center mx-auto shadow-lg shadow-red-950/60 font-bold">
                <Crown className="w-6 h-6" />
              </div>
              <h3 className="text-lg sm:text-xl font-black font-military text-white">
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
                  className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-2 text-xs sm:text-sm font-military text-white placeholder:text-gray-600 focus:outline-none focus:border-[#ffd700]"
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
                  className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-2 text-xs sm:text-sm font-mono text-white placeholder:text-gray-600 focus:outline-none focus:border-[#ffd700]"
                />
              </div>

              {/* ⏱️ THỜI LƯỢNG TRẬN ĐẤU (PRESETS + TÙY CHỌN NHẬP TAY) */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between text-xs font-military text-gray-300">
                  <span className="flex items-center gap-1.5 text-yellow-300 font-bold">
                    <Clock className="w-3.5 h-3.5" /> Thời Lượng Trận Đánh:
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsCustomDuration(!isCustomDuration)}
                    className="text-[11px] text-emerald-400 hover:underline flex items-center gap-1"
                  >
                    <Sliders className="w-3 h-3" />
                    {isCustomDuration ? 'Dùng gợi ý có sẵn' : 'Tự nhập số phút'}
                  </button>
                </div>

                {!isCustomDuration ? (
                  <div className="grid grid-cols-4 gap-1.5 font-military">
                    {[
                      { label: '3P', sec: 180 },
                      { label: '5P', sec: 300 },
                      { label: '10P', sec: 600 },
                      { label: '15P', sec: 900 },
                    ].map((preset) => {
                      const isSel = adminDuration === preset.sec;
                      return (
                        <button
                          key={preset.sec}
                          type="button"
                          onClick={() => setAdminDuration(preset.sec)}
                          className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            isSel
                              ? 'bg-[#8b0000] text-[#ffd700] border border-[#ffd700] shadow-md shadow-red-950/60 font-black'
                              : 'bg-black/40 text-gray-300 hover:bg-black/60 border border-white/10'
                          }`}
                        >
                          {preset.label}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <label htmlFor={customDurationInputId} className="sr-only">
                      Số phút thi đấu
                    </label>
                    <input
                      id={customDurationInputId}
                      type="number"
                      min={1}
                      max={120}
                      value={customDurationMinutes}
                      onChange={(e) => setCustomDurationMinutes(e.target.value)}
                      placeholder="Nhập số phút (vd: 7, 12, 20...)"
                      className="flex-1 bg-black/60 border border-white/20 rounded-xl px-3 py-2 text-xs font-mono text-yellow-300 placeholder:text-gray-600 focus:outline-none focus:border-[#ffd700]"
                    />
                    <span className="text-xs font-military text-gray-300 font-bold">Phút</span>
                  </div>
                )}
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
                  className="flex-1 py-2.5 rounded-xl bg-black/40 hover:bg-black/60 border border-white/20 text-gray-300 font-military text-xs font-bold cursor-pointer"
                >
                  HỦY BỎ
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#8b0000] to-[#b22222] hover:from-[#a00000] hover:to-[#c41e3a] text-white font-military font-bold text-xs shadow-lg shadow-red-950/60 cursor-pointer"
                >
                  TẠO PHÒNG
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ═══ 5. MÀN HÌNH BẮN PHÁO TRONG TRẬN ĐẤU CỦA HỌC SINH ═══ */}
      {appMode === 'STUDENT_PLAYING' && (
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
            onOpenLeaderboard={() => {}}
            isMuted={isMuted}
            onToggleMute={() => setIsMuted(sound.toggleMute())}
          />

          {/* Canvas Engine */}
          <div className="w-full h-full pt-16">
            <CanvasGame
              isPlaying={appMode === 'STUDENT_PLAYING'}
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

          {/* Q&A Reload Modal */}
          {isQuizOpen && (
            <QuizModal
              isOpen={isQuizOpen}
              onCloseToBattle={() => setIsQuizOpen(false)}
              onAddAmmo={handleAddAmmo}
              currentAmmo={ammo37mm}
            />
          )}

          {/* Mandatory Plane Dossier Modal (Strict No-Skip) */}
          {activeDossierPlane && (
            <PlaneDossierModal
              plane={activeDossierPlane}
              onFinishedReading={handleFinishedReadingDossier}
            />
          )}
        </div>
      )}

      {/* ═══ 6. MÀN HÌNH TỔNG KẾT KẾT QUẢ CHO HỌC SINH (DEBRIEF / VICTORY) ═══ */}
      {appMode === 'DEBRIEF' && (
        <VictoryModal
          isOpen={true}
          score={score}
          planesDownedCount={planesDownedCount}
          shotsFired={shotsFired}
          questionsAnswered={questionsAnswered}
          roomPlayers={(roomLiveState?.players as any) || []}
          currentPlayerName={studentName}
          onRestart={handleLeaveRoom}
          onExit={handleLeaveRoom}
        />
      )}

      {/* ═══ 7. MODAL LUẬT CHƠI ═══ */}
      <RulesModal isOpen={isRulesOpen} onClose={() => setIsRulesOpen(false)} />
    </div>
  );
}
