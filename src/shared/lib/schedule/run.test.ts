import { describe, expect, it } from 'vitest'
import { note, placeScale } from '@/shared/lib/music'
import { runSounds, scaleRun, type RunWay } from './run'

const C_MAJOR: RunWay = { notes: placeScale(note('C'), 'major') }
const C_KEY = { tonic: note('C'), minor: false }

describe('scaleRun', () => {
  it('goes up and back down in even 8ths, written in 4/4', () => {
    const run = scaleRun(C_MAJOR, { rhythm: 'even', hands: 'rh', key: C_KEY })
    expect(run.notes.map((n) => n.midi)).toEqual([
      60, 62, 64, 65, 67, 69, 71, 72, 71, 69, 67, 65, 64, 62, 60,
    ])
    expect(run.notes.map((n) => n.startTick).slice(0, 3)).toEqual([0, 6, 12])
    expect(run.meter).toBe('4/4')
    expect(run.bars).toEqual([
      { startTick: 0, beats: 4 },
      { startTick: 48, beats: 4 },
    ])
  })

  it('repeats the rhythm’s lengths, a triplet 8th four ticks', () => {
    const longShort = scaleRun(C_MAJOR, { rhythm: 'long-short', hands: 'rh', key: C_KEY })
    expect(longShort.notes.slice(0, 3).map((n) => n.startTick)).toEqual([0, 9, 12])
    const triplets = scaleRun(C_MAJOR, {
      rhythm: 'long-short-short-short',
      hands: 'rh',
      key: C_KEY,
    })
    expect(triplets.notes.slice(0, 5).map((n) => n.durationTicks)).toEqual([12, 4, 4, 4, 12])
  })

  it('plays the left hand an octave lower, both hands together, each note with its hand’s finger', () => {
    const fingers: RunWay['fingers'] = {
      rh: [1, 2, 3, 1, 2, 3, 4, 5],
      lh: [5, 4, 3, 2, 1, 3, 2, 1],
    }
    const both = scaleRun({ ...C_MAJOR, fingers }, { rhythm: 'even', hands: 'both', key: C_KEY })
    expect(both.notes.filter((n) => n.startTick === 0)).toMatchObject([
      { midi: 48, hand: 'lh', finger: 5 },
      { midi: 60, hand: 'rh', finger: 1 },
    ])
    // Coming down, a note keeps the finger it went up with.
    expect(both.notes.filter((n) => n.hand === 'rh').at(-2)).toMatchObject({ midi: 62, finger: 2 })
  })
})

describe('runSounds', () => {
  it('sounds each note at its tick, a little longer than written, softer with both hands', () => {
    const sounds = runSounds(scaleRun(C_MAJOR, { rhythm: 'even', hands: 'rh', key: C_KEY }), 60)
    expect(sounds[1]).toMatchObject({ kind: 'note', midi: 62, velocity: 0.2 })
    expect(sounds[1]?.at).toBeCloseTo(0.5)
    expect(sounds[1]?.duration).toBeCloseTo(0.55)
    const both = runSounds(scaleRun(C_MAJOR, { rhythm: 'even', hands: 'both', key: C_KEY }), 60)
    expect(both[0]?.velocity).toBe(0.16)
  })
})
