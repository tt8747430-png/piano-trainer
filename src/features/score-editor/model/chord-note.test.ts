import { describe, expect, it } from 'vitest'
import { draftOf } from '../testing/test-draft'
import { chordNoteStep, staffNear } from './chord-note'
import { reduce } from './editor'
import { initialEditor, type EditorAction, type EditorState } from './state'

const run = (state: EditorState, ...actions: EditorAction[]) => actions.reduce(reduce, state)

describe('staffNear', () => {
  it('moves to the row over or under, top down, the same row at either end', () => {
    const all = ['chords', 'melody', 'rh', 'lh'] as const
    expect(staffNear('melody', -1, all)).toBe('chords')
    expect(staffNear('rh', 1, all)).toBe('lh')
    expect(staffNear('lh', 1, all)).toBe('lh')
    expect(staffNear('rh', -1, ['rh', 'lh'])).toBe('rh')
  })

  it('goes through the more voices’ staves, between the tune’s and the piano’s', () => {
    const sung = ['melody', 'voice2', 'voice3', 'rh', 'lh'] as const
    expect(staffNear('melody', 1, sung)).toBe('voice2')
    expect(staffNear('voice2', 1, sung)).toBe('voice3')
    expect(staffNear('voice3', 1, sung)).toBe('rh')
    expect(staffNear('rh', -1, sung)).toBe('voice3')
  })
})

describe('Alt ↑ ↓ through a chord (ADR 0086)', () => {
  const chord = run(initialEditor(draftOf({ hands: { rh: 'C4+E4+G4/4 | -', lh: 'C3/4 | -' } })), {
    type: 'layer',
    layer: 'rh',
  })

  it('goes from the whole chord to its top or its foot, then note by note', () => {
    const top = chordNoteStep(chord, 1)
    expect(top.chordNote).toBe(67)
    expect(chordNoteStep(top, -1).chordNote).toBe(64)
    expect(chordNoteStep(chordNoteStep(top, -1), -1).chordNote).toBe(60)
    expect(chordNoteStep(chord, -1).chordNote).toBe(60)
  })

  it('goes past the chord’s top or foot to the staff over or under, the whole chord there', () => {
    const foot = chordNoteStep(chord, -1)
    const under = chordNoteStep(foot, -1)
    expect(under.layer).toBe('lh')
    expect(under.chordNote).toBeNull()
    // A single note: straight on to the next staff, the chords' row over the piano.
    expect(chordNoteStep(under, 1).layer).toBe('rh')
    expect(chordNoteStep(chordNoteStep(chord, 1), 1).layer).toBe('chords')
  })

  it('stays at the top staff and the foot, letting go of the chord’s note', () => {
    const lh = run(chord, { type: 'layer', layer: 'lh' })
    expect(chordNoteStep(lh, -1)).toBe(lh)
  })

  it('is the reducer’s chordNote', () => {
    expect(run(chord, { type: 'chordNote', direction: 1 }).chordNote).toBe(67)
  })
})
