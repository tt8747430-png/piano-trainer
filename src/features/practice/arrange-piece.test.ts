import { BUILT_IN_PATTERNS, followsInversion } from '@/entities/pattern'
import { describe, expect, it } from 'vitest'
import { hasChartPlan, PIECES, pieceById, pieceFit, pieceKey } from '@/entities/piece'
import { note } from '@/shared/lib/music'
import { arrangePiece, defaultPattern, ownChoice } from './arrange-piece'

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
      melody: false,
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
    const { melody: _tune, hands: _hands, ...rest } = bz5
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

  it('falls back to r4 for a melody pattern on a piece without a melody', () => {
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

describe('the words a piece sings (ADR 0093)', () => {
  const silent = piece('silent')
  const sungBy = (
    notes: readonly { readonly lyrics?: readonly unknown[]; readonly hand: string }[],
  ) => notes.filter((n) => n.lyrics !== undefined).map((n) => n.hand)

  it('carries each syllable on the tune’s note: doubled, or played by the right hand’s melody figure', () => {
    const doubled = arrangePiece(silent, { ...ownChoice(silent), melody: true }, BUILT_IN_PATTERNS)
    const sung = doubled.notes.filter((n) => n.lyrics !== undefined)
    expect(new Set(sungBy(sung))).toEqual(new Set(['melody']))
    expect(sung[0]?.lyrics?.[0]).toEqual({ text: 'Si', hyphen: true, held: 1 })
    // The five notes a syllable is held over sing nothing: 46 notes of the tune, 41 with a verse.
    expect(sung).toHaveLength(41)
    const played = arrangePiece(silent, { ...ownChoice(silent), pattern: 'r5' }, BUILT_IN_PATTERNS)
    expect(new Set(sungBy(played.notes))).toEqual(new Set(['rh']))
    // The accompaniment alone sings nothing.
    expect(sungBy(arrangePiece(silent, ownChoice(silent), BUILT_IN_PATTERNS).notes)).toEqual([])
  })
})
