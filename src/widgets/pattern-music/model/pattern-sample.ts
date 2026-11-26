import { accompanimentOptions, type BookPattern, type PatternBook } from '@/entities/pattern'
import { pieceById, wholeBar, type Piece } from '@/entities/piece'
import { voicedShown } from '@/features/play-example'
import { arrangePiece, ownChoice } from '@/features/practice'
import { arrange, type Chart, type Performance } from '@/shared/lib/arrangement'
import { C_MAJOR, note } from '@/shared/lib/music'
import type { TimedMusic } from '@/shared/lib/notation'
import { audibleHands, isAudible, schedule, type Sound } from '@/shared/lib/schedule'
import { unmarked, type ShownKeys } from '@/shared/ui'

/** The piece a pattern that plays the tune is heard over: its lesson's (ADR 0053). */
const TUNE_PIECE = 'otche'
/** A bar of C heard at a steady walk. */
const SAMPLE_TEMPO = 80
const C_CHORD = { root: note('C'), quality: 'maj' } as const
const C_BAR: Chart = {
  key: C_MAJOR,
  meter: '4/4',
  sections: [{ lines: [[wholeBar(C_CHORD)]] }],
}

/** A pattern as its page and the editor play it: what the staff writes, what sounds, the keys. */
export interface PatternSample {
  readonly music: TimedMusic
  readonly sounds: readonly Sound[]
  readonly shown: ShownKeys
  /** The piece a pattern that plays the tune is heard over; null for a bar of C major. */
  readonly piece: Piece | null
}

/** Both hands heard. */
const BOTH = audibleHands('both')

/**
 * The performance from its first sound to where its second line begins: the first line's music, the
 * pattern's two hands on the grand staff (a piece's own staves are its page's, ADR 0097).
 */
function firstLine(performance: Performance): { music: TimedMusic; from: number; to: number } {
  const to =
    performance.bars.find((bar) => bar.section > 0 || bar.line > 0)?.startTick ??
    performance.totalTicks
  const before = (tick: number) => tick < to
  const { staves: _staves, ...piano } = performance
  return {
    music: {
      ...piano,
      bars: performance.bars.filter((bar) => before(bar.startTick)),
      notes: performance.notes.filter((n) => n.hand !== 'staff' && before(n.startTick)),
      chords: performance.chords.filter((chord) => before(chord.startTick)),
    },
    from: performance.notes.find((n) => isAudible(n, BOTH))?.startTick ?? 0,
    to,
  }
}

/**
 * A pattern heard: over a bar of C major in 4/4, each hand on its figure, or over the first line of
 * `over` (a song it is used in, its page's Play over); a pattern that plays the tune over the first
 * line of «Отче наш», as its piece plays it.
 */
export function patternSample(
  pattern: BookPattern,
  book: PatternBook,
  over?: Piece,
): PatternSample {
  const tunePiece = over ?? (pattern.pattern.rh.kind === 'tune' ? pieceById(TUNE_PIECE) : undefined)
  const performance = tunePiece
    ? arrangePiece(tunePiece, { ...ownChoice(tunePiece), pattern: pattern.ref }, book)
    : arrange(C_BAR, {
        tonic: C_MAJOR.tonic,
        ...accompanimentOptions(book, {
          pattern: pattern.ref,
          rh: null,
          lh: null,
          inversion: null,
          nearest: true,
        }),
      })
  const { music, from, to } = firstLine(performance)
  const { sounds } = schedule(performance, {
    tempo: tunePiece?.tempo ?? SAMPLE_TEMPO,
    hands: BOTH,
    fromTick: from,
    toTick: to,
  })
  const keys = [...new Set(music.notes.map((n) => n.midi))].sort((a, b) => a - b)
  // Over its bar of C the keys wear C major's tones, as the pattern's board paints them (canvas 198).
  const shown = tunePiece ? unmarked(keys) : voicedShown(C_CHORD, keys)
  return { music, sounds, shown, piece: tunePiece ?? null }
}
