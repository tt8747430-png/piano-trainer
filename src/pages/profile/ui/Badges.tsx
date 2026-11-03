import {
  BookOpenCheck,
  CalendarDays,
  Flame,
  Library,
  Lock,
  Music,
  Piano,
  type LucideIcon,
} from 'lucide-react'
import { useId, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useLibrary } from '@/entities/library'
import { usePieces } from '@/entities/piece'
import {
  badgesOf,
  nextMilestone,
  practiceRecord,
  useProgress,
  type BadgeFigures,
  type BadgeId,
} from '@/entities/progress'
import { cn } from '@/shared/lib'
import { ProgressMeter } from '@/shared/ui'

const ICON: Readonly<Record<BadgeId, LucideIcon>> = {
  streak: Flame,
  repertoire: Music,
  lessons: BookOpenCheck,
  scales: Piano,
  devotion: CalendarDays,
  library: Library,
}

/** What the badges count, from the learner's progress, own songs and folders. */
function useBadgeFigures(): BadgeFigures {
  const progress = useProgress((state) => state)
  const ownSongs = usePieces((state) => state.songs.length)
  const folders = useLibrary((state) => state.folders.length)
  return useMemo(() => {
    const learned = Object.keys(progress.learned)
    const record = practiceRecord(progress)
    return {
      bestStreak: record.bestStreak,
      songsLearned: learned.filter((step) => step.startsWith('piece:')).length,
      lessonsDone: record.lessonsDone,
      scalesLearned: learned.filter((step) => step.startsWith('scale:')).length,
      daysPractised: record.daysPractised,
      libraryBuilt: ownSongs + folders,
    }
  }, [progress, ownSongs, folders])
}

/**
 * The Profile's badges (B1, Quizlet's): the nearest tier still to earn as an "Almost there" card,
 * then the six badges, each its icon on the paint of its highest tier (greyed and locked before
 * the first), its name, and its tier or how far along it is.
 */
export function Badges() {
  const { t } = useTranslation('account')
  const headingId = useId()
  const figures = useBadgeFigures()
  const badges = useMemo(() => badgesOf(figures), [figures])
  const next = useMemo(() => nextMilestone(figures), [figures])
  return (
    <section aria-labelledby={headingId} className="flex flex-col gap-2">
      <h2 id={headingId} className="px-3 font-sans text-sm font-semibold text-muted-foreground">
        {t('profile.badges.title')}
      </h2>
      {next ? (
        <div role="status" className="flex flex-col gap-2 card p-4">
          <p className="text-sm font-semibold">{t('profile.badges.almost')}</p>
          <p className="text-pretty">
            {t('profile.badges.left', {
              count: next.left,
              tier: t(`profile.badges.tiers.${next.tier}`),
              badge: t(`profile.badges.names.${next.id}`),
            })}
          </p>
          <ProgressMeter
            done={next.goal - next.left}
            total={next.goal}
            count={t('profile.badges.locked', { have: next.goal - next.left, goal: next.goal })}
            said={t(`profile.badges.names.${next.id}`)}
          />
        </div>
      ) : null}
      <ul className="grid grid-cols-2 gap-y-5 card px-2 py-5 sm:grid-cols-3">
        {badges.map(({ id, earned, tier, have, next: goal }) => {
          const Icon = ICON[id]
          return (
            <li key={id} className="flex min-w-0 flex-col items-center gap-1 text-center">
              <span
                aria-hidden
                data-tier={tier ?? undefined}
                className={cn(
                  'grid size-12 place-items-center rounded-pill',
                  tier ? 'bg-paint-yellow text-on-paint-yellow' : 'bg-muted text-muted-foreground',
                )}
              >
                {tier ? <Icon className="size-6" /> : <Lock className="size-5" />}
              </span>
              <span
                className={cn('text-sm font-medium text-pretty', !tier && 'text-muted-foreground')}
              >
                {t(`profile.badges.names.${id}`)}
              </span>
              <span className="text-xs text-muted-foreground tabular-nums">
                {tier
                  ? goal === null
                    ? t('profile.badges.all')
                    : t('profile.badges.tier', { tier: t(`profile.badges.tiers.${tier}`), earned })
                  : t('profile.badges.locked', { have, goal: goal ?? 0 })}
              </span>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
