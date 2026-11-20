import { Play } from 'lucide-react'
import { useId } from 'react'
import { useTranslation } from 'react-i18next'
import { PieceLink, pieceById } from '@/entities/piece'
import { selectLearned, useProgress } from '@/entities/progress'
import { StepLink } from '@/entities/step'
import { localText, useLocale } from '@/shared/i18n'
import { LessonIcon, ProgressBar } from '@/shared/ui'
import {
  continuePlace,
  continueStep,
  courseProgress,
  journeyProgress,
  reviewStep,
  useStepTitle,
} from '@/widgets/curriculum'

/**
 * What to do next (ADR 0053), Learn's first card, the canvas's CONT: Continue and the level or course
 * it is on, the lesson it opens in the serif, which lesson of how many, the level's progress as a 6
 * track (`CONTBAR`, the same on both sizes), and a 56 round ink button with the lesson's book: Continue
 * is never honey, so the floating + stays the screen's one honey act. On a laptop (`CONTL`) the card is
 * one row: the words, then the track filling the room to the button with "Lesson 7 of 13" over its
 * right end (goal-gradient). Its next guided song opens on its page. The eyebrow's verb is the
 * board's: Start on a track with nothing learned, Continue on one begun, and Review once everything
 * is learned, opening the first journey's first lesson.
 */
export function ContinueAction() {
  const { t } = useTranslation('learn')
  const locale = useLocale()
  const id = useId()
  const learned = useProgress(selectLearned)
  const stepTitle = useStepTitle()
  const open = continueStep(learned)
  const next = open ?? reviewStep()
  if (!next) return null
  const { step } = next
  const read = step.kind === 'lesson' || step.kind === 'course-lesson'
  const Icon = read ? LessonIcon : Play
  const title = stepTitle(step).primary
  const track = 'course' in next ? next.course : next.journey
  const place = continuePlace(next, learned)
  const progress =
    'course' in next ? courseProgress(next.course, learned) : journeyProgress(next.journey, learned)
  const verb = !open ? 'reviewTrack' : progress.done === 0 ? 'startTrack' : 'continue'
  const count =
    'n' in place
      ? t('lessonOf', { n: place.n, count: place.count })
      : t('progress', { learned: place.done, total: place.total })
  const bar = (
    <ProgressBar
      done={progress.done}
      total={progress.total}
      label={t('continueProgress')}
      className="flex-none"
    />
  )
  const face = (
    <>
      <span className="flex min-w-0 flex-1 flex-col gap-1 lg:flex-none">
        <span className="text-[0.8125rem]/4 font-semibold text-eyebrow">
          {t(verb)} · {localText(track.title, locale)}
        </span>
        <h2 id={id} className="font-display text-2xl/[1.2] font-normal text-balance">
          {title}
        </h2>
        <span className="flex flex-col gap-2.5 lg:hidden">
          <span className="text-[0.8125rem]/4 text-muted-foreground tabular-nums">{count}</span>
          {bar}
        </span>
      </span>
      <span className="hidden min-w-40 flex-1 flex-col gap-2 pr-4 pl-8 lg:flex">
        <span className="self-end text-[0.8125rem]/4 text-muted-foreground tabular-nums">
          {count}
        </span>
        {bar}
      </span>
      <span
        aria-hidden
        className="grid size-14 shrink-0 place-items-center rounded-pill bg-foreground text-card transition-[filter] duration-200 ease-out group-hover:brightness-125 [&_svg]:size-5.5"
      >
        <Icon className={read ? undefined : 'fill-current'} />
      </span>
    </>
  )
  const className =
    'group flex items-center gap-4 card p-4 transition-colors duration-200 ease-out hover:ring-input'
  return (
    <section aria-labelledby={id}>
      {step.kind === 'piece' ? (
        <PieceLink
          entry={pieceById(step.pieceId) ?? { id: step.pieceId, kind: 'song' }}
          className={className}
        >
          {face}
        </PieceLink>
      ) : (
        <StepLink step={step} className={className}>
          {face}
        </StepLink>
      )}
    </section>
  )
}
