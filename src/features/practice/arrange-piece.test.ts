import { BUILT_IN_PATTERNS, followsInversion } from '@/entities/pattern'
import { describe, expect, it } from 'vitest'
import { hasChartPlan, PIECES, pieceById, pieceFit, pieceKey } from '@/entities/piece'
import { note } from '@/shared/lib/music'
import { arrangePiece, defaultPattern, ownChoice, simplifies } from './arrange-piece'

const piece = (id: string) => {
  const found = pieceById(id)
  if (!found) throw new Error(id)
  return found
}
const bz5 = piece('bz5')

/** The right hand's keys under a pattern with every chord in an inversion. */
const rightHandIn = (
  played: ReturnType<typeof piece>,
  pattern: ReturnType<typeof ownChoice>['pattern'],
  inversion: 0 | 1,
) =>
  arrangePiece(
    played,
    { ...ownChoice(played), pattern, inversion, nearest: false },
    BUILT_IN_PATTERNS,
  )
    .notes.filter((n) => n.hand === 'rh')
    .map((n) => n.midi)

describe('ownChoice', () => {
  it('plays a piece as written', () => {
    expect(ownChoice(bz5)).toEqual({
      tonic: pieceKey(bz5).tonic,
      pattern: 'r4',
      rh: null,
      lh: null,
      inversion: null,
      nearest: true,
      chordSize: null,
      tune: false,
      simple: false,
    })
  })
})

describe('arrangePiece', () => {
  it('plays a piece in its own key and in another', () => {
    expect(arrangePiece(bz5, ownChoice(bz5), BUILT_IN_PATTERNS).chords[0]?.symbol).toBe('G')
    expect(
      arrangePiece(bz5, { ...ownChoice(bz5), tonic: note('A') }, BUILT_IN_PATTERNS).chords[0]
        ?.symbol,
    ).toBe('A')
  })

  it('plays each section with its own pattern, as written, unless the learner picks one for all', () => {
    if (!('sections' in bz5)) throw new Error('bz5 is a chart')
    const [first, ...rest] = bz5.sections
    if (!first) throw new Error('a section')
    const sectioned = { ...bz5, sections: [{ ...first, pattern: 'M3' as const }, ...rest] }
    expect(defaultPattern(sectioned)).toBe('chart')
    const played = arrangePiece(sectioned, ownChoice(sectioned), BUILT_IN_PATTERNS)
    const bars = new Set(played.bars.flatMap((bar, index) => (bar.section === 0 ? [index] : [])))
    const patternsIn = (inFirst: boolean) =>
      new Set(played.chords.filter((c) => bars.has(c.bar) === inFirst).map((c) => c.pattern))
    expect([...patternsIn(true)]).toEqual(['M3'])
    if (rest.length > 0) expect(patternsIn(false).has('M3')).toBe(false)
    const forAll = arrangePiece(
      sectioned,
      { ...ownChoice(sectioned), pattern: 'r1' },
      BUILT_IN_PATTERNS,
    )
    expect(new Set(forAll.chords.map((c) => c.pattern))).toEqual(new Set(['r1']))
  })

  it('plays the repeats taken in the Player, and the bars as written elsewhere', () => {
    if (!('sections' in bz5)) throw new Error('bz5 is a chart')
    const { staves: _staves, hands: _hands, ...rest } = bz5
    const plain = { ...rest, sections: [{ kind: 'verse' as const, lines: ['|: G C :| D'] }] }
    const written = arrangePiece(plain, ownChoice(plain), BUILT_IN_PATTERNS)
    expect(written.chords.map((c) => c.symbol)).toEqual(['G', 'C', 'D'])
    const played = arrangePiece(plain, ownChoice(plain), BUILT_IN_PATTERNS, { unfold: true })
    expect(played.chords.map((c) => c.symbol)).toEqual(['G', 'C', 'G', 'C', 'D'])
  })

  it('follows the chart’s own methods when asked', () => {
    const withCodes = PIECES.find((p) => hasChartPlan(p))
    if (!withCodes) throw new Error('no piece names its methods')
    expect(defaultPattern(withCodes)).toBe('chart')
    expect(ownChoice(withCodes).pattern).toBe('chart')
    const patterns = new Set(
      arrangePiece(withCodes, ownChoice(withCodes), BUILT_IN_PATTERNS).chords.map((c) => c.pattern),
    )
    expect(patterns.size).toBeGreaterThan(0)
    expect([...patterns].every((id) => typeof id === 'string')).toBe(true)
  })

  it('moves a tune’s figuration between a line’s ends with the inversion chosen', () => {
    const lamb = piece('mary-lamb')
    expect(rightHandIn(lamb, 'r6', 1)).not.toEqual(rightHandIn(lamb, 'r6', 0))
  })

  it('From the chart, follows an inversion exactly where a pattern its chart plays does', () => {
    const follows = (id: string) =>
      followsInversion(BUILT_IN_PATTERNS, { pattern: 'chart', rh: null }, pieceFit(piece(id)).chart)
    const moves = (id: string) =>
      JSON.stringify(rightHandIn(piece(id), 'chart', 1)) !==
      JSON.stringify(rightHandIn(piece(id), 'chart', 0))
    for (const id of ['zemlya', 'legenda', 'nuzhdayus', 'letom']) {
      expect(follows(id), id).toBe(false)
      expect(moves(id), id).toBe(false)
    }
    for (const id of ['buri', 'milost']) {
      expect(follows(id), id).toBe(true)
      expect(moves(id), id).toBe(true)
    }
  })

  it('falls back to r4 for a tune pattern on a piece without a tune', () => {
    const performance = arrangePiece(bz5, { ...ownChoice(bz5), pattern: 'r5' }, BUILT_IN_PATTERNS)
    expect(performance.chords.every((c) => c.pattern === 'r4')).toBe(true)
  })

  it('grows the chords of a song written in degrees with the chord size that it lets the learner choose', () => {
    const twofive = piece('romashki')
    const symbols = (chordSize: 'triads' | 'ninths') =>
      arrangePiece(twofive, { ...ownChoice(twofive), chordSize }, BUILT_IN_PATTERNS).chords.map(
        (c) => c.symbol,
      )
    expect(symbols('triads')[0]).toBe('Dm')
    expect(symbols('ninths')[0]).toBe('Dm9')
  })
})

