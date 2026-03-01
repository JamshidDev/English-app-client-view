import type { AppModule } from '@/types/module'

export const modules: AppModule[] = [
  {
    id: 'vocabulary',
    icon: '📖',
    titleKey: 'modules.vocabulary',
    descriptionKey: 'modules.vocabulary_desc',
    route: '/vocabulary',
    active: true,
    gradient: 'from-blue-500 to-blue-600'
  },
  {
    id: 'grammar',
    icon: '📝',
    titleKey: 'modules.grammar',
    descriptionKey: 'modules.grammar_desc',
    route: '/coming-soon',
    active: false,
    gradient: 'from-purple-500 to-purple-600'
  },
  {
    id: 'listening',
    icon: '🎧',
    titleKey: 'modules.listening',
    descriptionKey: 'modules.listening_desc',
    route: '/coming-soon',
    active: false,
    gradient: 'from-green-500 to-green-600'
  },
  {
    id: 'speaking',
    icon: '🗣️',
    titleKey: 'modules.speaking',
    descriptionKey: 'modules.speaking_desc',
    route: '/coming-soon',
    active: false,
    gradient: 'from-orange-500 to-orange-600'
  }
]
