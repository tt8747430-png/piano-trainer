import { accompanimentOptions, type BookPattern, type PatternBook } from '@/entities/pattern'
import { pieceById, wholeBar, type Piece } from '@/entities/piece'
import { arrangePiece, ownChoice } from '@/features/practice'
import { arrange, type Chart, type Performance } from '@/shared/lib/arrangement'
import { note, type Key } from '@/shared/lib/music'
import type { TimedMusic } from '@/shared/lib/notation'
import { audibleHands, schedule, type Sound } from '@/shared/lib/schedule'
import { unmarked, type ShownKeys } from '@/shared/ui'

/** The piece a pattern that plays the tune is heard over: its lesson's (ADR 0021). */
export const TUNE_PIECE = 'otche'
/** A bar of C heard at a steady walk. */
const SAMPLE_TEMPO = 80
const C_MAJOR: Key = { tonic: note('C'), minor: false }
const C_BAR: Chart = {
  key: C_MAJOR,
  meter: '4/4',
  sections: [{ lines: [[wholeBar({ root: note('C'), quality: 'maj' })]] }],
}

/** A pattern as its page and the editor play it: what the staff writes, what sounds, the keys. */
export interface PatternSample {
  readonly music: TimedMusic
  readonly sounds: readonly Sound[]
  readonly shown: ShownKeys
  /** The piece a pattern that plays the tune is heard over; null for a bar of C major. */
  readonly piece: Piece | null
}

/** The performance from its first note to where its second line begins: the first line's music. */
function firstLine(performance: Performance): { music: TimedMusic; from: number; to: number } {
  const to =
    performance.bars.find((bar) => bar.section > 0 || bar.line > 0)?.startTick ??
    performance.totalTicks
  const before = (tick: number) => tick < to
  return {
    music: {
      ...performance,
      bars: performance.bars.filter((bar) => before(bar.startTick)),
      notes: performance.notes.filter((n) => before(n.startTick)),
      chords: performance.chords.filter((chord) => before(chord.startTick)),
    },
    from: performance.beatGroups[0]?.tick ?? 0,
    to,
  }
}

/**
 * A pattern heard: over a bar of C major in 4/4, each hand on its figure; a pattern that plays the
 * tune over the first line of «Отче наш», as its piece plays it.
 */
export function patternSample(pattern: BookPattern, book: PatternBook): PatternSample {
  const tunePiece = pattern.pattern.rh.kind === 'melody' ? pieceById(TUNE_PIECE) : undefined
  const performance = tunePiece
    ? arrangePiece(tunePiece, { ...ownChoice(tunePiece), pattern: pattern.ref }, book)
    : arrange(C_BAR, {
        tonic: C_MAJOR.tonic,
        ...accompanimentOptions(book, {
          pattern: pattern.ref,
          rh: null,
          lh: null,
          inversion: null,
        }),
      })
  const { music, from, to } = firstLine(performance)
  const { sounds } = schedule(performance, {
    tempo: tunePiece?.tempo ?? SAMPLE_TEMPO,
    hands: audibleHands('both'),
    fromTick: from,
    toTick: to,
  })
  const keys = [...new Set(music.notes.map((n) => n.midi))].sort((a, b) => a - b)
  return { music, sounds, shown: unmarked(keys), piece: tunePiece ?? null }
}
