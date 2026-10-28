import { Link, type LinkProps } from '@tanstack/react-router'
import { ArrowRight, ChevronsLeft } from 'lucide-react'
import { Fragment, type ReactElement, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import type { Lesson } from '@/entities/lesson'
import type { StepId } from '@/entities/step'
import { useProgressStoreApi } from '@/entities/progress'
import { LearnedButton, useLearned } from '@/features/mark-learned'
import { recordSectionRead } from '@/features/record-reading'
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
 * A lesson, a journey's or a course's (ADR 0053, 0061), in one column in the middle of the screen:
 * its title with Learned in its bar, where it is (`place`), the lesson under its
 * floating bar of sections, and at its end the lesson before and the way on, which learns it (on a
 * phone, read a page at a time, the bar's Done).
 */
export function LessonLayout({
  lesson,
  step,
  place,
  back,
  track,
  after = [],
}: {
  lesson: Lesson
  step: StepId
  place: ReactNode
  /** The lessons to read before it, each a link by its title. */
  after?: readonly { readonly title: string; readonly link: LinkProps }[]
  /** The screen's Back (`BackButton`). */
  back: ReactNode
  track: LessonTrack
}) {
  const { t } = useTranslation('learn')
  const locale = useLocale()
  const { learn } = useLearned(step)
  const progress = useProgressStoreApi()
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-4">
      <ScreenHeader
        title={localText(lesson.title, locale)}
        back={back}
        actions={<LearnedButton step={step} round />}
      />
      <nav aria-label={t('placeLabel')} className="-mt-3 text-muted-foreground print:hidden">
        {place}
        {after.length > 0 ? (
          <span className="block">
            {t('afterLinks')}{' '}
            {after.map(({ title, link }, i) => (
              <Fragment key={title}>
                {i > 0 ? ', ' : null}
                <PlaceLink {...link}>{title}</PlaceLink>
              </Fragment>
            ))}
          </span>
        ) : null}
      </nav>
      <LessonView
        key={lesson.id}
        lesson={lesson}
        up={track.up}
        onward={{ link: track.next.link, onGo: learn }}
        end={(paged) => <LessonEnd track={track} onGo={learn} paged={paged} />}
        onRead={(section) => recordSectionRead(progress, step, section)}
      />
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

/**
 * A lesson's end: the lesson before and the way on side by side; going on learns it. Read a page at a
 * time, the bar's Done is the way on: the end keeps the lesson before.
 */
function LessonEnd({
  track,
  onGo,
  paged,
}: {
  track: LessonTrack
  onGo: () => void
  paged: boolean
}) {
  if (paged && !track.previous) return null
  return (
    <footer className="mt-8 grid gap-3 border-t border-border pt-6 print:hidden sm:grid-cols-2">
      {track.previous ? <EndLink way={track.previous} primary={false} /> : null}
      {paged ? null : <EndLink way={track.next} onGo={onGo} primary />}
    </footer>
  )
}

/**
 * A link in a lesson's place line: what it is part of, by name, a line of text whose target reaches
 * past it to a finger's size (44px), as a switch's does: mostly downwards, the screen's bar being
 * just above it.
 */
export function PlaceLink({ children, ...link }: LinkProps & { children: ReactNode }) {
  return (
    <Link
      {...link}
      className="relative rounded-sm font-semibold text-foreground underline-offset-4 after:absolute after:-inset-x-2 after:-top-1.5 after:-bottom-4.5 hover:underline"
    >
      {children}
    </Link>
  )
}
