import { musicToSave, readDraft } from './draft'
import { describe, expect, it, vi } from 'vitest'
import { chordSymbol, midi, note, parseChordSymbol, type Meter } from '@/shared/lib/music'
import { ticksOf } from '@/shared/lib/notation'
import { draftOf, form, lengths, oneStaff, shape, staffNotes } from '../testing/test-draft'
import { copyTarget, whyNoPaste } from './clip-edits'
import { reduce } from './editor'
import { shownValue } from './chosen'
import { initialEditor, type EditorAction, type EditorState } from './state'
import { createEditorStore } from './store'

const run = (state: EditorState, ...actions: EditorAction[]) => actions.reduce(reduce, state)
const key = (n: number, time: number): EditorAction => ({ type: 'key', key: midi(n), time })
const start = (layer: EditorState['layer'] = 'staff0') =>
  run(initialEditor(oneStaff()), { type: 'layer', layer })

describe('the editor', () => {
  it('deletes back from the end, a note at a time, as Backspace does', () => {
    const written = run(start('staff0'), key(60, 0), key(62, 500), key(64, 1000), key(65, 1500))
    expect(written.caret).toBe(96)
    const once = run(written, { type: 'delete', back: true })
    expect(shape(staffNotes(once.draft))).toEqual(['C4@0/24', 'D4@24/24', 'E4@48/24'])
    expect(once.caret).toBe(72)
    const twice = run(once, { type: 'delete', back: true })
    expect(shape(staffNotes(twice.draft))).toEqual(['C4@0/24', 'D4@24/24'])
    expect(twice.caret).toBe(48)
    // On a note, it takes that one and stays.
    const chosen = run(
      written,
      { type: 'place', tick: 24, layer: 'staff0' },
      { type: 'delete', back: true },
    )
    expect(shape(staffNotes(chosen.draft))).toEqual(['C4@0/24', 'E4@48/24', 'F4@72/24'])
    expect(chosen.caret).toBe(24)
  })

  it('moves the notes at the caret by notes of the key, as a note dragged on its staff', () => {
    const written = run(start('staff0'), key(67, 0), { type: 'move', by: 'end', direction: -1 })
    expect(shape(staffNotes(run(written, { type: 'step', steps: 2 }).draft))).toEqual(['B4@0/24'])
    expect(shape(staffNotes(run(written, { type: 'step', steps: -1 }).draft))).toEqual(['F#4@0/24'])
  })

  it('changes key from the caret’s section on, its notes written and stepped in that key (ADR 0089)', () => {
    const twoParts = initialEditor(
      draftOf({
        sections: [
          { kind: 'verse', lines: ['G C'] },
          { kind: 'chorus', lines: ['F C'] },
        ],
        staves: [{ notes: 'r/1' }],
      }),
    )
    // From the bar given, the chorus's first, wherever the caret is (a key signature on the sheet).
    const chorus = run(
      twoParts,
      { type: 'layer', layer: 'staff0' },
      { type: 'sectionKey', bar: 2, key: { tonic: note('F'), minor: false } },
      { type: 'place', tick: 192, layer: 'staff0' },
    )
    expect(chorus.draft.sections.map((section) => section.heading.key)).toEqual([undefined, 'F'])
    // A B♭ in F, not the A♯ G major would write; a step up from A in F is B♭ too.
    const written = run(chorus, key(70, 0), { type: 'place', tick: 192, layer: 'staff0' })
    expect(shape(staffNotes(written.draft))).toEqual(['B♭4@192/24'])
    const a = run(chorus, key(69, 0), { type: 'place', tick: 192, layer: 'staff0' })
    expect(shape(staffNotes(run(a, { type: 'step', steps: 1 }).draft))).toEqual(['B♭4@192/24'])
    // Undone, the chorus is in the song's key again.
    expect(run(chorus, { type: 'undo' }).draft.sections[1]?.heading.key).toBeUndefined()
  })

  it('changes time from a bar’s section on, a bar added there counted in it (ADR 0095)', () => {
    const twoParts = initialEditor(
      draftOf({
        sections: [
          { kind: 'verse', lines: ['G C'] },
          { kind: 'chorus', lines: ['F C'] },
        ],
        staves: [{ notes: 'r/1' }],
      }),
    )
    // From the bar given, the chorus's first, wherever the caret is (a time signature on the sheet).
    const chorus = run(twoParts, { type: 'sectionMeter', bar: 2, meter: '3/4' })
    expect(chorus.draft.sections.map((section) => section.heading.meter)).toEqual([
      undefined,
      '3/4',
    ])
    expect(lengths(chorus.draft)).toEqual([96, 96, 72, 72])
    // A bar added in the chorus is a bar of its 3/4; one in the verse, of the song's 4/4.
    const added = run(
      chorus,
      { type: 'place', tick: 192, layer: 'chords' },
      { type: 'bars', edit: 'insert' },
      { type: 'place', tick: 0, layer: 'chords' },
      { type: 'bars', edit: 'insert' },
    )
    expect(lengths(added.draft)).toEqual([96, 96, 96, 72, 72, 72])
    // Undone, the chorus is counted in the song's meter again.
    expect(run(chorus, { type: 'undo' }).draft).toEqual(twoParts.draft)
  })

  it('adds a staff and takes it away with its notes, one undo step each (ADR 0097)', () => {
    const piano = initialEditor(draftOf())
    const added = run(piano, { type: 'addStaff', place: 0 })
    expect(added.draft.staves).toEqual([{ clef: 'treble', notes: [] }])
    expect(added.layer).toBe('staff0')
    const written = run(added, key(67, 0))
    const taken = run(written, { type: 'removeStaff', place: 0 })
    expect(taken.draft.staves).toEqual([])
    expect(taken.layer).toBe('rh')
    expect(staffNotes(run(taken, { type: 'undo' }).draft)).toHaveLength(1)
  })

  it('adds a staff over or under another, the caret on it where it was in time (ADR 0097)', () => {
    const one = run(start(), key(67, 0), key(69, 500))
    const over = run(one, { type: 'addStaff', place: 0 })
    expect(over.draft.staves.map((staff) => staff.notes.length)).toEqual([0, 2])
    expect(over).toMatchObject({ layer: 'staff0', caret: 48 })
    const under = run(one, { type: 'addStaff', place: 1 })
    expect(under.draft.staves.map((staff) => staff.notes.length)).toEqual([2, 0])
    expect(under.layer).toBe('staff1')
    // From the staff over it, the caret goes up with the staves under the one taken away.
    const three = run(under, { type: 'addStaff', place: 2 })
    expect(run(three, { type: 'removeStaff', place: 1 }).layer).toBe('staff1')
    expect(run({ ...three, layer: 'staff1' }, { type: 'removeStaff', place: 1 }).layer).toBe(
      'staff1',
    )
    expect(run({ ...three, layer: 'staff1' }, { type: 'removeStaff', place: 0 }).layer).toBe(
      'staff0',
    )
  })

  it('names a staff as typed, trimmed; emptied, it has none; Undo brings the old name (ADR 0097)', () => {
    const one = initialEditor(draftOf({ staves: [{ notes: 'B4/4' }] }))
    const named = run(one, { type: 'renameStaff', place: 0, name: '  Voice ' })
    expect(named.draft.staves[0]?.name).toBe('Voice')
    expect(run(named, { type: 'renameStaff', place: 0, name: 'Voice' }).draft).toBe(named.draft)
    expect(
      run(named, { type: 'renameStaff', place: 0, name: ' ' }).draft.staves[0],
    ).not.toHaveProperty('name')
    expect(run(named, { type: 'undo' }).draft).toEqual(one.draft)
    expect(musicToSave(named.draft)?.staves).toEqual([{ name: 'Voice', notes: 'B4/4' }])
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
    expect(shape(staffNotes(state.draft))).toEqual(['G4@0/84', 'A4@84/3'])
  })

  it('marks the notes at the caret, or across the bars chosen, as one undo step', () => {
    const written = run(start(), key(67, 0), key(69, 500), {
      type: 'move',
      by: 'end',
      direction: -1,
    })
    const marked = run(written, { type: 'mark', mark: { kind: 'dynamic', dynamic: 'p' } })
    expect(staffNotes(marked.draft).map((n) => n.marks)).toEqual([{ dynamic: 'p' }, undefined])
    expect(run(marked, { type: 'undo' }).draft).toBe(written.draft)
    const tied = run(start(), key(67, 0), key(67, 500), { type: 'move', by: 'end', direction: -1 })
    expect(shape(staffNotes(run(tied, { type: 'tie' }).draft))).toEqual(['G4@0/48'])
  })

  it('opens at the piece’s start on its top staff, the right hand with no tune, writing quarter notes', () => {
    expect(initialEditor(draftOf({ staves: [{ notes: 'B4/4' }] })).layer).toBe('staff0')
    const state = initialEditor(draftOf())
    expect(state).toMatchObject({
      layer: 'rh',
      caret: 0,
      value: { value: 4, dots: 0, triplet: false },
      mode: 'replace',
      past: [],
      future: [],
    })
  })

  it('writes a played key at the caret and moves past it', () => {
    const state = run(start(), key(67, 0), key(69, 500))
    expect(shape(staffNotes(state.draft))).toEqual(['G4@0/24', 'A4@24/24'])
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
    const state = run(
      start('lh'),
      { type: 'mode', mode: 'chord' },
      key(48, 0),
      key(55, 900),
      key(64, 2000),
    )
    expect(shape(state.draft.hands.lh)).toEqual(['C3@0/24', 'G3@0/24', 'E4@0/24'])
    expect(state.caret).toBe(0)
  })

  it('cycles the modes round, Replace, Insert, Chord, as I does (ADR 0092)', () => {
    const once = run(start(), { type: 'mode' })
    expect(once.mode).toBe('insert')
    expect(run(once, { type: 'mode' }).mode).toBe('chord')
    expect(run(once, { type: 'mode' }, { type: 'mode' }).mode).toBe('replace')
    expect(run(once, { type: 'mode', mode: 'replace' }).mode).toBe('replace')
  })

  it('in Insert mode writes at the caret and pushes the staff’s later notes right, bars added at the end to hold them', () => {
    const four = run(start(), key(60, 0), key(62, 500), key(64, 1000), key(65, 1500))
    const inserted = run(
      four,
      { type: 'place', tick: 24, layer: 'staff0' },
      { type: 'mode', mode: 'insert' },
      key(67, 2000),
    )
    expect(shape(staffNotes(inserted.draft))).toEqual([
      'C4@0/24',
      'G4@24/24',
      'D4@48/24',
      'E4@72/24',
      'F4@96/24',
    ])
    expect(inserted.caret).toBe(48)
    expect(lengths(inserted.draft)).toEqual([96, 96])
    // Another staff's notes stay where they are.
    const both = run(
      run(start('rh'), key(72, 0)),
      { type: 'layer', layer: 'lh' },
      { type: 'mode', mode: 'insert' },
      key(48, 500),
    )
    expect(shape(both.draft.hands.rh)).toEqual(['C5@0/24'])
    // Pushed past the last bar, the notes get a bar of their own: nothing is lost.
    const full = run(start(), ...[60, 62, 64, 65, 67, 69, 71, 72].map((n, i) => key(n, i * 500)))
    expect(full.caret).toBe(192)
    const grown = run(
      full,
      { type: 'place', tick: 0, layer: 'staff0' },
      { type: 'mode', mode: 'insert' },
      key(59, 5000),
    )
    expect(lengths(grown.draft)).toEqual([96, 96, 96])
    expect(shape(staffNotes(grown.draft)).at(-1)).toBe('C5@192/24')
    expect(staffNotes(grown.draft)).toHaveLength(9)
    // Undone as one step, the bar added goes too.
    expect(lengths(run(grown, { type: 'undo' }).draft)).toEqual([96, 96])
  })

  it('in Insert mode a rest pushes the later notes right too', () => {
    const four = run(start(), key(60, 0), key(62, 500), key(64, 1000), key(65, 1500))
    const rested = run(
      four,
      { type: 'place', tick: 24, layer: 'staff0' },
      { type: 'mode', mode: 'insert' },
      { type: 'rest' },
    )
    expect(shape(staffNotes(rested.draft))).toEqual(['C4@0/24', 'D4@48/24', 'E4@72/24', 'F4@96/24'])
    expect(rested.caret).toBe(48)
    // At a barline inside a tied note, the rest cuts the tie there, as a note written there does.
    const tied = run(
      initialEditor(draftOf({ staves: [{ notes: 'r/3 C5/2 | D5/1 r/2' }] })),
      { type: 'move', by: 'bar', direction: 1 },
      { type: 'mode', mode: 'insert' },
      { type: 'rest' },
    )
    expect(shape(staffNotes(tied.draft))).toEqual(['C5@72/24', 'D5@144/24'])
    expect(tied.caret).toBe(120)
  })

  it('in Insert mode Delete closes the gap, pulling the later notes left; in Replace it leaves a rest', () => {
    const four = run(start(), key(60, 0), key(62, 500), key(64, 1000), key(65, 1500))
    const atD = run(four, { type: 'place', tick: 24, layer: 'staff0' })
    expect(shape(staffNotes(run(atD, { type: 'delete' }).draft))).toEqual([
      'C4@0/24',
      'E4@48/24',
      'F4@72/24',
    ])
    const insert = run(atD, { type: 'mode', mode: 'insert' })
    const pulled = run(insert, { type: 'delete' })
    expect(shape(staffNotes(pulled.draft))).toEqual(['C4@0/24', 'E4@24/24', 'F4@48/24'])
    expect(pulled.caret).toBe(24)
    // Backspace with nothing at the caret takes the note before and closes its gap.
    const back = run(
      insert,
      { type: 'place', tick: 96, layer: 'staff0' },
      { type: 'delete', back: true },
    )
    expect(shape(staffNotes(back.draft))).toEqual(['C4@0/24', 'D4@24/24', 'E4@48/24'])
    expect(back.caret).toBe(72)
    // A range chosen closes as one gap.
    const range = run(
      insert,
      { type: 'move', by: 'step', direction: 1, extend: true },
      { type: 'delete' },
    )
    expect(shape(staffNotes(range.draft))).toEqual(['C4@0/24', 'F4@24/24'])
    // One note of a chord taken leaves the chord, so no gap closes.
    const chord = run(start('rh'), key(60, 0), key(64, 30), key(67, 60), key(62, 500))
    const one = run(
      chord,
      { type: 'place', tick: 0, layer: 'rh', key: midi(64) },
      { type: 'mode', mode: 'insert' },
      { type: 'delete' },
    )
    expect(shape(one.draft.hands.rh)).toEqual(['C4@0/24', 'G4@0/24', 'D4@24/24'])
  })

  it('takes the value, dot and triplet for the next note', () => {
    const state = run(start(), { type: 'value', value: 8 }, { type: 'dot' }, key(67, 0))
    expect(shape(staffNotes(state.draft))).toEqual(['G4@0/18'])
    const triplet = run(start(), { type: 'value', value: 8 }, { type: 'triplet' }, key(67, 0))
    expect(shape(staffNotes(triplet.draft))).toEqual(['G4@0/8'])
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
    expect(shape(staffNotes(run(sixteenth, key(67, 0)).draft))).toEqual(['G4@0/9'])
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
    expect(shape(staffNotes(written.draft))).toEqual(['C#4@0/24'])
    expect(written.caret).toBe(48)
    const back = run(written, { type: 'place', tick: 0, layer: 'staff0' })
    expect(shape(staffNotes(run(back, { type: 'shift', semitones: 12 }).draft))).toEqual([
      'C#5@0/24',
    ])
    expect(shape(staffNotes(run(back, { type: 'respell' }).draft))).toEqual(['D♭4@0/24'])
    expect(staffNotes(run(back, { type: 'delete' }).draft)).toEqual([])
  })

  it('puts fingers on the notes at the caret bottom up, a chord’s one note alone, none taking them off (ADR 0096)', () => {
    const fingers = (state: EditorState) => state.draft.hands.rh.map((n) => n.finger)
    const chord = run(
      initialEditor(draftOf({ hands: { rh: 'C4+E4+G4/4 | B4/4' } })),
      { type: 'layer', layer: 'rh' },
      { type: 'place', tick: 0, layer: 'rh' },
    )
    const fingered = run(chord, { type: 'fingers', fingers: [1, 3, 5] })
    expect(fingers(fingered)).toEqual([1, 3, 5, undefined])
    // Fewer fingers than notes: those over them take none.
    expect(fingers(run(fingered, { type: 'fingers', fingers: [2] }))).toEqual([
      2,
      undefined,
      undefined,
      undefined,
    ])
    // The chord's one note chosen (Alt ↑, its top): that note alone.
    const top = run(fingered, { type: 'chordNote', direction: 1 })
    expect(fingers(run(top, { type: 'fingers', fingers: [4] }))).toEqual([1, 3, 4, undefined])
    expect(fingers(run(fingered, { type: 'fingers', fingers: [] }))).toEqual([
      undefined,
      undefined,
      undefined,
      undefined,
    ])
    // The same fingers again are no change; the tune takes none.
    expect(run(fingered, { type: 'fingers', fingers: [1, 3, 5] }).past).toBe(fingered.past)
    const tune = run(initialEditor(draftOf({ staves: [{ notes: 'B4/1' }] })), {
      type: 'layer',
      layer: 'staff0',
    })
    expect(run(tune, { type: 'fingers', fingers: [1] })).toBe(tune)
  })

  it('sets a chord at the caret’s beat, the caret staying there, a step going on a beat', () => {
    const am = parseChordSymbol('Am')
    const onThird = run(initialEditor(draftOf()), { type: 'place', tick: 48, layer: 'chords' })
    const typed = run(onThird, { type: 'chord', chord: am })
    expect(form(typed.draft)).toEqual([[['G@0 Am@48', 'C@0']]])
    expect(typed.caret).toBe(48)
    expect(run(typed, { type: 'move', by: 'step', direction: 1 }).caret).toBe(72)
  })

  it('takes a bar’s only chord with Delete, the bar left to type a chord into (ADR 0094)', () => {
    const am = parseChordSymbol('Am')
    const onLast = run(initialEditor(draftOf()), { type: 'place', tick: 96, layer: 'chords' })
    const deleted = run(onLast, { type: 'delete' })
    expect(form(deleted.draft)).toEqual([[['G@0', '']]])
    expect(deleted.caret).toBe(96)
    // Its places in the chord row: its start alone, where the next chord goes.
    const moved = run(deleted, { type: 'move', by: 'step', direction: 1 })
    expect(moved.caret).toBe(96)
    const typed = run(moved, { type: 'chord', chord: am })
    expect(form(typed.draft)).toEqual([[['G@0', 'Am@0']]])
  })

  it('names keys struck together in the chords as a chord, and stays', () => {
    const state = run(start('chords'), key(57, 0), key(60, 20), key(64, 40), key(67, 60))
    expect(
      state.draft.sections[0]?.lines[0]?.[0]?.chords.map((placed) => chordSymbol(placed.chord)),
    ).toEqual(['Am7'])
    expect(state.caret).toBe(0)
    expect(run(state, { type: 'undo' }).draft).toEqual(oneStaff())
  })

  it('hides the piano for a lead sheet, the caret leaving a hand for the tune, and shows it again (ADR 0083)', () => {
    const sung = initialEditor(
      draftOf({ staves: [{ notes: 'B4/1 | D5/1' }], hands: { lh: 'G2/4 | r/4' } }),
    )
    const lead = run({ ...sung, layer: 'lh' }, { type: 'piano', hidden: true })
    expect(lead.draft.leadSheet).toBe(true)
    expect(lead.draft.hands).toEqual(sung.draft.hands)
    expect(lead.layer).toBe('staff0')
    const saved = musicToSave(lead.draft)
    expect(saved).toMatchObject({ leadSheet: true, hands: { lh: 'G2/4 | r/4' } })
    expect(readDraft(saved!).leadSheet).toBe(true)
    expect(run(lead, { type: 'piano', hidden: false }).draft.leadSheet).toBe(false)
    expect(musicToSave(run(lead, { type: 'piano', hidden: false }).draft)).not.toHaveProperty(
      'leadSheet',
    )
    // Never every staff: not the piano where the score has no single staff, nor a lead sheet's last.
    const piano = initialEditor(draftOf())
    expect(run(piano, { type: 'piano', hidden: true })).toBe(piano)
    expect(run(lead, { type: 'removeStaff', place: 0 })).toBe(lead)
  })

  it('keeps the lyrics on the upper staff as a staff is added: saved with the music (ADR 0093, 0097)', () => {
    const piano = initialEditor(
      draftOf({ hands: { rh: 'G4+B4/2 D5/2 | r/4', lh: 'r/4 | r/4' }, lyrics: ['A- men'] }),
    )
    const tuned = run(piano, { type: 'addStaff', place: 0 })
    expect(tuned.draft.lyricsOn).toBe('rh')
    const saved = musicToSave(tuned.draft)
    expect(saved).toMatchObject({ staves: [{ notes: 'r/4' }], lyrics: ['A- men'], lyricsOn: 'rh' })
    expect(readDraft(saved!).lyricsOn).toBe('rh')
    // A song with no lyrics yet takes them on the staff added, the top single staff.
    const silent = run(initialEditor(draftOf()), { type: 'addStaff', place: 0 })
    expect(silent.draft.lyricsOn).toBe(0)
    // The staff taken away, its notes and their lyrics with it, the upper staff is the one left.
    expect(run(silent, { type: 'removeStaff', place: 0 }).draft.lyricsOn).toBe('rh')
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
    const tune = (state: EditorState) => shape(staffNotes(state.draft))
    const written = run(
      start('staff0'),
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
          staves: [{ notes: 'B4/2 C5/2 | D5/4 | E5/4' }],
          sections: [{ kind: 'verse', lines: ['G C D'] }],
        }),
      ),
      { type: 'layer', layer: 'staff0' },
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
    const atTwo = run(tune, { type: 'place', tick: 96, layer: 'staff0' })
    expect(span(run(atTwo, move('step', -1)))).toEqual({ from: 48, to: 192 })
    // A bar on: to the bar's last note, then the next bar's; a bar back: to its first, then before.
    expect(span(run(tune, move('bar', 1)))).toEqual({ from: 0, to: 96 })
    expect(span(run(tune, move('bar', 1), move('bar', 1)))).toEqual({ from: 0, to: 192 })
    expect(span(run(atTwo, move('bar', -1)))).toEqual({ from: 0, to: 192 })
    // To the ends: the last note, the first.
    expect(span(run(atTwo, move('end', 1)))).toEqual({ from: 96, to: 288 })
    expect(span(run(atTwo, move('end', -1)))).toEqual({ from: 0, to: 192 })
    // A note clicked with Shift is the range's end: from the caret's note to it, no bar more.
    expect(span(run(tune, { type: 'place', tick: 96, layer: 'staff0', extend: true }))).toEqual({
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
    const pasted = run(chosen, { type: 'clip', edit: 'copy' }, { type: 'clip', edit: 'paste' })
    expect(form(pasted.draft)).toEqual([[['G@0', 'C@0', 'G@0', 'C@0', 'D@0']]])
    const cut = run(chosen, { type: 'clip', edit: 'cut' })
    expect(form(cut.draft)).toEqual([[['D@0']]])
    expect(cut.clip?.kind).toBe('bars')
    expect(cut.clip?.kind === 'bars' && cut.clip.bars).toHaveLength(2)
  })

  it('copies the notes chosen on a staff and pastes them from the caret over what is there, bars added to hold them (ADR 0092)', () => {
    const four = run(start(), key(60, 0), key(62, 500), key(64, 1000), key(65, 1500))
    const chosen = run(
      four,
      { type: 'place', tick: 24, layer: 'staff0' },
      { type: 'move', by: 'step', direction: 1, extend: true },
      { type: 'clip', edit: 'copy' },
    )
    expect(chosen.clip).toEqual({
      kind: 'notes',
      layer: 'staff0',
      ticks: 48,
      notes: [
        expect.objectContaining({ startTick: 0 }),
        expect.objectContaining({ startTick: 24 }),
      ],
    })
    // Copying changes nothing, and what was chosen stays chosen.
    expect(chosen.draft).toBe(four.draft)
    expect(chosen.selection).not.toBeNull()
    const pasted = run(
      chosen,
      { type: 'place', tick: 72, layer: 'staff0' },
      { type: 'clip', edit: 'paste' },
    )
    expect(shape(staffNotes(pasted.draft))).toEqual([
      'C4@0/24',
      'D4@24/24',
      'E4@48/24',
      'D4@72/24',
      'E4@96/24',
    ])
    // The caret after what was pasted, the pasted notes chosen.
    expect(pasted.caret).toBe(120)
    expect(pasted.selection).toEqual({ anchor: { from: 72, to: 120 }, head: { from: 72, to: 120 } })
    // Pasted at the song's end, the notes get the bars they need.
    const grown = run(
      chosen,
      { type: 'place', tick: 168, layer: 'staff0' },
      { type: 'clip', edit: 'paste' },
    )
    expect(lengths(grown.draft)).toEqual([96, 96, 96])
    expect(shape(staffNotes(grown.draft)).slice(-2)).toEqual(['D4@168/24', 'E4@192/24'])
    // Pasted into a hand, the notes go on that staff.
    const toHand = run(
      chosen,
      { type: 'place', tick: 0, layer: 'lh' },
      { type: 'clip', edit: 'paste' },
    )
    expect(shape(toHand.draft.hands.lh)).toEqual(['D4@0/24', 'E4@24/24'])
    // In Insert mode the paste pushes the later notes right.
    const inserted = run(
      chosen,
      { type: 'place', tick: 24, layer: 'staff0' },
      { type: 'mode', mode: 'insert' },
      { type: 'clip', edit: 'paste' },
    )
    expect(shape(staffNotes(inserted.draft))).toEqual([
      'C4@0/24',
      'D4@24/24',
      'E4@48/24',
      'D4@72/24',
      'E4@96/24',
      'F4@120/24',
    ])
  })

  it('copies the chord at the caret, or its one note chosen, with nothing chosen', () => {
    const chord = run(start('rh'), key(60, 0), key(64, 30), key(67, 60), key(62, 500))
    const whole = run(
      chord,
      { type: 'place', tick: 0, layer: 'rh' },
      { type: 'clip', edit: 'copy' },
    )
    expect(whole.clip).toMatchObject({ kind: 'notes', layer: 'rh', ticks: 24 })
    expect(whole.clip?.kind === 'notes' && whole.clip.notes).toHaveLength(3)
    const one = run(
      chord,
      { type: 'place', tick: 0, layer: 'rh', key: midi(64) },
      { type: 'clip', edit: 'copy' },
    )
    expect(one.clip?.kind === 'notes' && shape(one.clip.notes)).toEqual(['E4@0/24'])
    // An empty place copies nothing: the clip stays as it was.
    const empty = run(one, { type: 'place', tick: 48, layer: 'rh' }, { type: 'clip', edit: 'copy' })
    expect(empty.clip).toBe(one.clip)
  })

  it('copies and cuts the chord at the caret alone, as Delete takes it, never a note starting under it', () => {
    // The upper staff in two voices: a half note, and a note from beat 2 held on past it.
    const voices = run(
      initialEditor(draftOf({ hands: { rh: 'C5/2 E4/3@2 | r/4', lh: 'r/4 | r/4' } })),
      { type: 'place', tick: 0, layer: 'rh' },
    )
    const copied = run(voices, { type: 'clip', edit: 'copy' })
    expect(copied.clip).toMatchObject({ kind: 'notes', ticks: 48 })
    expect(copied.clip?.kind === 'notes' && shape(copied.clip.notes)).toEqual(['C5@0/48'])
    expect(copyTarget(voices)).toEqual({ kind: 'notes', count: 1 })
    const cut = run(voices, { type: 'clip', edit: 'cut' })
    expect(shape(cut.draft.hands.rh)).toEqual(['E4@24/72'])
    expect(cut.draft).toEqual(run(voices, { type: 'delete' }).draft)
  })

  it('cuts the notes chosen, leaving a rest in Replace mode and closing the gap in Insert mode', () => {
    const four = run(start(), key(60, 0), key(62, 500), key(64, 1000), key(65, 1500))
    const atD = run(four, { type: 'place', tick: 24, layer: 'staff0' })
    const cut = run(atD, { type: 'clip', edit: 'cut' })
    expect(shape(staffNotes(cut.draft))).toEqual(['C4@0/24', 'E4@48/24', 'F4@72/24'])
    expect(cut.clip?.kind === 'notes' && shape(cut.clip.notes)).toEqual(['D4@0/24'])
    expect(cut.caret).toBe(24)
    const pulled = run(atD, { type: 'mode', mode: 'insert' }, { type: 'clip', edit: 'cut' })
    expect(shape(staffNotes(pulled.draft))).toEqual(['C4@0/24', 'E4@24/24', 'F4@48/24'])
    expect(run(pulled, { type: 'undo' }).draft).toBe(atD.draft)
  })

  it('pastes a clip only where it goes: bars in the chord row, notes on a staff', () => {
    const notes = run(
      start(),
      key(60, 0),
      { type: 'place', tick: 0, layer: 'staff0' },
      { type: 'clip', edit: 'copy' },
    )
    const inChords = run(notes, { type: 'layer', layer: 'chords' })
    expect(whyNoPaste(inChords)).toBe('toStaff')
    expect(run(inChords, { type: 'clip', edit: 'paste' }).draft).toBe(inChords.draft)
    const bars = run(inChords, { type: 'clip', edit: 'copy' })
    expect(whyNoPaste(bars)).toBeNull()
    const onStaff = run(bars, { type: 'layer', layer: 'staff0' })
    expect(whyNoPaste(onStaff)).toBe('toChords')
    expect(run(onStaff, { type: 'clip', edit: 'paste' }).draft).toBe(onStaff.draft)
    expect(whyNoPaste(start())).toBe('empty')
  })

  it('says what Copy takes: the bars, the notes chosen, the chord or note at the caret, or nothing', () => {
    const four = run(start(), key(60, 0), key(62, 500), key(64, 1000), key(65, 1500))
    expect(copyTarget(run(four, { type: 'layer', layer: 'chords' }))).toEqual({
      kind: 'bars',
      from: 2,
      to: 2,
    })
    expect(
      copyTarget(
        run(
          four,
          { type: 'layer', layer: 'chords' },
          { type: 'move', by: 'bar', direction: -1, extend: true },
        ),
      ),
    ).toEqual({ kind: 'bars', from: 1, to: 2 })
    expect(copyTarget(four)).toBeNull()
    expect(copyTarget(run(four, { type: 'place', tick: 24, layer: 'staff0' }))).toEqual({
      kind: 'notes',
      count: 1,
    })
    expect(
      copyTarget(
        run(
          four,
          { type: 'place', tick: 24, layer: 'staff0' },
          { type: 'move', by: 'step', direction: 1, extend: true },
        ),
      ),
    ).toEqual({ kind: 'notes', count: 2 })
  })

  it('ends the bars chosen with an edit: Delete after a chord typed takes the chord, not the bars', () => {
    const chords = run(
      initialEditor(draftOf({ sections: [{ kind: 'verse', lines: ['G C D'] }] })),
      { type: 'layer', layer: 'chords' },
    )
    const pasted = run(chords, { type: 'clip', edit: 'copy' }, { type: 'clip', edit: 'paste' })
    expect(pasted.selection).not.toBeNull()
    const typed = run(pasted, { type: 'chord', chord: parseChordSymbol('Am') })
    expect(typed.selection).toBeNull()
    const deleted = run(typed, { type: 'delete' })
    expect(form(deleted.draft)[0]?.[0]).toHaveLength(4)
  })

  it('adds and deletes bars, changes a bar’s length and starts a line and a section', () => {
    const state = run(initialEditor(draftOf()), { type: 'bars', edit: 'insert' })
    expect(form(state.draft)).toEqual([[['G@0', '', 'C@0']]])
    expect(state.caret).toBe(96)
    expect(lengths(run(state, { type: 'barLength', ticks: 48 }).draft)).toEqual([96, 48, 96])
    expect(form(run(state, { type: 'bars', edit: 'delete' }).draft)).toEqual([[['G@0', 'C@0']]])
    expect(form(run(state, { type: 'bars', edit: 'newLine' }).draft)).toEqual([
      [['G@0'], ['', 'C@0']],
    ])
    expect(run(state, { type: 'bars', edit: 'newSection' }).draft.sections).toHaveLength(2)
  })

  it('changes the song’s settings', () => {
    const state = run(initialEditor(draftOf()), { type: 'settings', tempo: 120 })
    expect(state.draft).toMatchObject({ tempo: 120 })
  })

  it('transposes the music, Undo taking it back (ADR 0110)', () => {
    const start = initialEditor(draftOf())
    const moved = run(start, {
      type: 'transpose',
      semitones: 2,
      applies: { key: true, chords: true },
    })
    expect(moved.draft.key).toEqual({ tonic: note('A'), minor: false })
    expect(form(moved.draft)).toEqual([[['A@0', 'D@0']]])
    expect(run(moved, { type: 'undo' }).draft).toEqual(start.draft)
  })

  it('gives the song a title of the learner’s own, saved with its music, an empty one changing nothing (ADR 0094)', () => {
    const named = run(initialEditor(draftOf()), { type: 'title', title: '  Evening  ' })
    expect(named.draft.title).toBe('Evening')
    const saved = musicToSave(named.draft)
    if (!saved) throw new Error('music that reads')
    expect(saved.title).toBe('Evening')
    expect(readDraft(saved).title).toBe('Evening')
    expect(run(named, { type: 'title', title: '   ' })).toBe(named)
    expect(run(named, { type: 'title', title: 'x'.repeat(81) })).toBe(named)
    expect(run(named, { type: 'title', title: 'Evening' })).toBe(named)
    // Undone, the title it had: none of its own, the catalog's.
    expect(run(named, { type: 'undo' }).draft.title).toBeUndefined()
    expect(musicToSave(draftOf())).not.toHaveProperty('title')
  })

  it('undoes and redoes the changes with the caret, and a new change drops the redo', () => {
    const written = run(start(), key(67, 0), key(69, 500))
    const undone = run(written, { type: 'undo' })
    expect(shape(staffNotes(undone.draft))).toEqual(['G4@0/24'])
    expect(undone.caret).toBe(24)
    expect(run(undone, { type: 'redo' }).draft).toBe(written.draft)
    expect(run(undone, key(71, 900)).future).toEqual([])
    expect(run(initialEditor(draftOf()), { type: 'undo' })).toEqual(initialEditor(draftOf()))
  })
})

