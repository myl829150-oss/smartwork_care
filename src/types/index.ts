/**
 * SmartWorkCare Types
 * Carol D. Ryff 6 Psychological Well-Being Dimensions & Kirkpatrick 4-Level Evaluation
 */

export type Role = 'participant' | 'facilitator';

export type PWBDimension =
  | 'self_acceptance'
  | 'positive_relations'
  | 'autonomy'
  | 'environmental_mastery'
  | 'purpose_in_life'
  | 'personal_growth';

export interface User {
  id: string;
  name: string;
  username: string;
  role: Role;
  isActive: boolean;
  participantNumber?: string; // 3-digit, e.g. "001"
  createdAt: string;
  updatedAt: string;
}

export type WeekAccessStatus = 'Terkunci' | 'Siap Dimulai' | 'Sedang Berlangsung' | 'Selesai';
export type SessionStatus = 'Belum Dimulai' | 'Sedang Berlangsung' | 'Selesai';
export type ActivityType =
  | 'pilih_respons' // Permainan 1: Pilih Respons Terbaik
  | 'studi_kasus'   // Permainan 2: Studi Kasus Interaktif
  | 'susun_prioritas' // Permainan 3: Susun Prioritas (Urgency vs Impact)
  | 'kartu_refleksi'  // Permainan 4: Kartu Refleksi Diri
  | 'tentukan_langkah'; // Permainan 5: Tentukan Langkah Selanjutnya (Decision path)

export interface ActivityOption {
  id: string;
  text: string;
  feedback: {
    whatHappened: string;       // Apa yang terjadi
    whyImportant: string;       // Mengapa hal tersebut penting
    alternatives: string;       // Alternatif yang dapat dipertimbangkan
    reflectionQuestion: string; // Pertanyaan refleksi
  };
  scoreWeight?: number;
}

export interface ActivityDecisionStep {
  stepId: string;
  situation: string;
  question: string;
  choices: {
    id: string;
    text: string;
    consequence: string;
    nextStepId?: string; // Next branching step or undefined if final
    lessonSummary?: string;
  }[];
}

export interface PriorityTask {
  id: string;
  title: string;
  urgency: 'Tinggi' | 'Sedang' | 'Rendah';
  importance: 'Kritis' | 'Penting' | 'Rutin';
  estimatedDuration: string;
  recommendedOrder: number; // 1 to N
  rationalExplanation: string;
}

export interface ReflectionCardPrompt {
  id: string;
  dimension: PWBDimension;
  prompt: string;
  guidingTip: string;
  isOptional?: boolean;
}

export interface ActivityContent {
  introText?: string;
  scenario?: string;
  options?: ActivityOption[];
  decisionSteps?: ActivityDecisionStep[];
  priorityTasks?: PriorityTask[];
  reflectionPrompts?: ReflectionCardPrompt[];
}

export interface Activity {
  id: string;
  sessionId: string;
  order: number;
  title: string;
  type: ActivityType;
  description: string;
  learningGoal: string;
  estimatedMinutes: number;
  isMandatory: boolean;
  content: ActivityContent;
}

export interface ProgramSession {
  id: string;
  weekId: string;
  weekNumber: number;
  order: number;
  title: string;
  description: string;
  objective: string;
  dimensions: PWBDimension[];
  isMandatory: boolean;
  activities: Activity[];
}

export interface ProgramWeek {
  id: string;
  weekNumber: number;
  title: string;
  theme: string;
  description: string;
  primaryDimensions: PWBDimension[];
  sessions: ProgramSession[];
}

export interface SessionProgressRecord {
  sessionId: string;
  status: SessionStatus;
  startedAt?: string;
  completedAt?: string;
  activityCompletions: {
    activityId: string;
    status: 'Belum Dimulai' | 'Sedang Berlangsung' | 'Selesai';
    savedAnswer?: any;
    completedAt?: string;
  }[];
}

