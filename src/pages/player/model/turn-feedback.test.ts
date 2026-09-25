import { describe, expect, it } from 'vitest'
import { pieceById } from '@/entities/piece'
import { arrangePiece, initialPractice, ownChoice, practiceReducer } from '@/features/practice'
import { midi } from '@/shared/lib/music'
import { turnFeedback } from './turn-feedback'

const bz5 = pieceById('bz5')
if (!bz5) throw new Error('bz5')
const performance = arrangePiece(bz5, ownChoice(bz5))
// Your turn moves on past a beat group its hand has nothing to play in, so the fixture waits where
// the right hand first plays.
const firstRightHand = performance.beatGroups.findIndex((group) =>
  group.notes.some((index) => performance.notes[index]?.hand === 'rh'),
)
const turn = practiceReducer(initialPractice(performance, 'turn', 'rh'), {
  type: 'jumpToBeatGroup',
  beatGroup: firstRightHand,
})

describe('turnFeedback', () => {
  it('says nothing outside Your turn', () => {
    expect(turnFeedback(performance, initialPractice(performance, 'listen', 'both'))).toBeNull()
  })

  it('names the notes to play, spelled from their chord', () => {
    const feedback = turnFeedback(performance, turn)
    expect(feedback?.kind).toBe('play')
    // The first bar is G: the right hand plays some of G B D.
    if (feedback?.kind === 'play')
      expect(feedback.notes.every((n) => ['G', 'B', 'D'].includes(n))).toBe(true)
  })

  it('names a wrong key, and says when a group is right or the piece is finished', () => {
    expect(turnFeedback(performance, { ...turn, outcome: 'wrong', wrong: midi(61) })).toEqual({
      kind: 'not',
      note: 'C#',
    })
    expect(turnFeedback(performance, { ...turn, outcome: 'correct' })).toEqual({ kind: 'right' })
    expect(turnFeedback(performance, { ...turn, outcome: 'finished' })).toEqual({
      kind: 'finished',
    })
  })
})
