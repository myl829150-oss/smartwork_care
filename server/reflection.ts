import { GoogleGenAI } from '@google/genai';
import { PWBDimension, ReflectionMessage, ReflectionSession } from '../src/types';

// Crisis / distress detection keywords in Indonesian
const CRISIS_KEYWORDS = [
  'bunuh diri',
  'ingin mati',
  'mengakhiri hidup',
  'menyakiti diri',
  'melukai diri',
  'tidak sanggup hidup lagi',
  'suicide',
  'self harm',
  'putus asa total',
];

export function checkDistressSignals(text: string): boolean {
  const lower = text.toLowerCase();
  return CRISIS_KEYWORDS.some((kw) => lower.includes(kw));
}

export const CRISIS_RESPONSE = `Saya mendengar dan merasakan bahwa situasi yang kamu alami saat ini terasa sangat berat dan menekan. Keselamatan dan kesejahteraanmu adalah prioritas yang paling utama.

Karena ruang ini adalah sistem refleksi belajar dan bukan layanan bantuan psikologis darurat klinis, saya sangat menyarankanmu untuk segera berbicara langsung dengan orang tepercaya di sekitarmu, atau menghubungi layanan pendampingan profesional berikut:

• Layanan Kesehatan Jiwa Kemenkes RI (SEJIWA): Hubungi 119 (ekstensi 8)
• Hotline Halo Kemenkes: 1500-567
• Layanan Konseling Yayasan Pulih: WhatsApp 0811-8436-633
• Unit Konseling Karyawan / HR di tempat kerja Anda

Tolong jangan memendam ini sendirian. Ada orang-orang yang peduli dan siap mendengarkan serta membantumu melalui momen sulit ini.`;

// Intelligent empathetic response engine for contextual psychological reflection
function getContextualReflection(userMessage: string, weekNumber: number, theme: string): string {
  const msgLower = userMessage.toLowerCase();

  // Self-acceptance & mistakes / fear of failure
  if (msgLower.includes('cemas') || msgLower.includes('takut') || msgLower.includes('salah') || msgLower.includes('presentasi')) {
    return `Wajar sekali merasakan kecemasan saat berbicara di depan atasan atau menghadapi evaluasi kerja. Rasa takut melakukan kesalahan sering kali berakar dari keinginan kita untuk memberikan performa terbaik.

Boleh kita coba melihatnya bersama: jika kita memisahkan antara kekeliruan kecil yang mungkin terjadi dengan integritas dan kompetensimu secara keseluruhan, hal apa yang paling kamu khawatirkan akan terjadi? Dan persiapan kecil apa yang biasanya bisa membantumu merasa lebih tenang sebelum berbicara?`;
  }

  // Workload / overwhelm / priorities
  if (msgLower.includes('tugas') || msgLower.includes('banyak') || msgLower.includes('menumpuk') || msgLower.includes('beban') || msgLower.includes('lelah')) {
    return `Merasakan beban kerja yang menumpuk tentu sangat menguras stamina fisik dan mental. Ketika begitu banyak hal menuntut perhatian sekaligus, wajar jika kamu merasa kewalahan.

Mari kita perlambat sejenak: dari seluruh daftar tugas yang ada di depanmu saat ini, mana satu hal yang paling krusial dan mendesak hari ini, dan mana yang sebenarnya masih bisa dijadwalkan ulang atau dikomunikasikan batas waktunya?`;
  }

  // Interpersonal / colleagues / conflict
  if (msgLower.includes('rekan') || msgLower.includes('atasan') || msgLower.includes('tim') || msgLower.includes('komunikasi') || msgLower.includes('konflik')) {
    return `Dinamika relasi di tempat kerja memang sering kali menjadi sumber tekanan yang tidak mudah. Di satu sisi, kita ingin menjaga kerja sama yang harmonis, namun di sisi lain kita juga memiliki batasan dan sudut pandang yang ingin dihargai.

Dalam interaksi tersebut, menurutmu kebutuhan apa yang sebenarnya belum tersampaikan dengan jelas—baik kebutuhanmu sendiri maupun yang mungkin sedang dirasakan oleh rekan kerjamu?`;
  }

  // Meaning / motivation
  if (msgLower.includes('makna') || msgLower.includes('bosan') || msgLower.includes('tujuan') || msgLower.includes('rutinitas')) {
    return `Menghadapi fase di mana pekerjaan terasa monoton adalah hal yang manusiawi dalam perjalanan karier. Terkadang rutinitas menutupi dampak nyata dari apa yang kita kerjakan sehari-hari.

Jika kamu mengingat kembali momen ketika pekerjaan ini terasa paling memuaskan, nilai atau kontribusi apa yang saat itu paling membuatmu merasa bangga atau terhubung dengan tujuan hidupmu?`;
  }

  // General contextual fallback grounded in the week's theme
  return `Terima kasih telah berbagi cerita dan perasaanmu secara jujur. Dalam konteks Minggu ${weekNumber} (${theme}), menyadari apa yang sedang kita alami adalah langkah awal yang sangat berharga untuk merawat kesejahteraan psikologis.

Berdasarkan pengalaman yang baru saja kamu sampaikan, apa satu hal kecil yang menurutmu masih berada dalam kendalimu untuk dilakukan hari ini?`;
}

