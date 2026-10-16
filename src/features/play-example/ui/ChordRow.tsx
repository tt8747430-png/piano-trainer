import { createContext, use, useMemo, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import {
  chordSymbol,
  handPosition,
  voiceLead,
  type Midi,
  type RowPosition,
} from '@/shared/lib/music'
import { notate } from '@/shared/lib/notation'
import { chordSounds, walkSounds } from '@/shared/lib/schedule'
import { usePlayback } from '@/shared/lib/services'
import {
  ChordButton,
  FitWidth,
  usePositionName,
  FloatingActions,
  PlayFab,
  PlayLabel,
  type ShownKeys,
  unmarked,
  usePlayKey,
} from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import type { RowChord } from '../model/chord-row'
import { chordsMusic } from '../model/chords-music'
import { voicedShown } from '../model/marks'
import { TappableStaff } from './TappableStaff'

/** How fast a row walks, a chord each two beats. */
const ROW_TEMPO = 84

/** What a row's parts share: its chords, which of them plays, and how each plays. */
interface RowPlayback {
  readonly chords: readonly RowChord[]
  /** Each chord's keys as the row voices them, the bass first. */
  readonly voiced: readonly (readonly Midi[])[]
  readonly onShow: (shown: ShownKeys) => void
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
 * A row of chords voiced smoothly (a progression, a way between two chords), from a `position` where
 * one is chosen: its parts, `RowChords`, `RowStaff` and `RowPlay`, play a chord as the row voices it
 * or the whole row, write it on the grand staff, and show it on the page's keys.
 */
export function ChordRow({
  chords,
  position,
  onShow,
  children,
}: {
  chords: readonly RowChord[]
  position?: RowPosition | undefined
  onShow: (shown: ShownKeys) => void
  children: ReactNode
}) {
  const playback = usePlayback<number | 'row'>()
  const inversion = position?.inversion
  const nearest = position?.nearest
  const voiced = useMemo(
    () =>
      voiceLead(
        chords.map(({ chord }) => chord),
        inversion === undefined || nearest === undefined ? undefined : { inversion, nearest },
      ),
    [chords, inversion, nearest],
  )
  const row: RowPlayback = {
    chords,
    voiced,
    onShow,
    playing: playback.playing,
    playChord: (place) => {
      const keys = voiced[place] ?? []
      const chord = chords[place]?.chord
      onShow(chord ? voicedShown(chord, keys) : unmarked(keys))
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

/**
 * The row's chords, each its symbol over its caption, playing alone; with `positions`, each says how
 * the row plays it: its inversion, or the tension a rootless hand starts on; else its own detail.
 */
export function RowChords({ positions = false }: { positions?: boolean }) {
  const { t } = useTranslation('music')
  const { chords, voiced, playing, playChord } = useRow()
  const positionName = usePositionName()
  const positionOf = (chord: RowChord['chord'], place: number): string | undefined => {
    const position = positions ? handPosition(chord, (voiced[place] ?? []).slice(1)) : null
    return position ? positionName(position) : undefined
  }
  return (
    <ul aria-label={t('rowChords')} className="grid grid-cols-4 gap-2">
      {chords.map(({ chord, caption, detail, symbol = chordSymbol(chord) }, place) => (
        <li key={`${place} ${symbol}`} className="grid">
          <ChordButton
            symbol={symbol}
            numeral={caption}
            detail={positionOf(chord, place) ?? detail}
            playing={playing === place}
            onClick={() => playChord(place)}
          />
        </li>
      ))}
    </ul>
  )
}

/** A chord tapped on the row's staff sounds for its bar at this tempo. */
const STAFF_TEMPO = 120

/** Bars on a line of the row's staff: the chords on a line of its buttons over it. */
const BARS_A_LINE = 4

/**
 * The row on the grand staff as its keys play it, a line under each line of its buttons: the bass on
 * the bass staff, the hand on the treble, each chord's symbol over its bar; a chord tapped plays.
 */
export function RowStaff() {
  const { chords, voiced, onShow } = useRow()
  const lines = useMemo(() => {
    const bars = chords.map(({ chord, symbol = chordSymbol(chord) }, place) => ({
      chord,
      symbol,
      keys: voiced[place] ?? [],
    }))
    return Array.from({ length: Math.ceil(bars.length / BARS_A_LINE) }, (_, line) => {
      const music = chordsMusic(bars.slice(line * BARS_A_LINE, (line + 1) * BARS_A_LINE))
      return { music, score: notate(music) }
    })
  }, [chords, voiced])
  return (
    <div className="flex flex-col gap-2">
      {lines.map(({ music, score }, line) => (
        <FitWidth key={line}>
          <TappableStaff
            music={music}
            score={score}
            firstBar={line * BARS_A_LINE + 1}
            tempo={STAFF_TEMPO}
            onShow={onShow}
          />
        </FitWidth>
      ))}
    </div>
  )
}

/**
 * Play for the whole row, turning into Stop: honey where it is the screen's one action (Progressions),
 * which Enter plays too; soft beside other examples.
 */
export function RowPlay({ variant }: { variant: 'default' | 'soft' }) {
  const { t } = useTranslation('music')
  const { playing, playRow } = useRow()
  usePlayKey(playRow, variant === 'default')
  // The tool's row plays from a floating button; beside other examples, from the row.
  if (variant === 'default')
    return (
      <FloatingActions>
        <PlayFab label={t('play')} playing={playing === 'row'} onClick={playRow} />
      </FloatingActions>
    )
  return (
    <Button variant={variant} size="pill" className="self-start" onClick={playRow}>
      <PlayLabel playing={playing === 'row'}>{t('play')}</PlayLabel>
    </Button>
  )
}
