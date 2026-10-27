import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import {
  User,
  ParticipantProgramProgress,
  ReflectionSession,
  KirkpatrickReactionEvaluation,
  KirkpatrickLearningEvaluation,
  KirkpatrickBehaviorEvaluation,
  KirkpatrickResultsEvaluation,
} from '../src/types';
import { PROGRAM_WEEKS } from '../src/data/programData';

const DB_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DB_DIR, 'smartworkcare-db.json');

interface StoredUser extends User {
  passwordHash?: string; // only for facilitator
  passwordSalt?: string;
}

interface DatabaseSchema {
  users: StoredUser[];
  participantNumberCounter: number;
  progress: Record<string, ParticipantProgramProgress>; // participantId -> progress
  reflections: Record<string, ReflectionSession[]>;     // participantId -> sessions
  evaluationsReaction: KirkpatrickReactionEvaluation[];
  evaluationsLearning: KirkpatrickLearningEvaluation[];
  evaluationsBehavior: KirkpatrickBehaviorEvaluation[];
  evaluationsResults: KirkpatrickResultsEvaluation[];
}

// Password hashing using standard Node.js crypto
export function hashPassword(password: string, salt?: string): { hash: string; salt: string } {
  const generatedSalt = salt || crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, generatedSalt, 1000, 64, 'sha512').toString('hex');
  return { hash, salt: generatedSalt };
}

export function verifyPassword(password: string, hash: string, salt: string): boolean {
  const verified = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return verified === hash;
}

// Initial Facilitator setup according to instructions:
// Username: fasilitator_hr
// Initial Password: SwcFasilitator#2026
// Role: facilitator
const INITIAL_FACILITATOR_PASSWORD = 'SwcFasilitator#2026';
const initialFacilitatorAuth = hashPassword(INITIAL_FACILITATOR_PASSWORD);

const INITIAL_DB: DatabaseSchema = {
  users: [
    {
      id: 'user_facilitator_1',
      name: 'Fasilitator HR SmartWorkCare',
      username: 'fasilitator_hr',
      role: 'facilitator',
      isActive: true,
      createdAt: '2026-10-20T08:00:00.000Z',
      updatedAt: '2026-10-20T08:00:00.000Z',
      passwordHash: initialFacilitatorAuth.hash,
      passwordSalt: initialFacilitatorAuth.salt,
    },
    // Seed initial test participants (clearly marked for testing, format: nama_nomor)
    {
      id: 'part_001',
      name: 'Siti Nurhaliza',
      username: 'nur_001',
      role: 'participant',
      participantNumber: '001',
      isActive: true,
      createdAt: '2026-10-21T09:00:00.000Z',
      updatedAt: '2026-10-21T09:00:00.000Z',
    },
    {
      id: 'part_002',
      name: 'Budi Santoso',
      username: 'budi_santoso_002',
      role: 'participant',
      participantNumber: '002',
      isActive: true,
      createdAt: '2026-10-21T10:00:00.000Z',
      updatedAt: '2026-10-21T10:00:00.000Z',
    },
    {
      id: 'part_003',
      name: 'Dewi Lestari',
      username: 'dewi_lestari_003',
      role: 'participant',
      participantNumber: '003',
      isActive: true,
      createdAt: '2026-10-22T11:00:00.000Z',
      updatedAt: '2026-10-22T11:00:00.000Z',
    },
    {
      id: 'part_004',
      name: 'Andi Pratama (Akun Nonaktif Uji Coba)',
      username: 'andi_004',
      role: 'participant',
      participantNumber: '004',
      isActive: false, // Inactive account for testing inactive login rejection
      createdAt: '2026-10-22T12:00:00.000Z',
      updatedAt: '2026-10-22T12:00:00.000Z',
    },
  ],
  participantNumberCounter: 4,
  progress: {},
  reflections: {},
  evaluationsReaction: [],
  evaluationsLearning: [],
  evaluationsBehavior: [],
  evaluationsResults: [],
};

