import { describe, expect, it } from 'vitest'
import { midi } from '@/shared/lib/music'
import { lessonById } from '@/entities/lesson'
import {
  answerSounds,
  chosenOf,
  isRight,
  questionAnswer,
  questionKeys,
  questionAnswers,
  questionReducer,
  type QuestionState,
} from './lesson-question'

const keys = (...numbers: number[]) => numbers.map((n) => midi(n))
const E_MINOR = questionAnswer({ chord: 'Em' })

describe('questionAnswer', () => {
  it('places a chord answer as the Chords explorer does, each tone by role', () => {
    expect(E_MINOR.keys).toEqual([64, 67, 71])
    expect(E_MINOR.marks.get(midi(67))).toEqual({ tone: '3rd', label: '♭3' })
  })

  it('places notes from middle C up, each with its name', () => {
    const third = questionAnswer({ notes: ['F', 'A'] })
    expect(third.keys).toEqual([65, 69])
    expect(third.marks.get(midi(69))).toEqual({ tone: 'scale', label: 'A' })
  })

  it('places notes in their order, each the first of its name above the last', () => {
    expect(questionAnswer({ notes: ['E', 'C'], rising: true }).keys).toEqual([64, 72])
    expect(questionAnswer({ notes: ['D', 'E', 'F#', 'G', 'A', 'B', 'C#'] }).keys).toEqual([
      62, 64, 66, 67, 69, 71, 73,
    ])
  })
})

describe('questionAnswers', () => {
  it('holds each question of a lesson by its place, section.block, with its answer on the keys', () => {
    const lesson = lessonById('bass-and-chords')
    if (!lesson) throw new Error('the lesson is missing')
    const answers = questionAnswers(lesson)
    const places = lesson.sections.flatMap((section, s) =>
      section.blocks.flatMap((block, b) => (block.kind === 'question' ? [`${s}.${b}`] : [])),
    )
    expect([...answers.keys()]).toEqual(places)
    expect(places.length).toBeGreaterThan(0)
  })
})

describe('answerSounds', () => {
  const onsets = (answer: Parameters<typeof answerSounds>[0]) =>
    answerSounds(answer, keys(65, 60, 69)).map((sound) => sound.at)

  it('sounds a chord together and notes as a line, low to high', () => {
    expect(new Set(onsets({ chord: 'F' })).size).toBe(1)
    expect(new Set(onsets({ notes: ['F', 'A', 'C'] })).size).toBe(3)
    expect(answerSounds({ notes: ['F', 'A', 'C'] }, keys(65, 60, 69)).map((s) => s.midi)).toEqual(
      keys(60, 65, 69),
    )
  })
})

describe('isRight', () => {
  it('takes the answer’s notes in any octave, each at least once, and nothing else', () => {
    expect(isRight(keys(64, 67, 71), E_MINOR)).toBe(true)
    expect(isRight(keys(52, 55, 59, 64), E_MINOR)).toBe(true)
    expect(isRight(keys(64, 67), E_MINOR)).toBe(false)
    expect(isRight(keys(64, 67, 71, 74), E_MINOR)).toBe(false)
    expect(isRight([], E_MINOR)).toBe(false)
  })

  it('takes a rising answer only as its notes lie, from its first note in any octave', () => {
    const fifth = questionAnswer({ notes: ['D', 'A'], rising: true })
    expect(isRight(keys(50, 57), fifth)).toBe(true)
    expect(isRight(keys(62, 69), fifth)).toBe(true)
    expect(isRight(keys(57, 62), fifth)).toBe(false)
    expect(isRight(keys(62, 81), fifth)).toBe(false)
  })
})

describe('questionReducer', () => {
  const open = questionReducer(null, { type: 'open', id: '0.2' })
  const toggle = (state: QuestionState, key: number) =>
    questionReducer(state, { type: 'toggle', key: midi(key), answer: E_MINOR })

  it('opens one question at a time, with nothing chosen', () => {
    expect(open).toEqual({ id: '0.2', chosen: [], stage: 'choosing' })
    const moved = questionReducer(
      { id: '0.2', chosen: keys(64), stage: 'wrong' },
      { type: 'open', id: '1.0' },
    )
    expect(moved).toEqual({ id: '1.0', chosen: [], stage: 'choosing' })
  })

  it('toggles a key, and a change after a verdict chooses again', () => {
    const one = toggle(open, 64)
    expect(one?.chosen).toEqual([64])
    expect(toggle(one, 64)?.chosen).toEqual([])
    const judged: QuestionState = { id: '0.2', chosen: keys(64, 67, 70), stage: 'wrong' }
    expect(toggle(judged, 70)).toEqual({ id: '0.2', chosen: [64, 67], stage: 'choosing' })
  })

  it('judges the keys as soon as they are as many notes as the answer’s', () => {
    const two = toggle(toggle(open, 64), 67)
    expect(two?.stage).toBe('choosing')
    expect(toggle(two, 71)?.stage).toBe('right')
    expect(toggle(two, 70)?.stage).toBe('wrong')
    // A note doubled an octave up is one note of the answer, not one more.
    expect(toggle(toggle(two, 76), 76)?.stage).toBe('choosing')
    expect(toggle(two, 76)?.stage).toBe('choosing')
  })

  it('shows the answer and starts again', () => {
    expect(questionReducer(open, { type: 'reveal' })?.stage).toBe('answer')
    expect(
      questionReducer({ id: '0.2', chosen: keys(64), stage: 'answer' }, { type: 'retry' }),
    ).toEqual({ id: '0.2', chosen: [], stage: 'choosing' })
  })

  it('closes, when an example plays', () => {
    expect(questionReducer(open, { type: 'close' })).toBeNull()
  })

  it('ignores a key while the answer is shown, and anything when no question is open', () => {
    const shown: QuestionState = { id: '0.2', chosen: [], stage: 'answer' }
    expect(toggle(shown, 60)).toBe(shown)
    expect(questionReducer(null, { type: 'reveal' })).toBeNull()
  })
})

describe('chosenOf', () => {
  it('counts the notes chosen against the answer’s, an octave’s double once', () => {
    expect(chosenOf(keys(52, 64, 67), E_MINOR)).toEqual({ chosen: 2, total: 3 })
    const rising = questionAnswer({ notes: ['D', 'A', 'D'], rising: true })
    expect(chosenOf(keys(62, 69), rising)).toEqual({ chosen: 2, total: 3 })
  })
})

describe('questionKeys', () => {
  it('shows the chosen keys while choosing, the verdict after a check, the answer when shown', () => {
    expect(
      questionKeys({ id: 'q', chosen: keys(64), stage: 'choosing' }, E_MINOR).selected,
    ).toEqual(new Set([64]))
    // Wrong: the keys that are not the answer's marked, the missing ones left to find.
    const wrong = questionKeys({ id: 'q', chosen: keys(64, 68, 71), stage: 'wrong' }, E_MINOR)
    expect(wrong.wrong).toEqual(new Set([68]))
    expect(wrong.keys).toEqual([64, 68, 71])
    expect(questionKeys({ id: 'q', chosen: [], stage: 'answer' }, E_MINOR).keys).toEqual([
      64, 67, 71,
    ])
  })
})
