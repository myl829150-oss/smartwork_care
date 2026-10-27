import { ProgramWeek, PWBDimension } from '../types';

export const PWB_DIMENSIONS_INFO: Record<PWBDimension, { label: string; desc: string; color: string }> = {
  self_acceptance: {
    label: 'Self-Acceptance (Penerimaan Diri)',
    desc: 'Mengenali dan menerima diri secara realistis, memahami kelebihan serta batasan tanpa menghakimi diri berlebihan.',
    color: '#6B9B91',
  },
  positive_relations: {
    label: 'Positive Relations with Others (Hubungan Positif)',
    desc: 'Membangun relasi kerja yang saling percaya, empati, komunikasi sehat, dan kemampuan mengelola dinamika interpersonal.',
    color: '#243B53',
  },
  autonomy: {
    label: 'Autonomy (Kemandirian & Otonomi)',
    desc: 'Mampu mengambil keputusan bertanggung jawab berdasarkan nilai pribadi dan menyuarakan pendapat secara asertif.',
    color: '#D97706',
  },
  environmental_mastery: {
    label: 'Environmental Mastery (Penguasaan Lingkungan)',
    desc: 'Mengelola tuntutan kerja, menyusun prioritas, mengatur sumber daya dan menghadapi situasi dinamis.',
    color: '#2563EB',
  },
  purpose_in_life: {
    label: 'Purpose in Life (Tujuan Hidup & Makna Kerja)',
    desc: 'Menghubungkan tugas harian dengan tujuan yang lebih luas serta menemukan makna dalam aktivitas kerja.',
    color: '#7C3AED',
  },
  personal_growth: {
    label: 'Personal Growth (Pertumbuhan Pribadi)',
    desc: 'Keterbukaan untuk belajar dari pengalaman, mengembangkan kompetensi baru, dan melihat tantangan sebagai kesempatan belajar.',
    color: '#059669',
  },
};

