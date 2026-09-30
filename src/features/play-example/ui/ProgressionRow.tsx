import { createContext, use, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import {
  chordSymbol,
  numeralChord,
  numeralText,
  voiceLead,
  type Chord,
  type Key,
  type Numeral,
  type ChordSize,
} from '@/shared/lib/music'
import { chordSounds, walkSounds } from '@/shared/lib/schedule'
import { usePlayback } from '@/shared/lib/services'
import { ChordButton, PlayLabel } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { unmarked, type ShownKeys } from '../model/shown'

/** How fast the row walks, a chord each two beats. */
const ROW_TEMPO = 84

/** What a progression row's parts share: its chords, which of them plays, and how each plays. */
interface ProgressionPlayback {
  readonly chords: readonly { readonly numeral: Numeral; readonly chord: Chord }[]
  readonly playing: number | 'row' | null
  playChord(place: number): void
  playRow(): void
}

const ProgressionContext = createContext<ProgressionPlayback | null>(null)

function useProgression(): ProgressionPlayback {
  const progression = use(ProgressionContext)
  if (!progression)
    throw new Error('A progression’s chords and Play belong inside its ProgressionRow')
  return progression
}

/**
 * A progression in a key as the Progressions tool writes it, voiced smoothly: its parts,
 * `ProgressionChords` and `ProgressionPlay`, play a chord or the whole row and show it on the page's keys.
 */
export function ProgressionRow({
  numerals,
  musicKey,
  size,
  onShow,
  children,
}: {
  numerals: readonly Numeral[]
  musicKey: Key
  size: ChordSize
  onShow: (shown: ShownKeys) => void
  children: ReactNode
}) {
  const playback = usePlayback<number | 'row'>()
  const chords = numerals.map((numeral) => ({
    numeral,
    chord: numeralChord(numeral, musicKey, size),
  }))
  const voiced = voiceLead(chords.map(({ chord }) => chord))
  const progression: ProgressionPlayback = {
    chords,
    playing: playback.playing,
    playChord: (place) => {
      const keys = voiced[place] ?? []
      onShow(unmarked(keys))
      playback.toggle(place, chordSounds(keys, { arpeggio: false }))
    },
    playRow: () => {
      onShow(unmarked(voiced.flat()))
      playback.toggle('row', walkSounds(voiced, { arpeggio: false, tempo: ROW_TEMPO }))
    },
  }
  return (
    <ProgressionContext value={progression}>
      <div className="flex flex-col gap-3">{children}</div>
    </ProgressionContext>
  )
}

/** The progression's chords, each its symbol over its numeral, playing alone. */
export function ProgressionChords() {
  const { t } = useTranslation('learn')
  const { chords, playing, playChord } = useProgression()
  return (
    <ul aria-label={t('progressions.chords')} className="grid grid-cols-4 gap-2">
      {chords.map(({ numeral, chord }, place) => (
        <li key={`${place} ${chordSymbol(chord)}`} className="grid">
          <ChordButton
            symbol={chordSymbol(chord)}
            numeral={numeralText(numeral)}
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
 * soft beside a lesson's other examples.
 */
export function ProgressionPlay({ variant }: { variant: 'default' | 'soft' }) {
  const { t } = useTranslation('learn')
  const { playing, playRow } = useProgression()
  return (
    <Button variant={variant} size="pill" className="self-start" onClick={playRow}>
      <PlayLabel playing={playing === 'row'}>{t('play')}</PlayLabel>
    </Button>
  )
}
