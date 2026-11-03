import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { selectMetronome, useSettings, useSettingsStoreApi } from '@/entities/settings'
import type { MetronomeSettings } from '@/entities/settings'
import { setMetronome } from '@/features/set-preference'
import { PLAY_DELAY } from '@/shared/api/audio'
import { tapTempo, useWakeLock } from '@/shared/lib'
import {
  beatHeard,
  beatSounds,
  goOnFrom,
  mutedBar,
  plannedBeats,
  beatLevels,
  nextLevel,
  parseMeter,
  speedAt,
  type BeatLevel,
  type MetronomeBeat,
  type Subdivision,
  type MetronomeTime,
} from '@/shared/lib/schedule'
import { useServices } from '@/shared/lib/services'

/** How far ahead of the audio clock the beats are queued, in seconds: past a hidden page's timer. */
const AHEAD = 1.5
/** How often the queue is topped up, in milliseconds: when, never what time a beat sounds. */
const TOP_UP = 250
/** How long a beat heard is kept, in seconds, for the beat shown. */
const KEPT = 2

/** A saved meter read: 4/4 where it cannot be. */
const meterOf = (meter: string) => parseMeter(meter) ?? { top: 4, bottom: 4 }

/** The Metronome's time: its tempo, or the speed trainer's bar by bar while it is on. */
const timeOf = ({ bpm, meter, speed }: MetronomeSettings): MetronomeTime =>
  speed.on ? { bpm, meter, bpmAt: (bar) => speedAt(bar, speed) } : { bpm, meter }
const tempoOf = (time: MetronomeTime, bar: number) => (time.bpmAt ? time.bpmAt(bar) : time.bpm)

/** The bar trainer's counts while it is on. */
const trainerOf = ({ on, play, mute }: MetronomeSettings['trainer']) => (on ? { play, mute } : null)

/** A Metronome playing: the next beat to queue and the beats queued. */
interface Run {
  next: MetronomeBeat
  planned: readonly MetronomeBeat[]
  timer: ReturnType<typeof setInterval>
}

export interface Metronome extends MetronomeSettings {
  readonly playing: boolean
  /** The beat sounding (from 0), while it plays, heard or muted. */
  readonly beat: number | null
  /** Whether the bar going by is one the bar trainer mutes. */
  readonly muted: boolean
  toggle(): void
  /** The tempo by `step` beats a minute, held to its range. */
  nudge(step: number): void
  setBpm(bpm: number): void
  setMeter(meter: MetronomeSettings['meter']): void
  setSound(sound: MetronomeSettings['sound']): void
  /** Each beat's level as its square shows it. */
  readonly beatLevels: readonly BeatLevel[]
  /** A square tapped: its beat on to its next level, accent · normal · silent. */
  tapBeat(beat: number): void
  setSubdivision(subdivision: Subdivision): void
  /** The speed trainer turned on or off, or its tempos and steps changed. */
  setSpeed(change: Partial<MetronomeSettings['speed']>): void
  /** The tempo heard now: the speed trainer's bar's while it runs. */
  readonly tempoNow: number
  /** The bar trainer turned on or off, or its counts changed. */
  setTrainer(change: Partial<MetronomeSettings['trainer']>): void
  /** A tap in time: from the second, the tempo the taps keep. */
  tap(): void
}

/**
 * The Metronome (ADR 0052): its tempo, meter and sound as saved, and its beats played on the audio
 * clock. The beats are queued ahead of the clock, each at its time; a timer only tops the queue up.
 * A change while it plays goes on from the beat heard, at once. The screen stays on while it plays.
 */
