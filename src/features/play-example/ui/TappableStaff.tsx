import { useMemo, useState, type KeyboardEvent } from 'react'
import { useTranslation } from 'react-i18next'
import type { PlayHandle } from '@/shared/api/audio'
import { printedSymbol, type Tick } from '@/shared/lib/music'
import type { Score, StaffId, TimedMusic } from '@/shared/lib/notation'
import { runSounds } from '@/shared/lib/schedule'
import { usePlayback } from '@/shared/lib/services'
import { cn } from '@/shared/lib'
import { LazyScoreView, type ShownKeys } from '@/shared/ui'
import { notesShown } from '../model/notes-example'
import { namesAt, noteColumns, passage, staffAt } from '../model/staff-taps'
import { useStaffPlayhead } from '../model/use-staff-playhead'

/** The chord a bar starts with, printed as the sheets print it (`C♯m7`); none for a bar of no chord. */
function barSymbol(music: TimedMusic, start: Tick): string | undefined {
  const symbol = music.chords.find((chord) => chord.startTick === start)?.symbol
  return symbol === undefined ? undefined : printedSymbol(symbol)
}

/** How far a note's column reaches past the staff's lines, for notes on ledger lines. */
const REACH = 16
/** The band over the staff a bar's tap takes. */
const BAR_BAND = 22

/**
 * A staff, or the grand staff, whose notes play when tapped: each written onset is a button that
 * plays the notes struck there (in both hands on the grand staff) and shows them on the page's keys,
 * marked while they sound; over a line of more than one bar (or a passage's later line), each bar's
 * band plays that bar, its notes marked one by one as they sound, as the whole line's are while a
 * Play beside it plays it (`follow`). Every button is named by what it plays.
 */