export const PROGRAM_WEEKS: ProgramWeek[] = [
  {
    id: 'week_1',
    weekNumber: 1,
    title: 'Minggu 1: Mengenali Diri & Memahami Kesejahteraan Psikologis',
    theme: 'Fondasi Kesadaran Diri, Penerimaan Diri, dan Resiliensi Awal',
    description:
      'Mengenal 6 dimensi Psychological Well-Being Carol D. Ryff, mengevaluasi kesalahan kerja secara objektif tanpa merendahkan diri sendiri, serta memetakan kekuatan pribadi.',
    primaryDimensions: ['self_acceptance', 'personal_growth'],
    sessions: [
      {
        id: 'session_1_1',
        weekId: 'week_1',
        weekNumber: 1,
        order: 1,
        title: 'Sesi 1.1: Membedakan Kesalahan Kerja dan Penilaian Diri',
        description:
          'Latihan mengenali respons kognitif ketika terjadi kekeliruan dalam pekerjaan dan belajar mengarahkan fokus pada penyelesaian masalah.',
        objective:
          'Peserta mampu membedakan evaluasi terhadap suatu insiden kerja objektif dengan label negatif terhadap keseluruhan diri (Self-Acceptance).',
        dimensions: ['self_acceptance'],
        isMandatory: true,
        activities: [
          {
            id: 'act_1_1_1',
            sessionId: 'session_1_1',
            order: 1,
            title: 'Permainan 1: Pilih Respons Terbaik — Menghadapi Kesalahan Laporan',
            type: 'pilih_respons',
            description: 'Simulasi situasi kerja di mana terjadi kesalahan perhitungan data yang dilaporkan ke manajemen.',
            learningGoal: 'Memilih pendekatan problem-focused coping yang realistis tanpa menyalahkan diri secara destruktif.',
            estimatedMinutes: 8,
            isMandatory: true,
            content: {
              introText: 'Bacalah skenario kerja berikut dengan saksama dan pilih opsi respons yang menurut Anda paling konstruktif.',
              scenario:
                'Anda baru saja menyadari bahwa data angka yang Anda kirimkan dalam laporan pagi ini memiliki ketidaksesuaian rumus. Tim manajemen akan mendiskusikan laporan tersebut dua jam lagi.',
              options: [
                {
                  id: 'opt_a',
                  text: 'Menyimpan rasa cemas sendiri, menganggap diri tidak teliti dan tidak kompeten, lalu berharap tidak ada yang menyadari kekeliruan tersebut.',
                  feedback: {
                    whatHappened: 'Anda memendam masalah dan mengubah kesalahan prosedural menjadi penilaian buruk terhadap harga diri.',
                    whyImportant: 'Menyalahkan diri berlebihan justru memicu kecemasan yang melumpuhkan tindakan perbaikan.',
                    alternatives: 'Bedakan antara "tindakan yang keliru" dengan "diri saya yang tidak berharga". Segera komunikasikan fakta yang ada.',
                    reflectionQuestion: 'Apa ketakutan terbesar Anda saat perlu mengakui ada kekeliruan di tempat kerja?'
                  },
                  scoreWeight: 1,
                },
                {
                  id: 'opt_b',
                  text: 'Menyalahkan rekan kerja yang memberikan data mentah dan mengatakan bahwa kesalahan terjadi karena keterlambatan input dari departemen lain.',
                  feedback: {
                    whatHappened: 'Anda mengalihkan tanggung jawab, yang dapat merusak hubungan interpersonal dan menurunkan kepercayaan tim.',
                    whyImportant: 'Hubungan kerja positif dibangun atas transparansi dan akuntabilitas tim yang sehat.',
                    alternatives: 'Fokus pada solusi bersama terlebih dahulu sebelum meninjau proses perbaikan alur kerja.',
                    reflectionQuestion: 'Bagaimana perasaan Anda jika rekan kerja langsung melempar kesalahan kepada Anda?'
                  },
                  scoreWeight: 2,
                },
                {
                  id: 'opt_c',
                  text: 'Mengakui kekeliruan rumus dengan tenang, segera menyiapkan lembar koreksi yang tepat, dan memberitahukan tim manajemen sebelum pertemuan dimulai.',
                  feedback: {
                    whatHappened: 'Pilihan ini mencerminkan penerimaan diri yang realistis dan orientasi proaktif pada solusi.',
                    whyImportant: 'Mengakui kekeliruan secara profesional menunjukkan kedewasaan emosional dan menjaga integritas profesional.',
                    alternatives: 'Setelah pertemuan, Anda dapat meluangkan waktu meninjau kembali checklist pengecekan agar kejadian serupa dapat dicegah.',
                    reflectionQuestion: 'Langkah pencegahan praktis apa yang dapat Anda terapkan pada alur kerja Anda ke depan?'
                  },
                  scoreWeight: 4,
                },
                {
                  id: 'opt_d',
                  text: 'Mengundurkan diri dari proyek karena merasa tidak lagi dipercaya oleh pimpinan.',
                  feedback: {
                    whatHappened: 'Ini merupakan respons eskapisme ekstrem yang menggeneralisasi satu kesalahan kecil menjadi kegagalan karier.',
                    whyImportant: 'Pertumbuhan pribadi (Personal Growth) hanya terjadi saat kita mengizinkan diri belajar dari kekeliruan.',
                    alternatives: 'Ingatkan diri bahwa setiap profesional pernah melakukan kesalahan dan kesempatan belajar selalu terbuka.',
                    reflectionQuestion: 'Apakah Anda pernah melihat seorang rekan bangkit dan berkembang setelah melakukan kesalahan?'
                  },
                  scoreWeight: 1,
                },
              ],
            },
          },
        ],
      },
      {
        id: 'session_1_2',
        weekId: 'week_1',
        weekNumber: 1,
        order: 2,
        title: 'Sesi 1.2: Mengenali Kekuatan dan Area Pertumbuhan Pribadi',
        description:
          'Refleksi terstruktur untuk mengidentifikasi sumber daya pribadi dan area pengembangan yang realistis.',
        objective:
          'Peserta mampu mengenali kekuatan internal yang telah membantu menghadapi tekanan kerja serta menentukan target belajar yang sehat (Personal Growth).',
        dimensions: ['personal_growth', 'self_acceptance'],
        isMandatory: true,
        activities: [
          {
            id: 'act_1_1_2',
            sessionId: 'session_1_2',
            order: 1,
            title: 'Permainan 4: Kartu Refleksi Diri — Pemetaan Sumber Daya Diri',
            type: 'kartu_refleksi',
            description: 'Kartu refleksi interaktif untuk mengeksplorasi pengalaman resiliensi dan cara memulihkan energi kerja.',
            learningGoal: 'Menuliskan refleksi pribadi mengenai kebiasaan kerja dan penguatan diri.',
            estimatedMinutes: 10,
            isMandatory: true,
            content: {
              introText: 'Luangkan waktu sejenak di ruang yang tenang. Refleksi ini bersifat privat untuk proses belajar Anda.',
              reflectionPrompts: [
                {
                  id: 'ref_1',
                  dimension: 'self_acceptance',
                  prompt: 'Ketika menghadapi hari kerja yang terasa melelahkan atau tidak berjalan sesuai rencana, kalimat apa yang biasanya pertama kali muncul di benak Anda tentang diri Anda?',
                  guidingTip: 'Coba amati apakah kalimat tersebut cenderung menghakimi ("Saya memang lambat") atau lebih realistis ("Hari ini cukup menantang, mari istirahat sejenak").'
                },
                {
                  id: 'ref_2',
                  dimension: 'personal_growth',
                  prompt: 'Sebutkan satu kekuatan pribadi (misalnya ketekunan, kemampuan mendengar, atau ketenangan) yang terbukti membantu Anda melalui situasi kerja sulit dalam 3 bulan terakhir.',
                  guidingTip: 'Fokus pada fakta nyata pengalaman Anda, bukan kesempurnaan.'
                },
                {
                  id: 'ref_3',
                  dimension: 'personal_growth',
                  prompt: 'Satu keterampilan atau kebiasaan kecil apa yang ingin Anda kembangkan selama 4 minggu mengikuti program SmartWorkCare ini?',
                  guidingTip: 'Pilihlah kebiasaan yang konkret dan terukur (contoh: jeda bernapas 3 menit sebelum merespons email mendesak).'
                }
              ]
            }
          }
        ],
      },
    ],
  },
  {
    id: 'week_2',
    weekNumber: 2,
    title: 'Minggu 2: Membangun Hubungan Kerja yang Sehat',
    theme: 'Komunikasi Asertif, Empati Interpersonal, dan Menjaga Batasan Diri',
    description:
      'Mengeksplorasi dinamika relasi dengan rekan kerja dan atasan, merespons konflik secara konstruktif, serta menyuarakan batasan secara bertanggung jawab.',
    primaryDimensions: ['positive_relations', 'autonomy'],
    sessions: [
      {
        id: 'session_2_1',
        weekId: 'week_2',
        weekNumber: 2,
        order: 1,
        title: 'Sesi 2.1: Resolusi Perbedaan Pendapat & Komunikasi Asertif',
        description: 'Simulasi kasus dinamika tim saat terjadi ketidaksepakatan alur kerja menjelang tenggat waktu.',
        objective: 'Peserta mampu menerapkan komunikasi asertif yang menghargai sudut pandang orang lain tanpa mengorbankan pertimbangan logis.',
        dimensions: ['positive_relations'],
        isMandatory: true,
        activities: [
          {
            id: 'act_2_1_1',
            sessionId: 'session_2_1',
            order: 1,
            title: 'Permainan 2: Studi Kasus Interaktif — Perbedaan Pendapat Desain Kerja',
            type: 'studi_kasus',
            description: 'Menganalisis akar masalah komunikasi dan menentukan langkah mediasi yang saling menguntungkan.',
            learningGoal: 'Mengidentifikasi kebutuhan komunikasi di balik perbedaan pendapat rekan kerja.',
            estimatedMinutes: 12,
            isMandatory: true,
            content: {
              introText: 'Pelajari kasus berikut dan pilih langkah penanganan yang paling bijaksana.',
              scenario:
                'Anda dan rekan satu tim (Rian) memiliki pandangan berbeda mengenai cara menyusun format presentasi klien. Rian bersikeras menggunakan format lama yang ia rasa aman, sementara Anda mengusulkan format baru yang lebih ringkas. Rian mulai terlihat defensif dan berkata: "Kamu selalu merasa idemu paling benar."',
              options: [
                {
                  id: 'opt_sc_1',
                  text: 'Menyerah sepenuhnya pada format Rian agar tidak terjadi pertengkaran, meskipun Anda tahu format lama berpotensi membuat klien bosan.',
                  feedback: {
                    whatHappened: 'Anda memilih pasif dan menghindari konflik sesaat, namun mengorbankan kualitas hasil kerja dan memendam rasa frustrasi.',
                    whyImportant: 'Hubungan kerja positif bukan berarti ketiadaan perbedaan pendapat, melainkan kemampuan mendiskusikannya dengan aman.',
                    alternatives: 'Ajak Rian melihat tujuan bersama: kepuasan klien, bukan kemenangan ide individu.',
                    reflectionQuestion: 'Seberapa sering Anda memilih diam demi menghindari ketegangan semu?'
                  },
                  scoreWeight: 2,
                },
                {
                  id: 'opt_sc_2',
                  text: 'Membalas dengan nada meninggi: "Kalau format lamamu bagus, kenapa klien kemarin mengeluh? Jangan emosional!"',
                  feedback: {
                    whatHappened: 'Respons agresif ini memicu perdebatan personal (ad hominem) dan merusak rasa aman psikologis dalam tim.',
                    whyImportant: 'Menyerang kepribadian rekan kerja membuat kedua pihak menutup diri dari kolaborasi sehat.',
                    alternatives: 'Tarik napas dan validasi kekhawatiran Rian terlebih dahulu sebelum membahas data.',
                    reflectionQuestion: 'Apa yang memicu dorongan untuk membela diri saat merasa disudutkan?'
                  },
                  scoreWeight: 1,
                },
                {
                  id: 'opt_sc_3',
                  text: 'Mengambil jeda sejenak, lalu berkata dengan tenang: "Rian, aku mengerti kamu ingin memastikan presentasi ini berjalan aman tanpa risiko. Boleh kita lihat bersama bagian mana dari format lama yang ingin dipertahankan, dan di mana kita bisa uji coba ringkasan baru?"',
                  feedback: {
                    whatHappened: 'Respons ini memvalidasi niat baik Rian (keamanan hasil), menurunkan tensi defensif, dan mengajak fokus pada titik temu objektif.',
                    whyImportant: 'Pendekatan win-win memperkuat ikatan kolegial sekaligus menjaga standar profesionalitas kerja.',
                    alternatives: 'Anda juga bisa menyepakati untuk meminta pendapat singkat dari satu orang rekan ketiga yang netral jika masih belum sepakat.',
                    reflectionQuestion: 'Bagaimana respons ini bisa diterapkan pada dinamika komunikasi harian Anda?'
                  },
                  scoreWeight: 4,
                },
              ],
            },
          },
        ],
      },
      {
        id: 'session_2_2',
        weekId: 'week_2',
        weekNumber: 2,
        order: 2,
        title: 'Sesi 2.2: Menjaga Batasan Sehat dan Otonomi Pengambilan Keputusan',
        description: 'Latihan mengambil keputusan berprinsip saat dihadapkan pada tekanan rekan sejawat (peer pressure).',
        objective: 'Peserta mampu menjaga otonomi diri dan menyampaikan batasan kapasitas secara profesional.',
        dimensions: ['autonomy', 'positive_relations'],
        isMandatory: true,
        activities: [
          {
            id: 'act_2_2_1',
            sessionId: 'session_2_2',
            order: 1,
            title: 'Permainan 5: Tentukan Langkah Selanjutnya — Menghadapi Permintaan Lembur Mendadak',
            type: 'tentukan_langkah',
            description: 'Simulasi alur keputusan bertingkat ketika rekan kerja meminta bantuan di luar jam kerja dengan tenggat waktu padat.',
            learningGoal: 'Menyeimbangkan komitmen tim dengan pemeliharaan energi dan batasan pribadi.',
            estimatedMinutes: 10,
            isMandatory: true,
            content: {
              decisionSteps: [
                {
                  stepId: 'step_1',
                  situation: 'Pukul 17.30 menjelang jam pulang kantor. Rekan kerja mendekati meja Anda meminta Anda mengambil alih sebagian tugasnya malam ini karena ia ingin menghadiri acara pribadi. Anda sendiri sudah memiliki jadwal keluarga penting yang sudah direncanakan 2 minggu lalu.',
                  question: 'Tindakan awal apa yang Anda ambil?',
                  choices: [
                    {
                      id: 'c1',
                      text: 'Langsung mengiyakan karena tidak enak hati dan membatalkan janji keluarga.',
                      consequence: 'Keluarga Anda kecewa, Anda merasa kesal dan lelah secara emosional sepanjang malam saat mengerjakannya.',
                      nextStepId: 'step_consequence_burnout',
                      lessonSummary: 'Mengorbankan batasan esensial berulang kali demi menyenangkan orang lain (people-pleasing) merusak otonomi dan kesejahteraan mental.'
                    },
                    {
                      id: 'c2',
                      text: 'Menolak dengan ketus dan menyindir bahwa ia tidak profesional mengatur waktu.',
                      consequence: 'Hubungan dengan rekan kerja menjadi dingin dan canggung di pertemuan tim berikutnya.',
                      nextStepId: 'step_consequence_conflict',
                      lessonSummary: 'Batasan perlu ditegakkan dengan tegas namun tetap santun tanpa mempermalukan orang lain.'
                    },
                    {
                      id: 'c3',
                      text: 'Mendengarkan dengan tenang, menyampaikan simpati, lalu menjelaskan batasan dengan asertif: "Saya paham situasi Anda, namun malam ini saya sudah ada komitmen penting. Mari kita cek apakah ada bagian kecil 15 menit yang bisa saya bantu sebelum pukul 18.00."',
                      consequence: 'Rekan kerja memahami batasan Anda, Anda tetap menjaga janji keluarga, dan kolaborasi profesional tetap terjaga.',
                      nextStepId: undefined, // Final successful resolution
                      lessonSummary: 'Otonomi sejati tercermin ketika kita mampu berkata tidak pada permintaan yang melanggar batasan, sambil tetap menawarkan alternatif yang realistis.'
                    }
                  ]
                },
                {
                  stepId: 'step_consequence_burnout',
                  situation: 'Keesokan paginya Anda datang ke kantor dengan rasa lelah luar biasa dan rekan Anda bahkan lupa mengucapkan terima kasih.',
                  question: 'Apa pembelajaran utama yang Anda petik dari pengalaman ini?',
                  choices: [
                    {
                      id: 'b1',
                      text: 'Menyadari bahwa menyepakati batasan di awal jauh lebih menyehatkan daripada memendam kejengkelan di akhir.',
                      consequence: 'Anda berkomitmen untuk lebih jujur mengenai kapasitas diri di masa mendatang.',
                      nextStepId: undefined,
                      lessonSummary: 'Batasan diri bukanlah keegoisan, melainkan fondasi agar kita dapat berkontribusi secara berkelanjutan.'
                    }
                  ]
                },
                {
                  stepId: 'step_consequence_conflict',
                  situation: 'Suasana kerja menjadi tegang dan koordinasi tugas tim terhambat selama dua hari.',
                  question: 'Bagaimana langkah pemulihan relasi yang dapat diambil?',
                  choices: [
                    {
                      id: 'k1',
                      text: 'Mengajak rekan berbicara berdua singkat untuk meluruskan intensi dan menyepakati cara komunikasi yang lebih baik.',
                      consequence: 'Ketegangan mereda dan tim kembali bekerja secara harmonis.',
                      nextStepId: undefined,
                      lessonSummary: 'Memperbaiki komunikasi yang sempat tergores membutuhkan inisiatif kedewasaan emosional.'
                    }
                  ]
                }
              ]
            }
          }
        ],
      },
    ],
  },
  {
    id: 'week_3',
    weekNumber: 3,
    title: 'Minggu 3: Mengelola Tantangan & Tuntutan Pekerjaan',
    theme: 'Penguasaan Lingkungan (Environmental Mastery), Penentuan Prioritas, & Manajemen Stres Kerja',
    description:
      'Mengembangkan kecakapan memilah tugas penting vs mendesak, mengelola sumber daya waktu, dan membedakan antara hal yang dapat dikontrol dan di luar kendali.',
    primaryDimensions: ['environmental_mastery', 'autonomy'],
    sessions: [
      {
        id: 'session_3_1',
        weekId: 'week_3',
        weekNumber: 3,
        order: 1,
        title: 'Sesi 3.1: Manajemen Prioritas & Beban Kerja (Eisenhower Matrix)',
        description: 'Simulasi interaktif mengatur 4 tugas kerja yang datang serentak berdasarkan urgensi dan dampaknya.',
        objective: 'Peserta mampu mengkategorikan tugas kerja dan menentukan urutan eksekusi yang paling efektif.',
        dimensions: ['environmental_mastery'],
        isMandatory: true,
        activities: [
          {
            id: 'act_3_1_1',
            sessionId: 'session_3_1',
            order: 1,
            title: 'Permainan 3: Susun Prioritas — Tantangan Hari Senin Pagi',
            type: 'susun_prioritas',
            description: 'Urutkan 4 tugas berikut dari yang harus dieksekusi terlebih dahulu sampai yang dapat didelegasikan atau dijadwalkan ulang.',
            learningGoal: 'Melatih kemampuan pertimbangan Environmental Mastery dalam situasi banyak distraksi.',
            estimatedMinutes: 10,
            isMandatory: true,
            content: {
              introText: 'Anda memulai hari Senin dengan 4 agenda tugas berikut. Tentukan urutan eksekusi terbaik (1 = paling awal, 4 = terakhir) berdasarkan urgensi dan dampak organisasional.',
              priorityTasks: [
                {
                  id: 'task_1',
                  title: 'Memperbaiki tiket insiden server sistem internal yang menghambat transaksi operasional tim cabang',
                  urgency: 'Tinggi',
                  importance: 'Kritis',
                  estimatedDuration: '45 menit',
                  recommendedOrder: 1,
                  rationalExplanation: 'Mendesak & Penting (Quadrant 1): Menghentikan dampak operasional yang meluas ke banyak pihak.'
                },
                {
                  id: 'task_2',
                  title: 'Menyusun draf rencana perbaikan alur onboarding karyawan baru untuk kuartal depan',
                  urgency: 'Rendah',
                  importance: 'Penting',
                  estimatedDuration: '60 menit',
                  recommendedOrder: 3,
                  rationalExplanation: 'Penting tapi Tidak Mendesak (Quadrant 2): Memerlukan fokus tinggi dan sebaiknya dijadwalkan di blok waktu khusus.'
                },
                {
                  id: 'task_3',
                  title: 'Menjawab email konfirmasi kehadiran rapat koordinasi mingguan yang dimulai pukul 14.00 nanti',
                  urgency: 'Sedang',
                  importance: 'Rutin',
                  estimatedDuration: '5 menit',
                  recommendedOrder: 2,
                  rationalExplanation: 'Tugas cepat dan berdampak pada koordinasi hari ini, efisien diselesaikan segera setelah insiden kritis teratasi.'
                },
                {
                  id: 'task_4',
                  title: 'Merapikan folder dokumen arsip tahun lalu di komputer pribadi',
                  urgency: 'Rendah',
                  importance: 'Rutin',
                  estimatedDuration: '30 menit',
                  recommendedOrder: 4,
                  rationalExplanation: 'Tidak mendesak dan tidak berdampak langsung (Quadrant 4): Dapat dikerjakan saat beban kerja utama selesai atau di akhir pekan.'
                }
              ]
            }
          }
        ],
      },
      {
        id: 'session_3_2',
        weekId: 'week_3',
        weekNumber: 3,
        order: 2,
        title: 'Sesi 3.2: Circle of Control — Menghadapi Perubahan Mendadak',
        description: 'Latihan kognitif memisahkan antara hal yang dapat dikendalikan langsung dengan hal di luar kendali.',
        objective: 'Peserta mampu memusatkan energi mental pada tindakan konkret yang dapat dikendalikan saat menghadapi restrukturisasi atau perubahan kebijakan.',
        dimensions: ['environmental_mastery', 'autonomy'],
        isMandatory: true,
        activities: [
          {
            id: 'act_3_2_1',
            sessionId: 'session_3_2',
            order: 1,
            title: 'Permainan 1: Pilih Respons Terbaik — Perubahan Kebijakan Sistem Kerja',
            type: 'pilih_respons',
            description: 'Manajemen mengumumkan pergantian sistem software utama dalam waktu 2 minggu.',
            learningGoal: 'Mengenali respon adaptif terhadap perubahan lingkungan kerja.',
            estimatedMinutes: 8,
            isMandatory: true,
            content: {
              introText: 'Bacalah skenario perubahan berikut dan tentukan sikap paling adaptif.',
              scenario:
                'Manajemen mengumumkan sistem software operasional yang biasa Anda gunakan akan diganti total mulai 2 minggu lagi. Sebagian rekan mulai mengeluh di grup chat dan merasa perusahaan tidak memikirkan beban karyawan.',
              options: [
                {
                  id: 'opt_env_1',
                  text: 'Ikut aktif mengeluh sepanjang hari di ruang istirahat dan menolak menghadiri sesi pelatihan software baru sebagai bentuk protes.',
                  feedback: {
                    whatHappened: 'Menghabiskan energi emosional pada hal yang sudah diputuskan perusahaan dan mengabaikan persiapan diri.',
                    whyImportant: 'Perlawanan pasif justru meningkatkan kecemasan dan membuat Anda tertinggal saat sistem baru diluncurkan.',
                    alternatives: 'Salurkan masukan sistem melalui saluran resmi atau perwakilan tim yang konstruktif.',
                    reflectionQuestion: 'Apa dampak mengeluh terus-menerus terhadap tingkat stamina kerja Anda?'
                  },
                  scoreWeight: 1
                },
                {
                  id: 'opt_env_2',
                  text: 'Memisahkan apa yang tidak bisa dikontrol (keputusan pergantian sistem) dan apa yang bisa dikontrol (kesiapan belajar diri): mendaftar pelatihan awal, mencatat panduan manual, dan mengajak tim saling membantu.',
                  feedback: {
                    whatHappened: 'Ini adalah wujud Environmental Mastery yang tinggi: proaktif beradaptasi dengan lingkungan baru dan menciptakan rasa berdaya.',
                    whyImportant: 'Karyawan yang adaptif melihat masa transisi sebagai kesempatan meningkatkan keterampilan teknis baru.',
                    alternatives: 'Buat catatan ringkas fitur-fitur yang paling sering Anda gunakan agar masa adaptasi lebih cepat.',
                    reflectionQuestion: 'Langkah persiapan apa yang paling mudah Anda lakukan hari ini?'
                  },
                  scoreWeight: 4
                },
                {
                  id: 'opt_env_3',
                  text: 'Mengabaikan pengumuman tersebut dan berharap sistem lama tetap bisa digunakan secara diam-diam.',
                  feedback: {
                    whatHappened: 'Penolakan terhadap kenyataan (denial) yang akan memicu krisis saat sistem lama dinonaktifkan.',
                    whyImportant: 'Kenyataan lingkungan kerja membutuhkan penerimaan realistis dan respon tepat waktu.',
                    alternatives: 'Hadapi perubahan langkah demi langkah daripada menghindarinya.',
                    reflectionQuestion: 'Apa yang membuat kita sering kali enggan keluar dari zona nyaman?'
                  },
                  scoreWeight: 2
                }
              ]
            }
          }
        ],
      },
    ],
  },
  {
    id: 'week_4',
    weekNumber: 4,
    title: 'Minggu 4: Menemukan Makna & Menyusun Rencana Pengembangan Diri',
    theme: 'Purpose in Life, Pembelajaran Berkelanjutan, dan Action Plan Kesejahteraan',
    description:
      'Menghubungkan rutinitas kerja dengan nilai personal yang mendalam, mengevaluasi seluruh proses intervensi 4 minggu, dan menyusun komitmen kebiasaan PWB jangka panjang.',
    primaryDimensions: ['purpose_in_life', 'personal_growth'],
    sessions: [
      {
        id: 'session_4_1',
        weekId: 'week_4',
        weekNumber: 4,
        order: 1,
        title: 'Sesi 4.1: Menemukan Makna dan Nilai dalam Pekerjaan',
        description: 'Eksplorasi nilai personal (Job Crafting) agar aktivitas kerja terasa bermakna bagi diri dan masyarakat.',
        objective: 'Peserta mampu mengidentifikasi kontribusi nyata dari peran kerjanya dan menghubungkannya dengan nilai hidup pribadi (Purpose in Life).',
        dimensions: ['purpose_in_life'],
        isMandatory: true,
        activities: [
          {
            id: 'act_4_1_1',
            sessionId: 'session_4_1',
            order: 1,
            title: 'Permainan 4: Kartu Refleksi Diri — Menemukan Makna di Balik Rutinitas',
            type: 'kartu_refleksi',
            description: 'Refleksi mendalam mengenai nilai-nilai kerja yang memberi kepuasan batin.',
            learningGoal: 'Merumuskan statement makna kerja personal.',
            estimatedMinutes: 10,
            isMandatory: true,
            content: {
              introText: 'Ketika pekerjaan terasa monoton, mengenali kembali tujuan mulia di baliknya dapat membangkitkan kembali motivasi intrinsik.',
              reflectionPrompts: [
                {
                  id: 'purp_1',
                  dimension: 'purpose_in_life',
                  prompt: 'Siapa pihak (klien, rekan kerja, keluarga, atau masyarakat) yang merasakan manfaat nyata ketika Anda menyelesaikan pekerjaan Anda dengan baik?',
                  guidingTip: 'Coba bayangkan dampak positif kecil yang tercipta dari peran Anda sehari-hari.'
                },
                {
                  id: 'purp_2',
                  dimension: 'purpose_in_life',
                  prompt: 'Nilai hidup apa yang paling Anda junjung tinggi dalam berkarier (contoh: kejujuran, pertumbuhan, kepedulian, kreativitas, atau tanggung jawab)?',
                  guidingTip: 'Pilihlah 1-2 nilai utama yang paling mencerminkan prinsip Anda.'
                },
                {
                  id: 'purp_3',
                  dimension: 'personal_growth',
                  prompt: 'Melihat perjalanan karier Anda sejauh ini, pengalaman apa yang paling mendewasakan cara pandang Anda terhadap kehidupan kerja?',
                  guidingTip: 'Refleksikan bagaimana tantangan di masa lalu telah membentuk kapasitas diri Anda saat ini.'
                }
              ]
            }
          }
        ],
      },
      {
        id: 'session_4_2',
        weekId: 'week_4',
        weekNumber: 4,
        order: 2,
        title: 'Sesi 4.2: Penyusunan Rencana Tindakan Pribadi (Action Plan PWB)',
        description: 'Menyusun komitmen langkah kecil berkelanjutan untuk menjaga kesejahteraan psikologis setelah program selesai.',
        objective: 'Peserta memiliki dokumen rencana aksi konkret dalam menerapkan 6 dimensi Psychological Well-Being di tempat kerja.',
        dimensions: ['personal_growth', 'environmental_mastery', 'autonomy'],
        isMandatory: true,
        activities: [
          {
            id: 'act_4_2_1',
            sessionId: 'session_4_2',
            order: 1,
            title: 'Permainan 5: Tentukan Langkah Selanjutnya — Komitmen Rencana Aksi Kesejahteraan',
            type: 'tentukan_langkah',
            description: 'Merancang strategi menghadapi kembalinya rutinitas sibuk pasca-program.',
            learningGoal: 'Menetapkan strategi resiliensi berkelanjutan.',
            estimatedMinutes: 10,
            isMandatory: true,
            content: {
              decisionSteps: [
                {
                  stepId: 'act_step_1',
                  situation: 'Program intervensi 4 minggu SmartWorkCare hampir usai. Anda menyadari beban kerja kuartal berikutnya akan meningkat pesat. Bagaimana Anda mempersiapkan ketahanan psikologis Anda?',
                  question: 'Pilihlah fokus strategi utama yang ingin Anda jadikan kebiasaan:',
                  choices: [
                    {
                      id: 'plan_a',
                      text: 'Penerapan Batasan & Komunikasi Asertif: Menjadwalkan jeda istirahat harian dan berani berdiskusi terbuka dengan atasan mengenai kapasitas tugas.',
                      consequence: 'Anda mencegah kelelahan kronis (burnout) dan mempertahankan energi kerja yang stabil.',
                      nextStepId: undefined,
                      lessonSummary: 'Kesejahteraan psikologis bukanlah hasil instan, melainkan rangkaian keputusan kecil yang konsisten Anda ambil setiap hari.'
                    },
                    {
                      id: 'plan_b',
                      text: 'Manajemen Prioritas & Circle of Control: Memulai setiap pagi dengan daftar 3 prioritas utama dan melepaskan kecemasan pada hal di luar kendali.',
                      consequence: 'Pikiran Anda lebih jernih, waktu kerja lebih terarah, dan kepuasan kerja meningkat.',
                      nextStepId: undefined,
                      lessonSummary: 'Fokus pada hal yang dapat dikontrol mengembalikan rasa berdaya dan menurunkan stres harian secara signifikan.'
                    },
                    {
                      id: 'plan_c',
                      text: 'Refleksi Diri Rutin & Makna Kerja: Meluangkan 5 menit di akhir pekan untuk mencatat pembelajaran dan mensyukuri pencapaian diri.',
                      consequence: 'Anda memiliki rasa arah hidup yang jelas (Purpose in Life) dan apresiasi yang sehat terhadap perkembangan diri (Self-Acceptance).',
                      nextStepId: undefined,
                      lessonSummary: 'Mengakui proses belajar diri membangun fondasi resiliensi yang kokoh menghadapi dinamika organisasi masa depan.'
                    }
                  ]
                }
              ]
            }
          }
        ],
      },
    ],
  },
];

