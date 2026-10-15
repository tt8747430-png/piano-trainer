import { Link, type LinkProps } from '@tanstack/react-router'
import { ArrowRight, CornerDownLeft } from 'lucide-react'
import type { ReactElement, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import type { Lesson } from '@/entities/lesson'
import type { StepId } from '@/entities/step'
import { LearnedButton, useLearned } from '@/features/mark-learned'
import { localText, useLocale } from '@/shared/i18n'
import { ButtonLink, ScreenHeader } from '@/shared/ui'
import { LessonView } from '@/widgets/lesson-view'

/** Where a lesson's way on leads: the next lesson, or back to what it is part of. */
export interface WayOn {
  /** The link it is: a router `Link`. */
  readonly link: ReactElement
  /** The next lesson's title; none where the way leads back. */
  readonly next?: string
  readonly label: string
}

/**
 * A lesson, a journey's or a course's (ADR 0053): its title, where it is (`place`), its summary, the
 * lesson itself, and at its end Learned beside the one way on, which learns it on the way.
 */
export function LessonLayout({
  lesson,
  step,
  place,
  back,
  way,
}: {
  lesson: Lesson
  step: StepId
  place: ReactNode
  /** The screen's Back (`BackButton`). */
  back: ReactNode
  way: WayOn
}) {
  const { t } = useTranslation('learn')
  const locale = useLocale()
  return (
    <div className="flex flex-col gap-4">
      <ScreenHeader title={localText(lesson.title, locale)} back={back} />
      <nav aria-label={t('placeLabel')} className="-mt-3 text-muted-foreground print:hidden">
        {place}
      </nav>
      <p className="max-w-prose text-lg text-pretty text-muted-foreground">
        {localText(lesson.summary, locale)}
      </p>
      <LessonView key={lesson.id} lesson={lesson} />
      <LessonEnd step={step} way={way} />
    </div>
  )
}

/** A lesson's end: its Learned toggle beside the one way on, which learns it on the way. */
function LessonEnd({ step, way }: { step: StepId; way: WayOn }) {
  const { learn } = useLearned(step)
  return (
    <footer className="mt-6 flex max-w-prose flex-wrap items-center gap-3 border-t border-border pt-8 print:hidden">
      <ButtonLink
        size="pill"
        onClick={learn}
        className="h-auto min-h-14 min-w-0 flex-1 basis-64 justify-between gap-4 py-3 text-left whitespace-normal"
        render={way.link}
      >
        {way.next ? (
          <span className="flex min-w-0 flex-col">
            <span className="text-sm font-medium">{way.label}</span>
            <span className="font-display text-xl text-balance">{way.next}</span>
          </span>
        ) : (
          <span className="font-display text-xl text-balance">{way.label}</span>
        )}
        {way.next ? (
          <ArrowRight aria-hidden className="size-5" />
        ) : (
          <CornerDownLeft aria-hidden className="size-5" />
        )}
      </ButtonLink>
      <LearnedButton step={step} />
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
