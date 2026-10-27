import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { db } from './server/db';
import {
  createSession,
  removeSession,
  requireAuth,
  requireRole,
  AuthenticatedRequest,
} from './server/auth';
import { generateReflectionAIResponse, generateSessionSummary } from './server/reflection';
import { PROGRAM_WEEKS, KIRKPATRICK_LEARNING_QUESTIONS, PWB_EVALUATION_ITEMS } from './src/data/programData';
import { generateSmartWorkCareExcelReport } from './server/excelExport';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// --- Authentication Endpoints ---

// 1. Participant Login without password
app.post('/api/auth/login-participant', (req: Request, res: Response) => {
  const { username } = req.body;
  if (!username || typeof username !== 'string') {
    res.status(400).json({ error: 'Harap masukkan username Anda.' });
    return;
  }

  const user = db.findUserByUsername(username);

  if (!user || user.role !== 'participant') {
    res.status(404).json({
      error: 'Username tidak ditemukan. Silakan periksa kembali username Anda atau hubungi fasilitator.',
    });
    return;
  }

  if (!user.isActive) {
    res.status(403).json({
      error: 'Akun Anda belum aktif atau sedang dinonaktifkan. Silakan hubungi fasilitator.',
    });
    return;
  }

  const token = createSession(user);
  res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      username: user.username,
      role: user.role,
      participantNumber: user.participantNumber,
      isActive: user.isActive,
      createdAt: user.createdAt,
    },
  });
});

// 2. Facilitator Login with password
app.post('/api/auth/login-facilitator', (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400).json({ error: 'Username dan kata sandi fasilitator wajib diisi.' });
    return;
  }

  const user = db.verifyFacilitatorCredentials(username, password);
  if (!user) {
    res.status(401).json({
      error: 'Username atau kata sandi fasilitator salah. Silakan coba kembali.',
    });
    return;
  }

  const token = createSession(user);
  res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      username: user.username,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
    },
  });
});

// 3. Current User verification
app.get('/api/auth/me', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  res.json({ user: req.user });
});

// 4. Logout
app.post('/api/auth/logout', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization || req.headers['x-session-token'];
  if (typeof authHeader === 'string') {
    const token = authHeader.replace('Bearer ', '').trim();
    removeSession(token);
  }
  res.json({ success: true, message: 'Berhasil keluar.' });
});

// --- Facilitator Endpoints (Management & Cohort Stats) ---

app.get(
  '/api/facilitator/participants',
  requireAuth,
  requireRole('facilitator'),
  (req: AuthenticatedRequest, res: Response) => {
    const users = db.getUsers().filter((u) => u.role === 'participant');
    const participantsWithProgress = users.map((u) => {
      const progress = db.getOrCreateProgress(u.id);
      return {
        ...u,
        progress: {
          overallPercentage: progress.overallPercentage,
          completedWeeks: progress.completedWeeks,
          activeWeekNumber: progress.activeWeekNumber,
          completedSessionsCount: progress.completedSessionsCount,
          totalMandatorySessionsCount: progress.totalMandatorySessionsCount,
        },
      };
    });
    res.json({ participants: participantsWithProgress });
  }
);

app.post(
  '/api/facilitator/participants',
  requireAuth,
  requireRole('facilitator'),
  (req: AuthenticatedRequest, res: Response) => {
    const { name } = req.body;
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      res.status(400).json({ error: 'Nama lengkap peserta minimal 2 karakter.' });
      return;
    }

    const newParticipant = db.createParticipant(name);
    res.status(201).json({
      participant: newParticipant,
      message: `Akun peserta ${newParticipant.name} berhasil dibuat dengan username: ${newParticipant.username}`,
    });
  }
);

app.patch(
  '/api/facilitator/participants/:id/toggle-active',
  requireAuth,
  requireRole('facilitator'),
  (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const { isActive } = req.body;

    if (typeof isActive !== 'boolean') {
      res.status(400).json({ error: 'Parameter isActive harus berupa boolean.' });
      return;
    }

    const updated = db.toggleUserActive(id, isActive);
    if (!updated) {
      res.status(404).json({ error: 'Peserta tidak ditemukan.' });
      return;
    }

    res.json({
      participant: updated,
      message: `Status akun ${updated.name} berhasil diubah menjadi ${updated.isActive ? 'Aktif' : 'Nonaktif'}.`,
    });
  }
);