describe('the palette on what is chosen', () => {
  const tune = () =>
    initialEditor(
      draftOf({
        staves: [{ notes: 'B4/1 A4/1 G4/1 F#4/1' }],
        sections: [{ kind: 'verse', lines: ['G C'] }],
      }),
    )
  const at = (state: EditorState, tick: number) =>
    run(state, { type: 'layer', layer: 'staff0' }, { type: 'place', tick, layer: 'staff0' })

  it('makes the note chosen the value tapped, the next notes too, the caret staying', () => {
    const state = run(at(tune(), 24), { type: 'value', value: 8 })
    expect(shape(staffNotes(state.draft))).toEqual(['B4@0/24', 'A4@24/12', 'G4@48/24', 'F#4@72/24'])
    expect(state.caret).toBe(24)
    expect(state.value).toEqual({ value: 8, dots: 0, triplet: false })
    expect(shownValue(state)).toEqual({ value: 8, dots: 0, triplet: false })
    expect(staffNotes(run(state, { type: 'undo' }).draft)[1]?.durationTicks).toBe(24)
  })

  it('dots the note chosen, and makes it a triplet’s', () => {
    const dotted = run(at(tune(), 0), { type: 'value', value: 8 }, { type: 'dot' })
    expect(shape(staffNotes(dotted.draft)).slice(0, 2)).toEqual(['B4@0/18', 'A4@24/24'])
    const triplet = run(at(tune(), 0), { type: 'value', value: 8 }, { type: 'triplet' })
    expect(staffNotes(triplet.draft)[0]?.durationTicks).toBe(8)
  })

  it('changes every note of a range, keeping it chosen', () => {
    const chosen = run(at(tune(), 0), { type: 'move', by: 'step', direction: 1, extend: true })
    const state = run(chosen, { type: 'value', value: 8 })
    expect(shape(staffNotes(state.draft))).toEqual(['B4@0/12', 'A4@24/12', 'G4@48/24', 'F#4@72/24'])
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
    expect(shape(staffNotes(state.draft))).toEqual(['G4@48/24', 'F#4@72/24'])
    expect(state.caret).toBe(0)
  })

  it('writes the note chosen sharp, flat or natural, and the same sign again takes it off (Flat’s)', () => {
    const natural = run(at(tune(), 72), { type: 'accidental', accidental: 0 })
    expect(shape(staffNotes(natural.draft)).at(-1)).toBe('F4@72/24')
    // ♮ again: back to the key's F♯.
    expect(
      shape(staffNotes(run(natural, { type: 'accidental', accidental: 0 }).draft)).at(-1),
    ).toBe('F#4@72/24')
    // The chord's one note chosen follows its sign on and off.
    const chord = run(
      initialEditor(draftOf({ hands: { rh: 'C4+E4/4 | r/4' } })),
      { type: 'layer', layer: 'rh' },
      { type: 'place', tick: 0, layer: 'rh', key: midi(64) },
    )
    const flat = run(chord, { type: 'accidental', accidental: -1 })
    expect(shape(flat.draft.hands.rh)).toEqual(['C4@0/96', 'E♭4@0/96'])
    expect(flat.chordNote).toBe(63)
    const back = run(flat, { type: 'accidental', accidental: -1 })
    expect(shape(back.draft.hands.rh)).toEqual(['C4@0/96', 'E4@0/96'])
    expect(back.chordNote).toBe(64)
  })

  it('adds a bar before the caret’s, and gives each bar chosen a length and the first a clef', () => {
    const before = run(initialEditor(draftOf()), { type: 'bars', edit: 'insertBefore' })
    expect(form(before.draft)).toEqual([[['', 'G@0', 'C@0']]])
    expect(before.caret).toBe(0)
    const both = run(
      initialEditor(draftOf()),
      { type: 'layer', layer: 'chords' },
      { type: 'move', by: 'bar', direction: 1, extend: true },
    )
    expect(lengths(run(both, { type: 'barLength', ticks: 48 }).draft)).toEqual([48, 48])
    // From the bar given, wherever the caret is (a clef on the sheet, ADR 0094).
    const clef = run(initialEditor(draftOf()), { type: 'clef', staff: 'rh', clef: 'bass', bar: 1 })
    expect(clef.draft.sections[0]?.lines[0]?.[1]?.clefs).toEqual({ rh: 'bass' })
    // A single staff's clef is its whole staff's (ADR 0097).
    const sung = initialEditor(draftOf({ staves: [{ notes: 'B4/4' }] }))
    const low = run(sung, { type: 'clef', staff: 'staff0', clef: 'bass', bar: 1 })
    expect(low.draft.staves[0]?.clef).toBe('bass')
    expect(musicToSave(low.draft)?.staves?.[0]).toMatchObject({ clef: 'bass' })
  })
})

