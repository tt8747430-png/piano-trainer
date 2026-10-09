import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { Played } from '@/entities/take'
import { createFakeAudio } from '@/shared/api/audio'
import { createFakeMidi } from '@/shared/api/midi'
import { midi } from '@/shared/lib/music'
import { startRecorder, type RecorderPlan, type RecorderProgress } from './recorder'

/** 4/4 at 120: a beat is half a second, the count-in two seconds. */
const PLAN: RecorderPlan = {
  bars: [
    { startTick: 0, beats: 4 },
    { startTick: 48, beats: 4 },
  ],
  meter: '4/4',
  from: 0,
  tempo: 120,
  click: true,
  room: 100,
}

function setUp(plan: RecorderPlan = PLAN) {
  const audio = createFakeAudio()
  const keyboard = createFakeMidi()
  const progress: RecorderProgress[] = []
  const ended: (Played | null)[] = []
  audio.setNow(1)
  const stop = startRecorder(audio, keyboard, plan, {
    progress: (each) => progress.push(each),
    ended: (played) => ended.push(played),
  })
  /** Moves the audio clock to `at` and lets the recorder look at it. */
  const reach = (at: number) => {
    audio.setNow(at)
    vi.advanceTimersByTime(25)
  }
  return { audio, keyboard, progress, ended, stop, reach }
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
