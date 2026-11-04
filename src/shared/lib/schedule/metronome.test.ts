import { describe, expect, it } from 'vitest'
import {
  BPM_RANGE,
  beatHeard,
  beatsOf,
  beatSounds,
  clampBpm,
  goOnFrom,
  isMetronomeMeter,
  mutedBar,
  plannedBeats,
} from './metronome'
import type { ClickSound, DrumSound } from './schedule'

/** A beat's sounds as their voices, `!` where accented. */
const voices = (sounds: readonly (ClickSound | DrumSound)[]) =>
  sounds.map((sound) =>
    sound.kind === 'drum' ? sound.piece : `${sound.voice ?? 'click'}${sound.accent ? '!' : ''}`,
  )

const voiced = (meter: string, sound: 'click' | 'beep' | 'drum') => ({
  meter,
  sound,
  levels: null,
  subdivision: 'none' as const,
})

describe('the Metronome’s beats', () => {
  it('counts each meter’s beats as players count them: 6/8 in two, 2/2 in halves (A39)', () => {
    expect(
      ['4/4', '3/4', '2/4', '2/2', '6/8', '12/8', '7/8'].map((meter) => beatsOf(meter)),
    ).toEqual([4, 3, 2, 2, 2, 4, 7])
  })

  it('keeps any time signature it can count, and no other', () => {
    expect(['5/4', '9/8', '7/8'].every(isMetronomeMeter)).toBe(true)
    expect(['4/3', '', 4].some(isMetronomeMeter)).toBe(false)
  })

  it('keeps a tempo within its range, in whole beats a minute', () => {
    expect(clampBpm(10)).toBe(BPM_RANGE.min)
    expect(clampBpm(999)).toBe(BPM_RANGE.max)
    expect(clampBpm(120.4)).toBe(120)
  })

  it('accents the first beat of a bar, a click or a beep', () => {
    expect(voices(beatSounds(voiced('3/4', 'click'), 0, 0.5))).toEqual(['click!'])
    expect(voices(beatSounds(voiced('3/4', 'click'), 1, 0.5))).toEqual(['click'])
    expect(voices(beatSounds(voiced('4/4', 'beep'), 0, 0.5))).toEqual(['beep!'])
    expect(voices(beatSounds(voiced('4/4', 'beep'), 3, 0.5))).toEqual(['beep'])
  })

  it('plays a drum groove on the recorded kit: kick, snare, the closed hat on 8ths (R29 SND)', () => {
    const first = beatSounds(voiced('4/4', 'drum'), 0, 0.5)
    expect(first).toEqual([
      { kind: 'drum', at: 0, piece: 'kick', velocity: 1 },
      { kind: 'drum', at: 0, piece: 'hatClosed', velocity: 0.8 },
      { kind: 'drum', at: 0.25, piece: 'hatClosed', velocity: 0.55 },
    ])
    expect(
      beatSounds(voiced('4/4', 'drum'), 1, 0.5).map((sound) =>
        sound.kind === 'drum' ? sound.piece : sound.kind,
      ),
    ).toEqual(['snare', 'hatClosed', 'hatClosed'])
  })

  it('subdivides softer than the beat, and leaves a silent beat silent', () => {
    const beat = beatSounds({ ...voiced('2/4', 'click'), subdivision: '8ths' }, 1, 0.5)
    expect(beat.map((sound) => [sound.at, sound.kind === 'click' ? sound.gain : null])).toEqual([
      [0, 0.6],
      [0.25, 0.35],
    ])
    const levels = ['downbeat', 'silent'] as const
    expect(beatSounds({ ...voiced('2/4', 'click'), levels }, 1, 0.5)).toEqual([])
  })
})

describe('plannedBeats', () => {
  it('plans each beat due before a time, round the bar, and says the next', () => {
    // At 120 a beat is half a second.
    const { beats, next } = plannedBeats({ at: 1, beat: 2, bar: 0 }, 2.6, {
      bpm: 120,
      meter: '3/4',
    })
    expect(beats).toEqual([
      { at: 1, beat: 2, bar: 0 },
      { at: 1.5, beat: 0, bar: 1 },
      { at: 2, beat: 1, bar: 1 },
      { at: 2.5, beat: 2, bar: 1 },
    ])
    expect(next).toEqual({ at: 3, beat: 0, bar: 2 })
  })

  it('plans nothing before the next beat is due', () => {
    expect(plannedBeats({ at: 3, beat: 0, bar: 0 }, 2, { bpm: 60, meter: '4/4' })).toEqual({
      beats: [],
      next: { at: 3, beat: 0, bar: 0 },
    })
  })
})

describe('beatHeard', () => {
  const planned = [
    { at: 1, beat: 0, bar: 0 },
    { at: 1.5, beat: 1, bar: 0 },
    { at: 2, beat: 2, bar: 0 },
  ]

  it('is the last beat planned at or before now', () => {
    expect(beatHeard(planned, 1.7)).toEqual({ at: 1.5, beat: 1, bar: 0 })
    expect(beatHeard(planned, 2)).toEqual({ at: 2, beat: 2, bar: 0 })
  })

  it('is none before the first beat sounds', () => {
    expect(beatHeard(planned, 0.9)).toBeUndefined()
  })
})

describe('goOnFrom', () => {
  it('goes on a beat at the new tempo after the beat heard', () => {
    expect(goOnFrom({ at: 2, beat: 1, bar: 5 }, 2.1, { bpm: 60, meter: '4/4' }, false)).toEqual({
      at: 3,
      beat: 2,
      bar: 5,
    })
  })

  it('starts a new bar where the meter changed', () => {
    expect(goOnFrom({ at: 2, beat: 1, bar: 5 }, 2.1, { bpm: 60, meter: '3/4' }, true)).toEqual({
      at: 3,
      beat: 0,
      bar: 6,
    })
  })

  it('wraps round a bar shorter than the beat heard', () => {
    expect(goOnFrom({ at: 2, beat: 3, bar: 1 }, 2.1, { bpm: 60, meter: '4/4' }, false)).toEqual({
      at: 3,
      beat: 0,
      bar: 2,
    })
  })

  it('never goes on in the past: a beat already due sounds a moment from now', () => {
    expect(goOnFrom({ at: 1, beat: 0, bar: 0 }, 2.5, { bpm: 60, meter: '4/4' }, false)).toEqual({
      at: 2.55,
      beat: 1,
      bar: 0,
    })
  })

  it('starts the bar a moment from now where no beat was heard', () => {
    expect(goOnFrom(undefined, 4, { bpm: 60, meter: '4/4' }, false)).toEqual({
      at: 4.05,
      beat: 0,
      bar: 0,
    })
  })
})

describe('the bar trainer', () => {
  it('plays its bars, then mutes its bars, round and round from the first', () => {
    const trainer = { play: 2, mute: 1 } as const
    expect([0, 1, 2, 3, 4, 5].map((bar) => mutedBar(bar, trainer))).toEqual([
      false,
      false,
      true,
      false,
      false,
      true,
    ])
  })

  it('mutes nothing while it is off', () => {
    expect(mutedBar(3, null)).toBe(false)
  })
})