describe('createEditorStore', () => {
  it('saves the draft only when an action changed it', () => {
    const onChange = vi.fn()
    const store = createEditorStore(oneStaff(), onChange)
    store.dispatch({ type: 'layer', layer: 'staff0' })
    expect(onChange).not.toHaveBeenCalled()
    store.dispatch(key(67, 0))
    expect(onChange).toHaveBeenCalledWith(store.getState().draft)
  })

  it('takes an edit that changes nothing as no undo step and saves nothing', () => {
    const onChange = vi.fn()
    const store = createEditorStore(draftOf(), onChange)
    const nothing: EditorAction[] = [
      { type: 'layer', layer: 'staff0' },
      { type: 'delete' },
      { type: 'settings', tempo: 90, key: store.getState().draft.key },
      { type: 'layer', layer: 'rh' },
      // A beat no chord starts on.
      { type: 'place', tick: 24, layer: 'chords' },
      { type: 'delete' },
      { type: 'place', tick: 0, layer: 'chords' },
      { type: 'bars', edit: 'newLine' },
      { type: 'barLength', ticks: 96 },
      { type: 'chord', chord: parseChordSymbol('G') },
    ]
    for (const action of nothing) store.dispatch(action)
    expect(onChange).not.toHaveBeenCalled()
    expect(store.getState().past).toEqual([])
  })

  it('takes a rest or Insert mode’s Delete on empty staff as no step, the caret moving as it would', () => {
    const onEmpty = run(initialEditor(draftOf({ sections: [{ kind: 'verse', lines: ['G'] }] })), {
      type: 'layer',
      layer: 'staff0',
    })
    const rested = run(onEmpty, { type: 'rest' })
    expect(rested.draft).toBe(onEmpty.draft)
    expect(rested.caret).toBe(24)
    const insert = run(
      onEmpty,
      { type: 'mode', mode: 'insert' },
      { type: 'place', tick: 72, layer: 'staff0' },
      { type: 'value', value: 2 },
    )
    // Nothing after the caret to push: the rest stops at the song's end, as Replace writes it.
    const pushed = run(insert, { type: 'rest' })
    expect(pushed.draft).toBe(onEmpty.draft)
    expect(pushed.caret).toBe(96)
    const closed = run(insert, { type: 'delete' })
    expect(closed.draft).toBe(onEmpty.draft)
    expect(closed.past).toEqual([])
  })
})

