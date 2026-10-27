import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  BarChart3,
  TrendingUp,
  Download,
  Info,
  CheckCircle2,
  Clock,
  Sparkles,
  Award,
  Layers,
  HeartPulse,
} from 'lucide-react';

export const FacilitatorEvaluationAnalytics: React.FC = () => {
  const { token } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isExporting, setIsExporting] = useState<boolean>(false);

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
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadExcel = async () => {
    if (!token || isExporting) return;
    setIsExporting(true);
    try {
      const res = await fetch('/api/facilitator/export-excel', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        throw new Error('Gagal mengunduh file');
      }
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `SmartWorkCare_Laporan_Kohor_${new Date().toISOString().slice(0, 10)}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan saat mengunduh berkas Excel.');
    } finally {
      setIsExporting(false);
    }
  };

  const ev = stats?.evaluations;
  const total = stats?.totalParticipants || 0;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 bg-white rounded-3xl border border-[#E2E6E3] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="p-1.5 rounded-lg bg-[#B51F36]/10 text-[#B51F36]">
              <BarChart3 className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold text-[#B51F36] uppercase tracking-wider">
              Analitik Evaluasi 4 Level Kirkpatrick & PWB Carol Ryff
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-[#243B53]">
            Metrik Efektivitas Program Kohor Karyawan
          </h2>
          <p className="text-xs text-[#78838A] mt-1 max-w-2xl leading-relaxed">
            Menghitung data aktual pengisian peserta untuk Level 1 (Reaction), Level 2 (Pre/Post Test PWB Skala 1–4 Berpasangan), Level 3 (Behavior), dan Level 4 (Results).
          </p>
        </div>

        <button
          onClick={handleDownloadExcel}
          disabled={isExporting}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-[#B51F36] hover:bg-[#97172B] active:scale-95 text-white font-bold text-xs shadow-md transition-all shrink-0 cursor-pointer disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          <span>{isExporting ? 'Menyiapkan XLSX...' : 'Unduh Laporan Lengkap (6 Sheet)'}</span>
        </button>
      </div>

      {/* KPI Cards (Skala 1-4) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* L1 Reaction */}
        <div className="p-5 bg-white rounded-2xl border border-[#E2E6E3] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#78838A] uppercase tracking-wider">
              Level 1: Reaksi
            </span>
            <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-[#E5EEE8] text-[#243B53]">
              Skala 1–4
            </span>
          </div>
          <div className="flex items-baseline gap-1 mt-3">
            <p className="text-3xl font-extrabold text-[#243B53]">
              {ev?.averageReactionScore ? ev.averageReactionScore : '—'}
            </p>
            {ev?.averageReactionScore && (
              <span className="text-xs font-semibold text-[#78838A]">/ 4.00</span>
            )}
          </div>
          <p className="text-[11px] text-[#78838A] mt-1.5 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#059669]" />
            <span>{ev?.reactionResponsesCount || 0} respons terdata</span>
          </p>
        </div>

        {/* L2 Pre-test */}
        <div className="p-5 bg-white rounded-2xl border border-[#E2E6E3] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#78838A] uppercase tracking-wider">
              Level 2: Rata Pre-Test
            </span>
            <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-[#B51F36]/10 text-[#B51F36]">
              Baseline
            </span>
          </div>
          <div className="flex items-baseline gap-1 mt-3">
            <p className="text-3xl font-extrabold text-[#243B53]">
              {ev?.avgPreTestScore !== null && ev?.avgPreTestScore !== undefined
                ? ev.avgPreTestScore
                : '—'}
            </p>
            {ev?.avgPreTestScore !== null && ev?.avgPreTestScore !== undefined && (
              <span className="text-xs font-semibold text-[#78838A]">/ 4.00</span>
            )}
          </div>
          <p className="text-[11px] text-[#78838A] mt-1.5 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#78838A]" />
            <span>{ev?.preTestResponsesCount || 0} pengisian Pre-Test</span>
          </p>
        </div>

        {/* L2 Post-test */}
        <div className="p-5 bg-white rounded-2xl border border-[#E2E6E3] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#78838A] uppercase tracking-wider">
              Level 2: Rata Post-Test
            </span>
            <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-[#49316F]/10 text-[#49316F]">
              Outcome
            </span>
          </div>
          <div className="flex items-baseline gap-1 mt-3">
            <p className="text-3xl font-extrabold text-[#243B53]">
              {ev?.avgPostTestScore !== null && ev?.avgPostTestScore !== undefined
                ? ev.avgPostTestScore
                : '—'}
            </p>
            {ev?.avgPostTestScore !== null && ev?.avgPostTestScore !== undefined && (
              <span className="text-xs font-semibold text-[#78838A]">/ 4.00</span>
            )}
          </div>
          <p className="text-[11px] text-[#78838A] mt-1.5 flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-[#49316F]" />
            <span>{ev?.postTestResponsesCount || 0} pengisian Post-Test</span>
          </p>
        </div>

        {/* Matched Pair Delta */}
        <div className="p-5 bg-white rounded-2xl border border-[#E2E6E3] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#78838A] uppercase tracking-wider">
              Delta Berpasangan
            </span>
            <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-[#059669]/10 text-[#059669]">
              Post - Pre
            </span>
          </div>
          <div className="flex items-baseline gap-1 mt-3">
            <p
              className={`text-3xl font-extrabold ${
                ev?.deltaLearningScore !== null && ev?.deltaLearningScore > 0
                  ? 'text-[#059669]'
                  : ev?.deltaLearningScore !== null && ev?.deltaLearningScore < 0
                  ? 'text-[#B51F36]'
                  : 'text-[#243B53]'
              }`}
            >
              {ev?.deltaLearningScore !== null && ev?.deltaLearningScore !== undefined
                ? `${ev.deltaLearningScore > 0 ? '+' : ''}${ev.deltaLearningScore}`
                : '—'}
            </p>
            {ev?.deltaLearningScore !== null && ev?.deltaLearningScore !== undefined && (
              <span className="text-xs font-semibold text-[#78838A]">poin</span>
            )}
          </div>
          <p className="text-[11px] text-[#78838A] mt-1.5 flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-[#059669]" />
            <span>{ev?.matchedPairsCount || 0} peserta berpasangan</span>
          </p>
        </div>
      </div>

      {/* Completion Status Checklist Grid */}
      <div className="p-6 bg-white rounded-3xl border border-[#E2E6E3] shadow-xs">
        <h3 className="text-sm font-bold text-[#243B53] mb-4 flex items-center gap-2">
          <Layers className="w-4 h-4 text-[#B51F36]" />
          <span>Kelengkapan Pengisian Evaluasi Kohor</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
          <div className="p-3.5 rounded-2xl bg-[#F7F5F8] border border-[#E2E6E3]">
            <span className="text-[10px] font-bold text-[#78838A] uppercase block">Pre-Test PWB</span>
            <p className="text-lg font-bold text-[#243B53] mt-1">
              {ev?.completionCounts?.preTest || 0}{' '}
              <span className="text-xs font-normal text-[#78838A]">/ {total}</span>
            </p>
            <div className="w-full bg-[#E2E6E3] h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-[#B51F36] h-full rounded-full transition-all"
                style={{
                  width: `${total ? Math.min(100, Math.round(((ev?.completionCounts?.preTest || 0) / total) * 100)) : 0}%`,
                }}
              />
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#F7F5F8] border border-[#E2E6E3]">
            <span className="text-[10px] font-bold text-[#78838A] uppercase block">Post-Test PWB</span>
            <p className="text-lg font-bold text-[#243B53] mt-1">
              {ev?.completionCounts?.postTest || 0}{' '}
              <span className="text-xs font-normal text-[#78838A]">/ {total}</span>
            </p>
            <div className="w-full bg-[#E2E6E3] h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-[#49316F] h-full rounded-full transition-all"
                style={{
                  width: `${total ? Math.min(100, Math.round(((ev?.completionCounts?.postTest || 0) / total) * 100)) : 0}%`,
                }}
              />
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#F7F5F8] border border-[#E2E6E3]">
            <span className="text-[10px] font-bold text-[#78838A] uppercase block">Level 1: Reaksi</span>
            <p className="text-lg font-bold text-[#243B53] mt-1">
              {ev?.completionCounts?.reactionL1 || 0}{' '}
              <span className="text-xs font-normal text-[#78838A]">/ {total}</span>
            </p>
            <div className="w-full bg-[#E2E6E3] h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-[#059669] h-full rounded-full transition-all"
                style={{
                  width: `${total ? Math.min(100, Math.round(((ev?.completionCounts?.reactionL1 || 0) / total) * 100)) : 0}%`,
                }}
              />
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#F7F5F8] border border-[#E2E6E3]">
            <span className="text-[10px] font-bold text-[#78838A] uppercase block">Level 3: Perilaku</span>
            <p className="text-lg font-bold text-[#243B53] mt-1">
              {ev?.completionCounts?.behaviorL3 || 0}{' '}
              <span className="text-xs font-normal text-[#78838A]">/ {total}</span>
            </p>
            <div className="w-full bg-[#E2E6E3] h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-[#D98BAA] h-full rounded-full transition-all"
                style={{
                  width: `${total ? Math.min(100, Math.round(((ev?.completionCounts?.behaviorL3 || 0) / total) * 100)) : 0}%`,
                }}
              />
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#F7F5F8] border border-[#E2E6E3]">
            <span className="text-[10px] font-bold text-[#78838A] uppercase block">Level 4: Dampak</span>
            <p className="text-lg font-bold text-[#243B53] mt-1">
              {ev?.completionCounts?.resultsL4 || 0}{' '}
              <span className="text-xs font-normal text-[#78838A]">/ {total}</span>
            </p>
            <div className="w-full bg-[#E2E6E3] h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-[#243B53] h-full rounded-full transition-all"
                style={{
                  width: `${total ? Math.min(100, Math.round(((ev?.completionCounts?.resultsL4 || 0) / total) * 100)) : 0}%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Level Breakdown Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Level 1 & 2 Card */}
        <div className="p-6 bg-white rounded-3xl border border-[#E2E6E3] shadow-xs space-y-3">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-[#B51F36]/10 text-[#B51F36]">
              <Sparkles className="w-4 h-4" />
            </span>
            <h3 className="text-sm font-bold text-[#243B53]">
              Level 1 (Reaksi) & Level 2 (Pembelajaran PWB)
            </h3>
          </div>
          <p className="text-xs text-[#78838A] leading-relaxed">
            Level 1 mengukur penerimaan kepuasan terhadap relevansi materi, kejelasan alur, dan kegunaan AI Reflection. Level 2 mengukur 6 dimensi Psychological Well-Being Carol Ryff pada skala 1–4.
          </p>
          <div className="p-4 bg-[#F7F5F8] rounded-2xl border border-[#E2E6E3] text-xs space-y-2.5">
            <div className="flex justify-between">
              <span className="text-[#78838A]">Kepuasan Rata-rata (L1):</span>
              <strong className="text-[#243B53]">
                {ev?.averageReactionScore ? `${ev.averageReactionScore} / 4.00` : 'Belum ada data'}
              </strong>
            </div>
            <div className="flex justify-between">
              <span className="text-[#78838A]">Baseline Pre-Test (L2):</span>
              <strong className="text-[#243B53]">
                {ev?.avgPreTestScore !== null && ev?.avgPreTestScore !== undefined
                  ? `${ev.avgPreTestScore} / 4.00`
                  : 'Belum ada data'}
              </strong>
            </div>
            <div className="flex justify-between">
              <span className="text-[#78838A]">Outcome Post-Test (L2):</span>
              <strong className="text-[#243B53]">
                {ev?.avgPostTestScore !== null && ev?.avgPostTestScore !== undefined
                  ? `${ev.avgPostTestScore} / 4.00`
                  : 'Belum ada data'}
              </strong>
            </div>
            <div className="flex justify-between border-t border-[#E2E6E3] pt-2">
              <span className="text-[#78838A] font-medium">Delta Berpasangan (Post - Pre):</span>
              <strong
                className={
                  ev?.deltaLearningScore !== null && ev?.deltaLearningScore > 0
                    ? 'text-[#059669]'
                    : ev?.deltaLearningScore !== null && ev?.deltaLearningScore < 0
                    ? 'text-[#B51F36]'
                    : 'text-[#243B53]'
                }
              >
                {ev?.deltaLearningScore !== null && ev?.deltaLearningScore !== undefined
                  ? `${ev.deltaLearningScore > 0 ? '+' : ''}${ev.deltaLearningScore} poin (${ev?.matchedPairsCount || 0} pasang)`
                  : 'Menunggu kedua tes terisi'}
              </strong>
            </div>
          </div>
        </div>

        {/* Level 3 & 4 Card */}
        <div className="p-6 bg-white rounded-3xl border border-[#E2E6E3] shadow-xs space-y-3">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-[#49316F]/10 text-[#49316F]">
              <HeartPulse className="w-4 h-4" />
            </span>
            <h3 className="text-sm font-bold text-[#243B53]">
              Level 3 (Perilaku Kerja) & Level 4 (Hasil/Dampak)
            </h3>
          </div>
          <p className="text-xs text-[#78838A] leading-relaxed">
            Level 3 memantau frekuensi penerapan keterampilan mikro di tempat kerja. Level 4 mengukur persepsi dampak jangka menengah terhadap efektivitas dan keseimbangan kerja.
          </p>
          <div className="p-4 bg-[#F7F5F8] rounded-2xl border border-[#E2E6E3] text-xs space-y-2.5">
            <div className="flex justify-between">
              <span className="text-[#78838A]">Frekuensi Penerimaan Perilaku (L3):</span>
              <strong className="text-[#243B53]">{ev?.behaviorResponsesCount || 0} Pengisian</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-[#78838A]">Persepsi Dampak Organisasional (L4):</span>
              <strong className="text-[#243B53]">{ev?.resultsResponsesCount || 0} Pengisian</strong>
            </div>
            <div className="flex justify-between border-t border-[#E2E6E3] pt-2">
              <span className="text-[#78838A] font-medium">Struktur Ekspor Riset:</span>
              <span className="text-[#B51F36] font-semibold">Tersedia via 6-Sheet XLSX</span>
            </div>
          </div>
        </div>
      </div>

      {/* Non-Clinical Ethical Disclaimer Banner */}
      <div className="p-5 bg-white border border-[#E2E6E3] rounded-3xl flex items-start gap-3.5 text-xs text-[#29343B] leading-relaxed shadow-xs">
        <div className="p-2 rounded-xl bg-[#E5EEE8] text-[#243B53] shrink-0 mt-0.5">
          <Info className="w-4 h-4 text-[#243B53]" />
        </div>
        <div>
          <strong className="text-[#243B53] block mb-0.5 font-bold">
            Etika Penelitian & Batasan Intervensi Non-Klinis:
          </strong>
          Seluruh data evaluasi bersumber dari pengisian riil peserta untuk keperluan pemantauan program intervensi dan peningkatan mutu berkelanjutan. SmartWorkCare dirancang sebagai program psikoedukasi dan intervensi kesejahteraan psikologis karyawan, bukan instrumen diagnosis psikopatologi klinis. Data agregat tidak boleh dijadikan instrumen pemeringkatan atau sanksi terhadap peserta.
        </div>
      </div>
    </div>
  );
};