// Kirkpatrick Level 2 Pre-Test / Post-Test Instruments
export interface LearningTestQuestion {
  id: string;
  dimension: PWBDimension;
  scenario: string;
  question: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
    explanation: string;
  }[];
}

export const KIRKPATRICK_LEARNING_QUESTIONS: LearningTestQuestion[] = [
  {
    id: 'lrn_q1',
    dimension: 'self_acceptance',
    scenario: 'Seorang karyawan tidak sengaja salah mengirim berkas proposal kepada klien dan ditegur oleh supervisor.',
    question: 'Berdasarkan dimensi Self-Acceptance, cara pandang mana yang paling mencerminkan penerimaan diri yang sehat?',
    options: [
      {
        id: 'q1_a',
        text: 'Mengakui bahwa tindakan tersebut keliru tanpa mencap seluruh kemampuan dirinya buruk, lalu fokus memperbaiki prosedur pengiriman berkas.',
        isCorrect: true,
        explanation: 'Penerimaan diri membedakan antara penilaian terhadap suatu insiden tindakan objektif dengan harga diri secara menyeluruh.'
      },
      {
        id: 'q1_b',
        text: 'Menyimpulkan bahwa dirinya memang tidak berbakat bekerja di bidang ini dan sebaiknya segera berpindah divisi.',
        isCorrect: false,
        explanation: 'Ini adalah generalisasi destruktif yang merusak self-acceptance.'
      },
      {
        id: 'q1_c',
        text: 'Menolak mengakui kesalahan dan menyatakan bahwa instruksi supervisor yang tidak jelas adalah satu-satunya penyebab.',
        isCorrect: false,
        explanation: 'Menghindari tanggung jawab bukanlah bentuk penerimaan diri yang realistis.'
      }
    ]
  },
  {
    id: 'lrn_q2',
    dimension: 'positive_relations',
    scenario: 'Terjadi perbedaan pendapat tajam antara dua anggota tim mengenai pembagian jadwal piket kerja.',
    question: 'Tindakan manakah yang paling sesuai dengan prinsip Positive Relations with Others?',
    options: [
      {
        id: 'q2_a',
        text: 'Mengabaikan rekan tersebut dan tidak saling menyapa selama satu bulan agar situasi mereda dengan sendirinya.',
        isCorrect: false,
        explanation: 'Perilaku pasif-agresif memperburuk keharmonisan dan rasa saling percaya.'
      },
      {
        id: 'q2_b',
        text: 'Mengajak rekan berdiskusi secara terbuka dengan fokus mendengarkan alasan dan kebutuhan masing-masing untuk menemukan kesepakatan win-win.',
        isCorrect: true,
        explanation: 'Mendengarkan aktif dan empati merupakan pilar utama hubungan kerja yang positif.'
      },
      {
        id: 'q2_c',
        text: 'Menyebarkan ketidaksukaan kepada anggota tim lain agar rekan tersebut dikucilkan.',
        isCorrect: false,
        explanation: 'Tindakan ini merusak iklim psikologis kelompok kerja.'
      }
    ]
  },
  {
    id: 'lrn_q3',
    dimension: 'autonomy',
    scenario: 'Mayoritas anggota tim menyarankan jalan pintas yang melanggar standar keselamatan kerja agar pekerjaan cepat selesai.',
    question: 'Sikap manakah yang mencerminkan tingkat Otonomi (Autonomy) yang bertanggung jawab?',
    options: [
      {
        id: 'q3_a',
        text: 'Ikut saja karena takut dianggap kaku dan tidak kompak oleh kelompok.',
        isCorrect: false,
        explanation: 'Tunduk pada tekanan sosial tanpa pertimbangan kritis menunjukkan rendahnya otonomi.'
      },
      {
        id: 'q3_b',
        text: 'Tetap berpegang pada standar keselamatan kerja dan menyuarakan pertimbangan risiko secara sopan dan asertif kepada tim.',
        isCorrect: true,
        explanation: 'Otonomi berarti mampu mempertahankan standar dan nilai pribadi di tengah tekanan sosial lingkungan.'
      },
      {
        id: 'q3_c',
        text: 'Melaporkan langsung ke direksi tanpa pernah mengajak tim mendiskusikannya terlebih dahulu.',
        isCorrect: false,
        explanation: 'Kurang mengedepankan komunikasi asertif langsung di tingkat tim.'
      }
    ]
  },
  {
    id: 'lrn_q4',
    dimension: 'environmental_mastery',
    scenario: 'Tiba-tiba datang tiga permintaan tugas sekaligus dengan tenggat waktu hari ini.',
    question: 'Langkah awal yang paling mencerminkan Environmental Mastery adalah:',
    options: [
      {
        id: 'q4_a',
        text: 'Mengerjakan ketiganya sekaligus secara acak tanpa rencana hingga larut malam.',
        isCorrect: false,
        explanation: 'Multitasking reaktif meningkatkan kelelahan kognitif dan risiko kekeliruan fatal.'
      },
      {
        id: 'q4_b',
        text: 'Mengklarifikasi urgensi dan dampak masing-masing tugas, menentukan prioritas urutan pengerjaan, dan mengomunikasikan ekspektasi waktu kepada pemohon.',
        isCorrect: true,
        explanation: 'Environmental mastery ditandai dengan kecakapan mengelola tuntutan dan sumber daya secara terstruktur.'
      },
      {
        id: 'q4_c',
        text: 'Mematikan telepon dan berpura-pura tidak menerima pesan permintaan tugas tersebut.',
        isCorrect: false,
        explanation: 'Penghindaran masalah tidak menyelesaikan tuntutan kerja.'
      }
    ]
  },
  {
    id: 'lrn_q5',
    dimension: 'purpose_in_life',
    scenario: 'Seorang karyawan merasa tugas input administrasi hariannya sangat membosankan dan tidak ada gunanya.',
    question: 'Strategi mana yang paling tepat untuk menumbuhkan Purpose in Life dalam situasi tersebut?',
    options: [
      {
        id: 'q5_a',
        text: 'Menghubungkan ketepatan data administrasi dengan kelancaran gaji rekan kerja atau keselamatan data klien yang dilayani institusi.',
        isCorrect: true,
        explanation: 'Menemukan makna (job crafting) dilakukan dengan melihat kontribusi nyata peran diri terhadap ekosistem yang lebih luas.'
      },
      {
        id: 'q5_b',
        text: 'Menganggap bahwa pekerjaan hanyalah sarana mencari uang semata dan tidak perlu dicari maknanya.',
        isCorrect: false,
        explanation: 'Sikap sinis membatasi pemenuhan kebutuhan psikologis akan makna hidup.'
      },
      {
        id: 'q5_c',
        text: 'Menyelesaikan pekerjaan dengan asal-asalan karena merasa tugas tersebut remeh.',
        isCorrect: false,
        explanation: 'Sikap ini merusak motivasi dan kualitas kerja.'
      }
    ]
  },
  {
    id: 'lrn_q6',
    dimension: 'personal_growth',
    scenario: 'Seorang karyawan mendapatkan umpan balik dari atasannya bahwa presentasinya masih kurang terstruktur.',
    question: 'Respons yang mencerminkan orientasi Personal Growth adalah:',
    options: [
      {
        id: 'q6_a',
        text: 'Menganggap atasan sentimen pribadi dan merasa tidak dihargai.',
        isCorrect: false,
        explanation: 'Fixed mindset yang memandang kritik sebagai ancaman terhadap ego.'
      },
      {
        id: 'q6_b',
        text: 'Melihat kritik sebagai informasi berharga untuk mengidentifikasi area belajar baru dan mencari panduan menyusun slide yang lebih jelas.',
        isCorrect: true,
        explanation: 'Growth mindset melihat masukan sebagai kesempatan memperluas kapasitas kompetensi diri.'
      },
      {
        id: 'q6_c',
        text: 'Menolak membuat presentasi lagi di masa mendatang.',
        isCorrect: false,
        explanation: 'Menghindari tantangan menghambat perkembangan pribadi.'
      }
    ]
  }
];

