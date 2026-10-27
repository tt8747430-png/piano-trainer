import { useMemo } from 'react'
import type { Performance } from '@/shared/lib/arrangement'
import { notate, type StaffId } from '@/shared/lib/notation'
import { useStaffLabels } from '@/shared/ui/score'
import { playedMusic } from '../model/played-music'

/**
 * A Performance written as the sheet shows it, on the screen and in print alike: its score with the
 * words unless the view hides them (ADR 0097) and the piano's staves but on a lead sheet (ADR 0114),
 * its tempo marks taken out to be said in the labels' row (ADR 0087), the staves the view keeps (never
 * none, ADR 0097) and their names as printed at the first line's head (ADR 0114).
 */
export function useSheetScore(
  performance: Performance,
  {
    lyrics,
    piano,
    hidden,
  }: { readonly lyrics: boolean; readonly piano: boolean; readonly hidden: readonly StaffId[] },
  staffNames: readonly (string | undefined)[],
) {
  const written = useMemo(
    () => notate(playedMusic(performance, { lyrics, piano })),
    [performance, lyrics, piano],
  )
  const { score, tempos } = useMemo(
    () => ({
      score: { ...written, measures: written.measures.map(({ tempo: _, ...measure }) => measure) },
      tempos: written.measures.map((measure) => measure.tempo),
    }),
    [written],
  )
  const kept = score.staves.filter((staff) => !hidden.includes(staff))
  const staves = kept.length > 0 ? kept : score.staves
  const labels = useStaffLabels(
    staves,
    staffNames.map((text) => (text === undefined ? undefined : { text })),
  )
  return { score, tempos, staves, labels }
}
