import { Link } from '@tanstack/react-router'
import { GraduationCap, Map as MapIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/shared/lib'
import type { LearnShows } from '@/widgets/curriculum'

const ICON = { lessons: MapIcon, courses: GraduationCap } as const

/**
 * The header's toggle (ADR 0053), as the journey-app's round buttons beside its cup: the Lessons'
 * map or the Courses. The one shown is filled in honey; a phone shows the icons alone.
 */
export function LearnViewToggle({ shown }: { shown: LearnShows }) {
  const { t } = useTranslation('learn')
  return (
    <nav aria-label={t('views.label')}>
      <ul className="flex gap-1 rounded-full bg-muted p-1">
        {(['lessons', 'courses'] as const).map((view) => {
          const Icon = ICON[view]
          const current = view === shown
          return (
            <li key={view} className="flex">
              <Link
                to="/"
                search={{ view, journey: '' }}
                replace
                aria-current={current ? 'page' : undefined}
                aria-label={t(`views.${view}`)}
                // Drawn 40px on the 48px track; its reach grows to the track's edge (a 44px
                // touch target, CODE_STYLE §5).
                className={cn(
                  'relative flex h-10 min-w-10 items-center justify-center gap-2 rounded-full px-2.5 font-semibold transition-colors duration-200 ease-out before:absolute before:-inset-1 before:content-[""] sm:px-4',
                  current
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:bg-background/70 hover:text-foreground',
                )}
              >
                <Icon aria-hidden className="size-5" />
                <span aria-hidden className="hidden sm:inline">
                  {t(`views.${view}`)}
                </span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
