import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, ShieldCheck, UserCheck, AlertCircle, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

interface LoginPageProps {
  onBackToLanding?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onBackToLanding }) => {
  const { loginParticipant, loginFacilitator } = useAuth();
  const [activeTab, setActiveTab] = useState<'participant' | 'facilitator'>('participant');

  // Form states
  const [participantUsername, setParticipantUsername] = useState('');
  const [facilitatorUsername, setFacilitatorUsername] = useState('fasilitator_hr');
  const [facilitatorPassword, setFacilitatorPassword] = useState('SwcFasilitator#2026');
  const [showPassword, setShowPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleParticipantSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    if (!participantUsername.trim()) {
      setErrorMessage('Harap masukkan username Anda.');
      return;
    }

    setIsLoading(true);
    const result = await loginParticipant(participantUsername.trim());
    setIsLoading(false);

    if (!result.success) {
      setErrorMessage(result.error || 'Login gagal.');
    }
  };

  const handleFacilitatorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    if (!facilitatorUsername.trim() || !facilitatorPassword) {
      setErrorMessage('Username dan kata sandi fasilitator wajib diisi.');
      return;
    }

    setIsLoading(true);
    const result = await loginFacilitator(facilitatorUsername.trim(), facilitatorPassword);
    setIsLoading(false);

    if (!result.success) {
      setErrorMessage(result.error || 'Login fasilitator gagal.');
    }
  };

  const handleQuickFill = (type: 'facilitator' | 'active_part' | 'inactive_part') => {
    setErrorMessage(null);
    if (type === 'facilitator') {
      setActiveTab('facilitator');
      setFacilitatorUsername('fasilitator_hr');
      setFacilitatorPassword('SwcFasilitator#2026');
    } else if (type === 'active_part') {
      setActiveTab('participant');
      setParticipantUsername('nur_001');
    } else if (type === 'inactive_part') {
      setActiveTab('participant');
      setParticipantUsername('andi_004');
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F5F8] flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8">
      {/* Top back link if onBackToLanding is available */}
      {onBackToLanding && (
        <div className="max-w-4xl mx-auto w-full mb-3">
          <button
            type="button"
            onClick={onBackToLanding}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#78838A] hover:text-[#B51F36] py-1 transition-colors"
          >
            ← Kembali ke Beranda Info Program
          </button>
        </div>
      )}

      {/* Main Container Card: Split 2 Columns with Psychology Students Visual */}
      <div className="max-w-4xl mx-auto w-full bg-white rounded-3xl border border-[#D98BAA]/30 shadow-md overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        {/* Left Side: Visual Illustration of 2 Students in Red Blazer */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#FDF2F4] via-[#F7F5F8] to-[#F5F0FB] p-6 sm:p-8 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[#D98BAA]/30">
          <div className="space-y-4">
            {/* Official Logos in proportion */}
            <div className="flex items-center gap-3 bg-white/80 backdrop-blur-xs p-3 rounded-2xl border border-[#D98BAA]/30">
              <img
                src="/assets/aistudio/LOGO_UMSIDA_06f6b892.jpeg"
                alt="Logo UMSIDA"
                className="h-9 w-auto object-contain rounded-xs"
              />
              <div className="h-6 w-px bg-gray-200"></div>
              <img
                src="/assets/aistudio/PSIKOLOGI_UMSIDA_LOGO_4cfcb94d.jpeg"
                alt="Logo Psikologi UMSIDA"
                className="h-9 w-auto object-contain rounded-xs"
              />
              <div>
                <p className="text-[11px] font-bold text-[#243B53]">UMSIDA</p>
                <p className="text-[10px] text-[#49316F] font-medium">Fakultas Psikologi</p>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden shadow-xs border border-[#D98BAA]/40 bg-white">
              <img
                src="/src/assets/images/psychology_students_red_blazer_1793084654913.jpg"
                alt="Mahasiswa Psikologi Berjas Almamater Merah"
                className="w-full h-auto object-cover max-h-[260px] sm:max-h-[300px]"
                referrerPolicy="no-referrer"
              />
            </div>

            <div>
              <h3 className="text-base font-bold text-[#243B53]">SmartWorkCare</h3>
              <p className="text-xs text-[#49316F] font-medium mt-0.5">
                Program Intervensi Psychological Well-Being
              </p>
              <p className="text-[11px] text-[#78838A] leading-relaxed mt-1">
                Enam pilar kesejahteraan psikologis Carol D. Ryff dipadukan dengan umpan balik reflektif AI untuk mendampingi dinamika kerja Anda.
              </p>
            </div>
          </div>

          <div className="pt-4 text-[11px] text-[#78838A] border-t border-gray-200/60 mt-4">
            <span>Privat & Aman • Universitas Muhammadiyah Sidoarjo</span>
          </div>
        </div>

        {/* Right Side: Login Tabs & Forms */}
        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between">
          <div>
            {/* Role Tabs */}
            <div className="flex rounded-xl bg-[#F7F5F8] p-1 mb-6 border border-[#D98BAA]/30">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('participant');
                  setErrorMessage(null);
                }}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs sm:text-sm font-bold rounded-lg transition-all ${
                  activeTab === 'participant'
                    ? 'bg-white text-[#B51F36] shadow-xs ring-1 ring-[#B51F36]/20'
                    : 'text-[#78838A] hover:text-[#243B53]'
                }`}
              >
                <UserCheck className="w-4 h-4" />
                Masuk Peserta
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('facilitator');
                  setErrorMessage(null);
                }}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs sm:text-sm font-bold rounded-lg transition-all ${
                  activeTab === 'facilitator'
                    ? 'bg-white text-[#49316F] shadow-xs ring-1 ring-[#49316F]/20'
                    : 'text-[#78838A] hover:text-[#243B53]'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                Masuk Fasilitator
              </button>
            </div>

            {/* Header info */}
            <div className="mb-6">
              <h2 className="text-xl font-bold text-[#243B53]">
                {activeTab === 'participant' ? 'Masuk ke Perjalanan Anda' : 'Portal Fasilitator HR'}
              </h2>
              <p className="text-xs text-[#78838A] mt-1 leading-relaxed">
                {activeTab === 'participant'
                  ? 'Masukkan username yang telah diberikan fasilitator. Peserta tidak memerlukan kata sandi.'
                  : 'Gunakan kredensial terverifikasi untuk memantau kohor peserta dan mengunduh laporan.'}
              </p>
            </div>

            {/* Error Banner */}
            {errorMessage && (
              <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3 text-xs text-red-700 leading-relaxed">
                <AlertCircle className="w-4 h-4 text-[#B51F36] shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Participant Login (No Password) */}
            {activeTab === 'participant' ? (
              <form onSubmit={handleParticipantSubmit} className="space-y-4">
                <div>
                  <label htmlFor="username" className="block text-xs font-bold text-[#29343B] mb-1.5">
                    Username Peserta
                  </label>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    value={participantUsername}
                    onChange={(e) => setParticipantUsername(e.target.value)}
                    placeholder="Contoh: nur_001"
                    className="w-full px-4 py-3 bg-[#F7F5F8] border border-[#D98BAA]/40 rounded-xl text-sm text-[#29343B] placeholder-[#78838A] focus:outline-none focus:ring-2 focus:ring-[#B51F36] focus:bg-white transition-all font-mono"
                  />
                  <p className="mt-1.5 text-[11px] text-[#78838A]">
                    Format: <code className="text-[#B51F36] font-semibold">nama_nomor</code> (contoh: <span className="font-semibold text-[#243B53]">nur_001</span>). Tanpa kata sandi.
                  </p>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 px-4 rounded-xl text-sm font-bold text-white bg-[#B51F36] hover:bg-[#96192c] active:scale-[0.99] transition-all shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <span>{isLoading ? 'Memverifikasi...' : 'Masuk ke Dashboard Peserta'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            ) : (
              /* Facilitator Login (With Password) */
              <form onSubmit={handleFacilitatorSubmit} className="space-y-4">
                <div>
                  <label htmlFor="fac_username" className="block text-xs font-bold text-[#29343B] mb-1.5">
                    Username Fasilitator
                  </label>
                  <input
                    id="fac_username"
                    name="fac_username"
                    type="text"
                    required
                    value={facilitatorUsername}
                    onChange={(e) => setFacilitatorUsername(e.target.value)}
                    placeholder="fasilitator_hr"
                    className="w-full px-4 py-3 bg-[#F7F5F8] border border-[#D98BAA]/40 rounded-xl text-sm text-[#29343B] placeholder-[#78838A] focus:outline-none focus:ring-2 focus:ring-[#49316F] focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="fac_password" className="block text-xs font-bold text-[#29343B] mb-1.5">
                    Kata Sandi
                  </label>
                  <div className="relative">
                    <input
                      id="fac_password"
                      name="fac_password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={facilitatorPassword}
                      onChange={(e) => setFacilitatorPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full px-4 py-3 bg-[#F7F5F8] border border-[#D98BAA]/40 rounded-xl text-sm text-[#29343B] placeholder-[#78838A] focus:outline-none focus:ring-2 focus:ring-[#49316F] focus:bg-white transition-all pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#78838A] hover:text-[#243B53]"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 px-4 rounded-xl text-sm font-bold text-white bg-[#49316F] hover:bg-[#392657] active:scale-[0.99] transition-all shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <span>{isLoading ? 'Memverifikasi...' : 'Masuk ke Dashboard Fasilitator'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}

            {/* Quick Testing Helper */}
            <div className="mt-6 pt-5 border-t border-gray-100">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#243B53] mb-2">
                <Sparkles className="w-3.5 h-3.5 text-[#B51F36]" />
                <span>Akun Uji Coba Cepat:</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                <button
                  type="button"
                  onClick={() => handleQuickFill('active_part')}
                  className="px-3 py-2 rounded-xl bg-[#FDF2F4] hover:bg-[#fce5ea] border border-[#B51F36]/20 text-[#B51F36] text-left font-medium transition-colors"
                >
                  <span className="font-bold">Peserta Aktif:</span> <code className="font-mono">nur_001</code>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickFill('facilitator')}
                  className="px-3 py-2 rounded-xl bg-[#F5F0FB] hover:bg-[#ede5f7] border border-[#49316F]/20 text-[#49316F] text-left font-medium transition-colors"
                >
                  <span className="font-bold">Fasilitator HR:</span> <code className="font-mono">fasilitator_hr</code>
                </button>
              </div>
            </div>
          </div>

          <p className="mt-4 text-center text-[11px] text-[#78838A]">
            SmartWorkCare adalah program psikoedukasi kesejahteraan kerja, bukan alat diagnosis klinis medis.
          </p>
        </div>
      </div>
    </div>
  );
};
