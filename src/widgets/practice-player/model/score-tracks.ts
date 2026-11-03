import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useStaffNames, useStaffTitle, type StaffName } from '@/entities/piece'
import type { TrackId } from '@/features/practice'
import type { Clef } from '@/shared/lib/music'
import { singleStaff } from '@/shared/lib/notation'

/**
 * A track the Player plays (A35): its id, its name for a reader, a staff's clef, and whether the score
 * draws it (the recording never, a lead sheet's piano not, ADR 0114).
 */
export interface ScoreTrack {
  readonly id: TrackId
  readonly label: string
  readonly clef?: Clef
  readonly drawn: boolean
}

/**
 * The music's tracks top down, as Flat's Audio playback lists them (A35): each single staff by its
 * name (else its place's), the piano's upper and lower staves, and a song's recording.
 */
export function useScoreTracks({
  staves,
  piano,
  recording,
}: {
  /** The single staves over the piano, top down, each its clef. */
  staves: readonly { readonly name?: StaffName; readonly clef: Clef }[]
  /** Whether the score draws the piano's staves: a lead sheet does not (ADR 0114). */
  piano: boolean
  recording: boolean
}): readonly ScoreTrack[] {
  const { t } = useTranslation(['music', 'player'])
  const names = useStaffNames(staves)
  const title = useStaffTitle()
  const clefs = staves.map(({ clef }) => clef).join(' ')
  return useMemo(
    () => [
      ...clefs
        .split(' ')
        .filter(Boolean)
        .map((clef, place) => ({
          id: singleStaff(place),
          label: title(names[place], place),
          clef: clef as Clef,
          drawn: true,
        })),
      { id: 'treble', label: t('music:view.upper'), clef: 'treble', drawn: piano },
      { id: 'bass', label: t('music:view.lower'), clef: 'bass', drawn: piano },
      ...(recording
        ? [{ id: 'recording' as const, label: t('player:sound.recording'), drawn: false }]
        : []),
    ],
    [clefs, names, title, t, piano, recording],
  )
}
