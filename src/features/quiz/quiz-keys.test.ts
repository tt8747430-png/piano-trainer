import { describe, expect, it } from 'vitest'
import {
  chordSkill,
  chordSymbol,
  midi,
  note,
  scaleSkill,
  spellChord,
  spellScale,
} from '@/shared/lib/music'
import type { Question } from './quiz-machine'
import { answerKeys, QUIZ_RANGE, quizKeyboardRange, targetKeys } from './quiz-keys'

const chordAsked = (letter: 'C' | 'B', quality: 'maj' | 'n13') => {
  const root = note(letter)
  return {
    skill: chordSkill(quality),
    root,
    quality,
    symbol: chordSymbol({ root, quality }),
    tones: spellChord(root, quality),
  }
}
const chord = (letter: 'C' | 'B', quality: 'maj' | 'n13'): Question => ({
  mode: 'build-chord',
  ...chordAsked(letter, quality),
})

describe('quiz keys', () => {
  it('builds on one octave and a third from middle C', () => {
    expect(quizKeyboardRange(chord('C', 'maj'))).toEqual(QUIZ_RANGE)
  })

  it('widens the keyboard to show a wide chord whole', () => {
    const question: Question = { mode: 'name-chord', ...chordAsked('B', 'n13'), options: [] }
    const { from, to } = quizKeyboardRange(question)
    for (const key of targetKeys(question)) {
      expect(key).toBeGreaterThanOrEqual(from)
      expect(key).toBeLessThanOrEqual(to)
    }
  })

  it('shows a high scale whole, so the answer is on the keys after Check', () => {
    const root = note('B')
    const question: Question = {
      mode: 'build-scale',
      skill: scaleSkill('major'),
      root,
      kind: 'major',
      notes: spellScale(root, 'major'),
    }
    expect(quizKeyboardRange(question).to).toBeGreaterThanOrEqual(Math.max(...targetKeys(question)))
  })

  it('shows the answer: right keys by role, missing ones outlined, extra ones wrong', () => {
    const { marks, outlined, wrong } = answerKeys(chord('C', 'maj'), [midi(60), midi(63), midi(67)])
    expect(marks.get(midi(60))?.tone).toBe('root')
    expect(marks.get(midi(67))?.tone).toBe('5th')
    expect([...outlined]).toEqual([64])
    expect([...wrong]).toEqual([63])
  })
})
