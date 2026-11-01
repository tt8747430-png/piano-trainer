import { describe, expect, it } from 'vitest'
import { createEditorStore, readDraft, type EditorAction } from '@/features/score-editor'
import { midi } from '@/shared/lib/music'
import { heardEdit } from './heard-edit'

/** A song of one staff, G4 then A4, its caret on the staff at its start. */
function editor() {
  const store = createEditorStore(
    readDraft({
      key: 'G',
      meter: '4/4',
      tempo: 90,
      pattern: 'r1',
      sections: [{ kind: 'verse', lines: ['G C'] }],
      staves: [{ notes: 'G4/4 | A4/4' }],
      hands: { rh: 'r/4 | r/4', lh: 'r/4 | r/4' },
    }),
    () => {},
  )
  store.dispatch({ type: 'place', tick: 0, layer: 'staff0' })
  /** The keys an action sounds, the store moved on by it. */
  return (action: EditorAction) => {
    const before = store.getState()
    store.dispatch(action)
    return heardEdit(action, before, store.getState())
  }
}

describe('a note heard as it is edited (round 28)', () => {
  it('sounds a note clicked on the score and a note whose pitch moves', () => {
    const run = editor()
    expect(run({ type: 'place', tick: 0, layer: 'staff0' })).toEqual([67])
    expect(run({ type: 'step', steps: 1 })).toEqual([69])
    expect(run({ type: 'shift', semitones: 12 })).toEqual([81])
  })

  it('sounds nothing for what sounds itself or changes no pitch', () => {
    const run = editor()
    expect(run({ type: 'key', key: midi(72), time: 0 })).toEqual([])
    expect(run({ type: 'value', value: 2 })).toEqual([])
    expect(run({ type: 'place', tick: 0, layer: 'staff0', extend: true })).toEqual([])
    expect(run({ type: 'place', tick: 0, layer: 'chords' })).toEqual([])
  })
})
