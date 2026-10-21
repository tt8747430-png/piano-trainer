import { describe, expect, it, vi } from 'vitest'
import { chordSymbol, midi, note, parseChordSymbol, type Meter } from '@/shared/lib/music'
import { ticksOf } from '@/shared/lib/notation'
import { draftOf, form, lengths, shape } from '../testing/test-draft'
import { reduce } from './editor'
import { initialEditor, type EditorAction, type EditorState } from './state'
import { createEditorStore } from './store'

const run = (state: EditorState, ...actions: EditorAction[]) => actions.reduce(reduce, state)
const key = (n: number, time: number): EditorAction => ({ type: 'key', key: midi(n), time })
const start = (layer: EditorState['layer'] = 'melody') =>
  run(initialEditor(draftOf()), { type: 'layer', layer })

describe('the editor', () => {
  it('deletes back from the end, a note at a time, as Backspace does', () => {
    const written = run(start('melody'), key(60, 0), key(62, 500), key(64, 1000), key(65, 1500))
    expect(written.caret).toBe(96)
    const once = run(written, { type: 'delete', back: true })
    expect(shape(once.draft.melody)).toEqual(['C4@0/24', 'D4@24/24', 'E4@48/24'])
    expect(once.caret).toBe(72)
    const twice = run(once, { type: 'delete', back: true })
    expect(shape(twice.draft.melody)).toEqual(['C4@0/24', 'D4@24/24'])
    expect(twice.caret).toBe(48)
    // On a note, it takes that one and stays.
    const chosen = run(
      written,
      { type: 'place', tick: 24, layer: 'melody' },
      { type: 'delete', back: true },
    )
    expect(shape(chosen.draft.melody)).toEqual(['C4@0/24', 'E4@48/24', 'F4@72/24'])
    expect(chosen.caret).toBe(24)
  })

  it('moves the notes at the caret by notes of the key, as a note dragged on its staff', () => {
    const written = run(start('melody'), key(67, 0), { type: 'move', by: 'end', direction: -1 })
    expect(shape(run(written, { type: 'step', steps: 2 }).draft.melody)).toEqual(['B4@0/24'])
    expect(shape(run(written, { type: 'step', steps: -1 }).draft.melody)).toEqual(['F#4@0/24'])
  })

  it('adds the tune’s staff and takes it away with its notes, one undo step each', () => {
    const added = run(start('rh'), { type: 'melodyStaff', on: true })
    expect(added.draft.melodyStaff).toBe(true)
    expect(added.layer).toBe('melody')
    const written = run(added, key(67, 0))
    const taken = run(written, { type: 'melodyStaff', on: false })
    expect(taken.draft).toMatchObject({ melodyStaff: false, melody: [] })
    expect(taken.layer).toBe('rh')
    expect(run(taken, { type: 'undo' }).draft.melody).toHaveLength(1)
  })

  it('writes a double-dotted value and a 32nd', () => {
    const state = run(
      start(),
      { type: 'value', value: 2 },
      { type: 'dot', dots: 2 },
      key(67, 0),
      { type: 'value', value: 32 },
      key(69, 500),
    )
    expect(shape(state.draft.melody)).toEqual(['G4@0/84', 'A4@84/3'])
  })

  it('marks the notes at the caret, or across the bars chosen, as one undo step', () => {
    const written = run(start(), key(67, 0), key(69, 500), {
      type: 'move',
      by: 'end',
      direction: -1,
    })
    const marked = run(written, { type: 'mark', mark: { kind: 'dynamic', dynamic: 'p' } })
    expect(marked.draft.melody.map((n) => n.marks)).toEqual([{ dynamic: 'p' }, undefined])
    expect(run(marked, { type: 'undo' }).draft).toBe(written.draft)
    const tied = run(start(), key(67, 0), key(67, 500), { type: 'move', by: 'end', direction: -1 })
    expect(shape(run(tied, { type: 'tie' }).draft.melody)).toEqual(['G4@0/48'])
  })

  it('opens at the piece’s start on its top staff, the right hand with no tune, writing quarter notes', () => {
    expect(initialEditor(draftOf({ melody: 'B4/4' })).layer).toBe('melody')
    const state = initialEditor(draftOf())
    expect(state).toMatchObject({
      layer: 'rh',
      caret: 0,
      value: { value: 4, dots: 0, triplet: false },
      chord: false,
      past: [],
      future: [],
    })
  })

  it('writes a played key at the caret and moves past it', () => {
    const state = run(start(), key(67, 0), key(69, 500))
    expect(shape(state.draft.melody)).toEqual(['G4@0/24', 'A4@24/24'])
    expect(state.caret).toBe(48)
  })

  it('writes keys struck together as one entry, one undo step', () => {
    const state = run(start('rh'), key(60, 0), key(64, 30), key(67, 60))
    expect(shape(state.draft.hands.rh)).toEqual(['C4@0/24', 'E4@0/24', 'G4@0/24'])
    expect(state.caret).toBe(24)
    expect(run(state, { type: 'undo' }).draft.hands.rh).toEqual([])
  })

  it('writes a take from the caret’s bar as one undo step, and a take of nothing as none', () => {
    const at = run(start('rh'), { type: 'place', tick: 120, layer: 'rh' })
    const parts = [
      { layer: 'rh' as const, notes: [{ midi: midi(67), startTick: 0, durationTicks: 24 }] },
    ]
    const state = run(at, { type: 'take', parts })
    expect(shape(state.draft.hands.rh)).toEqual(['G4@96/24'])
    expect(state.past).toHaveLength(at.past.length + 1)
    expect(run(state, { type: 'undo' }).draft).toBe(at.draft)
    const nothing = run(at, { type: 'take', parts: [{ layer: 'rh', notes: [] }] })
    expect(nothing.draft).toBe(at.draft)
    expect(nothing.past).toBe(at.past)
  })

  it('ends keys struck together when the caret moves', () => {
    const state = run(
      start('rh'),
      key(60, 0),
      { type: 'move', by: 'step', direction: -1 },
      key(64, 30),
    )
    expect(shape(state.draft.hands.rh)).toEqual(['E4@0/24'])
  })

  it('keeps the caret in Chord mode, so each key joins the notes there', () => {
    const state = run(start('lh'), { type: 'chordMode' }, key(48, 0), key(55, 900), key(64, 2000))
    expect(shape(state.draft.hands.lh)).toEqual(['C3@0/24', 'G3@0/24', 'E4@0/24'])
    expect(state.caret).toBe(0)
  })

  it('takes the value, dot and triplet for the next note', () => {
    const state = run(start(), { type: 'value', value: 8 }, { type: 'dot' }, key(67, 0))
    expect(shape(state.draft.melody)).toEqual(['G4@0/18'])
    const triplet = run(start(), { type: 'value', value: 8 }, { type: 'triplet' }, key(67, 0))
    expect(shape(triplet.draft.melody)).toEqual(['G4@0/8'])
  })

  it('chooses only values the meter writes in whole ticks', () => {
    const choices: EditorAction[] = [
      ...([1, 2, 4, 8, 16] as const).map((value): EditorAction => ({ type: 'value', value })),
      { type: 'dot' },
      { type: 'triplet' },
    ]
    for (const meter of ['4/4', '3/4', '6/8', '12/8'] satisfies Meter[]) {
      const opened = initialEditor(draftOf({ meter, sections: [{ kind: 'verse', lines: ['G'] }] }))
      for (const first of choices) {
        for (const second of choices) {
          for (const third of choices) {
            const { value } = run(opened, first, second, third)
            expect(Number.isInteger(ticksOf(value, meter)), JSON.stringify(value)).toBe(true)
            expect(value.dots === 1 && value.triplet).toBe(false)
          }
        }
      }
    }
  })

  it('takes a dot on a sixteenth in x/4, its 32nd whole ticks, and keeps one onto a sixteenth', () => {
    const sixteenth = run(start(), { type: 'value', value: 16 }, { type: 'dot' })
    expect(sixteenth.value).toEqual({ value: 16, dots: 1, triplet: false })
    expect(shape(run(sixteenth, key(67, 0)).draft.melody)).toEqual(['G4@0/9'])
    const dotted = run(
      start(),
      { type: 'value', value: 8 },
      { type: 'dot' },
      { type: 'value', value: 16 },
    )
    expect(dotted.value).toEqual({ value: 16, dots: 1, triplet: false })
    const compound = run(
      initialEditor(draftOf({ meter: '6/8', sections: [{ kind: 'verse', lines: ['G'] }] })),
      { type: 'value', value: 16 },
      { type: 'dot' },
    )
    expect(compound.value).toEqual({ value: 16, dots: 1, triplet: false })
  })

  it('takes a dot or a triplet, never both', () => {
    const dotted = run(start(), { type: 'value', value: 8 }, { type: 'triplet' }, { type: 'dot' })
    expect(dotted.value).toEqual({ value: 8, dots: 1, triplet: false })
    const triplet = run(start(), { type: 'value', value: 8 }, { type: 'dot' }, { type: 'triplet' })
    expect(triplet.value).toEqual({ value: 8, dots: 0, triplet: true })
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
    expect(shape(written.draft.melody)).toEqual(['C#4@0/24'])
    expect(written.caret).toBe(48)
    const back = run(written, { type: 'place', tick: 0, layer: 'melody' })
    expect(shape(run(back, { type: 'shift', semitones: 12 }).draft.melody)).toEqual(['C#5@0/24'])
    expect(shape(run(back, { type: 'respell' }).draft.melody)).toEqual(['D♭4@0/24'])
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

  it('sets a chord at the caret and moves on a beat or to the next bar', () => {
    const am = parseChordSymbol('Am')
    const beat = run(initialEditor(draftOf()), { type: 'chord', chord: am, advance: 'beat' })
    expect(form(beat.draft)).toEqual([[['Am@0', 'C@0']]])
    expect(beat.caret).toBe(24)
    const bar = run(initialEditor(draftOf()), { type: 'chord', chord: am, advance: 'bar' })
    expect(form(bar.draft)).toEqual([[['Am@0', 'C@0']]])
    expect(bar.caret).toBe(96)
  })

  it('stays on the last bar after a chord, or adds a bar past it when typing on', () => {
    const am = parseChordSymbol('Am')
    const onLast = run(initialEditor(draftOf()), { type: 'place', tick: 96, layer: 'chords' })
    const stays = run(onLast, { type: 'chord', chord: am, advance: 'bar' })
    expect(form(stays.draft)).toEqual([[['G@0', 'Am@0']]])
    expect(stays.caret).toBe(96)
    const typed = run(onLast, { type: 'chord', chord: am, advance: 'barAdding' })
    expect(form(typed.draft)).toEqual([[['G@0', 'Am@0', 'Am@0']]])
    expect(typed.caret).toBe(192)
  })

  it('names keys struck together in the chords as a chord, and stays', () => {
    const state = run(start('chords'), key(57, 0), key(60, 20), key(64, 40), key(67, 60))
    expect(
      state.draft.sections[0]?.lines[0]?.[0]?.chords.map((placed) => chordSymbol(placed.chord)),
    ).toEqual(['Am7'])
    expect(state.caret).toBe(0)
    expect(run(state, { type: 'undo' }).draft).toEqual(draftOf())
  })

  it('adds a voice’s staff under the tune’s, writes it, and takes it away with its notes', () => {
    const added = run(initialEditor(draftOf()), { type: 'voiceStaff', voice: 'voice2', on: true })
    expect(added.draft.voices).toEqual([[]])
    expect(added.layer).toBe('voice2')
    const sung = run(added, key(67, 0))
    expect(sung.draft.voices[0]?.map((n) => n.midi)).toEqual([67])
    const third = run(sung, { type: 'voiceStaff', voice: 'voice3', on: true })
    expect(third.draft.voices).toHaveLength(2)
    // Taking the second voice away moves the third up into its place.
    const gone = run(third, { type: 'voiceStaff', voice: 'voice2', on: false })
    expect(gone.draft.voices).toEqual([[]])
    expect(gone.layer).toBe('rh')
  })

  it('moves the caret a line on and back, to its line’s start first', () => {
    const lines = initialEditor(
      draftOf({
        sections: [
          { kind: 'verse', lines: ['G C', 'D'] },
          { kind: 'chorus', lines: ['Em'] },
        ],
      }),
    )
    const line = (state: EditorState, direction: -1 | 1) =>
      run(state, { type: 'move', by: 'line', direction, extend: false })
    const second = line(lines, 1)
    expect(second.caret).toBe(192)
    expect(line(second, 1).caret).toBe(288)
    expect(line(line(second, 1), 1).caret).toBe(288)
    const inside = run(lines, { type: 'move', by: 'bar', direction: 1, extend: false })
    expect(line(inside, -1).caret).toBe(0)
    expect(line(second, -1).caret).toBe(0)
  })

  it('selects bars with Shift, and copies, cuts and pastes them', () => {
    const chosen = run(
      run(initialEditor(draftOf({ sections: [{ kind: 'verse', lines: ['G C D'] }] })), {
        type: 'layer',
        layer: 'chords',
      }),
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

  it('ends the bars chosen with an edit: Delete after a chord typed takes the chord, not the bars', () => {
    const chords = run(
      initialEditor(draftOf({ sections: [{ kind: 'verse', lines: ['G C D'] }] })),
      { type: 'layer', layer: 'chords' },
    )
    const pasted = run(chords, { type: 'bars', edit: 'copy' }, { type: 'bars', edit: 'paste' })
    expect(pasted.selection).not.toBeNull()
    const typed = run(pasted, { type: 'chord', chord: parseChordSymbol('Am'), advance: 'beat' })
    expect(typed.selection).toBeNull()
    const deleted = run(typed, { type: 'delete' })
    expect(form(deleted.draft)[0]?.[0]).toHaveLength(4)
  })

  it('adds and deletes bars, changes a bar’s length and starts a line and a section', () => {
    const state = run(initialEditor(draftOf()), { type: 'bars', edit: 'insert' })
    expect(form(state.draft)).toEqual([[['G@0', 'G@0', 'C@0']]])
    expect(state.caret).toBe(96)
    expect(lengths(run(state, { type: 'barLength', ticks: 48 }).draft)).toEqual([96, 48, 96])
    expect(form(run(state, { type: 'bars', edit: 'delete' }).draft)).toEqual([[['G@0', 'C@0']]])
    expect(form(run(state, { type: 'bars', edit: 'newLine' }).draft)).toEqual([
      [['G@0'], ['G@0', 'C@0']],
    ])
    expect(run(state, { type: 'bars', edit: 'newSection' }).draft.sections).toHaveLength(2)
  })

  it('writes a hand’s bar out from the pattern, and gives it back', () => {
    const played = [{ midi: midi(43), spelled: note('G'), startTick: 0, durationTicks: 96 }]
    const out = run(start('lh'), { type: 'writeOut', played })
    expect(shape(out.draft.hands.lh)).toEqual(['G2@0/96'])
    expect(run(out, { type: 'backToPattern' }).draft.hands.lh).toEqual([])
  })

  it('changes the song’s settings', () => {
    const state = run(initialEditor(draftOf()), { type: 'settings', tempo: 120 })
    expect(state.draft).toMatchObject({ tempo: 120 })
  })

  it('undoes and redoes the changes with the caret, and a new change drops the redo', () => {
    const written = run(start(), key(67, 0), key(69, 500))
    const undone = run(written, { type: 'undo' })
    expect(shape(undone.draft.melody)).toEqual(['G4@0/24'])
    expect(undone.caret).toBe(24)
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

  it('takes an edit that changes nothing as no undo step and saves nothing', () => {
    const onChange = vi.fn()
    const store = createEditorStore(draftOf(), onChange)
    const nothing: EditorAction[] = [
      { type: 'layer', layer: 'melody' },
      { type: 'delete' },
      { type: 'settings', tempo: 90, key: store.getState().draft.key },
      { type: 'layer', layer: 'rh' },
      { type: 'backToPattern' },
      { type: 'layer', layer: 'chords' },
      { type: 'delete' },
      { type: 'bars', edit: 'newLine' },
      { type: 'barLength', ticks: 96 },
      { type: 'chord', chord: parseChordSymbol('G'), advance: 'bar' },
    ]
    for (const action of nothing) store.dispatch(action)
    expect(onChange).not.toHaveBeenCalled()
    expect(store.getState().past).toEqual([])
  })
})
