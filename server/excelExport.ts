import * as XLSX from 'xlsx';
import { db } from './db';
import { PROGRAM_WEEKS } from '../src/data/programData';

export function generateSmartWorkCareExcelReport(): Buffer {
  const participants = db.getUsers().filter((u) => u.role === 'participant');
  const evaluations = db.getAllEvaluations();
  const cohortStats = db.getFacilitatorAggregateStats();

  // 1. Sheet: Data Peserta
  const dataPesertaRows = participants.map((p) => {
    const prog = db.getOrCreateProgress(p.id);
    let programStatus = 'Belum Dimulai';
    if (prog.overallPercentage >= 100) {
      programStatus = 'Selesai';
    } else if (prog.overallPercentage > 0) {
      programStatus = 'Sedang Berlangsung';
    }

    return {
      'ID Peserta': p.id,
      'Username': p.username,
      'Nama Lengkap': p.name,
      'Nomor Peserta': p.participantNumber || '-',
      'Status Akun': p.isActive ? 'Aktif' : 'Nonaktif',
      'Tanggal Registrasi': p.createdAt ? new Date(p.createdAt).toLocaleDateString('id-ID') : '-',
      'Progres Program (%)': `${prog.overallPercentage}%`,
      'Sesi Selesai': `${prog.completedSessionsCount} / ${prog.totalMandatorySessionsCount || 8}`,
      'Status Program': programStatus,
    };
  });

  // 2. Sheet: Progres Mingguan
  const progresMingguanRows = participants.map((p) => {
    const prog = db.getOrCreateProgress(p.id);

    const getWeekStatus = (wNum: number) => {
      const isCompleted = prog.completedWeeks.includes(wNum);
      if (isCompleted) return 'Selesai';
      const access = db.checkWeekAccess(p.id, wNum);
      if (!access.allowed) return 'Terkunci';
      const week = PROGRAM_WEEKS.find((w) => w.weekNumber === wNum);
      const started = week?.sessions.some((s) => prog.sessions[s.id]?.status === 'Sedang Berlangsung');
      return started ? 'Sedang Berlangsung' : 'Siap Dimulai';
    };

    return {
      'ID Peserta': p.id,
      'Username': p.username,
      'Nama Lengkap': p.name,
      'Minggu 1: Mengenali & Menerima Diri': getWeekStatus(1),
      'Minggu 2: Membangun Hubungan Positif': getWeekStatus(2),
      'Minggu 3: Mengelola Tantangan Kerja': getWeekStatus(3),
      'Minggu 4: Menemukan Tujuan & Bertumbuh': getWeekStatus(4),
      'Total Sesi Terselesaikan': prog.completedSessionsCount,
      'Status Kelulusan': prog.completedWeeks.length === 4 ? 'Lulus Program' : 'Dalam Proses',
    };
  });

  // 3. Sheet: Hasil Pre-test
  const preTestRows = participants.map((p) => {
    const pre = evaluations.learnings.find((l) => l.participantId === p.id && l.type === 'pre_test');
    const isCompleted = pre && (pre.status === 'Selesai' || (pre.averageScore !== undefined && pre.averageScore > 0));

    return {
      'ID Peserta': p.id,
      'Username': p.username,
      'Nama Lengkap': p.name,
      'Status Pre-test': isCompleted ? 'Selesai' : (pre ? 'Belum Lengkap' : 'Belum Diisi'),
      'Tanggal Pengisian': pre?.submittedAt ? new Date(pre.submittedAt).toLocaleDateString('id-ID') : '-',
      'Rata-rata Skor (1-4)': isCompleted ? pre?.averageScore : '-',
      'Total Skor (12-48)': isCompleted ? pre?.totalScore : '-',
      'Self-Acceptance': isCompleted && pre?.dimensionScores?.self_acceptance ? pre.dimensionScores.self_acceptance.average : '-',
      'Positive Relations': isCompleted && pre?.dimensionScores?.positive_relations ? pre.dimensionScores.positive_relations.average : '-',
      'Autonomy': isCompleted && pre?.dimensionScores?.autonomy ? pre.dimensionScores.autonomy.average : '-',
      'Environmental Mastery': isCompleted && pre?.dimensionScores?.environmental_mastery ? pre.dimensionScores.environmental_mastery.average : '-',
      'Purpose in Life': isCompleted && pre?.dimensionScores?.purpose_in_life ? pre.dimensionScores.purpose_in_life.average : '-',
      'Personal Growth': isCompleted && pre?.dimensionScores?.personal_growth ? pre.dimensionScores.personal_growth.average : '-',
    };
  });

  // 4. Sheet: Hasil Post-test (Matched Pair Comparison)
  const postTestRows = participants.map((p) => {
    const pre = evaluations.learnings.find((l) => l.participantId === p.id && l.type === 'pre_test');
    const post = evaluations.learnings.find((l) => l.participantId === p.id && l.type === 'post_test');
    const isPostCompleted = post && (post.status === 'Selesai' || (post.averageScore !== undefined && post.averageScore > 0));
    const isPreCompleted = pre && (pre.status === 'Selesai' || (pre.averageScore !== undefined && pre.averageScore > 0));

    let delta: string | number = '-';
    let matchedStatus = 'Hanya Post-test';
    if (isPostCompleted && isPreCompleted && post.averageScore !== undefined && pre.averageScore !== undefined) {
      const diff = Number((post.averageScore - pre.averageScore).toFixed(2));
      delta = diff >= 0 ? `+${diff}` : `${diff}`;
      matchedStatus = 'Valid (Matched Pair)';
    } else if (!isPostCompleted) {
      matchedStatus = 'Belum Mengisi Post-test';
    }

    return {
      'ID Peserta': p.id,
      'Username': p.username,
      'Nama Lengkap': p.name,
      'Status Post-test': isPostCompleted ? 'Selesai' : (post ? 'Belum Lengkap' : 'Belum Diisi'),
      'Tanggal Pengisian': post?.submittedAt ? new Date(post.submittedAt).toLocaleDateString('id-ID') : '-',
      'Rata-rata Post-test (1-4)': isPostCompleted ? post?.averageScore : '-',
      'Total Skor Post-test (12-48)': isPostCompleted ? post?.totalScore : '-',
      'Self-Acceptance': isPostCompleted && post?.dimensionScores?.self_acceptance ? post.dimensionScores.self_acceptance.average : '-',
      'Positive Relations': isPostCompleted && post?.dimensionScores?.positive_relations ? post.dimensionScores.positive_relations.average : '-',
      'Autonomy': isPostCompleted && post?.dimensionScores?.autonomy ? post.dimensionScores.autonomy.average : '-',
      'Environmental Mastery': isPostCompleted && post?.dimensionScores?.environmental_mastery ? post.dimensionScores.environmental_mastery.average : '-',
      'Purpose in Life': isPostCompleted && post?.dimensionScores?.purpose_in_life ? post.dimensionScores.purpose_in_life.average : '-',
      'Personal Growth': isPostCompleted && post?.dimensionScores?.personal_growth ? post.dimensionScores.personal_growth.average : '-',
      'Rata-rata Pre-test': isPreCompleted ? pre?.averageScore : '-',
      'Delta Peningkatan': delta,
      'Keterangan Pasangan Data': matchedStatus,
    };
  });

  // 5. Sheet: Evaluasi Kirkpatrick
  const kirkpatrickRows = participants.map((p) => {
    const rx = evaluations.reactions.find((e) => e.participantId === p.id);
    const bhv = evaluations.behaviors.find((e) => e.participantId === p.id);
    const res = evaluations.results.find((e) => e.participantId === p.id);

    return {
      'ID Peserta': p.id,
      'Username': p.username,
      'Nama Lengkap': p.name,
      'Status L1 (Reaksi)': rx ? 'Selesai' : 'Belum Diisi',
      'Tanggal L1': rx?.submittedAt ? new Date(rx.submittedAt).toLocaleDateString('id-ID') : '-',
      'Relevansi Materi (1-4)': rx?.ratings.relevance ?? '-',
      'Kejelasan Panduan (1-4)': rx?.ratings.clarity ?? '-',
      'Kualitas Aktivitas (1-4)': rx?.ratings.activityQuality ?? '-',
      'Kemanfaatan Refleksi AI (1-4)': rx?.ratings.aiReflectionUsefulness ?? '-',
      'Kemudahan Platform (1-4)': rx?.ratings.platformUsability ?? '-',
      'Kepuasan Keseluruhan (1-4)': rx?.ratings.overallSatisfaction ?? '-',
      'Status L3 (Perilaku)': bhv ? 'Selesai' : 'Belum Diisi',
      'Asertivitas Kerja': bhv?.frequencies.constructiveAssertiveCommunication ?? '-',
      'Prioritas Tugas': bhv?.frequencies.prioritizeWorkTasksStructured ?? '-',
      'Status L4 (Hasil)': res ? 'Selesai' : 'Belum Diisi',
      'Pengelolaan Tuntutan (1-4)': res?.perceivedDemandsManagement ?? '-',
      'Harmoni Relasi (1-4)': res?.perceivedWorkRelationships ?? '-',
      'Kejelasan Tujuan Kerja (1-4)': res?.perceivedPurposeClarity ?? '-',
    };
  });

  // 6. Sheet: Ringkasan Program
  const summaryRows = [
    { 'Indikator': 'Nama Program', 'Nilai': 'SmartWorkCare: Program Intervensi Psychological Well-Being pada Karyawan Berbasis AI Feedback' },
    { 'Indikator': 'Institusi Pengembang', 'Nilai': 'Universitas Muhammadiyah Sidoarjo (UMSIDA) - Fakultas Psikologi dan Ilmu Pendidikan' },
    { 'Indikator': 'Landasan Teoretis', 'Nilai': 'Enam Dimensi Carol D. Ryff (1989) & Model Evaluasi Pelatihan 4 Level Kirkpatrick' },
    { 'Indikator': 'Tanggal Ekspor Laporan', 'Nilai': new Date().toLocaleString('id-ID') },
    { 'Indikator': 'Total Peserta Terdaftar', 'Nilai': cohortStats.totalParticipants },
    { 'Indikator': 'Peserta Berstatus Aktif', 'Nilai': cohortStats.activeParticipants },
    { 'Indikator': 'Peserta Menyelesaikan Program Penuh (4 Minggu)', 'Nilai': cohortStats.completedCount },
    { 'Indikator': 'Tingkat Penyelesaian Program Kohor (%)', 'Nilai': `${cohortStats.programCompletionRate}%` },
    { 'Indikator': 'Responden Selesai Pre-test', 'Nilai': cohortStats.evaluations.preTestResponsesCount },
    { 'Indikator': 'Responden Selesai Post-test', 'Nilai': cohortStats.evaluations.postTestResponsesCount },
    { 'Indikator': 'Jumlah Pasangan Berpasangan Valid (Matched Pairs)', 'Nilai': cohortStats.evaluations.matchedPairsCount },
    { 'Indikator': 'Rata-rata Skor Pre-test Kohor (Skala 1.00 - 4.00)', 'Nilai': cohortStats.evaluations.avgPreTestScore ?? '-' },
    { 'Indikator': 'Rata-rata Skor Post-test Kohor (Skala 1.00 - 4.00)', 'Nilai': cohortStats.evaluations.avgPostTestScore ?? '-' },
    { 'Indikator': 'Delta Peningkatan Pembelajaran (Post - Pre)', 'Nilai': cohortStats.evaluations.deltaLearningScore !== null ? (cohortStats.evaluations.deltaLearningScore >= 0 ? `+${cohortStats.evaluations.deltaLearningScore}` : `${cohortStats.evaluations.deltaLearningScore}`) : '-' },
    { 'Indikator': 'Rata-rata Skor Kepuasan Peserta Level 1 (Skala 1.00 - 4.00)', 'Nilai': cohortStats.evaluations.averageReactionScore || '-' },
    { 'Indikator': 'Total Responden Level 3 (Behavior)', 'Nilai': cohortStats.evaluations.behaviorResponsesCount },
    { 'Indikator': 'Total Responden Level 4 (Results)', 'Nilai': cohortStats.evaluations.resultsResponsesCount },
    { 'Indikator': 'Keterangan Etika Psikologis', 'Nilai': 'SmartWorkCare adalah program psikoedukasi dan intervensi kesejahteraan kerja, bukan alat diagnosis klinis medis.' },
  ];

  // Create workbook
  const workbook = XLSX.utils.book_new();

  const wsDataPeserta = XLSX.utils.json_to_sheet(dataPesertaRows);
  const wsProgres = XLSX.utils.json_to_sheet(progresMingguanRows);
  const wsPreTest = XLSX.utils.json_to_sheet(preTestRows);
  const wsPostTest = XLSX.utils.json_to_sheet(postTestRows);
  const wsKirkpatrick = XLSX.utils.json_to_sheet(kirkpatrickRows);
  const wsRingkasan = XLSX.utils.json_to_sheet(summaryRows);

  // Set column widths for readability
  const autoColWidth = (rows: any[]) => {
    if (!rows.length) return [];
    const keys = Object.keys(rows[0]);
    return keys.map((key) => {
      let maxLen = key.length;
      rows.forEach((r) => {
        const val = r[key] ? String(r[key]) : '';
        if (val.length > maxLen) maxLen = Math.min(val.length, 40);
      });
      return { wch: Math.max(maxLen + 3, 12) };
    });
  };

  wsDataPeserta['!cols'] = autoColWidth(dataPesertaRows);
  wsProgres['!cols'] = autoColWidth(progresMingguanRows);
  wsPreTest['!cols'] = autoColWidth(preTestRows);
  wsPostTest['!cols'] = autoColWidth(postTestRows);
  wsKirkpatrick['!cols'] = autoColWidth(kirkpatrickRows);
  wsRingkasan['!cols'] = [{ wch: 45 }, { wch: 65 }];

  XLSX.utils.book_append_sheet(workbook, wsDataPeserta, 'Data Peserta');
  XLSX.utils.book_append_sheet(workbook, wsProgres, 'Progres Mingguan');
  XLSX.utils.book_append_sheet(workbook, wsPreTest, 'Hasil Pre-test');
  XLSX.utils.book_append_sheet(workbook, wsPostTest, 'Hasil Post-test');
  XLSX.utils.book_append_sheet(workbook, wsKirkpatrick, 'Evaluasi Kirkpatrick');
  XLSX.utils.book_append_sheet(workbook, wsRingkasan, 'Ringkasan Program');

  const excelBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
  return excelBuffer;
}
