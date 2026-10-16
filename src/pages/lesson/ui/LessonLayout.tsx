import { Link, type LinkProps } from '@tanstack/react-router'
import { ArrowRight, ChevronsLeft } from 'lucide-react'
import type { ReactElement, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import type { Lesson } from '@/entities/lesson'
import type { StepId } from '@/entities/step'
import { LearnedButton, useLearned } from '@/features/mark-learned'
import { localText, useLocale } from '@/shared/i18n'
import { ButtonLink, ScreenHeader } from '@/shared/ui'
import { LessonView, type UpLink } from '@/widgets/lesson-view'

/** A lesson either side of this one, or the way on past the last: a router `Link`, named. */
export interface WayLink {
  readonly link: ReactElement
  /** Which way it is: Previous lesson, Next lesson, Back to the journey. */
  readonly label: string
  /** The lesson it leads to, by name; none where the way leads back. */
  readonly title?: string
}

/** Where a lesson leads: up to what it is part of, back to the lesson before, on to the next. */
export interface LessonTrack {
  readonly up: UpLink
  readonly previous?: WayLink
  readonly next: WayLink
}

/**
 * A lesson, a journey's or a course's (ADR 0053, 0058), in one column in the middle of the screen:
 * its title with Learned in its bar, where it is (`place`), the lesson under its
 * floating bar of sections, and at its end the lesson before and the way on, which learns it.
 */
export function LessonLayout({
  lesson,
  step,
  place,
  back,
  track,
}: {
  lesson: Lesson
  step: StepId
  place: ReactNode
  /** The screen's Back (`BackButton`). */
  back: ReactNode
  track: LessonTrack
}) {
  const { t } = useTranslation('learn')
  const locale = useLocale()
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-4">
      <ScreenHeader
        title={localText(lesson.title, locale)}
        back={back}
        actions={<LearnedButton step={step} round />}
      />
      <nav aria-label={t('placeLabel')} className="-mt-3 text-muted-foreground print:hidden">
        {place}
      </nav>
      <LessonView key={lesson.id} lesson={lesson} up={track.up} />
      <LessonEnd step={step} track={track} />
    </div>
  )
}

/** One of a lesson's ends as a card: which way it is, the lesson it leads to, its arrow. */
function EndLink({ way, onGo, primary }: { way: WayLink; onGo?: () => void; primary: boolean }) {
  return (
    <ButtonLink
      variant={primary ? 'default' : 'surface'}
      onClick={onGo}
      render={way.link}
      className={
        primary
          ? 'h-auto min-h-16 justify-between gap-3 rounded-2xl px-4 py-3 text-left whitespace-normal sm:col-start-2'
          : 'h-auto min-h-16 justify-start gap-3 rounded-2xl px-4 py-3 text-left whitespace-normal'
      }
    >
      {primary ? null : <ChevronsLeft aria-hidden className="shrink-0" />}
      <span className="flex min-w-0 flex-col">
        <span className="text-xs font-medium opacity-80">{way.label}</span>
        <span className="font-display text-lg text-balance">{way.title ?? way.label}</span>
      </span>
      {primary ? <ArrowRight aria-hidden className="shrink-0" /> : null}
    </ButtonLink>
  )
}

/** A lesson's end: the lesson before and the way on side by side; going on learns it. */
function LessonEnd({ step, track }: { step: StepId; track: LessonTrack }) {
  const { learn } = useLearned(step)
  return (
    <footer className="mt-8 grid gap-3 border-t border-border pt-6 print:hidden sm:grid-cols-2">
      {track.previous ? <EndLink way={track.previous} primary={false} /> : null}
      <EndLink way={track.next} onGo={learn} primary />
    </footer>
  )
}

/** A link in a lesson's place line: what it is part of, by name. */
export function PlaceLink({ children, ...link }: LinkProps & { children: ReactNode }) {
  return (
    <Link
      {...link}
      className="rounded-sm font-semibold text-foreground underline-offset-4 hover:underline"
    >
      {children}
    </Link>
  )
}
