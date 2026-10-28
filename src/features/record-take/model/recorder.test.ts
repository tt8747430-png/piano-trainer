import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { Played } from '@/entities/take'
import { createFakeAudio } from '@/shared/api/audio'
import { createFakeMidi } from '@/shared/api/midi'
import { midi, TICKS_PER_BEAT } from '@/shared/lib/music'
import { startRecorder, type RecorderPlan, type RecorderProgress } from './recorder'

const B = TICKS_PER_BEAT

/** 4/4 at 120: a beat is half a second, the count-in two seconds. */
const PLAN: RecorderPlan = {
  bars: [
    { startTick: 0, beats: 4 },
    { startTick: 4 * B, beats: 4 },
  ],
  meter: '4/4',
  from: 0,
  tempo: 120,
  room: 100,
  tune: [],
  along: { click: true, tune: false },
}

function setUp(plan: RecorderPlan = PLAN) {
  const audio = createFakeAudio()
  const keyboard = createFakeMidi()
  const progress: RecorderProgress[] = []
  const ended: (Played | null)[] = []
  audio.setNow(1)
  const session = startRecorder(audio, keyboard, plan, {
    progress: (each) => progress.push(each),
    ended: (played) => ended.push(played),
  })
  /** Moves the audio clock to `at` and lets the recorder look at it. */
  const reach = (at: number) => {
    audio.setNow(at)
    vi.advanceTimersByTime(25)
  }
  return { audio, keyboard, progress, ended, stop: session.stop, along: session.along, reach }
}

beforeEach(() => vi.useFakeTimers())
afterEach(() => vi.useRealTimers())

