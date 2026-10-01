import { describe, expect, it } from 'vitest'
import { midi } from '@/shared/lib/music'
import { lessonById } from '@/entities/lesson'
import {
  answerSounds,
  isRight,
  quizAnswer,
  quizKeys,
  quizAnswers,
  quizReducer,
  type QuizState,
} from './lesson-quiz'

const keys = (...numbers: number[]) => numbers.map((n) => midi(n))
const E_MINOR = quizAnswer({ chord: 'Em' })

describe('quizAnswer', () => {
  it('places a chord answer as the Chords reference does, each tone by role', () => {
    expect(E_MINOR.keys).toEqual([64, 67, 71])
    expect(E_MINOR.marks.get(midi(67))).toEqual({ tone: '3rd', label: '♭3' })
  })

  it('places notes from middle C up, each with its name', () => {
    const third = quizAnswer({ notes: ['F', 'A'] })
    expect(third.keys).toEqual([65, 69])
    expect(third.marks.get(midi(69))).toEqual({ tone: 'scale', label: 'A' })
  })
})

describe('quizAnswers', () => {
  it('holds each quiz of a lesson by its place, section.block, with its answer on the keys', () => {
    const lesson = lessonById('bass-and-chords')
    if (!lesson) throw new Error('the lesson is missing')
    const answers = quizAnswers(lesson)
    const places = lesson.sections.flatMap((section, s) =>
      section.blocks.flatMap((block, b) => (block.kind === 'quiz' ? [`${s}.${b}`] : [])),
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
})

describe('quizReducer', () => {
  const open = quizReducer(null, { type: 'open', id: '0.2' })

  it('opens one quiz at a time, with nothing chosen', () => {
    expect(open).toEqual({ id: '0.2', chosen: [], stage: 'choosing' })
    const moved = quizReducer(
      { id: '0.2', chosen: keys(64), stage: 'wrong' },
      { type: 'open', id: '1.0' },
    )
    expect(moved).toEqual({ id: '1.0', chosen: [], stage: 'choosing' })
  })

  it('toggles a key, and a change after a verdict clears it', () => {
    const one = quizReducer(open, { type: 'toggle', key: midi(64) })
    expect(one?.chosen).toEqual([64])
    expect(quizReducer(one, { type: 'toggle', key: midi(64) })?.chosen).toEqual([])
    const judged: QuizState = { id: '0.2', chosen: keys(64), stage: 'wrong' }
    expect(quizReducer(judged, { type: 'toggle', key: midi(67) })).toEqual({
      id: '0.2',
      chosen: [64, 67],
      stage: 'choosing',
    })
  })

  it('judges a check, shows the answer, and starts again', () => {
    const chosen: QuizState = { id: '0.2', chosen: keys(64), stage: 'choosing' }
    expect(quizReducer(chosen, { type: 'check', right: false })?.stage).toBe('wrong')
    expect(quizReducer(chosen, { type: 'check', right: true })?.stage).toBe('right')
    expect(quizReducer(chosen, { type: 'reveal' })?.stage).toBe('answer')
    expect(
      quizReducer({ id: '0.2', chosen: keys(64), stage: 'answer' }, { type: 'retry' }),
    ).toEqual({ id: '0.2', chosen: [], stage: 'choosing' })
  })

  it('closes, when an example plays', () => {
    expect(quizReducer(open, { type: 'close' })).toBeNull()
  })

  it('ignores a key while the answer is shown, and anything when no quiz is open', () => {
    const shown: QuizState = { id: '0.2', chosen: [], stage: 'answer' }
    expect(quizReducer(shown, { type: 'toggle', key: midi(60) })).toBe(shown)
    expect(quizReducer(null, { type: 'check', right: true })).toBeNull()
  })
})

describe('quizKeys', () => {
  it('shows the chosen keys while choosing, the verdict after a check, the answer when shown', () => {
    expect(quizKeys({ id: 'q', chosen: keys(64), stage: 'choosing' }, E_MINOR).selected).toEqual(
      new Set([64]),
    )
    const wrong = quizKeys({ id: 'q', chosen: keys(64, 68), stage: 'wrong' }, E_MINOR)
    expect(wrong.wrong).toEqual(new Set([68]))
    expect(wrong.outlined).toEqual(new Set([67, 71]))
    expect(quizKeys({ id: 'q', chosen: [], stage: 'answer' }, E_MINOR).keys).toEqual([64, 67, 71])
  })
})
