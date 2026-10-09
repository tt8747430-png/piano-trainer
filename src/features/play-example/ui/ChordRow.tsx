import { createContext, use, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { chordSymbol, voiceLead } from '@/shared/lib/music'
import { chordSounds, walkSounds } from '@/shared/lib/schedule'
import { usePlayback } from '@/shared/lib/services'
import { ChordButton, PlayLabel, type ShownKeys, unmarked, usePlayKey } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import type { RowChord } from '../model/chord-row'

/** How fast a row walks, a chord each two beats. */
const ROW_TEMPO = 84

/** What a row's parts share: its chords, which of them plays, and how each plays. */
interface RowPlayback {
  readonly chords: readonly RowChord[]
  readonly playing: number | 'row' | null
  playChord(place: number): void
  playRow(): void
}

const RowContext = createContext<RowPlayback | null>(null)

function useRow(): RowPlayback {
  const row = use(RowContext)
  if (!row) throw new Error('A row’s chords and Play belong inside its ChordRow')
  return row
}

/**
 * A row of chords voiced smoothly (a progression, a way between two chords): its parts, `RowChords`
 * and `RowPlay`, play a chord as the row voices it or the whole row, and show it on the page's keys.
 */
export function ChordRow({
  chords,
  onShow,
  children,
}: {
  chords: readonly RowChord[]
  onShow: (shown: ShownKeys) => void
  children: ReactNode
}) {
  const playback = usePlayback<number | 'row'>()
  const voiced = voiceLead(chords.map(({ chord }) => chord))
  const row: RowPlayback = {
    chords,
    playing: playback.playing,
    playChord: (place) => {
      const keys = voiced[place] ?? []
      onShow(unmarked(keys))
      playback.toggle(place, () => chordSounds(keys, { arpeggio: false }))
    },
    playRow: () => {
      onShow(unmarked(voiced.flat()))
      playback.toggle('row', () => walkSounds(voiced, { arpeggio: false, tempo: ROW_TEMPO }))
    },
  }
  return (
    <RowContext value={row}>
      <div className="flex flex-col gap-3">{children}</div>
    </RowContext>
  )
}

/** The row's chords, each its symbol over its caption, playing alone. */
export function RowChords() {
  const { t } = useTranslation('learn')
  const { chords, playing, playChord } = useRow()
  return (
    <ul aria-label={t('progressions.chords')} className="grid grid-cols-4 gap-2">
      {chords.map(({ chord, caption }, place) => (
        <li key={`${place} ${chordSymbol(chord)}`} className="grid">
          <ChordButton
            symbol={chordSymbol(chord)}
            numeral={caption}
            playing={playing === place}
            onClick={() => playChord(place)}
          />
        </li>
      ))}
    </ul>
  )
}

/**
 * Play for the whole row, turning into Stop: honey where it is the screen's one action (the tool),
 * which Enter plays too; soft beside other examples.
 */
export function RowPlay({ variant }: { variant: 'default' | 'soft' }) {
  const { t } = useTranslation('learn')
  const { playing, playRow } = useRow()
  usePlayKey(playRow, variant === 'default')
  return (
    <Button variant={variant} size="pill" className="self-start" onClick={playRow}>
      <PlayLabel playing={playing === 'row'}>{t('play')}</PlayLabel>
    </Button>
  )
}
