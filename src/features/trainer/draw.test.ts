import { describe, expect, it } from 'vitest'
import { note, noteName, pitchClass, pitchClassOf } from '@/shared/lib/music'
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

  it('builds a scale', () => {
    const question = drawRound(skillAsks(['scale:harmonic'], { roots: [pitchClass(8)] }), {
      index: 0,
      random: scripted(0),
    })
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
})

describe('drawRound: a drill of chords', () => {
  const ON_A = [
    { root: note('A'), quality: 'm7', inversion: null },
    { root: note('A'), quality: 'd7', inversion: null },
    { root: note('A'), quality: 'hd', inversion: null },
  ] as const
  const random = scripted(0.1, 0.5, 0.8, 0.3)

  it('quizzes four chords on the same root, differing only in quality, its own qualities first', () => {
    const question = drawRound(
      { kind: 'chords', drill: 'quiz', chords: ON_A },
      { index: 0, random },
    )
    if (question.mode !== 'name-chord') throw new Error('expected a quiz round')
    expect(question.options).toHaveLength(4)
    expect(new Set(question.options).size).toBe(4)
    expect(question.options).toContain(question.symbol)
    for (const symbol of ['Am7', 'A7', 'Am7♭5']) expect(question.options).toContain(symbol)
    expect(question.options.every((option) => /^A(?![#b♯♭])/.test(option))).toBe(true)
    expect(question.heard).toBe(false)
    expect(skillAsked(question)).toBeDefined()
  })

  it('spells every option on the answer’s root, so no spelling gives it away', () => {
    const question = drawRound(
      {
        kind: 'chords',
        drill: 'quiz',
        chords: [{ root: note('C', 1), quality: 'min', inversion: null }],
      },
      { index: 0, random },
    )
    if (question.mode !== 'name-chord') throw new Error('expected a quiz round')
    expect(question.options.every((option) => option.startsWith('C#'))).toBe(true)
  })

  it('quizzes an inverted chord among chords in the same inversion, over their own bass', () => {
    const question = drawRound(
      {
        kind: 'chords',
        drill: 'quiz',
        chords: [{ root: note('C'), quality: 'maj', inversion: 1 }],
      },
      { index: 0, random },
    )
    if (question.mode !== 'name-chord') throw new Error('expected a quiz round')
    expect(question.symbol).toBe('C/E')
    expect(question.options.every((option) => option.startsWith('C') && option.includes('/'))).toBe(
      true,
    )
  })

  it('asks the same chords by ear, rating no skill: hearing is not reading', () => {
    const question = drawRound(
      { kind: 'chords', drill: 'ear', chords: ON_A, arpeggio: true },
      { index: 0, random },
    )
    expect(question).toMatchObject({ mode: 'name-chord', heard: true, arpeggio: true })
    expect(skillAsked(question)).toBeUndefined()
  })

  it('shows the same chords as cards, with the side the drill shows, rating nothing', () => {
    const question = drawRound(
      { kind: 'chords', drill: 'flashcards', chords: ON_A, show: 'staff' },
      { index: 0, random },
    )
    expect(question).toMatchObject({ mode: 'chord-card', show: 'staff' })
    expect(skillAsked(question)).toBeUndefined()
  })

  it('asks the same chords played, rating their quality', () => {
    const question = drawRound(
      { kind: 'chords', drill: 'entry', chords: ON_A },
      { index: 0, random },
    )
    expect(question.mode).toBe('build-chord')
    expect(skillAsked(question)).toMatch(/^chord:/)
  })
})

describe('drawRound: a drill of intervals', () => {
  const random = scripted(0.3, 0.7, 0.1, 0.9, 0.5)

  it('asks an interval up from a root of the drill’s, its upper note spelled on its letter', () => {
    const question = drawRound(
      { kind: 'intervals', drill: 'quiz', intervals: ['M3'], ways: ['down'], roots: [note('E')] },
      { index: 0, random },
    )
    expect(question).toMatchObject({
      mode: 'name-interval',
      heard: false,
      way: 'up',
      lowNote: note('E'),
      highNote: note('G', 1),
      low: 64,
      high: 68,
    })
  })

  it('asks for the upper note to be played, and shows a card, from middle C’s octave', () => {
    const entry = drawRound(
      {
        kind: 'intervals',
        drill: 'entry',
        intervals: ['P5'],
        ways: ['up'],
        roots: [note('B', -1)],
      },
      { index: 0, random },
    )
    expect(entry).toMatchObject({ mode: 'build-interval', low: 70, high: 77, highNote: note('F') })
    const card = drawRound(
      { kind: 'intervals', drill: 'flashcards', intervals: ['P5'], ways: ['up'], show: 'keys' },
      { index: 0, random },
    )
    expect(card).toMatchObject({ mode: 'interval-card', show: 'keys' })
  })

  it('asks an interval from G3 to F♯4 the way the level hears it, among its intervals', () => {
    for (let index = 0; index < 20; index++) {
      const question = drawRound(
        { kind: 'intervals', drill: 'ear', intervals: ['m3', 'M3', 'P5'], ways: ['down'] },
        { index, random },
      )
      if (question.mode !== 'name-interval') throw new Error('expected an interval')
      expect(question.low).toBeGreaterThanOrEqual(55)
      expect(question.low).toBeLessThanOrEqual(66)
      expect(question.way).toBe('down')
      expect([...question.options].toSorted()).toEqual(['M3', 'P5', 'm3'])
    }
  })

  it('offers others beside a Custom of one, so a round is never one button', () => {
    const question = drawRound(
      { kind: 'intervals', drill: 'ear', intervals: ['P5'], ways: ['up'] },
      { index: 0, random },
    )
    if (question.mode !== 'name-interval') throw new Error('expected an interval round')
    expect(question.options).toHaveLength(4)
    expect(question.options).toContain('P5')
  })
})

describe('drawRound: what a level asks', () => {
  const random = scripted(0.3, 0.7, 0.1, 0.9, 0.5)

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

  it('plays a progression after its key’s tonic, each chord on its degree, among its level’s lines', () => {
    const lines = ['I V vi IV', 'I vi IV V', 'I IV vi V', 'vi IV I V']
    const question = drawRound(
      { kind: 'progressions', keys: [{ tonic: note('C'), minor: false }], lines },
      { index: 0, random },
    )
    if (question.mode !== 'name-progression') throw new Error('expected a progression')
    expect(lines).toContain(question.line)
    expect([...question.options].sort()).toEqual([...lines].sort())
    expect(question.tonicKeys.map((key) => key % 12)).toEqual([0, 4, 7])
    const roots = question.chordKeys.map((keys) => (keys[0] ?? 0) % 12)
    const degree = { I: 0, IV: 5, V: 7, vi: 9 } as const
    expect(roots).toEqual(
      question.line.split(' ').map((numeral) => degree[numeral as keyof typeof degree]),
    )
  })
})
