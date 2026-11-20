import { Link, type LinkProps } from '@tanstack/react-router'
import { Settings } from 'lucide-react'
import { type ReactElement, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import type { Lesson } from '@/entities/lesson'
import type { StepId } from '@/entities/step'
import { selectIsLearned, useProgress, useProgressStoreApi } from '@/entities/progress'
import { markLearned, unmarkLearned } from '@/features/mark-learned'
import { recordSectionRead } from '@/features/record-reading'
import { localText, useLocale } from '@/shared/i18n'
import { RoundLink, say, ScreenHeader, type EditAction } from '@/shared/ui'
import { LessonView, type UpLink } from '@/widgets/lesson-view'

/** A lesson either side of this one, or the way on past the last: a router `Link`, named. */
export interface WayLink {
  readonly link: ReactElement
  /** Which way it is: Next lesson, Back to the journey. */
  readonly label: string
  /** The lesson it leads to, by name; none where the way leads back. */
  readonly title?: string
}

/** Where a lesson leads: up to what it is part of, on to the next. */
export interface LessonTrack {
  readonly up: UpLink
  readonly next: WayLink
}

/**
 * A lesson, a journey's or a course's (ADR 0053, 0061; the canvas's Lesson boards): its bar Back, the
 * keys' fold, the gear and Edit where it may be edited (`edit`: an editor's, ADR 0116; the learner's
 * own, R30-5); its head (where it is, `place`, its title, what it teaches, After:) and its sections in
 * one centred column; its foot's bar with Next lesson, which goes on and marks it learned, Undo in
 * the toast. No Learned in the bar, no Tools in a lesson.
 */
export function LessonLayout({
  lesson,
  step,
  place,
  back,
  track,
  edit,
  settings,
  after = [],
}: {
  lesson: Lesson
  step: StepId
  place: ReactNode
  /** The lessons to read before it, each a link by its title. */
  after?: readonly {
    readonly title: string
    /** Its number along the level or course, where it shares this lesson's. */
    readonly n?: number | undefined
    readonly link: LinkProps
  }[]
  /** The screen's Back (`BackButton`). */
  back: ReactNode
  track: LessonTrack
  /** Its Edit: the pencil beside its title, an editor's, or the learner's on their own lesson. */
  edit?: EditAction | undefined
  /** A router `Link` to its Settings page. */
  settings: ReactElement
}) {
  const { t } = useTranslation('learn')
  const locale = useLocale()
  const progress = useProgressStoreApi()
  const learned = useProgress(selectIsLearned(step))
  const summary = localText(lesson.summary, locale)
  const title = localText(lesson.title, locale)
  // Going on learns the lesson, said with Undo; one learned already goes on in silence.
  const goOn = () => {
    if (learned) return
    markLearned(progress, step, new Date())
    say(t('lessonLearned', { title }), {
      label: t('settings.undo'),
      onClick: () => unmarkLearned(progress, step),
    })
  }
  return (
    <div className="flex w-full flex-col gap-2 pb-36 lg:gap-6">
      <ScreenHeader
        title={title}
        back={back}
        settings={<RoundLink label={t('settings.open')} icon={Settings} render={settings} />}
        edit={edit}
        // A document: its title large on the page, as the lesson editor shows it (Edit looks as it
        // reads); the bar keeps it for a screen reader.
        titleOnPage
      />
      <LessonView
        key={lesson.id}
        lesson={lesson}
        up={track.up}
        onward={{ link: track.next.link, label: track.next.label, onGo: goOn }}
        onRead={(section) => recordSectionRead(progress, step, section)}
        head={
          // The canvas's head: where it is (Lesson 7 of 13 · Foundations), its title, what it
          // teaches, and the lessons to read first.
          <div className="flex flex-col gap-2">
            <nav
              aria-label={t('placeLabel')}
              className="text-[0.875rem]/[normal] font-semibold text-eyebrow print:hidden"
            >
              {place}
            </nav>
            <p
              aria-hidden
              className="font-display text-[1.875rem]/[1.15] font-semibold text-balance lg:text-[2.25rem]/[1.15]"
            >
              {title}
            </p>
            {summary ? (
              <p className="text-[1.0625rem]/normal text-pretty text-muted-foreground">{summary}</p>
            ) : null}
            {after.length > 0 ? (
              // The lessons to read first (the board's "After: 6 · …"): each its own 44px link, a row of
              // them wrapping whole, never a title broken over two lines with a gap between.
              <p className="flex flex-wrap items-center gap-x-3 text-[0.875rem] text-muted-foreground print:hidden">
                <span>{t('afterLinks')}</span>
                {after.map(({ title, n, link }) => (
                  <Link
                    key={title}
                    {...link}
                    className="inline-flex min-h-11 items-center font-semibold text-link underline-offset-4 hover:underline"
                  >
                    {n === undefined ? title : `${n} · ${title}`}
                  </Link>
                ))}
              </p>
            ) : null}
          </div>
        }
      />
    </div>
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
      className="relative rounded-control font-semibold text-inherit underline-offset-4 after:absolute after:-inset-x-2 after:-top-1.5 after:-bottom-5 hover:underline"
    >
      {children}
    </Link>
  )
}
