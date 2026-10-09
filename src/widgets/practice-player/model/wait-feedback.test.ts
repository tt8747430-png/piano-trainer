import { BUILT_IN_PATTERNS } from '@/entities/pattern'
import { describe, expect, it } from 'vitest'
import { pieceById } from '@/entities/piece'
import {
  arrangePiece,
  initialPractice,
  ownChoice,
  practiceReducer,
  type PracticeEvent,
} from '@/features/practice'
import { midi, noteName } from '@/shared/lib/music'
import { waitFeedback } from './wait-feedback'

const bz5 = pieceById('bz5')
if (!bz5) throw new Error('bz5')
const performance = arrangePiece(bz5, ownChoice(bz5), BUILT_IN_PATTERNS)
// Wait mode moves on past a beat group its hand has nothing to play in, so the fixture waits where
// the right hand first plays.
const firstRightHand = performance.beatGroups.findIndex((group) =>
  group.notes.some((index) => performance.notes[index]?.hand === 'rh'),
)
const toFirstRightHand: PracticeEvent = { type: 'jumpToBeatGroup', beatGroup: firstRightHand }
const waiting = [{ type: 'play' } as const, toFirstRightHand].reduce(
  practiceReducer,
  initialPractice(performance, 'wait', 'rh'),
)

describe('waitFeedback', () => {
  it('says nothing outside Wait mode', () => {
    expect(waitFeedback(performance, initialPractice(performance, 'listen', 'both'))).toBeNull()
  })

  it('says nothing while Wait mode is stopped, except Finished', () => {
    const stopped = practiceReducer(initialPractice(performance, 'wait', 'rh'), toFirstRightHand)
    expect(waitFeedback(performance, stopped)).toBeNull()
    expect(waitFeedback(performance, { ...stopped, outcome: 'finished' })).toEqual({
      kind: 'finished',
    })
  })

  it('names the notes to play from the chord now', () => {
    const feedback = waitFeedback(performance, waiting)
    expect(feedback?.kind).toBe('play')
    // The first bar is G: the right hand plays some of G B D.
    if (feedback?.kind === 'play')
      expect(feedback.notes.every((n) => ['G', 'B', 'D'].includes(n))).toBe(true)
  })

  it('names the notes lowest first, as the hands play them', () => {
    const bz1 = pieceById('bz1')
    if (!bz1) throw new Error('bz1')
    const bm = arrangePiece(bz1, ownChoice(bz1), BUILT_IN_PATTERNS)
    const playing = practiceReducer(initialPractice(bm, 'wait', 'both'), { type: 'play' })
    // Thank you, God opens on Bm: B in the bass, then D and F♯ above it.
    expect(waitFeedback(bm, playing)).toEqual({ kind: 'play', notes: ['B', 'D', 'F#'] })
  })

  it('names the notes to play as they are written', () => {
    const feedback = waitFeedback(performance, waiting)
    if (feedback?.kind !== 'play') throw new Error('expected a note to play')
    const group = performance.beatGroups[waiting.beatGroup]
    const written = (group?.notes ?? [])
      .map((i) => performance.notes[i])
      .filter((n) => n?.hand === 'rh')
    expect(new Set(feedback.notes)).toEqual(
      new Set(written.flatMap((n) => (n ? [noteName(n.spelled)] : []))),
    )
  })

  it('names a wrong key, and says when a group is right or the piece is finished', () => {
    expect(waitFeedback(performance, { ...waiting, outcome: 'wrong', wrong: midi(61) })).toEqual({
      kind: 'not',
      note: 'C#',
    })
    expect(waitFeedback(performance, { ...waiting, outcome: 'correct' })).toEqual({ kind: 'right' })
    expect(waitFeedback(performance, { ...waiting, outcome: 'finished' })).toEqual({
      kind: 'finished',
    })
  })
})
