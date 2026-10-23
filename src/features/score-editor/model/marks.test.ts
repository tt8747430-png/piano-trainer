import { describe, expect, it } from 'vitest'
import { draftOf } from '../testing/test-draft'
import { hasMark, markNotes, withMark } from './marks'
import { musicToSave } from './draft'

const marksOf = (notes: readonly { readonly marks?: unknown }[]) => notes.map((n) => n.marks)

describe('withMark', () => {
  it('puts a mark on and takes it off, leaving no marks as none', () => {
    const staccato = { kind: 'articulation', articulation: 'staccato' } as const
    const on = withMark(undefined, staccato, true)
    expect(on).toEqual({ articulations: ['staccato'] })
    expect(hasMark(on, staccato)).toBe(true)
    expect(withMark(on, staccato, false)).toBeUndefined()
  })

  it('puts one of a kind in another’s place', () => {
    expect(withMark({ dynamic: 'p' }, { kind: 'dynamic', dynamic: 'f' }, true)).toEqual({
      dynamic: 'f',
    })
    expect(withMark({ dynamic: 'p' }, { kind: 'dynamic', dynamic: 'f' }, false)).toEqual({
      dynamic: 'p',
    })
  })
})

describe('markNotes', () => {
  const draft = draftOf({ hands: { rh: 'C4+E4/2 G4/2 | A4/4' } })

  it('toggles a mark on every note at the caret', () => {
    const accent = { kind: 'articulation', articulation: 'accent' } as const
    const on = markNotes(draft, 'rh', 0, accent)
    expect(marksOf(on.hands.rh)).toEqual([
      { articulations: ['accent'] },
      { articulations: ['accent'] },
      undefined,
      undefined,
    ])
    expect(markNotes(on, 'rh', 0, accent).hands.rh).toEqual(draft.hands.rh)
  })

  it('draws a slur or a hairpin over a span from its first onset to its last', () => {
    const slurred = markNotes(draft, 'rh', { from: 0, to: 192 }, { kind: 'slurStart' })
    expect(marksOf(slurred.hands.rh)).toEqual([
      { slurStart: true },
      { slurStart: true },
      undefined,
      { slurEnd: true },
    ])
    const swell = markNotes(draft, 'rh', { from: 0, to: 96 }, { kind: 'hairpin', hairpin: 'cresc' })
    expect(marksOf(swell.hands.rh).at(2)).toEqual({ hairpin: 'end' })
  })

  it('puts an octave line on every note of a span, and saves it', () => {
    const higher = markNotes(draft, 'rh', { from: 0, to: 192 }, { kind: 'octave', octave: '8va' })
    expect(higher.hands.rh.every((n) => n.marks?.octave === '8va')).toBe(true)
    expect(musicToSave(higher)?.hands?.rh).toBe('C4+E4/2[8va] G4/2[8va] | A4/4[8va]')
  })

  it('writes an expression on a span’s first onset, and holds the pedal from it to its last', () => {
    const sweet = markNotes(
      draft,
      'rh',
      { from: 0, to: 192 },
      { kind: 'expression', expression: 'dolce' },
    )
    expect(marksOf(sweet.hands.rh)).toEqual([
      { expression: 'dolce' },
      { expression: 'dolce' },
      undefined,
      undefined,
    ])
    const held = markNotes(draft, 'rh', { from: 0, to: 192 }, { kind: 'pedal', pedal: 'down' })
    expect(marksOf(held.hands.rh)).toEqual([
      { pedal: 'down' },
      { pedal: 'down' },
      undefined,
      { pedal: 'up' },
    ])
    expect(musicToSave(held)?.hands?.rh).toBe('C4+E4/2[ped] G4/2 | A4/4[pedup]')
  })

  it('changes nothing where no note starts', () => {
    expect(markNotes(draft, 'rh', 24, { kind: 'arpeggio' })).toBe(draft)
  })
})
