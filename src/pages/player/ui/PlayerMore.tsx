import { Ellipsis, FileMusic, Printer } from 'lucide-react'
import { use } from 'react'
import { useTranslation } from 'react-i18next'
import { useStaffTitle } from '@/entities/piece'
import type { Recording } from '@/shared/lib/schedule'
import { ActionMenu, type MenuAction } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { exportMidi, type PlayedMusic } from '../model/export-midi'
import { MoreActions } from './more-actions'

/**
 * The bar's More (ADR 0099), after the Setup, in the song page's More's look: a piece's place in the
 * library (`MoreActions`, ADR 0106: Add to favourites, Move to…, Archive), the music's own
 * (`actions`: a piece's Song information, Sections and Share, ADR 0107), Print (the music as the
 * View shows it, ADR 0107) and Export to MIDI: the music as the Player plays it now, at the tempo
 * chosen, saved under its title and tempo, each part's track named as the screen names it; where a
 * recording plays along, at a fixed tempo or time aligned to the recording (ADR 0107). A walk, a
 * progression, a chromatic walk or an exercise has Print and Export to MIDI alone.
 */
export function PlayerMore({
  music,
  recording,
  staves,
  actions = [],
  onPrint,
}: {
  music: Omit<PlayedMusic, 'names' | 'lead'>
  /** The piece's recording: its MIDI may be time aligned to it. */
  recording?: Recording | undefined
  /** Each single staff's own name, top down; none where a staff has none. */
  staves: readonly (string | undefined)[]
  actions?: readonly MenuAction[] | undefined
  onPrint: () => void
}) {
  const { t } = useTranslation(['player', 'common'])
  const library = use(MoreActions)
  const staffTitle = useStaffTitle()
  const names = {
    staff: (place: number) => staffTitle(staves[place], place),
    rh: t('common:hands.rh'),
    lh: t('common:hands.lh'),
  }
  const midi: readonly MenuAction[] = recording
    ? [
        {
          key: 'midi',
          label: t('player:exportMidiFixed'),
          icon: FileMusic,
          onSelect: () => exportMidi({ ...music, names }),
        },
        {
          key: 'midi-aligned',
          label: t('player:exportMidiAligned'),
          icon: FileMusic,
          // The notes at the recording's own tempo, from where its bar 1 begins.
          onSelect: () =>
            exportMidi({ ...music, tempo: recording.tempo, lead: recording.start, names }),
        },
      ]
    : [
        {
          key: 'midi',
          label: t('player:exportMidi'),
          icon: FileMusic,
          onSelect: () => exportMidi({ ...music, names }),
        },
      ]
  return (
    <ActionMenu
      label={t('player:more')}
      align="end"
      trigger={<Ellipsis aria-hidden />}
      render={
        <Button
          variant="surface"
          size="icon"
          aria-label={t('player:more')}
          title={t('player:more')}
        />
      }
      actions={[
        ...library,
        ...actions,
        { key: 'print', label: t('player:print'), icon: Printer, onSelect: onPrint },
        ...midi,
      ]}
    />
  )
}
