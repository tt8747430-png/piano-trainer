import { describe, expect, it } from 'vitest'
import { midi, note, type SpelledNote } from '@/shared/lib/music'
import { labelLead, lineLead, measureWidths } from './measure-widths'
import { notate } from './notate'
import type { TimedMusic, TimedNote } from './types'

const rh = (
  key: number,
  spelled: SpelledNote,
  startTick: number,
  durationTicks: number,
): TimedNote => ({
  midi: midi(key),
  spelled,
  hand: 'rh',
  startTick,
  durationTicks,
})

const music = (notes: TimedNote[], chords: TimedMusic['chords'] = []): TimedMusic => ({
  key: { tonic: note('C'), minor: false },
  meter: '4/4',
  bars: [{ startTick: 0, beats: 4 }],
  notes,
  chords,
})

describe('measureWidths', () => {
  it('gives a bar of many notes more room than a bar of one', () => {
    const quarters = [0, 24, 48, 72].map((at) => rh(60, note('C'), at, 24))
    const eighths = [0, 12, 24, 36, 48, 60, 72, 84].map((at) => rh(60, note('C'), at, 12))
    const [whole] = measureWidths(notate(music([rh(60, note('C'), 0, 96)])))
    const [four] = measureWidths(notate(music(quarters)))
    const [eight] = measureWidths(notate(music(eighths)))
    expect(whole).toBeLessThan(four ?? 0)
    expect(four).toBeLessThan(eight ?? 0)
  })

  it('widens a bar for an accidental', () => {
    const plain = measureWidths(
      notate(music([0, 24, 48, 72].map((at) => rh(60, note('C'), at, 24)))),
    )
    const sharp = measureWidths(
      notate(music([0, 24, 48, 72].map((at) => rh(61, note('C', 1), at, 24)))),
    )
    expect(sharp[0]).toBeGreaterThan(plain[0] ?? 0)
  })

  it('makes room for a bar’s chord names side by side, more of a smaller staff’s units', () => {
    const chords = ['Dbmaj7/Ab', 'Gbm6/A', 'Ebm7/Bb', 'Ab7sus4'].map((symbol, i) => ({
      startTick: i * 24,
      symbol,
    }))
    const notes = [rh(60, note('C'), 0, 96)]
    const [named] = measureWidths(notate(music(notes, chords)))
    const [bare] = measureWidths(notate(music(notes)))
    const [smaller] = measureWidths(notate(music(notes, chords)), 0.5)
    expect(named).toBeGreaterThan((bare ?? 0) * 2)
    expect(smaller).toBeCloseTo((named ?? 0) * 2)
  })

  it('makes no room for chord names that are not shown', () => {
    const chords = ['Dbmaj7/Ab', 'Gbm6/A'].map((symbol, i) => ({ startTick: i * 48, symbol }))
    const notes = [rh(60, note('C'), 0, 96)]
    expect(measureWidths(notate(music(notes, chords)), 1, false)).toEqual(
      measureWidths(notate(music(notes))),
    )
  })
})

describe('lineLead', () => {
  it('takes more for a key of more flats', () => {
    expect(lineLead({ key: { tonic: note('D', -1), minor: false } })).toBeGreaterThan(
      lineLead({ key: { tonic: note('C'), minor: false } }),
    )
  })
})

describe('labelLead (ADR 0114)', () => {
  it('gives the first line the room its staves’ names take, the longest, as Verovio indents it', () => {
    expect(labelLead({})).toBe(0)
    // Verovio's indents at scale 1: Piano 73, Melody 75, Фортепиано 122 px.
    const piano = labelLead({ piano: { text: 'Piano' } })
    expect(Math.abs(piano - 73)).toBeLessThan(6)
    const both = labelLead({ staff0: { text: 'Melody' }, piano: { text: 'Piano' } })
    expect(Math.abs(both - 75)).toBeLessThan(6)
    const russian = labelLead({
      staff0: { text: 'Мелодия' },
      staff1: { text: 'Голос', placeholder: true },
      piano: { text: 'Фортепиано' },
    })
    expect(Math.abs(russian - 122)).toBeLessThan(8)
  })

  it('takes that room in the first measure alone, so the first line holds as much less', () => {
    const score = notate({
      ...music([rh(60, note('C'), 0, 96), rh(62, note('D'), 96, 96)]),
      bars: [
        { startTick: 0, beats: 4 },
        { startTick: 96, beats: 4 },
      ],
    })
    const [first = 0, second = 0] = measureWidths(score)
    const labels = { piano: { text: 'Piano' } }
    expect(measureWidths(score, 1, true, labels)).toEqual([first + labelLead(labels), second])
  })
})
