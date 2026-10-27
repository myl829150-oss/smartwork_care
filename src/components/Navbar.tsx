import React from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Compass,
  BookOpen,
  MessageSquareHeart,
  ClipboardCheck,
  Users,
  BarChart3,
  LogOut,
  ShieldCheck,
  User as UserIcon,
  Sparkles,
  FileSpreadsheet,
} from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onSelectTab }) => {
  const { user, role, logout } = useAuth();

  return (
    <header className="bg-white border-b border-[#D98BAA]/30 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Institutional Titles */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <img
                src="/assets/aistudio/LOGO_UMSIDA_06f6b892.jpeg"
                alt="Logo UMSIDA"
                className="h-8 sm:h-9 w-auto object-contain rounded-xs"
              />
              <img
                src="/assets/aistudio/PSIKOLOGI_UMSIDA_LOGO_4cfcb94d.jpeg"
                alt="Logo Psikologi"
                className="h-8 sm:h-9 w-auto object-contain rounded-xs hidden sm:block"
              />
            </div>
            <div className="h-6 w-px bg-gray-200 hidden sm:block"></div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-['Plus_Jakarta_Sans'] font-extrabold text-base sm:text-lg text-[#243B53] tracking-tight">
                  SmartWorkCare
                </span>
                <span className={`text-[10px] sm:text-xs px-2 py-0.5 rounded-full font-bold ${
                  role === 'facilitator'
                    ? 'bg-[#F5F0FB] text-[#49316F] border border-[#49316F]/20'
                    : 'bg-[#FDF2F4] text-[#B51F36] border border-[#B51F36]/20'
                }`}>
                  {role === 'facilitator' ? 'Fasilitator HR' : 'Peserta'}
                </span>
              </div>
              <p className="text-[10px] text-[#78838A] hidden sm:block">
                Intervensi Psychological Well-Being • Psikologi UMSIDA
              </p>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {role === 'participant' ? (
              <>
                <button
                  onClick={() => onSelectTab('dashboard')}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors ${
                    currentTab === 'dashboard'
                      ? 'bg-[#FDF2F4] text-[#B51F36]'
                      : 'text-[#78838A] hover:text-[#243B53] hover:bg-gray-50'
                  }`}
                >
                  <Compass className="w-4 h-4 text-[#B51F36]" />
                  Dashboard & Misi
                </button>
                <button
                  onClick={() => onSelectTab('reflection')}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors ${
                    currentTab === 'reflection'
                      ? 'bg-[#FDF2F4] text-[#B51F36]'
                      : 'text-[#78838A] hover:text-[#243B53] hover:bg-gray-50'
                  }`}
                >
                  <MessageSquareHeart className="w-4 h-4 text-[#49316F]" />
                  Ruang Refleksi AI
                </button>
                <button
                  onClick={() => onSelectTab('evaluation')}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors ${
                    currentTab === 'evaluation'
                      ? 'bg-[#FDF2F4] text-[#B51F36]'
                      : 'text-[#78838A] hover:text-[#243B53] hover:bg-gray-50'
                  }`}
                >
                  <ClipboardCheck className="w-4 h-4 text-[#B51F36]" />
                  Evaluasi & Pre/Post-Test
                </button>
                <button
                  onClick={() => onSelectTab('welcome')}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors ${
                    currentTab === 'welcome'
                      ? 'bg-[#FDF2F4] text-[#B51F36]'
                      : 'text-[#78838A] hover:text-[#243B53] hover:bg-gray-50'
                  }`}
                >
                  Info Program
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => onSelectTab('facilitator-dashboard')}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors ${
                    currentTab === 'facilitator-dashboard'
                      ? 'bg-[#F5F0FB] text-[#49316F]'
                      : 'text-[#78838A] hover:text-[#243B53] hover:bg-gray-50'
                  }`}
                >
                  <BarChart3 className="w-4 h-4 text-[#49316F]" />
                  Dashboard Kohor
                </button>
                <button
                  onClick={() => onSelectTab('facilitator-participants')}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors ${
                    currentTab === 'facilitator-participants'
                      ? 'bg-[#F5F0FB] text-[#49316F]'
                      : 'text-[#78838A] hover:text-[#243B53] hover:bg-gray-50'
                  }`}
                >
                  <Users className="w-4 h-4 text-[#49316F]" />
                  Manajemen Peserta
                </button>
                <button
                  onClick={() => onSelectTab('facilitator-evaluation')}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors ${
                    currentTab === 'facilitator-evaluation'
                      ? 'bg-[#F5F0FB] text-[#49316F]'
                      : 'text-[#78838A] hover:text-[#243B53] hover:bg-gray-50'
                  }`}
                >
                  <ClipboardCheck className="w-4 h-4 text-[#49316F]" />
                  Hasil Evaluasi L1-L4
                </button>
                <button
                  onClick={() => onSelectTab('welcome')}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors ${
                    currentTab === 'welcome'
                      ? 'bg-[#F5F0FB] text-[#49316F]'
                      : 'text-[#78838A] hover:text-[#243B53] hover:bg-gray-50'
                  }`}
                >
                  Info Program
                </button>
              </>
            )}
          </nav>

          {/* User Profile & Logout */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-right">
              <div className="hidden sm:block">
                <p className="text-xs font-bold text-[#29343B]">{user?.name}</p>
                <p className="text-[11px] text-[#78838A]">@{user?.username}</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-[#FDF2F4] text-[#B51F36] flex items-center justify-center font-bold text-xs border border-[#B51F36]/20">
                {role === 'facilitator' ? <ShieldCheck className="w-4 h-4 text-[#49316F]" /> : <UserIcon className="w-4 h-4" />}
              </div>
            </div>

            <button
              onClick={() => logout()}
              title="Keluar"
              className="p-2 rounded-lg text-[#78838A] hover:text-[#B51F36] hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="lg:hidden flex items-center justify-start gap-1 py-2 border-t border-[#D98BAA]/30 overflow-x-auto text-xs whitespace-nowrap scrollbar-none">
          {role === 'participant' ? (
            <>
              <button
                onClick={() => onSelectTab('dashboard')}
                className={`py-1.5 px-2.5 rounded-lg font-bold transition-colors ${
                  currentTab === 'dashboard' ? 'text-[#B51F36] bg-[#FDF2F4]' : 'text-[#78838A]'
                }`}
              >
                Dashboard & Misi
              </button>
              <button
                onClick={() => onSelectTab('reflection')}
                className={`py-1.5 px-2.5 rounded-lg font-bold transition-colors ${
                  currentTab === 'reflection' ? 'text-[#B51F36] bg-[#FDF2F4]' : 'text-[#78838A]'
                }`}
              >
                Refleksi AI
              </button>
              <button
                onClick={() => onSelectTab('evaluation')}
                className={`py-1.5 px-2.5 rounded-lg font-bold transition-colors ${
                  currentTab === 'evaluation' ? 'text-[#B51F36] bg-[#FDF2F4]' : 'text-[#78838A]'
                }`}
              >
                Evaluasi
              </button>
              <button
                onClick={() => onSelectTab('welcome')}
                className={`py-1.5 px-2.5 rounded-lg font-bold transition-colors ${
                  currentTab === 'welcome' ? 'text-[#B51F36] bg-[#FDF2F4]' : 'text-[#78838A]'
                }`}
              >
                Info
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => onSelectTab('facilitator-dashboard')}
                className={`py-1.5 px-2.5 rounded-lg font-bold transition-colors ${
                  currentTab === 'facilitator-dashboard' ? 'text-[#49316F] bg-[#F5F0FB]' : 'text-[#78838A]'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => onSelectTab('facilitator-participants')}
                className={`py-1.5 px-2.5 rounded-lg font-bold transition-colors ${
                  currentTab === 'facilitator-participants' ? 'text-[#49316F] bg-[#F5F0FB]' : 'text-[#78838A]'
                }`}
              >
                Peserta
              </button>
              <button
                onClick={() => onSelectTab('facilitator-evaluation')}
                className={`py-1.5 px-2.5 rounded-lg font-bold transition-colors ${
                  currentTab === 'facilitator-evaluation' ? 'text-[#49316F] bg-[#F5F0FB]' : 'text-[#78838A]'
                }`}
              >
                Evaluasi & Unduh
              </button>
              <button
                onClick={() => onSelectTab('welcome')}
                className={`py-1.5 px-2.5 rounded-lg font-bold transition-colors ${
                  currentTab === 'welcome' ? 'text-[#49316F] bg-[#F5F0FB]' : 'text-[#78838A]'
                }`}
              >
                Info
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
