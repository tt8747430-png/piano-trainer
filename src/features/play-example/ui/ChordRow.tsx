import { Play, Repeat } from 'lucide-react'
import {
  createContext,
  use,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
} from 'react'
import { useTranslation } from 'react-i18next'
import {
  chordSymbol,
  isStrongMove,
  printedSymbol,
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
  FloatingBar,
  FloatingBarButton,
  FloatingBarPlay,
  MoveArrow,
  RoleChip,
  RoleChips,
  RoleLegend,
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
  /** The row plays round again as it ends, until stopped. */
  readonly looping: boolean
  toggleLoop(): void
  playRow(): void
  /** One chord alone, as the row voices it, shown on the keys by its degrees. */
  playChord(place: number): void
  /** The chord before `place` and the chord at it, one after the other: the move between them. */
  playMove(place: number): void
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
  // A chord alone by its place; a move by the place it leads to, as a negative number.
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
  const [looping, setLooping] = useState(false)
  // Looped, the row starts again as it ends by itself; never after Stop or a chord tapped alone.
  const ended = useRef({ row: false, stopped: false })
  const rowSounds = () => walkSounds(voiced, { arpeggio: false, tempo: ROW_TEMPO })
  const { playing, start } = playback
  useEffect(() => {
    const was = ended.current
    if (playing === 'row') was.row = true
    else if (playing === null && was.row && looping && !was.stopped)
      start('row', walkSounds(voiced, { arpeggio: false, tempo: ROW_TEMPO }))
    else was.row = false
  }, [playing, looping, start, voiced])
  const row: RowPlayback = {
    chords,
    voiced,
    onShow,
    playing: playback.playing,
    sounding:
      typeof playback.playing === 'number' && playback.playing >= 0 ? playback.playing : walking,
    looping,
    toggleLoop: () => setLooping((was) => !was),
    playRow: () => {
      onShow(unmarked(voiced.flat()))
      ended.current.stopped = playback.playing === 'row'
      playback.toggle('row', rowSounds)
    },
    playChord: (place) => {
      const chord = chords[place]?.chord
      const keys = voiced[place] ?? []
      onShow(chord ? voicedShown(chord, keys) : unmarked(keys))
      playback.toggle(place, () => chordSounds(keys, { arpeggio: false }))
    },
    playMove: (place) => {
      const pair = [voiced[place - 1] ?? [], voiced[place] ?? []]
      onShow(unmarked(pair.flat()))
      playback.toggle(-place, () => walkSounds(pair, { arpeggio: false, tempo: ROW_TEMPO }))
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
 * Why the row works, drawn on its chords (A23, layout B): each chord a chip, its numeral (or symbol)
 * over its role in its key and the colour it brings, an arrow between each two with how the bass
 * moves; under it one line saying what the words and arrows mean. A tap on a chip plays its chord, on an arrow the two chords it joins; the chip sounding
 * follows the row as it plays. Only a progression's row, its chords read in a key, has it.
 */
export function RowRoles() {
  const { t } = useTranslation('music')
  const { chords, sounding, playChord, playMove } = useRow()
  const moves = useMemo(() => rowMoves(chords), [chords])
  const names = chords.map(
    (chord) => chord.caption ?? printedSymbol(chord.symbol ?? chordSymbol(chord.chord)),
  )
  return (
    <div className="flex flex-col gap-2">
      <RoleChips label={t('harmony.roles')}>
        {chords.map(({ role }, place) => {
          if (!role) return null
          const name = names[place] ?? ''
          const move = moves[place] ?? null
          const said = [
            t(`harmony.role.${role.role}`),
            ...(role.colour ? [t(`harmony.colour.${role.colour}`)] : []),
          ].join(', ')
          return (
            <RoleChip
              key={place}
              name={name}
              role={role}
              label={t('harmony.chip', { numeral: name, what: said })}
              sounding={sounding === place}
              onClick={() => playChord(place)}
              move={
                place > 0 ? (
                  <MoveArrow
                    move={move}
                    label={t('harmony.playMove', {
                      from: names[place - 1] ?? '',
                      to: name,
                      move: move
                        ? [
                            t(`harmony.move.${move.by}.${move.down ? 'down' : 'up'}`),
                            t(`harmony.meaning.${isStrongMove(move) ? move.by : 'back'}`),
                          ].join(', ')
                        : t('harmony.meaning.same'),
                    })}
                    onClick={() => playMove(place)}
                  />
                ) : undefined
              }
            />
          )
        })}
      </RoleChips>
      <RoleLegend />
    </div>
  )
}

/**
 * Play for the whole row, turning into Stop: where it is the screen's one action (Progressions), the
 * page's floating bar, Loop then the way into the Player (`practise`) then Play, the honey circle,
 * which Enter plays too; soft beside other examples, named as it is used there (Play the chain).
 */
export function RowPlay({
  variant,
  label,
  practise,
}: {
  variant: 'default' | 'soft'
  label?: string
  /** The Player with this row, a grey pill before Play (Progressions' Practise). */
  practise?: { label: string; render: ReactElement } | undefined
}) {
  const { t } = useTranslation(['music', 'player', 'practice'])
  const { playing, playRow, looping, toggleLoop } = useRow()
  usePlayKey(playRow, variant === 'default')
  if (variant === 'default')
    return (
      <FloatingActions>
        <FloatingBar label={t('practice:transport')}>
          <FloatingBarButton
            named
            label={t('player:loop')}
            aria-pressed={looping}
            onClick={toggleLoop}
            className="flex-none px-4 aria-pressed:bg-chosen"
          >
            <Repeat aria-hidden />
          </FloatingBarButton>
          {practise ? (
            <FloatingBarButton named label={practise.label} render={practise.render}>
              {null}
            </FloatingBarButton>
          ) : null}
          <FloatingBarPlay label={t('music:play')} playing={playing === 'row'} onClick={playRow} />
        </FloatingBar>
      </FloatingActions>
    )
  if (label)
    return (
      <Button variant="soft" onClick={playRow} className="self-start rounded-pill">
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
