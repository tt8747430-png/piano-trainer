import { describe, expect, it } from 'vitest'
import { BUILT_IN_PATTERNS, patternBook } from '@/entities/pattern'
import { patternSample } from './pattern-sample'

const onsets = (sample: ReturnType<typeof patternSample>, hand: 'rh' | 'lh') => [
  ...new Set(sample.music.notes.filter((n) => n.hand === hand).map((n) => n.startTick)),
]

describe('patternSample', () => {
  it('plays a pattern over a bar of C major in 4/4, each hand on its own figure', () => {
    const sample = patternSample(BUILT_IN_PATTERNS.require('M1'), BUILT_IN_PATTERNS)
    expect(sample.piece).toBeNull()
    expect(sample.music.bars).toHaveLength(1)
    expect(sample.music.meter).toBe('4/4')
    expect(sample.music.chords.map((chord) => chord.symbol)).toEqual(['C'])
    expect(onsets(sample, 'rh')).toEqual([0, 12, 24, 36]) // the chord on every beat
    expect(onsets(sample, 'lh')).toEqual([0]) // a whole-note octave
    expect(new Set(sample.music.notes.map((n) => n.midi % 12))).toEqual(new Set([0, 4, 7]))
    expect(sample.sounds.filter((sound) => sound.kind === 'note')).toHaveLength(
      sample.music.notes.length,
    )
    expect(sample.shown.keys.length).toBeGreaterThan(0)
  })

  it('plays a pattern that plays the tune over the first line of «Отче наш»', () => {
    const sample = patternSample(BUILT_IN_PATTERNS.require('r5'), BUILT_IN_PATTERNS)
    expect(sample.piece?.id).toBe('otche')
    expect(sample.music.notes.some((n) => n.hand === 'rh')).toBe(true)
    const lastBar = sample.music.bars.at(-1)
    expect(lastBar).toBeDefined()
    const end = (lastBar?.startTick ?? 0) + (lastBar?.beats ?? 0) * 12
    expect(sample.music.notes.every((n) => n.startTick < end)).toBe(true)
  })

  it('plays the learner’s own pattern as written', () => {
    const book = patternBook([{ id: 'my-1', name: 'Sunday', rh: 'b1', lh: 'r' }])
    const sample = patternSample(book.require('my-1'), book)
    expect(onsets(sample, 'rh')).toEqual([0, 12, 24, 36])
  })
})