export interface PWBTestItem {
  id: string;
  dimension: PWBDimension;
  dimensionLabel: string;
  statement: string;
}

export const PWB_EVALUATION_ITEMS: PWBTestItem[] = [
  // 1. Self-Acceptance
  {
    id: 'pwb_sa_1',
    dimension: 'self_acceptance',
    dimensionLabel: 'Penerimaan Diri (Self-Acceptance)',
    statement: 'Saya memiliki sikap positif terhadap diri sendiri dan menerima kelebihan maupun keterbatasan yang saya miliki secara realistis.',
  },
  {
    id: 'pwb_sa_2',
    dimension: 'self_acceptance',
    dimensionLabel: 'Penerimaan Diri (Self-Acceptance)',
    statement: 'Ketika menghadapi kekeliruan dalam pekerjaan, saya mampu membedakan antara tindakan yang perlu diperbaiki dengan nilai harga diri saya.',
  },
  // 2. Positive Relations with Others
  {
    id: 'pwb_pr_1',
    dimension: 'positive_relations',
    dimensionLabel: 'Hubungan Positif (Positive Relations)',
    statement: 'Saya mampu membangun komunikasi yang saling menghargai, hangat, dan suportif dengan rekan kerja maupun pimpinan.',
  },
  {
    id: 'pwb_pr_2',
    dimension: 'positive_relations',
    dimensionLabel: 'Hubungan Positif (Positive Relations)',
    statement: 'Saya merasa nyaman mendengarkan sudut pandang berbeda dalam tim dan mencari titik temu yang konstruktif.',
  },
  // 3. Autonomy
  {
    id: 'pwb_au_1',
    dimension: 'autonomy',
    dimensionLabel: 'Otonomi (Autonomy)',
    statement: 'Saya percaya diri mempertahankan prinsip kerja profesional dan batasan sehat meskipun menghadapi tekanan sosial lingkungan.',
  },
  {
    id: 'pwb_au_2',
    dimension: 'autonomy',
    dimensionLabel: 'Otonomi (Autonomy)',
    statement: 'Saya mampu mengambil keputusan kerja secara mandiri dan bertanggung jawab sesuai standar peran saya.',
  },
  // 4. Environmental Mastery
  {
    id: 'pwb_em_1',
    dimension: 'environmental_mastery',
    dimensionLabel: 'Penguasaan Lingkungan (Environmental Mastery)',
    statement: 'Saya mampu mengelola tuntutan dan dinamika tugas kerja sehari-hari dengan menyusun prioritas secara terstruktur.',
  },
  {
    id: 'pwb_em_2',
    dimension: 'environmental_mastery',
    dimensionLabel: 'Penguasaan Lingkungan (Environmental Mastery)',
    statement: 'Saya cakap memanfaatkan sumber daya, alokasi waktu, dan dukungan yang ada untuk menyelesaikan tantangan kerja.',
  },
  // 5. Purpose in Life
  {
    id: 'pwb_pl_1',
    dimension: 'purpose_in_life',
    dimensionLabel: 'Tujuan Hidup (Purpose in Life)',
    statement: 'Saya memahami arti penting dan kontribusi nyata dari tugas yang saya kerjakan bagi organisasi dan orang lain.',
  },
  {
    id: 'pwb_pl_2',
    dimension: 'purpose_in_life',
    dimensionLabel: 'Tujuan Hidup (Purpose in Life)',
    statement: 'Aktivitas pekerjaan yang saya jalani memiliki arah dan tujuan bermakna yang selaras dengan nilai hidup saya.',
  },
  // 6. Personal Growth
  {
    id: 'pwb_pg_1',
    dimension: 'personal_growth',
    dimensionLabel: 'Pertumbuhan Pribadi (Personal Growth)',
    statement: 'Saya memandang tantangan dan umpan balik di tempat kerja sebagai kesempatan untuk terus belajar dan memperluas kapasitas diri.',
  },
  {
    id: 'pwb_pg_2',
    dimension: 'personal_growth',
    dimensionLabel: 'Pertumbuhan Pribadi (Personal Growth)',
    statement: 'Saya terdorong untuk terus berkembang dan mencoba pendekatan baru yang lebih sehat dalam bekerja.',
  },
];

