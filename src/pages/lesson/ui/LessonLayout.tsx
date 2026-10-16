import { Link, type LinkProps } from '@tanstack/react-router'
import { ArrowRight, ChevronsLeft, Hand } from 'lucide-react'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import type { Lesson } from '@/entities/lesson'
import { selectLesson, useSettings, useSettingsStoreApi } from '@/entities/settings'
import type { StepId } from '@/entities/step'
import { LearnedButton, useLearned } from '@/features/mark-learned'
import { setLessonFingers } from '@/features/set-preference'
import { localText, useLocale } from '@/shared/i18n'
import { ButtonLink, ScreenHeader } from '@/shared/ui'
import { Toggle } from '@/shared/ui/primitives/toggle'
import { LessonView, type LessonTrack, type TrackLink } from '@/widgets/lesson-view'

/**
 * A lesson, a journey's or a course's (ADR 0053): its title, where it is (`place`), its summary, the
 * lesson itself under its floating bar, and at its end Learned over the lesson before and the way
 * on, which learns it on the way.
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
  /** Where it leads; the way on learns it, which the layout adds. */
  track: LessonTrack
}) {
  const { t } = useTranslation('learn')
  const locale = useLocale()
  const { learn } = useLearned(step)
  const learning: LessonTrack = { ...track, next: { ...track.next, onGo: learn } }
  return (
    <div className="flex flex-col gap-4">
      <ScreenHeader title={localText(lesson.title, locale)} back={back} />
      <nav aria-label={t('placeLabel')} className="-mt-3 text-muted-foreground print:hidden">
        {place}
      </nav>
      <p className="max-w-prose text-lg text-pretty text-muted-foreground">
        {localText(lesson.summary, locale)}
      </p>
      <LessonView
        key={lesson.id}
        lesson={lesson}
        track={learning}
        tools={hasFingers(lesson) ? <FingersToggle /> : undefined}
      />
      <LessonEnd step={step} track={learning} />
    </div>
  )
}

/** Whether a lesson plays a scale: the examples that carry fingers. */
const hasFingers = (lesson: Lesson) =>
  lesson.sections.some((section) => section.blocks.some((block) => block.kind === 'scale'))

/** The fingers on a lesson's scales, shown or not, from the lesson's bar: a hand, pressed while shown. */
function FingersToggle() {
  const { t } = useTranslation('learn')
  const store = useSettingsStoreApi()
  const { fingers } = useSettings(selectLesson)
  return (
    <Toggle
      pressed={fingers}
      onPressedChange={(on) => setLessonFingers(store, on)}
      aria-label={t('fingers')}
      title={t('fingers')}
      className="size-11 rounded-full border-transparent bg-transparent px-0 aria-pressed:border-transparent"
    >
      <Hand aria-hidden />
    </Toggle>
  )
}

/** One of a lesson's ends as a card: which way it is, the lesson it leads to, its arrow. */
function EndLink({ way, primary }: { way: TrackLink; primary: boolean }) {
  return (
    <ButtonLink
      variant={primary ? 'default' : 'surface'}
      onClick={way.onGo}
      render={way.link}
      className={
        primary
          ? 'h-auto min-h-16 justify-between gap-3 rounded-2xl px-4 py-3 text-left whitespace-normal'
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

/** A lesson's end: its Learned toggle, then the lesson before and the way on side by side. */
function LessonEnd({ step, track }: { step: StepId; track: LessonTrack }) {
  return (
    <footer className="mt-8 flex max-w-prose flex-col gap-4 border-t border-border pt-6 print:hidden">
      <div className="self-start">
        <LearnedButton step={step} />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {track.previous ? (
          <EndLink way={track.previous} primary={false} />
        ) : (
          <span aria-hidden className="hidden sm:block" />
        )}
        <EndLink way={track.next} primary />
      </div>
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
