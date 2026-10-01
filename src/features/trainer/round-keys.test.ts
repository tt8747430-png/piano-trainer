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
import type { Asks } from './draw'
import { noteLevel } from './ladders/notes'
import type { Question } from './round-machine'
import {
  answerKeys,
  checkedKeys,
  heardFirst,
  QUIZ_RANGE,
  roundRange,
  roundSounds,
  targetKeys,
} from './round-keys'

const chordAsked = (letter: 'C' | 'B', quality: 'maj' | 'n13') => {
  const root = note(letter)
  return {
    skill: chordSkill(quality),
    root,
    quality,
    symbol: chordSymbol({ root, quality }),
    tones: spellChord(root, quality),
    inversion: null,
  }
}
const chord = (letter: 'C' | 'B', quality: 'maj' | 'n13'): Question => ({
  mode: 'build-chord',
  ...chordAsked(letter, quality),
})

const SKILLS: Asks = { kind: 'skills', chords: 'build-chord', skills: [] }

describe('round keys', () => {
  it('builds on one octave and a third from middle C', () => {
    expect(roundRange(SKILLS, chord('C', 'maj'))).toEqual(QUIZ_RANGE)
  })

  it('widens the keyboard to show a wide chord whole', () => {
    const question: Question = { mode: 'name-chord', ...chordAsked('B', 'n13'), options: [] }
    const { from, to } = roundRange(SKILLS, question)
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
    expect(roundRange(SKILLS, question).to).toBeGreaterThanOrEqual(
      Math.max(...targetKeys(question)),
    )
  })

  it('shows the answer: right keys by role, missing ones outlined, extra ones wrong', () => {
    const { marks, outlined, wrong } = answerKeys(chord('C', 'maj'), [midi(60), midi(63), midi(67)])
    expect(marks.get(midi(60))?.tone).toBe('root')
    expect(marks.get(midi(67))?.tone).toBe('5th')
    expect([...outlined]).toEqual([64])
    expect([...wrong]).toEqual([63])
  })

  it('places a chord asked in an inversion with that tone lowest', () => {
    const question: Question = { mode: 'build-chord', ...chordAsked('C', 'maj'), inversion: 1 }
    expect(targetKeys(question)).toEqual([64, 67, 72])
  })

  it('keeps a note-reading keyboard the same for every round, so it never points at the answer', () => {
    const asks: Asks = { kind: 'notes', notes: noteLevel('treble') }
    const [first, second] = asks.notes
    if (!first || !second) throw new Error('A level has notes')
    expect(roundRange(asks, { mode: 'read-note', ...first })).toEqual(
      roundRange(asks, { mode: 'read-note', ...second }),
    )
  })

  it('marks a note read right, or the key pressed wrong and the note’s own key ringed', () => {
    const question: Question = {
      mode: 'read-note',
      key: midi(64),
      spelled: note('E'),
      clef: 'treble',
    }
    expect(answerKeys(question, [midi(64)]).marks.get(midi(64))?.label).toBe('✓')
    const wrong = answerKeys(question, [midi(65)])
    expect([...wrong.wrong]).toEqual([65])
    expect([...wrong.outlined]).toEqual([64])
  })

  it('sounds an interval as it is asked: the lower note first going up', () => {
    const question: Question = {
      mode: 'name-interval',
      interval: 'P5',
      low: midi(60),
      high: midi(67),
      way: 'up',
      options: ['P5'],
    }
    expect(heardFirst(question)).toBe(true)
    expect(
      roundSounds(question).map((sound) => (sound.kind === 'note' ? sound.midi : null)),
    ).toEqual([60, 67])
  })

  it('plays a chord’s role as the tonic, then the chord', () => {
    const question: Question = {
      mode: 'chord-role',
      key: { tonic: note('C'), minor: false },
      numeral: 'IV',
      tonicKeys: [midi(48), midi(52), midi(55)],
      chordKeys: [midi(53), midi(57), midi(60)],
      options: ['IV'],
    }
    const sounds = roundSounds(question)
    expect(sounds).toHaveLength(6)
    const at = (key: number) => sounds.find((s) => s.kind === 'note' && s.midi === key)?.at ?? -1
    expect(at(53)).toBeGreaterThan(at(48))
  })
})

describe('checkedKeys', () => {
  it('marks the keys of the answer’s notes as the answer does, the extra ones wrong, and rings the missing', () => {
    const answer = {
      keys: [midi(64), midi(67), midi(71)],
      marks: new Map([
        [midi(64), { tone: 'root', label: '1' }],
        [midi(67), { tone: '3rd', label: '♭3' }],
        [midi(71), { tone: '5th', label: '5' }],
      ] as const),
    }
    const checked = checkedKeys([midi(52), midi(68)], answer)
    expect(checked.marks.get(midi(52))).toEqual({ tone: 'root', label: '1' })
    expect([...checked.wrong]).toEqual([68])
    expect([...checked.outlined]).toEqual([67, 71])
  })
})