class Database {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.load();
  }

  private load(): DatabaseSchema {
    try {
      if (!fs.existsSync(DB_DIR)) {
        fs.mkdirSync(DB_DIR, { recursive: true });
      }
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        return JSON.parse(raw);
      }
    } catch (e) {
      console.error('Failed to load database file, initializing fresh:', e);
    }
    this.save(INITIAL_DB);
    return INITIAL_DB;
  }

  private save(data: DatabaseSchema) {
    try {
      if (!fs.existsSync(DB_DIR)) {
        fs.mkdirSync(DB_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (e) {
      console.error('Failed to write database file:', e);
    }
  }

  // --- Users & Auth ---
  public getUsers(): User[] {
    return this.data.users.map(({ passwordHash, passwordSalt, ...u }) => u);
  }

  public findUserById(id: string): User | undefined {
    const u = this.data.users.find((user) => user.id === id);
    if (!u) return undefined;
    const { passwordHash, passwordSalt, ...safeUser } = u;
    return safeUser;
  }

  public findUserByUsername(username: string): StoredUser | undefined {
    return this.data.users.find(
      (user) => user.username.toLowerCase() === username.trim().toLowerCase()
    );
  }

  public verifyFacilitatorCredentials(username: string, plainPass: string): User | null {
    const user = this.findUserByUsername(username);
    if (!user || user.role !== 'facilitator' || !user.isActive) {
      return null;
    }
    if (!user.passwordHash || !user.passwordSalt) {
      return null;
    }
    const isValid = verifyPassword(plainPass, user.passwordHash, user.passwordSalt);
    if (!isValid) return null;
    const { passwordHash, passwordSalt, ...safeUser } = user;
    return safeUser;
  }

  // Generate unique username with format nama_nomor according to prompt specifications:
  // 1. Ambil nama peserta.
  // 2. Ubah menjadi huruf kecil.
  // 3. Hapus spasi berlebih di awal dan akhir.
  // 4. Ganti spasi di antara kata dengan underscore.
  // 5. Hilangkan karakter yang tidak sesuai.
  // 6. Tambahkan nomor peserta tiga digit yang unik.
  // 7. Periksa apakah username sudah digunakan.
  public generateUniqueUsername(fullName: string): { username: string; participantNumber: string } {
    let cleanName = fullName
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '_')
      .replace(/[^a-z0-9_]/g, '');

    if (!cleanName) {
      cleanName = 'peserta';
    }

    let nextNumber = this.data.participantNumberCounter + 1;
    let candidateUsername = '';
    let candidateNumberStr = '';

    while (true) {
      candidateNumberStr = String(nextNumber).padStart(3, '0');
      candidateUsername = `${cleanName}_${candidateNumberStr}`;
      const exists = this.data.users.some(
        (u) => u.username.toLowerCase() === candidateUsername.toLowerCase()
      );
      if (!exists) {
        break;
      }
      nextNumber++;
    }

    return { username: candidateUsername, participantNumber: candidateNumberStr };
  }

  public createParticipant(name: string): User {
    const { username, participantNumber } = this.generateUniqueUsername(name);
    const newId = `part_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date().toISOString();

    const newUser: StoredUser = {
      id: newId,
      name: name.trim(),
      username,
      role: 'participant',
      participantNumber,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    };

    this.data.users.push(newUser);
    const numVal = parseInt(participantNumber, 10);
    if (numVal > this.data.participantNumberCounter) {
      this.data.participantNumberCounter = numVal;
    }

    // Initialize progress record immediately
    this.getOrCreateProgress(newId);

    this.save(this.data);
    const { passwordHash, passwordSalt, ...safeUser } = newUser;
    return safeUser;
  }

  public toggleUserActive(userId: string, isActive: boolean): User | null {
    const userIndex = this.data.users.findIndex((u) => u.id === userId);
    if (userIndex === -1) return null;
    this.data.users[userIndex].isActive = isActive;
    this.data.users[userIndex].updatedAt = new Date().toISOString();
    this.save(this.data);
    const { passwordHash, passwordSalt, ...safeUser } = this.data.users[userIndex];
    return safeUser;
  }

  // --- Progress Management & 4-Week Sequential Locking ---

  public getOrCreateProgress(participantId: string): ParticipantProgramProgress {
    if (!this.data.progress[participantId]) {
      const allMandatorySessions = PROGRAM_WEEKS.flatMap((w) => w.sessions).filter(
        (s) => s.isMandatory
      );

      this.data.progress[participantId] = {
        participantId,
        programId: 'smartworkcare_4weeks',
        overallPercentage: 0,
        activeWeekNumber: 1,
        completedWeeks: [],
        completedSessionsCount: 0,
        totalMandatorySessionsCount: allMandatorySessions.length,
        sessions: {},
      };
      this.save(this.data);
    }
    return this.data.progress[participantId];
  }

  public checkWeekAccess(participantId: string, weekNumber: number): { allowed: boolean; reason?: string } {
    if (weekNumber === 1) {
      return { allowed: true };
    }

    const progress = this.getOrCreateProgress(participantId);

    // Week N requires all mandatory sessions of Week 1..N-1 to be completed
    for (let w = 1; w < weekNumber; w++) {
      const weekDef = PROGRAM_WEEKS.find((item) => item.weekNumber === w);
      if (!weekDef) continue;
      const mandatorySessions = weekDef.sessions.filter((s) => s.isMandatory);
      const allDone = mandatorySessions.every(
        (s) => progress.sessions[s.id]?.status === 'Selesai'
      );
      if (!allDone) {
        return {
          allowed: false,
          reason: `Minggu ini belum tersedia. Selesaikan seluruh sesi wajib pada Minggu ${w} untuk melanjutkan program.`,
        };
      }
    }

    return { allowed: true };
  }

  public startSession(participantId: string, sessionId: string): { success: boolean; progress?: ParticipantProgramProgress; error?: string } {
    const sessionDef = PROGRAM_WEEKS.flatMap((w) => w.sessions).find((s) => s.id === sessionId);
    if (!sessionDef) {
      return { success: false, error: 'Sesi tidak ditemukan.' };
    }

    const weekAccess = this.checkWeekAccess(participantId, sessionDef.weekNumber);
    if (!weekAccess.allowed) {
      return { success: false, error: weekAccess.reason };
    }

    const progress = this.getOrCreateProgress(participantId);
    if (!progress.sessions[sessionId]) {
      progress.sessions[sessionId] = {
        sessionId,
        status: 'Sedang Berlangsung',
        startedAt: new Date().toISOString(),
        activityCompletions: [],
      };
    } else if (progress.sessions[sessionId].status === 'Belum Dimulai') {
      progress.sessions[sessionId].status = 'Sedang Berlangsung';
      if (!progress.sessions[sessionId].startedAt) {
        progress.sessions[sessionId].startedAt = new Date().toISOString();
      }
    }

    progress.currentWorkingSessionId = sessionId;
    this.save(this.data);
    return { success: true, progress };
  }

  public completeActivity(
    participantId: string,
    sessionId: string,
    activityId: string,
    savedAnswer?: any
  ): { success: boolean; progress?: ParticipantProgramProgress; error?: string } {
    const sessionDef = PROGRAM_WEEKS.flatMap((w) => w.sessions).find((s) => s.id === sessionId);
    if (!sessionDef) {
      return { success: false, error: 'Sesi tidak ditemukan.' };
    }

    const weekAccess = this.checkWeekAccess(participantId, sessionDef.weekNumber);
    if (!weekAccess.allowed) {
      return { success: false, error: weekAccess.reason };
    }

    const progress = this.getOrCreateProgress(participantId);
    if (!progress.sessions[sessionId]) {
      progress.sessions[sessionId] = {
        sessionId,
        status: 'Sedang Berlangsung',
        startedAt: new Date().toISOString(),
        activityCompletions: [],
      };
    }

    const sessionProg = progress.sessions[sessionId];
    const existingActIdx = sessionProg.activityCompletions.findIndex(
      (a) => a.activityId === activityId
    );

    const completionRecord = {
      activityId,
      status: 'Selesai' as const,
      savedAnswer: savedAnswer || null,
      completedAt: new Date().toISOString(),
    };

    if (existingActIdx >= 0) {
      sessionProg.activityCompletions[existingActIdx] = completionRecord;
    } else {
      sessionProg.activityCompletions.push(completionRecord);
    }

    // Check if all mandatory activities in this session are completed
    const mandatoryActs = sessionDef.activities.filter((a) => a.isMandatory);
    const allActsDone = mandatoryActs.every((act) =>
      sessionProg.activityCompletions.some(
        (c) => c.activityId === act.id && c.status === 'Selesai'
      )
    );

    if (allActsDone && sessionProg.status !== 'Selesai') {
      sessionProg.status = 'Selesai';
      sessionProg.completedAt = new Date().toISOString();
      progress.lastCompletedSessionId = sessionId;
    }

    // Recalculate overall progress
    this.recalculateProgress(participantId);
    this.save(this.data);

    return { success: true, progress: this.data.progress[participantId] };
  }

  private recalculateProgress(participantId: string) {
    const progress = this.data.progress[participantId];
    if (!progress) return;

    const allMandatorySessions = PROGRAM_WEEKS.flatMap((w) => w.sessions).filter(
      (s) => s.isMandatory
    );
    const completedCount = allMandatorySessions.filter(
      (s) => progress.sessions[s.id]?.status === 'Selesai'
    ).length;

    progress.completedSessionsCount = completedCount;
    progress.totalMandatorySessionsCount = allMandatorySessions.length;
    progress.overallPercentage = Math.round(
      (completedCount / allMandatorySessions.length) * 100
    );

    // Determine completed weeks
    const completedWeeks: number[] = [];
    for (const week of PROGRAM_WEEKS) {
      const mandInWeek = week.sessions.filter((s) => s.isMandatory);
      if (mandInWeek.every((s) => progress.sessions[s.id]?.status === 'Selesai')) {
        completedWeeks.push(week.weekNumber);
      }
    }
    progress.completedWeeks = completedWeeks;

    // Determine active week number
    if (completedWeeks.length === 4) {
      progress.activeWeekNumber = 4;
    } else {
      progress.activeWeekNumber = (completedWeeks.length ? Math.max(...completedWeeks) : 0) + 1;
    }
  }

  // --- AI Reflection Management ---
  public getReflections(participantId: string): ReflectionSession[] {
    return this.data.reflections[participantId] || [];
  }

  public saveReflectionSession(session: ReflectionSession): void {
    if (!this.data.reflections[session.participantId]) {
      this.data.reflections[session.participantId] = [];
    }
    const sessions = this.data.reflections[session.participantId];
    const idx = sessions.findIndex((s) => s.id === session.id);
    if (idx >= 0) {
      sessions[idx] = session;
    } else {
      sessions.push(session);
    }
    this.save(this.data);
  }

  // --- Kirkpatrick Evaluations ---
  public saveReactionEvaluation(evaluation: KirkpatrickReactionEvaluation): void {
    const idx = this.data.evaluationsReaction.findIndex((e) => e.participantId === evaluation.participantId);
    const enriched = {
      ...evaluation,
      status: 'Selesai' as const,
    };
    if (idx >= 0) {
      this.data.evaluationsReaction[idx] = enriched;
    } else {
      this.data.evaluationsReaction.push(enriched);
    }
    this.save(this.data);
  }

  public getReactionEvaluation(participantId: string): KirkpatrickReactionEvaluation | undefined {
    return this.data.evaluationsReaction.find((e) => e.participantId === participantId);
  }

  public saveLearningEvaluation(evaluation: KirkpatrickLearningEvaluation): void {
    // If scores are provided on 1-4 scale, compute averages and totals
    const scores = evaluation.answers
      .map((a) => a.score)
      .filter((s): s is number => typeof s === 'number' && s >= 1 && s <= 4);

    let averageScore: number | undefined = undefined;
    let totalScore: number | undefined = undefined;
    let status: 'Selesai' | 'Belum Lengkap' | 'Belum Diisi' = 'Belum Diisi';

    if (scores.length === 12) {
      totalScore = scores.reduce((sum, val) => sum + val, 0);
      averageScore = Number((totalScore / 12).toFixed(2));
      status = 'Selesai';
    } else if (scores.length > 0) {
      totalScore = scores.reduce((sum, val) => sum + val, 0);
      averageScore = Number((totalScore / scores.length).toFixed(2));
      status = 'Belum Lengkap';
    }

    // Compute dimension breakdown
    const dimensionScores: Record<string, { total: number; average: number; count: number }> = {};
    for (const ans of evaluation.answers) {
      if (typeof ans.score === 'number') {
        if (!dimensionScores[ans.dimension]) {
          dimensionScores[ans.dimension] = { total: 0, average: 0, count: 0 };
        }
        dimensionScores[ans.dimension].total += ans.score;
        dimensionScores[ans.dimension].count += 1;
      }
    }
    for (const dim in dimensionScores) {
      const entry = dimensionScores[dim];
      entry.average = Number((entry.total / entry.count).toFixed(2));
    }

    const enriched: KirkpatrickLearningEvaluation = {
      ...evaluation,
      totalScore,
      averageScore,
      status: evaluation.status || status,
      dimensionScores: dimensionScores as any,
    };

    const idx = this.data.evaluationsLearning.findIndex(
      (e) => e.participantId === evaluation.participantId && e.type === evaluation.type
    );
    if (idx >= 0) {
      this.data.evaluationsLearning[idx] = enriched;
    } else {
      this.data.evaluationsLearning.push(enriched);
    }
    this.save(this.data);
  }

  public getLearningEvaluations(participantId: string): KirkpatrickLearningEvaluation[] {
    return this.data.evaluationsLearning.filter((e) => e.participantId === participantId);
  }

  public saveBehaviorEvaluation(evaluation: KirkpatrickBehaviorEvaluation): void {
    const idx = this.data.evaluationsBehavior.findIndex((e) => e.participantId === evaluation.participantId);
    const enriched = {
      ...evaluation,
      status: 'Selesai' as const,
    };
    if (idx >= 0) {
      this.data.evaluationsBehavior[idx] = enriched;
    } else {
      this.data.evaluationsBehavior.push(enriched);
    }
    this.save(this.data);
  }

  public getBehaviorEvaluation(participantId: string): KirkpatrickBehaviorEvaluation | undefined {
    return this.data.evaluationsBehavior.find((e) => e.participantId === participantId);
  }

  public saveResultsEvaluation(evaluation: KirkpatrickResultsEvaluation): void {
    const idx = this.data.evaluationsResults.findIndex((e) => e.participantId === evaluation.participantId);
    const enriched = {
      ...evaluation,
      status: 'Selesai' as const,
    };
    if (idx >= 0) {
      this.data.evaluationsResults[idx] = enriched;
    } else {
      this.data.evaluationsResults.push(enriched);
    }
    this.save(this.data);
  }

  public getResultsEvaluation(participantId: string): KirkpatrickResultsEvaluation | undefined {
    return this.data.evaluationsResults.find((e) => e.participantId === participantId);
  }

  public getAllEvaluations() {
    return {
      reactions: this.data.evaluationsReaction,
      learnings: this.data.evaluationsLearning,
      behaviors: this.data.evaluationsBehavior,
      results: this.data.evaluationsResults,
    };
  }

  // --- Facilitator Aggregate Statistics ---
  public getFacilitatorAggregateStats() {
    const participants = this.data.users.filter((u) => u.role === 'participant');
    const totalParticipants = participants.length;
    const activeParticipants = participants.filter((u) => u.isActive).length;

    let notStartedCount = 0;
    let inProgressCount = 0;
    let completedCount = 0;

    const weekProgressCounts: Record<number, { notStarted: number; inProgress: number; completed: number }> = {
      1: { notStarted: 0, inProgress: 0, completed: 0 },
      2: { notStarted: 0, inProgress: 0, completed: 0 },
      3: { notStarted: 0, inProgress: 0, completed: 0 },
      4: { notStarted: 0, inProgress: 0, completed: 0 },
    };

    for (const p of participants) {
      const prog = this.data.progress[p.id];
      if (!prog || prog.overallPercentage === 0) {
        notStartedCount++;
      } else if (prog.overallPercentage >= 100) {
        completedCount++;
      } else {
        inProgressCount++;
      }

      for (const w of PROGRAM_WEEKS) {
        const mandSessions = w.sessions.filter((s) => s.isMandatory);
        const doneInWeek = mandSessions.filter((s) => prog?.sessions[s.id]?.status === 'Selesai').length;
        const startedInWeek = mandSessions.filter((s) => prog?.sessions[s.id]?.status === 'Sedang Berlangsung').length;

        if (doneInWeek === mandSessions.length && mandSessions.length > 0) {
          weekProgressCounts[w.weekNumber].completed++;
        } else if (doneInWeek > 0 || startedInWeek > 0) {
          weekProgressCounts[w.weekNumber].inProgress++;
        } else {
          weekProgressCounts[w.weekNumber].notStarted++;
        }
      }
    }

    // Reaction Level 1 Average
    const rx = this.data.evaluationsReaction;
    const reactionCount = rx.length;
    let avgReaction = 0;
    if (reactionCount > 0) {
      const sum = rx.reduce((acc, curr) => {
        const itemSum =
          curr.ratings.relevance +
          curr.ratings.clarity +
          curr.ratings.activityQuality +
          curr.ratings.aiReflectionUsefulness +
          curr.ratings.platformUsability +
          curr.ratings.durationPacing +
          curr.ratings.overallSatisfaction;
        return acc + itemSum / 7;
      }, 0);
      avgReaction = Number((sum / reactionCount).toFixed(2));
    }

    // Learning Level 2 Pre/Post comparisons (Scale 1-4 with matched pairs)
    const completedPreTests = this.data.evaluationsLearning.filter(
      (e) => e.type === 'pre_test' && (e.status === 'Selesai' || (e.averageScore !== undefined && e.averageScore > 0))
    );
    const completedPostTests = this.data.evaluationsLearning.filter(
      (e) => e.type === 'post_test' && (e.status === 'Selesai' || (e.averageScore !== undefined && e.averageScore > 0))
    );

    // Compute average on 1-4 scale
    const avgPreTest = completedPreTests.length
      ? Number(
          (
            completedPreTests.reduce((a, c) => a + (c.averageScore || 0), 0) /
            completedPreTests.length
          ).toFixed(2)
        )
      : null;

    const avgPostTest = completedPostTests.length
      ? Number(
          (
            completedPostTests.reduce((a, c) => a + (c.averageScore || 0), 0) /
            completedPostTests.length
          ).toFixed(2)
        )
      : null;

    // Matched pairs delta calculation (only participants with both completed)
    const matchedDeltas: number[] = [];
    for (const p of participants) {
      const pre = completedPreTests.find((e) => e.participantId === p.id);
      const post = completedPostTests.find((e) => e.participantId === p.id);
      if (pre && post && pre.averageScore !== undefined && post.averageScore !== undefined) {
        matchedDeltas.push(Number((post.averageScore - pre.averageScore).toFixed(2)));
      }
    }

    const matchedPairsCount = matchedDeltas.length;
    let deltaLearning: number | null = null;
    if (matchedPairsCount > 0) {
      const sumDelta = matchedDeltas.reduce((a, b) => a + b, 0);
      deltaLearning = Number((sumDelta / matchedPairsCount).toFixed(2));
    }

    // Evaluation completion breakdown per participant
    let evalPreCompletedCount = 0;
    let evalPostCompletedCount = 0;
    let evalL1CompletedCount = 0;
    let evalL3CompletedCount = 0;
    let evalL4CompletedCount = 0;

    for (const p of participants) {
      const pPre = this.data.evaluationsLearning.find((e) => e.participantId === p.id && e.type === 'pre_test');
      if (pPre?.status === 'Selesai') evalPreCompletedCount++;
      const pPost = this.data.evaluationsLearning.find((e) => e.participantId === p.id && e.type === 'post_test');
      if (pPost?.status === 'Selesai') evalPostCompletedCount++;
      const pL1 = this.data.evaluationsReaction.find((e) => e.participantId === p.id);
      if (pL1) evalL1CompletedCount++;
      const pL3 = this.data.evaluationsBehavior.find((e) => e.participantId === p.id);
      if (pL3) evalL3CompletedCount++;
      const pL4 = this.data.evaluationsResults.find((e) => e.participantId === p.id);
      if (pL4) evalL4CompletedCount++;
    }

    return {
      totalParticipants,
      activeParticipants,
      notStartedCount,
      inProgressCount,
      completedCount,
      programCompletionRate: totalParticipants
        ? Math.round((completedCount / totalParticipants) * 100)
        : 0,
      weekProgressCounts,
      evaluations: {
        reactionResponsesCount: reactionCount,
        averageReactionScore: avgReaction, // scale 1 - 4
        preTestResponsesCount: completedPreTests.length,
        postTestResponsesCount: completedPostTests.length,
        matchedPairsCount,
        avgPreTestScore: avgPreTest, // scale 1.00 - 4.00
        avgPostTestScore: avgPostTest, // scale 1.00 - 4.00
        deltaLearningScore: deltaLearning, // matched pair delta
        behaviorResponsesCount: this.data.evaluationsBehavior.length,
        resultsResponsesCount: this.data.evaluationsResults.length,
        completionCounts: {
          preTest: evalPreCompletedCount,
          postTest: evalPostCompletedCount,
          reactionL1: evalL1CompletedCount,
          behaviorL3: evalL3CompletedCount,
          resultsL4: evalL4CompletedCount,
        },
      },
    };
  }
}

export const db = new Database();
