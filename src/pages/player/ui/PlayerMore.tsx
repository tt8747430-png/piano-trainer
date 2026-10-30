import { Download, Ellipsis, Printer } from 'lucide-react'
import { use, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useStaffTitle } from '@/entities/piece'
import type { Recording } from '@/shared/lib/schedule'
import { ActionMenu, type MenuAction } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import {
  ExportSheet,
  exportMidi,
  type ExportFiles,
  type ExportShare,
  type PlayedMusic,
} from '@/features/song-files'
import { MoreActions } from './more-actions'

/**
 * The bar's More (ADR 0108), after the Setup, in the song page's More's look: a piece's place in the
 * library (`MoreActions`, ADR 0106: Add to favourites, Move to…, Archive), the music's own
 * (`actions`: a piece's Song information and Sections, ADR 0107), Print (the music as the
 * View shows it, ADR 0107) and Export…, the sheet every screen exports from: a piece's MusicXML (its
 * music as written) and the MIDI of the music as the Player plays it now, at the tempo chosen, saved
 * under its title and tempo, each part's track named as the screen names it; where a recording plays
 * along, at a fixed tempo or time aligned to the recording (ADR 0107). A walk, a progression, a
 * chromatic walk or an exercise exports its MIDI alone.
 */
export function PlayerMore({
  music,
  recording,
  staves,
  actions = [],
  musicXml,
  share,
  onPrint,
}: {
  music: Omit<PlayedMusic, 'names' | 'lead'>
  /** The piece's recording: its MIDI may be time aligned to it. */
  recording?: Recording | undefined
  /** Each single staff's own name, top down; none where a staff has none. */
  staves: readonly (string | undefined)[]
  actions?: readonly MenuAction[] | undefined
  /** Export to MusicXML: a piece's music as written; none for a walk or an exercise. */
  musicXml?: (() => void) | undefined
  /** Export…'s link, where the screen shares. */
  share?: ExportShare | undefined
  onPrint: () => void
}) {
  const { t } = useTranslation(['player', 'common', 'songs'])
  const library = use(MoreActions)
  const staffTitle = useStaffTitle()
  const names = {
    staff: (place: number) => staffTitle(staves[place], place),
    rh: t('common:hands.rh'),
    lh: t('common:hands.lh'),
  }
  const [exporting, setExporting] = useState(false)
  const files: ExportFiles = {
    musicXml,
    share,
    midi: () => exportMidi({ ...music, names }),
    // The notes at the recording's own tempo, from where its bar 1 begins.
    midiAligned: recording
      ? () => exportMidi({ ...music, tempo: recording.tempo, lead: recording.start, names })
      : undefined,
  }
  return (
    <>
      <ActionMenu
        label={t('player:more')}
        align="end"
        trigger={<Ellipsis aria-hidden />}
        render={
          <Button
            variant="tool"
            size="icon"
            aria-label={t('player:more')}
            title={t('player:more')}
          />
        }
        actions={[
          ...library,
          ...actions,
          { key: 'print', label: t('player:print'), icon: Printer, onSelect: onPrint },
          {
            key: 'export',
            label: t('songs:export.action'),
            icon: Download,
            onSelect: () => setExporting(true),
          },
        ]}
      />
      <ExportSheet
        subject={exporting ? music.title : null}
        files={files}
        onOpenChange={setExporting}
      />
    </>
  )
}
