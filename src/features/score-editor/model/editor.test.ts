import { musicToSave, readDraft } from './draft'
import { describe, expect, it, vi } from 'vitest'
import { chordSymbol, midi, note, parseChordSymbol, type Meter } from '@/shared/lib/music'
import { ticksOf } from '@/shared/lib/notation'
import { draftOf, form, lengths, shape } from '../testing/test-draft'
import { reduce } from './editor'
import { shownValue } from './chosen'
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

  it('changes key from the caret’s section on, its notes written and stepped in that key (ADR 0089)', () => {
    const twoParts = initialEditor(
      draftOf({
        sections: [
          { kind: 'verse', lines: ['G C'] },
          { kind: 'chorus', lines: ['F C'] },
        ],
      }),
    )
    const chorus = run(
      twoParts,
      { type: 'layer', layer: 'melody' },
      { type: 'place', tick: 192, layer: 'melody' },
      { type: 'sectionKey', key: { tonic: note('F'), minor: false } },
    )
    expect(chorus.draft.sections.map((section) => section.heading.key)).toEqual([undefined, 'F'])
    // A B♭ in F, not the A♯ G major would write; a step up from A in F is B♭ too.
    const written = run(chorus, key(70, 0), { type: 'place', tick: 192, layer: 'melody' })
    expect(shape(written.draft.melody)).toEqual(['B♭4@192/24'])
    const a = run(chorus, key(69, 0), { type: 'place', tick: 192, layer: 'melody' })
    expect(shape(run(a, { type: 'step', steps: 1 }).draft.melody)).toEqual(['B♭4@192/24'])
    // Undone, the chorus is in the song's key again.
    expect(run(chorus, { type: 'undo' }).draft.sections[1]?.heading.key).toBeUndefined()
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

  it('hides a row keeping its notes, saved and read back hidden, and shows it again', () => {
    const sung = initialEditor(draftOf({ melody: 'B4/1 | D5/1' }))
    const hidden = run({ ...sung, layer: 'melody' }, { type: 'hide', row: 'melody', hidden: true })
    expect(hidden.draft.melody).toEqual(sung.draft.melody)
    expect(hidden.layer).toBe('rh')
    const saved = musicToSave(hidden.draft)
    expect(saved).toMatchObject({ melody: 'B4/1 D5/1', hidden: ['melody'] })
    expect(readDraft(saved!).hidden).toEqual(['melody'])
    expect(run(hidden, { type: 'hide', row: 'melody', hidden: false }).draft.hidden).toEqual([])
  })

  it('hides the piano for a lead sheet, the caret leaving a hand for the tune (ADR 0083)', () => {
    const sung = initialEditor(draftOf({ melody: 'B4/1 | D5/1', hands: { lh: 'G2/4 | r/4' } }))
    const lead = run({ ...sung, layer: 'lh' }, { type: 'hide', row: 'piano', hidden: true })
    expect(lead.draft.hidden).toEqual(['piano'])
    expect(lead.draft.hands).toEqual(sung.draft.hands)
    expect(lead.layer).toBe('melody')
    expect(musicToSave(lead.draft)).toMatchObject({
      hidden: ['piano'],
      hands: { lh: 'G2/4 | r/4' },
    })
    // Never every staff: the tune's, the last in sight, stays.
    expect(run(lead, { type: 'hide', row: 'melody', hidden: true })).toBe(lead)
    // Nor the piano where it is the only staff.
    const piano = initialEditor(draftOf())
    expect(run(piano, { type: 'hide', row: 'piano', hidden: true })).toBe(piano)
    // The tune taken away from a lead sheet brings the piano back, so a staff is in sight.
    const gone = run(lead, { type: 'melodyStaff', on: false })
    expect(gone.draft.hidden).toEqual([])
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

  it('chooses notes with Shift, and Delete, a half step and Respell take them all', () => {
    const tune = (state: EditorState) => shape(state.draft.melody)
    const written = run(
      start('melody'),
      { type: 'value', value: 2 },
      key(60, 0),
      key(62, 500),
      key(64, 1000),
      key(65, 1500),
      key(67, 2000),
      key(69, 2500),
      { type: 'move', by: 'end', direction: -1 },
    )
    const bar = { type: 'move', by: 'bar', direction: 1, extend: true } as const
    // To bar 1's end, then bar 2's: four notes, from the first's start to the fourth's end.
    const chosen = run(written, bar, bar)
    expect(chosen.selection).toEqual({ anchor: { from: 0, to: 48 }, head: { from: 144, to: 192 } })
    expect(tune(run(chosen, { type: 'shift', semitones: 1 }))).toEqual([
      'C#4@0/48',
      'D#4@48/48',
      'F4@96/48',
      'F#4@144/48',
      'G4@192/48',
      'A4@240/48',
    ])
    // The notes stay chosen, so the next edit takes them too.
    expect(
      tune(run(chosen, { type: 'shift', semitones: 1 }, { type: 'respell' })).slice(0, 2),
    ).toEqual(['D♭4@0/48', 'E♭4@48/48'])
    const deleted = run(chosen, { type: 'delete', back: true })
    expect(tune(deleted)).toEqual(['G4@192/48', 'A4@240/48'])
    expect(deleted.selection).toBeNull()
    expect(deleted.caret).toBe(0)
    // Escape lets them go, as a notation app's.
    expect(run(chosen, { type: 'deselect' }).selection).toBeNull()
  })

  it('chooses exactly the notes gone over, by a note, to a bar’s end or start, or to an end', () => {
    const tune = run(
      initialEditor(
        draftOf({
          melody: 'B4/2 C5/2 | D5/4 | E5/4',
          sections: [{ kind: 'verse', lines: ['G C D'] }],
        }),
      ),
      { type: 'layer', layer: 'melody' },
    )
    const span = (state: EditorState) =>
      state.selection && {
        from: Math.min(state.selection.anchor.from, state.selection.head.from),
        to: Math.max(state.selection.anchor.to, state.selection.head.to),
      }
    const move = (by: 'step' | 'bar' | 'end', direction: -1 | 1) =>
      ({ type: 'move', by, direction, extend: true }) as const
    // Shift and the right arrow from the first half note: it and the next, both whole.
    expect(span(run(tune, move('step', 1)))).toEqual({ from: 0, to: 96 })
    expect(span(run(tune, move('step', 1), move('step', 1)))).toEqual({ from: 0, to: 192 })
    // And back again: the first alone.
    expect(span(run(tune, move('step', 1), move('step', -1)))).toEqual({ from: 0, to: 48 })
    // Back from bar 2's note: the note before it too.
    const atTwo = run(tune, { type: 'place', tick: 96, layer: 'melody' })
    expect(span(run(atTwo, move('step', -1)))).toEqual({ from: 48, to: 192 })
    // A bar on: to the bar's last note, then the next bar's; a bar back: to its first, then before.
    expect(span(run(tune, move('bar', 1)))).toEqual({ from: 0, to: 96 })
    expect(span(run(tune, move('bar', 1), move('bar', 1)))).toEqual({ from: 0, to: 192 })
    expect(span(run(atTwo, move('bar', -1)))).toEqual({ from: 0, to: 192 })
    // To the ends: the last note, the first.
    expect(span(run(atTwo, move('end', 1)))).toEqual({ from: 96, to: 288 })
    expect(span(run(atTwo, move('end', -1)))).toEqual({ from: 0, to: 192 })
    // A note clicked with Shift is the range's end: from the caret's note to it, no bar more.
    expect(span(run(tune, { type: 'place', tick: 96, layer: 'melody', extend: true }))).toEqual({
      from: 0,
      to: 192,
    })
    // A move without Shift lets the range go.
    expect(
      run(tune, move('step', 1), { type: 'move', by: 'step', direction: 1 }).selection,
    ).toBeNull()
  })

  it('chooses one note of a chord, and edits it alone (ADR 0088)', () => {
    const chord = run(initialEditor(draftOf({ hands: { rh: 'C4+E4+G4/4 | r/4' } })), {
      type: 'layer',
      layer: 'rh',
    })
    const rh = (state: EditorState) => shape(state.draft.hands.rh)
    // Its head clicked: E alone.
    const e = run(chord, { type: 'place', tick: 0, layer: 'rh', key: midi(64) })
    expect(e.chordNote).toBe(64)
    expect(rh(run(e, { type: 'shift', semitones: 1 }))).toEqual(['C4@0/96', 'F4@0/96', 'G4@0/96'])
    // It stays chosen as it moves, so the next move moves it on.
    expect(run(e, { type: 'shift', semitones: 1 }).chordNote).toBe(65)
    expect(rh(run(e, { type: 'step', steps: 1 }))).toEqual(['C4@0/96', 'F#4@0/96', 'G4@0/96'])
    expect(run(e, { type: 'step', steps: 1 }).chordNote).toBe(66)
    expect(rh(run(e, { type: 'respell' }))).toEqual(['C4@0/96', 'F♭4@0/96', 'G4@0/96'])
    const deleted = run(e, { type: 'delete' })
    expect(rh(deleted)).toEqual(['C4@0/96', 'G4@0/96'])
    expect(deleted.chordNote).toBeNull()
    const marked = run(e, {
      type: 'mark',
      mark: { kind: 'articulation', articulation: 'staccato' },
    })
    expect(marked.draft.hands.rh.map((n) => n.marks?.articulations ?? [])).toEqual([
      [],
      ['staccato'],
      [],
    ])
    // The chord's free room, or a click with no key: the whole chord.
    expect(run(e, { type: 'place', tick: 0, layer: 'rh' }).chordNote).toBeNull()
    expect(run(e, { type: 'deselect' }).chordNote).toBeNull()
    // A single note has no note of a chord to choose.
    const single = run(initialEditor(draftOf({ hands: { rh: 'C4/4 | r/4' } })), {
      type: 'layer',
      layer: 'rh',
    })
    expect(run(single, { type: 'place', tick: 0, layer: 'rh', key: midi(60) }).chordNote).toBeNull()
  })

  it('selects bars with Shift, a bar at a time in the chords, and copies, cuts and pastes them', () => {
    const chosen = run(
      run(initialEditor(draftOf({ sections: [{ kind: 'verse', lines: ['G C D'] }] })), {
        type: 'layer',
        layer: 'chords',
      }),
      { type: 'move', by: 'bar', direction: 1, extend: true },
    )
    expect(chosen.selection).toEqual({ anchor: { from: 0, to: 96 }, head: { from: 96, to: 192 } })
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

describe('the palette on what is chosen', () => {
  const tune = () =>
    initialEditor(
      draftOf({ melody: 'B4/1 A4/1 G4/1 F#4/1', sections: [{ kind: 'verse', lines: ['G C'] }] }),
    )
  const at = (state: EditorState, tick: number) =>
    run(state, { type: 'layer', layer: 'melody' }, { type: 'place', tick, layer: 'melody' })

  it('makes the note chosen the value tapped, the next notes too, the caret staying', () => {
    const state = run(at(tune(), 24), { type: 'value', value: 8 })
    expect(shape(state.draft.melody)).toEqual(['B4@0/24', 'A4@24/12', 'G4@48/24', 'F#4@72/24'])
    expect(state.caret).toBe(24)
    expect(state.value).toEqual({ value: 8, dots: 0, triplet: false })
    expect(shownValue(state)).toEqual({ value: 8, dots: 0, triplet: false })
    expect(run(state, { type: 'undo' }).draft.melody[1]?.durationTicks).toBe(24)
  })

  it('dots the note chosen, and makes it a triplet’s', () => {
    const dotted = run(at(tune(), 0), { type: 'value', value: 8 }, { type: 'dot' })
    expect(shape(dotted.draft.melody).slice(0, 2)).toEqual(['B4@0/18', 'A4@24/24'])
    const triplet = run(at(tune(), 0), { type: 'value', value: 8 }, { type: 'triplet' })
    expect(triplet.draft.melody[0]?.durationTicks).toBe(8)
  })

  it('changes every note of a range, keeping it chosen', () => {
    const chosen = run(at(tune(), 0), { type: 'move', by: 'step', direction: 1, extend: true })
    const state = run(chosen, { type: 'value', value: 8 })
    expect(shape(state.draft.melody)).toEqual(['B4@0/12', 'A4@24/12', 'G4@48/24', 'F#4@72/24'])
    expect(state.selection).not.toBeNull()
  })

  it('shows the value chosen for the next note where no note is chosen', () => {
    const end = at(tune(), 96)
    const state = run(end, { type: 'value', value: 2 })
    expect(state.draft).toBe(end.draft)
    expect(shownValue(state)).toEqual({ value: 2, dots: 0, triplet: false })
    expect(shownValue(at(tune(), 0))).toEqual({ value: 4, dots: 0, triplet: false })
  })

  it('makes the notes of a range rests', () => {
    const chosen = run(at(tune(), 0), { type: 'move', by: 'step', direction: 1, extend: true })
    const state = run(chosen, { type: 'rest' })
    expect(shape(state.draft.melody)).toEqual(['G4@48/24', 'F#4@72/24'])
    expect(state.caret).toBe(0)
  })

  it('writes the note chosen sharp, flat or natural', () => {
    const state = run(at(tune(), 72), { type: 'accidental', accidental: 0 })
    expect(shape(state.draft.melody).at(-1)).toBe('F4@72/24')
  })

  it('adds a bar before the caret’s, and gives each bar chosen a length and the first a clef', () => {
    const before = run(initialEditor(draftOf()), { type: 'bars', edit: 'insertBefore' })
    expect(form(before.draft)).toEqual([[['G@0', 'G@0', 'C@0']]])
    expect(before.caret).toBe(0)
    const both = run(
      initialEditor(draftOf()),
      { type: 'layer', layer: 'chords' },
      { type: 'move', by: 'bar', direction: 1, extend: true },
    )
    expect(lengths(run(both, { type: 'barLength', ticks: 48 }).draft)).toEqual([48, 48])
    const clef = run(
      initialEditor(draftOf()),
      { type: 'place', tick: 96, layer: 'rh' },
      { type: 'clef', hand: 'rh', clef: 'bass' },
    )
    expect(clef.draft.sections[0]?.lines[0]?.[1]?.clefs).toEqual({ rh: 'bass' })
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
