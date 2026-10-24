import { describe, expect, it } from 'vitest'
import { midi, note } from '@/shared/lib/music'
import { draftOf, shape } from '../testing/test-draft'
import { clipFits, copyNotes, pasteNotes, type NotesClip } from './clip'
import { musicToSave } from './draft'

describe('the notes clipboard (ADR 0092)', () => {
  it('copies the notes starting in a span, timed from its start, with its length', () => {
    const sung = draftOf({ melody: 'B4/1 C5/1 D5/2 | E5/4' })
    const clip = copyNotes(sung, 'melody', { from: 24, to: 96 })
    expect(clip).toMatchObject({ kind: 'notes', layer: 'melody', ticks: 72 })
    expect(shape(clip.notes)).toEqual(['C5@0/24', 'D5@24/48'])
  })

  it('pastes a hand’s chord into the melody as its highest note, the finger left behind', () => {
    const chord = draftOf({ hands: { rh: 'C4+E4+G4^3/4 | r/4' } })
    const clip = copyNotes(chord, 'rh', { from: 0, to: 96 })
    expect(clip.notes.some((n) => n.finger !== undefined)).toBe(true)
    const pasted = pasteNotes(draftOf({ melody: 'r/4 | r/4' }), 'melody', 0, clip, false)
    expect(shape(pasted.draft.melody)).toEqual(['G4@0/96'])
    expect(pasted.draft.melody[0]?.finger).toBeUndefined()
    expect(pasted.end).toBe(96)
  })

  it('pastes a hand’s notes into the melody as one line: each cut where the next starts', () => {
    // A whole note with a quarter struck under it on beat 3: the tune cannot hold both.
    const held = draftOf({ hands: { rh: 'C5/4 E4/1@3 | r/4' } })
    const clip = copyNotes(held, 'rh', { from: 0, to: 96 })
    const pasted = pasteNotes(draftOf({ melody: 'r/4 | r/4' }), 'melody', 0, clip, false)
    expect(shape(pasted.draft.melody)).toEqual(['C5@0/48', 'E4@48/24'])
    expect(musicToSave(pasted.draft)).not.toBeNull()
  })

  it('pastes into the melody no further than the clip’s end, the tune’s later notes kept', () => {
    // The half note's span chosen: the note from beat 2 starts inside it and is held past it.
    const voices = draftOf({ hands: { rh: 'C5/2 E4/3@2 | r/4' } })
    const clip = copyNotes(voices, 'rh', { from: 0, to: 48 })
    expect(shape(clip.notes)).toEqual(['C5@0/48', 'E4@24/72'])
    const tune = draftOf({ melody: 'G4/1 A4/1 B4/1 C5/1 | D5/4' })
    const pasted = pasteNotes(tune, 'melody', 0, clip, false)
    expect(shape(pasted.draft.melody)).toEqual([
      'C5@0/24',
      'E4@24/24',
      'B4@48/24',
      'C5@72/24',
      'D5@96/96',
    ])
    expect(musicToSave(pasted.draft)).not.toBeNull()
  })

  it('spells the pasted notes in the key where they land', () => {
    const inF: NotesClip = {
      kind: 'notes',
      layer: 'melody',
      ticks: 24,
      notes: [{ midi: midi(70), spelled: note('B', -1), startTick: 0, durationTicks: 24 }],
    }
    // G major writes A♯ for key 70.
    const pasted = pasteNotes(draftOf(), 'melody', 0, inF, false)
    expect(shape(pasted.draft.melody)).toEqual(['A#4@0/24'])
  })

  it('fits bars to the chord row and notes to a staff', () => {
    const notes: NotesClip = { kind: 'notes', layer: 'melody', ticks: 24, notes: [] }
    expect(clipFits(notes, 'melody')).toBe(true)
    expect(clipFits(notes, 'lh')).toBe(true)
    expect(clipFits(notes, 'chords')).toBe(false)
    const bars = { kind: 'bars' as const, bars: [], melody: [], hands: { rh: [], lh: [] } }
    expect(clipFits(bars, 'chords')).toBe(true)
    expect(clipFits(bars, 'rh')).toBe(false)
  })
})