app.get(
  '/api/facilitator/stats',
  requireAuth,
  requireRole('facilitator'),
  (req: AuthenticatedRequest, res: Response) => {
    const stats = db.getFacilitatorAggregateStats();
    res.json({ stats });
  }
);

app.get(
  '/api/facilitator/export-excel',
  requireAuth,
  requireRole('facilitator'),
  (req: AuthenticatedRequest, res: Response) => {
    try {
      const buffer = generateSmartWorkCareExcelReport();
      const dateStr = new Date().toISOString().slice(0, 10);
      const filename = `SmartWorkCare_Laporan_Kohor_${dateStr}.xlsx`;
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      );
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.send(buffer);
    } catch (err: any) {
      console.error('Export Excel failed:', err);
      res.status(500).json({ error: 'Gagal mengekspor laporan Excel SmartWorkCare.' });
    }
  }
);

// --- Program, Sessions & Progress Endpoints ---

app.get('/api/program/curriculum', (req: Request, res: Response) => {
  res.json({ weeks: PROGRAM_WEEKS });
});

app.get(
  '/api/program/my-progress',
  requireAuth,
  requireRole('participant'),
  (req: AuthenticatedRequest, res: Response) => {
    const participantId = req.user!.id;
    const progress = db.getOrCreateProgress(participantId);

    // Calculate access status for each week
    const weekAccessStatuses = PROGRAM_WEEKS.map((w) => {
      const access = db.checkWeekAccess(participantId, w.weekNumber);
      const isCompleted = progress.completedWeeks.includes(w.weekNumber);
      let statusText: 'Terkunci' | 'Siap Dimulai' | 'Sedang Berlangsung' | 'Selesai' = 'Terkunci';

      if (isCompleted) {
        statusText = 'Selesai';
      } else if (access.allowed) {
        const startedAny = w.sessions.some(
          (s) => progress.sessions[s.id]?.status === 'Sedang Berlangsung'
        );
        statusText = startedAny ? 'Sedang Berlangsung' : 'Siap Dimulai';
      }

      return {
        weekNumber: w.weekNumber,
        status: statusText,
        allowed: access.allowed,
        reason: access.reason,
      };
    });

    res.json({ progress, weekAccessStatuses });
  }
);

app.post(
  '/api/program/sessions/:sessionId/start',
  requireAuth,
  requireRole('participant'),
  (req: AuthenticatedRequest, res: Response) => {
    const participantId = req.user!.id;
    const { sessionId } = req.params;

    const result = db.startSession(participantId, sessionId);
    if (!result.success) {
      res.status(403).json({ error: result.error });
      return;
    }

    res.json({ progress: result.progress });
  }
);

app.post(
  '/api/program/sessions/:sessionId/complete-activity',
  requireAuth,
  requireRole('participant'),
  (req: AuthenticatedRequest, res: Response) => {
    const participantId = req.user!.id;
    const { sessionId } = req.params;
    const { activityId, savedAnswer } = req.body;

    if (!activityId) {
      res.status(400).json({ error: 'activityId wajib disertakan.' });
      return;
    }

    const result = db.completeActivity(participantId, sessionId, activityId, savedAnswer);
    if (!result.success) {
      res.status(403).json({ error: result.error });
      return;
    }

    res.json({ progress: result.progress });
  }
);

// --- AI Reflection Endpoints ---

app.get(
  '/api/reflection/sessions',
  requireAuth,
  requireRole('participant'),
  (req: AuthenticatedRequest, res: Response) => {
    const participantId = req.user!.id;
    const sessionsList = db.getReflections(participantId);
    res.json({ sessions: sessionsList });
  }
);

app.post(
  '/api/reflection/chat',
  requireAuth,
  requireRole('participant'),
  async (req: AuthenticatedRequest, res: Response) => {
    const { message, history, weekNumber, theme } = req.body;

    if (!message || typeof message !== 'string' || !message.trim()) {
      res.status(400).json({ error: 'Pesan tidak boleh kosong.' });
      return;
    }

    const result = await generateReflectionAIResponse(
      message.trim(),
      history || [],
      weekNumber || 1,
      theme || 'Refleksi Diri'
    );

    res.json(result);
  }
);

