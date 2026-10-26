import { Music } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/shared/lib'
import { printedSymbol } from '@/shared/lib/music'
import { PAINT, type Paint } from '@/shared/ui'
import type { SectionLessons } from '../model/section-lessons'
import type { LessonProgress } from '../model/song-progress'
import { LessonsMeter } from './LessonsMeter'

/**
 * A section's card (spec §3.2): its tile in its paint beside the song's title, the section's chords
 * (where it is one run played round, `3 ×` before the run as it goes; else its chords in the order
 * they first sound), and its lessons done.
 */
export function SectionCard({
  title,
  lessons: { chords, rounds, sequences },
  paint,
  progress,
}: {
  /** The song's. */
  title: string
  lessons: SectionLessons
  paint: Paint
  progress: LessonProgress
}) {
  const { t } = useTranslation('piece')
  const [round] = sequences
  const shown = rounds > 1 && round ? round.symbols : chords.map((chord) => chord.symbol)
  return (
    <div className="flex items-start gap-4 card p-5">
      <span
        aria-hidden
        className={cn(
          'grid size-14 shrink-0 place-items-center rounded-2xl',
          PAINT[paint].fill,
          PAINT[paint].ink,
        )}
      >
        <Music className="size-7" strokeWidth={1.5} />
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <p className="text-muted-foreground">{title}</p>
        {chords.length > 0 ? (
          <p className="font-display text-2xl font-semibold text-pretty">
            {rounds > 1 ? (
              <span className="text-muted-foreground tabular-nums">
                {t('learnSection.rounds', { n: rounds })}{' '}
              </span>
            ) : null}
            {shown.map(printedSymbol).join(' · ')}
          </p>
        ) : (
          <p className="text-lg text-muted-foreground">{t('learnSection.noChords')}</p>
        )}
        {progress.total > 0 ? <LessonsMeter progress={progress} className="mt-1" /> : null}
      </div>
    </div>
  )
}