export function useMetronome(): Metronome {
  const { audio } = useServices()
  const store = useSettingsStoreApi()
  const settings = useSettings(selectMetronome)
  const latest = useRef(settings)
  const run = useRef<Run | null>(null)
  const taps = useRef<readonly number[]>([])
  const [playing, setPlaying] = useState(false)
  useWakeLock(playing)

  /** Queues the beats due within the look-ahead, each at its time on the audio clock. */
  const queue = useCallback(() => {
    const current = run.current
    if (!current) return
    const settings = latest.current
    const now = audio.now()
    const time = timeOf(settings)
    const { beats, next } = plannedBeats(current.next, now + AHEAD, time)
    for (const beat of beats)
      if (!mutedBar(beat.bar, trainerOf(settings.trainer)))
        audio.play(beatSounds(settings, beat.beat, 60 / tempoOf(time, beat.bar)), beat.at)
    current.next = next
    current.planned = [...current.planned.filter((beat) => beat.at > now - KEPT), ...beats]
  }, [audio])

  const stop = useCallback(() => {
    const current = run.current
    if (!current) return
    clearInterval(current.timer)
    run.current = null
    audio.stop()
    setPlaying(false)
  }, [audio])

  const start = useCallback(async () => {
    if (run.current) return
    await audio.unlock()
    if (run.current) return
    run.current = {
      next: { at: audio.now() + PLAY_DELAY, beat: 0, bar: 0 },
      planned: [],
      timer: setInterval(queue, TOP_UP),
    }
    queue()
    setPlaying(true)
  }, [audio, queue])

  // A change while it plays: what was queued goes, and the beats go on from the one heard.
  useEffect(() => {
    const before = latest.current
    latest.current = settings
    const current = run.current
    if (!current || before === settings) return
    const now = audio.now()
    audio.stop()
    current.next = goOnFrom(
      beatHeard(current.planned, now),
      now,
      timeOf(settings),
      before.meter !== settings.meter,
    )
    current.planned = current.planned.filter((beat) => beat.at <= now)
    queue()
  }, [audio, queue, settings])

  useEffect(() => stop, [stop])

  const everyFrame = useCallback(
    (look: () => void) => {
      if (!playing) return () => {}
      let frame = requestAnimationFrame(function follow() {
        look()
        frame = requestAnimationFrame(follow)
      })
      return () => cancelAnimationFrame(frame)
    },
    [playing],
  )
  const heard = () => (run.current ? beatHeard(run.current.planned, audio.now()) : undefined)
  const beat = useSyncExternalStore(everyFrame, () => heard()?.beat ?? null)
  const bar = useSyncExternalStore(everyFrame, () => heard()?.bar ?? null)

  const levels = beatLevels(meterOf(settings.meter), settings.levels)
  const save = useCallback(
    (change: Partial<MetronomeSettings>) => setMetronome(store, change),
    [store],
  )
  return {
    ...settings,
    playing,
    beat: playing ? beat : null,
    muted: playing && bar !== null && mutedBar(bar, trainerOf(settings.trainer)),
    toggle: () => (run.current ? stop() : void start()),
    nudge: (step) => save({ bpm: store.getState().metronome.bpm + step }),
    setBpm: (bpm) => save({ bpm }),
    // A new meter starts its squares afresh.
    setMeter: (meter) => save({ meter, levels: null }),
    setSound: (sound) => save({ sound }),
    setTrainer: (change) => save({ trainer: { ...store.getState().metronome.trainer, ...change } }),
    beatLevels: levels,
    tapBeat(beat) {
      const now = store.getState().metronome
      const shown = beatLevels(meterOf(now.meter), now.levels)
      const level = shown[beat]
      if (!level) return
      save({ levels: shown.map((each, i) => (i === beat ? nextLevel(each) : each)) })
    },
    setSubdivision: (subdivision) => save({ subdivision }),
    setSpeed: (change) => save({ speed: { ...store.getState().metronome.speed, ...change } }),
    tempoNow:
      playing && bar !== null && settings.speed.on ? speedAt(bar, settings.speed) : settings.bpm,
    tap() {
      const read = tapTempo(taps.current, performance.now())
      taps.current = read.taps
      if (read.bpm !== null) save({ bpm: read.bpm })
    },
  }
}
