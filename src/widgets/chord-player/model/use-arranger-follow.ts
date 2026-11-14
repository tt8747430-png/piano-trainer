import { useEffect, useMemo, useRef, useState } from 'react'
import type { ArrangerStatus } from '@/shared/api/midi'
import {
  arrangerCues,
  clockTempo,
  followedPlace,
  isIntro,
  mainOf,
  playOrder,
  RHYTHM_START,
  RHYTHM_STOP,
  sectionControl,
  type ChordSheet,
} from '@/shared/lib/arrangement'
import { useServices } from '@/shared/lib/services'
import type { BoxPlace } from './engine'

/** The Chord player following a MIDI arranger: where its clock has the sheet, and its panel's sections. */
export interface ArrangerFollow {
  readonly status: ArrangerStatus | null
  /** Its style playing, from its Start to its Stop. */
  readonly running: boolean
  /** Its Intro playing: the sheet waits for its first Main. */
  readonly waiting: boolean
  readonly lit: BoxPlace | null
  readonly beat: number | null
  /** Its tempo from its clock, while it plays. */
  readonly tempo: number | null
  /** The section its panel last took (Section Control's number), sent or heard. */
  readonly section: number | null
  /** Its Start/Stop button. */
  toggle(): void
  /** A section's button on its panel (Section Control). */
  press(section: number): void
}

interface Live {
  running: boolean
  waiting: boolean
  clocks: number
  at: number | null
  beat: number | null
  heardSections: boolean
  lastClock: number | null
  gap: number | null
  section: number | null
}
const IDLE: Live = {
  running: false,
  waiting: false,
  clocks: 0,
  at: null,
  beat: null,
  heardSections: false,
  lastClock: null,
  gap: null,
  section: null,
}
/** How much each clock gap moves the smoothed one: the tempo reads steady, and follows a change in a beat or two. */
const SMOOTHING = 0.1

/**
 * Follows the arranger while `on` (the Chord player brief's Follow a MIDI arranger): its Start plays the sheet from
 * its first bar in silence, its clock moves the lit bar and beat, its Stop stops; Continue goes on.
 * The sheet's marks go out as Section Control: its first Main and Intro while it waits for Start, the
 * rest as each bar begins. With an Intro set and an arranger that reports its sections, the sheet
 * waits for the first Main to start counting; one that reports none starts with its Start.
 */
export function useArrangerFollow(sheet: ChordSheet, on: boolean): ArrangerFollow {
  const { arranger } = useServices()
  const order = useMemo(() => playOrder(sheet), [sheet])
  const cues = useMemo(() => arrangerCues(sheet), [sheet])
  const [status, setStatus] = useState<ArrangerStatus | null>(null)
  const [shown, setShown] = useState<Live>(IDLE)
  const live = useRef<Live>({ ...IDLE })
  const plan = useRef({ order, cues })
  useEffect(() => {
    plan.current = { order, cues }
  }, [order, cues])

  useEffect(() => {
    if (!on) return
    // What the sheet sends is what the panel then holds: its lamps follow.
    const send = (sections: readonly number[]) =>
      sections.forEach((ss) => {
        arranger.send(sectionControl(ss))
        live.current = { ...live.current, section: ss }
      })
    const show = () => setShown({ ...live.current })
    const offStatus = arranger.onStatus(setStatus)
    const offTransport = arranger.onTransport((event) => {
      const now = live.current
      const { order: bars, cues: sent } = plan.current
      if (event.kind === 'start' || event.kind === 'continue') {
        const fresh = event.kind === 'start'
        const intro = sent.start.some(isIntro)
        live.current = {
          ...now,
          running: true,
          waiting: fresh && intro && now.heardSections,
          clocks: fresh ? 0 : now.clocks,
          lastClock: null,
          at: fresh ? null : now.at,
        }
      } else if (event.kind === 'stop') {
        live.current = { ...now, running: false, waiting: false, at: null, beat: null, gap: null }
        send(sent.start)
      } else if (event.kind === 'section') {
        const startsMain = now.waiting && mainOf(event.section) !== null && !isIntro(event.section)
        live.current = {
          ...now,
          heardSections: true,
          section: event.section,
          waiting: startsMain ? false : now.waiting,
          clocks: startsMain ? 0 : now.clocks,
        }
      } else if (now.running && !now.waiting) {
        const place = followedPlace(bars, now.clocks)
        const gap = now.lastClock === null ? null : event.time - now.lastClock
        const smoothed =
          gap === null ? now.gap : now.gap === null ? gap : now.gap + (gap - now.gap) * SMOOTHING
        live.current = {
          ...now,
          clocks: now.clocks + 1,
          lastClock: event.time,
          gap: smoothed,
          at: place?.at ?? null,
          beat: place?.beat ?? null,
        }
        if (place && place.at !== now.at) send(sent.bars[place.at] ?? [])
        if (place?.at === now.at && place.beat === now.beat) return
      } else return
      show()
    })
    void arranger.connect().then((status) => {
      if (status.state === 'connected') send(plan.current.cues.start)
    })
    return () => {
      offStatus()
      offTransport()
      arranger.disconnect()
      live.current = { ...IDLE }
      setShown(IDLE)
    }
  }, [on, arranger])

  // A change to the sheet's opening sets the arranger's panel again while it waits for Start.
  const opening = cues.start.join(',')
  useEffect(() => {
    if (on && status?.state === 'connected' && !live.current.running)
      opening
        .split(',')
        .filter(Boolean)
        .forEach((ss) => arranger.send(sectionControl(Number(ss))))
  }, [on, status, opening, arranger])

  const bar = shown.at === null ? undefined : order[shown.at]
  const piece =
    bar && shown.beat !== null
      ? (bar.chords.findLast((chord) => chord.from <= (shown.beat ?? 0)) ?? bar.chords[0])
      : undefined
  return {
    status,
    running: shown.running,
    waiting: shown.waiting,
    lit: bar && piece ? { section: bar.section, index: piece.index } : null,
    beat: bar ? shown.beat : null,
    tempo: shown.running && shown.gap ? clockTempo(shown.gap) : null,
    section: shown.section,
    toggle: () => arranger.send(live.current.running ? RHYTHM_STOP : RHYTHM_START),
    press: (section) => {
      arranger.send(sectionControl(section))
      live.current = { ...live.current, section }
      setShown({ ...live.current })
    },
  }
}
