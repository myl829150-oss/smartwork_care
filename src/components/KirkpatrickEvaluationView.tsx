import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  ClipboardCheck,
  CheckCircle2,
  TrendingUp,
  Sparkles,
  Info,
  HelpCircle,
  FileCheck,
  Award,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Heart,
  Target,
  Compass,
} from 'lucide-react';
import { PWB_EVALUATION_ITEMS, PWBTestItem, PWB_DIMENSIONS_INFO } from '../data/programData';
import { PWBDimension } from '../types';

export const KirkpatrickEvaluationView: React.FC = () => {
  const { token, user } = useAuth();
  const [activeTab, setActiveTab] = useState<'pre_test' | 'post_test' | 'l1' | 'l3_l4'>('pre_test');

  // Evaluation status from server
  const [evalStatus, setEvalStatus] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Form states: Pre-Test & Post-Test (Scale 1 to 4)
  const [preTestAnswers, setPreTestAnswers] = useState<Record<string, number>>({});
  const [postTestAnswers, setPostTestAnswers] = useState<Record<string, number>>({});

  // Level 1: Reaction (Scale 1 to 4)
  const [l1Ratings, setL1Ratings] = useState({
    relevance: 4,
    clarity: 4,
    activityQuality: 4,
    aiReflectionUsefulness: 4,
    platformUsability: 4,
    durationPacing: 4,
    overallSatisfaction: 4,
  });
  const [l1Helpful, setL1Helpful] = useState('');
  const [l1Challenging, setL1Challenging] = useState('');
  const [l1Suggestions, setL1Suggestions] = useState('');

  // Level 3: Behavior (Frequencies 1 to 4)
  const [l3Frequencies, setL3Frequencies] = useState<Record<string, string>>({
    recognizeLimitsWithoutSelfBlame: 'Sering',
    constructiveAssertiveCommunication: 'Sering',
    alignDecisionsWithPersonalValues: 'Sering',
    prioritizeWorkTasksStructured: 'Sering',
    leverageSupportAndResources: 'Sering',
    connectWorkWithMeaningfulGoals: 'Sering',
    extractLearningFromWorkExperiences: 'Sering',
  });
  const [l3WorkChanges, setL3WorkChanges] = useState('');
  const [l3HelpfulFactors, setL3HelpfulFactors] = useState('');

  // Level 4: Results (Scale 1 to 4)
  const [l4Demands, setL4Demands] = useState(4);
  const [l4Relations, setL4Relations] = useState(4);
  const [l4Purpose, setL4Purpose] = useState(4);
  const [l4Overall, setL4Overall] = useState(4);
  const [l4Notes, setL4Notes] = useState('');

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const res = await fetch('/api/evaluations/my-status', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setEvalStatus(data);

        // Prepopulate existing pre_test answers if available
        if (data.preTest?.answers && Array.isArray(data.preTest.answers)) {
          const preMap: Record<string, number> = {};
          data.preTest.answers.forEach((a: any) => {
            if (a.questionId && typeof a.score === 'number') {
              preMap[a.questionId] = a.score;
            }
          });
          setPreTestAnswers(preMap);
        }

        // Prepopulate existing post_test answers if available
        if (data.postTest?.answers && Array.isArray(data.postTest.answers)) {
          const postMap: Record<string, number> = {};
          data.postTest.answers.forEach((a: any) => {
            if (a.questionId && typeof a.score === 'number') {
              postMap[a.questionId] = a.score;
            }
          });
          setPostTestAnswers(postMap);
        }

        // Prepopulate L1 if available
        if (data.reaction?.ratings) {
          setL1Ratings(data.reaction.ratings);
          setL1Helpful(data.reaction.openFeedback?.mostHelpfulPart || '');
          setL1Challenging(data.reaction.openFeedback?.challengingPart || '');
          setL1Suggestions(data.reaction.openFeedback?.improvementSuggestions || '');
        }

        // Prepopulate L3 if available
        if (data.behavior?.frequencies) {
          setL3Frequencies(data.behavior.frequencies);
          setL3WorkChanges(data.behavior.reflections?.workPracticeChanges || '');
          setL3HelpfulFactors(data.behavior.reflections?.helpfulFactors || '');
        }

        // Prepopulate L4 if available
        if (data.results) {
          setL4Demands(data.results.perceivedDemandsManagement || 4);
          setL4Relations(data.results.perceivedWorkRelationships || 4);
          setL4Purpose(data.results.perceivedPurposeClarity || 4);
          setL4Overall(data.results.perceivedOverallBenefit || 4);
          setL4Notes(data.results.notes || '');
        }
      }
    } catch (e) {
      console.error('Failed to fetch status:', e);
    } finally {
      setIsLoading(false);
    }
  };

  // Pre-Test & Post-Test Handler
  const handlePWBTestSubmit = async (testType: 'pre_test' | 'post_test') => {
    setValidationError(null);
    setSuccessBanner(null);

    const answers = testType === 'pre_test' ? preTestAnswers : postTestAnswers;
    const answeredCount = Object.keys(answers).length;

    if (answeredCount < PWB_EVALUATION_ITEMS.length) {
      setValidationError(
        `Harap jawab seluruh pertanyaan (${answeredCount} dari ${PWB_EVALUATION_ITEMS.length} butir telah diisi). Jawaban kosong tidak dianggap nol.`
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/evaluations/level2-learning', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          type: testType,
          userAnswers: answers,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setSuccessBanner(
          `Evaluasi ${testType === 'pre_test' ? 'Pre-Test' : 'Post-Test'} PWB berhasil disimpan! Skor rata-rata Anda: ${data.evaluation.averageScore} / 4.00.`
        );
        fetchStatus();
      } else {
        const err = await res.json();
        setValidationError(err.error || 'Gagal menyimpan evaluasi.');
      }
    } catch (e) {
      console.error(e);
      setValidationError('Terjadi kesalahan jaringan saat menyimpan.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Level 1 Reaction Submit
  const handleL1Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    setSuccessBanner(null);
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/evaluations/level1-reaction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ratings: l1Ratings,
          openFeedback: {
            mostHelpfulPart: l1Helpful,
            challengingPart: l1Challenging,
            improvementSuggestions: l1Suggestions,
          },
        }),
      });
      if (res.ok) {
        setSuccessBanner('Evaluasi Pengalaman Program (Level 1: Reaction) berhasil disimpan.');
        fetchStatus();
      }
    } catch (e) {
      console.error(e);
      setValidationError('Gagal menyimpan evaluasi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Level 3 & 4 Submit
  const handleL3L4Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    setSuccessBanner(null);
    setIsSubmitting(true);
    try {
      // Send Level 3
      const res3 = await fetch('/api/evaluations/level3-behavior', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          frequencies: l3Frequencies,
          reflections: {
            workPracticeChanges: l3WorkChanges,
            helpfulFactors: l3HelpfulFactors,
          },
        }),
      });

      // Send Level 4
      const res4 = await fetch('/api/evaluations/level4-results', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          perceivedDemandsManagement: l4Demands,
          perceivedWorkRelationships: l4Relations,
          perceivedPurposeClarity: l4Purpose,
          perceivedOverallBenefit: l4Overall,
          notes: l4Notes,
        }),
      });

      if (res3.ok && res4.ok) {
        setSuccessBanner('Evaluasi Penerapan Pembelajaran (Level 3 & Level 4) berhasil disimpan.');
        fetchStatus();
      }
    } catch (e) {
      console.error(e);
      setValidationError('Gagal menyimpan evaluasi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Status helper
  const getStatusBadge = (statusObj: any) => {
    if (!statusObj) {
      return (
        <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-gray-100 text-[#78838A]">
          Belum Diisi
        </span>
      );
    }
    if (statusObj.status === 'Selesai' || (statusObj.averageScore && statusObj.averageScore > 0)) {
      return (
        <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-[#FDF2F4] text-[#B51F36] border border-[#B51F36]/20 flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5 text-[#B51F36]" />
          Selesai
        </span>
      );
    }
    return (
      <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-amber-50 text-amber-700 border border-amber-200">
        Belum Lengkap
      </span>
    );
  };

  const scaleLabelMap = [
    { value: 1, label: 'Sangat Tidak Setuju (STS)' },
    { value: 2, label: 'Tidak Setuju (TS)' },
    { value: 3, label: 'Setuju (S)' },
    { value: 4, label: 'Sangat Setuju (SS)' },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 bg-white rounded-3xl border border-[#D98BAA]/30 shadow-xs relative overflow-hidden">
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FDF2F4] text-[#B51F36] text-xs font-bold border border-[#B51F36]/20">
            <ClipboardCheck className="w-3.5 h-3.5 text-[#B51F36]" />
            <span>Audit & Evaluasi Efektivitas Intervensi</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#243B53] tracking-tight font-['Plus_Jakarta_Sans']">
            Evaluasi Psychological Well-Being
          </h1>
          <p className="text-xs sm:text-sm text-[#78838A] leading-relaxed">
            Pengukuran perubahan persepsi kesejahteraan diri sebelum dan sesudah program intervensi 4 minggu menggunakan instrumen berbasis kerangka Carol D. Ryff (Skala 1–4) serta evaluasi pengalaman program model Kirkpatrick.
          </p>
        </div>

        {/* 4 Navigation Tabs */}
        <div className="mt-6 pt-4 border-t border-gray-100 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => {
              setActiveTab('pre_test');
              setValidationError(null);
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
              activeTab === 'pre_test'
                ? 'bg-[#B51F36] text-white shadow-xs'
                : 'bg-[#F7F5F8] text-[#243B53] hover:bg-[#FDF2F4]'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>1. Pre-Test (Baseline PWB)</span>
            {evalStatus?.preTest && <CheckCircle2 className="w-3.5 h-3.5 ml-1" />}
          </button>

          <button
            onClick={() => {
              setActiveTab('post_test');
              setValidationError(null);
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
              activeTab === 'post_test'
                ? 'bg-[#B51F36] text-white shadow-xs'
                : 'bg-[#F7F5F8] text-[#243B53] hover:bg-[#FDF2F4]'
            }`}
          >
            <Target className="w-4 h-4" />
            <span>2. Post-Test (PWB Akhir)</span>
            {evalStatus?.postTest && <CheckCircle2 className="w-3.5 h-3.5 ml-1" />}
          </button>

          <button
            onClick={() => {
              setActiveTab('l1');
              setValidationError(null);
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
              activeTab === 'l1'
                ? 'bg-[#49316F] text-white shadow-xs'
                : 'bg-[#F7F5F8] text-[#243B53] hover:bg-[#F5F0FB]'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>3. Evaluasi Pengalaman Program</span>
            {evalStatus?.reaction && <CheckCircle2 className="w-3.5 h-3.5 ml-1" />}
          </button>

          <button
            onClick={() => {
              setActiveTab('l3_l4');
              setValidationError(null);
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
              activeTab === 'l3_l4'
                ? 'bg-[#243B53] text-white shadow-xs'
                : 'bg-[#F7F5F8] text-[#243B53] hover:bg-[#EDF2F7]'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>4. Penerapan & Dampak Kerja</span>
            {evalStatus?.behavior && <CheckCircle2 className="w-3.5 h-3.5 ml-1" />}
          </button>
        </div>
      </div>

      {/* Alert Banners */}
      {successBanner && (
        <div className="p-4 rounded-2xl bg-green-50 border border-green-200 flex items-center justify-between text-xs sm:text-sm text-green-800">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
            <span>{successBanner}</span>
          </div>
          <button
            onClick={() => setSuccessBanner(null)}
            className="text-xs font-bold text-green-700 hover:underline"
          >
            Tutup
          </button>
        </div>
      )}

      {validationError && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-between text-xs sm:text-sm text-red-800">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 text-[#B51F36] shrink-0" />
            <span>{validationError}</span>
          </div>
          <button
            onClick={() => setValidationError(null)}
            className="text-xs font-bold text-[#B51F36] hover:underline"
          >
            Tutup
          </button>
        </div>
      )}

      {/* TAB 1: PRE-TEST (BASELINE PWB) */}
      {activeTab === 'pre_test' && (
        <div className="bg-white rounded-3xl border border-[#D98BAA]/30 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-gray-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#B51F36] uppercase tracking-wider">
                  Instrumen Awal (Pre-Test)
                </span>
                {getStatusBadge(evalStatus?.preTest)}
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-[#243B53] mt-0.5">
                Pengukuran Awal Psychological Well-Being (6 Dimensi Carol D. Ryff)
              </h2>
              <p className="text-xs text-[#78838A] mt-1">
                Gunakan skala 1–4 untuk menyatakan tingkat persetujuan Anda yang paling menggambarkan kondisi kerja saat ini.
              </p>
            </div>

            {/* Answered Counter */}
            <div className="p-3 bg-[#FDF2F4] rounded-2xl border border-[#B51F36]/20 text-center min-w-[130px]">
              <span className="text-[10px] font-bold text-[#78838A] block">Kemajuan Pengisian</span>
              <p className="text-sm font-extrabold text-[#B51F36]">
                {Object.keys(preTestAnswers).length} / {PWB_EVALUATION_ITEMS.length} Butir
              </p>
            </div>
          </div>

          {/* Scale Legend */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            {scaleLabelMap.map((s) => (
              <div key={s.value} className="p-2.5 rounded-xl bg-[#F7F5F8] border border-[#D98BAA]/20 text-center">
                <span className="font-extrabold text-[#243B53] block text-sm">{s.value}</span>
                <span className="text-[11px] text-[#78838A]">{s.label}</span>
              </div>
            ))}
          </div>

          {/* Questions List */}
          <div className="space-y-4 pt-2">
            {PWB_EVALUATION_ITEMS.map((item, idx) => {
              const currentVal = preTestAnswers[item.id];
              return (
                <div
                  key={item.id}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                    currentVal
                      ? 'bg-white border-[#B51F36]/40 shadow-xs ring-1 ring-[#B51F36]/20'
                      : 'bg-[#F7F5F8]/50 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <span className="text-[10px] font-bold text-[#49316F] uppercase tracking-wider block mb-1">
                        Butir {idx + 1} • {item.dimensionLabel}
                      </span>
                      <p className="text-xs sm:text-sm font-semibold text-[#243B53] leading-relaxed">
                        "{item.statement}"
                      </p>
                    </div>
                    {currentVal ? (
                      <span className="shrink-0 px-2.5 py-0.5 rounded-lg text-xs font-extrabold bg-[#B51F36] text-white">
                        Skor: {currentVal}
                      </span>
                    ) : (
                      <span className="shrink-0 text-[10px] text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded-md">
                        Belum Diisi
                      </span>
                    )}
                  </div>

                  {/* 4 Scale Buttons */}
                  <div className="grid grid-cols-4 gap-2 pt-1">
                    {[1, 2, 3, 4].map((score) => (
                      <button
                        key={score}
                        type="button"
                        onClick={() => {
                          setPreTestAnswers((prev) => ({ ...prev, [item.id]: score }));
                          setValidationError(null);
                        }}
                        className={`py-2 sm:py-2.5 px-1 rounded-xl text-xs sm:text-sm font-bold transition-all text-center ${
                          currentVal === score
                            ? 'bg-[#B51F36] text-white shadow-xs'
                            : 'bg-white text-[#243B53] border border-gray-200 hover:bg-[#FDF2F4] hover:border-[#B51F36]/30'
                        }`}
                      >
                        <span className="block text-sm">{score}</span>
                        <span className="text-[10px] font-medium hidden sm:block">
                          {score === 1 ? 'Sangat Tidak Setuju' : score === 2 ? 'Tidak Setuju' : score === 3 ? 'Setuju' : 'Sangat Setuju'}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Submit Action */}
          <div className="pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-4">
            <div className="text-xs text-[#78838A]">
              <span>Skor total dihitung dari 12 butir (12–48). Jawaban kosong tidak dianggap nol.</span>
            </div>

            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => handlePWBTestSubmit('pre_test')}
              className="px-6 py-3 rounded-2xl bg-[#B51F36] text-white hover:bg-[#96192c] active:scale-[0.99] transition-all text-xs sm:text-sm font-bold flex items-center gap-2 shadow-md disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isSubmitting ? 'Menyimpan...' : 'Simpan Evaluasi Pre-Test'}</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: POST-TEST (PWB AKHIR & MATCHED PAIR COMPARISON) */}
      {activeTab === 'post_test' && (
        <div className="bg-white rounded-3xl border border-[#D98BAA]/30 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-gray-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#B51F36] uppercase tracking-wider">
                  Instrumen Akhir (Post-Test)
                </span>
                {getStatusBadge(evalStatus?.postTest)}
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-[#243B53] mt-0.5">
                Pengukuran Akhir Psychological Well-Being Pasca Intervensi 4 Minggu
              </h2>
              <p className="text-xs text-[#78838A] mt-1">
                Isi instrumen ini setelah menyelesaikan rangkaian misi mingguan untuk mengukur perubahan persepsi kesejahteraan Anda.
              </p>
            </div>

            <div className="p-3 bg-[#FDF2F4] rounded-2xl border border-[#B51F36]/20 text-center min-w-[130px]">
              <span className="text-[10px] font-bold text-[#78838A] block">Kemajuan Pengisian</span>
              <p className="text-sm font-extrabold text-[#B51F36]">
                {Object.keys(postTestAnswers).length} / {PWB_EVALUATION_ITEMS.length} Butir
              </p>
            </div>
          </div>

          {/* Matched Pair Comparison Card if both Pre and Post are completed */}
          {evalStatus?.preTest && evalStatus?.postTest && (
            <div className="p-5 rounded-2xl bg-gradient-to-r from-[#FDF2F4] via-white to-[#F5F0FB] border border-[#B51F36]/30 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-[#B51F36]" />
                  <h3 className="text-sm font-bold text-[#243B53]">
                    Perbandingan Hasil Pre-Test vs Post-Test (Matched Pair)
                  </h3>
                </div>
                <span className="text-[11px] font-bold text-[#059669] bg-green-50 px-2.5 py-0.5 rounded-full border border-green-200">
                  Data Berpasangan Valid
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-center">
                <div className="p-3 bg-white rounded-xl border border-gray-200">
                  <span className="text-[11px] text-[#78838A] font-medium">Rata-rata Pre-Test</span>
                  <p className="text-lg font-bold text-[#243B53] mt-0.5">
                    {evalStatus.preTest.averageScore} <span className="text-xs font-normal text-[#78838A]">/ 4.00</span>
                  </p>
                </div>

                <div className="p-3 bg-white rounded-xl border border-gray-200">
                  <span className="text-[11px] text-[#78838A] font-medium">Rata-rata Post-Test</span>
                  <p className="text-lg font-bold text-[#243B53] mt-0.5">
                    {evalStatus.postTest.averageScore} <span className="text-xs font-normal text-[#78838A]">/ 4.00</span>
                  </p>
                </div>

                <div className="p-3 bg-white rounded-xl border border-gray-200">
                  <span className="text-[11px] text-[#78838A] font-medium">Delta Peningkatan</span>
                  <p className="text-lg font-extrabold text-[#B51F36] mt-0.5">
                    {Number(evalStatus.postTest.averageScore - evalStatus.preTest.averageScore) >= 0 ? '+' : ''}
                    {Number((evalStatus.postTest.averageScore - evalStatus.preTest.averageScore).toFixed(2))}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Scale Legend */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            {scaleLabelMap.map((s) => (
              <div key={s.value} className="p-2.5 rounded-xl bg-[#F7F5F8] border border-[#D98BAA]/20 text-center">
                <span className="font-extrabold text-[#243B53] block text-sm">{s.value}</span>
                <span className="text-[11px] text-[#78838A]">{s.label}</span>
              </div>
            ))}
          </div>

          {/* Questions List */}
          <div className="space-y-4 pt-2">
            {PWB_EVALUATION_ITEMS.map((item, idx) => {
              const currentVal = postTestAnswers[item.id];
              return (
                <div
                  key={item.id}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                    currentVal
                      ? 'bg-white border-[#B51F36]/40 shadow-xs ring-1 ring-[#B51F36]/20'
                      : 'bg-[#F7F5F8]/50 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <span className="text-[10px] font-bold text-[#49316F] uppercase tracking-wider block mb-1">
                        Butir {idx + 1} • {item.dimensionLabel}
                      </span>
                      <p className="text-xs sm:text-sm font-semibold text-[#243B53] leading-relaxed">
                        "{item.statement}"
                      </p>
                    </div>
                    {currentVal ? (
                      <span className="shrink-0 px-2.5 py-0.5 rounded-lg text-xs font-extrabold bg-[#B51F36] text-white">
                        Skor: {currentVal}
                      </span>
                    ) : (
                      <span className="shrink-0 text-[10px] text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded-md">
                        Belum Diisi
                      </span>
                    )}
                  </div>

                  {/* 4 Scale Buttons */}
                  <div className="grid grid-cols-4 gap-2 pt-1">
                    {[1, 2, 3, 4].map((score) => (
                      <button
                        key={score}
                        type="button"
                        onClick={() => {
                          setPostTestAnswers((prev) => ({ ...prev, [item.id]: score }));
                          setValidationError(null);
                        }}
                        className={`py-2 sm:py-2.5 px-1 rounded-xl text-xs sm:text-sm font-bold transition-all text-center ${
                          currentVal === score
                            ? 'bg-[#B51F36] text-white shadow-xs'
                            : 'bg-white text-[#243B53] border border-gray-200 hover:bg-[#FDF2F4] hover:border-[#B51F36]/30'
                        }`}
                      >
                        <span className="block text-sm">{score}</span>
                        <span className="text-[10px] font-medium hidden sm:block">
                          {score === 1 ? 'Sangat Tidak Setuju' : score === 2 ? 'Tidak Setuju' : score === 3 ? 'Setuju' : 'Sangat Setuju'}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Submit Action */}
          <div className="pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-4">
            <div className="text-xs text-[#78838A]">
              <span>Perbandingan pre/post hanya dilakukan jika kedua instrumen terisi lengkap.</span>
            </div>

            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => handlePWBTestSubmit('post_test')}
              className="px-6 py-3 rounded-2xl bg-[#B51F36] text-white hover:bg-[#96192c] active:scale-[0.99] transition-all text-xs sm:text-sm font-bold flex items-center gap-2 shadow-md disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isSubmitting ? 'Menyimpan...' : 'Simpan Evaluasi Post-Test'}</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: EVALUASI PENGALAMAN PROGRAM (LEVEL 1: REACTION) */}
      {activeTab === 'l1' && (
        <form onSubmit={handleL1Submit} className="bg-white rounded-3xl border border-[#D98BAA]/30 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="pb-4 border-b border-gray-100 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#49316F] uppercase tracking-wider">
                  Evaluasi Pengalaman Program (Level 1: Reaction)
                </span>
                {getStatusBadge(evalStatus?.reaction)}
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-[#243B53] mt-0.5">
                Kepuasan & Kemanfaatan Program SmartWorkCare
              </h2>
              <p className="text-xs text-[#78838A] mt-1">
                Nilai setiap aspek dengan skala 1 (Sangat Tidak Puas) sampai 4 (Sangat Puas).
              </p>
            </div>
          </div>

          {/* Ratings Grid */}
          <div className="space-y-4">
            {[
              { key: 'relevance', label: '1. Relevansi materi intervensi dengan dinamika dunia kerja Anda' },
              { key: 'clarity', label: '2. Kejelasan instruksi dan panduan studi kasus pada tiap sesi' },
              { key: 'activityQuality', label: '3. Kualitas interaksi permainan pilihan respons & simulasi' },
              { key: 'aiReflectionUsefulness', label: '4. Kemanfaatan dan empati dialog pada Ruang Refleksi AI' },
              { key: 'platformUsability', label: '5. Kemudahan penggunaan dan kenyamanan antarmuka web' },
              { key: 'durationPacing', label: '6. Alokasi durasi dan kecepatan tahapan program selama 4 minggu' },
              { key: 'overallSatisfaction', label: '7. Kepuasan umum Anda secara keseluruhan terhadap program' },
            ].map((item) => {
              const currentScore = (l1Ratings as any)[item.key];
              return (
                <div key={item.key} className="p-4 rounded-2xl bg-[#F7F5F8] border border-[#D98BAA]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <span className="text-xs sm:text-sm font-semibold text-[#243B53] max-w-md">
                    {item.label}
                  </span>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {[1, 2, 3, 4].map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setL1Ratings({ ...l1Ratings, [item.key]: val })}
                        className={`w-10 h-10 rounded-xl font-bold text-xs transition-all ${
                          currentScore === val
                            ? 'bg-[#49316F] text-white shadow-xs'
                            : 'bg-white text-[#243B53] border border-gray-200 hover:bg-[#F5F0FB]'
                        }`}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Open Feedback */}
          <div className="space-y-3 pt-2">
            <h3 className="text-sm font-bold text-[#243B53]">Umpan Balik Kualitatif (Opsional)</h3>

            <div>
              <label className="block text-xs font-semibold text-[#243B53] mb-1">
                Aspek apa yang paling memberikan dampak positif bagi Anda?
              </label>
              <textarea
                rows={2}
                value={l1Helpful}
                onChange={(e) => setL1Helpful(e.target.value)}
                placeholder="Contoh: Pembahasan pemisahan kesalahan kerja dari harga diri di Minggu 1..."
                className="w-full p-3 rounded-xl border border-gray-200 text-xs sm:text-sm text-[#29343B] focus:ring-2 focus:ring-[#49316F] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#243B53] mb-1">
                Saran perbaikan untuk fasilitator dan tim pengembang:
              </label>
              <textarea
                rows={2}
                value={l1Suggestions}
                onChange={(e) => setL1Suggestions(e.target.value)}
                placeholder="Contoh: Tambahkan lebih banyak variasi skenario industri..."
                className="w-full p-3 rounded-xl border border-gray-200 text-xs sm:text-sm text-[#29343B] focus:ring-2 focus:ring-[#49316F] focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 rounded-2xl bg-[#49316F] text-white hover:bg-[#392657] font-bold text-xs sm:text-sm transition-all shadow-md disabled:opacity-50 flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isSubmitting ? 'Menyimpan...' : 'Kirim Evaluasi Pengalaman Program'}</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB 4: EVALUASI PENERAPAN & DAMPAK (LEVEL 3 & 4) */}
      {activeTab === 'l3_l4' && (
        <form onSubmit={handleL3L4Submit} className="bg-white rounded-3xl border border-[#D98BAA]/30 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="pb-4 border-b border-gray-100 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#243B53] uppercase tracking-wider">
                  Evaluasi Penerapan Pembelajaran (Level 3: Behavior & Level 4: Results)
                </span>
                {getStatusBadge(evalStatus?.behavior)}
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-[#243B53] mt-0.5">
                Frekuensi Penerapan Praktik Sehat & Dampak Kinerja
              </h2>
              <p className="text-xs text-[#78838A] mt-1">
                Bagikan sejauh mana prinsip kesejahteraan telah Anda praktikkan dalam rutinitas kerja sehari-hari.
              </p>
            </div>
          </div>

          {/* Level 3 Behavior Questions */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-[#243B53] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#B51F36]" />
              <span>Frekuensi Perilaku Nyata di Tempat Kerja (Level 3)</span>
            </h3>

            {[
              { key: 'recognizeLimitsWithoutSelfBlame', label: '1. Mengenali batas kapasitas kerja diri tanpa menyalahkan diri secara destruktif' },
              { key: 'constructiveAssertiveCommunication', label: '2. Menggunakan komunikasi asertif yang sopan saat menghadapi perbedaan pendapat' },
              { key: 'prioritizeWorkTasksStructured', label: '3. Menyusun 3 prioritas tugas terpenting sebelum memulai aktivitas pagi hari' },
              { key: 'connectWorkWithMeaningfulGoals', label: '4. Menghubungkan rutinitas kerja harian dengan dampak nyata bagi orang lain' },
            ].map((b) => {
              const currentFreq = l3Frequencies[b.key] || 'Sering';
              return (
                <div key={b.key} className="p-4 rounded-2xl bg-[#F7F5F8] border border-[#D98BAA]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <span className="text-xs sm:text-sm font-semibold text-[#243B53] max-w-md">
                    {b.label}
                  </span>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {['Tidak Pernah', 'Jarang', 'Sering', 'Selalu'].map((f) => (
                      <button
                        key={f}
                        type="button"
                        onClick={() => setL3Frequencies({ ...l3Frequencies, [b.key]: f })}
                        className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                          currentFreq === f
                            ? 'bg-[#243B53] text-white shadow-xs'
                            : 'bg-white text-[#243B53] border border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Level 4 Results Questions */}
          <div className="space-y-4 pt-4 border-t border-gray-100">
            <h3 className="text-sm font-bold text-[#243B53] flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#49316F]" />
              <span>Persepsi Dampak terhadap Hasil & Lingkungan Kerja (Level 4: Skala 1–4)</span>
            </h3>

            {[
              { val: l4Demands, setter: setL4Demands, label: 'Ketenangan dan kendali dalam mengelola tuntutan kerja mendesak' },
              { val: l4Relations, setter: setL4Relations, label: 'Keharmonisan dan rasa saling percaya dalam kerja sama tim' },
              { val: l4Purpose, setter: setL4Purpose, label: 'Kejelasan makna dan motivasi intrinsik dalam menyelesaikan tanggung jawab' },
              { val: l4Overall, setter: setL4Overall, label: 'Manfaat nyata program terhadap kualitas hidup kerja Anda secara menyeluruh' },
            ].map((res, i) => (
              <div key={i} className="p-4 rounded-2xl bg-[#F7F5F8] border border-[#D98BAA]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <span className="text-xs sm:text-sm font-semibold text-[#243B53] max-w-md">
                  {i + 1}. {res.label}
                </span>
                <div className="flex items-center gap-1.5 shrink-0">
                  {[1, 2, 3, 4].map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => res.setter(v)}
                      className={`w-10 h-10 rounded-xl font-bold text-xs transition-all ${
                        res.val === v
                          ? 'bg-[#B51F36] text-white shadow-xs'
                          : 'bg-white text-[#243B53] border border-gray-200 hover:bg-[#FDF2F4]'
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Qualitative Reflection */}
          <div className="pt-2">
            <label className="block text-xs font-semibold text-[#243B53] mb-1">
              Perubahan nyata apa yang Anda rasakan dalam cara Anda bekerja setelah mengikuti program?
            </label>
            <textarea
              rows={2}
              value={l3WorkChanges}
              onChange={(e) => setL3WorkChanges(e.target.value)}
              placeholder="Contoh: Saya lebih tenang menghadapi revisi mendadak dan tidak lagi menunda komunikasi batasan..."
              className="w-full p-3 rounded-xl border border-gray-200 text-xs sm:text-sm text-[#29343B] focus:ring-2 focus:ring-[#243B53] focus:outline-none"
            />
          </div>

          <div className="pt-4 border-t border-gray-100 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 rounded-2xl bg-[#243B53] text-white hover:bg-[#1a2c3f] font-bold text-xs sm:text-sm transition-all shadow-md disabled:opacity-50 flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 text-green-400" />
              <span>{isSubmitting ? 'Menyimpan...' : 'Simpan Evaluasi Penerapan (L3 & L4)'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Ethical Non-Clinical Disclaimer */}
      <div className="p-4 rounded-2xl bg-white border border-[#D98BAA]/30 text-center text-xs text-[#78838A] leading-relaxed">
        <p>
          <strong>Catatan Etika Pengukuran:</strong> Seluruh instrumen dalam SmartWorkCare dirancang untuk tujuan edukatif dan pengembangan kapasitas adaptasi kerja (Psychological Well-Being), serta <strong>bukan</strong> instrumen diagnosis klinis medis atau psikiatris.
        </p>
      </div>
    </div>
  );
};
