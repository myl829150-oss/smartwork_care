import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Users,
  CheckCircle2,
  Clock,
  TrendingUp,
  BarChart3,
  Calendar,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  ShieldCheck,
  FileSpreadsheet,
  Download,
  Sparkles,
  Award,
} from 'lucide-react';

interface FacilitatorDashboardProps {
  onNavigate: (tab: string) => void;
}

export const FacilitatorDashboard: React.FC<FacilitatorDashboardProps> = ({ onNavigate }) => {
  const { token, user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const res = await fetch('/api/facilitator/stats', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setStats(data.stats);
      }
    } catch (e) {
      console.error('Failed to load facilitator stats:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadExcel = async () => {
    if (!token) return;
    setIsExporting(true);
    setExportNotice(null);
    try {
      const res = await fetch('/api/facilitator/export-excel', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const dateStr = new Date().toISOString().slice(0, 10);
        a.download = `SmartWorkCare_Laporan_Kohor_${dateStr}.xlsx`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
        setExportNotice('File Excel (6 Sheet) berhasil diunduh dan siap dianalisis.');
      } else {
        const err = await res.json();
        setExportNotice(err.error || 'Gagal mengunduh file Excel.');
      }
    } catch (e) {
      console.error('Export Excel failed:', e);
      setExportNotice('Terjadi kesalahan jaringan saat mengunduh laporan Excel.');
    } finally {
      setIsExporting(false);
    }
  };

  if (isLoading && !stats) {
    return (
      <div className="py-12 text-center text-[#78838A] text-sm">
        Memuat data pemantauan kohor SmartWorkCare...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Export Confirmation Banner */}
      {exportNotice && (
        <div className="p-4 rounded-2xl bg-green-50 border border-green-200 flex items-center justify-between text-xs sm:text-sm text-green-800">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
            <span>{exportNotice}</span>
          </div>
          <button
            onClick={() => setExportNotice(null)}
            className="text-xs font-bold text-green-700 hover:underline"
          >
            Tutup
          </button>
        </div>
      )}

      {/* Top Banner with Excel Export & Quick Management CTA */}
      <div className="p-6 sm:p-8 bg-white rounded-3xl border border-[#D98BAA]/30 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded-md bg-[#F5F0FB] text-[#49316F] border border-[#49316F]/20">
              <ShieldCheck className="w-4 h-4 text-[#49316F]" />
            </span>
            <span className="text-xs font-bold text-[#49316F] uppercase tracking-wider">
              Dashboard Pemantauan & Analitik Kohor
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#243B53] tracking-tight font-['Plus_Jakarta_Sans']">
            Pengelolaan Program SmartWorkCare
          </h1>
          <p className="text-xs sm:text-sm text-[#78838A] leading-relaxed">
            Pantau keaktifan peserta, laju kemajuan misi 4 minggu, hasil pre-test vs post-test (skala 1–4), serta ekspor laporan kohor lengkap.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          {/* EXCEL EXPORT BUTTON */}
          <button
            type="button"
            disabled={isExporting}
            onClick={handleDownloadExcel}
            className="px-5 py-3 rounded-2xl bg-[#059669] text-white hover:bg-[#047857] active:scale-[0.99] transition-all text-xs sm:text-sm font-bold flex items-center gap-2.5 shadow-md disabled:opacity-50"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>{isExporting ? 'Membuat Laporan XLSX...' : 'Unduh Laporan Excel (6 Sheet)'}</span>
          </button>

          <button
            onClick={() => onNavigate('facilitator-participants')}
            className="px-4 py-3 rounded-2xl bg-[#243B53] text-white hover:bg-[#1a2c3f] transition-all text-xs sm:text-sm font-bold flex items-center gap-2 shadow-xs"
          >
            <Users className="w-4 h-4 text-[#D98BAA]" />
            <span>Kelola Peserta</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white rounded-3xl border border-[#D98BAA]/30 shadow-xs">
          <div className="flex items-center justify-between text-[#78838A] mb-2">
            <span className="text-xs font-bold text-[#243B53]">Total Peserta</span>
            <Users className="w-4 h-4 text-[#B51F36]" />
          </div>
          <p className="text-2xl font-black text-[#243B53]">{stats?.totalParticipants || 0}</p>
          <p className="text-[11px] text-[#059669] mt-1 font-semibold">
            {stats?.activeParticipants || 0} Akun Aktif ({stats?.totalParticipants ? Math.round((stats.activeParticipants / stats.totalParticipants) * 100) : 0}%)
          </p>
        </div>

        <div className="p-5 bg-white rounded-3xl border border-[#D98BAA]/30 shadow-xs">
          <div className="flex items-center justify-between text-[#78838A] mb-2">
            <span className="text-xs font-bold text-[#243B53]">Belum Memulai</span>
            <Clock className="w-4 h-4 text-[#D97706]" />
          </div>
          <p className="text-2xl font-black text-[#243B53]">{stats?.notStartedCount || 0}</p>
          <p className="text-[11px] text-[#78838A] mt-1">Perlu pengingat sesi awal</p>
        </div>

        <div className="p-5 bg-white rounded-3xl border border-[#D98BAA]/30 shadow-xs">
          <div className="flex items-center justify-between text-[#78838A] mb-2">
            <span className="text-xs font-bold text-[#243B53]">Sedang Mengikuti</span>
            <TrendingUp className="w-4 h-4 text-[#49316F]" />
          </div>
          <p className="text-2xl font-black text-[#243B53]">{stats?.inProgressCount || 0}</p>
          <p className="text-[11px] text-[#49316F] mt-1 font-semibold">Sesi aktif berjalan</p>
        </div>

        <div className="p-5 bg-white rounded-3xl border border-[#D98BAA]/30 shadow-xs">
          <div className="flex items-center justify-between text-[#78838A] mb-2">
            <span className="text-xs font-bold text-[#243B53]">Telah Lulus</span>
            <CheckCircle2 className="w-4 h-4 text-[#059669]" />
          </div>
          <p className="text-2xl font-black text-[#059669]">{stats?.completedCount || 0}</p>
          <p className="text-[11px] text-[#78838A] mt-1 font-medium">
            Tingkat Kelulusan: <strong>{stats?.programCompletionRate || 0}%</strong>
          </p>
        </div>
      </div>

      {/* 4-Week Cohort Progress Breakdown */}
      <div className="p-6 bg-white rounded-3xl border border-[#D98BAA]/30 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-[#243B53]">
              Pemantauan Progres Program 4 Minggu
            </h3>
            <p className="text-xs text-[#78838A] mt-0.5">
              Distribusi status peserta pada setiap minggu intervensi berdasarkan aturan penyelesaian sekuensial.
            </p>
          </div>
          <span className="text-xs font-bold text-[#49316F] bg-[#F5F0FB] px-3 py-1 rounded-xl border border-[#49316F]/20">
            Target: 4 Minggu
          </span>
        </div>

        <div className="space-y-3 pt-2">
          {[
            { w: 1, title: 'Minggu 1: Mengenali Diri & Memahami PWB (Self-Acceptance & Personal Growth)' },
            { w: 2, title: 'Minggu 2: Membangun Hubungan Kerja yang Sehat (Positive Relations & Autonomy)' },
            { w: 3, title: 'Minggu 3: Mengelola Tantangan & Beban Kerja (Environmental Mastery & Autonomy)' },
            { w: 4, title: 'Minggu 4: Menemukan Makna & Action Plan (Purpose in Life & Integrasi)' },
          ].map(({ w, title }) => {
            const counts = stats?.weekProgressCounts?.[w] || { notStarted: 0, inProgress: 0, completed: 0 };
            const total = stats?.totalParticipants || 1;
            const completedPct = Math.round((counts.completed / total) * 100);
            const inProgressPct = Math.round((counts.inProgress / total) * 100);

            return (
              <div key={w} className="p-4 bg-[#F7F5F8] rounded-2xl border border-[#D98BAA]/20 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-1">
                  <span className="font-bold text-[#243B53]">{title}</span>
                  <div className="flex items-center gap-3 text-[11px] text-[#78838A]">
                    <span className="flex items-center gap-1 font-semibold text-[#059669]">
                      <span className="w-2 h-2 rounded-full bg-[#059669]"></span>
                      Selesai: <strong>{counts.completed}</strong>
                    </span>
                    <span className="flex items-center gap-1 font-semibold text-[#49316F]">
                      <span className="w-2 h-2 rounded-full bg-[#49316F]"></span>
                      Sedang Jalan: <strong>{counts.inProgress}</strong>
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-gray-300"></span>
                      Belum: <strong>{counts.notStarted}</strong>
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-2.5 flex overflow-hidden">
                  <div
                    style={{ width: `${completedPct}%` }}
                    className="bg-[#059669] transition-all"
                    title={`Selesai: ${completedPct}%`}
                  ></div>
                  <div
                    style={{ width: `${inProgressPct}%` }}
                    className="bg-[#49316F] transition-all"
                    title={`Sedang Jalan: ${inProgressPct}%`}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Evaluasi Ringkasan & Matched Pairs Pre/Post-Test Card */}
      <div className="p-6 bg-white rounded-3xl border border-[#D98BAA]/30 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-[#243B53]">
              Ringkasan Evaluasi PWB & Kirkpatrick Kohor
            </h3>
            <p className="text-xs text-[#78838A] mt-0.5">
              Skor rata-rata instrumen pre-test dan post-test (skala 1–4) serta kepuasan peserta.
            </p>
          </div>
          <button
            onClick={() => onNavigate('facilitator-evaluation')}
            className="text-xs font-bold text-[#B51F36] hover:underline flex items-center gap-1"
          >
            <span>Buka Analitik Rinci</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {/* L1 Reaction */}
          <div className="p-4 bg-[#F7F5F8] rounded-2xl border border-[#D98BAA]/20">
            <p className="text-[11px] font-bold text-[#78838A]">L1: Rata-Rata Kepuasan</p>
            <p className="text-xl font-black text-[#243B53] mt-1">
              {stats?.evaluations?.averageReactionScore
                ? `${stats.evaluations.averageReactionScore} / 4.00`
                : 'Belum ada data'}
            </p>
            <p className="text-[10px] text-[#78838A] mt-0.5">
              {stats?.evaluations?.reactionResponsesCount || 0} responden
            </p>
          </div>

          {/* L2 Pre-Test */}
          <div className="p-4 bg-[#F7F5F8] rounded-2xl border border-[#D98BAA]/20">
            <p className="text-[11px] font-bold text-[#78838A]">L2: Rata-Rata Pre-Test (1-4)</p>
            <p className="text-xl font-black text-[#243B53] mt-1">
              {stats?.evaluations?.avgPreTestScore !== null
                ? `${stats.evaluations.avgPreTestScore} / 4.00`
                : 'Belum ada data'}
            </p>
            <p className="text-[10px] text-[#78838A] mt-0.5">
              {stats?.evaluations?.preTestResponsesCount || 0} responden selesai
            </p>
          </div>

          {/* L2 Post-Test */}
          <div className="p-4 bg-[#F7F5F8] rounded-2xl border border-[#D98BAA]/20">
            <p className="text-[11px] font-bold text-[#78838A]">L2: Rata-Rata Post-Test (1-4)</p>
            <p className="text-xl font-black text-[#243B53] mt-1">
              {stats?.evaluations?.avgPostTestScore !== null
                ? `${stats.evaluations.avgPostTestScore} / 4.00`
                : 'Belum ada data'}
            </p>
            <p className="text-[10px] text-[#78838A] mt-0.5">
              {stats?.evaluations?.postTestResponsesCount || 0} responden selesai
            </p>
          </div>

          {/* Delta Matched Pairs */}
          <div className="p-4 bg-[#F7F5F8] rounded-2xl border border-[#D98BAA]/20">
            <p className="text-[11px] font-bold text-[#78838A]">L2: Delta Pembelajaran Kohor</p>
            <p
              className={`text-xl font-black mt-1 ${
                stats?.evaluations?.deltaLearningScore !== null && stats?.evaluations?.deltaLearningScore >= 0
                  ? 'text-[#059669]'
                  : 'text-[#243B53]'
              }`}
            >
              {stats?.evaluations?.deltaLearningScore !== null
                ? `${stats.evaluations.deltaLearningScore >= 0 ? '+' : ''}${stats.evaluations.deltaLearningScore}`
                : 'Belum ada data'}
            </p>
            <p className="text-[10px] text-[#78838A] mt-0.5">
              {stats?.evaluations?.matchedPairsCount || 0} pasangan data valid (Matched Pairs)
            </p>
          </div>
        </div>

        {/* Detailed Sheet Breakdown preview for Excel */}
        <div className="mt-4 p-4 rounded-2xl bg-white border border-[#D98BAA]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <FileSpreadsheet className="w-5 h-5 text-[#059669] shrink-0" />
            <div>
              <span className="font-bold text-[#243B53]">Format Ekspor Laporan Excel XLSX:</span>
              <p className="text-[11px] text-[#78838A]">
                Mencakup 6 lembar kerja: Data Peserta, Progres Mingguan, Hasil Pre-test, Hasil Post-test, Evaluasi Kirkpatrick, dan Ringkasan Program.
              </p>
            </div>
          </div>
          <button
            type="button"
            disabled={isExporting}
            onClick={handleDownloadExcel}
            className="px-4 py-2 rounded-xl bg-[#059669] text-white font-bold hover:bg-[#047857] transition-colors shrink-0 text-xs flex items-center gap-1.5 shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Unduh XLSX</span>
          </button>
        </div>
      </div>
    </div>
  );
};
