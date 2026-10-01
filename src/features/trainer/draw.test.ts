import { describe, expect, it } from 'vitest'
import { chordSymbol, note, noteName, pitchClass, pitchClassOf } from '@/shared/lib/music'
import { drawRound } from './draw'
import { skillAsked, skillAsks, scripted } from './testing/asks'

describe('drawRound: skills on any root', () => {
  it('asks an ordered scope’s skills in order, round and round', () => {
    const scope = skillAsks(['chord:m7', 'scale:blues', 'chord:maj'], { ordered: true })
    const skills = [0, 1, 2, 3].map((index) =>
      skillAsked(drawRound(scope, { index, random: scripted(0.5) })),
    )
    expect(skills).toEqual(['chord:m7', 'scale:blues', 'chord:maj', 'chord:m7'])
  })

  it('draws from the scope’s skills and roots', () => {
    const scope = skillAsks(['chord:m7', 'chord:d7'], { roots: [pitchClass(2), pitchClass(7)] })
    const random = scripted(0.1, 0.9, 0.7, 0.2, 0.4, 0.6)
    for (let index = 0; index < 12; index++) {
      const question = drawRound(scope, { index, random })
      expect(['chord:m7', 'chord:d7']).toContain(skillAsked(question))
      expect([2, 7]).toContain('root' in question && pitchClassOf(question.root))
    }
  })

  it('builds a chord from its root, spelled as the quality leans', () => {
    const question = drawRound(skillAsks(['chord:m7'], { roots: [pitchClass(1)] }), {
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
    const question = drawRound(
      skillAsks(['scale:harmonic'], { roots: [pitchClass(8)], chords: 'name-chord' }),
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
    const scope = skillAsks(['chord:maj'], { roots: [pitchClass(0), pitchClass(5)] })
    const first = drawRound(scope, { index: 0, random: scripted(0) })
    const second = drawRound(scope, { index: 1, random: scripted(0, 0.9), previous: first })
    expect('root' in second && pitchClassOf(second.root)).toBe(5)
    const only = skillAsks(['chord:maj'], { roots: [pitchClass(0)] })
    const again = drawRound(only, { index: 1, random: scripted(0), previous: first })
    expect('root' in again && again.root).toEqual(note('C'))
  })

  it('offers four different chords on the same root for Name chord, the answer among them', () => {
    const scope = skillAsks(['chord:m7', 'chord:d7', 'chord:hd'], {
      roots: [pitchClass(9)],
      chords: 'name-chord',
    })
    const question = drawRound(scope, { index: 0, random: scripted(0.1, 0.5, 0.8, 0.3) })
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
    const scope = skillAsks(['chord:m7', 'chord:maj7', 'chord:d7'], {
      roots: [pitchClass(1)],
      ordered: true,
      chords: 'name-chord',
    })
    const question = drawRound(scope, { index: 0, random: scripted(0.1, 0.5, 0.8, 0.3) })
    if (question.mode !== 'name-chord') throw new Error('expected a Name chord question')
    expect(question.symbol).toBe(chordSymbol({ root: note('C', 1), quality: 'm7' }))
    expect(question.options).toContain(chordSymbol({ root: note('D', -1), quality: 'maj7' }))
    expect(question.options).toContain(chordSymbol({ root: note('D', -1), quality: 'd7' }))
  })

  it('offers four different chords when the scope names a skill twice', () => {
    const scope = skillAsks(['chord:m7', 'chord:maj7', 'chord:maj7'], {
      roots: [pitchClass(2)],
      ordered: true,
      chords: 'name-chord',
    })
    const question = drawRound(scope, { index: 0, random: scripted(0.1, 0.5, 0.8, 0.3) })
    if (question.mode !== 'name-chord') throw new Error('expected a Name chord question')
    expect(new Set(question.options).size).toBe(4)
  })
})

describe('drawRound: what a level asks', () => {
  const random = scripted(0.3, 0.7, 0.1, 0.9, 0.5)

  it('asks a ladder’s chord in its inversion, over its bass, rating its quality', () => {
    const question = drawRound(
      {
        kind: 'chords',
        mode: 'build-chord',
        chords: [{ root: note('C'), quality: 'maj', inversion: 1 }],
      },
      { index: 0, random },
    )
    expect(question).toMatchObject({ mode: 'build-chord', symbol: 'C/E', inversion: 1 })
    expect(skillAsked(question)).toBe('chord:maj')
  })

  it('names a ladder’s chord among its own chords first', () => {
    const chords = [
      { root: note('C'), quality: 'maj', inversion: null },
      { root: note('F'), quality: 'maj', inversion: null },
      { root: note('G'), quality: 'maj', inversion: null },
    ] as const
    const question = drawRound({ kind: 'chords', mode: 'name-chord', chords }, { index: 0, random })
    if (question.mode !== 'name-chord') throw new Error('expected a Name chord round')
    expect(question.options).toHaveLength(4)
    for (const symbol of ['C', 'F', 'G']) expect(question.options).toContain(symbol)
  })

  it('asks an interval from G3 to F♯4 the way the level hears it, among its intervals', () => {
    for (let index = 0; index < 20; index++) {
      const question = drawRound(
        { kind: 'intervals', intervals: ['m3', 'M3', 'P5'], ways: ['down'] },
        { index, random },
      )
      if (question.mode !== 'name-interval') throw new Error('expected an interval')
      expect(question.low).toBeGreaterThanOrEqual(55)
      expect(question.low).toBeLessThanOrEqual(66)
      expect(question.way).toBe('down')
      expect([...question.options].toSorted()).toEqual(['M3', 'P5', 'm3'])
    }
  })

  it('plays a scale by ear down when the level says so', () => {
    const question = drawRound(
      { kind: 'scales', kinds: ['major'], descending: true },
      { index: 0, random },
    )
    if (question.mode !== 'name-scale') throw new Error('expected a scale')
    expect(question.keys[0]).toBeGreaterThan(question.keys.at(-1) ?? 0)
  })

  it('asks a key signature as a count or as the key it is, the answer among the options', () => {
    const keys = [
      { tonic: note('D'), minor: false },
      { tonic: note('B', -1), minor: false },
      { tonic: note('A'), minor: false },
    ]
    const asks = new Set<string>()
    for (let index = 0; index < 12; index++) {
      const question = drawRound({ kind: 'signatures', keys }, { index, random })
      if (question.mode !== 'key-signature') throw new Error('expected a signature')
      asks.add(question.ask)
      expect(question.options).toContain(question.answer)
      expect(new Set(question.options).size).toBe(question.options.length)
    }
    expect(asks).toEqual(new Set(['count', 'name']))
  })

  it('writes a signature’s count with its sign', () => {
    const question = drawRound(
      { kind: 'signatures', keys: [{ tonic: note('E', -1), minor: false }] },
      { index: 0, random: scripted(0.1) },
    )
    expect(question).toMatchObject({ ask: 'count', answer: '3♭' })
  })

  it('asks a key’s degrees I to VII as its scale spells them', () => {
    const question = drawRound(
      { kind: 'degrees', keys: [{ tonic: note('E'), minor: true }] },
      { index: 0, random },
    )
    if (question.mode !== 'key-degrees') throw new Error('expected degrees')
    expect(question.notes.map((tone) => noteName(tone.note))).toEqual([
      'E',
      'F#',
      'G',
      'A',
      'B',
      'C',
      'D',
    ])
  })

  it('plays a chord’s role as the key’s tonic and then the chord on its degree', () => {
    const question = drawRound(
      { kind: 'roles', keys: [{ tonic: note('G'), minor: false }], numerals: ['IV'] },
      { index: 0, random },
    )
    if (question.mode !== 'chord-role') throw new Error('expected a role')
    expect(question.tonicKeys.map((key) => key % 12)).toEqual([7, 11, 2])
    expect(question.chordKeys.map((key) => key % 12)).toEqual([0, 4, 7])
    expect(Math.min(...question.chordKeys)).toBeGreaterThan(Math.min(...question.tonicKeys))
  })
})