describe('the words (ADR 0093)', () => {
  const sung = () =>
    initialEditor(
      draftOf({
        key: 'C',
        sections: [{ kind: 'verse', lines: ['C G'] }],
        staves: [{ notes: 'C4/1 D4/1 E4/1 F4/1 | r/4' }],
        hands: { rh: 'r/4 | r/4', lh: 'r/4 | r/4' },
      }),
    )
  const verses = (state: EditorState) => musicToSave(state.draft)?.lyrics

  it('writes a syllable on the tune’s note at the caret, undone as one step, nowhere else', () => {
    const first = run(sung(), { type: 'syllable', verse: 0, text: 'Si-_' })
    expect(first.layer).toBe('staff0')
    expect(verses(first)).toEqual(['Si-_'])
    const on = run(
      first,
      { type: 'move', by: 'step', direction: 1 },
      { type: 'move', by: 'step', direction: 1 },
    )
    const second = run(on, { type: 'syllable', verse: 0, text: 'lent' })
    expect(verses(second)).toEqual(['Si-_ lent'])
    expect(verses(run(second, { type: 'undo' }))).toEqual(['Si-_'])
    // The upper staff is not the tune where the score has the tune's own staff.
    const elsewhere = run(
      sung(),
      { type: 'layer', layer: 'rh' },
      { type: 'syllable', verse: 0, text: 'x' },
    )
    expect(verses(elsewhere)).toBeUndefined()
    // A note deleted takes its syllable with it.
    const gone = run(first, { type: 'delete' })
    expect(verses(gone)).toBeUndefined()
  })

  it('keeps a chord’s syllable where the note singing it is taken alone: a chord is one note of the tune', () => {
    // No tune's staff: the upper staff sings, each chord on its highest note.
    const hymn = initialEditor(
      draftOf({
        key: 'C',
        sections: [{ kind: 'verse', lines: ['C G'] }],
        hands: { rh: 'C4+E4+G4/2 D4+G4/2 | C4+E4/4', lh: 'r/4 | r/4' },
        lyrics: ['Hal- le- lu'],
      }),
    )
    const top = run(
      hymn,
      { type: 'place', tick: 0, layer: 'rh', key: midi(67) },
      { type: 'delete' },
    )
    expect(shape(top.draft.hands.rh).slice(0, 2)).toEqual(['C4@0/48', 'E4@0/48'])
    expect(verses(top)).toEqual(['Hal- le- lu'])
  })
})
