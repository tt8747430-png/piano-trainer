import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { ArrangerStatus } from '@/shared/api/midi'
import {
  arrangerCues,
  CLOCKS_PER_BEAT,
  isIntro,
  mainOf,
  sectionControl,
  type ChordSheet,
} from '@/shared/lib/arrangement'
import { PLAY_DELAY } from '@/shared/api/audio'
import { useServices } from '@/shared/lib/services'

/** MIDI's real-time Start, Stop and clock, which an arranger set to an external clock plays by. */
const MIDI_START = [0xfa] as const
const MIDI_STOP = [0xfc] as const
const MIDI_CLOCK = [0xf8] as const
/** How far ahead the clock's ticks are handed to the browser, and how often more are. */
const CLOCK_AHEAD_MS = 120
const CLOCK_EVERY_MS = 25
/** How long an arranger's Ending may run on after the sheet's last bar, on the app's clock, before it stops. */
const ENDING_BARS = 8

/**
 * The Chord player leading a MIDI arranger (a Yamaha Genos): the sheet plays as it does alone, in silence,
 * and the arranger is told only what to play and when: MIDI Start where the sheet's first chord sounds, the
 * app's clock (24 a beat) while it plays, each section's Main, Fill-in, Break or Ending at the bar it falls
 * on (Section Control), Stop at Stop. Never a chord or a note: the learner plays those, and the arranger
 * detects the chords. With an Intro and an arranger that reports its sections, the sheet waits for the
 * Intro's end (its first Main, heard) before it starts counting.
 */
export interface ArrangerLink {
  readonly status: ArrangerStatus | null
  /** The section its panel last took (Section Control's number), sent or heard. */
  readonly section: number | null
  /** Started on an Intro: the sheet waits for the arranger's first Main. */
  readonly waiting: boolean
  /**
   * Starts the arranger at `at` (the audio clock's seconds) at `tempo`, its panel set first to the
   * sheet's opening and then to the sections `pressed` before Start; `main` hears when its Intro ends
   * (on the audio clock), where it has one and reports its sections.
   */
  start(at: number, tempo: number, pressed: readonly number[], main: (at: number) => void): void
  /** The soonest the arranger can be started, on the audio clock. */
  soon(): number
  /** The sheet's bar `bar` in play order begins at `at` (the audio clock's seconds): its cues go out then. */
  bar(bar: number, at: number): void
  /** Stop: at once, or after the arranger's Ending (`ending`). */
  stop(ending?: boolean): void
  /** A section's button on its panel (Section Control). */
  press(section: number): void
  /** Asks for MIDI again, from a tap (a refused or missed prompt, an arranger switched on late). */
  reconnect(): void
}

interface Clock {
  next: number
  gap: number
  timer: ReturnType<typeof setInterval> | null
  until: number | null
}

/** `tempo` sets the clock's pace while it runs, from its next tick. */
export function useArrangerFollow(sheet: ChordSheet, on: boolean, tempo: number): ArrangerLink {
  const { arranger, audio } = useServices()
  const cues = useMemo(() => arrangerCues(sheet), [sheet])
  const [status, setStatus] = useState<ArrangerStatus | null>(null)
  const [section, setSection] = useState<number | null>(null)
  const [waiting, setWaiting] = useState(false)
  const plan = useRef(cues)
  useEffect(() => {
    plan.current = cues
  }, [cues])
  const clock = useRef<Clock>({ next: 0, gap: 0, timer: null, until: null })
  /** Heard a section from the arranger's panel: it reports them, so an Intro's end can be waited for. */
  const reports = useRef(false)
  const onMain = useRef<((at: number) => void) | null>(null)
  const connect = useRef<() => void>(() => undefined)

  const send = useCallback(
    (sections: readonly number[], at?: number) =>
      sections.forEach((ss) => {
        arranger.send(sectionControl(ss), at)
        setSection(ss)
      }),
    [arranger],
  )
  const halt = useCallback(() => {
    const each = clock.current
    if (each.timer) clearInterval(each.timer)
    clock.current = { ...each, timer: null, until: null }
    onMain.current = null
    setWaiting(false)
  }, [])

  useEffect(() => {
    if (!on) return
    const offStatus = arranger.onStatus(setStatus)
    const offTransport = arranger.onTransport((event) => {
      if (event.kind === 'section') {
        reports.current = true
        setSection(event.section)
        const main = onMain.current
        if (main && mainOf(event.section) !== null && !isIntro(event.section)) {
          onMain.current = null
          setWaiting(false)
          main(audio.audioTimeAt(event.time))
        }
      } else if (event.kind === 'stop' && clock.current.until !== null) halt()
    })
    connect.current = () =>
      void arranger.connect().then((linked) => {
        if (linked.state === 'connected') send(plan.current.start)
      })
    connect.current()
    return () => {
      if (clock.current.timer) arranger.send(MIDI_STOP)
      halt()
      offStatus()
      offTransport()
      arranger.disconnect()
      setSection(null)
    }
  }, [on, arranger, audio, send, halt])

  // A change to the sheet's opening sets the arranger's panel again while it is stopped.
  const opening = cues.start.join(',')
  useEffect(() => {
    if (on && status?.state === 'connected' && !clock.current.timer)
      opening
        .split(',')
        .filter(Boolean)
        .forEach((ss) => arranger.send(sectionControl(Number(ss))))
  }, [on, status, opening, arranger])

  useEffect(() => {
    clock.current.gap = 60_000 / (tempo * CLOCKS_PER_BEAT)
  }, [tempo])

  const acts = useMemo(() => {
    // When a moment on the audio clock is heard, on the page's clock MIDI is sent by: the Genos sounds with the app.
    const toPage = (at: number) => {
      const now = performance.now()
      return now + (at - audio.audioTimeAt(now)) * 1000
    }
    return {
      start(begin: number, pace: number, pressed: readonly number[], main: (at: number) => void) {
        halt()
        const at = toPage(begin)
        const opening = [...plan.current.start, ...pressed]
        send(opening)
        if (opening.some(isIntro) && reports.current) {
          onMain.current = main
          setWaiting(true)
        }
        arranger.send(MIDI_START, at)
        const each: Clock = {
          next: at,
          gap: 60_000 / (pace * CLOCKS_PER_BEAT),
          timer: null,
          until: null,
        }
        const pump = () => {
          const horizon = performance.now() + CLOCK_AHEAD_MS
          while (each.next <= horizon) {
            // Its Ending played out on the app's clock, with no Stop heard from it: stopped from here.
            if (each.until !== null && each.next >= each.until) {
              halt()
              arranger.send(MIDI_STOP)
              return
            }
            arranger.send(MIDI_CLOCK, each.next)
            each.next += each.gap
          }
        }
        clock.current = each
        pump()
        each.timer = setInterval(pump, CLOCK_EVERY_MS)
      },
      soon: () => audio.now() + PLAY_DELAY,
      bar(bar: number, at: number) {
        if (clock.current.timer) send(plan.current.bars[bar] ?? [], toPage(at))
      },
      stop(ending = false) {
        if (!clock.current.timer) return
        if (ending) {
          // The arranger plays its Ending on the app's clock: it runs on until the arranger stops itself.
          clock.current.until =
            performance.now() + clock.current.gap * CLOCKS_PER_BEAT * 4 * ENDING_BARS
          return
        }
        halt()
        arranger.send(MIDI_STOP)
        send(plan.current.start)
      },
      press(ss: number) {
        send([ss])
      },
      reconnect: () => connect.current(),
    }
  }, [arranger, audio, send, halt])

  return { status, section, waiting, ...acts }
}
