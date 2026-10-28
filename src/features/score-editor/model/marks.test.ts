import { describe, expect, it } from 'vitest'
import { TICKS_PER_BEAT } from '@/shared/lib/music'
import { draftOf } from '../testing/test-draft'
import { hasMark, markNotes, setTempoChange, setText, toggleNumeral, withMark } from './marks'
import { musicToSave } from './draft'

const B = TICKS_PER_BEAT

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
    const slurred = markNotes(draft, 'rh', { from: 0, to: 8 * B }, { kind: 'slurStart' })
    expect(marksOf(slurred.hands.rh)).toEqual([
      { slurStart: true },
      { slurStart: true },
      undefined,
      { slurEnd: true },
    ])
    const swell = markNotes(
      draft,
      'rh',
      { from: 0, to: 4 * B },
      { kind: 'hairpin', hairpin: 'cresc' },
    )
    expect(marksOf(swell.hands.rh).at(2)).toEqual({ hairpin: 'end' })
  })

  it('puts an octave line on every note of a span, and saves it', () => {
    const higher = markNotes(draft, 'rh', { from: 0, to: 8 * B }, { kind: 'octave', octave: '8va' })
    expect(higher.hands.rh.every((n) => n.marks?.octave === '8va')).toBe(true)
    expect(musicToSave(higher)?.hands?.rh).toBe('C4+E4/2[8va] G4/2[8va] | A4/4[8va]')
  })

  it('writes an expression on a span’s first onset, and holds the pedal from it to its last', () => {
    const sweet = markNotes(
      draft,
      'rh',
      { from: 0, to: 8 * B },
      { kind: 'expression', expression: 'dolce' },
    )
    expect(marksOf(sweet.hands.rh)).toEqual([
      { expression: 'dolce' },
      { expression: 'dolce' },
      undefined,
      undefined,
    ])
    const held = markNotes(draft, 'rh', { from: 0, to: 8 * B }, { kind: 'pedal', pedal: 'down' })
    expect(marksOf(held.hands.rh)).toEqual([
      { pedal: 'down' },
      { pedal: 'down' },
      undefined,
      { pedal: 'up' },
    ])
    expect(musicToSave(held)?.hands?.rh).toBe('C4+E4/2[ped] G4/2 | A4/4[pedup]')
  })

  it('changes nothing where no note starts', () => {
    expect(markNotes(draft, 'rh', B, { kind: 'arpeggio' })).toBe(draft)
  })
})

describe('the words on a note (ADR 0097)', () => {
  const draft = draftOf({ hands: { rh: 'C4/2 E4/2 | G4/4', lh: 'r/4 | r/4' } })

  it('puts the Roman numeral of the chord sounding under the note, and takes it off again', () => {
    const marked = toggleNumeral(draft, 'rh', 0)
    expect(marked.hands.rh[0]?.marks).toEqual({ numeral: 'I' })
    expect(toggleNumeral(marked, 'rh', 0).hands.rh[0]?.marks).toBeUndefined()
    expect(toggleNumeral(draft, 'rh', 4 * B).hands.rh[2]?.marks).toEqual({ numeral: 'IV' })
    expect(musicToSave(marked)?.hands?.rh).toBe('C4/2[rn:I] E4/2 | G4/4')
  })

  it('sets a tempo mark at the note and free text over it, null or empty taking them off', () => {
    const faster = setTempoChange(draft, 'rh', 2 * B, 120)
    expect(faster.hands.rh[1]?.marks).toEqual({ tempo: 120 })
    expect(setTempoChange(faster, 'rh', 2 * B, null).hands.rh[1]?.marks).toBeUndefined()
    const worded = setText(draft, 'rh', { from: 0, to: 4 * B }, ' con brio ')
    expect(marksOf(worded.hands.rh)).toEqual([{ text: 'con brio' }, undefined, undefined])
    expect(setText(worded, 'rh', 0, '').hands.rh[0]?.marks).toBeUndefined()
  })

  it('puts a swing mark on the first onset of a span', () => {
    const swung = markNotes(
      draft,
      'rh',
      { from: 0, to: 4 * B },
      { kind: 'swing', swing: 'eighths' },
    )
    expect(marksOf(swung.hands.rh)).toEqual([{ swing: 'eighths' }, undefined, undefined])
  })
})
