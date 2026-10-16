import { Link } from '@tanstack/react-router'
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  CornerLeftUp,
  ListOrdered,
} from 'lucide-react'
import { useMemo, useReducer, useState, type ReactElement, type ReactNode } from 'react'
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

/** A way out of a lesson, a router `Link`: what it is part of, the lesson before it, the way on. */
export interface TrackLink {
  readonly link: ReactElement
  /** What the way is: Previous lesson, Next lesson, Back to the journey. */
  readonly label: string
  /** The lesson or the place it leads to, by name. */
  readonly title?: string
  /** Done on the way: going on learns the lesson. */
  readonly onGo?: () => void
}

/** Where a lesson leads: up to what it is part of, back to the lesson before, on to the next. */
export interface LessonTrack {
  readonly up: TrackLink
  readonly previous?: TrackLink
  readonly next: TrackLink
}

const named = (way: TrackLink) => (way.title ? `${way.label}: ${way.title}` : way.label)

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
    <ol className="flex flex-col">
      {lesson.sections.map((section, s) => (
        <li key={section.heading.en}>
          <Link
            to="."
            hash={sectionId(s)}
            replace
            // Every link is to this page: only the one its hash names is where it is.
            activeOptions={{ includeHash: true }}
            data-reading={reading === sectionId(s) || undefined}
            onClick={onGo}
            className="flex min-h-11 items-center gap-3 rounded-xl px-2 transition-colors hover:bg-muted data-reading:bg-muted data-reading:font-semibold"
          >
            <span
              aria-hidden
              className="w-5 shrink-0 text-right text-muted-foreground tabular-nums"
            >
              {s + 1}
            </span>
            {localText(section.heading, locale)}
          </Link>
        </li>
      ))}
    </ol>
  )
}

/** A way out of the lesson as a row of the contents' sheet: its picture, what it is, where to. */
function TrackRow({
  way,
  icon: Icon,
  onGo,
}: {
  way: TrackLink
  icon: typeof ChevronLeft
  onGo: () => void
}) {
  return (
    <ButtonLink
      variant="ghost"
      onClick={() => {
        way.onGo?.()
        onGo()
      }}
      className="h-auto min-h-12 justify-start gap-3 rounded-xl px-2 py-2 text-left whitespace-normal"
      render={way.link}
    >
      <Icon aria-hidden className="size-5 shrink-0 text-muted-foreground" />
      <span className="flex min-w-0 flex-col">
        <span className="text-xs font-medium text-muted-foreground">{way.label}</span>
        {way.title ? <span className="font-semibold text-pretty">{way.title}</span> : null}
      </span>
    </ButtonLink>
  )
}

const DOCK_BUTTON = 'rounded-full'

/**
 * The lesson's bar, floating in the thumb's reach: ‹ the section before, which one is being read of
 * how many (opening the contents, with the ways out of the lesson), › the next; before the first
 * section ‹ is the lesson before, past the last › is the way on, in honey, which learns the lesson.
 * Then the lesson's own `tools`. A jump between sections replaces the page's entry, as a contents link
 * does: Back still leaves the lesson.
 */
function LessonBar({
  lesson,
  reading,
  track,
  tools,
}: {
  lesson: Lesson
  reading: string | null
  track: LessonTrack
  tools?: ReactNode
}) {
  const { t } = useTranslation('learn')
  const [open, setOpen] = useState(false)
  const of = lesson.sections.length
  const at = Math.max(
    lesson.sections.findIndex((_, s) => sectionId(s) === reading),
    0,
  )
  const section = (to: number, label: string, Icon: typeof ChevronLeft) => (
    <ButtonLink
      variant="ghost"
      size="icon"
      aria-label={label}
      title={label}
      className={DOCK_BUTTON}
      render={<Link to="." hash={sectionId(to)} replace />}
    >
      <Icon aria-hidden />
    </ButtonLink>
  )
  const leave = (way: TrackLink, Icon: typeof ChevronLeft, primary: boolean) => (
    <ButtonLink
      variant={primary ? 'default' : 'ghost'}
      size="icon"
      aria-label={named(way)}
      title={named(way)}
      onClick={way.onGo}
      className={DOCK_BUTTON}
      render={way.link}
    >
      <Icon aria-hidden />
    </ButtonLink>
  )
  const back =
    at > 0 ? (
      section(at - 1, t('previousSection'), ChevronLeft)
    ) : track.previous ? (
      leave(track.previous, ChevronsLeft, false)
    ) : (
      <Button
        variant="ghost"
        size="icon"
        aria-label={t('previousSection')}
        disabled
        className={DOCK_BUTTON}
      >
        <ChevronLeft aria-hidden />
      </Button>
    )
  const on =
    at < of - 1
      ? section(at + 1, t('nextSection'), ChevronRight)
      : leave(track.next, ArrowRight, true)
  return (
    <div
      role="toolbar"
      aria-label={t('lessonBar')}
      className="flex items-center gap-0.5 rounded-full border border-input bg-card p-1 shadow-lg shadow-foreground/15"
    >
      {back}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger
          render={
            <Button
              variant="ghost"
              aria-label={t('contentsAt', { at: at + 1, of })}
              className="rounded-full px-3"
            />
          }
        >
          <ListOrdered aria-hidden />
          <span aria-hidden className="font-semibold tabular-nums">
            {at + 1}/{of}
          </span>
        </SheetTrigger>
        <SheetContent
          title={t('contents')}
          footer={
            <nav aria-label={t('track.label')} className="flex flex-col gap-1">
              {track.previous ? (
                <TrackRow way={track.previous} icon={ChevronsLeft} onGo={() => setOpen(false)} />
              ) : null}
              <TrackRow way={track.next} icon={ArrowRight} onGo={() => setOpen(false)} />
              <TrackRow way={track.up} icon={CornerLeftUp} onGo={() => setOpen(false)} />
            </nav>
          }
        >
          <nav aria-label={t('contents')}>
            <SectionLinks lesson={lesson} reading={reading} onGo={() => setOpen(false)} />
          </nav>
        </SheetContent>
      </Sheet>
      {on}
      {tools ? (
        <>
          <span aria-hidden className="mx-1 h-6 w-px bg-border" />
          {tools}
        </>
      ) : null}
    </div>
  )
}

/**
 * A lesson read top to bottom over the page's keys: they show the example played last, or the open
 * question, whose answer the learner chooses on them. Its bar floats in the thumb's reach: the
 * sections one by one, its contents and the ways out of it (`track`), and its own `tools`. A jump
 * lands its heading clear of pinned keys by the page's scroll padding (`theme.css`).
 */
export function LessonView({
  lesson,
  track,
  tools,
}: {
  lesson: Lesson
  track: LessonTrack
  /** The lesson's own buttons at the end of its bar (the fingers on its scales). */
  tools?: ReactNode
}) {
  const locale = useLocale()
  const play = usePlay()
  const [shown, setShown] = useState<ShownKeys>(NO_KEYS)
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
    <div className="flex flex-col gap-10">
      <PinnedKeyboard
        shown={keys}
        selected={keys.selected}
        wrong={keys.wrong}
        onKeyPress={choosing && openAnswer ? (key) => choose(key, openAnswer) : undefined}
      />
      <div className="flex flex-col gap-10">
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
      <FloatingActions>
        <LessonBar lesson={lesson} reading={reading} track={track} tools={tools} />
      </FloatingActions>
    </div>
  )
}
