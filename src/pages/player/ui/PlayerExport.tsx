import { useStaffTitle } from '@/entities/piece'
import { useTranslation } from 'react-i18next'
import type { Recording } from '@/shared/lib/schedule'
import {
  ExportSheet,
  exportMidi,
  type ExportFiles,
  type MusicXmlFormat,
  type PlayedMusic,
} from '@/features/song-files'

/**
 * Export… from the Player's Settings (ADR 0107): a piece's MusicXML (its music as written) and the
 * MIDI of the music as the Player plays it now, at the tempo chosen, saved under its title and tempo,
 * each part's track named as the screen names it; where a recording plays along, at a fixed tempo or
 * time aligned to the recording. A walk, a progression or an exercise exports its MIDI alone.
 */
export function PlayerExport({
  open,
  onOpenChange,
  music,
  recording,
  staves,
  musicXml,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  music: Omit<PlayedMusic, 'names' | 'lead'>
  /** The piece's recording: its MIDI may be time aligned to it. */
  recording?: Recording | undefined
  /** Each single staff's own name, top down; none where a staff has none. */
  staves: readonly (string | undefined)[]
  /** Export to MusicXML: a piece's music as written; none for a walk or an exercise. */
  musicXml?: ((format?: MusicXmlFormat) => void) | undefined
}) {
  const { t } = useTranslation('common')
  const staffTitle = useStaffTitle()
  const names = {
    staff: (place: number) => staffTitle(staves[place], place),
    rh: t('hands.rh'),
    lh: t('hands.lh'),
  }
  const files: ExportFiles = {
    musicXml,
    midi: () => exportMidi({ ...music, names }),
    // The notes at the recording's own tempo, from where its bar 1 begins.
    midiAligned: recording
      ? () => exportMidi({ ...music, tempo: recording.tempo, lead: recording.start, names })
      : undefined,
  }
  return (
    <ExportSheet subject={open ? music.title : null} files={files} onOpenChange={onOpenChange} />
  )
}
