import type { HandNote } from '@/shared/lib/arrangement'
import { TICKS_PER_BEAT, type Clef, type Tick } from '@/shared/lib/music'
import { CLEF_TOKEN } from './parse-hands'
import { pitchText } from './music'
import { writeMarks } from './note-marks'
import { beatsText } from './write-chart'

const noteText = (n: HandNote) => `${pitchText(n)}${n.finger === undefined ? '' : `^${n.finger}`}`

/** A note's marks as its token writes them: `[acc,stacc]`, or nothing. */
const marksText = (n: HandNote): string => {
  const written = n.marks ? writeMarks(n.marks) : ''
  return written === '' ? '' : `[${written}]`
}

/**
 * A bar's notes struck together: those sharing an onset, a length and their marks, lowest first,
 * held ones first.
 */
function chordsOf(notes: readonly HandNote[]): HandNote[][] {
  const chords = new Map<string, HandNote[]>()
  for (const n of notes) {
    const id = `${n.startTick} ${n.durationTicks} ${marksText(n)}`
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
      (first.startTick < running
        ? `${played}@${beatsText(first.startTick + TICKS_PER_BEAT)}`
        : played) + marksText(first),
    )
    running = first.startTick + first.durationTicks
  }
  return tokens.join(' ')
}

/**
 * A hand as the piece writes it, bar by bar, every bar written (a bar with no notes a rest, ADR
 * 0091), each bar that changes its staff's clef starting `clef:` (ADR 0069).
 */
export function writeHand(
  bars: readonly (readonly HandNote[])[],
  barTicks: readonly Tick[],
  clefs: readonly (Clef | undefined)[] = [],
): string {
  return bars
    .map((bar, i) => {
      const clef = clefs[i]
      const text = barText(bar, barTicks[i] ?? 0)
      return clef ? `${CLEF_TOKEN}${clef} ${text}` : text
    })
    .join(' | ')
}
