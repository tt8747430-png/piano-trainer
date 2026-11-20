import { Link } from '@tanstack/react-router'
import { ChevronRight, CornerLeftUp } from 'lucide-react'
import {
  useEffect,
  useEffectEvent,
  useMemo,
  useState,
  type ReactElement,
  type ReactNode,
} from 'react'
import { useTranslation } from 'react-i18next'
import type { Lesson } from '@/entities/lesson'
import { localText, useLocale } from '@/shared/i18n'
import { questionAnswers } from '../model/lesson-question'
import { LessonBlock, StyledBlock } from './LessonBlock'
import { SectionHeading, Takeaway } from './SectionParts'
import { QuestionBlock } from './QuestionBlock'
import { useReadingSection } from './use-reading-section'
import {
  ButtonLink,
  FloatingActions,
  FloatingBar,
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'

/** Where a lesson's section is, for a link to it: `section-1` for the first. */
const sectionId = (index: number) => `section-${index + 1}`

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

/** The way on, in the lesson's foot: the next lesson, or what it is part of; going on learns it. */
export interface Onward {
  readonly link: ReactElement
  /** What it says: Next lesson, or Back to the course past the last. */
  readonly label: string
  readonly onGo: () => void
}

/**
 * The lesson's foot (the canvas's SECBAR), its glass bar in the thumb's reach on a phone and centred
 * on the lesson's column on a laptop: where the learner is, "Section n of N" over the section's name,
 * opening the contents and what the lesson is part of; then the honey Next lesson, which goes on and
 * marks the lesson learned (`onward`). No Previous and Next at the lesson's end: the head's After:
 * link is the way back.
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
  const locale = useLocale()
  const [open, setOpen] = useState(false)
  const of = lesson.sections.length
  const name = lesson.sections[at] ? localText(lesson.sections[at].heading, locale) : ''
  return (
    <FloatingBar label={t('lessonBar')} className="lg:max-w-130">
      <Sheet at={{ side: 'top', width: 'w-130' }} open={open} onOpenChange={setOpen}>
        <SheetTrigger
          render={
            <Button
              variant="ghost"
              aria-label={t('contentsAt', { at: at + 1, of })}
              title={t('contents')}
              className="h-12.5 min-w-0 flex-1 flex-col items-start gap-0 px-3 leading-tight"
            />
          }
        >
          <span className="text-[0.8125rem] font-normal text-muted-foreground">
            {t('sectionOf', { at: at + 1, of })}
          </span>
          <span className="max-w-full truncate text-[0.9375rem] font-bold">{name}</span>
        </SheetTrigger>
        <SheetContent title={t('contents')} footer={<UpRow up={up} onGo={() => setOpen(false)} />}>
          <nav aria-label={t('contents')}>
            <SectionLinks lesson={lesson} reading={sectionId(at)} onGo={() => setOpen(false)} />
          </nav>
        </SheetContent>
      </Sheet>
      <ButtonLink
        size="lg"
        className="shrink-0 gap-1 ps-5 pe-4"
        render={onward.link}
        onClick={onward.onGo}
      >
        {onward.label}
        <ChevronRight aria-hidden className="size-5" />
      </ButtonLink>
    </FloatingBar>
  )
}

/**
 * A lesson, each example and question on its own keys (the Lesson boards). It reads in one column, 760 at most and centred on a laptop
 * (Obsidian's readable line), its head 32 above its sections and the sections 32 apart; its foot's
 * bar shares the column's centre (`LessonBar`). The section being read takes the MIDI keyboard's
 * keys for its question.
 */
export function LessonView({
  lesson,
  up,
  onward,
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
}) {
  const scrolled = useReadingSection(lesson.sections.map((_, s) => sectionId(s)))
  const scrolledTo = lesson.sections.findIndex((_, s) => sectionId(s) === scrolled)
  const read = scrolledTo < 0 ? null : scrolledTo
  const at = read ?? 0
  const heard = useEffectEvent((section: number) => onRead?.(section))
  useEffect(() => {
    if (read !== null) heard(read)
  }, [read])
  const answers = useMemo(() => questionAnswers(lesson), [lesson])
  return (
    <div className="mx-auto flex w-full max-w-190 min-w-0 flex-col gap-8">
      {head}
      {lesson.sections.map((section, s) => (
        <section
          key={section.heading.en}
          id={sectionId(s)}
          // The board's section: its words 17 on 1.55, a line of reading (65ch) at most; its
          // examples the column's width; its parts 12 apart.
          className="flex flex-col gap-3 text-lg/[1.55] *:[p]:max-w-[65ch] *:[p]:text-pretty"
        >
          <SectionHeading text={section.heading} style={section.style} />
          {section.blocks.map((block, b) => {
            const id = `${s}.${b}`
            if (block.kind !== 'question') return <LessonBlock key={id} block={block} />
            const answer = answers.get(id)
            if (!answer) throw new RangeError(`A lesson's question at ${id} has no answer`)
            const asked = (
              <QuestionBlock
                key={id}
                ask={block.ask}
                said={block.answer}
                answer={answer}
                listening={s === at}
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
      ))}
      <FloatingActions className="lg:hidden">
        <LessonBar lesson={lesson} at={at} up={up} onward={onward} />
      </FloatingActions>
      {/* On a laptop the bar floats over the keys centred on the lesson's column, not in the
          floating actions' side column, so the page keeps the whole width and the column its centre. */}
      <div className="pointer-events-none fixed inset-x-0 bottom-docked z-40 mb-8 hidden justify-center pr-floating pl-sidebar group-data-[sidebar=collapsed]/main:pl-sidebar-collapsed group-data-[sidebar=focus]/main:pl-focus lg:flex print:hidden">
        <div className="pointer-events-auto flex w-130">
          <LessonBar lesson={lesson} at={at} up={up} onward={onward} />
        </div>
      </div>
    </div>
  )
}
