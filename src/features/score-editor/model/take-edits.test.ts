import { describe, expect, it } from 'vitest'
import { midi, TICKS_PER_BEAT } from '@/shared/lib/music'
import { draftOf, shape, staffNotes } from '../testing/test-draft'
import { takeParts, writeTake, type TakePart } from './take-edits'
import { totalTicks } from './timeline'

const B = TICKS_PER_BEAT

const note = (key: number, startTick: number, durationTicks: number) => ({
  midi: midi(key),
  startTick,
  durationTicks,
})

describe('takeParts', () => {
  it('splits a take between the hands at a key, from it up to the right hand', () => {
    const notes = [note(48, 0, B), note(60, 0, B), note(67, B, B)]
    expect(takeParts(notes, 'both', midi(60))).toEqual([
      { layer: 'rh', notes: [note(60, 0, B), note(67, B, B)] },
      { layer: 'lh', notes: [note(48, 0, B)] },
    ])
    expect(takeParts(notes, 'staff0', midi(60))).toEqual([{ layer: 'staff0', notes }])
  })
})

describe('writeTake', () => {
  // G major in 4/4: two bars of 96 ticks.
  it('writes each hand from the bar it starts, spelled in the key', () => {
    const parts: TakePart[] = [
      { layer: 'rh', notes: [note(66, 0, B), note(71, B, 3 * B)] },
      { layer: 'lh', notes: [note(43, 0, 4 * B)] },
    ]
    const draft = writeTake(draftOf(), 0, parts)
    expect(shape(draft.hands.rh)).toEqual(['F#4@0/1', 'B4@1/3'])
    expect(shape(draft.hands.lh)).toEqual(['G2@0/4'])
  })

  it('writes over whole bars: a hand silent where nothing was played, a bar after it left alone', () => {
    const draft = draftOf({ hands: { rh: 'D5/4 | D5/4', lh: 'G2/4 | G2/4' } })
    const parts: TakePart[] = [
      { layer: 'rh', notes: [note(67, B, B)] },
      { layer: 'lh', notes: [] },
    ]
    const after = writeTake(draft, 0, parts)
    expect(shape(after.hands.rh)).toEqual(['G4@1/1', 'D5@4/4'])
    expect(shape(after.hands.lh)).toEqual(['G2@4/4'])
  })

  it('starts at the bar it is written from', () => {
    const draft = writeTake(draftOf(), 4 * B, [{ layer: 'rh', notes: [note(67, 0, B)] }])
    expect(shape(draft.hands.rh)).toEqual(['G4@4/1'])
  })

  it('adds bars for a take that runs past the piece’s end', () => {
    const draft = writeTake(draftOf(), 4 * B, [{ layer: 'lh', notes: [note(43, 0, 8 * B)] }])
    expect(totalTicks(draft)).toBe(12 * B)
    expect(shape(draft.hands.lh)).toEqual(['G2@4/8'])
  })

  it('keeps a single staff one line: the highest key at each onset, a note cut where the next starts', () => {
    const draft = draftOf({ staves: [{ notes: 'B4/2 A4/4 G4/2' }] })
    const parts: TakePart[] = [
      { layer: 'staff0', notes: [note(60, 0, 2 * B), note(64, 0, B), note(67, 0.5 * B, B)] },
    ]
    expect(shape(staffNotes(writeTake(draft, 4 * B, parts)))).toEqual([
      'B4@0/2',
      'A4@2/2',
      'E4@4/.5',
      'G4@4.5/1',
    ])
  })

  it('changes nothing for a take with no notes', () => {
    const draft = draftOf()
    expect(writeTake(draft, 0, [{ layer: 'rh', notes: [] }])).toBe(draft)
  })
})
