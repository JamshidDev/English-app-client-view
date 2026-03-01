import type { Quiz } from '@/types/quiz'

export const quizzes: Quiz[] = [
  {
    id: '1',
    question: '"Hello" so\'zining tarjimasi qaysi?',
    options: [
      { id: 'a', text: 'Xayr' },
      { id: 'b', text: 'Salom' },
      { id: 'c', text: 'Rahmat' },
      { id: 'd', text: 'Iltimos' }
    ],
    correctAnswerIndex: 1,
    explanation: '"Hello" ingliz tilida "Salom" degan ma\'noni anglatadi.',
    relatedWordId: '1',
    level: 'beginner'
  },
  {
    id: '2',
    question: 'Ingliz tili alifbosida nechta harf bor?',
    options: [
      { id: 'a', text: '24' },
      { id: 'b', text: '26' },
      { id: 'c', text: '28' },
      { id: 'd', text: '30' }
    ],
    correctAnswerIndex: 1,
    explanation: 'Ingliz tili alifbosi 26 ta harfdan iborat: A dan Z gacha.',
    level: 'beginner'
  },
  {
    id: '3',
    question: '"Good morning" qachon ishlatiladi?',
    options: [
      { id: 'a', text: 'Kechqurun' },
      { id: 'b', text: 'Tushdan keyin' },
      { id: 'c', text: 'Ertalab' },
      { id: 'd', text: 'Tunda' }
    ],
    correctAnswerIndex: 2,
    explanation: '"Good morning" - "Xayrli tong" degan ma\'noda ertalab ishlatiladi.',
    level: 'beginner'
  },
  {
    id: '4',
    question: '"Nice to meet you" qanday tarjima qilinadi?',
    options: [
      { id: 'a', text: 'Tanishganimdan xursandman' },
      { id: 'b', text: 'Yana ko\'rishguncha' },
      { id: 'c', text: 'Qandaysiz?' },
      { id: 'd', text: 'Rahmat' }
    ],
    correctAnswerIndex: 0,
    explanation: '"Nice to meet you" - biror kishi bilan birinchi marta tanishganda aytiladi.',
    level: 'beginner'
  },
  {
    id: '5',
    question: '"Fifteen" raqami nechaga teng?',
    options: [
      { id: 'a', text: '5' },
      { id: 'b', text: '50' },
      { id: 'c', text: '15' },
      { id: 'd', text: '25' }
    ],
    correctAnswerIndex: 2,
    explanation: '"Fifteen" ingliz tilida 15 raqamini bildiradi.',
    level: 'beginner'
  },
  {
    id: '6',
    question: '"Please" so\'zining tarjimasi qaysi?',
    options: [
      { id: 'a', text: 'Kechirasiz' },
      { id: 'b', text: 'Rahmat' },
      { id: 'c', text: 'Iltimos' },
      { id: 'd', text: 'Salom' }
    ],
    correctAnswerIndex: 2,
    explanation: '"Please" - "Iltimos" degan ma\'noda ishlatiladi.',
    relatedWordId: '4',
    level: 'beginner'
  },
  {
    id: '7',
    question: 'Present Simple da "He" uchun qaysi shakl to\'g\'ri?',
    options: [
      { id: 'a', text: 'He work' },
      { id: 'b', text: 'He works' },
      { id: 'c', text: 'He working' },
      { id: 'd', text: 'He is work' }
    ],
    correctAnswerIndex: 1,
    explanation: 'He/She/It uchun fe\'lga -s yoki -es qo\'shiladi: He works.',
    level: 'beginner'
  },
  {
    id: '8',
    question: '"Do you like coffee?" gapining to\'g\'ri javobini tanlang.',
    options: [
      { id: 'a', text: 'Yes, I likes' },
      { id: 'b', text: 'Yes, I do' },
      { id: 'c', text: 'Yes, I am' },
      { id: 'd', text: 'Yes, I doing' }
    ],
    correctAnswerIndex: 1,
    explanation: 'Do bilan boshlangan savollarga "Yes, I do" yoki "No, I don\'t" javob beriladi.',
    level: 'beginner'
  },
  {
    id: '9',
    question: '"She ___ a book now" gapida bo\'sh joyni to\'ldiring.',
    options: [
      { id: 'a', text: 'reads' },
      { id: 'b', text: 'read' },
      { id: 'c', text: 'is reading' },
      { id: 'd', text: 'reading' }
    ],
    correctAnswerIndex: 2,
    explanation: '"Now" so\'zi hozir sodir bo\'layotgan harakatni bildiradi - Present Continuous.',
    level: 'intermediate'
  },
  {
    id: '10',
    question: '"I ___ to London last year" gapidagi to\'g\'ri javob?',
    options: [
      { id: 'a', text: 'go' },
      { id: 'b', text: 'went' },
      { id: 'c', text: 'gone' },
      { id: 'd', text: 'going' }
    ],
    correctAnswerIndex: 1,
    explanation: '"Last year" o\'tgan vaqtni bildiradi, shuning uchun Past Simple - "went" ishlatiladi.',
    level: 'intermediate'
  },
  {
    id: '11',
    question: '"Did she ___ the movie?" gapini to\'ldiring.',
    options: [
      { id: 'a', text: 'watched' },
      { id: 'b', text: 'watches' },
      { id: 'c', text: 'watch' },
      { id: 'd', text: 'watching' }
    ],
    correctAnswerIndex: 2,
    explanation: '"Did" dan keyin fe\'lning asosiy shakli (V1) keladi.',
    level: 'intermediate'
  },
  {
    id: '12',
    question: '"I ___ help you tomorrow" gapidagi to\'g\'ri javob?',
    options: [
      { id: 'a', text: 'will' },
      { id: 'b', text: 'am' },
      { id: 'c', text: 'do' },
      { id: 'd', text: 'was' }
    ],
    correctAnswerIndex: 0,
    explanation: '"Tomorrow" kelasi vaqtni bildiradi - Future Simple uchun "will" ishlatiladi.',
    level: 'intermediate'
  },
  {
    id: '13',
    question: '"___ I use your phone?" qaysi modal fe\'l to\'g\'ri?',
    options: [
      { id: 'a', text: 'Will' },
      { id: 'b', text: 'Do' },
      { id: 'c', text: 'Can' },
      { id: 'd', text: 'Am' }
    ],
    correctAnswerIndex: 2,
    explanation: 'Ruxsat so\'rash uchun "Can" modal fe\'li ishlatiladi.',
    level: 'intermediate'
  },
  {
    id: '14',
    question: 'First Conditional qaysi formula bo\'yicha tuziladi?',
    options: [
      { id: 'a', text: 'If + Past Simple, would + V1' },
      { id: 'b', text: 'If + Present Simple, will + V1' },
      { id: 'c', text: 'If + Present Simple, Present Simple' },
      { id: 'd', text: 'If + Past Perfect, would have + V3' }
    ],
    correctAnswerIndex: 1,
    explanation: 'First Conditional: If + Present Simple, will + V1 (haqiqiy kelajak sharti).',
    level: 'advanced'
  },
  {
    id: '15',
    question: '"If I had money, I ___ a new car" gapini to\'ldiring.',
    options: [
      { id: 'a', text: 'will buy' },
      { id: 'b', text: 'would buy' },
      { id: 'c', text: 'buy' },
      { id: 'd', text: 'bought' }
    ],
    correctAnswerIndex: 1,
    explanation: 'Bu Second Conditional - xayoliy holat: If + Past Simple, would + V1.',
    level: 'advanced'
  },
  {
    id: '16',
    question: '"Airport" so\'zining tarjimasi?',
    options: [
      { id: 'a', text: 'Vokzal' },
      { id: 'b', text: 'Aeroport' },
      { id: 'c', text: 'Mehmonxona' },
      { id: 'd', text: 'Avtobus bekati' }
    ],
    correctAnswerIndex: 1,
    explanation: '"Airport" - aeroport, samolyotlar qo\'nadigan joy.',
    relatedWordId: '11',
    level: 'beginner'
  },
  {
    id: '17',
    question: '"Deadline" so\'zi nimani bildiradi?',
    options: [
      { id: 'a', text: 'Boshlanish sanasi' },
      { id: 'b', text: 'Oxirgi muddat' },
      { id: 'c', text: 'Dam olish kuni' },
      { id: 'd', text: 'Bayram kuni' }
    ],
    correctAnswerIndex: 1,
    explanation: '"Deadline" - biror ishni tugatish uchun belgilangan oxirgi muddat.',
    relatedWordId: '18',
    level: 'intermediate'
  },
  {
    id: '18',
    question: '"Scholarship" so\'zining tarjimasi?',
    options: [
      { id: 'a', text: 'Maktab' },
      { id: 'b', text: 'Sertifikat' },
      { id: 'c', text: 'Stipendiya' },
      { id: 'd', text: 'Imtihon' }
    ],
    correctAnswerIndex: 2,
    explanation: '"Scholarship" - stipendiya yoki grant, o\'qish uchun beriladigan moliyaviy yordam.',
    relatedWordId: '25',
    level: 'intermediate'
  }
]
