/**
 * SmartWorkCare: Program Intervensi Psychological Well-Being pada Karyawan
 * Berbasis Artificial Intelligence Feedback System
 */

import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { LoginPage } from './components/LoginPage';
import { ParticipantDashboard } from './components/ParticipantDashboard';
import { ParticipantManagement } from './components/ParticipantManagement';
import { FacilitatorDashboard } from './components/FacilitatorDashboard';
import { AIReflectionRoom } from './components/AIReflectionRoom';
import { KirkpatrickEvaluationView } from './components/KirkpatrickEvaluationView';
import { FacilitatorEvaluationAnalytics } from './components/FacilitatorEvaluationAnalytics';

import { WelcomeHero } from './components/WelcomeHero';
import { GuidedInterventionForm } from './components/GuidedInterventionForm';

const AppContent: React.FC = () => {
  const { user, role, loading } = useAuth();
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [unauthView, setUnauthView] = useState<'welcome' | 'login'>('welcome');

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F6F7F5] flex flex-col items-center justify-center space-y-3">
        <div className="w-10 h-10 rounded-xl bg-[#243B53] flex items-center justify-center text-white font-bold animate-pulse">
          SW
        </div>
        <p className="text-xs text-[#78838A] font-medium">Memuat SmartWorkCare...</p>
      </div>
    );
  }

  if (!user) {
    if (unauthView === 'login') {
      return <LoginPage onBackToLanding={() => setUnauthView('welcome')} />;
    }

    return (
      <div className="min-h-screen bg-[#F6F7F5] flex flex-col text-[#29343B]">
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <WelcomeHero
            onStart={() => setUnauthView('login')}
            onOpenLogin={() => setUnauthView('login')}
          />
        </main>

        <footer className="bg-white border-t border-[#E2E6E3] py-4 mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#78838A] gap-2">
            <p>
              © 2026 <strong>SmartWorkCare</strong> — Program Intervensi Psychological Well-Being pada Karyawan.
            </p>
            <p className="text-center sm:text-right">
              Universitas Muhammadiyah Sidoarjo • Fakultas Psikologi dan Ilmu Pendidikan
            </p>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F6F7F5] flex flex-col text-[#29343B]">
      <Navbar currentTab={currentTab} onSelectTab={setCurrentTab} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {role === 'participant' ? (
          <>
            {(currentTab === 'dashboard' || currentTab === 'program') && (
              <ParticipantDashboard onNavigateTab={setCurrentTab} />
            )}
            {currentTab === 'guided-form' && (
              <GuidedInterventionForm
                onBackToDashboard={() => setCurrentTab('dashboard')}
                onNavigateTab={(tab) => setCurrentTab(tab)}
              />
            )}
            {currentTab === 'reflection' && <AIReflectionRoom />}
            {currentTab === 'evaluation' && <KirkpatrickEvaluationView />}
            {currentTab === 'welcome' && (
              <WelcomeHero
                onStart={() => setCurrentTab('guided-form')}
                onOpenLogin={() => setCurrentTab('dashboard')}
              />
            )}
          </>
        ) : (
          <>
            {currentTab === 'facilitator-dashboard' && (
              <FacilitatorDashboard onNavigate={setCurrentTab} />
            )}
            {currentTab === 'facilitator-participants' && <ParticipantManagement />}
            {currentTab === 'facilitator-evaluation' && <FacilitatorEvaluationAnalytics />}
            {currentTab === 'welcome' && (
              <WelcomeHero
                onStart={() => setCurrentTab('facilitator-dashboard')}
                onOpenLogin={() => setCurrentTab('facilitator-dashboard')}
              />
            )}
          </>
        )}
      </main>

      <footer className="bg-white border-t border-[#E2E6E3] py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#78838A] gap-2">
          <p>
            © 2026 <strong>SmartWorkCare</strong> — Program Intervensi Psychological Well-Being pada Karyawan.
          </p>
          <p className="text-center sm:text-right">
            Enam Dimensi PWB Carol D. Ryff • Model Evaluasi 4 Level Kirkpatrick
          </p>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
