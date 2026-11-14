import { Link, useLocation } from '@tanstack/react-router'
import {
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  CornerLeftUp,
  ListOrdered,
  type LucideIcon,
} from 'lucide-react'
import {
  useEffect,
  useEffectEvent,
  useMemo,
  useReducer,
  useState,
  type ReactElement,
  type ReactNode,
} from 'react'
import { useTranslation } from 'react-i18next'
import type { Lesson, LessonAnswer } from '@/entities/lesson'
import { useMidiKeyDown } from '@/features/connect-midi'
import { PinnedKeyboard } from '@/features/live-keyboard'
import { localText, useLocale } from '@/shared/i18n'
import { selectLessonReading, useSettings } from '@/entities/settings'
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
import { LessonBlock, StyledBlock } from './LessonBlock'
import { SectionHeading, Takeaway } from './SectionParts'
import { QuestionBlock } from './QuestionBlock'
import { useReadingSection } from './use-reading-section'
import {
  ButtonLink,
  FloatingActions,
  FloatingBar,
  FloatingBarButton,
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

/** Where a lesson leads up to, a router `Link`: what it is part of, by name. */
export interface UpLink {
  readonly link: ReactElement
  /** Where it goes: The course, Back to the journey. */
  readonly label: string
  /** What it is part of, by name. */
  readonly title: string
}

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
            className="flex min-h-11 items-center gap-2.5 rounded-[10px] px-2 text-[0.9375rem] transition-colors hover:bg-muted data-reading:bg-muted data-reading:font-semibold"
          >
            <span
              aria-hidden
              className="flex size-6 shrink-0 items-center justify-center rounded-full bg-muted text-[0.8125rem] font-bold tabular-nums in-data-reading:bg-card"
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

/** What the lesson is part of, as the contents' last row: its picture, where it goes, by name. */
function UpRow({ up, onGo }: { up: UpLink; onGo: () => void }) {
  return (
    <ButtonLink
      variant="ghost"
      onClick={onGo}
      className="h-auto min-h-12 justify-start gap-3 rounded-control px-2 py-2 text-left whitespace-normal"
      render={up.link}
    >
      <CornerLeftUp aria-hidden className="size-5 shrink-0 text-muted-foreground" />
      <span className="flex min-w-0 flex-col">
        <span className="text-xs font-medium text-muted-foreground">{up.label}</span>
        <span className="font-semibold text-pretty">{up.title}</span>
      </span>
    </ButtonLink>
  )
}

/** The way on past a lesson's last section: the next lesson, or what it is part of; going on learns it. */
export interface Onward {
  readonly link: ReactElement
  readonly onGo: () => void
}

/** The bar's controls: 52px circles, the canvas's SECBAR. */
const CIRCLE = 'size-13 shrink-0 rounded-pill [&_svg]:size-6'

/**
 * The lesson's bar, the canvas's SECBAR, floating in the thumb's reach on a phone or a tablet: ‹ the
 * section before; "In this lesson, Section n of N", opening the contents and what the lesson is part
 * of; and the honey › to the next, Done on the last, which goes on. A jump between sections replaces
 * the page's entry, as a contents link does: Back still leaves the lesson. On a phone on its side
 * it stands upright at the side, its arrows up and down and the contents an icon.
 */
function LessonBar({
  lesson,
  at,
  up,
  onward,
}: {
  lesson: Lesson
  /** The section being read, by its place. */
  at: number
  up: UpLink
  onward: Onward
}) {
  const { t } = useTranslation('learn')
  const [open, setOpen] = useState(false)
  const of = lesson.sections.length
  // Its arrows point the way the bar reads: along it at the foot, up and down standing at the side
  // of a phone on its side.
  const arrows = (Along: LucideIcon, Aside: LucideIcon) => (
    <>
      <Along aria-hidden className="landscape-phone:hidden" />
      <Aside aria-hidden className="hidden landscape-phone:block" />
    </>
  )
  const section = (to: number, label: string, icons: ReactNode) =>
    to >= 0 && to < of ? (
      <FloatingBarButton
        label={label}
        className={CIRCLE}
        render={<Link to="." hash={sectionId(to)} replace />}
      >
        {icons}
      </FloatingBarButton>
    ) : (
      <FloatingBarButton label={label} className={CIRCLE} disabled>
        {icons}
      </FloatingBarButton>
    )
  const contents = (
    <SheetContent title={t('contents')} footer={<UpRow up={up} onGo={() => setOpen(false)} />}>
      <nav aria-label={t('contents')}>
        <SectionLinks lesson={lesson} reading={sectionId(at)} onGo={() => setOpen(false)} />
      </nav>
    </SheetContent>
  )
  return (
    // On a laptop the contents stand beside the lesson (`LessonView`): the bar is the phone's and
    // the tablet's.
    <FloatingBar label={t('lessonBar')} orientation="landscape-phone" className="lg:hidden">
      {section(at - 1, t('previousSection'), arrows(ChevronLeft, ChevronUp))}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger
          render={
            <Button
              variant="ghost"
              aria-label={t('contentsAt', { at: at + 1, of })}
              title={t('contents')}
              className="h-13 min-w-0 flex-1 flex-col gap-0 rounded-pill px-2 leading-tight landscape-phone:size-13 landscape-phone:flex-none"
            />
          }
        >
          <ListOrdered aria-hidden className="hidden size-6 landscape-phone:block" />
          <span className="text-[0.8125rem] font-normal text-muted-foreground landscape-phone:hidden">
            {t('inThisLesson')}
          </span>
          <span className="text-[0.9375rem] font-bold tabular-nums landscape-phone:hidden">
            {t('sectionOf', { at: at + 1, of })}
          </span>
        </SheetTrigger>
        {contents}
      </Sheet>
      {/* The bar's honey circle at its end: on to the next section, Done on the last. */}
      {at + 1 < of ? (
        <ButtonLink
          size="icon"
          aria-label={t('nextSection')}
          title={t('nextSection')}
          className={CIRCLE}
          render={<Link to="." hash={sectionId(at + 1)} replace />}
        >
          {arrows(ChevronRight, ChevronDown)}
        </ButtonLink>
      ) : (
        <ButtonLink
          size="icon"
          aria-label={t('done')}
          title={t('done')}
          className={CIRCLE}
          render={onward.link}
          onClick={onward.onGo}
        >
          <Check aria-hidden />
        </ButtonLink>
      )}
    </FloatingBar>
  )
}

/** The section a page's hash names (`#section-2`), by its place; the first where it names none. */
function sectionAt(hash: string, of: number): number {
  const n = Number(/^section-(\d+)$/.exec(hash)?.[1] ?? 1)
  return Math.min(Math.max(n - 1, 0), of - 1)
}

/**
 * A lesson over the page's keys: they show the example played last, or the open question, whose
 * answer the learner chooses on them. On a laptop or a tablet it reads top to bottom, its bar
 * floating in the thumb's reach with the sections one by one and its contents, with what it is part
 * of (`up`); a jump lands its heading clear of pinned keys by the page's scroll padding
 * (`theme.css`). On a phone it reads a section a page, as a book's pages turn: back, the pages' dots,
 * and Next, Done on the last, which goes on (`onward`). What follows the last section (`end`) closes
 * its last page.
 */
export function LessonView({
  lesson,
  up,
  onward,
  end,
  onRead,
  head,
}: {
  lesson: Lesson
  /** What leads the lesson's column: where it is and its title. */
  head?: ReactNode
  up: UpLink
  onward: Onward
  /** A section read, by its place: its page shown, or scrolled to the reading line. */
  onRead?: (section: number) => void
  /** What follows the lesson's last section, told whether the lesson reads a page at a time. */
  end?: (paged: boolean) => ReactNode
}) {
  const play = usePlay()
  // One page of its sections, or a section at a time where the learner chose it (round 26).
  const paged = useSettings(selectLessonReading) === 'sections'
  const hash = useLocation({ select: (location) => location.hash })
  const [shown, setShown] = useState<ShownKeys>(NO_KEYS)
  const scrolled = useReadingSection(paged ? [] : lesson.sections.map((_, s) => sectionId(s)))
  const page = sectionAt(hash, lesson.sections.length)
  const scrolledTo = lesson.sections.findIndex((_, s) => sectionId(s) === scrolled)
  const read = paged ? page : scrolledTo < 0 ? null : scrolledTo
  const at = read ?? 0
  const heard = useEffectEvent((section: number) => onRead?.(section))
  useEffect(() => {
    if (read !== null) heard(read)
  }, [read])
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
  // An example played closes the open question: the keys show the example. A line playing on to
  // its next bar is no new example: the keys follow it without closing the question.
  const show = (next: ShownKeys) => {
    dispatch({ type: 'close' })
    setShown(next)
  }
  const { t } = useTranslation('learn')
  return (
    // On a laptop the contents stand at the lesson's left, in view as it scrolls (the canvas's 260
    // and 704 columns, 72 apart); a phone and a tablet reach them from the bar.
    <div className="flex flex-col gap-10 lg:grid lg:grid-cols-[16.25rem_minmax(0,44rem)] lg:items-start lg:justify-center lg:gap-x-18">
      <nav
        aria-label={t('inThisLesson')}
        className="sticky top-4 hidden flex-col gap-1 lg:flex print:hidden"
      >
        <h2 className="ml-1 font-sans text-[0.8125rem] font-semibold tracking-[0.04em] text-muted-foreground uppercase">
          {t('inThisLesson')}
        </h2>
        <SectionLinks lesson={lesson} reading={read === null ? null : sectionId(read)} />
      </nav>
      <div className="flex min-w-0 flex-col gap-4">
        {head}
        <div className="flex flex-col gap-10">
          <PinnedKeyboard
            shown={keys}
            selected={keys.selected}
            wrong={keys.wrong}
            onKeyPress={choosing && openAnswer ? (key) => choose(key, openAnswer) : undefined}
          />
          <div className="flex flex-col gap-10">
            {lesson.sections.map((section, s) =>
              // A page at a time on a phone: only the page read is drawn.
              paged && s !== page ? null : (
                <section
                  key={section.heading.en}
                  id={sectionId(s)}
                  // Sections apart by a line and room; a section's text and its examples close together.
                  className={cn(
                    'flex max-w-prose flex-col gap-3 text-lg/[1.55]',
                    s > 0 && !paged && 'border-t border-border pt-8',
                  )}
                >
                  <SectionHeading text={section.heading} style={section.style} />
                  {section.blocks.map((block, b) => {
                    const id = `${s}.${b}`
                    if (block.kind !== 'question')
                      return (
                        <LessonBlock key={id} block={block} onShow={show} onFollow={setShown} />
                      )
                    const open = question?.id === id ? question : null
                    const answerKeys = answers.get(id) ?? { ...NO_KEYS, inOrder: false }
                    const asked = (
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
                    return block.style ? (
                      <StyledBlock key={id} style={block.style}>
                        {asked}
                      </StyledBlock>
                    ) : (
                      asked
                    )
                  })}
                  {section.takeaway ? (
                    <Takeaway text={section.takeaway} style={section.takeawayStyle} />
                  ) : null}
                </section>
              ),
            )}
            {end && (!paged || page === lesson.sections.length - 1) ? end(paged) : null}
          </div>
        </div>
      </div>
      <FloatingActions>
        <LessonBar lesson={lesson} at={at} up={up} onward={onward} />
      </FloatingActions>
    </div>
  )
}
