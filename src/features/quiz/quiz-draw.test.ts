import { describe, expect, it } from 'vitest'
import { chordSymbol, note, noteName, pitchClass, pitchClassOf } from '@/shared/lib/music'
import { createQuestion } from './quiz-draw'
import { config, scripted } from './testing/quiz-configs'

describe('createQuestion', () => {
  it('asks an ordered scope’s skills in order, round and round', () => {
    const scope = config(['chord:m7', 'scale:blues', 'chord:maj'], { ordered: true })
    const skills = [0, 1, 2, 3].map(
      (index) => createQuestion(scope, { index, random: scripted(0.5) }).skill,
    )
    expect(skills).toEqual(['chord:m7', 'scale:blues', 'chord:maj', 'chord:m7'])
  })

  it('draws from the scope’s skills and roots', () => {
    const scope = config(['chord:m7', 'chord:d7'], { roots: [pitchClass(2), pitchClass(7)] })
    const random = scripted(0.1, 0.9, 0.7, 0.2, 0.4, 0.6)
    for (let index = 0; index < 12; index++) {
      const question = createQuestion(scope, { index, random })
      expect(['chord:m7', 'chord:d7']).toContain(question.skill)
      expect([2, 7]).toContain(pitchClassOf(question.root))
    }
  })

  it('builds a chord from its root, spelled as the quality leans', () => {
    const question = createQuestion(config(['chord:m7'], { roots: [pitchClass(1)] }), {
      index: 0,
      random: scripted(0),
    })
    expect(question).toMatchObject({ mode: 'build-chord', quality: 'm7', symbol: 'C#m7' })
    expect(question.mode === 'build-chord' && question.tones.map((t) => noteName(t.note))).toEqual([
      'C#',
      'E',
      'G#',
      'B',
    ])
  })

  it('builds a scale whatever the chord mode', () => {
    const question = createQuestion(
      config(['scale:harmonic'], { roots: [pitchClass(8)] }, 'name-chord'),
      {
        index: 0,
        random: scripted(0),
      },
    )
    expect(question.mode).toBe('build-scale')
    expect(question.mode === 'build-scale' && question.notes.map((t) => noteName(t.note))).toEqual([
      'G#',
      'A#',
      'B',
      'C#',
      'D#',
      'E',
      'F𝄪',
    ])
  })

  it('draws again rather than repeat a question, and repeats when it must', () => {
    const scope = config(['chord:maj'], { roots: [pitchClass(0), pitchClass(5)] })
    const first = createQuestion(scope, { index: 0, random: scripted(0) })
    const second = createQuestion(scope, { index: 1, random: scripted(0, 0.9), previous: first })
    expect(pitchClassOf(second.root)).toBe(5)
    const only = config(['chord:maj'], { roots: [pitchClass(0)] })
    const again = createQuestion(only, { index: 1, random: scripted(0), previous: first })
    expect(again.root).toEqual(note('C'))
  })

  it('offers four different chords on the same root for Name chord, the answer among them', () => {
    const scope = config(
      ['chord:m7', 'chord:d7', 'chord:hd'],
      { roots: [pitchClass(9)] },
      'name-chord',
    )
    const question = createQuestion(scope, { index: 0, random: scripted(0.1, 0.5, 0.8, 0.3) })
    if (question.mode !== 'name-chord') throw new Error('expected a Name chord question')
    expect(question.options).toHaveLength(4)
    expect(new Set(question.options).size).toBe(4)
    expect(question.options).toContain(question.symbol)
    expect(
      question.options.every((option) => option.startsWith('A') && !option.startsWith('A#')),
    ).toBe(true)
    const others = question.options.filter((option) => option !== question.symbol)
    const family = ['Am7', 'A7', 'Am7♭5'].filter((symbol) => symbol !== question.symbol)
    for (const symbol of family) expect(others).toContain(symbol)
  })

  it('spells each option’s root by its own chord, so a C♯ root never gives a minor answer away', () => {
    const scope = config(
      ['chord:m7', 'chord:maj7', 'chord:d7'],
      { roots: [pitchClass(1)], ordered: true },
      'name-chord',
    )
    const question = createQuestion(scope, { index: 0, random: scripted(0.1, 0.5, 0.8, 0.3) })
    if (question.mode !== 'name-chord') throw new Error('expected a Name chord question')
    expect(question.symbol).toBe(chordSymbol({ root: note('C', 1), quality: 'm7' }))
    expect(question.options).toContain(chordSymbol({ root: note('D', -1), quality: 'maj7' }))
    expect(question.options).toContain(chordSymbol({ root: note('D', -1), quality: 'd7' }))
  })

  it('offers four different chords when the scope names a skill twice', () => {
    const scope = config(
      ['chord:m7', 'chord:maj7', 'chord:maj7'],
      { roots: [pitchClass(2)], ordered: true },
      'name-chord',
    )
    const question = createQuestion(scope, { index: 0, random: scripted(0.1, 0.5, 0.8, 0.3) })
    if (question.mode !== 'name-chord') throw new Error('expected a Name chord question')
    expect(new Set(question.options).size).toBe(4)
  })
})
