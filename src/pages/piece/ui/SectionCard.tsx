import { useTranslation } from 'react-i18next'
import { printedSymbol } from '@/shared/lib/music'
import type { SectionLessons } from '../model/section-lessons'

/**
 * A section's head, as the Section board draws it, on the paper (never the page's own subject in a
 * card): how many times its chords go round, large (`2×`), beside the section's name and bars over its chords (one round's where it is a run played round;
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
    <div className="flex items-center gap-4 py-2">
      {rounds > 1 ? (
        <span className="shrink-0 text-[1.75rem] leading-none font-bold tabular-nums">
          {t('learnSection.rounds', { n: rounds })}
        </span>
      ) : null}
      <span className="flex min-w-0 flex-col">
        <span className="leading-5 font-semibold text-pretty">
          {heading} · {t('barsFromTo', { first: bars.first + 1, last: bars.last + 1 })}
        </span>
        <span className="text-sm leading-[1.125rem] text-muted-foreground text-pretty">
          {shown.length > 0 ? shown.map(printedSymbol).join(' · ') : t('learnSection.noChords')}
        </span>
      </span>
    </div>
  )
}
