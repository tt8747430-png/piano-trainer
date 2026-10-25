import { Link } from '@tanstack/react-router'
import { Check, type LucideIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { PieceId } from '@/entities/piece'
import { selectLessonDone, useProgress } from '@/entities/progress'
import { loopParam } from '@/features/practice'
import { OPEN_PLAINLY } from '@/shared/lib'
import { RowLink, type Paint } from '@/shared/ui'
import type { ChangeLesson, PatternLesson, SequenceLesson } from '../model/section-lessons'

/**
 * A lesson the Player loops, as a row (ADR 0100): its tile in its section's paint, a check on it once
 * done; it opens the Player looping its bars, played the learner's way (their mode, tempo, hands).
 */
export function LessonRow({
  pieceId,
  lesson,
  title,
  detail,
  icon,
  paint,
}: {
  pieceId: PieceId
  lesson: SequenceLesson | ChangeLesson | PatternLesson
  title: string
  detail?: string | undefined
  icon: LucideIcon
  paint: Paint
}) {
  const { t } = useTranslation('piece')
  const done = useProgress(selectLessonDone(lesson.key))
  return (
    <li>
      <RowLink
        title={title}
        detail={detail}
        icon={done ? Check : icon}
        paint={paint}
        // The check says it to the eye alone.
        trailing={done ? <span className="sr-only">{t('learnSection.done')}</span> : undefined}
        render={
          <Link
            to="/play/$pieceId"
            params={{ pieceId }}
            search={{ loop: loopParam(lesson.bars) }}
            state={OPEN_PLAINLY}
          />
        }
      />
    </li>
  )
}
