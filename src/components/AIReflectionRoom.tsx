import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { ReflectionMessage, ReflectionSession } from '../types';
import {
  MessageSquareHeart,
  Send,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  BookmarkCheck,
  RefreshCw,
  Info,
} from 'lucide-react';
import { PROGRAM_WEEKS } from '../data/programData';

export const AIReflectionRoom: React.FC = () => {
  const { user, token } = useAuth();
  const [messages, setMessages] = useState<ReflectionMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [activeWeekNumber, setActiveWeekNumber] = useState<number>(1);
  const [currentSessionSummary, setCurrentSessionSummary] = useState<any>(null);
  const [pastSessions, setPastSessions] = useState<ReflectionSession[]>([]);
  const [crisisAlert, setCrisisAlert] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeWeekDef = PROGRAM_WEEKS.find((w) => w.weekNumber === activeWeekNumber) || PROGRAM_WEEKS[0];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    fetchPastReflections();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchPastReflections = async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/reflection/sessions', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setPastSessions(data.sessions || []);
        if (data.sessions && data.sessions.length > 0) {
          const latest = data.sessions[data.sessions.length - 1];
          if (latest.summary) {
            setCurrentSessionSummary(latest.summary);
          }
        }
      }
    } catch (e) {
      console.error('Failed to load past reflections:', e);
    }
  };

  // Start initial greeting if messages empty
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: 'init_msg_1',
          sender: 'ai',
          text: `Halo ${user?.name || 'rekan kerja'}. Selamat datang di Ruang Refleksi AI SmartWorkCare. Di Minggu ${activeWeekNumber} ini, kita berfokus pada: "${activeWeekDef.theme}".\n\nBagaimana pengalaman kerjamu beberapa hari terakhir? Apakah ada situasi kerja atau perasaan tertentu yang sedang terasa memenuhi pikiranmu saat ini?`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }
  }, [activeWeekNumber]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isSending) return;

    const userMsg: ReflectionMessage = {
      id: `msg_u_${Date.now()}`,
      sender: 'user',
      text: inputText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInputText('');
    setIsSending(true);

    try {
      const res = await fetch('/api/reflection/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          message: userMsg.text,
          history: newMessages,
          weekNumber: activeWeekNumber,
          theme: activeWeekDef.theme,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        if (data.isCrisisAlert) {
          setCrisisAlert(data.text);
        }
        setMessages((prev) => [
          ...prev,
          {
            id: `msg_ai_${Date.now()}`,
            sender: 'ai',
            text: data.text,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isCrisisAlert: data.isCrisisAlert,
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: `msg_err_${Date.now()}`,
            sender: 'ai',
            text: 'Mohon maaf, terjadi kendala saat memproses refleksi. Silakan coba kirimkan kembali.',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSending(false);
    }
  };

  const handleFinishReflection = async () => {
    if (messages.length < 2) return;
    setIsSending(true);
    try {
      const res = await fetch('/api/reflection/finish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          weekNumber: activeWeekNumber,
          theme: activeWeekDef.theme,
          history: messages,
        }),
      });

      const data = await res.json();
      if (res.ok && data.session?.summary) {
        setCurrentSessionSummary(data.session.summary);
        fetchPastReflections();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="p-6 bg-white rounded-2xl border border-[#E2E6E3] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded-md bg-[#E5EEE8] text-[#243B53]">
              <MessageSquareHeart className="w-4 h-4 text-[#6B9B91]" />
            </span>
            <span className="text-xs font-semibold text-[#6B9B91] uppercase tracking-wider">
              Pendamping Refleksi Karyawan
            </span>
          </div>
          <h2 className="text-xl font-bold text-[#243B53]">Ruang Refleksi AI</h2>
          <p className="text-xs text-[#78838A] mt-1 max-w-xl">
            Dialog aman, hangat, dan tanpa penghakiman untuk membantu Anda mengenali pikiran, menavigasi tuntutan kerja, dan menemukan pembelajaran bermakna.
          </p>
        </div>

        {/* Week Selector */}
        <div className="flex items-center gap-2 bg-[#F6F7F5] p-2 rounded-xl border border-[#E2E6E3]">
          <span className="text-xs font-semibold text-[#243B53] whitespace-nowrap">Minggu Intervensi:</span>
          <select
            value={activeWeekNumber}
            onChange={(e) => {
              setActiveWeekNumber(Number(e.target.value));
              setMessages([]);
            }}
            className="text-xs font-semibold bg-white border border-[#E2E6E3] rounded-lg px-2.5 py-1 text-[#243B53] focus:outline-none focus:ring-1 focus:ring-[#6B9B91]"
          >
            <option value={1}>Minggu 1: Mengenali Diri</option>
            <option value={2}>Minggu 2: Hubungan Kerja</option>
            <option value={3}>Minggu 3: Penguasaan Lingkungan</option>
            <option value={4}>Minggu 4: Makna & Action Plan</option>
          </select>
        </div>
      </div>

      {/* Ethical & Non-Clinical Disclaimer */}
      <div className="p-3.5 bg-[#E5EEE8]/60 rounded-xl border border-[#6B9B91]/30 flex items-start gap-3 text-xs text-[#29343B] leading-relaxed">
        <Info className="w-4 h-4 text-[#6B9B91] shrink-0 mt-0.5" />
        <div>
          <strong>Catatan Etika & Keamanan:</strong> Ruang Refleksi AI adalah media psikoedukasi untuk memfasilitasi eksplorasi diri, dan <strong>bukan</strong> layanan medis, terapi psikiatris, ataupun alat diagnosis klinis. Dialog bersifat privat untuk akun Anda.
        </div>
      </div>

      {/* Crisis / Support Banner if triggered */}
      {crisisAlert && (
        <div className="p-4 bg-red-50 border border-red-300 rounded-xl text-xs text-red-900 space-y-2">
          <div className="flex items-center gap-2 font-bold text-red-700">
            <AlertTriangle className="w-4 h-4" />
            <span>Pemberitahuan Dukungan Emosional Segera</span>
          </div>
          <p className="whitespace-pre-line leading-relaxed">{crisisAlert}</p>
        </div>
      )}

      {/* Chat Area */}
      <div className="bg-white rounded-2xl border border-[#E2E6E3] shadow-xs overflow-hidden flex flex-col h-[520px]">
        {/* Chat Stream */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[75%] p-4 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                  m.sender === 'user'
                    ? 'bg-[#243B53] text-white rounded-br-xs'
                    : m.isCrisisAlert
                    ? 'bg-red-50 text-red-900 border border-red-300 rounded-bl-xs'
                    : 'bg-[#F6F7F5] text-[#29343B] border border-[#E2E6E3] rounded-bl-xs'
                }`}
              >
                {m.text}
              </div>
              <span className="text-[10px] text-[#78838A] mt-1 px-1">{m.timestamp}</span>
            </div>
          ))}

          {isSending && (
            <div className="flex items-center gap-2 text-xs text-[#78838A] p-2 bg-[#F6F7F5] rounded-xl w-fit">
              <Sparkles className="w-3.5 h-3.5 text-[#6B9B91] animate-spin" />
              <span>Pendamping AI sedang merefleksikan pesan Anda...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-[#F6F7F5] border-t border-[#E2E6E3]">
          <form onSubmit={handleSendMessage} className="flex items-center gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={isSending}
              placeholder="Ceritakan pengalaman atau situasi kerja Anda..."
              className="flex-1 px-4 py-2.5 bg-white border border-[#E2E6E3] rounded-xl text-xs sm:text-sm text-[#29343B] placeholder-[#78838A] focus:outline-none focus:ring-2 focus:ring-[#6B9B91]"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isSending}
              className="p-2.5 rounded-xl bg-[#243B53] text-white hover:bg-[#1a2c3f] active:scale-[0.98] transition-all disabled:opacity-40"
              title="Kirim pesan"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          <div className="flex items-center justify-between mt-2 px-1 text-[11px] text-[#78838A]">
            <span>Bagikan cerita sejauh yang terasa nyaman bagi Anda.</span>
            <button
              type="button"
              onClick={handleFinishReflection}
              disabled={messages.length < 2 || isSending}
              className="text-[#6B9B91] hover:text-[#243B53] font-semibold flex items-center gap-1 disabled:opacity-40 transition-colors"
            >
              <BookmarkCheck className="w-3.5 h-3.5" />
              Selesaikan & Simpan Rangkuman
            </button>
          </div>
        </div>
      </div>

      {/* Reflection Summary Card if available */}
      {currentSessionSummary && (
        <div className="p-5 bg-white rounded-2xl border border-[#E2E6E3] shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-[#243B53]">
            <BookmarkCheck className="w-4 h-4 text-[#6B9B91]" />
            <span>Rangkuman Intisari Refleksi Tersimpan</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-[#F6F7F5] rounded-xl border border-[#E2E6E3]">
              <p className="font-semibold text-[#243B53]">Tema yang Dibahas:</p>
              <p className="text-[#78838A] mt-0.5">{currentSessionSummary.themeDiscussed}</p>
            </div>
            <div className="p-3 bg-[#F6F7F5] rounded-xl border border-[#E2E6E3]">
              <p className="font-semibold text-[#243B53]">Hal yang Disadari (Realization):</p>
              <p className="text-[#78838A] mt-0.5">{currentSessionSummary.realizations}</p>
            </div>
            <div className="p-3 bg-[#F6F7F5] rounded-xl border border-[#E2E6E3]">
              <p className="font-semibold text-[#243B53]">Sumber Daya yang Dikenali:</p>
              <p className="text-[#78838A] mt-0.5">{currentSessionSummary.identifiedResources}</p>
            </div>
            <div className="p-3 bg-[#F6F7F5] rounded-xl border border-[#E2E6E3]">
              <p className="font-semibold text-[#243B53]">Komitmen Langkah Kecil:</p>
              <p className="text-[#059669] font-medium mt-0.5">{currentSessionSummary.chosenActionStep}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
