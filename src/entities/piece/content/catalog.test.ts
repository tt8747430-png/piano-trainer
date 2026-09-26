import { describe, expect, it } from 'vitest'
import { METHOD_PATTERNS, PATTERN_IDS, PATTERNS } from '@/entities/pattern'
import { collectLocalTexts } from '@/shared/test/local-texts'
import { arrange, type Performance } from '@/shared/lib/arrangement'
import { chordSymbol, noteName, pitchClass, tonicSpelling } from '@/shared/lib/music'
import {
  BOOKS,
  CHORD_SIZES,
  COLLECTION_IDS,
  COLLECTIONS,
  isCollectionId,
  PIECES,
  chartOf,
  hasMethodCodes,
  isPiece,
  melodyOf,
  pieceById,
  pieceKey,
  type Piece,
} from '../index'

const ENTRIES = COLLECTIONS.flatMap((collection) => collection.entries)

describe('the collections', () => {
  it('are the ones COLLECTION_IDS names, in its order', () => {
    expect(COLLECTIONS.map((collection) => collection.id)).toEqual(COLLECTION_IDS)
    expect(isCollectionId('hymns')).toBe(true)
    expect(isCollectionId('psalms')).toBe(false)
  })
})
const LISTINGS = ENTRIES.filter((entry) => !isPiece(entry))
/** What would make a performance wrong to play: notes off the piano or outside the piece, a root
 *  spelled with two accidentals, a bar where nothing starts. Plain loops: 24,000 of these run. */
function problemsIn(performance: Performance): string[] {
  const problems: string[] = []
  for (const n of performance.notes) {
    if (n.midi < 21 || n.midi > 108) problems.push(`note ${n.midi} is off the piano`)
    if (n.startTick < 0 || n.startTick + n.durationTicks > performance.totalTicks) {
      problems.push(`a note at ${n.startTick} lasting ${n.durationTicks} is outside the piece`)
    }
  }
  for (const chord of performance.chords) {
    if (Math.abs(chord.root.accidental) > 1)
      problems.push(`${chordSymbol(chord)} has two accidentals`)
  }
  const barsHeard = new Set(performance.beatGroups.map((group) => group.bar))
  performance.bars.forEach((_bar, i) => {
    if (!barsHeard.has(i)) problems.push(`bar ${i + 1} is silent`)
  })
  return problems
}

function accompaniments(piece: Piece) {
  const own = PATTERNS[piece.pattern].pattern
  return [
    { pattern: own, methods: hasMethodCodes(piece) ? METHOD_PATTERNS : undefined },
    ...PATTERN_IDS.map((id) => ({ pattern: PATTERNS[id].pattern, methods: undefined })),
  ]
}

describe('the catalog', () => {
  it('holds 51 pieces and 7 listings in 5 collections, each id once', () => {
    expect(COLLECTIONS.map((collection) => collection.id)).toEqual([
      'bozhe-spasibo',
      'called-to-play',
      'studies',
      'hymns',
      'progressions',
    ])
    expect(PIECES).toHaveLength(51)
    expect(PIECES.filter((piece) => piece.kind === 'progression')).toHaveLength(10)
    expect(LISTINGS).toHaveLength(7)
    const ids = ENTRIES.map((entry) => entry.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('lists the songbook in number order', () => {
    const songbook = COLLECTIONS[0]?.entries ?? []
    expect(songbook.map((entry) => entry.source?.number)).toEqual(
      Array.from({ length: 20 }, (_, i) => i + 1),
    )
  })

  it.each(PIECES.map((piece) => [piece.id, piece] as const))(
    'parses %s at every chord size it allows',
    (_id, piece) => {
      const chordSizes =
        piece.kind === 'progression' && piece.chordSize.choosable ? CHORD_SIZES : [undefined]
      for (const chordSize of chordSizes) expect(() => chartOf(piece, chordSize)).not.toThrow()
      expect(() => melodyOf(piece)).not.toThrow()
    },
  )

  it.each(PIECES.map((piece) => [piece.id, piece] as const))(
    'arranges %s in all 12 keys with every accompaniment',
    (_id, piece) => {
      const chart = chartOf(piece)
      const melody = melodyOf(piece)
      const { minor } = pieceKey(piece)
      const problems: string[] = []
      for (let pc = 0; pc < 12; pc++) {
        const tonic = tonicSpelling(pitchClass(pc), minor)
        for (const { pattern, methods } of accompaniments(piece)) {
          const performance = arrange(chart, {
            tonic,
            pattern,
            methods,
            melody,
            doubleMelody: true,
          })
          problems.push(
            ...problemsIn(performance).map(
              (problem) => `${noteName(tonic)} ${pattern.id}: ${problem}`,
            ),
          )
        }
      }
      expect(problems.slice(0, 5)).toEqual([])
    },
  )

  it('fits every melody inside its chart', () => {
    for (const piece of PIECES) {
      const melody = melodyOf(piece)
      if (!melody) continue
      const last = melody.at(-1)
      const chart = arrange(chartOf(piece), {
        tonic: pieceKey(piece).tonic,
        pattern: PATTERNS.block.pattern,
      })
      expect((last?.startTick ?? 0) + (last?.durationTicks ?? 0), piece.id).toBeLessThanOrEqual(
        chart.totalTicks,
      )
    }
  })

  it('sets a playable tempo', () => {
    for (const piece of PIECES) {
      expect(piece.tempo, piece.id).toBeGreaterThanOrEqual(40)
      expect(piece.tempo, piece.id).toBeLessThanOrEqual(160)
    }
  })

  it('keeps credit names as printed, with the role apart', () => {
    for (const entry of ENTRIES) {
      for (const credit of entry.credits ?? []) {
        if (credit.role === 'unknown') continue
        expect(credit.names.trim(), entry.id).not.toBe('')
        expect(credit.names, entry.id).not.toContain(':')
      }
    }
    for (const book of Object.values(BOOKS)) expect(book.title.trim()).not.toBe('')
  })

  it('writes every text in both languages', () => {
    for (const { path, text } of collectLocalTexts(COLLECTIONS)) {
      expect(text.en.trim(), `${path}.en`).not.toBe('')
      expect(text.ru.trim(), `${path}.ru`).not.toBe('')
    }
  })

  it('packs the blues into twelve bars', () => {
    const blues = pieceById('blues')
    expect(blues && chartOf(blues).sections[0]?.lines.flat()).toHaveLength(12)
  })

  it('reads Ромашковые поля as the course writes it', () => {
    const romashki = pieceById('romashki')
    const bars = romashki
      ? chartOf(romashki, 'sevenths').sections.flatMap((section) =>
          section.lines.flatMap((line) =>
            line.map((bar) => bar.chords.map((chord) => chordSymbol(chord)).join(' ')),
          ),
        )
      : []
    expect(bars.join(' | ')).toBe('Dm7 Gm7 | Csus2 C7 FMaj7 D7 | Gm7 Dm7/F | Em7♭5 Asus4 A7')
  })
})
