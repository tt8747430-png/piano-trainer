import { useMemo, useState, type KeyboardEvent } from 'react'
import { useTranslation } from 'react-i18next'
import type { PlayHandle } from '@/shared/api/audio'
import type { Tick } from '@/shared/lib/music'
import type { Score, StaffId, TimedMusic } from '@/shared/lib/notation'
import { runSounds } from '@/shared/lib/schedule'
import { usePlayback } from '@/shared/lib/services'
import { cn } from '@/shared/lib'
import { LazyScoreView, type ShownKeys } from '@/shared/ui'
import { notesShown } from '../model/notes-example'
import { namesAt, noteColumns, passage, staffAt } from '../model/staff-taps'
import { useStaffPlayhead } from '../model/use-staff-playhead'

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
  muted,
  firstBar = 1,
  tempo,
  follow = null,
  onShow,
}: {
  music: TimedMusic
  score: Score
  /** One staff of the grand staff; the grand staff where none. */
  staff?: StaffId | undefined
  scale?: number
  fingers?: boolean
  muted?: StaffId | undefined
  /** The number of its first bar, for a line of a longer passage. */
  firstBar?: number
  tempo: number
  /** The whole music played from its first tick at `tempo` by a Play beside it: its notes marked as they sound. */
  follow?: PlayHandle | null
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
        symbol: music.chords.find((chord) => chord.startTick === bar.startTick)?.symbol,
      })),
    [music],
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
  const play = (id: string, from: Tick, to: Tick) => {
    const heard = passage(music, from, to)
    onShow?.(notesShown(heard))
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
      {...(scale === undefined ? {} : { scale })}
      {...(fingers === undefined ? {} : { fingers })}
      selected={
        marked === null ? undefined : { staff: staff ?? staffAt(music, marked), tick: marked }
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
        return (
          <>
            {/* A passage's last line keeps its bar however short. */}
            {bars.length > 1 || firstBar > 1
              ? layout.measures.map((measure, i) => {
                  const bar = bars[i]
                  if (!bar) return null
                  const id = `bar:${i}`
                  return (
                    <button
                      key={id}
                      type="button"
                      aria-label={t('playBar', { n: firstBar + i })}
                      aria-pressed={playback.playing === id}
                      onClick={() => play(id, bar.from, bar.to)}
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
