import React from 'react';
import {
  Sparkles,
  ArrowRight,
  Heart,
  TrendingUp,
  Target,
  Award,
  CheckCircle2,
  Users,
  Compass,
} from 'lucide-react';
import { PROGRAM_BADGES } from '../data/programData';

interface WelcomeHeroProps {
  onStart: () => void;
  onOpenLogin: () => void;
}

export const WelcomeHero: React.FC<WelcomeHeroProps> = ({ onStart, onOpenLogin }) => {
  return (
    <div className="space-y-8">
      {/* Institutional Header with Official Logos & Proportions Preserved */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 sm:p-5 bg-white rounded-2xl border border-[#D98BAA]/30 shadow-xs">
        <div className="flex items-center gap-3 sm:gap-4">
          <img
            src="/assets/aistudio/LOGO_UMSIDA_06f6b892.jpeg"
            alt="Logo Universitas Muhammadiyah Sidoarjo"
            className="h-10 sm:h-12 w-auto object-contain rounded-sm"
          />
          <div className="h-8 w-px bg-gray-200 hidden sm:block"></div>
          <img
            src="/assets/aistudio/PSIKOLOGI_UMSIDA_LOGO_4cfcb94d.jpeg"
            alt="Logo Psikologi UMSIDA"
            className="h-10 sm:h-12 w-auto object-contain rounded-sm"
          />
          <div>
            <p className="text-xs sm:text-sm font-bold text-[#243B53]">
              Universitas Muhammadiyah Sidoarjo
            </p>
            <p className="text-[11px] text-[#49316F] font-medium">
              Fakultas Psikologi dan Ilmu Pendidikan
            </p>
          </div>
        </div>

        <button
          onClick={onOpenLogin}
          className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-[#B51F36] hover:bg-[#96192c] active:scale-[0.99] transition-all shadow-xs"
        >
          Masuk Akun Peserta / Fasilitator
        </button>
      </div>

      {/* Main Hero Card: Left Copy, Right Psychology Students Illustration in Red Blazer */}
      <div className="bg-white rounded-3xl border border-[#D98BAA]/30 shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        {/* Left Column: Hero Description */}
        <div className="p-8 sm:p-10 lg:col-span-7 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FDF2F4] text-[#B51F36] text-xs font-bold border border-[#B51F36]/20">
              <Sparkles className="w-3.5 h-3.5 text-[#B51F36]" />
              <span>Program Intervensi Psychological Well-Being Berbasis AI</span>
            </div>

            <div className="space-y-1">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-[#243B53] tracking-tight font-['Plus_Jakarta_Sans']">
                SmartWorkCare
              </h1>
              <p className="text-base sm:text-lg font-semibold text-[#49316F] italic font-['Plus_Jakarta_Sans']">
                Ruang Tumbuh, Refleksi, dan Kesejahteraan di Dunia Kerja.
              </p>
            </div>

            <p className="text-xs sm:text-sm text-[#29343B] leading-relaxed max-w-xl">
              Program empat minggu untuk membantu Anda mengenali diri, membangun hubungan positif, mengelola tantangan kerja, dan mengembangkan tujuan pribadi.
            </p>

            {/* 3 Main Benefits as Requested */}
            <div className="pt-2 space-y-2.5">
              <p className="text-xs font-bold text-[#243B53] uppercase tracking-wider">
                Tiga Manfaat Utama Program:
              </p>

              <div className="grid grid-cols-1 gap-2.5">
                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#F7F5F8] border border-[#D98BAA]/30">
                  <div className="w-8 h-8 rounded-lg bg-[#FDF2F4] text-[#B51F36] flex items-center justify-center shrink-0 mt-0.5 border border-[#B51F36]/20">
                    <Heart className="w-4 h-4 text-[#B51F36]" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-[#243B53]">Mengenali Kekuatan dan Potensi Diri</h3>
                    <p className="text-[11px] text-[#78838A] mt-0.5">
                      Penerimaan diri realistis dan kesadaran respons emosi dalam menghadapi tekanan kerja.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#F7F5F8] border border-[#D98BAA]/30">
                  <div className="w-8 h-8 rounded-lg bg-[#F5F0FB] text-[#49316F] flex items-center justify-center shrink-0 mt-0.5 border border-[#49316F]/20">
                    <TrendingUp className="w-4 h-4 text-[#49316F]" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-[#243B53]">Mengembangkan Strategi Menghadapi Tantangan Kerja</h3>
                    <p className="text-[11px] text-[#78838A] mt-0.5">
                      Kecakapan menentukan prioritas tugas, komunikasi asertif, serta memisahkan apa yang dalam kendali.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#F7F5F8] border border-[#D98BAA]/30">
                  <div className="w-8 h-8 rounded-lg bg-[#FDF2F4] text-[#B51F36] flex items-center justify-center shrink-0 mt-0.5 border border-[#B51F36]/20">
                    <Target className="w-4 h-4 text-[#B51F36]" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-[#243B53]">Menyusun Langkah Kecil untuk Pertumbuhan Pribadi</h3>
                    <p className="text-[11px] text-[#78838A] mt-0.5">
                      Merumuskan rencana aksi bermakna yang dapat dipraktikkan secara berkelanjutan di tempat kerja.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Call to action */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={onStart}
              className="px-6 py-3.5 rounded-2xl bg-[#B51F36] text-white hover:bg-[#96192c] active:scale-[0.99] transition-all text-xs sm:text-sm font-bold flex items-center gap-2.5 shadow-md"
            >
              <span>Mulai Perjalanan Saya</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <span className="text-xs text-[#78838A]">
              Berbasis 6 Dimensi Carol D. Ryff & 4 Level Evaluasi Kirkpatrick
            </span>
          </div>
        </div>

        {/* Right Column: Illustration of Psychology Students in Red Blazer */}
        <div className="relative lg:col-span-5 bg-[#F7F5F8] flex flex-col justify-between overflow-hidden border-t lg:border-t-0 lg:border-l border-[#D98BAA]/30">
          <div className="p-4 sm:p-6 flex flex-col h-full justify-between">
            <div className="rounded-2xl overflow-hidden shadow-sm border border-[#D98BAA]/40 bg-white">
              <img
                src="/src/assets/images/psychology_students_red_blazer_1793084654913.jpg"
                alt="Dua Mahasiswa Psikologi UMSIDA Berjas Almamater Merah"
                className="w-full h-auto object-cover max-h-[360px]"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="pt-4 space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#FDF2F4] text-[#B51F36] border border-[#B51F36]/20">
                  Tim Pendampingan Akademik
                </span>
                <span className="text-[11px] text-[#78838A]">Psikologi UMSIDA</span>
              </div>
              <p className="text-xs text-[#29343B] leading-relaxed">
                Dirancang secara hangat dan profesional untuk membantu karyawan mengembangkan daya lentur mental (*resilience*) dan kepuasan kerja sehari-hari.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 4-Week Journey & Badges Showcase */}
      <div className="space-y-4">
        <div className="text-center max-w-xl mx-auto space-y-1">
          <h2 className="text-xl sm:text-2xl font-bold text-[#243B53]">
            Perjalanan Interaktif 4 Misi Mingguan
          </h2>
          <p className="text-xs sm:text-sm text-[#78838A]">
            Setiap minggu berisi edukasi singkat, studi kasus nyata, permainan pilihan respons, refleksi AI, dan rencana aksi.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {PROGRAM_BADGES.map((badge) => (
            <div
              key={badge.id}
              className="p-5 rounded-2xl bg-white border border-[#D98BAA]/30 shadow-xs hover:shadow-sm transition-all space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider" style={{ color: badge.color, backgroundColor: badge.bgLight }}>
                  Misi Minggu {badge.weekNumber}
                </span>
                <Award className="w-4 h-4" style={{ color: badge.color }} />
              </div>

              <div>
                <h3 className="text-sm font-bold text-[#243B53]">{badge.title}</h3>
                <p className="text-xs font-semibold text-[#49316F] mt-0.5">{badge.theme}</p>
                <p className="text-[11px] text-[#78838A] leading-relaxed mt-1.5">
                  {badge.description}
                </p>
              </div>

              <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] text-[#78838A]">
                <span>Status: Belum Dimulai</span>
                <span className="font-semibold text-[#B51F36]">Siap Dimulai →</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
