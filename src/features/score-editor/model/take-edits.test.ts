import { describe, expect, it } from 'vitest'
import { midi } from '@/shared/lib/music'
import { draftOf, shape } from '../testing/test-draft'
import { takeParts, writeTake, type TakePart } from './take-edits'
import { barsOf, totalTicks } from './timeline'

const note = (key: number, startTick: number, durationTicks: number) => ({
  midi: midi(key),
  startTick,
  durationTicks,
})
const written = (draft: ReturnType<typeof draftOf>) =>
  barsOf(draft).map(({ bar }) => `${bar.rh ? 'R' : '-'}${bar.lh ? 'L' : '-'}`)

describe('takeParts', () => {
  it('splits a take between the hands at a key, from it up to the right hand', () => {
    const notes = [note(48, 0, 24), note(60, 0, 24), note(67, 24, 24)]
    expect(takeParts(notes, 'both', midi(60))).toEqual([
      { layer: 'rh', notes: [note(60, 0, 24), note(67, 24, 24)] },
      { layer: 'lh', notes: [note(48, 0, 24)] },
    ])
    expect(takeParts(notes, 'melody', midi(60))).toEqual([{ layer: 'melody', notes }])
  })
})

describe('writeTake', () => {
  // G major in 4/4: two bars of 96 ticks.
  it('writes each hand from the bar it starts, its bars written out, spelled in the key', () => {
    const parts: TakePart[] = [
      { layer: 'rh', notes: [note(66, 0, 24), note(71, 24, 72)] },
      { layer: 'lh', notes: [note(43, 0, 96)] },
    ]
    const draft = writeTake(draftOf(), 0, parts)
    expect(shape(draft.hands.rh)).toEqual(['F#4@0/24', 'B4@24/72'])
    expect(shape(draft.hands.lh)).toEqual(['G2@0/96'])
    expect(written(draft)).toEqual(['RL', '--'])
  })

  it('writes over whole bars: a hand silent where nothing was played, a bar after it left alone', () => {
    const draft = draftOf({ hands: { rh: 'D5/4 | D5/4', lh: 'G2/4 | G2/4' } })
    const parts: TakePart[] = [
      { layer: 'rh', notes: [note(67, 24, 24)] },
      { layer: 'lh', notes: [] },
    ]
    const after = writeTake(draft, 0, parts)
    expect(shape(after.hands.rh)).toEqual(['G4@24/24', 'D5@96/96'])
    expect(shape(after.hands.lh)).toEqual(['G2@96/96'])
    expect(written(after)).toEqual(['RL', 'RL'])
  })

  it('starts at the bar it is written from', () => {
    const draft = writeTake(draftOf(), 96, [{ layer: 'rh', notes: [note(67, 0, 24)] }])
    expect(shape(draft.hands.rh)).toEqual(['G4@96/24'])
    expect(written(draft)).toEqual(['--', 'R-'])
  })

  it('adds bars for a take that runs past the piece’s end', () => {
    const draft = writeTake(draftOf(), 96, [{ layer: 'lh', notes: [note(43, 0, 192)] }])
    expect(totalTicks(draft)).toBe(288)
    expect(shape(draft.hands.lh)).toEqual(['G2@96/192'])
    expect(written(draft)).toEqual(['--', '-L', '-L'])
  })

  it('keeps the melody one line: the highest key at each onset, a note cut where the next starts', () => {
    const draft = draftOf({ melody: 'B4/2 A4/4 G4/2' })
    const parts: TakePart[] = [
      { layer: 'melody', notes: [note(60, 0, 48), note(64, 0, 24), note(67, 12, 24)] },
    ]
    expect(shape(writeTake(draft, 96, parts).melody)).toEqual([
      'B4@0/48',
      'A4@48/48',
      'E4@96/12',
      'G4@108/24',
    ])
  })

  it('changes nothing for a take with no notes', () => {
    const draft = draftOf()
    expect(writeTake(draft, 0, [{ layer: 'rh', notes: [] }])).toBe(draft)
  })
})