describe('Simplify (ADR 0105)', () => {
  const symbols = (played: ReturnType<typeof arrangePiece>) => [
    ...new Set(played.chords.map((c) => c.symbol)),
  ]

  it('plays every chord of a piece as its plain triad, in the key chosen', () => {
    // As written: G C Em G/B C/E Dsus4 D/F♯ D Am D7.
    expect(
      symbols(arrangePiece(bz5, { ...ownChoice(bz5), simple: true }, BUILT_IN_PATTERNS)),
    ).toEqual(['G', 'C', 'Em', 'D', 'Am'])
    const inA = { ...ownChoice(bz5), tonic: note('A'), simple: true }
    expect(symbols(arrangePiece(bz5, inA, BUILT_IN_PATTERNS))).toEqual(['A', 'D', 'F#m', 'E', 'Bm'])
  })

  it('plays what a chord’s plain triad sounds: no 7th, no bass of its own', () => {
    if (!('sections' in bz5)) throw new Error('bz5 is a chart')
    const { staves: _staves, hands: _hands, ...rest } = bz5
    const song = {
      ...rest,
      pattern: 'block' as const,
      sections: [{ kind: 'verse' as const, lines: ['Cmaj7 G7/B'] }],
    }
    /** Each chord's pitch classes, and its lowest key's. */
    const sounds = (simple: boolean) => {
      const played = arrangePiece(song, { ...ownChoice(song), simple }, BUILT_IN_PATTERNS)
      return played.chords.map((_, index) => {
        const keys = played.notes.filter((n) => n.chord === index).map((n) => n.midi)
        return { tones: new Set(keys.map((key) => key % 12)), bass: Math.min(...keys) % 12 }
      })
    }
    // As written: Cmaj7's B, and G7/B's F over its B.
    expect(sounds(false)).toEqual([
      { tones: new Set([0, 4, 7, 11]), bass: 0 },
      { tones: new Set([7, 11, 2, 5]), bass: 11 },
    ])
    expect(sounds(true)).toEqual([
      { tones: new Set([0, 4, 7]), bass: 0 },
      { tones: new Set([7, 11, 2]), bass: 7 },
    ])
  })

  it('changes a piece only where it has a chord that is not a plain triad, at the chord size chosen', () => {
    expect(simplifies(bz5, null)).toBe(true)
    if (!('sections' in bz5)) throw new Error('bz5 is a chart')
    const { staves: _staves, hands: _hands, ...rest } = bz5
    const slash = { ...rest, sections: [{ kind: 'verse' as const, lines: ['G _ Em C/E'] }] }
    expect(simplifies(slash, null)).toBe(true)
    const triads = { ...rest, sections: [{ kind: 'verse' as const, lines: ['G _ Em C D'] }] }
    expect(simplifies(triads, null)).toBe(false)
    // A song written in degrees, at the size chosen: its sus4 chords are fixed (`V:=sus4`).
    expect(simplifies(piece('romashki'), 'triads')).toBe(true)
  })

  it('plays a song written in degrees as triads, whatever its chord size', () => {
    const twofive = piece('romashki')
    const choice = { ...ownChoice(twofive), chordSize: 'ninths' as const, simple: true }
    const played = arrangePiece(twofive, choice, BUILT_IN_PATTERNS)
    expect(played.chords.every((c) => c.quality === 'maj' || c.quality === 'min')).toBe(true)
    expect(played.chords[0]?.symbol).toBe('Dm')
  })
})

describe('the words a piece sings (ADR 0097)', () => {
  const silent = piece('silent')
  const sungBy = (
    notes: readonly { readonly lyrics?: readonly unknown[]; readonly hand: string }[],
  ) => notes.filter((n) => n.lyrics !== undefined).map((n) => n.hand)

  it('carries each syllable on the tune’s note, heard or not, and on the right hand’s tune figure (ADR 0097)', () => {
    const heard = arrangePiece(silent, { ...ownChoice(silent), tune: true }, BUILT_IN_PATTERNS)
    const sung = heard.notes.filter((n) => n.lyrics !== undefined)
    expect(new Set(sungBy(sung))).toEqual(new Set(['staff']))
    expect(sung[0]?.lyrics?.[0]).toEqual({ text: 'Si', hyphen: true, held: 1 })
    // The five notes a syllable is held over sing nothing: 46 notes of the tune, 41 with a verse.
    expect(sung).toHaveLength(41)
    // The tune's staff sings though it is not heard; a hand playing it sings with it.
    const unheard = arrangePiece(silent, ownChoice(silent), BUILT_IN_PATTERNS).notes
    expect(unheard.filter((n) => n.lyrics !== undefined).every((n) => n.silent)).toBe(true)
    expect(new Set(sungBy(unheard))).toEqual(new Set(['staff']))
    const played = arrangePiece(silent, { ...ownChoice(silent), pattern: 'r5' }, BUILT_IN_PATTERNS)
    expect(new Set(sungBy(played.notes))).toEqual(new Set(['staff', 'rh']))
  })
})
