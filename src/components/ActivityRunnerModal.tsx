import React, { useState } from 'react';
import { Activity, ProgramSession } from '../types';
import {
  X,
  CheckCircle2,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  Sparkles,
  HelpCircle,
  Lightbulb,
  Shield,
  Clock,
  BookOpen,
} from 'lucide-react';
import { PWB_DIMENSIONS_INFO } from '../data/programData';

interface ActivityRunnerModalProps {
  activity: Activity;
  session: ProgramSession;
  onClose: () => void;
  onCompleted: (savedAnswer?: any) => void;
}

export const ActivityRunnerModal: React.FC<ActivityRunnerModalProps> = ({
  activity,
  session,
  onClose,
  onCompleted,
}) => {
  // Activity state
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);
  const [isFinishing, setIsFinishing] = useState<boolean>(false);

  // Permainan 3: Priority sorting state
  const [priorityOrder, setPriorityOrder] = useState<string[]>(() => {
    return activity.content.priorityTasks ? activity.content.priorityTasks.map((t) => t.id) : [];
  });

  // Permainan 4: Reflection answers
  const [reflectionAnswers, setReflectionAnswers] = useState<Record<string, string>>({});

  // Permainan 5: Decision steps
  const [currentStepId, setCurrentStepId] = useState<string>(() => {
    return activity.content.decisionSteps?.[0]?.stepId || 'step_1';
  });
  const [decisionHistory, setDecisionHistory] = useState<{ stepId: string; choiceText: string; consequence: string; lesson?: string }[]>([]);

  // Move task up/down in priority sorting
  const handleMovePriority = (index: number, direction: 'up' | 'down') => {
    const newOrder = [...priorityOrder];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= newOrder.length) return;
    const temp = newOrder[index];
    newOrder[index] = newOrder[targetIdx];
    newOrder[targetIdx] = temp;
    setPriorityOrder(newOrder);
  };

  const handleFinish = async () => {
    setIsFinishing(true);
    let payloadAnswer: any = null;

    if (activity.type === 'pilih_respons' || activity.type === 'studi_kasus') {
      payloadAnswer = { selectedOptionId };
    } else if (activity.type === 'susun_prioritas') {
      payloadAnswer = { priorityOrder };
    } else if (activity.type === 'kartu_refleksi') {
      payloadAnswer = { reflectionAnswers };
    } else if (activity.type === 'tentukan_langkah') {
      payloadAnswer = { decisionHistory };
    }

    onCompleted(payloadAnswer);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-xl border border-[#D98BAA]/30 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-[#F7F5F8] border-b border-[#D98BAA]/30 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#FDF2F4] text-[#B51F36] border border-[#B51F36]/20">
                Minggu {session.weekNumber} • Sesi {session.order}
              </span>
              <span className="text-[11px] text-[#78838A] flex items-center gap-1">
                <Clock className="w-3 h-3" /> {activity.estimatedMinutes} menit
              </span>
            </div>
            <h3 className="text-base font-bold text-[#243B53] line-clamp-1">{activity.title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#78838A] hover:text-[#B51F36] hover:bg-red-50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 text-sm text-[#29343B]">
          {/* Learning Goal Banner */}
          <div className="p-3.5 bg-[#FDF2F4] rounded-2xl border border-[#B51F36]/20 flex items-start gap-3">
            <Lightbulb className="w-4 h-4 text-[#B51F36] shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-[#243B53]">Tujuan Pembelajaran:</p>
              <p className="text-xs text-[#29343B] mt-0.5">{activity.learningGoal}</p>
            </div>
          </div>

          {/* GAME 1 & 2: Pilih Respons Terbaik & Studi Kasus Interaktif */}
          {(activity.type === 'pilih_respons' || activity.type === 'studi_kasus') && (
            <div className="space-y-4">
              <div className="p-4 bg-[#F7F5F8] rounded-2xl border border-gray-200">
                <p className="text-xs font-bold text-[#78838A] uppercase tracking-wider mb-1">Skenario Kasus Kerja</p>
                <p className="text-sm font-medium text-[#243B53] leading-relaxed">
                  {activity.content.scenario}
                </p>
              </div>

              <div className="space-y-2.5">
                <p className="text-xs font-bold text-[#243B53]">Pilihlah respons yang menurut Anda paling bijak:</p>
                {activity.content.options?.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    disabled={hasSubmitted}
                    onClick={() => setSelectedOptionId(opt.id)}
                    className={`w-full text-left p-3.5 rounded-2xl border transition-all text-xs sm:text-sm leading-relaxed ${
                      selectedOptionId === opt.id
                        ? 'border-[#B51F36] bg-[#FDF2F4] ring-1 ring-[#B51F36] text-[#243B53] font-semibold'
                        : 'border-gray-200 hover:border-[#B51F36]/40 hover:bg-[#F7F5F8] text-[#29343B]'
                    }`}
                  >
                    {opt.text}
                  </button>
                ))}
              </div>

              {!hasSubmitted && (
                <div className="pt-2">
                  <button
                    type="button"
                    disabled={!selectedOptionId}
                    onClick={() => setHasSubmitted(true)}
                    className="w-full py-3 px-4 rounded-2xl text-xs sm:text-sm font-bold text-white bg-[#B51F36] hover:bg-[#96192c] transition-all shadow-xs disabled:opacity-40"
                  >
                    Kirim Pilihan & Lihat Umpan Balik Edukatif
                  </button>
                </div>
              )}

              {/* Feedback Section */}
              {hasSubmitted && selectedOptionId && (
                <div className="mt-4 p-4 sm:p-5 rounded-2xl bg-[#F5F0FB] border border-[#49316F]/20 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#49316F]">
                    <Sparkles className="w-4 h-4" />
                    <span>Umpan Balik Psikoedukasi Reflektif</span>
                  </div>

                  {(() => {
                    const opt = activity.content.options?.find((o) => o.id === selectedOptionId);
                    if (!opt) return null;
                    return (
                      <div className="space-y-2.5 text-xs text-[#29343B] leading-relaxed">
                        <div>
                          <strong className="text-[#243B53]">1. Apa yang terjadi:</strong> {opt.feedback.whatHappened}
                        </div>
                        <div>
                          <strong className="text-[#243B53]">2. Mengapa hal ini penting:</strong> {opt.feedback.whyImportant}
                        </div>
                        <div>
                          <strong className="text-[#243B53]">3. Alternatif pertimbangan:</strong> {opt.feedback.alternatives}
                        </div>
                        <div className="p-2.5 rounded-lg bg-white border border-[#E2E6E3] mt-2">
                          <strong className="text-[#6B9B91]">Pertanyaan Refleksi:</strong>{' '}
                          <em>"{opt.feedback.reflectionQuestion}"</em>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
          )}

          {/* GAME 3: Susun Prioritas */}
          {activity.type === 'susun_prioritas' && (
            <div className="space-y-4">
              <p className="text-xs text-[#78838A] leading-relaxed">
                {activity.content.introText ||
                  'Gunakan tombol Naik/Turun untuk menyusun 4 tugas ini dari prioritas 1 (paling awal) sampai prioritas 4 (terakhir).'}
              </p>

              <div className="space-y-2">
                {priorityOrder.map((taskId, idx) => {
                  const task = activity.content.priorityTasks?.find((t) => t.id === taskId);
                  if (!task) return null;

                  return (
                    <div
                      key={task.id}
                      className="p-3.5 rounded-xl border border-[#E2E6E3] bg-[#F6F7F5] flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-[#243B53] text-white flex items-center justify-center font-bold text-xs shrink-0">
                          {idx + 1}
                        </span>
                        <div>
                          <p className="text-xs sm:text-sm font-semibold text-[#243B53]">{task.title}</p>
                          <div className="flex items-center gap-2 mt-1 text-[11px] text-[#78838A]">
                            <span className="px-1.5 py-0.5 rounded-md bg-white border border-[#E2E6E3]">
                              Urgensi: <strong>{task.urgency}</strong>
                            </span>
                            <span className="px-1.5 py-0.5 rounded-md bg-white border border-[#E2E6E3]">
                              Dampak: <strong>{task.importance}</strong>
                            </span>
                            <span>{task.estimatedDuration}</span>
                          </div>
                        </div>
                      </div>

                      {!hasSubmitted && (
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => handleMovePriority(idx, 'up')}
                            className="p-1 rounded bg-white border border-[#E2E6E3] hover:bg-gray-100 disabled:opacity-30"
                          >
                            <ArrowUp className="w-3.5 h-3.5 text-[#243B53]" />
                          </button>
                          <button
                            type="button"
                            disabled={idx === priorityOrder.length - 1}
                            onClick={() => handleMovePriority(idx, 'down')}
                            className="p-1 rounded bg-white border border-[#E2E6E3] hover:bg-gray-100 disabled:opacity-30"
                          >
                            <ArrowDown className="w-3.5 h-3.5 text-[#243B53]" />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {!hasSubmitted ? (
                <button
                  type="button"
                  onClick={() => setHasSubmitted(true)}
                  className="w-full py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-[#243B53] hover:bg-[#1a2c3f] transition-all shadow-xs"
                >
                  Periksa Pertimbangan Prioritas
                </button>
              ) : (
                <div className="p-4 rounded-xl bg-[#E5EEE8]/60 border border-[#6B9B91]/30 space-y-2 text-xs">
                  <p className="font-bold text-[#243B53] flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-[#6B9B91]" />
                    Analisis Rasional Eisenhower Matrix:
                  </p>
                  {activity.content.priorityTasks?.map((t) => (
                    <div key={t.id} className="p-2 rounded-lg bg-white border border-[#E2E6E3]">
                      <strong>Prioritas Ideal #{t.recommendedOrder} ({t.title.substring(0, 45)}...):</strong>
                      <p className="text-[#78838A] mt-0.5">{t.rationalExplanation}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* GAME 4: Kartu Refleksi Diri */}
          {activity.type === 'kartu_refleksi' && (
            <div className="space-y-4">
              <p className="text-xs text-[#78838A]">
                Refleksi diri membantu Anda mengamati kebiasaan berpikir dan mengenali respon alami tubuh saat bekerja.
              </p>

              <div className="space-y-4">
                {activity.content.reflectionPrompts?.map((prompt, idx) => (
                  <div key={prompt.id} className="p-4 rounded-xl border border-[#E2E6E3] bg-[#F6F7F5] space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-[#6B9B91] text-white flex items-center justify-center font-bold text-[10px]">
                        {idx + 1}
                      </span>
                      <p className="text-xs font-bold text-[#243B53]">{prompt.prompt}</p>
                    </div>
                    <p className="text-[11px] text-[#78838A] italic">💡 Panduan: {prompt.guidingTip}</p>
                    <textarea
                      rows={3}
                      value={reflectionAnswers[prompt.id] || ''}
                      onChange={(e) =>
                        setReflectionAnswers({
                          ...reflectionAnswers,
                          [prompt.id]: e.target.value,
                        })
                      }
                      placeholder="Tuliskan pemikiran atau pengalaman Anda di sini..."
                      className="w-full p-2.5 bg-white border border-[#E2E6E3] rounded-lg text-xs text-[#29343B] focus:outline-none focus:ring-1 focus:ring-[#6B9B91]"
                    />
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 text-[11px] text-[#78838A] px-1">
                <Shield className="w-3.5 h-3.5 text-[#6B9B91]" />
                <span>Jawaban refleksi ini bersifat privat untuk proses belajar Anda dalam program ini.</span>
              </div>
            </div>
          )}

          {/* GAME 5: Tentukan Langkah Selanjutnya */}
          {activity.type === 'tentukan_langkah' && (
            <div className="space-y-4">
              {(() => {
                const step = activity.content.decisionSteps?.find((s) => s.stepId === currentStepId);
                if (!step) {
                  return (
                    <div className="p-4 bg-green-50 rounded-xl border border-green-200 text-center">
                      <CheckCircle2 className="w-8 h-8 text-green-600 mx-auto mb-2" />
                      <p className="text-sm font-bold text-green-900">Alur Keputusan Selesai Dipelajari!</p>
                      <p className="text-xs text-green-700 mt-1">
                        Anda telah menavigasi konsekuensi keputusan kerja dan memetik intisari kesejahteraan psikologis.
                      </p>
                    </div>
                  );
                }

                return (
                  <div className="space-y-4">
                    <div className="p-4 bg-[#F6F7F5] rounded-xl border border-[#E2E6E3]">
                      <p className="text-xs font-bold text-[#78838A] uppercase mb-1">Situasi:</p>
                      <p className="text-xs sm:text-sm text-[#243B53] leading-relaxed">{step.situation}</p>
                      <p className="text-xs font-bold text-[#6B9B91] mt-3">{step.question}</p>
                    </div>

                    <div className="space-y-2">
                      {step.choices.map((c) => (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => {
                            setDecisionHistory([
                              ...decisionHistory,
                              {
                                stepId: step.stepId,
                                choiceText: c.text,
                                consequence: c.consequence,
                                lesson: c.lessonSummary,
                              },
                            ]);
                            if (c.nextStepId) {
                              setCurrentStepId(c.nextStepId);
                            } else {
                              setHasSubmitted(true);
                            }
                          }}
                          className="w-full text-left p-3.5 rounded-xl border border-[#E2E6E3] hover:border-[#6B9B91] hover:bg-[#E5EEE8]/30 transition-all text-xs sm:text-sm"
                        >
                          <span className="font-semibold text-[#243B53] block mb-1">Pilihan:</span>
                          {c.text}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })()}

              {/* Decision History log */}
              {decisionHistory.length > 0 && (
                <div className="p-4 rounded-xl bg-[#F0E9DF]/40 border border-[#D97706]/20 space-y-2">
                  <p className="text-xs font-bold text-[#243B53]">Jejak Konsekuensi Keputusan:</p>
                  {decisionHistory.map((h, i) => (
                    <div key={i} className="text-xs border-l-2 border-[#D97706] pl-2.5 py-1">
                      <p className="font-semibold text-[#243B53]">{h.choiceText}</p>
                      <p className="text-[#78838A] mt-0.5">➔ Konsekuensi: {h.consequence}</p>
                      {h.lesson && <p className="text-[#059669] font-medium mt-0.5">💡 Intisari: {h.lesson}</p>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#F7F5F8] border-t border-[#D98BAA]/30 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-[#78838A] hover:bg-gray-100 transition-colors"
          >
            Tutup
          </button>
          <button
            type="button"
            disabled={
              isFinishing ||
              ((activity.type === 'pilih_respons' || activity.type === 'studi_kasus') && !hasSubmitted) ||
              (activity.type === 'susun_prioritas' && !hasSubmitted) ||
              (activity.type === 'tentukan_langkah' && !hasSubmitted && decisionHistory.length === 0)
            }
            onClick={handleFinish}
            className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-[#B51F36] hover:bg-[#96192c] active:scale-[0.99] transition-all shadow-md disabled:opacity-40 flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4 text-white" />
            {isFinishing ? 'Menyimpan Progres...' : 'Selesaikan Aktivitas & Raih Capaian'}
          </button>
        </div>
      </div>
    </div>
  );
};