describe('startRecorder', () => {
  it('silences what sounds, then plays a bar’s count-in and the click from just after now', () => {
    const { audio } = setUp()
    expect(audio.stops).toBe(1)
    const [clicks] = audio.played
    expect(clicks?.at).toBeCloseTo(1.1)
    expect(clicks?.sounds.slice(0, 5).map((click) => click.at)).toEqual([0, 0.5, 1, 1.5, 2])
  })

  it('counts in, then says the bar and the seconds as the take goes', () => {
    const { progress, reach } = setUp()
    reach(1.2)
    reach(1.7)
    reach(3.15)
    reach(4.2)
    reach(5.2)
    expect(progress).toEqual([
      { stage: 'counting', beat: 1 },
      { stage: 'counting', beat: 2 },
      { stage: 'recording', bar: 0, seconds: 0 },
      { stage: 'recording', bar: 0, seconds: 1 },
      { stage: 'recording', bar: 1, seconds: 2 },
    ])
  })

  it('keeps what was played from the downbeat when stopped, and stops the click', () => {
    const { audio, keyboard, ended, stop } = setUp()
    audio.setNow(2.0)
    keyboard.press(midi(48))
    audio.setNow(3.1)
    keyboard.press(midi(60), { velocity: 90 })
    keyboard.pedal(true)
    audio.setNow(3.6)
    keyboard.release(midi(60))
    audio.setNow(4.1)
    stop()
    expect(audio.stops).toBe(2)
    expect(ended).toEqual([
      {
        notes: [{ midi: 60, at: 0, held: 500, velocity: 90 }],
        pedals: [{ pedal: 'sustain', down: 0, up: 1000 }],
        length: 1000,
        bars: [0, 2000],
      },
    ])
  })

  it('keeps each pedal’s presses as that pedal’s', () => {
    const { audio, keyboard, ended, stop } = setUp()
    audio.setNow(3.1)
    keyboard.press(midi(60))
    keyboard.pedal(true, { pedal: 'soft' })
    audio.setNow(3.6)
    keyboard.pedal(false, { pedal: 'soft' })
    audio.setNow(4.1)
    stop()
    expect(ended[0]?.pedals).toEqual([{ pedal: 'soft', down: 0, up: 500 }])
  })

  it('holds a pedal already down as Record is pressed from the take’s start', () => {
    const audio = createFakeAudio()
    const keyboard = createFakeMidi()
    const ended: (Played | null)[] = []
    audio.setNow(1)
    keyboard.pedal(true)
    const { stop } = startRecorder(audio, keyboard, PLAN, {
      progress: () => {},
      ended: (played) => ended.push(played),
    })
    audio.setNow(3.1)
    keyboard.press(midi(60))
    audio.setNow(4.1)
    stop()
    expect(ended[0]?.pedals).toEqual([{ pedal: 'sustain', down: 0, up: 1000 }])
  })

  it('plays the song’s tune under the take from its downbeat, and stops it at Stop', () => {
    const tune = [{ kind: 'note', midi: midi(72), at: 0, duration: 0.5, velocity: 0.2 }] as const
    const { audio, stop } = setUp({ ...PLAN, tune, along: { click: true, tune: true } })
    // Just after now (1 s), the count-in's 2 s, then the downbeat.
    expect(audio.played.at(-1)).toEqual({ sounds: tune, at: 3.1 })
    stop()
    expect(audio.stops).toBe(2)
  })

  it('plays no tune under the take while it is off', () => {
    const tune = [{ kind: 'note', midi: midi(72), at: 0, duration: 0.5, velocity: 0.2 }] as const
    const { audio } = setUp({ ...PLAN, tune })
    expect(audio.played).toHaveLength(1)
  })

  it('turns the click after the count-in off and on again while it records, the count-in kept', () => {
    const { audio, along } = setUp()
    // In the count-in (its beats 1.1, 1.6, 2.1 and 2.6 s): the rest of it, and no click after it.
    audio.setNow(1.5)
    along({ click: false, tune: false })
    expect(audio.stops).toBe(2)
    expect(audio.played.at(-1)?.at).toBeCloseTo(1.1)
    expect(audio.played.at(-1)?.sounds.map((click) => click.at)).toEqual([0.5, 1, 1.5])
    // Recording, the click comes back from the next beat on.
    audio.setNow(3.3)
    along({ click: true, tune: false })
    expect(audio.stops).toBe(3)
    expect(
      audio.played
        .at(-1)
        ?.sounds.slice(0, 3)
        .map((click) => click.at),
    ).toEqual([2.5, 3, 3.5])
  })

  it('brings the tune in under the take from where it is, and changes nothing asked for twice', () => {
    const tune = [
      { kind: 'note', midi: midi(72), at: 0, duration: 0.5, velocity: 0.2 },
      { kind: 'note', midi: midi(74), at: 1, duration: 0.5, velocity: 0.2 },
    ] as const
    const { audio, along } = setUp({ ...PLAN, tune })
    audio.setNow(3.3)
    along({ click: true, tune: true })
    expect(audio.played.at(-1)).toEqual({ sounds: [tune[1]], at: 3.1 })
    const plays = audio.played.length
    along({ click: true, tune: true })
    expect(audio.played).toHaveLength(plays)
  })

  it('changes nothing once it has stopped', () => {
    const { audio, stop, along } = setUp()
    audio.setNow(2)
    stop()
    const plays = audio.played.length
    along({ click: false, tune: true })
    expect(audio.played).toHaveLength(plays)
    expect(audio.stops).toBe(2)
  })

  it('keeps nothing when stopped in the count-in, and hears no key after', () => {
    const { audio, keyboard, ended, stop } = setUp()
    audio.setNow(2)
    stop()
    stop()
    keyboard.press(midi(60))
    expect(ended).toEqual([null])
  })

  it('stops itself when the takes have no more room, counting only the keys it keeps', () => {
    const { audio, keyboard, ended } = setUp({ ...PLAN, room: 2 })
    audio.setNow(2.5)
    keyboard.press(midi(48))
    audio.setNow(3.5)
    keyboard.press(midi(110))
    keyboard.press(midi(60))
    keyboard.press(midi(64))
    keyboard.press(midi(67))
    expect(ended.map((played) => played?.notes.map((n) => n.midi))).toEqual([[60, 64]])
  })

  it('stops itself at the longest take', () => {
    const { ended, reach } = setUp()
    reach(3.1 + 10 * 60)
    expect(ended).toHaveLength(1)
    expect(ended[0]?.length).toBe(600_000)
  })
})
