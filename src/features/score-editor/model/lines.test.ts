import { describe, expect, it } from 'vitest'
import { draftOf } from '../testing/test-draft'
import { musicToSave } from './draft'
import { lineDrawn, lineOver, lineSpan } from './lines'
import { initialEditor, type EditorState } from './state'

const marksOf = (notes: readonly { readonly marks?: unknown }[]) => notes.map((n) => n.marks)

// A beat is 24 ticks: C4 E4 G4 A4 quarters in bar 1, then B4 C5 halves in bar 2.
const draft = draftOf({ hands: { rh: 'C4/1 E4/1 G4/1 A4/1 | B4/2 C5/2' } })
const BAR = { from: 0, to: 96 }

describe('lineOver', () => {
  it('draws a slur from the span’s first note to its last in one go', () => {
    const slurred = lineOver(draft, 'rh', BAR, 'slur')
    expect(marksOf(slurred.hands.rh)).toEqual([
      { slurStart: true },
      undefined,
      undefined,
      { slurEnd: true },
      undefined,
      undefined,
    ])
    expect(musicToSave(slurred)?.hands?.rh).toBe('C4/1[(] E4/1 G4/1 A4/1[)] | B4/2 C5/2')
  })

  it('draws a crescendo or a diminuendo hairpin, its end on the last note', () => {
    expect(marksOf(lineOver(draft, 'rh', BAR, 'cresc').hands.rh).slice(0, 4)).toEqual([
      { hairpin: 'cresc' },
      undefined,
      undefined,
      { hairpin: 'end' },
    ])
    expect(marksOf(lineOver(draft, 'rh', BAR, 'dim').hands.rh).slice(0, 4)).toEqual([
      { hairpin: 'dim' },
      undefined,
      undefined,
      { hairpin: 'end' },
    ])
  })

  it('puts an octave line on every note of the span, one replacing the other', () => {
    const higher = lineOver(draft, 'rh', BAR, '8va')
    expect(marksOf(higher.hands.rh)).toEqual([
      { octave: '8va' },
      { octave: '8va' },
      { octave: '8va' },
      { octave: '8va' },
      undefined,
      undefined,
    ])
    const lower = lineOver(higher, 'rh', BAR, '8vb')
    expect(lower.hands.rh.slice(0, 4).every((n) => n.marks?.octave === '8vb')).toBe(true)
  })

  it('takes the line away where it is already drawn', () => {
    for (const line of ['slur', 'cresc', 'dim', '8va', '8vb'] as const) {
      const drawn = lineOver(draft, 'rh', BAR, line)
      expect(lineDrawn(drawnState(drawn), line)).toBe(true)
      expect(lineOver(drawn, 'rh', BAR, line).hands.rh).toEqual(draft.hands.rh)
    }
  })

  it('redraws a hairpin over a new span, the old one inside it gone', () => {
    const short = lineOver(draft, 'rh', { from: 24, to: 72 }, 'cresc')
    const long = lineOver(short, 'rh', BAR, 'dim')
    expect(marksOf(long.hands.rh).slice(0, 4)).toEqual([
      { hairpin: 'dim' },
      undefined,
      undefined,
      { hairpin: 'end' },
    ])
  })

  it('reaches the next note where the span holds one onset alone', () => {
    const last = lineOver(draft, 'rh', { from: 72, to: 96 }, 'slur')
    expect(marksOf(last.hands.rh).slice(3, 5)).toEqual([{ slurStart: true }, { slurEnd: true }])
  })

  it('keeps a slur that ends where the new one starts', () => {
    const first = lineOver(draft, 'rh', { from: 0, to: 48 }, 'slur')
    const second = lineOver(first, 'rh', { from: 24, to: 96 }, 'slur')
    expect(marksOf(second.hands.rh).slice(0, 4)).toEqual([
      { slurStart: true },
      { slurEnd: true, slurStart: true },
      undefined,
      { slurEnd: true },
    ])
  })

  it('changes nothing where the span holds no notes', () => {
    expect(lineOver(draft, 'lh', BAR, 'slur')).toBe(draft)
  })
})

const drawnState = (d: typeof draft, extra: Partial<EditorState> = {}): EditorState => ({
  ...initialEditor(d),
  layer: 'rh',
  ...extra,
})

describe('lineSpan', () => {
  it('runs from the caret to the end of its bar', () => {
    expect(lineSpan(drawnState(draft, { caret: 24 }))).toEqual({ from: 24, to: 96 })
    expect(lineSpan(drawnState(draft, { caret: 120 }))).toEqual({ from: 120, to: 192 })
  })

  it('runs over the bars chosen, from the first’s start to the last’s end', () => {
    expect(lineSpan(drawnState(draft, { caret: 24, selection: { anchor: 1, head: 0 } }))).toEqual({
      from: 0,
      to: 192,
    })
  })
})

describe('lineDrawn', () => {
  it('says whether the line is drawn where it would go, and null where no note is', () => {
    const state = drawnState(lineOver(draft, 'rh', BAR, 'cresc'))
    expect(lineDrawn(state, 'cresc')).toBe(true)
    expect(lineDrawn(state, 'dim')).toBe(false)
    expect(lineDrawn({ ...state, layer: 'lh' }, 'cresc')).toBeNull()
    expect(lineDrawn({ ...state, layer: 'chords' }, 'cresc')).toBeNull()
  })
})
