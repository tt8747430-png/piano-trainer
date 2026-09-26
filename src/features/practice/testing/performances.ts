import { arrange, parseFigure, type Chart, type Performance } from '@/shared/lib/arrangement'
import { note, parseChordSymbol } from '@/shared/lib/music'

/** Chords on every beat in the right hand, the root in octaves at each chord in the left. */
const BEATS = {
  id: 'beats',
  rh: { kind: 'events', events: parseFigure('0/4 C,4/4 C,8/4 C,12/4 C') },
  lh: { kind: 'events', events: parseFigure('0/16 L1+L8') },
} as const

const chart = (...bars: string[][]): Chart => ({
  key: { tonic: note('C'), minor: false },
  beatsPerBar: 4,
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

/** One bar, C then G: beat groups at 0, 12, 24, 36; the left hand plays at 0 and 24 only. */
export const ONE_BAR: Performance = arrange(chart(['C', 'G']), { tonic: note('C'), pattern: BEATS })

/** Two bars, C and G: eight beat groups, four to a bar. */
export const TWO_BARS: Performance = arrange(chart(['C'], ['G']), {
  tonic: note('C'),
  pattern: BEATS,
})
