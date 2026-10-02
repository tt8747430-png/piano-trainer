import type { HandNote } from '@/shared/lib/arrangement'
import { TICKS_PER_BEAT, type Tick } from '@/shared/lib/music'
import { pitchText } from './music'
import { beatsText } from './write-chart'

const noteText = (n: HandNote) => `${pitchText(n)}${n.finger === undefined ? '' : `^${n.finger}`}`

/** A bar's notes struck together: those sharing an onset and a length, lowest first, held ones first. */
function chordsOf(notes: readonly HandNote[]): HandNote[][] {
  const chords = new Map<string, HandNote[]>()
  for (const n of notes) {
    const id = `${n.startTick} ${n.durationTicks}`
    chords.set(id, [...(chords.get(id) ?? []), n])
  }
  return [...chords.values()]
    .map((chord) => chord.sort((a, b) => a.midi - b.midi))
    .sort(
      ([a], [b]) =>
        (a?.startTick ?? 0) - (b?.startTick ?? 0) ||
        (b?.durationTicks ?? 0) - (a?.durationTicks ?? 0),
    )
}

/**
 * One written bar: chords one after another, rests in the gaps, `@beat` (counted from 1) where one
 * starts under another.
 */
function barText(notes: readonly HandNote[], barTicks: Tick): string {
  if (notes.length === 0) return `r/${beatsText(barTicks)}`
  const tokens: string[] = []
  let running: Tick = 0
  for (const chord of chordsOf(notes)) {
    const [first] = chord
    if (!first) continue
    const played = `${chord.map(noteText).join('+')}/${beatsText(first.durationTicks)}`
    if (first.startTick > running) tokens.push(`r/${beatsText(first.startTick - running)}`)
    tokens.push(
      first.startTick < running
        ? `${played}@${beatsText(first.startTick + TICKS_PER_BEAT)}`
        : played,
    )
    running = first.startTick + first.durationTicks
  }
  return tokens.join(' ')
}

/** A hand as the piece writes it, bar by bar (`-` where the pattern plays); nothing when no bar is written. */
export function writeHand(
  bars: readonly (readonly HandNote[] | null)[],
  barTicks: readonly Tick[],
): string | undefined {
  if (bars.every((bar) => bar === null)) return undefined
  return bars.map((bar, i) => (bar === null ? '-' : barText(bar, barTicks[i] ?? 0))).join(' | ')
}
