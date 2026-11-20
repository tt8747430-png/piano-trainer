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
  printedSymbol,
  rootMove,
  voiceLead,
  type Midi,
  type RowPosition,
} from '@/shared/lib/music'
import { notate } from '@/shared/lib/notation'
import { chordSounds, walkSounds } from '@/shared/lib/schedule'
import { usePlayback, usePlayhead } from '@/shared/lib/services'
import { useElementSize, useFitZoom } from '@/shared/lib'
import {
  KeysIcon,
  FloatingActions,
  FloatingPiece,
  FloatingPieces,
  FloatingPieceLink,
  FloatingPlaySplit,
  RoleLegend,
  RoleTile,
  RoleTiles,
  PlayButton,
  PlayRow,
  PlayLabel,
  type ShownKeys,
  unmarked,
  usePlayKey,
} from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import type { RowChord } from '../model/chord-row'
import { chordsMusic } from '../model/chords-music'
import { voicedShown } from '../model/marks'
import { fitStyle } from './fit-style'
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
  chooses = false,
  children,
}: {
  chords: readonly RowChord[]
  position?: RowPosition | undefined
  onShow: (shown: ShownKeys) => void
  /**
   * A page's own row (a progression's, canvas 198): one chord is chosen, the first until another is
   * tapped, its tile ringed while nothing sounds; the page shows its keys (`firstChordShown` at
   * first) and remounts the row when the row changes, so the first is chosen again.
   */
  chooses?: boolean
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
  const [chosen, setChosen] = useState(0)
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
      typeof playback.playing === 'number' && playback.playing >= 0
        ? playback.playing
        : (walking ?? (chooses && playback.playing === null ? chosen : null)),
    looping,
    toggleLoop: () => setLooping((was) => !was),
    playRow: () => {
      onShow(unmarked(voiced.flat()))
      ended.current.stopped = playback.playing === 'row'
      playback.toggle('row', rowSounds)
    },
    playChord: (place) => {
      setChosen(place)
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
 * A progression's staff spans the column at its board's size (STAFF62, a 246-unit view at 7 units a
 * space): a space is 7/246 of the width, and scale 1 draws 10, so the scale is the width over this.
 */
const SPAN_UNITS_A_SCALE = 2460 / 7
/** The widest a progression's staff is drawn, centred, as its board's 560. */
const SPAN_MOST_WIDTH = 560

/**
 * The row on the grand staff as its keys play it, four bars a line: the bass on the bass staff, the
 * hand on the treble, each bar playing its chord as the row voices it. Every line is drawn at the
 * same size. In a lesson each chord's symbol and numeral stand over its bar, every line shrunk as
 * the first, full line must be to fit; with `spans` (a progression's page, whose tiles name the
 * chords) the bars are bare and each line spans the column at its board's size, a short last line
 * the part of it its bars take.
 */
export function RowStaff({ spans = false }: { spans?: boolean }) {
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
      const shown = bars.slice(from, from + BARS_A_LINE)
      const music = chordsMusic(shown, { symbols: !spans })
      return { from, count: shown.length, music, score: notate(music) }
    })
  }, [chords, voiced, spans])
  const room = useRef<HTMLDivElement>(null)
  const first = useRef<HTMLDivElement>(null)
  const zoom = useFitZoom(room, first)
  const width = Math.min(useElementSize(room).width, SPAN_MOST_WIDTH)
  const barShown = (from: number) => (bar: number) => {
    const chord = chords[from + bar]?.chord
    const keys = voiced[from + bar] ?? []
    return chord ? voicedShown(chord, keys) : unmarked(keys)
  }
  if (spans)
    return (
      <div
        ref={room}
        role="group"
        aria-label={t('rowChords')}
        className="flex w-full flex-col items-center gap-2"
      >
        {width > 0
          ? lines.map(({ from, count, music, score }, line) => (
              <TappableStaff
                key={line}
                music={music}
                score={score}
                firstBar={from + 1}
                tempo={STAFF_TEMPO}
                scale={width / SPAN_UNITS_A_SCALE}
                fill={(width * count) / BARS_A_LINE}
                bands={false}
                continues={line > 0}
                barShown={barShown(from)}
                onShow={onShow}
              />
            ))
          : null}
      </div>
    )
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
          style={fitStyle(zoom)}
        >
          <TappableStaff
            music={music}
            score={score}
            firstBar={from + 1}
            tempo={STAFF_TEMPO}
            captions={chords.slice(from, from + BARS_A_LINE).map((chord) => chord.caption)}
            barShown={barShown(from)}
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
  const { chords, sounding, playChord } = useRow()
  return (
    <div className="flex flex-col gap-4 lg:gap-5">
      <RoleTiles label={t('harmony.roles')}>
        {chords.map(({ chord, caption, symbol, role }, place) => {
          if (!role) return null
          const name = printedSymbol(symbol ?? chordSymbol(chord))
          const next = chords[(place + 1) % chords.length]?.chord ?? chord
          const move = rootMove(chord.root, next.root)
          const said = [
            t(`harmony.role.${role.role}`),
            ...(role.colour ? [t(`harmony.colour.${role.colour}`)] : []),
          ].join(', ')
          return (
            <RoleTile
              key={place}
              numeral={caption}
              chord={name}
              role={role}
              label={t('harmony.chip', { numeral: caption ?? name, what: said })}
              sounding={sounding === place}
              onClick={() => playChord(place)}
              move={
                move
                  ? t(`harmony.move.${move.by}.${move.down ? 'down' : 'up'}`)
                  : t('harmony.move.same')
              }
            />
          )
        })}
      </RoleTiles>
      <RoleLegend />
    </div>
  )
}