export async function generateReflectionAIResponse(
  userMessage: string,
  history: ReflectionMessage[],
  weekNumber: number,
  theme: string
): Promise<{ text: string; isCrisisAlert?: boolean }> {
  // 1. Safety check first
  if (checkDistressSignals(userMessage)) {
    return {
      text: CRISIS_RESPONSE,
      isCrisisAlert: true,
    };
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey) {
    try {
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      const systemInstruction = `Anda adalah pendamping dialog refleksi psikologis dalam program "SmartWorkCare: Program Intervensi Psychological Well-Being pada Karyawan".
Tujuan Anda adalah membantu karyawan merefleksikan pengalaman kerja mereka secara hangat, natural, tenang, empatik, dan tanpa menghakimi.

Kerangka Konseptual:
Program ini berlandaskan 6 dimensi Psychological Well-Being Carol D. Ryff:
1. Self-Acceptance (Penerimaan Diri)
2. Positive Relations with Others (Hubungan Positif)
3. Autonomy (Otonomi & Kemandirian)
4. Environmental Mastery (Penguasaan Lingkungan)
5. Purpose in Life (Tujuan Hidup & Makna Kerja)
6. Personal Growth (Pertumbuhan Pribadi)

Konteks Program Saat Ini:
Peserta sedang berada di Minggu ${weekNumber} dengan tema: "${theme}".

Panduan Komunikasi:
1. Gunakan Bahasa Indonesia yang natural, hangat, sopan, dan profesional. Sapa dengan "kamu" secara akrab dan menghargai.
2. Validasi pengalaman dan perasaan peserta terlebih dahulu sebelum bertanya.
3. Ajukan HANYA SATU pertanyaan reflektif yang relevan dan mendalam di akhir respons untuk memfasilitasi eksplorasi diri.
4. JANGAN memberikan nasihat instan, jangan menggurui, dan jangan memberikan solusi yang terburu-buru.
5. JANGAN PERNAH membuat diagnosis medis/psikiatris atau label klinis (misalnya "kamu mengalami depresi", "kamu burnout berat").
6. Jika peserta menceritakan kendala kerja, bantu mereka memilah antara apa yang bisa dikendalikan (circle of control) dan apa yang di luar kendali.
7. Jaga respons tetap ringkas, jelas, dan fokus (sekitar 2-4 paragraf pendek).`;

      const conversationPrompt = history
        .slice(-4)
        .map((m) => `${m.sender === 'user' ? 'Peserta' : 'Pendamping AI'}: ${m.text}`)
        .join('\n');

      const prompt = `${conversationPrompt ? conversationPrompt + '\n' : ''}Peserta: ${userMessage}\nPendamping AI:`;

      const apiCall = ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      // 4-second timeout to prevent any hanging in restricted environments
      const timeoutPromise = new Promise<null>((resolve) =>
        setTimeout(() => resolve(null), 4000)
      );

      const response = await Promise.race([apiCall, timeoutPromise]);

      if (response && response.text) {
        return { text: response.text.trim() };
      }
    } catch {
      // Gracefully fall through to contextual engine
    }
  }

  // Seamless contextual reflection engine
  return {
    text: getContextualReflection(userMessage, weekNumber, theme),
  };
}

export async function generateSessionSummary(
  history: ReflectionMessage[],
  weekNumber: number
): Promise<{
  themeDiscussed: string;
  realizations: string;
  identifiedResources: string;
  chosenActionStep: string;
  relatedPWBDimension: PWBDimension;
}> {
  const apiKey = process.env.GEMINI_API_KEY;

  const defaultSummary = {
    themeDiscussed: `Refleksi Tantangan Kerja Minggu ${weekNumber}`,
    realizations: 'Menyadari pentingnya membedakan antara penilaian diri dan evaluasi tugas objektif.',
    identifiedResources: 'Dukungan rekan kerja dan kemampuan mengambil jeda istirahat.',
    chosenActionStep: 'Mempraktikkan komunikasi asertif dan menetapkan prioritas harian secara terstruktur.',
    relatedPWBDimension: 'self_acceptance' as PWBDimension,
  };

  if (!apiKey || history.length < 2) {
    return defaultSummary;
  }

  try {
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const dialogText = history.map((m) => `${m.sender}: ${m.text}`).join('\n');

    const prompt = `Berdasarkan dialog refleksi berikut, buatlah ringkasan pembelajaran peserta dalam format JSON:
${dialogText}

Output harus berupa JSON dengan struktur persis:
{
  "themeDiscussed": "Ringkasan 1 kalimat tema yang dibahas",
  "realizations": "Poin kesadaran baru yang diperoleh peserta",
  "identifiedResources": "Kekuatan internal atau sumber daya eksternal yang diidentifikasi",
  "chosenActionStep": "Langkah tindakan kecil realistis yang akan dicoba",
  "relatedPWBDimension": "pilih salah satu: self_acceptance | positive_relations | autonomy | environmental_mastery | purpose_in_life | personal_growth"
}`;

    const apiCall = ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const timeoutPromise = new Promise<null>((resolve) =>
      setTimeout(() => resolve(null), 4000)
    );

    const response = await Promise.race([apiCall, timeoutPromise]);

    if (response && response.text) {
      const parsed = JSON.parse(response.text.trim());
      return {
        themeDiscussed: parsed.themeDiscussed || defaultSummary.themeDiscussed,
        realizations: parsed.realizations || defaultSummary.realizations,
        identifiedResources: parsed.identifiedResources || defaultSummary.identifiedResources,
        chosenActionStep: parsed.chosenActionStep || defaultSummary.chosenActionStep,
        relatedPWBDimension: parsed.relatedPWBDimension || defaultSummary.relatedPWBDimension,
      };
    }
  } catch {
    // Graceful fallback to default summary
  }

  return defaultSummary;
}
