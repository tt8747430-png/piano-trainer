import { useEffect, useMemo, useRef, useState } from 'react'
import type { ChordSheetSettings } from '@/entities/chord-sheet'
import type { Style } from '@/entities/pattern'
import { imitatedPlay, isIntro, SECTION, type ChordSheet } from '@/shared/lib/arrangement'
import type { ArrangerStatus } from '@/shared/api/midi'
import type { ArrangerTake, BoxPlace } from './engine'
import { useArrangerFollow } from './use-arranger-follow'
import { useChordTransport } from './use-chord-transport'

/**
 * What the panel shows and does: the arranger's connection, the section lit, whether the style
 * plays, Start/Stop, a section's button, and asking for MIDI again. With a Genos connected the
 * Genos plays; with none, the app's band stands in for it, every button working the same.
 */
export interface ArrangerPanel {
  readonly status: ArrangerStatus | null
  readonly section: number | null
  readonly running: boolean
  /** The sheet has chords to play: Start/Stop rests without, as Play does. */
  readonly playable: boolean
  toggle(): void
  press(section: number): void
  reconnect(): void
}

const NO_TAKE: ArrangerTake = { start: [], presses: [] }

/** What the Chord player plays, Play and the arranger's panel together. */
export interface ArrangerPlay {
  readonly playing: boolean
  readonly lit: BoxPlace | null
  readonly beat: number | null
  /** Play, or Stop: from `from` where given, else from the top (the looped section's first chord). */
  toggle(from?: BoxPlace): void
  /** Plays from a chord, stopping what plays first. */
  playFrom(place: BoxPlace): void
  readonly looped: number | null
  setLoop(section: number | null): void
  /** Following an arranger: its panel, and who plays the style (the Genos, or the style by name). */
  readonly panel: ArrangerPanel
  readonly device: string
}

/**
 * The Chord player's playing (R29 CP4), Play leading in every mode. Alone, the band plays the sheet.
 * Following an arranger with a Genos connected, the band keeps the time in silence (the count-in
 * still heard) while the Genos plays the style: MIDI Start on the sheet's first chord, the app's
 * clock, each bar's sections as it begins, Stop at Stop; with an Intro set (and a Genos that reports
 * its sections) the sheet waits for the Intro's end. Following one with none connected, the app's
 * band stands in for it, playing the sections the sheet and the panel set (`imitatedPlay`).
 */
export function useArrangerPlay({
  sheet,
  style,
  tempo,
  settings,
  block,
  follow,
  styleName,
}: {
  sheet: ChordSheet
  style: Style
  tempo: number
  settings: ChordSheetSettings
  block: boolean
  follow: boolean
  /** The style's name, said as who plays where the app's band stands in for the Genos. */
  styleName: string
}): ArrangerPlay {
  const link = useArrangerFollow(sheet, follow, tempo)
  const genos = follow && link.status?.state === 'connected'
  const standIn = follow && !genos
  const [take, setTake] = useState<ArrangerTake>(NO_TAKE)
  // The Genos's Intro is its count-in: the sheet starts as it ends.
  const genosIntro = genos && sheet.sections[0]?.marks.intro != null
  // A bar queued before the Genos was started waits for its Start.
  const started = useRef(false)
  const early = useRef<{ bar: number; at: number }[]>([])
  const transport = useChordTransport(
    {
      sheet,
      style,
      tempo,
      settings: genosIntro ? { ...settings, countIn: 0 } : settings,
      block,
      ...(genos ? { silent: true } : {}),
      ...(standIn ? { arranger: take } : {}),
    },
    (bar, at) => {
      if (!genos) return
      if (started.current) link.bar(bar, at)
      else early.current.push({ bar, at })
    },
  )
  const playing = transport.playing || link.waiting
  // Play, and the panel's Start, rest on a sheet with no chords.
  const playable = sheet.sections.some((section) => section.bars.length > 0)

  // A run's end: the Genos stopped (after its Ending, where the sheet ends on one); the stand-in's
  // Intro pressed is played, and its presses are done.
  const ran = useRef(false)
  const endsOnEnding = sheet.sections.at(-1)?.marks.ending != null
  const { stop: stopLink } = link
  useEffect(() => {
    if (ran.current && !transport.playing) {
      stopLink(endsOnEnding)
      started.current = false
      setTake((each) => ({ start: each.start.filter((ss) => !isIntro(ss)), presses: [] }))
    }
    ran.current = transport.playing
  }, [transport.playing, stopLink, endsOnEnding])

  const start = (from?: BoxPlace) => {
    if (!playable) return
    early.current = []
    started.current = false
    if (!genos) {
      transport.play(transport.looped, from)
      return
    }
    const startLink = (at: number, main: (at: number) => void) => {
      link.start(at, tempo, take.start, main)
      started.current = true
      early.current.forEach((each) => link.bar(each.bar, each.at))
      early.current = []
    }
    if (genosIntro && !from && transport.looped === null) {
      // The Genos plays its Intro from now; the sheet joins at the Main it ends on.
      startLink(link.soon(), (at) => transport.play(transport.looped, undefined, at))
      return
    }
    startLink(transport.play(transport.looped, from), () => undefined)
  }
  const stop = () => {
    transport.stop()
    link.stop()
  }

  const stoppedLamp = useMemo(() => {
    const opening = imitatedPlay(sheet, take.start)
    return opening.intro
      ? SECTION.intro[opening.intro]
      : opening.opening
        ? SECTION.main[opening.opening]
        : null
  }, [sheet, take.start])
  const panel: ArrangerPanel = {
    status: link.status,
    section: genos ? link.section : playing ? transport.lamp : stoppedLamp,
    running: playing,
    playable,
    toggle: () => (playing ? stop() : start()),
    press: (ss) => {
      const ending = Object.values(SECTION.ending).some((each) => each === ss)
      if (genos) {
        link.press(ss)
        // The Genos plays its Ending and stops: the sheet stops with it.
        if (ending && playing) {
          transport.stop()
          link.stop(true)
        }
      }
      setTake((each) =>
        playing && !genos
          ? { ...each, presses: [...each.presses, { bar: transport.nextBar(), section: ss }] }
          : playing
            ? each
            : { ...each, start: [...each.start, ss] },
      )
    },
    reconnect: link.reconnect,
  }

  return {
    playing,
    lit: transport.lit,
    beat: transport.beat,
    toggle: (from) => (playing ? stop() : start(from)),
    playFrom: (place) => {
      if (playing) stop()
      start(place)
    },
    looped: transport.looped,
    setLoop: transport.setLoop,
    panel,
    device: link.status?.state === 'connected' ? link.status.device : styleName,
  }
}
