import { Play } from 'lucide-react'
import { createContext, use, useMemo, useRef, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import {
  chordSymbol,
  isStrongMove,
  rootMoveText,
  voiceLead,
  type Midi,
  type RowPosition,
} from '@/shared/lib/music'
import { notate } from '@/shared/lib/notation'
import { chordSounds, walkSounds } from '@/shared/lib/schedule'
import { usePlayback, usePlayhead } from '@/shared/lib/services'
import { useFitZoom } from '@/shared/lib'
import {
  FloatingActions,
  FUNCTION_PAINT,
  HarmonyChip,
  HarmonyChips,
  MOVE_PAINT,
  PlayFab,
  PlayButton,
  PlayLabel,
  type ShownKeys,
  unmarked,
  usePlayKey,
} from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { rowMoves, type RowChord } from '../model/chord-row'
import { chordsMusic } from '../model/chords-music'
import { voicedShown } from '../model/marks'
import { TappableStaff } from './TappableStaff'

/** How fast a row walks, a chord each two beats. */
const ROW_TEMPO = 84
/** Where each chord of a row starts as the row walks, in seconds. */
const rowOnsets = (count: number): number[] =>
  Array.from({ length: count }, (_, place) => (place * 2 * 60) / ROW_TEMPO)

/** What a row's parts share: its chords as voiced, whether it plays, and how. */
interface RowPlayback {
  readonly chords: readonly RowChord[]
  /** Each chord's keys as the row voices them, the bass first. */
  readonly voiced: readonly (readonly Midi[])[]
  readonly onShow: (shown: ShownKeys) => void
  readonly playing: 'row' | number | null
  /** The chord sounding, by its place: the row's as it walks, or one played alone. */
  readonly sounding: number | null
  playRow(): void
  /** One chord alone, as the row voices it, shown on the keys by its degrees. */
  playChord(place: number): void
}

const RowContext = createContext<RowPlayback | null>(null)

function useRow(): RowPlayback {
  const row = use(RowContext)
  if (!row) throw new Error('A row’s chords and Play belong inside its ChordRow')
  return row
}

/**
 * A row of chords voiced smoothly (a progression, a way between two chords), from a `position` where
 * one is chosen: its parts, `RowStaff` and `RowPlay`, write it on the grand staff, each bar playing
 * its chord as the row voices it, play the whole row, and show it on the page's keys.
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
  const playback = usePlayback<'row' | number>()
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
  const onsets = useMemo(() => rowOnsets(voiced.length), [voiced.length])
  const walking = usePlayhead(playback.playing === 'row' ? playback.handle : null, onsets)
  const row: RowPlayback = {
    chords,
    voiced,
    onShow,
    playing: playback.playing,
    sounding: typeof playback.playing === 'number' ? playback.playing : walking,
    playRow: () => {
      onShow(unmarked(voiced.flat()))
      playback.toggle('row', () => walkSounds(voiced, { arpeggio: false, tempo: ROW_TEMPO }))
    },
    playChord: (place) => {
      const chord = chords[place]?.chord
      const keys = voiced[place] ?? []
      onShow(chord ? voicedShown(chord, keys) : unmarked(keys))
      playback.toggle(place, () => chordSounds(keys, { arpeggio: false }))
    },
  }
  return (
    <RowContext value={row}>
      <div className="flex flex-col gap-3">{children}</div>
    </RowContext>
  )
}

/** A chord tapped on the row's staff sounds for its bar at this tempo. */
const STAFF_TEMPO = 120

/** Bars on a line of the row's staff. */
const BARS_A_LINE = 4

/**
 * The row on the grand staff as its keys play it, four bars a line: the bass on the bass staff, the
 * hand on the treble, each chord's symbol and numeral over its bar, which plays it as the row voices
 * it. Every line is drawn at the same size, shrunk as the first, full line must be to fit.
 */
export function RowStaff() {
  const { t } = useTranslation('music')
  const { chords, voiced, onShow } = useRow()
  const lines = useMemo(() => {
    const bars = chords.map(({ chord, symbol = chordSymbol(chord) }, place) => ({
      chord,
      symbol,
      keys: voiced[place] ?? [],
    }))
    return Array.from({ length: Math.ceil(bars.length / BARS_A_LINE) }, (_, line) => {
      const from = line * BARS_A_LINE
      const music = chordsMusic(bars.slice(from, from + BARS_A_LINE))
      return { from, music, score: notate(music) }
    })
  }, [chords, voiced])
  const room = useRef<HTMLDivElement>(null)
  const first = useRef<HTMLDivElement>(null)
  const zoom = useFitZoom(room, first)
  return (
    <div
      ref={room}
      role="group"
      aria-label={t('rowChords')}
      className="flex max-w-full flex-col gap-2"
    >
      {lines.map(({ from, music, score }, line) => (
        <div
          key={line}
          ref={line === 0 ? first : undefined}
          className="w-max max-w-none"
          style={zoom < 1 ? { zoom } : undefined}
        >
          <TappableStaff
            music={music}
            score={score}
            firstBar={from + 1}
            tempo={STAFF_TEMPO}
            captions={chords.slice(from, from + BARS_A_LINE).map((chord) => chord.caption)}
            barShown={(bar) => {
              const chord = chords[from + bar]?.chord
              const keys = voiced[from + bar] ?? []
              return chord ? voicedShown(chord, keys) : unmarked(keys)
            }}
            onShow={onShow}
          />
        </div>
      ))}
    </div>
  )
}

/**
 * The row's chords as chips under its staff (DESIGN.md, Harmony): each numeral over what the chord
 * does in its key (`function`), or over how its root moved there (`motion`: a strong move in its
 * paint, one that steps back neutral). The chip sounding follows the row as it plays; a tap plays its
 * chord. Only a progression's row, its chords read in a key, has them.
 */
export function RowChips({ show }: { show: 'function' | 'motion' }) {
  const { t } = useTranslation('music')
  const { chords, sounding, playChord } = useRow()
  const moves = useMemo(() => rowMoves(chords), [chords])
  if (chords.some((chord) => chord.function === undefined || chord.caption === undefined))
    return null
  return (
    <HarmonyChips label={t(show === 'function' ? 'harmony.chips' : 'harmony.moves')}>
      {chords.map((chord, place) => {
        const numeral = chord.caption ?? ''
        const said = chord.function ?? 'tonic'
        const move = moves[place] ?? null
        const strong = move !== null && isStrongMove(move)
        return (
          <HarmonyChip
            key={place}
            numeral={numeral}
            {...(show === 'function'
              ? {
                  detail: t(`harmony.short.${said}`),
                  paint: FUNCTION_PAINT[said],
                  label: t('harmony.chip', { numeral, what: t(`harmony.function.${said}`) }),
                }
              : {
                  detail: move ? rootMoveText(move) : undefined,
                  paint: move && strong ? MOVE_PAINT[move.by] : undefined,
                  label: move
                    ? t('harmony.chip', {
                        numeral,
                        what: t(`harmony.move.${move.by}.${move.down ? 'down' : 'up'}`),
                      })
                    : numeral,
                })}
            sounding={sounding === place}
            onClick={() => playChord(place)}
          />
        )
      })}
    </HarmonyChips>
  )
}

/**
 * Play for the whole row, turning into Stop: honey where it is the screen's one action (Progressions),
 * which Enter plays too; soft beside other examples, named as it is used there (Play the chain).
 */
export function RowPlay({ variant, label }: { variant: 'default' | 'soft'; label?: string }) {
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
  if (label)
    return (
      <Button variant="soft" onClick={playRow} className="self-start rounded-full">
        <PlayLabel playing={playing === 'row'}>
          <Play aria-hidden data-icon="inline-start" className="fill-current" />
          {label}
        </PlayLabel>
      </Button>
    )
  return (
    <PlayButton
      label={t('play')}
      playing={playing === 'row'}
      onClick={playRow}
      className="self-start"
    />
  )
}
