import type { AppModule } from '@/types/module'

export const modules: AppModule[] = [
  {
    id: 'vocabulary',
    titleKey: 'modules.vocabulary',
    descriptionKey: 'modules.vocabulary_desc',
    route: '/vocabulary',
    active: true,
    color: '#58cc02',
    shadow: '#3ea000',
    emoji: 'book'
  },
  {
    id: 'grammar',
    titleKey: 'modules.grammar',
    descriptionKey: 'modules.grammar_desc',
    route: '/coming-soon',
    active: true,
    color: '#ce82ff',
    shadow: '#9b50e0',
    emoji: 'pencil'
  },
  {
    id: 'listening',
    titleKey: 'modules.listening',
    descriptionKey: 'modules.listening_desc',
    route: '/coming-soon',
    active: true,
    color: '#1cb0f6',
    shadow: '#1290d0',
    emoji: 'headphones'
  },
  {
    id: 'speaking',
    titleKey: 'modules.speaking',
    descriptionKey: 'modules.speaking_desc',
    route: '/coming-soon',
    active: true,
    color: '#ff9600',
    shadow: '#d07a00',
    emoji: 'mic'
  }
]
