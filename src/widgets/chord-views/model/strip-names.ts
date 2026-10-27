import type { CellBar } from '@/features/practice'
import type { Performance } from '@/shared/lib/arrangement'

/** What a beat of the strip names: the chords it changes to, or a rest where the music turns to none. */
export interface StripName {
  readonly symbols: readonly string[]
  readonly rest: boolean
}

const NOTHING: StripName = { symbols: [], rest: false }
const REST: StripName = { symbols: [], rest: true }

/**
 * Each beat of the strip as it names its chords (ADR 0108, Chordify's), bar by bar as played: a
 * chord only in the beat where it changes from the chord sounding before it, so one held over bars,
 * or played again bar after bar, is named once; where the music turns to no chord (a bar of none,
 * or music that starts with none), a rest in that bar's first beat. `bars` are every bar as played,
 * in beats (`playedBeatCells`).
 */
export function stripNames(performance: Performance, bars: readonly CellBar[]): StripName[][] {
  // The chord sounding as the strip goes: none before the music starts, `null` in a bar of none.
  let sounding: string | null | undefined
  return bars.map(({ played, cells }) => {
    if ((performance.bars[played]?.chords.length ?? 0) === 0) {
      const turns = sounding !== null
      sounding = null
      return cells.map((_, beat) => (beat === 0 && turns ? REST : NOTHING))
    }
    return cells.map(({ chords }) => {
      const symbols: string[] = []
      for (const chord of chords) {
        const symbol = performance.chords[chord]?.symbol
        if (symbol === undefined || symbol === sounding) continue
        symbols.push(symbol)
        sounding = symbol
      }
      return symbols.length === 0 ? NOTHING : { symbols, rest: false }
    })
  })
}
