import { useTranslation } from 'react-i18next'
import { printedSymbol } from '@/shared/lib/music'
import type { SectionLessons } from '../model/section-lessons'

/**
 * A section's card, as the Section board draws it: how many times its chords go round, large (`2 ×`),
 * beside the section's name and bars over its chords (one round's where it is a run played round;
 * else its chords in the order they first sound).
 */
export function SectionCard({
  heading,
  lessons: { bars, chords, rounds, sequences },
}: {
  /** The section's name, as the song heads it. */
  heading: string
  lessons: SectionLessons
}) {
  const { t } = useTranslation('piece')
  const [round] = sequences
  const shown = rounds > 1 && round ? round.symbols : chords.map((chord) => chord.symbol)
  return (
    <div className="flex items-center gap-3.5 card px-4 py-3.5">
      {rounds > 1 ? (
        <span className="shrink-0 text-[1.75rem] leading-none font-bold tabular-nums">
          {t('learnSection.rounds', { n: rounds })}
        </span>
      ) : null}
      <span className="flex min-w-0 flex-col">
        <span className="leading-snug font-semibold text-pretty">
          {heading} · {t('barsFromTo', { first: bars.first + 1, last: bars.last + 1 })}
        </span>
        <span className="text-sm leading-snug text-muted-foreground text-pretty">
          {shown.length > 0 ? shown.map(printedSymbol).join(' · ') : t('learnSection.noChords')}
        </span>
      </span>
    </div>
  )
}