export function TappableStaff({
  music,
  score,
  staff,
  scale,
  fingers,
  names = false,
  symbols = true,
  muted,
  firstBar = 1,
  tempo,
  follow = null,
  barShown,
  captions,
  voices,
  onShow,
}: {
  music: TimedMusic
  score: Score
  /** One staff of the grand staff; the grand staff where none. */
  staff?: StaffId | undefined
  scale?: number
  fingers?: boolean
  /** Each notehead carries its note's name. */
  names?: boolean
  /** Each bar's band names its chord, where it has one; else its number. */
  symbols?: boolean
  muted?: StaffId | undefined
  /** The number of its first bar, for a line of a longer passage. */
  firstBar?: number
  tempo: number
  /** The whole music played from its first tick at `tempo` by a Play beside it: its notes marked as they sound. */
  follow?: PlayHandle | null
  /**
   * A word after each bar's chord on its band, by its place: the chord's numeral in its key, printed
   * as its symbol is.
   */
  captions?: readonly (string | undefined)[] | undefined
  /** What the keys show for a bar tapped, by its place, where not its notes by name: a chord's degrees. */
  barShown?: ((bar: number) => ShownKeys | undefined) | undefined
  /** Letters beside the first chord's notes, from its lowest up (`B T A S`): the voices of a chorale. */
  voices?: readonly string[] | undefined
  /** Where the page's keys show what plays; none where the page has no keys to show it on. */
  onShow?: (shown: ShownKeys) => void
}) {
  const { t } = useTranslation('music')
  const playback = usePlayback<string>()
  /** The note Tab comes to: the one played last, else the first (one stop for the whole line). */
  const [stop, setStop] = useState<Tick | null>(null)
  const bars = useMemo(
    () =>
      music.bars.map((bar, i) => ({
        from: bar.startTick,
        to: music.bars[i + 1]?.startTick ?? Number.POSITIVE_INFINITY,
        symbol: symbols ? barSymbol(music, bar.startTick) : undefined,
      })),
    [music, symbols],
  )
  // The arrows move between the notes, as between the keys of the keyboard.
  const step = (event: KeyboardEvent<HTMLButtonElement>) => {
    const by = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0
    if (by === 0) return
    const notes = [
      ...(event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>('[data-note]') ??
        []),
    ]
    const next = notes[notes.indexOf(event.currentTarget) + by]
    if (!next) return
    event.preventDefault()
    next.focus()
    setStop(Number(next.dataset['note']))
  }
  const play = (id: string, from: Tick, to: Tick, shown?: ShownKeys) => {
    const heard = passage(music, from, to)
    onShow?.(shown ?? notesShown(heard))
    playback.toggle(id, () => runSounds(heard, tempo))
  }
  const playingTick = playback.playing?.startsWith('note:')
    ? Number(playback.playing.slice('note:'.length))
    : null
  // A bar played marks its notes in turn; the whole line played beside it, the line's.
  const playingBar = playback.playing?.startsWith('bar:')
    ? bars[Number(playback.playing.slice('bar:'.length))]
    : undefined
  const barMusic = useMemo(
    () => (playingBar ? passage(music, playingBar.from, playingBar.to) : music),
    [music, playingBar],
  )
  const inBar = useStaffPlayhead(
    playingBar ? playback.handle : null,
    barMusic,
    tempo,
    playingBar?.from,
  )
  const inLine = useStaffPlayhead(follow, music, tempo)
  const marked = playingTick ?? inBar ?? inLine
  return (
    <LazyScoreView
      score={score}
      staff={staff}
      muted={muted}
      names={names}
      {...(scale === undefined ? {} : { scale })}
      {...(fingers === undefined ? {} : { fingers })}
      selected={
        marked === null
          ? undefined
          : { staff: staff ?? staffAt(music, marked), from: marked, to: marked + 1 }
      }
    >
      {(layout) => {
        const lines = staff
          ? layout.staves[staff]
          : { top: layout.staffTop, bottom: layout.staffBottom }
        if (!lines) return null
        const columns = noteColumns(layout.onsets)
        const ticks = columns.map((column) => column.tick)
        // A rest's onset plays nothing: only the notes are buttons.
        const onsets = columns.filter((column) => namesAt(music, column.tick) !== '')
        // The first chord's heads, lowest first: on the grand staff the bass staff's lie below.
        const first = voices
          ? (layout.heads ?? [])
              .filter((head) => head.tick === (ticks[0] ?? 0))
              .sort((a, b) => b.top + b.bottom - (a.top + a.bottom))
          : []
        return (
          <>
            {first.length === voices?.length
              ? first.map((head, voice) => (
                  <span
                    key={head.id}
                    aria-hidden
                    className="pointer-events-none absolute z-10 text-xs leading-none font-semibold text-muted-foreground"
                    style={{ left: head.right + 3, top: (head.top + head.bottom) / 2 - 6 }}
                  >
                    {voices[voice]}
                  </span>
                ))
              : null}
            {/* A passage's last line keeps its bar however short. */}
            {bars.length > 1 || firstBar > 1
              ? layout.measures.map((measure, i) => {
                  const bar = bars[i]
                  if (!bar) return null
                  const id = `bar:${i}`
                  const caption = captions?.[i]
                  return (
                    <button
                      key={id}
                      type="button"
                      aria-label={
                        bar.symbol
                          ? t('playBarChord', { n: firstBar + i, symbol: bar.symbol })
                          : t('playBar', { n: firstBar + i })
                      }
                      aria-pressed={playback.playing === id}
                      onClick={() => play(id, bar.from, bar.to, barShown?.(i))}
                      className={cn(
                        'absolute z-20 flex items-start rounded-sm px-1 transition-colors hover:bg-muted aria-pressed:bg-accent aria-pressed:text-accent-foreground focus-visible:outline-2 focus-visible:outline-ring',
                        bar.symbol
                          ? 'font-display text-sm font-semibold text-foreground'
                          : 'text-xs font-semibold text-muted-foreground tabular-nums',
                      )}
                      style={{
                        left: measure.x,
                        width: measure.width,
                        top: Math.max(0, lines.top - REACH - BAR_BAND),
                        height: BAR_BAND,
                      }}
                    >
                      {bar.symbol ?? firstBar + i}
                      {bar.symbol && caption ? (
                        <span className="ml-1 font-sans text-xs font-medium text-muted-foreground">
                          {printedSymbol(caption)}
                        </span>
                      ) : null}
                    </button>
                  )
                })
              : null}
            {onsets.map((column) => {
              const id = `note:${column.tick}`
              const next = ticks[ticks.indexOf(column.tick) + 1]
              return (
                <button
                  key={id}
                  type="button"
                  data-note={column.tick}
                  tabIndex={(stop ?? onsets[0]?.tick) === column.tick ? 0 : -1}
                  onKeyDown={step}
                  onFocus={() => setStop(column.tick)}
                  aria-label={t('playNotes', { notes: namesAt(music, column.tick) })}
                  aria-pressed={playback.playing === id}
                  onClick={() => play(id, column.tick, next ?? Number.POSITIVE_INFINITY)}
                  className="absolute z-20 rounded-md transition-colors hover:bg-muted/60 focus-visible:outline-2 focus-visible:outline-ring"
                  style={{
                    left: column.left,
                    width: column.width,
                    top: lines.top - REACH,
                    height: lines.bottom - lines.top + 2 * REACH,
                  }}
                />
              )
            })}
          </>
        )
      }}
    </LazyScoreView>
  )
}
