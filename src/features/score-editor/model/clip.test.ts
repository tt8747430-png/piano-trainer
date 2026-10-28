import { describe, expect, it } from 'vitest'
import { midi, note, TICKS_PER_BEAT } from '@/shared/lib/music'
import { draftOf, oneStaff, shape, staffNotes } from '../testing/test-draft'
import { clipFits, copyNotes, pasteNotes, type NotesClip } from './clip'
import { musicToSave } from './draft'

const B = TICKS_PER_BEAT

describe('the notes clipboard (ADR 0114)', () => {
  it('copies the notes starting in a span, timed from its start, with its length', () => {
    const sung = draftOf({ staves: [{ notes: 'B4/1 C5/1 D5/2 | E5/4' }] })
    const clip = copyNotes(sung, 'staff0', { from: B, to: 4 * B })
    expect(clip).toMatchObject({ kind: 'notes', layer: 'staff0', ticks: 3 * B })
    expect(shape(clip.notes)).toEqual(['C5@0/1', 'D5@1/2'])
  })

  it('pastes a hand’s chord onto a single staff as its highest note, the finger left behind', () => {
    const chord = draftOf({ hands: { rh: 'C4+E4+G4^3/4 | r/4' } })
    const clip = copyNotes(chord, 'rh', { from: 0, to: 4 * B })
    expect(clip.notes.some((n) => n.finger !== undefined)).toBe(true)
    const pasted = pasteNotes(
      draftOf({ staves: [{ notes: 'r/4 | r/4' }] }),
      'staff0',
      0,
      clip,
      false,
    )
    expect(shape(staffNotes(pasted.draft))).toEqual(['G4@0/4'])
    expect(staffNotes(pasted.draft)[0]?.finger).toBeUndefined()
    expect(pasted.end).toBe(4 * B)
  })

  it('pastes a hand’s notes onto a single staff as one line: each cut where the next starts', () => {
    // A whole note with a quarter struck under it on beat 3: the tune cannot hold both.
    const held = draftOf({ hands: { rh: 'C5/4 E4/1@3 | r/4' } })
    const clip = copyNotes(held, 'rh', { from: 0, to: 4 * B })
    const pasted = pasteNotes(
      draftOf({ staves: [{ notes: 'r/4 | r/4' }] }),
      'staff0',
      0,
      clip,
      false,
    )
    expect(shape(staffNotes(pasted.draft))).toEqual(['C5@0/2', 'E4@2/1'])
    expect(musicToSave(pasted.draft)).not.toBeNull()
  })

  it('pastes onto a single staff no further than the clip’s end, its later notes kept', () => {
    // The half note's span chosen: the note from beat 2 starts inside it and is held past it.
    const voices = draftOf({ hands: { rh: 'C5/2 E4/3@2 | r/4' } })
    const clip = copyNotes(voices, 'rh', { from: 0, to: 2 * B })
    expect(shape(clip.notes)).toEqual(['C5@0/2', 'E4@1/3'])
    const tune = draftOf({ staves: [{ notes: 'G4/1 A4/1 B4/1 C5/1 | D5/4' }] })
    const pasted = pasteNotes(tune, 'staff0', 0, clip, false)
    expect(shape(staffNotes(pasted.draft))).toEqual([
      'C5@0/1',
      'E4@1/1',
      'B4@2/1',
      'C5@3/1',
      'D5@4/4',
    ])
    expect(musicToSave(pasted.draft)).not.toBeNull()
  })

  it('spells the pasted notes in the key where they land', () => {
    const inF: NotesClip = {
      kind: 'notes',
      layer: 'staff0',
      ticks: B,
      notes: [{ midi: midi(70), spelled: note('B', -1), startTick: 0, durationTicks: B }],
    }
    // G major writes A♯ for key 70.
    const pasted = pasteNotes(oneStaff(), 'staff0', 0, inF, false)
    expect(shape(staffNotes(pasted.draft))).toEqual(['A#4@0/1'])
  })

  it('fits bars to the chord row and notes to a staff', () => {
    const notes: NotesClip = { kind: 'notes', layer: 'staff0', ticks: B, notes: [] }
    expect(clipFits(notes, 'staff0')).toBe(true)
    expect(clipFits(notes, 'lh')).toBe(true)
    expect(clipFits(notes, 'chords')).toBe(false)
    const bars = { kind: 'bars' as const, bars: [], staves: [], hands: { rh: [], lh: [] } }
    expect(clipFits(bars, 'chords')).toBe(true)
    expect(clipFits(bars, 'rh')).toBe(false)
  })
})
