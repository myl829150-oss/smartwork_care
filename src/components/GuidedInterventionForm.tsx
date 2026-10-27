import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  Heart,
  Lightbulb,
  Compass,
  Target,
  Shield,
  HelpCircle,
  Clock,
  BookOpen,
} from 'lucide-react';

interface GuidedInterventionFormProps {
  onBackToDashboard: () => void;
  onNavigateTab: (tab: string) => void;
}

export const GuidedInterventionForm: React.FC<GuidedInterventionFormProps> = ({
  onBackToDashboard,
  onNavigateTab,
}) => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState<number>(0);

  // Form responses state
  const [selectedCase1, setSelectedCase1] = useState<string | null>(null);
  const [case1Feedback, setCase1Feedback] = useState<any | null>(null);

  const [reflection1, setReflection1] = useState('');
  const [action1, setAction1] = useState('');

  const [selectedCase2, setSelectedCase2] = useState<string | null>(null);
  const [case2Feedback, setCase2Feedback] = useState<any | null>(null);

  const [reflection2, setReflection2] = useState('');
  const [action2, setAction2] = useState('');

  const [priorityRating, setPriorityRating] = useState<number>(4);
  const [boundaryRating, setBoundaryRating] = useState<number>(4);
  const [meaningStatement, setMeaningStatement] = useState('');
  const [finalCommitment, setFinalCommitment] = useState('');

  // Total steps in this guided multi-step journey
  const TOTAL_STEPS = 14;

  const handleCase1Select = (optId: string) => {
    setSelectedCase1(optId);
    if (optId === 'a') {
      setCase1Feedback({
        title: 'Respons Problem-Focused Coping (Sangat Konstruktif)',
        desc: 'Mengakui kekeliruan dengan tenang dan segera menyiapkan perbaikan menunjukkan kedewasaan emosional yang tinggi (Self-Acceptance). Anda memisahkan kesalahan tindakan dari nilai diri secara utuh.',
      });
    } else if (optId === 'b') {
      setCase1Feedback({
        title: 'Respons Menghakimi Diri Sendiri',
        desc: 'Menyalahkan diri secara destruktif justru memperbesar kecemasan dan menghambat tindakan perbaikan objektif. Ingat, kekeliruan adalah data belajar untuk perbaikan proses.',
      });
    } else {
      setCase1Feedback({
        title: 'Respons Menghindar / Defensif',
        desc: 'Mengalihkan kesalahan dapat menurunkan rasa percaya dalam tim. Komunikasi terbuka dan akuntabel selalu lebih menyehatkan bagi relasi jangka panjang.',
      });
    }
  };

  const handleCase2Select = (optId: string) => {
    setSelectedCase2(optId);
    if (optId === 'a') {
      setCase2Feedback({
        title: 'Komunikasi Asertif & Win-Win',
        desc: 'Mendengarkan niat baik rekan kerja sambil tetap menawarkan alternatif yang aman mencerminkan keharmonisan relasi kerja (Positive Relations) tanpa mengorbankan kualitas kerja.',
      });
    } else {
      setCase2Feedback({
        title: 'Penghindaran Pasif atau Defensif',
        desc: 'Mengalah tanpa menyampaikan masukan membuat Anda memendam frustrasi. Sebaliknya, menyerang rekan merusak rasa aman psikologis tim.',
      });
    }
  };

  const progressPercent = Math.round((currentStep / (TOTAL_STEPS - 1)) * 100);

  return (
    <div className="max-w-3xl mx-auto space-y-6 py-2">
      {/* Top Header with Progress Bar */}
      <div className="bg-white p-5 rounded-2xl border border-[#E2E6E3] shadow-xs space-y-3">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-[#E5EEE8] text-[#243B53]">
              <Compass className="w-4 h-4 text-[#6B9B91]" />
            </span>
            <span className="font-bold text-[#243B53]">
              Alur Terpandu SmartWorkCare: 4 Minggu Intervensi
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[#78838A] font-medium">
              Langkah {currentStep + 1} dari {TOTAL_STEPS}
            </span>
            <span className="px-2 py-0.5 rounded-full bg-[#E5EEE8] text-[#243B53] font-bold text-[11px]">
              {progressPercent}%
            </span>
          </div>
        </div>

        {/* Smooth Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <div
            style={{ width: `${progressPercent}%` }}
            className="bg-[#6B9B91] h-full rounded-full transition-all duration-300"
          ></div>
        </div>
      </div>

      {/* STEP CONTAINER: CARD-BY-CARD EXPERIENCE */}
      <div className="bg-white rounded-3xl border border-[#E2E6E3] shadow-sm p-6 sm:p-10 min-h-[420px] flex flex-col justify-between">
        {/* STEP 0: Pembukaan Formulir */}
        {currentStep === 0 && (
          <div className="space-y-4 my-auto">
            <div className="w-12 h-12 rounded-2xl bg-[#E5EEE8] text-[#243B53] flex items-center justify-center mb-2">
              <Sparkles className="w-6 h-6 text-[#6B9B91]" />
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#E5EEE8] text-[#243B53]">
              Selamat Datang
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#243B53] tracking-tight font-['Plus_Jakarta_Sans']">
              Perjalanan Pengembangan Kesejahteraan Psikologis Anda
            </h2>
            <p className="text-xs sm:text-sm text-[#78838A] leading-relaxed">
              Formulir intervensi terpandu ini disusun secara bertahap dan terfokus. Anda akan diajak melalui konsep-konsep kunci, studi kasus kerja, latihan refleksi, dan komitmen aksi nyata selama 4 minggu ke depan.
            </p>
            <div className="p-3.5 bg-[#F6F7F5] rounded-xl border border-[#E2E6E3] text-xs text-[#29343B] space-y-1">
              <p className="font-semibold text-[#243B53]">Prinsip Kenyamanan:</p>
              <p className="text-[#78838A]">
                • Kerjakan dengan santai tanpa terburu-buru.<br />
                • Tidak ada penilaian benar/salah yang menghakimi kepribadian Anda.<br />
                • Refleksi pribadi bersifat privat untuk proses belajar Anda.
              </p>
            </div>
          </div>
        )}

        {/* STEP 1: Minggu 1 Intro */}
        {currentStep === 1 && (
          <div className="space-y-4 my-auto">
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#E5EEE8] text-[#243B53]">
              Minggu 1: Fondasi Kesejahteraan
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-[#243B53]">
              Mengenali & Menerima Diri (Self-Acceptance & Personal Growth)
            </h2>
            <p className="text-xs sm:text-sm text-[#29343B] leading-relaxed">
              Dalam kehidupan profesional, kita sering kali dihadapkan pada ekspektasi tinggi. Penerimaan diri (<em>Self-Acceptance</em>) bukanlah sikap pasrah, melainkan kemampuan mengenali kekuatan dan keterbatasan diri secara objektif tanpa menyiksa diri dengan kritik destruktif.
            </p>
            <div className="p-4 bg-[#F0E9DF]/50 rounded-2xl border border-[#D97706]/20 text-xs text-[#29343B] space-y-1.5">
              <p className="font-bold text-[#D97706] flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4" /> Poin Kunci Pembelajaran:
              </p>
              <p>
                Ketika terjadi kesalahan kerja, pisahkan antara <strong>"tindakan/prosedur yang keliru"</strong> dengan <strong>"penilaian bahwa diri saya tidak berharga"</strong>.
              </p>
            </div>
          </div>
        )}

        {/* STEP 2: Minggu 1 Studi Kasus */}
        {currentStep === 2 && (
          <div className="space-y-4 my-auto">
            <span className="text-xs font-bold text-[#6B9B91] uppercase tracking-wider">
              Minggu 1 • Studi Kasus Interaktif
            </span>
            <h3 className="text-lg font-bold text-[#243B53]">
              Skenario: Kesalahan Rumus dalam Laporan Pagi
            </h3>
            <p className="text-xs sm:text-sm text-[#78838A] leading-relaxed">
              Anda baru menyadari bahwa dokumen kalkulasi data yang telah dikirim ke tim manajemen memiliki kekeliruan rumus. Rapat pembahasan akan berlangsung 2 jam lagi.
            </p>

            <div className="space-y-2.5 pt-2">
              <p className="text-xs font-semibold text-[#243B53]">Tindakan apa yang Anda pilih?</p>
              {[
                { id: 'a', text: 'Mengakui kekeliruan rumus dengan tenang, segera menyiapkan lembar koreksi yang tepat, dan memberitahu tim sebelum rapat dimulai.' },
                { id: 'b', text: 'Menyalahkan diri sendiri, merasa tidak kompeten, dan berusaha menutup-nutupi kesalahan tersebut.' },
                { id: 'c', text: 'Menyalahkan departemen lain yang telat menyuplai data mentah.' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => handleCase1Select(opt.id)}
                  className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm transition-all ${
                    selectedCase1 === opt.id
                      ? 'border-[#6B9B91] bg-[#E5EEE8]/50 ring-1 ring-[#6B9B91] text-[#243B53] font-medium'
                      : 'border-[#E2E6E3] hover:bg-[#F6F7F5] text-[#29343B]'
                  }`}
                >
                  {opt.text}
                </button>
              ))}
            </div>

            {case1Feedback && (
              <div className="p-3.5 bg-[#E5EEE8] border border-[#6B9B91]/40 rounded-xl text-xs space-y-1 mt-3">
                <p className="font-bold text-[#243B53]">{case1Feedback.title}</p>
                <p className="text-[#29343B]">{case1Feedback.desc}</p>
              </div>
            )}
          </div>
        )}

        {/* STEP 3: Minggu 1 Refleksi Diri */}
        {currentStep === 3 && (
          <div className="space-y-4 my-auto">
            <span className="text-xs font-bold text-[#6B9B91] uppercase tracking-wider">
              Minggu 1 • Refleksi Diri
            </span>
            <h3 className="text-lg font-bold text-[#243B53]">
              Bagaimana Respon Alami Anda terhadap Kesalahan?
            </h3>
            <p className="text-xs text-[#78838A]">
              Tuliskan pemikiran singkat Anda secara jujur. Tidak ada jawaban yang dinilai benar atau salah.
            </p>
            <textarea
              rows={4}
              value={reflection1}
              onChange={(e) => setReflection1(e.target.value)}
              placeholder="Contoh: Saya biasanya merasa cemas berlebihan dan cenderung takut ditegur, namun saya ingin belajar lebih fokus pada solusi..."
              className="w-full p-3.5 bg-[#F6F7F5] border border-[#E2E6E3] rounded-xl text-xs sm:text-sm text-[#29343B] focus:outline-none focus:ring-2 focus:ring-[#6B9B91]"
            />
            <div className="flex items-center gap-2 text-[11px] text-[#78838A]">
              <Shield className="w-3.5 h-3.5 text-[#6B9B91]" />
              <span>Privat & tersimpan untuk perjalanan belajar Anda.</span>
            </div>
          </div>
        )}

        {/* STEP 4: Minggu 2 Intro */}
        {currentStep === 4 && (
          <div className="space-y-4 my-auto">
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#E5EEE8] text-[#243B53]">
              Minggu 2: Harmoni Relasi
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-[#243B53]">
              Membangun Hubungan Positif & Menjaga Batasan (Positive Relations & Autonomy)
            </h2>
            <p className="text-xs sm:text-sm text-[#29343B] leading-relaxed">
              Hubungan kerja yang sehat dibangun dari rasa aman psikologis, kemampuan berempati, dan ketegasan yang santun (komunikasi asertif). Otonomi berarti mampu mempertahankan nilai profesional diri tanpa harus terjebak menjadi <em>people-pleaser</em> yang mengabaikan kapasitas sendiri.
            </p>
            <div className="p-4 bg-[#E5EEE8]/60 rounded-2xl border border-[#6B9B91]/30 text-xs text-[#243B53] space-y-1">
              <p className="font-bold flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-[#6B9B91]" /> Intisari Asertivitas:
              </p>
              <p className="text-[#78838A]">
                Mengatakan "tidak" pada tugas di luar kapasitas adalah cara menjaga agar kualitas tugas utama tetap terjaga dan energi kerja tidak terkuras habis.
              </p>
            </div>
          </div>
        )}

        {/* STEP 5: Minggu 2 Studi Kasus */}
        {currentStep === 5 && (
          <div className="space-y-4 my-auto">
            <span className="text-xs font-bold text-[#6B9B91] uppercase tracking-wider">
              Minggu 2 • Studi Kasus Komunikasi
            </span>
            <h3 className="text-lg font-bold text-[#243B53]">
              Skenario: Perbedaan Format Kerja dengan Rekan Satu Tim
            </h3>
            <p className="text-xs sm:text-sm text-[#78838A] leading-relaxed">
              Rekan satu tim Anda bersikeras memakai template lama yang lambat, sementara Anda ingin mengusulkan template otomatis baru. Rekan terlihat defensif dan merasa idenya ditolak.
            </p>

            <div className="space-y-2.5 pt-2">
              <p className="text-xs font-semibold text-[#243B53]">Bagaimana cara Anda menanggapi?</p>
              {[
                { id: 'a', text: 'Mengakui niat baik rekan untuk menjaga keamanan hasil, lalu mengajak uji coba ringkas format baru secara berdampingan.' },
                { id: 'b', text: 'Mengalah sepenuhnya agar tidak ribut, walaupun pekerjaan tim jadi lambat.' },
                { id: 'c', text: 'Mendebatnya di forum grup bahwa formatnya sudah ketinggalan zaman.' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => handleCase2Select(opt.id)}
                  className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm transition-all ${
                    selectedCase2 === opt.id
                      ? 'border-[#6B9B91] bg-[#E5EEE8]/50 ring-1 ring-[#6B9B91] text-[#243B53] font-medium'
                      : 'border-[#E2E6E3] hover:bg-[#F6F7F5] text-[#29343B]'
                  }`}
                >
                  {opt.text}
                </button>
              ))}
            </div>

            {case2Feedback && (
              <div className="p-3.5 bg-[#E5EEE8] border border-[#6B9B91]/40 rounded-xl text-xs space-y-1 mt-3">
                <p className="font-bold text-[#243B53]">{case2Feedback.title}</p>
                <p className="text-[#29343B]">{case2Feedback.desc}</p>
              </div>
            )}
          </div>
        )}

        {/* STEP 6: Minggu 2 Refleksi Batasan Kerja */}
        {currentStep === 6 && (
          <div className="space-y-4 my-auto">
            <span className="text-xs font-bold text-[#6B9B91] uppercase tracking-wider">
              Minggu 2 • Refleksi Batasan Diri
            </span>
            <h3 className="text-lg font-bold text-[#243B53]">
              Seberapa Nyaman Anda Menyampaikan Batasan di Tempat Kerja?
            </h3>
            <p className="text-xs text-[#78838A]">
              Beri nilai 1 (Sangat Sulit / Selalu Mengiyakan) hingga 5 (Sangat Nyaman & Asertif):
            </p>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setBoundaryRating(val)}
                  className={`flex-1 py-3 rounded-xl border text-sm font-bold transition-all ${
                    boundaryRating === val
                      ? 'bg-[#243B53] text-white border-[#243B53]'
                      : 'bg-[#F6F7F5] text-[#29343B] border-[#E2E6E3] hover:bg-gray-100'
                  }`}
                >
                  {val}
                </button>
              ))}
            </div>
            <div className="flex justify-between text-[11px] text-[#78838A] px-1">
              <span>1: Sulit Berkata Tidak</span>
              <span>5: Sangat Sehat & Asertif</span>
            </div>
          </div>
        )}

        {/* STEP 7: Minggu 3 Intro */}
        {currentStep === 7 && (
          <div className="space-y-4 my-auto">
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#E5EEE8] text-[#243B53]">
              Minggu 3: Penguasaan Lingkungan
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-[#243B53]">
              Mengelola Tantangan & Beban Kerja (Environmental Mastery)
            </h2>
            <p className="text-xs sm:text-sm text-[#29343B] leading-relaxed">
              <em>Environmental Mastery</em> adalah kapasitas seseorang dalam mengelola tuntutan dunia kerja, menyusun prioritas secara efektif, dan memusatkan energi mental pada hal-hal yang berada di dalam kendali langsung (<em>Circle of Control</em>).
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
              <div className="p-3 bg-[#E5EEE8]/60 rounded-xl border border-[#6B9B91]/30">
                <strong className="text-[#243B53] block mb-1">Dalam Kendali Saya:</strong>
                <p className="text-[#78838A]">Cara saya merespons, alokasi waktu kerja, inisiatif belajar, dan waktu istirahat yang cukup.</p>
              </div>
              <div className="p-3 bg-[#F0E9DF]/60 rounded-xl border border-[#D97706]/30">
                <strong className="text-[#243B53] block mb-1">Di Luar Kendali Saya:</strong>
                <p className="text-[#78838A]">Keputusan manajemen mendadak, perilaku orang lain, dan kondisi pasar ekonomi makro.</p>
              </div>
            </div>
          </div>
        )}

        {/* STEP 8: Minggu 3 Latihan Prioritas Eisenhower */}
        {currentStep === 8 && (
          <div className="space-y-4 my-auto">
            <span className="text-xs font-bold text-[#6B9B91] uppercase tracking-wider">
              Minggu 3 • Evaluasi Kebiasaan Prioritas
            </span>
            <h3 className="text-lg font-bold text-[#243B53]">
              Seberapa Sering Anda Menyusun 3 Prioritas Utama Sebelum Mulai Bekerja?
            </h3>
            <p className="text-xs text-[#78838A]">
              Menyaring tugas mendesak vs penting terbukti menurunkan stres harian secara drastis.
            </p>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setPriorityRating(val)}
                  className={`flex-1 py-3 rounded-xl border text-sm font-bold transition-all ${
                    priorityRating === val
                      ? 'bg-[#243B53] text-white border-[#243B53]'
                      : 'bg-[#F6F7F5] text-[#29343B] border-[#E2E6E3] hover:bg-gray-100'
                  }`}
                >
                  {val}
                </button>
              ))}
            </div>
            <div className="flex justify-between text-[11px] text-[#78838A] px-1">
              <span>1: Jarang Sekali (Reaktif)</span>
              <span>5: Sangat Terencana (Proaktif)</span>
            </div>
          </div>
        )}

        {/* STEP 9: Minggu 4 Intro */}
        {currentStep === 9 && (
          <div className="space-y-4 my-auto">
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#E5EEE8] text-[#243B53]">
              Minggu 4: Makna & Pertumbuhan
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-[#243B53]">
              Menemukan Tujuan & Makna Kerja (Purpose in Life & Personal Growth)
            </h2>
            <p className="text-xs sm:text-sm text-[#29343B] leading-relaxed">
              Memiliki rasa tujuan hidup (<em>Purpose in Life</em>) memberi jangkar yang kokoh ketika kita melewati fase jenuh. Menemukan makna bukan berarti harus melakukan hal spektakuler, melainkan menyadari kontribusi nyata dari peran kita bagi sesama.
            </p>
            <div className="p-4 bg-[#F0E9DF]/60 rounded-2xl border border-[#D97706]/30 text-xs text-[#29343B]">
              <p className="font-bold text-[#D97706] mb-1">Konsep Job Crafting:</p>
              <p className="text-[#78838A]">
                Menghubungkan tugas harian sederhana dengan nilai-nilai luhur yang Anda yakini memberi kepuasan batin jangka panjang.
              </p>
            </div>
          </div>
        )}

        {/* STEP 10: Minggu 4 Refleksi Makna Kerja */}
        {currentStep === 10 && (
          <div className="space-y-4 my-auto">
            <span className="text-xs font-bold text-[#6B9B91] uppercase tracking-wider">
              Minggu 4 • Refleksi Nilai & Makna
            </span>
            <h3 className="text-lg font-bold text-[#243B53]">
              Siapa yang Merasakan Manfaat dari Pekerjaan yang Anda Selesaikan dengan Baik?
            </h3>
            <p className="text-xs text-[#78838A]">
              Bayangkan penerima manfaat langsung maupun tidak langsung dari dedikasi kerja Anda:
            </p>
            <textarea
              rows={3}
              value={meaningStatement}
              onChange={(e) => setMeaningStatement(e.target.value)}
              placeholder="Contoh: Klien yang terbantu masalahnya, rekan kerja yang pekerjaannya jadi lancar, serta keluarga yang saya dukung..."
              className="w-full p-3.5 bg-[#F6F7F5] border border-[#E2E6E3] rounded-xl text-xs sm:text-sm text-[#29343B] focus:outline-none focus:ring-2 focus:ring-[#6B9B91]"
            />
          </div>
        )}

        {/* STEP 11: Rencana Tindakan Pribadi (Action Plan PWB) */}
        {currentStep === 11 && (
          <div className="space-y-4 my-auto">
            <span className="text-xs font-bold text-[#6B9B91] uppercase tracking-wider">
              Integrasi • Komitmen Rencana Aksi
            </span>
            <h3 className="text-lg font-bold text-[#243B53]">
              Satu Komitmen Kecil yang Ingin Anda Terapkan Secara Konsisten
            </h3>
            <p className="text-xs text-[#78838A]">
              Pilihlah satu kebiasaan konkret yang paling realistis untuk Anda jalankan mulai besok pagi:
            </p>
            <div className="space-y-2">
              {[
                'Menyusun 3 prioritas utama sebelum membuka inbox email di pagi hari.',
                'Mengambil jeda bernapas 3 menit saat mulai merasa tegang dalam rapat.',
                'Berani menyampaikan batas kapasitas kerja secara asertif dan sopan.',
                'Meluangkan 5 menit di akhir pekan untuk mencatat pembelajaran diri.',
              ].map((text, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setFinalCommitment(text)}
                  className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm transition-all ${
                    finalCommitment === text
                      ? 'border-[#6B9B91] bg-[#E5EEE8]/50 ring-1 ring-[#6B9B91] text-[#243B53] font-semibold'
                      : 'border-[#E2E6E3] hover:bg-[#F6F7F5] text-[#29343B]'
                  }`}
                >
                  ✓ {text}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 12: Penutup & Rangkuman */}
        {currentStep === 12 && (
          <div className="space-y-4 my-auto text-center max-w-lg mx-auto">
            <div className="w-14 h-14 rounded-full bg-green-100 text-[#059669] flex items-center justify-center mx-auto mb-2">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-extrabold text-[#243B53]">
              Selamat! Anda Telah Menyelesaikan Alur Terpandu
            </h2>
            <p className="text-xs sm:text-sm text-[#78838A] leading-relaxed">
              Anda telah mengeksplorasi 4 minggu pilar Psychological Well-Being Carol D. Ryff. Refleksi dan komitmen tindakan Anda telah terekam aman dalam sistem SmartWorkCare.
            </p>
            <div className="p-4 bg-[#F6F7F5] rounded-2xl border border-[#E2E6E3] text-xs text-left space-y-1.5">
              <p className="font-bold text-[#243B53]">Komitmen Pilihan Anda:</p>
              <p className="text-[#059669] font-semibold">
                "{finalCommitment || 'Menjaga keseimbangan dan fokus pada hal dalam kendali'}"
              </p>
            </div>
          </div>
        )}

        {/* STEP 13: Langkah Selanjutnya */}
        {currentStep === 13 && (
          <div className="space-y-5 my-auto">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-md bg-[#E5EEE8] text-[#243B53]">
                <Sparkles className="w-4 h-4 text-[#6B9B91]" />
              </span>
              <span className="text-xs font-bold text-[#6B9B91] uppercase tracking-wider">
                Langkah Lanjutan
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#243B53]">
              Lanjutkan Eksplorasi Anda di SmartWorkCare
            </h2>
            <p className="text-xs sm:text-sm text-[#78838A] leading-relaxed">
              Anda dapat memperdalam pengalaman belajar Anda melalui fitur-fitur interaktif berikut:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
              <button
                onClick={() => onNavigateTab('reflection')}
                className="p-4 rounded-xl border border-[#E2E6E3] hover:border-[#6B9B91] hover:bg-[#E5EEE8]/30 text-left transition-all space-y-1"
              >
                <div className="flex items-center justify-between font-bold text-[#243B53]">
                  <span>Ruang Refleksi AI</span>
                  <ArrowRight className="w-4 h-4 text-[#6B9B91]" />
                </div>
                <p className="text-[#78838A]">Dialog interaktif hangat dengan pendamping AI terlatih.</p>
              </button>

              <button
                onClick={() => onNavigateTab('evaluation')}
                className="p-4 rounded-xl border border-[#E2E6E3] hover:border-[#6B9B91] hover:bg-[#E5EEE8]/30 text-left transition-all space-y-1"
              >
                <div className="flex items-center justify-between font-bold text-[#243B53]">
                  <span>Evaluasi Kirkpatrick L1-L4</span>
                  <ArrowRight className="w-4 h-4 text-[#6B9B91]" />
                </div>
                <p className="text-[#78838A]">Ukur reaksi kepuasan, pre/post-test, dan penerapan kerja.</p>
              </button>
            </div>

            <div className="pt-4">
              <button
                onClick={onBackToDashboard}
                className="w-full py-3 rounded-xl bg-[#243B53] text-white text-xs sm:text-sm font-bold hover:bg-[#1a2c3f]"
              >
                Kembali ke Dashboard Utama
              </button>
            </div>
          </div>
        )}

        {/* BOTTOM NAVIGATION CONTROLS */}
        <div className="pt-8 border-t border-[#E2E6E3] flex items-center justify-between">
          {currentStep > 0 ? (
            <button
              type="button"
              onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
              className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-[#78838A] hover:bg-gray-100 flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Sebelumnya</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onBackToDashboard}
              className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-[#78838A] hover:bg-gray-100 transition-colors"
            >
              Tutup & Kembali
            </button>
          )}

          {currentStep < TOTAL_STEPS - 1 ? (
            <button
              type="button"
              onClick={() => setCurrentStep((prev) => Math.min(TOTAL_STEPS - 1, prev + 1))}
              className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-[#243B53] hover:bg-[#1a2c3f] active:scale-[0.99] transition-all flex items-center gap-2 shadow-xs"
            >
              <span>{currentStep === 0 ? 'Mulai Sekarang' : 'Lanjutkan'}</span>
              <ArrowRight className="w-4 h-4 text-[#6B9B91]" />
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
};