app.post(
  '/api/reflection/finish',
  requireAuth,
  requireRole('participant'),
  async (req: AuthenticatedRequest, res: Response) => {
    const participantId = req.user!.id;
    const { sessionId, weekNumber, theme, history } = req.body;

    if (!history || !Array.isArray(history) || history.length === 0) {
      res.status(400).json({ error: 'Riwayat percakapan tidak boleh kosong.' });
      return;
    }

    const summary = await generateSessionSummary(history, weekNumber || 1);

    const reflectionSession = {
      id: sessionId || `refl_${Date.now()}`,
      participantId,
      weekNumber: weekNumber || 1,
      theme: theme || 'Refleksi Diri',
      messages: history,
      summary: {
        ...summary,
        createdAt: new Date().toISOString(),
      },
      isCompleted: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    db.saveReflectionSession(reflectionSession);
    res.json({ session: reflectionSession });
  }
);

// --- Kirkpatrick Evaluation Endpoints ---

app.get(
  '/api/evaluations/my-status',
  requireAuth,
  requireRole('participant'),
  (req: AuthenticatedRequest, res: Response) => {
    const participantId = req.user!.id;
    const rx = db.getReactionEvaluation(participantId);
    const learnings = db.getLearningEvaluations(participantId);
    const preTest = learnings.find((l) => l.type === 'pre_test');
    const postTest = learnings.find((l) => l.type === 'post_test');
    const behavior = db.getBehaviorEvaluation(participantId);
    const results = db.getResultsEvaluation(participantId);

    res.json({
      reaction: rx || null,
      preTest: preTest || null,
      postTest: postTest || null,
      learningDelta:
        preTest && postTest
          ? Number((postTest.scorePercentage - preTest.scorePercentage).toFixed(1))
          : null,
      behavior: behavior || null,
      results: results || null,
    });
  }
);

// Kirkpatrick Level 1: Reaction
app.post(
  '/api/evaluations/level1-reaction',
  requireAuth,
  requireRole('participant'),
  (req: AuthenticatedRequest, res: Response) => {
    const participantId = req.user!.id;
    const { ratings, openFeedback } = req.body;

    if (!ratings) {
      res.status(400).json({ error: 'Data penilaian evaluasi Reaction wajib diisi.' });
      return;
    }

    const evalRecord = {
      id: `eval_rx_${Date.now()}`,
      participantId,
      submittedAt: new Date().toISOString(),
      ratings,
      openFeedback: openFeedback || {},
    };

    db.saveReactionEvaluation(evalRecord);
    res.json({ success: true, evaluation: evalRecord });
  }
);

// Kirkpatrick Level 2: Learning (Pre-Test & Post-Test)
app.get('/api/evaluations/pwb-items', (req: Request, res: Response) => {
  res.json({
    items: PWB_EVALUATION_ITEMS,
    scaleLabels: {
      1: 'Sangat Tidak Setuju',
      2: 'Tidak Setuju',
      3: 'Setuju',
      4: 'Sangat Setuju',
    },
  });
});

app.get('/api/evaluations/learning-questions', (req: Request, res: Response) => {
  res.json({
    questions: KIRKPATRICK_LEARNING_QUESTIONS,
    pwbItems: PWB_EVALUATION_ITEMS,
  });
});

app.post(
  '/api/evaluations/level2-learning',
  requireAuth,
  requireRole('participant'),
  (req: AuthenticatedRequest, res: Response) => {
    const participantId = req.user!.id;
    const { type, userAnswers } = req.body;

    if (!type || (type !== 'pre_test' && type !== 'post_test')) {
      res.status(400).json({ error: 'Tipe tes harus berupa pre_test atau post_test.' });
      return;
    }

    if (!userAnswers || typeof userAnswers !== 'object') {
      res.status(400).json({ error: 'Jawaban tes tidak valid.' });
      return;
    }

    // Check if user submitted scale 1-4 PWB items
    const hasPWBKeys = PWB_EVALUATION_ITEMS.some((item) => userAnswers[item.id] !== undefined);

    if (hasPWBKeys) {
      const answers: {
        questionId: string;
        dimension: any;
        score: number;
      }[] = [];

      const validScores: number[] = [];

      PWB_EVALUATION_ITEMS.forEach((item) => {
        const rawVal = userAnswers[item.id];
        if (rawVal !== undefined && rawVal !== null && rawVal !== '') {
          const numScore = Number(rawVal);
          if (numScore >= 1 && numScore <= 4) {
            answers.push({
              questionId: item.id,
              dimension: item.dimension,
              score: numScore,
            });
            validScores.push(numScore);
          }
        }
      });

      const totalScore = validScores.length ? validScores.reduce((a, b) => a + b, 0) : undefined;
      const averageScore = validScores.length ? Number((totalScore! / validScores.length).toFixed(2)) : undefined;
      const status = validScores.length === PWB_EVALUATION_ITEMS.length ? 'Selesai' : (validScores.length > 0 ? 'Belum Lengkap' : 'Belum Diisi');

      // Normalized percentage (scale 1 to 4 -> 0% to 100%)
      const scorePercentage = averageScore ? Math.round(((averageScore - 1) / 3) * 100) : 0;

      const record = {
        id: `eval_lrn_${type}_${Date.now()}`,
        participantId,
        type: type as 'pre_test' | 'post_test',
        submittedAt: new Date().toISOString(),
        scorePercentage,
        totalScore,
        averageScore,
        status: status as any,
        answers,
      };

      db.saveLearningEvaluation(record);
      res.json({
        success: true,
        evaluation: record,
        message: status === 'Selesai'
          ? `${type === 'pre_test' ? 'Pre-Test' : 'Post-Test'} PWB berhasil disimpan lengkap.`
          : `${type === 'pre_test' ? 'Pre-Test' : 'Post-Test'} tersimpan (${validScores.length}/${PWB_EVALUATION_ITEMS.length} terisi).`,
      });
      return;
    }

    // Legacy fallback for multiple-choice questions if any
    let correctCount = 0;
    const gradedAnswers = KIRKPATRICK_LEARNING_QUESTIONS.map((q) => {
      const selectedChoiceId = userAnswers[q.id];
      const correctOption = q.options.find((opt) => opt.isCorrect);
      const isCorrect = correctOption?.id === selectedChoiceId;
      if (isCorrect) correctCount++;

      return {
        questionId: q.id,
        dimension: q.dimension,
        selectedChoiceId,
        isCorrect,
      };
    });

    const scorePercentage = Math.round(
      (correctCount / KIRKPATRICK_LEARNING_QUESTIONS.length) * 100
    );

    const record = {
      id: `eval_lrn_${type}_${Date.now()}`,
      participantId,
      type: type as 'pre_test' | 'post_test',
      submittedAt: new Date().toISOString(),
      scorePercentage,
      status: 'Selesai' as any,
      answers: gradedAnswers,
    };

    db.saveLearningEvaluation(record);
    res.json({ success: true, evaluation: record });
  }
);

// Kirkpatrick Level 3: Behavior
app.post(
  '/api/evaluations/level3-behavior',
  requireAuth,
  requireRole('participant'),
  (req: AuthenticatedRequest, res: Response) => {
    const participantId = req.user!.id;
    const { frequencies, reflections } = req.body;

    if (!frequencies) {
      res.status(400).json({ error: 'Penilaian frekuensi perilaku wajib diisi.' });
      return;
    }

    const record = {
      id: `eval_bhv_${Date.now()}`,
      participantId,
      submittedAt: new Date().toISOString(),
      frequencies,
      reflections: reflections || {},
    };

    db.saveBehaviorEvaluation(record);
    res.json({ success: true, evaluation: record });
  }
);

// Kirkpatrick Level 4: Results
app.post(
  '/api/evaluations/level4-results',
  requireAuth,
  requireRole('participant'),
  (req: AuthenticatedRequest, res: Response) => {
    const participantId = req.user!.id;
    const {
      perceivedDemandsManagement,
      perceivedWorkRelationships,
      perceivedPurposeClarity,
      perceivedOverallBenefit,
      notes,
    } = req.body;

    const record = {
      id: `eval_res_${Date.now()}`,
      participantId,
      submittedAt: new Date().toISOString(),
      perceivedDemandsManagement: Number(perceivedDemandsManagement) || 3,
      perceivedWorkRelationships: Number(perceivedWorkRelationships) || 3,
      perceivedPurposeClarity: Number(perceivedPurposeClarity) || 3,
      perceivedOverallBenefit: Number(perceivedOverallBenefit) || 3,
      notes: notes || '',
    };

    db.saveResultsEvaluation(record);
    res.json({ success: true, evaluation: record });
  }
);

// --- Vite Middlewares Setup ---

async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SmartWorkCare server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
