import type { Lesson } from '@/types/lesson'

export const lessons: Lesson[] = [
  {
    id: '1',
    title: "Ingliz tili alifbosi va tovushlar",
    titleEn: "English Alphabet and Sounds",
    description: "Ingliz tili alifbosini o'rganing va to'g'ri talaffuzni mashq qiling",
    level: 'beginner',
    category: 'speaking',
    durationMinutes: 15,
    content: [
      "Ingliz tili alifbosi 26 ta harfdan iborat: A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V, W, X, Y, Z.",
      "Unlilar (Vowels): A, E, I, O, U - bu harflar so'zlarda asosiy tovushlarni hosil qiladi.",
      "Undoshlar (Consonants): Qolgan barcha harflar undosh hisoblanadi.",
      "Har bir harfning o'z nomi va tovushi bor. Masalan, 'A' harfi 'ey' deb nomlanadi, lekin 'apple' so'zida 'æ' tovushini beradi."
    ],
    vocabularyIds: ['1', '2', '3'],
    quizIds: ['1', '2'],
    order: 1
  },
  {
    id: '2',
    title: "Salomlashish va tanishish",
    titleEn: "Greetings and Introductions",
    description: "Ingliz tilida salomlashish va o'zingizni tanishtirish",
    level: 'beginner',
    category: 'speaking',
    durationMinutes: 20,
    content: [
      "Hello - Salom (rasmiy va norasmiy)",
      "Hi - Salom (norasmiy)",
      "Good morning - Xayrli tong (ertalab)",
      "Good afternoon - Xayrli kun (tushdan keyin)",
      "Good evening - Xayrli kech (kechqurun)",
      "My name is... - Mening ismim...",
      "Nice to meet you - Tanishganimdan xursandman"
    ],
    vocabularyIds: ['4', '5', '6', '7'],
    quizIds: ['3', '4'],
    order: 2
  },
  {
    id: '3',
    title: "Raqamlar 1 dan 100 gacha",
    titleEn: "Numbers 1 to 100",
    description: "Ingliz tilida raqamlarni o'rganing va ularni to'g'ri talaffuz qiling",
    level: 'beginner',
    category: 'vocabulary',
    durationMinutes: 25,
    content: [
      "1-10: one, two, three, four, five, six, seven, eight, nine, ten",
      "11-20: eleven, twelve, thirteen, fourteen, fifteen, sixteen, seventeen, eighteen, nineteen, twenty",
      "O'nliklar: thirty (30), forty (40), fifty (50), sixty (60), seventy (70), eighty (80), ninety (90), one hundred (100)",
      "Murakkab raqamlar: twenty-one (21), thirty-five (35), ninety-nine (99)"
    ],
    vocabularyIds: ['8', '9', '10'],
    quizIds: ['5'],
    order: 3
  },
  {
    id: '4',
    title: "Kundalik so'zlar va iboralar",
    titleEn: "Daily Words and Phrases",
    description: "Har kuni ishlatiladigan eng muhim so'z va iboralar",
    level: 'beginner',
    category: 'vocabulary',
    durationMinutes: 20,
    content: [
      "Please - Iltimos",
      "Thank you - Rahmat",
      "You're welcome - Arzimaydi",
      "Excuse me - Kechirasiz",
      "I'm sorry - Uzr",
      "Yes - Ha",
      "No - Yo'q",
      "Maybe - Balki"
    ],
    vocabularyIds: ['11', '12', '13', '14'],
    quizIds: ['6'],
    order: 4
  },
  {
    id: '5',
    title: "Present Simple tense",
    titleEn: "Present Simple Tense",
    description: "Hozirgi oddiy zamon qoidalari va misollar",
    level: 'beginner',
    category: 'grammar',
    durationMinutes: 30,
    content: [
      "Present Simple - muntazam takrorlanadigan harakatlar uchun ishlatiladi.",
      "I/You/We/They + V1: I work every day. (Men har kuni ishlayman)",
      "He/She/It + V1+s/es: She works every day. (U har kuni ishlaydi)",
      "So'roq shakli: Do/Does + subject + V1? - Do you work? Does she work?",
      "Inkor shakli: Subject + do/does + not + V1 - I do not work. She does not work."
    ],
    vocabularyIds: ['15', '16'],
    quizIds: ['7', '8'],
    order: 5
  },
  {
    id: '6',
    title: "Present Continuous tense",
    titleEn: "Present Continuous Tense",
    description: "Hozirgi davom etuvchi zamon",
    level: 'intermediate',
    category: 'grammar',
    durationMinutes: 30,
    content: [
      "Present Continuous - hozir sodir bo'layotgan harakatlar uchun.",
      "Formula: Subject + am/is/are + V-ing",
      "I am working now. (Men hozir ishlamoqdaman)",
      "She is reading a book. (U kitob o'qimoqda)",
      "They are playing football. (Ular futbol o'ynamoqda)",
      "So'roq: Am/Is/Are + subject + V-ing? - Are you working?"
    ],
    vocabularyIds: ['17', '18'],
    quizIds: ['9'],
    order: 6
  },
  {
    id: '7',
    title: "Past Simple tense",
    titleEn: "Past Simple Tense",
    description: "O'tgan oddiy zamon - o'tmishda bo'lib o'tgan voqealar",
    level: 'intermediate',
    category: 'grammar',
    durationMinutes: 35,
    content: [
      "Past Simple - o'tmishda tugallangan harakatlar uchun.",
      "Regular verbs: V2 = V1 + ed (work - worked, play - played)",
      "Irregular verbs: go - went, eat - ate, see - saw, do - did",
      "So'roq: Did + subject + V1? - Did you work yesterday?",
      "Inkor: Subject + did not + V1 - I did not work yesterday."
    ],
    vocabularyIds: ['19', '20'],
    quizIds: ['10', '11'],
    order: 7
  },
  {
    id: '8',
    title: "Future Simple tense",
    titleEn: "Future Simple Tense",
    description: "Kelasi oddiy zamon - rejalar va bashoratlar",
    level: 'intermediate',
    category: 'grammar',
    durationMinutes: 25,
    content: [
      "Future Simple - kelajakdagi harakatlar va rejalar uchun.",
      "Formula: Subject + will + V1",
      "I will go to London next year. (Keyingi yil Londonga boraman)",
      "She will help you. (U sizga yordam beradi)",
      "So'roq: Will + subject + V1? - Will you come tomorrow?",
      "Inkor: Subject + will not (won't) + V1"
    ],
    vocabularyIds: ['21', '22'],
    quizIds: ['12'],
    order: 8
  },
  {
    id: '9',
    title: "Modals: Can, Could, May",
    titleEn: "Modal Verbs: Can, Could, May",
    description: "Modal fe'llar - imkoniyat va ruxsat so'rash",
    level: 'intermediate',
    category: 'grammar',
    durationMinutes: 30,
    content: [
      "CAN - qobiliyat va imkoniyat: I can swim. (Men suzishim mumkin)",
      "CAN - ruxsat so'rash (norasmiy): Can I use your phone?",
      "COULD - o'tmishdagi qobiliyat: I could run fast when I was young.",
      "COULD - iltimos (rasmiyroq): Could you help me, please?",
      "MAY - ruxsat so'rash (rasmiy): May I come in?",
      "MAY - ehtimollik: It may rain tomorrow."
    ],
    vocabularyIds: ['23', '24'],
    quizIds: ['13'],
    order: 9
  },
  {
    id: '10',
    title: "Conditional Sentences",
    titleEn: "Conditional Sentences (If clauses)",
    description: "Shart gaplar - Zero, First, Second conditionals",
    level: 'advanced',
    category: 'grammar',
    durationMinutes: 40,
    content: [
      "Zero Conditional: If + Present Simple, Present Simple",
      "Umumiy haqiqatlar uchun: If you heat water to 100°C, it boils.",
      "First Conditional: If + Present Simple, will + V1",
      "Haqiqiy kelajak sharti: If it rains, I will stay home.",
      "Second Conditional: If + Past Simple, would + V1",
      "Xayoliy holat: If I had a million dollars, I would buy a house."
    ],
    vocabularyIds: ['25', '26'],
    quizIds: ['14', '15'],
    order: 10
  },
  {
    id: '11',
    title: "Reported Speech",
    titleEn: "Reported Speech (Indirect Speech)",
    description: "Bilvosita nutq - boshqalarning so'zlarini yetkazish",
    level: 'advanced',
    category: 'grammar',
    durationMinutes: 45,
    content: [
      "Direct: He said, 'I am happy.'",
      "Reported: He said that he was happy.",
      "Zamon o'zgarishlari: am/is → was, are → were, will → would",
      "Present Simple → Past Simple: 'I work' → He said he worked",
      "Present Continuous → Past Continuous: 'I am working' → He said he was working"
    ],
    vocabularyIds: ['27', '28'],
    quizIds: [],
    order: 11
  },
  {
    id: '12',
    title: "IELTS Speaking Tips",
    titleEn: "IELTS Speaking Preparation",
    description: "IELTS Speaking bo'limi uchun tayyorgarlik va maslahatlar",
    level: 'advanced',
    category: 'speaking',
    durationMinutes: 50,
    content: [
      "Part 1: Shaxsiy savollar - 4-5 daqiqa. O'zingiz haqida, ishingiz, qiziqishlaringiz.",
      "Part 2: Cue Card - 1 daqiqa tayyorgarlik, 2 daqiqa gapirish. Mavzu bo'yicha uzun javob.",
      "Part 3: Munozara - 4-5 daqiqa. Part 2 mavzusi bo'yicha chuqurroq savollar.",
      "Maslahatlar: Aniq va ravon gapiring, to'xtab qolmang, misollar keltiring.",
      "Band 7+ uchun: Murakkab grammatika, idiomalar, linking words ishlatish."
    ],
    vocabularyIds: ['29', '30'],
    quizIds: [],
    order: 12
  }
]
