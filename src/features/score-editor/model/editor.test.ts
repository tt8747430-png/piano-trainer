import { describe, expect, it, vi } from 'vitest'
import { chordSymbol, midi, note, parseChordSymbol } from '@/shared/lib/music'
import { draftOf, form, lengths, shape } from '../testing/test-draft'
import { initialEditor, reduce, type EditorAction, type EditorState } from './editor'
import { createEditorStore } from './store'

const run = (state: EditorState, ...actions: EditorAction[]) => actions.reduce(reduce, state)
const key = (n: number, time: number): EditorAction => ({ type: 'key', key: midi(n), time })
const start = (layer: EditorState['layer'] = 'melody') =>
  run(initialEditor(draftOf()), { type: 'layer', layer })

describe('the editor', () => {
  it('opens on the chords at the piece’s start, writing quarter notes', () => {
    const state = initialEditor(draftOf())
    expect(state).toMatchObject({
      layer: 'chords',
      caret: 0,
      value: { value: 4, dots: 0, triplet: false },
      chord: false,
      past: [],
      future: [],
    })
  })

  it('writes a played key at the caret and moves past it', () => {
    const state = run(start(), key(67, 0), key(69, 500))
    expect(shape(state.draft.melody)).toEqual(['G4@0/12', 'A4@12/12'])
    expect(state.caret).toBe(24)
  })

  it('writes keys struck together as one entry, one undo step', () => {
    const state = run(start('rh'), key(60, 0), key(64, 30), key(67, 60))
    expect(shape(state.draft.hands.rh)).toEqual(['C4@0/12', 'E4@0/12', 'G4@0/12'])
    expect(state.caret).toBe(12)
    expect(run(state, { type: 'undo' }).draft.hands.rh).toEqual([])
  })

  it('ends keys struck together when the caret moves', () => {
    const state = run(
      start('rh'),
      key(60, 0),
      { type: 'move', by: 'step', direction: -1 },
      key(64, 30),
    )
    expect(shape(state.draft.hands.rh)).toEqual(['E4@0/12'])
  })

  it('keeps the caret in Chord mode, so each key joins the notes there', () => {
    const state = run(start('lh'), { type: 'chordMode' }, key(48, 0), key(55, 900), key(64, 2000))
    expect(shape(state.draft.hands.lh)).toEqual(['C3@0/12', 'G3@0/12', 'E4@0/12'])
    expect(state.caret).toBe(0)
  })

  it('takes the value, dot and triplet for the next note', () => {
    const state = run(start(), { type: 'value', value: 8 }, { type: 'dot' }, key(67, 0))
    expect(shape(state.draft.melody)).toEqual(['G4@0/9'])
    const triplet = run(start(), { type: 'value', value: 8 }, { type: 'triplet' }, key(67, 0))
    expect(shape(triplet.draft.melody)).toEqual(['G4@0/4'])
  })

  it('leaves Triplet off in a compound meter', () => {
    const state = run(
      initialEditor(draftOf({ meter: '6/8', sections: [{ kind: 'verse', lines: ['G'] }] })),
      {
        type: 'triplet',
      },
    )
    expect(state.value.triplet).toBe(false)
  })

  it('writes rests, deletes, moves and respells the notes at the caret', () => {
    const written = run(start(), key(61, 0), { type: 'rest' })
    expect(shape(written.draft.melody)).toEqual(['C#4@0/12'])
    expect(written.caret).toBe(24)
    const back = run(written, { type: 'place', tick: 0, layer: 'melody' })
    expect(shape(run(back, { type: 'shift', semitones: 12 }).draft.melody)).toEqual(['C#5@0/12'])
    expect(shape(run(back, { type: 'respell' }).draft.melody)).toEqual(['D♭4@0/12'])
    expect(run(back, { type: 'delete' }).draft.melody).toEqual([])
  })

  it('sets a finger on a note of a hand', () => {
    const state = run(
      start('rh'),
      key(60, 0),
      { type: 'place', tick: 0, layer: 'rh' },
      {
        type: 'finger',
        midi: midi(60),
        finger: 1,
      },
    )
    expect(state.draft.hands.rh[0]?.finger).toBe(1)
  })

  it('sets a chord at the caret and moves on a beat or to the next bar, adding one past the last', () => {
    const am = parseChordSymbol('Am')
    const beat = run(initialEditor(draftOf()), { type: 'chord', chord: am, advance: 'beat' })
    expect(form(beat.draft)).toEqual([[['Am@0', 'C@0']]])
    expect(beat.caret).toBe(12)
    const last = run(
      initialEditor(draftOf()),
      { type: 'place', tick: 48, layer: 'chords' },
      {
        type: 'chord',
        chord: am,
        advance: 'bar',
      },
    )
    expect(form(last.draft)).toEqual([[['G@0', 'Am@0', 'Am@0']]])
    expect(last.caret).toBe(96)
  })

  it('names keys struck together in the chords as a chord, and stays', () => {
    const state = run(initialEditor(draftOf()), key(57, 0), key(60, 20), key(64, 40), key(67, 60))
    expect(
      state.draft.sections[0]?.lines[0]?.[0]?.chords.map((placed) => chordSymbol(placed.chord)),
    ).toEqual(['Am7'])
    expect(state.caret).toBe(0)
    expect(run(state, { type: 'undo' }).draft).toEqual(draftOf())
  })

  it('selects bars with Shift, and copies, cuts and pastes them', () => {
    const chosen = run(
      initialEditor(draftOf({ sections: [{ kind: 'verse', lines: ['G C D'] }] })),
      {
        type: 'move',
        by: 'bar',
        direction: 1,
        extend: true,
      },
    )
    expect(chosen.selection).toEqual({ anchor: 0, head: 1 })
    const pasted = run(chosen, { type: 'bars', edit: 'copy' }, { type: 'bars', edit: 'paste' })
    expect(form(pasted.draft)).toEqual([[['G@0', 'C@0', 'G@0', 'C@0', 'D@0']]])
    const cut = run(chosen, { type: 'bars', edit: 'cut' })
    expect(form(cut.draft)).toEqual([[['D@0']]])
    expect(cut.clip?.bars).toHaveLength(2)
  })

  it('adds and deletes bars, changes a bar’s length and starts a line and a section', () => {
    const state = run(initialEditor(draftOf()), { type: 'bars', edit: 'insert' })
    expect(form(state.draft)).toEqual([[['G@0', 'G@0', 'C@0']]])
    expect(state.caret).toBe(48)
    expect(lengths(run(state, { type: 'barLength', ticks: 24 }).draft)).toEqual([48, 24, 48])
    expect(form(run(state, { type: 'bars', edit: 'delete' }).draft)).toEqual([[['G@0', 'C@0']]])
    expect(form(run(state, { type: 'bars', edit: 'newLine' }).draft)).toEqual([
      [['G@0'], ['G@0', 'C@0']],
    ])
    expect(run(state, { type: 'bars', edit: 'newSection' }).draft.sections).toHaveLength(2)
  })

  it('writes a hand’s bar out from the pattern, and gives it back', () => {
    const played = [{ midi: midi(43), spelled: note('G'), startTick: 0, durationTicks: 48 }]
    const out = run(start('lh'), { type: 'writeOut', played })
    expect(shape(out.draft.hands.lh)).toEqual(['G2@0/48'])
    expect(run(out, { type: 'backToPattern' }).draft.hands.lh).toEqual([])
  })

  it('changes the song’s settings', () => {
    const state = run(initialEditor(draftOf()), { type: 'settings', tempo: 120, pattern: 'ballad' })
    expect(state.draft).toMatchObject({ tempo: 120, pattern: 'ballad' })
  })

  it('undoes and redoes the changes with the caret, and a new change drops the redo', () => {
    const written = run(start(), key(67, 0), key(69, 500))
    const undone = run(written, { type: 'undo' })
    expect(shape(undone.draft.melody)).toEqual(['G4@0/12'])
    expect(undone.caret).toBe(12)
    expect(run(undone, { type: 'redo' }).draft).toBe(written.draft)
    expect(run(undone, key(71, 900)).future).toEqual([])
    expect(run(initialEditor(draftOf()), { type: 'undo' })).toEqual(initialEditor(draftOf()))
  })
})

describe('createEditorStore', () => {
  it('saves the draft only when an action changed it', () => {
    const onChange = vi.fn()
    const store = createEditorStore(draftOf(), onChange)
    store.dispatch({ type: 'layer', layer: 'melody' })
    expect(onChange).not.toHaveBeenCalled()
    store.dispatch(key(67, 0))
    expect(onChange).toHaveBeenCalledWith(store.getState().draft)
  })
})
