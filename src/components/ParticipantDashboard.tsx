import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  BookOpen,
  Lock,
  Unlock,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  Play,
  Lightbulb,
  ShieldAlert,
  Compass,
  Award,
  Heart,
  TrendingUp,
  Target,
  History,
  FileText,
  AlertCircle,
  HelpCircle,
  ClipboardCheck,
} from 'lucide-react';
import { PROGRAM_WEEKS, PWB_DIMENSIONS_INFO, PROGRAM_BADGES } from '../data/programData';
import { Activity, ProgramSession, ProgramWeek } from '../types';
import { ActivityRunnerModal } from './ActivityRunnerModal';

interface ParticipantDashboardProps {
  onNavigateTab: (tab: string) => void;
}

export const ParticipantDashboard: React.FC<ParticipantDashboardProps> = ({ onNavigateTab }) => {
  const { user, token } = useAuth();
  const [progressData, setProgressData] = useState<any>(null);
  const [weekAccessStatuses, setWeekAccessStatuses] = useState<any[]>([]);
  const [evalStatus, setEvalStatus] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Active Runner Modal
  const [activeActivityModal, setActiveActivityModal] = useState<{
    activity: Activity;
    session: ProgramSession;
  } | null>(null);

  // Locked notice modal
  const [lockedNotice, setLockedNotice] = useState<string | null>(null);

  // Positive feedback celebration toast
  const [celebrationToast, setCelebrationToast] = useState<{
    title: string;
    message: string;
    badgeName?: string;
  } | null>(null);

  useEffect(() => {
    fetchMyProgress();
    fetchEvaluationStatus();
  }, []);

  const fetchMyProgress = async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const res = await fetch('/api/program/my-progress', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setProgressData(data.progress);
        setWeekAccessStatuses(data.weekAccessStatuses);
      }
    } catch (e) {
      console.error('Fetch progress error:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchEvaluationStatus = async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/evaluations/my-status', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setEvalStatus(data);
      }
    } catch (e) {
      console.error('Fetch eval status error:', e);
    }
  };

  const handleStartSession = async (session: ProgramSession, weekStatus: any) => {
    if (!weekStatus?.allowed) {
      setLockedNotice(
        weekStatus?.reason ||
          'Minggu ini belum dapat dibuka. Selesaikan seluruh sesi wajib pada minggu sebelumnya untuk membuka misi ini.'
      );
      return;
    }

    try {
      const res = await fetch(`/api/program/sessions/${session.id}/start`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        fetchMyProgress();
        // Open first mandatory activity
        const firstAct = session.activities.find((a) => a.isMandatory) || session.activities[0];
        if (firstAct) {
          setActiveActivityModal({ activity: firstAct, session });
        }
      } else {
        const data = await res.json();
        setLockedNotice(data.error || 'Akses ke sesi ini belum diizinkan.');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleActivityCompleted = async (savedAnswer?: any) => {
    if (!activeActivityModal) return;
    const { activity, session } = activeActivityModal;

    try {
      const res = await fetch(`/api/program/sessions/${session.id}/complete-activity`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          activityId: activity.id,
          savedAnswer,
        }),
      });

      if (res.ok) {
        setActiveActivityModal(null);
        await fetchMyProgress();

        // Check which badge belongs to this week
        const badge = PROGRAM_BADGES.find((b) => b.weekNumber === session.weekNumber);

        // Show positive feedback celebration
        setCelebrationToast({
          title: '🎉 Luar Biasa! Aktivitas Berhasil Diselesaikan!',
          message: `Anda telah menuntaskan "${activity.title}". Pemahaman Anda semakin bertumbuh dalam pilar kesejahteraan kerja.`,
          badgeName: badge?.title,
        });

        setTimeout(() => {
          setCelebrationToast(null);
        }, 6000);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Find next actionable session
  const findNextActionableSession = () => {
    for (const week of PROGRAM_WEEKS) {
      const access = weekAccessStatuses.find((s) => s.weekNumber === week.weekNumber);
      if (!access || !access.allowed) continue;

      for (const session of week.sessions) {
        const status = progressData?.sessions?.[session.id]?.status || 'Belum Dimulai';
        if (status !== 'Selesai') {
          return { week, session, access };
        }
      }
    }
    return null;
  };

  const nextAction = findNextActionableSession();
  const overallPct = progressData?.overallPercentage || 0;
  const completedWeeks = progressData?.completedWeeks || [];

  return (
    <div className="space-y-6">
      {/* Toast Notification Celebration */}
      {celebrationToast && (
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#FDF2F4] via-white to-[#F5F0FB] border border-[#B51F36]/30 shadow-md flex items-start justify-between gap-3 animate-fade-in">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#B51F36] text-white flex items-center justify-center shrink-0 shadow-xs">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#243B53]">{celebrationToast.title}</h4>
              <p className="text-xs text-[#29343B] mt-0.5">{celebrationToast.message}</p>
              {celebrationToast.badgeName && (
                <span className="inline-block mt-1 text-[11px] font-bold text-[#B51F36] bg-[#FDF2F4] px-2 py-0.5 rounded-md border border-[#B51F36]/20">
                  Kemajuan menuju: {celebrationToast.badgeName}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={() => setCelebrationToast(null)}
            className="text-xs font-bold text-[#78838A] hover:text-[#B51F36]"
          >
            ✕
          </button>
        </div>
      )}

      {/* Gamified Hero Card with Player Profile, Level, and Progress */}
      <div className="bg-white rounded-3xl border border-[#D98BAA]/30 p-6 sm:p-8 shadow-xs relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-[#FDF2F4] text-[#B51F36] border border-[#B51F36]/20">
                Peserta Program SmartWorkCare
              </span>
              <span className="text-[11px] font-mono font-semibold text-[#49316F] bg-[#F5F0FB] px-2.5 py-0.5 rounded-md border border-[#49316F]/20">
                ID: {user?.username} ({user?.participantNumber ? `No. ${user.participantNumber}` : 'Aktif'})
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#243B53] tracking-tight font-['Plus_Jakarta_Sans']">
              Selamat Datang, {user?.name || 'Peserta'}.
            </h1>
            <p className="text-xs sm:text-sm text-[#78838A] leading-relaxed">
              Jalani perjalanan interaktif pengembangan kesejahteraan psikologis 4 minggu Anda. Selesaikan setiap misi mingguan untuk membuka lencana pencapaian.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              {nextAction ? (
                <button
                  onClick={() => handleStartSession(nextAction.session, nextAction.access)}
                  className="px-6 py-3 rounded-2xl bg-[#B51F36] text-white hover:bg-[#96192c] active:scale-[0.99] transition-all text-xs sm:text-sm font-bold flex items-center gap-2 shadow-md"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>
                    Lanjutkan Misi: Minggu {nextAction.week.weekNumber} (Sesi {nextAction.session.order})
                  </span>
                </button>
              ) : (
                <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-[#059669] bg-green-50 px-4 py-2.5 rounded-2xl border border-green-200">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Selamat! Seluruh 4 misi mingguan telah berhasil Anda selesaikan.</span>
                </div>
              )}

              <button
                onClick={() => onNavigateTab('reflection')}
                className="px-4 py-3 rounded-2xl bg-[#F5F0FB] border border-[#49316F]/20 text-[#49316F] hover:bg-[#ede5f7] transition-all text-xs sm:text-sm font-bold flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-[#49316F]" />
                <span>Ruang Refleksi AI</span>
              </button>
            </div>
          </div>

          {/* Gamified Circular / Progress Box */}
          <div className="lg:w-72 p-5 bg-[#F7F5F8] rounded-2xl border border-[#D98BAA]/30 flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#243B53] uppercase tracking-wider">
                Progres Program
              </span>
              <span className="text-sm font-extrabold text-[#B51F36]">{overallPct}%</span>
            </div>

            {/* Smooth Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                style={{ width: `${overallPct}%` }}
                className="bg-[#B51F36] h-full rounded-full transition-all duration-500"
              ></div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs pt-1">
              <div className="p-2 bg-white rounded-xl border border-gray-100 text-center">
                <span className="text-[10px] text-[#78838A] block">Sesi Selesai</span>
                <span className="font-bold text-[#243B53] text-sm">
                  {progressData?.completedSessionsCount || 0} / {progressData?.totalMandatorySessionsCount || 8}
                </span>
              </div>
              <div className="p-2 bg-white rounded-xl border border-gray-100 text-center">
                <span className="text-[10px] text-[#78838A] block">Lencana Dibuka</span>
                <span className="font-bold text-[#49316F] text-sm">
                  {completedWeeks.length} / 4 Lencana
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Badges Shelf */}
        <div className="mt-8 pt-6 border-t border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-bold text-[#243B53] uppercase tracking-wider flex items-center gap-1.5">
              <Award className="w-4 h-4 text-[#B51F36]" />
              <span>Rak Lencana Mingguan (Pencapaian Anda):</span>
            </p>
            <span className="text-xs text-[#78838A]">
              Selesaikan tiap minggu untuk membuka lencana
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {PROGRAM_BADGES.map((badge) => {
              const isUnlocked = completedWeeks.includes(badge.weekNumber);
              return (
                <div
                  key={badge.id}
                  className={`p-3.5 rounded-2xl border transition-all text-center flex flex-col items-center justify-center space-y-1.5 ${
                    isUnlocked
                      ? 'bg-gradient-to-b from-[#FDF2F4] to-white border-[#B51F36]/40 shadow-xs'
                      : 'bg-[#F7F5F8]/60 border-gray-200 opacity-60'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                      isUnlocked
                        ? 'bg-[#B51F36] text-white shadow-xs'
                        : 'bg-gray-200 text-gray-400'
                    }`}
                  >
                    {isUnlocked ? <CheckCircle2 className="w-5 h-5" /> : <Lock className="w-4 h-4" />}
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider block" style={{ color: isUnlocked ? badge.color : '#78838A' }}>
                      Minggu {badge.weekNumber}
                    </span>
                    <h4 className="text-xs font-bold text-[#243B53] line-clamp-1">{badge.title}</h4>
                  </div>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                    isUnlocked ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {isUnlocked ? 'Tercapai ★' : 'Terkunci'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* EVALUATION STATUS CARD (MUST FILL) */}
      <div className="bg-white rounded-3xl border border-[#D98BAA]/30 p-6 sm:p-7 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <ClipboardCheck className="w-5 h-5 text-[#B51F36]" />
            <h2 className="text-base sm:text-lg font-bold text-[#243B53]">
              Status Evaluasi & Instrumen Pengukuran Anda
            </h2>
          </div>
          <button
            onClick={() => onNavigateTab('evaluation')}
            className="text-xs font-bold text-[#B51F36] hover:underline flex items-center gap-1"
          >
            <span>Buka Seluruh Evaluasi</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {/* Pre-Test Status */}
          <div className="p-4 rounded-2xl bg-[#F7F5F8] border border-[#D98BAA]/30 flex flex-col justify-between space-y-2">
            <div>
              <span className="text-[10px] font-bold text-[#B51F36] uppercase tracking-wider">Langkah 1</span>
              <h4 className="font-bold text-[#243B53] mt-0.5">Pre-Test (Baseline PWB)</h4>
              <p className="text-[11px] text-[#78838A] mt-0.5">
                Pengukuran awal sebelum memulai program intervensi.
              </p>
            </div>
            <div className="pt-2 border-t border-gray-200/60 flex items-center justify-between">
              <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                evalStatus?.preTest ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
              }`}>
                {evalStatus?.preTest ? 'Selesai' : 'Wajib Diisi'}
              </span>
              <button
                onClick={() => onNavigateTab('evaluation')}
                className="font-bold text-[#B51F36] hover:underline"
              >
                {evalStatus?.preTest ? 'Lihat Skor →' : 'Isi Sekarang →'}
              </button>
            </div>
          </div>

          {/* Post-Test Status */}
          <div className="p-4 rounded-2xl bg-[#F7F5F8] border border-[#D98BAA]/30 flex flex-col justify-between space-y-2">
            <div>
              <span className="text-[10px] font-bold text-[#49316F] uppercase tracking-wider">Langkah 2</span>
              <h4 className="font-bold text-[#243B53] mt-0.5">Post-Test (PWB Akhir)</h4>
              <p className="text-[11px] text-[#78838A] mt-0.5">
                Pengukuran akhir setelah menuntaskan materi 4 minggu.
              </p>
            </div>
            <div className="pt-2 border-t border-gray-200/60 flex items-center justify-between">
              <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                evalStatus?.postTest ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
              }`}>
                {evalStatus?.postTest ? 'Selesai' : (completedWeeks.length >= 4 ? 'Siap Diisi' : 'Menunggu Misi 4')}
              </span>
              <button
                onClick={() => onNavigateTab('evaluation')}
                className="font-bold text-[#49316F] hover:underline"
              >
                {evalStatus?.postTest ? 'Lihat Delta →' : 'Buka →'}
              </button>
            </div>
          </div>

          {/* L1 Reaction Status */}
          <div className="p-4 rounded-2xl bg-[#F7F5F8] border border-[#D98BAA]/30 flex flex-col justify-between space-y-2">
            <div>
              <span className="text-[10px] font-bold text-[#243B53] uppercase tracking-wider">Langkah 3</span>
              <h4 className="font-bold text-[#243B53] mt-0.5">Evaluasi Pengalaman (L1)</h4>
              <p className="text-[11px] text-[#78838A] mt-0.5">
                Kepuasan materi, simulasi kasus, dan dialog AI.
              </p>
            </div>
            <div className="pt-2 border-t border-gray-200/60 flex items-center justify-between">
              <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                evalStatus?.reaction ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
              }`}>
                {evalStatus?.reaction ? 'Selesai' : 'Tersedia'}
              </span>
              <button
                onClick={() => onNavigateTab('evaluation')}
                className="font-bold text-[#243B53] hover:underline"
              >
                {evalStatus?.reaction ? 'Tinjau →' : 'Isi →'}
              </button>
            </div>
          </div>

          {/* L3-L4 Behavior & Results Status */}
          <div className="p-4 rounded-2xl bg-[#F7F5F8] border border-[#D98BAA]/30 flex flex-col justify-between space-y-2">
            <div>
              <span className="text-[10px] font-bold text-[#D98BAA] uppercase tracking-wider">Langkah 4</span>
              <h4 className="font-bold text-[#243B53] mt-0.5">Penerapan & Dampak (L3 & L4)</h4>
              <p className="text-[11px] text-[#78838A] mt-0.5">
                Perilaku kerja asertif dan ketenangan menghadapi tuntutan.
              </p>
            </div>
            <div className="pt-2 border-t border-gray-200/60 flex items-center justify-between">
              <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                evalStatus?.behavior ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
              }`}>
                {evalStatus?.behavior ? 'Selesai' : 'Tersedia'}
              </span>
              <button
                onClick={() => onNavigateTab('evaluation')}
                className="font-bold text-[#B51F36] hover:underline"
              >
                {evalStatus?.behavior ? 'Tinjau →' : 'Isi →'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 4 WEEKLY MISSIONS (INTERACTIVE GAME JOURNEY) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#243B53]">
              Empat Misi Mingguan SmartWorkCare
            </h2>
            <p className="text-xs text-[#78838A]">
              Sesi terstruktur secara sekuensial. Selesaikan minggu berjalan untuk membuka minggu berikutnya.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {PROGRAM_WEEKS.map((week) => {
            const access = weekAccessStatuses.find((s) => s.weekNumber === week.weekNumber);
            const isWeekAllowed = access?.allowed ?? (week.weekNumber === 1);
            const isWeekCompleted = completedWeeks.includes(week.weekNumber);
            const badge = PROGRAM_BADGES.find((b) => b.weekNumber === week.weekNumber);

            // Compute session status counts in week
            const mandSessions = week.sessions.filter((s) => s.isMandatory);
            const doneInWeek = mandSessions.filter((s) => progressData?.sessions[s.id]?.status === 'Selesai').length;

            return (
              <div
                key={week.id}
                className={`bg-white rounded-3xl border transition-all overflow-hidden ${
                  isWeekCompleted
                    ? 'border-green-200 shadow-xs'
                    : isWeekAllowed
                    ? 'border-[#D98BAA]/40 shadow-sm'
                    : 'border-gray-200 opacity-70 bg-gray-50/50'
                }`}
              >
                {/* Week Header Banner */}
                <div className="p-5 sm:p-6 bg-gradient-to-r from-[#F7F5F8] to-white border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-base shrink-0 shadow-xs ${
                        isWeekCompleted
                          ? 'bg-green-600 text-white'
                          : isWeekAllowed
                          ? 'bg-[#B51F36] text-white'
                          : 'bg-gray-200 text-gray-500'
                      }`}
                    >
                      {isWeekCompleted ? (
                        <CheckCircle2 className="w-6 h-6" />
                      ) : isWeekAllowed ? (
                        <span>M{week.weekNumber}</span>
                      ) : (
                        <Lock className="w-5 h-5" />
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#B51F36] uppercase tracking-wider">
                          Misi Minggu {week.weekNumber}
                        </span>
                        {/* Status Badge */}
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                            isWeekCompleted
                              ? 'bg-green-100 text-green-800'
                              : isWeekAllowed
                              ? doneInWeek > 0
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-500'
                          }`}
                        >
                          {isWeekCompleted
                            ? 'Selesai'
                            : isWeekAllowed
                            ? doneInWeek > 0
                              ? 'Sedang Berlangsung'
                              : 'Belum Dimulai'
                            : 'Terkunci'}
                        </span>
                      </div>

                      <h3 className="text-base sm:text-lg font-bold text-[#243B53]">
                        {week.title}
                      </h3>
                      <p className="text-xs font-medium text-[#49316F] mt-0.5">{week.theme}</p>
                    </div>
                  </div>

                  {/* Progress Indicator inside week */}
                  <div className="sm:text-right shrink-0">
                    <span className="text-[11px] text-[#78838A] block">Capaian Sesi:</span>
                    <span className="text-sm font-bold text-[#243B53]">
                      {doneInWeek} / {mandSessions.length} Sesi Selesai
                    </span>
                  </div>
                </div>

                {/* Sessions and Activities list inside week */}
                <div className="p-5 sm:p-6 space-y-4">
                  <p className="text-xs text-[#78838A] leading-relaxed max-w-3xl">
                    {week.description}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                    {week.sessions.map((session) => {
                      const sessionStatus = progressData?.sessions[session.id]?.status || 'Belum Dimulai';
                      const isSessionDone = sessionStatus === 'Selesai';
                      const isSessionInProgress = sessionStatus === 'Sedang Berlangsung';

                      return (
                        <div
                          key={session.id}
                          className={`p-4 rounded-2xl border transition-all flex flex-col justify-between space-y-3 ${
                            isSessionDone
                              ? 'bg-white border-green-200'
                              : isSessionInProgress
                              ? 'bg-white border-[#B51F36]/40 ring-1 ring-[#B51F36]/20'
                              : 'bg-[#F7F5F8]/40 border-gray-200'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="text-[11px] font-bold text-[#49316F]">
                                Sesi {session.order}: {session.isMandatory ? 'Wajib' : 'Pengayaan'}
                              </span>
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                                  isSessionDone
                                    ? 'bg-green-100 text-green-800'
                                    : isSessionInProgress
                                    ? 'bg-amber-100 text-amber-800'
                                    : 'bg-gray-100 text-gray-500'
                                }`}
                              >
                                {sessionStatus}
                              </span>
                            </div>

                            <h4 className="text-sm font-bold text-[#243B53]">{session.title}</h4>
                            <p className="text-[11px] text-[#78838A] mt-1 line-clamp-2">
                              {session.objective}
                            </p>
                          </div>

                          {/* Sub-Activities Mini Badges */}
                          <div className="pt-2 border-t border-gray-100 space-y-2">
                            <span className="text-[10px] font-bold text-[#78838A] uppercase tracking-wider block">
                              Aktivitas Pembelajaran:
                            </span>

                            <div className="space-y-1.5">
                              {session.activities.map((act) => {
                                const actStatus =
                                  progressData?.sessions[session.id]?.activityCompletions?.find(
                                    (ac: any) => ac.activityId === act.id
                                  )?.status || 'Belum Dimulai';

                                return (
                                  <div
                                    key={act.id}
                                    className="p-2 rounded-xl bg-white border border-gray-200/80 flex items-center justify-between text-xs"
                                  >
                                    <div className="flex items-center gap-2">
                                      {actStatus === 'Selesai' ? (
                                        <CheckCircle2 className="w-3.5 h-3.5 text-green-600 shrink-0" />
                                      ) : (
                                        <Clock className="w-3.5 h-3.5 text-[#B51F36] shrink-0" />
                                      )}
                                      <span className="font-medium text-[#29343B] line-clamp-1">
                                        {act.title}
                                      </span>
                                    </div>
                                    <span className="text-[10px] text-[#78838A] shrink-0">
                                      {act.estimatedMinutes}m
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          {/* Big Clear Action Button */}
                          <div className="pt-2">
                            <button
                              type="button"
                              onClick={() => handleStartSession(session, access)}
                              disabled={!isWeekAllowed}
                              className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-xs ${
                                !isWeekAllowed
                                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                  : isSessionDone
                                  ? 'bg-gray-100 text-[#243B53] hover:bg-gray-200'
                                  : 'bg-[#B51F36] text-white hover:bg-[#96192c]'
                              }`}
                            >
                              {!isWeekAllowed ? (
                                <>
                                  <Lock className="w-3.5 h-3.5" />
                                  <span>Terkunci (Selesaikan Minggu Sebelumnya)</span>
                                </>
                              ) : isSessionDone ? (
                                <>
                                  <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                                  <span>Ulangi / Review Sesi</span>
                                </>
                              ) : isSessionInProgress ? (
                                <>
                                  <Play className="w-3.5 h-3.5 fill-current" />
                                  <span>Lanjutkan Aktivitas</span>
                                </>
                              ) : (
                                <>
                                  <Play className="w-3.5 h-3.5 fill-current" />
                                  <span>Mulai Sesi Ini</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* RIWAYAT AKTIVITAS MILIKNYA (ACTIVITY HISTORY LOG) */}
      <div className="bg-white rounded-3xl border border-[#D98BAA]/30 p-6 sm:p-7 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-[#49316F]" />
            <h3 className="text-base sm:text-lg font-bold text-[#243B53]">
              Riwayat Aktivitas & Jejak Belajar Anda
            </h3>
          </div>
          <span className="text-xs text-[#78838A]">Tersimpan aman & privat</span>
        </div>

        {progressData?.sessions && Object.keys(progressData.sessions).length > 0 ? (
          <div className="divide-y divide-gray-100">
            {Object.values(progressData.sessions).map((sessRec: any) => {
              const matchedSession = PROGRAM_WEEKS.flatMap((w) => w.sessions).find((s) => s.id === sessRec.sessionId);
              if (!matchedSession) return null;

              return (
                <div key={sessRec.sessionId} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-[#B51F36] uppercase tracking-wider">
                        Minggu {matchedSession.weekNumber} • Sesi {matchedSession.order}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.2 rounded-md ${
                        sessRec.status === 'Selesai' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {sessRec.status}
                      </span>
                    </div>
                    <h4 className="text-xs sm:text-sm font-bold text-[#243B53] mt-0.5">
                      {matchedSession.title}
                    </h4>
                  </div>

                  <div className="text-xs text-[#78838A] sm:text-right">
                    {sessRec.completedAt ? (
                      <span>Diselesaikan: {new Date(sessRec.completedAt).toLocaleDateString('id-ID')}</span>
                    ) : sessRec.startedAt ? (
                      <span>Dimulai: {new Date(sessRec.startedAt).toLocaleDateString('id-ID')}</span>
                    ) : (
                      <span>Belum dimulai</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-8 text-center text-xs text-[#78838A]">
            <p>Belum ada riwayat aktivitas. Mulai sesi Minggu 1 untuk mencatat langkah pertumbuhan pertama Anda!</p>
          </div>
        )}
      </div>

      {/* Locked Notice Modal */}
      {lockedNotice && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-xl border border-[#B51F36]/30">
            <div className="w-12 h-12 rounded-2xl bg-[#FDF2F4] text-[#B51F36] flex items-center justify-center mx-auto border border-[#B51F36]/20">
              <Lock className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-[#243B53]">Misi Belum Dapat Dibuka</h3>
              <p className="text-xs text-[#78838A] leading-relaxed">{lockedNotice}</p>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setLockedNotice(null)}
                className="w-full py-2.5 rounded-xl bg-[#243B53] text-white text-xs font-bold hover:bg-[#1a2c3f]"
              >
                Saya Mengerti
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Activity Runner Modal */}
      {activeActivityModal && (
        <ActivityRunnerModal
          activity={activeActivityModal.activity}
          session={activeActivityModal.session}
          onClose={() => setActiveActivityModal(null)}
          onCompleted={handleActivityCompleted}
        />
      )}
    </div>
  );
};
