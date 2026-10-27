import { describe, expect, it } from 'vitest'
import {
  BPM_RANGE,
  beatHeard,
  beatsOf,
  beatSounds,
  clampBpm,
  goOnFrom,
  plannedBeats,
} from './metronome'

/** A beat's sounds as their voices, `!` where accented. */
const voices = (sounds: readonly { voice?: string; accent: boolean }[]) =>
  sounds.map(({ voice, accent }) => `${voice ?? 'click'}${accent ? '!' : ''}`)

describe('the Metronome’s beats', () => {
  it('counts each meter’s beats, a beat of 6/8 an eighth, of 2/2 a half', () => {
    expect(
      ['4/4', '3/4', '2/4', '2/2', '6/8', '1/4'].map((meter) => beatsOf(meter as never)),
    ).toEqual([4, 3, 2, 2, 6, 1])
  })

  it('keeps a tempo within its range, in whole beats a minute', () => {
    expect(clampBpm(10)).toBe(BPM_RANGE.min)
    expect(clampBpm(999)).toBe(BPM_RANGE.max)
    expect(clampBpm(120.4)).toBe(120)
  })

  it('accents the first beat of a bar, a click or a beep', () => {
    expect(voices(beatSounds('3/4', 'click', 0))).toEqual(['click!'])
    expect(voices(beatSounds('3/4', 'click', 1))).toEqual(['click'])
    expect(voices(beatSounds('4/4', 'beep', 0))).toEqual(['beep!'])
    expect(voices(beatSounds('4/4', 'beep', 3))).toEqual(['beep'])
  })

  it('plays a drum beat: the kick on the bar’s first, the snare on the backbeat, the hat on every beat', () => {
    const bar = (meter: '4/4' | '3/4' | '6/8') =>
      Array.from({ length: beatsOf(meter) }, (_, beat) => voices(beatSounds(meter, 'drum', beat)))
    expect(bar('4/4')).toEqual([
      ['hat', 'kick!'],
      ['hat', 'snare'],
      ['hat', 'kick'],
      ['hat', 'snare'],
    ])
    expect(bar('3/4')).toEqual([
      ['hat', 'kick!'],
      ['hat', 'snare'],
      ['hat', 'snare'],
    ])
    expect(bar('6/8')).toEqual([
      ['hat', 'kick!'],
      ['hat'],
      ['hat'],
      ['hat', 'snare'],
      ['hat'],
      ['hat'],
    ])
  })

  it('sounds every beat at its start', () => {
    for (const sound of beatSounds('4/4', 'drum', 0)) expect(sound.at).toBe(0)
  })
})

describe('plannedBeats', () => {
  it('plans each beat due before a time, round the bar, and says the next', () => {
    // At 120 a beat is half a second.
    const { beats, next } = plannedBeats({ at: 1, beat: 2 }, 2.6, { bpm: 120, meter: '3/4' })
    expect(beats).toEqual([
      { at: 1, beat: 2 },
      { at: 1.5, beat: 0 },
      { at: 2, beat: 1 },
      { at: 2.5, beat: 2 },
    ])
    expect(next).toEqual({ at: 3, beat: 0 })
  })

  it('plans nothing before the next beat is due', () => {
    expect(plannedBeats({ at: 3, beat: 0 }, 2, { bpm: 60, meter: '4/4' })).toEqual({
      beats: [],
      next: { at: 3, beat: 0 },
    })
  })
})

describe('beatHeard', () => {
  const planned = [
    { at: 1, beat: 0 },
    { at: 1.5, beat: 1 },
    { at: 2, beat: 2 },
  ]

  it('is the last beat planned at or before now', () => {
    expect(beatHeard(planned, 1.7)).toEqual({ at: 1.5, beat: 1 })
    expect(beatHeard(planned, 2)).toEqual({ at: 2, beat: 2 })
  })

  it('is none before the first beat sounds', () => {
    expect(beatHeard(planned, 0.9)).toBeUndefined()
  })
})

describe('goOnFrom', () => {
  it('goes on a beat at the new tempo after the beat heard', () => {
    expect(goOnFrom({ at: 2, beat: 1 }, 2.1, { bpm: 60, meter: '4/4' }, false)).toEqual({
      at: 3,
      beat: 2,
    })
  })

  it('starts a new bar where the meter changed', () => {
    expect(goOnFrom({ at: 2, beat: 1 }, 2.1, { bpm: 60, meter: '3/4' }, true)).toEqual({
      at: 3,
      beat: 0,
    })
  })

  it('wraps round a bar shorter than the beat heard', () => {
    expect(goOnFrom({ at: 2, beat: 3 }, 2.1, { bpm: 60, meter: '4/4' }, false)).toEqual({
      at: 3,
      beat: 0,
    })
  })

  it('never goes on in the past: a beat already due sounds a moment from now', () => {
    expect(goOnFrom({ at: 1, beat: 0 }, 2.5, { bpm: 60, meter: '4/4' }, false)).toEqual({
      at: 2.55,
      beat: 1,
    })
  })

  it('starts the bar a moment from now where no beat was heard', () => {
    expect(goOnFrom(undefined, 4, { bpm: 60, meter: '4/4' }, false)).toEqual({ at: 4.05, beat: 0 })
  })
})
