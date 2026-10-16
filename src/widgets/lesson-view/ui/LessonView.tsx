import { Link } from '@tanstack/react-router'
import { ChevronLeft, ChevronRight, ListOrdered } from 'lucide-react'
import { useMemo, useReducer, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import type { Lesson, LessonAnswer } from '@/entities/lesson'
import { useMidiKeyDown } from '@/features/connect-midi'
import { PinnedKeyboard } from '@/features/live-keyboard'
import { localText, useLocale } from '@/shared/i18n'
import { cn } from '@/shared/lib'
import type { Midi } from '@/shared/lib/music'
import { usePlay } from '@/shared/lib/services'
import {
  answerSounds,
  chosenOf,
  questionAnswers,
  questionKeys,
  questionReducer,
  type QuestionKeys,
} from '../model/lesson-question'
import { LessonBlock } from './LessonBlock'
import { QuestionBlock } from './QuestionBlock'
import { usePinnedHeight } from './use-pinned-height'
import { useReadingSection } from './use-reading-section'
import {
  ButtonLink,
  FloatingActions,
  NO_KEYS,
  Sheet,
  SheetContent,
  SheetTrigger,
  type ShownKeys,
} from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'

/** Where a lesson's section is, for a link to it: `section-1` for the first. */
const sectionId = (index: number) => `section-${index + 1}`

/** Each question of a lesson by its place, `section.block`, with its answer as the lesson says it. */
const lessonAnswers = (lesson: Lesson): ReadonlyMap<string, LessonAnswer> =>
  new Map(
    lesson.sections.flatMap((section, s) =>
      section.blocks.flatMap((block, b) =>
        block.kind === 'question' ? [[`${s}.${b}`, block.answer] as const] : [],
      ),
    ),
  )

/** A lesson lists its sections once it has more than two. */
const CONTENTS_FROM = 3

/** A lesson's sections, each a link to its heading, the one being read in bold. */
function SectionLinks({
  lesson,
  reading,
  onGo,
}: {
  lesson: Lesson
  reading: string | null
  /** A link followed: the sheet it is in closes. */
  onGo?: () => void
}) {
  const locale = useLocale()
  return (
    <ol className="flex flex-col gap-1">
      {lesson.sections.map((section, s) => (
        <li key={section.heading.en} className="flex gap-3">
          <span aria-hidden className="w-5 shrink-0 text-right text-muted-foreground tabular-nums">
            {s + 1}
          </span>
          <Link
            to="."
            hash={sectionId(s)}
            replace
            // Every link is to this page: only the one its hash names is where it is.
            activeOptions={{ includeHash: true }}
            data-reading={reading === sectionId(s) || undefined}
            onClick={onGo}
            className="rounded-sm underline-offset-4 hover:underline data-reading:font-semibold"
          >
            {localText(section.heading, locale)}
          </Link>
        </li>
      ))}
    </ol>
  )
}

/**
 * The lesson's sections one by one, floating in the thumb's reach: ‹ the section before, which one is
 * being read of how many, › the next. On a phone the count opens the contents in a sheet, one link
 * followed closing it; a laptop keeps the contents beside the lesson, so there it is a count alone.
 */
function SectionStepper({ lesson, reading }: { lesson: Lesson; reading: string | null }) {
  const { t } = useTranslation('learn')
  const [open, setOpen] = useState(false)
  const at = Math.max(
    lesson.sections.findIndex((_, s) => sectionId(s) === reading),
    0,
  )
  const of = lesson.sections.length
  const count = `${at + 1} / ${of}`
  // A jump replaces the page's entry, as a contents link does: Back still leaves the lesson.
  const step = (to: number, label: string, Icon: typeof ChevronLeft) =>
    to >= 0 && to < of ? (
      <ButtonLink
        variant="ghost"
        size="icon"
        aria-label={label}
        title={label}
        className="rounded-full"
        render={<Link to="." hash={sectionId(to)} replace />}
      >
        <Icon aria-hidden />
      </ButtonLink>
    ) : (
      <Button variant="ghost" size="icon" aria-label={label} disabled className="rounded-full">
        <Icon aria-hidden />
      </Button>
    )
  return (
    <div
      role="group"
      aria-label={t('contentsAt', { at: at + 1, of })}
      className="flex items-center rounded-full border border-input bg-card p-0.5 shadow-md shadow-foreground/10"
    >
      {step(at - 1, t('previousSection'), ChevronLeft)}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger
          render={
            <Button
              variant="ghost"
              aria-label={t('contentsAt', { at: at + 1, of })}
              className="rounded-full px-3 lg:hidden"
            />
          }
        >
          <ListOrdered aria-hidden />
          <span aria-hidden className="tabular-nums">
            {count}
          </span>
        </SheetTrigger>
        <SheetContent title={t('contents')}>
          <nav aria-label={t('contents')} className="text-lg">
            <SectionLinks lesson={lesson} reading={reading} onGo={() => setOpen(false)} />
          </nav>
        </SheetContent>
      </Sheet>
      <span aria-hidden className="hidden px-2 font-semibold tabular-nums lg:inline">
        {count}
      </span>
      {step(at + 1, t('nextSection'), ChevronRight)}
    </div>
  )
}

/**
 * A lesson read top to bottom under a pinned keyboard: it shows the example played last, or the open
 * question, whose answer the learner chooses on it. Its sections are listed beside it on a laptop and
 * in a sheet on a phone, each a link to its heading, which the page's scroll padding lands clear of
 * the pinned keys (`theme.css`); floating in the thumb's reach, the sections go one by one, under the
 * lesson's own `options`. A jump replaces the page's entry, so Back still leaves the lesson.
 */
export function LessonView({
  lesson,
  options,
}: {
  lesson: Lesson
  /** The lesson's options floating over its sections' stepper (a `SpeedDial`). */
  options?: ReactNode
}) {
  const { t } = useTranslation('learn')
  const locale = useLocale()
  const play = usePlay()
  const [shown, setShown] = useState<ShownKeys>(NO_KEYS)
  const root = useRef<HTMLDivElement>(null)
  const pinned = usePinnedHeight(root)
  const reading = useReadingSection(lesson.sections.map((_, s) => sectionId(s)))
  const [question, dispatch] = useReducer(questionReducer, null)
  const answers = useMemo(() => questionAnswers(lesson), [lesson])
  const saidAnswers = useMemo(() => lessonAnswers(lesson), [lesson])
  const answer = question ? answers.get(question.id) : undefined
  const keys: QuestionKeys = question && answer ? questionKeys(question, answer) : shown
  const choosing = question !== null && question.stage !== 'answer'
  // A key chosen for the open question; the answer heard once it is right.
  const choose = (key: Midi, said: LessonAnswer) => {
    if (!question || !answer) return
    const event = { type: 'toggle', key, answer } as const
    const next = questionReducer(question, event)
    dispatch(event)
    if (next?.stage === 'right') play(answerSounds(said, next.chosen))
  }
  const openAnswer = question ? saidAnswers.get(question.id) : undefined
  // The open question is answered on the MIDI keyboard as on the screen's keys.
  useMidiKeyDown((key) => {
    if (choosing && openAnswer) choose(key, openAnswer)
  })
  // An example played closes the open question: the keys show the example.
  const show = (next: ShownKeys) => {
    dispatch({ type: 'close' })
    setShown(next)
  }
  return (
    <div ref={root} className="flex flex-col gap-10">
      <PinnedKeyboard
        shown={keys}
        selected={keys.selected}
        wrong={keys.wrong}
        onKeyPress={choosing && openAnswer ? (key) => choose(key, openAnswer) : undefined}
      />
      <div className="flex flex-col gap-10 lg:grid lg:grid-cols-[minmax(0,65ch)_minmax(0,1fr)] lg:gap-x-16">
        {lesson.sections.length >= CONTENTS_FROM ? (
          <nav
            aria-label={t('contents')}
            // On a laptop the contents keep to the column beside the lesson, under the pinned keys; on
            // a phone they are a sheet off the floating button.
            style={{ '--pinned': `${pinned}px` } as CSSProperties}
            className="hidden max-w-prose print:hidden lg:sticky lg:top-[calc(var(--screen-bar)+var(--pinned)+--spacing(6))] lg:col-start-2 lg:row-start-1 lg:block lg:self-start"
          >
            {/* The nav says its name to a screen reader: the caption is for the eye. */}
            <p aria-hidden className="mb-2 text-sm font-semibold text-muted-foreground">
              {t('contents')}
            </p>
            <SectionLinks lesson={lesson} reading={reading} />
          </nav>
        ) : null}
        <div className="flex flex-col gap-10 lg:col-start-1 lg:row-start-1">
          {lesson.sections.map((section, s) => (
            <section
              key={section.heading.en}
              id={sectionId(s)}
              // Sections apart by a line and room; a section's text and its examples close together.
              className={cn(
                'flex max-w-prose flex-col gap-4 text-lg leading-relaxed',
                s > 0 && 'border-t border-border pt-8',
              )}
            >
              <h2 className="text-2xl text-balance">{localText(section.heading, locale)}</h2>
              {section.blocks.map((block, b) => {
                const id = `${s}.${b}`
                if (block.kind !== 'question')
                  return <LessonBlock key={id} block={block} onShow={show} />
                const open = question?.id === id ? question : null
                const answerKeys = answers.get(id) ?? { ...NO_KEYS, rising: false }
                return (
                  <QuestionBlock
                    key={id}
                    ask={block.ask}
                    stage={open ? open.stage : 'closed'}
                    count={chosenOf(open?.chosen ?? [], answerKeys)}
                    onOpen={() => dispatch({ type: 'open', id })}
                    onReveal={() => {
                      dispatch({ type: 'reveal' })
                      play(answerSounds(block.answer, answerKeys.keys))
                    }}
                    onRetry={() => dispatch({ type: 'retry' })}
                  />
                )
              })}
            </section>
          ))}
        </div>
      </div>
      <FloatingActions>
        {options}
        {lesson.sections.length >= CONTENTS_FROM ? (
          <SectionStepper lesson={lesson} reading={reading} />
        ) : null}
      </FloatingActions>
    </div>
  )
}
