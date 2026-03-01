export interface Goal {
  id: string
  key: string
  labelUz: string
  labelRu: string
  labelEn: string
  icon: string
}

export const goals: Goal[] = [
  {
    id: '1',
    key: 'travel',
    labelUz: 'Sayohat uchun',
    labelRu: 'Для путешествий',
    labelEn: 'For travel',
    icon: '✈️'
  },
  {
    id: '2',
    key: 'career',
    labelUz: 'Ish/Karyera uchun',
    labelRu: 'Для работы/карьеры',
    labelEn: 'For work/career',
    icon: '💼'
  },
  {
    id: '3',
    key: 'education',
    labelUz: "Ta'lim/O'qish uchun",
    labelRu: 'Для учебы/образования',
    labelEn: 'For education',
    icon: '🎓'
  },
  {
    id: '4',
    key: 'daily',
    labelUz: 'Kundalik muloqot uchun',
    labelRu: 'Для повседневного общения',
    labelEn: 'For daily communication',
    icon: '💬'
  },
  {
    id: '5',
    key: 'ielts',
    labelUz: 'IELTS/CEFR tayyorgarlik',
    labelRu: 'Подготовка к IELTS/CEFR',
    labelEn: 'IELTS/CEFR preparation',
    icon: '📝'
  },
  {
    id: '6',
    key: 'other',
    labelUz: 'Boshqa',
    labelRu: 'Другое',
    labelEn: 'Other',
    icon: '🌟'
  }
]
