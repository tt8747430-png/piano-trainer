import { useTranslation } from 'react-i18next'
import type { Question } from '@/features/trainer'
import { noteName, pitchClass, type Midi } from '@/shared/lib/music'
import { cn } from '@/shared/lib'

const NUMERALS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'] as const

/**
 * The degrees of a key as seven slots, I to VII, each filled with its note as it is played: the
 * wrong one marked; once answered, every degree named.
 */
export function DegreeSlots({
  question,
  played,
  answered,
}: {
  question: Extract<Question, { mode: 'key-degrees' }>
  played: readonly Midi[]
  answered: boolean
}) {
  const { t } = useTranslation(['quiz', 'common'])
  return (
    <ol aria-label={t('quiz:degrees')} className="grid grid-cols-7 gap-2">
      {question.notes.map((tone, i) => {
        const key = played[i]
        const wrong = key !== undefined && pitchClass(key) !== tone.pitchClass
        const shown = key !== undefined || answered
        return (
          <li
            key={NUMERALS[i]}
            className={cn(
              'flex min-h-14 flex-col items-center justify-center rounded-lg border border-input',
              wrong ? 'border-destructive text-destructive' : shown ? 'bg-muted' : undefined,
            )}
          >
            <span className="text-xs text-muted-foreground">{NUMERALS[i]}</span>
            <span className="font-display text-lg font-semibold">
              {shown ? noteName(tone.note) : ' '}
            </span>
            {wrong ? <span className="sr-only">{t('common:keyState.wrong')}</span> : null}
          </li>
        )
      })}
    </ol>
  )
}