export interface ParticipantProgramProgress {
  participantId: string;
  programId: string;
  overallPercentage: number;
  activeWeekNumber: number;
  completedWeeks: number[];
  completedSessionsCount: number;
  totalMandatorySessionsCount: number;
  lastCompletedSessionId?: string;
  currentWorkingSessionId?: string;
  sessions: Record<string, SessionProgressRecord>; // keyed by sessionId
}

export interface ReflectionMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  isCrisisAlert?: boolean;
}

export interface ReflectionSession {
  id: string;
  participantId: string;
  weekNumber: number;
  theme: string;
  messages: ReflectionMessage[];
  summary?: {
    themeDiscussed: string;
    realizations: string;
    identifiedResources: string;
    chosenActionStep: string;
    relatedPWBDimension: PWBDimension;
    createdAt: string;
  };
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export type EvaluationStatusType = 'Belum Diisi' | 'Belum Lengkap' | 'Selesai';

export interface PWBTestItem {
  id: string;
  dimension: PWBDimension;
  dimensionLabel: string;
  statement: string;
}

export interface PWBTestAnswer {
  itemId: string;
  dimension: PWBDimension;
  score: number; // 1 to 4 (1: STS, 2: TS, 3: S, 4: SS)
}

export interface PWBTestEvaluation {
  id: string;
  participantId: string;
  type: 'pre_test' | 'post_test';
  status: EvaluationStatusType;
  submittedAt?: string;
  answers: Record<string, number>; // itemId -> score 1 to 4
  totalScore?: number; // 12 - 48
  averageScore?: number; // 1.00 - 4.00
  dimensionScores?: Record<PWBDimension, { total: number; average: number; count: number }>;
}

// Backward compatible & extended Kirkpatrick Evaluation Models
export interface KirkpatrickReactionEvaluation {
  id: string;
  participantId: string;
  status?: EvaluationStatusType;
  submittedAt: string;
  ratings: {
    relevance: number; // 1-4: 1=Sangat Tidak Puas, 2=Tidak Puas, 3=Puas, 4=Sangat Puas
    clarity: number;
    activityQuality: number;
    aiReflectionUsefulness: number;
    platformUsability: number;
    durationPacing: number;
    overallSatisfaction: number;
  };
  openFeedback: {
    mostHelpfulPart?: string;
    challengingPart?: string;
    improvementSuggestions?: string;
  };
}

export interface KirkpatrickLearningEvaluation {
  id: string;
  participantId: string;
  type: 'pre_test' | 'post_test';
  status?: EvaluationStatusType;
  submittedAt: string;
  scorePercentage: number;
  totalScore?: number; // 12 - 48
  averageScore?: number; // 1.00 - 4.00
  answers: {
    questionId: string;
    dimension: PWBDimension;
    selectedChoiceId?: string;
    score?: number; // 1 to 4
    isCorrect?: boolean;
  }[];
  dimensionScores?: Record<PWBDimension, { total: number; average: number; count: number }>;
}

export interface KirkpatrickBehaviorEvaluation {
  id: string;
  participantId: string;
  status?: EvaluationStatusType;
  submittedAt: string;
  frequencies: {
    recognizeLimitsWithoutSelfBlame: string; // 1=Tidak Pernah, 2=Jarang, 3=Sering, 4=Selalu
    constructiveAssertiveCommunication: string;
    alignDecisionsWithPersonalValues: string;
    prioritizeWorkTasksStructured: string;
    leverageSupportAndResources: string;
    connectWorkWithMeaningfulGoals: string;
    extractLearningFromWorkExperiences: string;
  };
  reflections: {
    workPracticeChanges?: string;
    helpfulFactors?: string;
    barriersFaced?: string;
    additionalSupportNeeded?: string;
  };
}

export interface KirkpatrickResultsEvaluation {
  id: string;
  participantId: string;
  status?: EvaluationStatusType;
  submittedAt: string;
  perceivedDemandsManagement: number; // 1-4
  perceivedWorkRelationships: number; // 1-4
  perceivedPurposeClarity: number; // 1-4
  perceivedOverallBenefit: number; // 1-4
  notes?: string;
}
