import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react'
import { selectMetronome, useSettings, useSettingsStoreApi } from '@/entities/settings'
import type { MetronomeSettings } from '@/entities/settings'
import { setMetronome } from '@/features/set-preference'
import { PLAY_DELAY } from '@/shared/api/audio'
import { useWakeLock } from '@/shared/lib'
import {
  beatHeard,
  beatSounds,
  clampBpm,
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
import { quickTime, type SongTime } from './metronome-engine'
import { useTapTempo } from './use-tap-tempo'

/** How far ahead of the audio clock the beats are queued, in seconds: past a hidden page's timer. */
const AHEAD = 1.5
/** How often the queue is topped up, in milliseconds: when, never what time a beat sounds. */
const TOP_UP = 250
/** How long a beat heard is kept, in seconds, for the beat shown. */
const KEPT = 2

/** A saved meter read: 4/4 where it cannot be. */
const meterOf = (meter: string) => parseMeter(meter) ?? '4/4'

/** The Metronome's time: its tempo, or the speed trainer's bar by bar while it is on. */
const timeOf = ({ bpm, meter, speed }: MetronomeSettings): MetronomeTime =>
  speed.on ? { bpm, meter, bpmAt: (bar) => speedAt(bar, speed) } : { bpm, meter }
const tempoOf = (time: MetronomeTime, bar: number) => (time.bpmAt ? time.bpmAt(bar) : time.bpm)

/** The tempo the learner sets: the speed trainer's start while it is on, else the Metronome's. */
const tempoSet = ({ bpm, speed }: MetronomeSettings) => (speed.on ? speed.from : bpm)

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
  /** The bar playing since it started, from 1, while it plays. */
  readonly bar: number | null
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
  /** Whether it follows a song's tempo and time: its tempo is then the visit's, never saved. */
  readonly following: boolean
}

/**
 * The Metronome (ADR 0052, R29 B11's one engine): its tempo, meter and sound as saved, and its beats
 * played on the audio clock. The beats are queued ahead of the clock, each at its time; a timer only
 * tops the queue up. A change while it plays goes on from the beat heard, at once. The screen stays on
 * while it plays. Over a song (`song`, the quick metronome in a song's Tools) it counts the song's
 * tempo and time in the Metronome's voice, its trainers off, and its tempo steps are the visit's:
 * the Metronome's own tempo is written only where no song's applies.
 */
export function useMetronome(song: SongTime | null = null): Metronome {
  const { audio } = useServices()
  const store = useSettingsStoreApi()
  const saved = useSettings(selectMetronome)
  // Over a song: its tempo, stepped for the visit from where the song stands.
  const [stepped, setStepped] = useState<{ readonly from: number; readonly bpm: number } | null>(
    null,
  )
  const songBpm = song ? (stepped?.from === song.bpm ? stepped.bpm : song.bpm) : null
  const songMeter = song?.meter ?? null
  const settings = useMemo<MetronomeSettings>(() => {
    if (songBpm === null || songMeter === null) return saved
    const { voice } = quickTime(saved, { bpm: songBpm, meter: songMeter })
    return {
      ...saved,
      ...voice,
      bpm: songBpm,
      trainer: { ...saved.trainer, on: false },
      speed: { ...saved.speed, on: false },
    }
  }, [saved, songBpm, songMeter])
  const latest = useRef(settings)
  const run = useRef<Run | null>(null)
  const tapper = useTapTempo()
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
  // While the speed trainer is on, the tempo set is the one it starts at; over a song, the visit's.
  const setTempo = (bpm: number) => {
    if (song) {
      setStepped({ from: song.bpm, bpm: clampBpm(bpm) })
      return
    }
    const now = store.getState().metronome
    save(now.speed.on ? { speed: { ...now.speed, from: bpm } } : { bpm })
  }
  return {
    ...settings,
    playing,
    beat: playing ? beat : null,
    bar: playing && bar !== null ? bar + 1 : null,
    muted: playing && bar !== null && mutedBar(bar, trainerOf(settings.trainer)),
    toggle: () => (run.current ? stop() : void start()),
    nudge: (step) => setTempo((songBpm ?? tempoSet(store.getState().metronome)) + step),
    setBpm: (bpm) => setTempo(bpm),
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
      playing && bar !== null && settings.speed.on
        ? speedAt(bar, settings.speed)
        : tempoSet(settings),
    following: song !== null,
    tap() {
      const bpm = tapper.tap()
      if (bpm !== null) setTempo(bpm)
    },
  }
}