export interface ProgramBadge {
  id: string;
  weekNumber: number;
  title: string;
  theme: string;
  description: string;
  color: string;
  bgLight: string;
}

export const PROGRAM_BADGES: ProgramBadge[] = [
  {
    id: 'badge_week_1',
    weekNumber: 1,
    title: 'Lencana Pengenalan Diri',
    theme: 'Mengenali & Menerima Diri',
    description: 'Menuntaskan pemahaman self-acceptance dan membedakan kesalahan kerja dari harga diri.',
    color: '#B51F36',
    bgLight: '#FDF2F4',
  },
  {
    id: 'badge_week_2',
    weekNumber: 2,
    title: 'Lencana Relasi Harmonis',
    theme: 'Membangun Hubungan Positif',
    description: 'Menguasai komunikasi asertif, empati rekan kerja, dan batas sehat yang bertanggung jawab.',
    color: '#49316F',
    bgLight: '#F5F0FB',
  },
  {
    id: 'badge_week_3',
    weekNumber: 3,
    title: 'Lencana Masteri Tantangan',
    theme: 'Mengelola Tantangan Kerja',
    description: 'Menguasai matriks prioritas tugas, manajemen stres proaktif, dan circle of control.',
    color: '#243B53',
    bgLight: '#EDF2F7',
  },
  {
    id: 'badge_week_4',
    weekNumber: 4,
    title: 'Lencana Makna & Pertumbuhan',
    theme: 'Menemukan Tujuan & Bertumbuh',
    description: 'Menghubungkan peran kerja dengan nilai luhur serta merumuskan komitmen tindakan berkelanjutan.',
    color: '#D98BAA',
    bgLight: '#FCF2F6',
  },
];
