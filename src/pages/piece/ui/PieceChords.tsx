import { useId, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { usePieceInversions } from '@/features/choose-diagram-inversion'
import { chordSummary } from '@/features/practice'
import type { Performance } from '@/shared/lib/arrangement'
import { ChordSummary } from '@/widgets/chord-diagrams'

/**
 * The song's chords (spec §3.1): its chord summary under its heading, each chord's keys in the
 * inversion chosen for it (ADR 0101) opening its sheet, where it is seen and heard (learned on a
 * section's page). None for music of no chord symbol.
 */
export function PieceChords({ performance }: { performance: Performance }) {
  const { t } = useTranslation('music')
  const id = useId()
  const chosen = usePieceInversions()?.chosen
  const chords = useMemo(() => chordSummary(performance, chosen), [performance, chosen])
  if (chords.length === 0) return null
  return (
    <section aria-labelledby={id} className="flex flex-col gap-3">
      <h2 id={id} className="text-2xl">
        {t('chordSummary')}
      </h2>
      <ChordSummary chords={chords} />
    </section>
  )
}
