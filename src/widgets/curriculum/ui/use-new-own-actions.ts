import { Library } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { type MenuAction, LessonIcon } from '@/shared/ui'
import type { OwnKind } from './NewOwnSheet'

/**
 * New's two (canvas 167): New lesson and New course, for the phone's dial and the menus of Learn's row
 * and the laptop's New; each opens its own sheet.
 */
export function useNewOwnActions(onPick: (kind: OwnKind) => void): readonly MenuAction[] {
  const { t } = useTranslation('learn')
  return [
    {
      key: 'lesson',
      label: t('own.newLesson'),
      icon: LessonIcon,
      onSelect: () => onPick('lesson'),
    },
    { key: 'course', label: t('own.newCourse'), icon: Library, onSelect: () => onPick('course') },
  ]
}
