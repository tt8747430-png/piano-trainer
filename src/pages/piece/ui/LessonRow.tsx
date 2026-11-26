import { Link } from '@tanstack/react-router'
import type { PieceId } from '@/entities/piece'
import { selectLessonDone, useProgress } from '@/entities/progress'
import { loopParam } from '@/features/practice'
import { OPEN_PLAINLY } from '@/shared/lib'
import { RowLink } from '@/shared/ui'
import type { ChangeLesson, PatternLesson, SequenceLesson } from '../model/section-lessons'
import { LessonStatus } from './LessonStatus'

/**
 * How the Player opens for each kind of lesson (ADR 0111, Chordify's): a sequence in time in Listen
 * with the click on for the visit; one change in Wait mode; a pattern in Listen with the keys out,
 * each note lit as it sounds. The rest is the learner's way (their tempo, hands, setup).
 */
const OPENS = {
  sequence: { mode: 'listen', click: true },
  change: { mode: 'wait' },
  pattern: { mode: 'listen', keys: true },
} as const

/**
 * A lesson the Player loops, as a row (the Section board): its title, Done at its end once done; it
 * opens the Player looping its bars as its kind says (`OPENS`).
 */
export function LessonRow({
  pieceId,
  lesson,
  title,
}: {
  pieceId: PieceId
  lesson: SequenceLesson | ChangeLesson | PatternLesson
  title: string
}) {
  const done = useProgress(selectLessonDone(lesson.key))
  return (
    <RowLink
      title={title}
      trailing={<LessonStatus done={done} />}
      render={
        <Link
          to="/play/$pieceId"
          params={{ pieceId }}
          search={{ loop: loopParam(lesson.bars), ...OPENS[lesson.kind] }}
          state={OPEN_PLAINLY}
        />
      }
    />
  )
}