/**
 * Play for the whole row, turning into Stop: where it is the screen's one action (a progression's
 * page, canvas 177), the page's floating pieces, Loop (ink while it loops), Play with its menu (what
 * it plays), the honey one Enter plays too, and the way into the Player (`practise`); soft beside other
 * examples, named as it is used there (Play the chain).
 */
/**
 * The row as one of a card's play rows (a progression's Passing chords, the board's BETWEEN62): Play's
 * circle at its start, what it plays over one line of why; a tap plays the row here.
 */
export function RowPlayLine({ title, detail }: { title: string; detail: string }) {
  const { playing, playRow } = useRow()
  return (
    <PlayRow
      here
      title={title}
      detail={detail}
      render={<button type="button" aria-pressed={playing === 'row'} onClick={playRow} />}
    />
  )
}

export function RowPlay({
  variant,
  label,
  practise,
  menuLabel,
  menu,
}: {
  variant: 'pieces' | 'soft'
  label?: string
  /** The Player with this row, the piece after Play (a progression's Practise). */
  practise?: { label: string; caption: string; render: ReactElement } | undefined
  /** Play's chevron's name and its menu, on the floating pieces. */
  menuLabel?: string
  menu?: (trigger: ReactElement) => ReactNode
}) {
  const { t } = useTranslation(['music', 'player', 'practice'])
  const { playing, playRow, looping, toggleLoop } = useRow()
  usePlayKey(playRow, variant === 'pieces')
  if (variant === 'pieces' && menu && menuLabel)
    return (
      <FloatingActions>
        <FloatingPieces label={t('practice:transport')}>
          <FloatingPiece
            label={t('player:loop')}
            caption={t('player:loop')}
            round
            aria-pressed={looping}
            onClick={toggleLoop}
            className="aria-pressed:bg-foreground aria-pressed:text-background aria-pressed:hover:bg-foreground"
          >
            <Repeat aria-hidden />
          </FloatingPiece>
          <FloatingPlaySplit
            label={label ?? t('music:play')}
            playing={playing === 'row'}
            onPlay={playRow}
            menuLabel={menuLabel}
            menu={menu}
          />
          {practise ? (
            <FloatingPieceLink
              label={practise.label}
              caption={practise.caption}
              render={practise.render}
            >
              <KeysIcon aria-hidden />
            </FloatingPieceLink>
          ) : (
            // With no Practise its place stays empty (the board's BAR62).
            <span aria-hidden />
          )}
        </FloatingPieces>
      </FloatingActions>
    )
  if (label)
    return (
      <Button variant="soft" onClick={playRow} className="self-start">
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
