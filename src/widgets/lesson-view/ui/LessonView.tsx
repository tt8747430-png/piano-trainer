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
import { cn, LANDSCAPE_PHONE, useMediaQuery } from '@/shared/lib'
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

/** What the lesson is part of, as the contents' last row: its picture, where it goes, by name. */
function UpRow({ up, onGo }: { up: UpLink; onGo: () => void }) {
  return (
    <ButtonLink
      variant="ghost"
      onClick={onGo}
      className="h-auto min-h-12 justify-start gap-3 rounded-xl px-2 py-2 text-left whitespace-normal"
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

/**
 * The lesson's bar, floating in the thumb's reach: ‹ the section before, which one is being read of
 * how many (opening the contents, and what the lesson is part of), › the next. A jump between
 * sections replaces the page's entry, as a contents link does: Back still leaves the lesson. Standing
 * at the side of a wide screen, the bar stands upright, its arrows up and down. Paged (a phone), the
 * count is the pages' dots and › is Next, honey, Done on the last page, which goes on.
 */
function LessonBar({
  lesson,
  at,
  up,
  paged,
  onward,
}: {
  lesson: Lesson
  /** The section being read, by its place. */
  at: number
  up: UpLink
  paged: boolean
  onward: Onward
}) {
  const { t } = useTranslation('learn')
  const [open, setOpen] = useState(false)
  const of = lesson.sections.length
  // Its arrows point the way the bar reads: along it at the foot, up and down standing at the side.
  const arrows = (Along: LucideIcon, Aside: LucideIcon) =>
    paged ? (
      <Along aria-hidden />
    ) : (
      <>
        <Along aria-hidden className="aside:hidden" />
        <Aside aria-hidden className="hidden aside:block" />
      </>
    )
  const section = (to: number, label: string, icons: ReactNode) =>
    to >= 0 && to < of ? (
      <FloatingBarButton label={label} render={<Link to="." hash={sectionId(to)} replace />}>
        {icons}
      </FloatingBarButton>
    ) : (
      <FloatingBarButton label={label} disabled>
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
  if (paged)
    return (
      <FloatingBar label={t('lessonBar')} className="w-[min(24rem,calc(100vw-2rem))] gap-1 pr-1">
        {section(at - 1, t('previousSection'), arrows(ChevronLeft, ChevronUp))}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            render={
              <Button
                variant="ghost"
                aria-label={t('contentsAt', { at: at + 1, of })}
                title={t('contents')}
                className="h-12 min-w-0 flex-1 gap-1.5 rounded-full px-2"
              />
            }
          >
            {/* The pages as dots, the one read a wider capsule. */}
            {lesson.sections.map((each, s) => (
              <span
                key={each.heading.en}
                aria-hidden
                className={cn(
                  'h-2 shrink rounded-full transition-[width,background-color] duration-200 ease-out',
                  s === at ? 'w-5 bg-foreground' : 'w-2 bg-border',
                )}
              />
            ))}
          </SheetTrigger>
          {contents}
        </Sheet>
        {at + 1 < of ? (
          <ButtonLink
            className="h-12 shrink-0 rounded-full px-4"
            render={<Link to="." hash={sectionId(at + 1)} replace />}
          >
            {t('nextPage')}
            <ChevronRight aria-hidden data-icon="inline-end" />
          </ButtonLink>
        ) : (
          <ButtonLink
            className="h-12 shrink-0 rounded-full px-4"
            render={onward.link}
            onClick={onward.onGo}
          >
            {t('done')}
            <Check aria-hidden data-icon="inline-end" />
          </ButtonLink>
        )}
      </FloatingBar>
    )
  return (
    <FloatingBar label={t('lessonBar')} orientation="aside">
      {section(at - 1, t('previousSection'), arrows(ChevronLeft, ChevronUp))}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger
          render={
            <Button
              variant="ghost"
              aria-label={t('contentsAt', { at: at + 1, of })}
              title={t('contents')}
              className="h-12 rounded-full px-3 aside:h-auto aside:w-12 aside:flex-col aside:gap-0.5 aside:px-0 aside:py-2 aside:text-xs"
            />
          }
        >
          <ListOrdered aria-hidden />
          <span aria-hidden className="font-semibold tabular-nums">
            {at + 1}/{of}
          </span>
        </SheetTrigger>
        {contents}
      </Sheet>
      {section(at + 1, t('nextSection'), arrows(ChevronRight, ChevronDown))}
    </FloatingBar>
  )
}

/** Where a lesson reads a page at a time: a phone, held upright or on its side. */
const PAGED = `(max-width: 639.98px), ${LANDSCAPE_PHONE}`

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
}: {
  lesson: Lesson
  up: UpLink
  onward: Onward
  /** A section read, by its place: its page shown, or scrolled to the reading line. */
  onRead?: (section: number) => void
  /** What follows the lesson's last section, told whether the lesson reads a page at a time. */
  end?: (paged: boolean) => ReactNode
}) {
  const { t } = useTranslation('learn')
  const locale = useLocale()
  const play = usePlay()
  const paged = useMediaQuery(PAGED)
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
  return (
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
                'flex max-w-prose flex-col gap-4 text-lg leading-relaxed',
                s > 0 && !paged && 'border-t border-border pt-8',
              )}
            >
              <h2 className="text-2xl text-balance">{localText(section.heading, locale)}</h2>
              {section.blocks.map((block, b) => {
                const id = `${s}.${b}`
                if (block.kind !== 'question')
                  return <LessonBlock key={id} block={block} onShow={show} onFollow={setShown} />
                const open = question?.id === id ? question : null
                const answerKeys = answers.get(id) ?? { ...NO_KEYS, inOrder: false }
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
              {section.takeaway ? (
                <aside
                  aria-label={t('takeaway')}
                  className="flex flex-col gap-1 rounded-3xl bg-paint-lilac p-4"
                >
                  <span aria-hidden className="text-sm font-semibold text-on-paint-lilac">
                    {t('takeaway')}
                  </span>
                  <p className="font-display text-xl font-semibold text-balance">
                    {localText(section.takeaway, locale)}
                  </p>
                </aside>
              ) : null}
            </section>
          ),
        )}
        {end && (!paged || page === lesson.sections.length - 1) ? end(paged) : null}
      </div>
      <FloatingActions>
        <LessonBar lesson={lesson} at={at} up={up} paged={paged} onward={onward} />
      </FloatingActions>
    </div>
  )
}
