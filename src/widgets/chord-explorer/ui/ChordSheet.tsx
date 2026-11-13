import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import type { ChordFingers, PlacedChord } from '@/shared/lib/music'
import { notate } from '@/shared/lib/notation'
import { chordBar } from '@/shared/lib/schedule'
import { LazyScoreView } from '@/shared/ui'

/**
 * The chord written as the keys place it, its name over it and each note's finger (the canvas's
 * staff card); its place kept while the staff loads.
 */
export function ChordSheet({
  placed,
  symbol,
  fingers,
}: {
  placed: PlacedChord
  symbol: string
  fingers: ChordFingers
}) {
  const { t } = useTranslation('music')
  const score = useMemo(
    () => notate(chordBar(placed, { symbol, fingers })),
    [placed, symbol, fingers],
  )
  return (
    <section
      aria-label={t('sheet.label')}
      data-chord-sheet
      className="flex w-full min-w-40 justify-center"
    >
      <LazyScoreView score={score} fingers chordSymbols />
    </section>
  )
}
