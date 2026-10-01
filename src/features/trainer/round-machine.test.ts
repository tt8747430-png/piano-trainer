import { describe, expect, it } from 'vitest'
import { midi, note, pitchClass, spellScale } from '@/shared/lib/music'
import { drawRound } from './draw'
import {
  answerOf,
  roundReducer,
  startRound,
  type Question,
  type RoundEvent,
  type RoundState,
} from './round-machine'
import { scripted, skillAsks } from './testing/asks'

const play = (state: RoundState, ...events: RoundEvent[]) => events.reduce(roundReducer, state)
const keys = (...values: number[]): RoundEvent[] =>
  values.map((value) => ({ type: 'toggleKey', midi: midi(value) }))
const presses = (...values: number[]): RoundEvent[] =>
  values.map((value) => ({ type: 'pressKey', midi: midi(value) }))

describe('roundReducer: building on the keys', () => {
  const cMajor = drawRound(skillAsks(['chord:maj'], { roots: [pitchClass(0)] }), {
    index: 0,
    random: scripted(0),
  })
  const asked = startRound(cMajor)

  it('starts each round with nothing chosen and no answer', () => {
    const answered = play(asked, ...keys(60), { type: 'check' })
    expect(play(answered, { type: 'ask', question: cMajor })).toEqual(asked)
  })

  it('takes a right chord in any octave', () => {
    const answered = play(asked, ...keys(48, 76, 67), { type: 'check' })
    expect(answered.result).toEqual({
      kind: 'keys',
      correct: true,
      missing: [],
      extra: [],
      wrongBass: false,
    })
  })

  it('names what is missing and what is extra', () => {
    const answered = play(asked, ...keys(60, 63, 67, 70), { type: 'check' })
    expect(answered.result).toMatchObject({ correct: false, missing: [note('E')], extra: [3, 10] })
  })

  it('wants the inversion’s tone lowest when a round asks for one', () => {
    if (cMajor.mode !== 'build-chord') throw new Error('expected Build chord')
    const firstInversion: Question = { ...cMajor, inversion: 1 }
    const inRoot = play(startRound(firstInversion), ...keys(60, 64, 67), { type: 'check' })
    expect(inRoot.result).toMatchObject({ correct: false, wrongBass: true })
    const right = play(startRound(firstInversion), ...keys(64, 67, 72), { type: 'check' })
    expect(right.result).toMatchObject({ correct: true })
  })

  it('lets a key be taken back, and all keys cleared', () => {
    expect(play(asked, ...keys(60, 62, 62)).selected).toEqual([60])
    expect(play(asked, ...keys(60, 64), { type: 'clear' }).selected).toEqual([])
  })

  it('ignores keys and checks once answered', () => {
    const answered = play(asked, ...keys(60, 64, 67), { type: 'check' })
    expect(play(answered, ...keys(61), { type: 'clear' }, { type: 'check' })).toBe(answered)
  })
})

describe('roundReducer: choosing', () => {
  const naming = startRound(
    drawRound(skillAsks(['chord:m7'], { roots: [pitchClass(9)], chords: 'name-chord' }), {
      index: 0,
      random: scripted(0.2),
    }),
  )

  it('judges a chosen option once, and takes no keys', () => {
    const right = play(naming, { type: 'choose', option: 'Am7' })
    expect(right.result).toEqual({ kind: 'choice', correct: true, chosen: 'Am7' })
    const wrong = play(naming, { type: 'choose', option: 'A7' })
    expect(wrong.result).toEqual({ kind: 'choice', correct: false, chosen: 'A7' })
    expect(play(wrong, { type: 'choose', option: 'Am7' })).toBe(wrong)
    expect(play(naming, ...keys(60), { type: 'check' })).toBe(naming)
  })

  it('judges an interval by its name', () => {
    const interval = startRound({
      mode: 'name-interval',
      interval: 'P4',
      low: midi(60),
      high: midi(65),
      way: 'up',
      options: ['M3', 'P4', 'P5'],
    })
    expect(play(interval, { type: 'choose', option: 'P4' }).result).toMatchObject({ correct: true })
  })
})

describe('roundReducer: pressing keys', () => {
  it('reads a note from the one key pressed, in its octave', () => {
    const reading = startRound({
      mode: 'read-note',
      key: midi(67),
      spelled: note('G'),
      clef: 'treble',
    })
    expect(play(reading, ...presses(67)).result).toEqual({
      kind: 'note',
      correct: true,
      played: 67,
    })
    expect(play(reading, ...presses(55)).result).toMatchObject({ correct: false })
    expect(play(reading, ...presses(55, 67)).result).toMatchObject({ correct: false, played: 55 })
  })

  it('takes a key’s degrees in order, any octave, and stops at the first wrong one', () => {
    const key = { tonic: note('G'), minor: false }
    const degrees = startRound({ mode: 'key-degrees', key, notes: spellScale(key.tonic, 'major') })
    const halfway = play(degrees, ...presses(55, 57, 71))
    expect(halfway).toMatchObject({ selected: [55, 57, 71], result: null })
    expect(play(halfway, ...presses(72, 74, 76, 78)).result).toMatchObject({ correct: true })
    expect(play(halfway, ...presses(73)).result).toMatchObject({
      kind: 'degrees',
      correct: false,
      played: [55, 57, 71, 73],
    })
  })
})

describe('answerOf', () => {
  it('gives the answer to record once a round that rates a skill is answered', () => {
    const question = drawRound(skillAsks(['chord:maj'], { roots: [pitchClass(0)] }), {
      index: 0,
      random: scripted(0),
    })
    const asked = startRound(question)
    expect(answerOf(asked)).toBeNull()
    expect(answerOf(play(asked, ...keys(60, 64, 67), { type: 'check' }))).toEqual({
      skill: 'chord:maj',
      correct: true,
    })
  })

  it('records nothing for a round that rates no skill', () => {
    const reading = startRound({
      mode: 'read-note',
      key: midi(60),
      spelled: note('C'),
      clef: 'treble',
    })
    expect(answerOf(play(reading, ...presses(60)))).toBeNull()
  })
})
