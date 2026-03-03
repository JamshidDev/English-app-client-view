import type { AppModule } from '@/types/module'

export const modules: AppModule[] = [
  {
    id: 'vocabulary',
    titleKey: 'modules.vocabulary',
    descriptionKey: 'modules.vocabulary_desc',
    route: '/vocabulary',
    active: true,
    gradient: 'from-blue-500 to-indigo-600',
    iconBg: 'bg-blue-400/30',
    color: '#3b82f6'
  },
  {
    id: 'grammar',
    titleKey: 'modules.grammar',
    descriptionKey: 'modules.grammar_desc',
    route: '/coming-soon',
    active: true,
    gradient: 'from-purple-500 to-purple-600',
    iconBg: 'bg-purple-400/30',
    color: '#a855f7'
  },
  {
    id: 'listening',
    titleKey: 'modules.listening',
    descriptionKey: 'modules.listening_desc',
    route: '/coming-soon',
    active: true,
    gradient: 'from-emerald-500 to-teal-600',
    iconBg: 'bg-emerald-400/30',
    color: '#10b981'
  },
  {
    id: 'speaking',
    titleKey: 'modules.speaking',
    descriptionKey: 'modules.speaking_desc',
    route: '/coming-soon',
    active: true,
    gradient: 'from-orange-500 to-red-500',
    iconBg: 'bg-orange-400/30',
    color: '#f97316'
  }
]
