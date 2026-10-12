import { useMemo, useState, type KeyboardEvent } from 'react'
import { useTranslation } from 'react-i18next'
import type { Tick } from '@/shared/lib/music'
import type { Score, StaffId, TimedMusic } from '@/shared/lib/notation'
import { runSounds } from '@/shared/lib/schedule'
import { usePlayback } from '@/shared/lib/services'
import { LazyScoreView, type ShownKeys } from '@/shared/ui'
import { notesShown } from '../model/notes-example'
import { namesAt, noteColumns, passage } from '../model/staff-taps'

/** How far a note's column reaches past the staff's lines, for notes on ledger lines. */
const REACH = 16
/** The band over the staff a bar's tap takes. */
const BAR_BAND = 22

/**
 * A staff whose notes play when tapped: each written onset is a button that plays the notes struck
 * there and shows them on the page's keys, marked on the staff while they sound; over a line of more
 * than one bar, each bar's band plays that bar. Every button is named by what it plays.
 */
export function TappableStaff({
  music,
  score,
  staff,
  scale,
  tempo,
  onShow,
}: {
  music: TimedMusic
  score: Score
  staff: StaffId
  scale?: number
  tempo: number
  onShow: (shown: ShownKeys) => void
}) {
  const { t } = useTranslation('learn')
  const playback = usePlayback<string>()
  /** The note Tab comes to: the one played last, else the first (one stop for the whole line). */
  const [stop, setStop] = useState<Tick | null>(null)
  const bars = useMemo(
    () =>
      music.bars.map((bar, i) => ({
        from: bar.startTick,
        to: music.bars[i + 1]?.startTick ?? Number.POSITIVE_INFINITY,
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
    onShow(notesShown(heard))
    playback.toggle(id, () => runSounds(heard, tempo))
  }
  const playingTick = playback.playing?.startsWith('note:')
    ? Number(playback.playing.slice('note:'.length))
    : null
  return (
    <LazyScoreView
      score={score}
      staff={staff}
      {...(scale === undefined ? {} : { scale })}
      selected={playingTick === null ? undefined : { staff, tick: playingTick }}
    >
      {(layout) => {
        const lines = layout.staves[staff]
        if (!lines) return null
        const columns = noteColumns(layout.onsets)
        const ticks = columns.map((column) => column.tick)
        // A rest's onset plays nothing: only the notes are buttons.
        const onsets = columns.filter((column) => namesAt(music, column.tick) !== '')
        return (
          <>
            {bars.length > 1
              ? layout.measures.map((measure, i) => {
                  const bar = bars[i]
                  if (!bar) return null
                  const id = `bar:${i}`
                  return (
                    <button
                      key={id}
                      type="button"
                      aria-label={t('example.playBar', { n: i + 1 })}
                      aria-pressed={playback.playing === id}
                      onClick={() => play(id, bar.from, bar.to)}
                      className="absolute z-20 flex items-start rounded-sm px-1 text-xs font-semibold text-muted-foreground tabular-nums transition-colors hover:bg-muted aria-pressed:bg-accent aria-pressed:text-accent-foreground focus-visible:outline-2 focus-visible:outline-ring"
                      style={{
                        left: measure.x,
                        width: measure.width,
                        top: Math.max(0, lines.top - REACH - BAR_BAND),
                        height: BAR_BAND,
                      }}
                    >
                      {i + 1}
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
                  aria-label={t('example.playNotes', { notes: namesAt(music, column.tick) })}
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
