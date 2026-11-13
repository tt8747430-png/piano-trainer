import { BUILT_IN_PATTERNS } from '@/entities/pattern'
import type { Piece } from '@/entities/piece'
import { arrangePiece, ownChoice } from '@/features/practice'
import { LETTERS } from '@/shared/lib/music'
import { clefIn, notate, type Score } from '@/shared/lib/notation'

/** The bars a cover shows: the opening, enough to know a song by. */
export const INCIPIT_BARS = 2

/**
 * A song's opening as its cover engraves it (R34, Piano Forte's covers): its first bars as written,
 * the tune's staff alone where it has one (else the right hand's), plain (no chord symbols, names or
 * tempo mark), so the cover is the music's own picture. A song with no notes yet engraves an empty
 * staff in its key and metre.
 */
export function incipitScore(piece: Piece, bars: number = INCIPIT_BARS): Score {
  const score = notate(arrangePiece(piece, { ...ownChoice(piece), tune: true }, BUILT_IN_PATTERNS))
  const staff = score.staves[0]
  return {
    ...score,
    plain: true,
    staves: staff ? [staff] : score.staves,
    measures: score.measures.slice(0, bars).map(({ tempo: _, ...measure }) => measure),
  }
}

/** The heads a song's small cover draws: its first notes, enough to know the tune by. */
export const MARK_NOTES = 5

/** The step of a clef's middle line, counted in letters from C0: B4 on a treble staff, D3 on a bass. */
const MIDDLE_LINE = { treble: 4 * 7 + 6, bass: 3 * 7 + 1 } as const

/** How far from its middle a head may sit and stay on the little staff, a ledger line past it at most. */
const REACH = 6

/**
 * A song's first notes as its row's small cover draws them (canvas 133): each its top note's step
 * from the staff's middle line (up positive), held within a ledger line of the staff, from the
 * same opening its engraved cover shows. A song with no notes yet has none.
 */
export function incipitSteps(piece: Piece, count: number = MARK_NOTES): number[] {
  const score = incipitScore(piece)
  const staff = score.staves[0]
  if (!staff) return []
  return score.measures
    .flatMap((measure) => {
      const middle = MIDDLE_LINE[clefIn(measure, staff) === 'bass' ? 'bass' : 'treble']
      return (measure.staves[staff]?.[0]?.events ?? []).flatMap((event) => {
        if (event.kind !== 'notes' || event.notes.length === 0) return []
        const step = Math.max(
          ...event.notes.map((note) => note.octave * 7 + LETTERS.indexOf(note.spelled.letter)),
        )
        return [Math.max(-REACH, Math.min(REACH, step - middle))]
      })
    })
    .slice(0, count)
}
