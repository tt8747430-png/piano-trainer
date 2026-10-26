import { arrange, parseFigure, type Chart, type Performance } from '@/shared/lib/arrangement'
import { midi, note, parseChordSymbol } from '@/shared/lib/music'

/** Chords on every beat in the right hand, the root in octaves at each chord in the left. */
const BEATS = {
  id: 'beats',
  rh: { kind: 'events', events: parseFigure('0/4 C,4/4 C,8/4 C,12/4 C') },
  lh: { kind: 'events', events: parseFigure('0/16 L1+L8') },
} as const

/** Chords on beats 1 and 3 in the right hand, the root in octaves at each chord in the left. */
const HALVES = {
  id: 'halves',
  rh: { kind: 'events', events: parseFigure('0/8 C,8/8 C') },
  lh: { kind: 'events', events: parseFigure('0/16 L1+L8') },
} as const

const chart = (...bars: string[][]): Chart => ({
  key: { tonic: note('C'), minor: false },
  meter: '4/4',
  sections: [
    {
      lines: [
        bars.map((chords) => ({
          chords: chords.map((symbol) => ({
            ...parseChordSymbol(symbol),
            beats: 4 / chords.length,
          })),
          beats: 4,
        })),
      ],
    },
  ],
})

/** One bar, C then G: beat groups at 0, 24, 48, 72; the left hand plays at 0 and 48 only. */
export const ONE_BAR: Performance = arrange(chart(['C', 'G']), { tonic: note('C'), pattern: BEATS })

/** Two bars, C and G: eight beat groups, four to a bar. */
export const TWO_BARS: Performance = arrange(chart(['C'], ['G']), {
  tonic: note('C'),
  pattern: BEATS,
})

/** The two bars under a single staff of a whole note a bar, E5 then D5, heard (ADR 0097). */
export const TWO_BARS_UNDER_A_STAFF: Performance = arrange(chart(['C'], ['G']), {
  tonic: note('C'),
  pattern: BEATS,
  staves: [
    {
      clef: 'treble',
      notes: [
        { midi: midi(76), spelled: note('E'), startTick: 0, durationTicks: 96 },
        { midi: midi(74), spelled: note('D'), startTick: 96, durationTicks: 96 },
      ],
    },
  ],
  hearTune: true,
})

/** The same two bars in halves: four beat groups, two to a bar, at 0, 48, 96, 144. */
export const TWO_BARS_IN_HALVES: Performance = arrange(chart(['C'], ['G']), {
  tonic: note('C'),
  pattern: HALVES,
})
