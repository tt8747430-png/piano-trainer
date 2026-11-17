import type { HandNote } from '@/shared/lib/arrangement'
import { TICKS_PER_BEAT, type Clef, type Tick } from '@/shared/lib/music'
import { CLEF_TOKEN, VOICE_TWO } from './parse-hands'
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
    const id = `${n.startTick} ${n.durationTicks} ${marksText(n)} ${n.voice ?? 1}`
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

/** A chord's token, from its first note: `pitches/beats`, then `@beat` where it is placed, then its marks. */
const chordText = (chord: readonly HandNote[], first: HandNote, at: boolean): string =>
  `${chord.map(noteText).join('+')}/${beatsText(first.durationTicks)}` +
  (at ? `@${beatsText(first.startTick + TICKS_PER_BEAT)}` : '') +
  marksText(first)

/**
 * One written bar: chords one after another, rests in the gaps, `@beat` (counted from 1) where one
 * starts under another; then the second voice's chords (ADR 0114), each `v2:` and placed by `@beat`.
 */
function barText(notes: readonly HandNote[], barTicks: Tick): string {
  const second = chordsOf(notes.filter((n) => n.voice === 2)).flatMap((chord) => {
    const [first] = chord
    return first ? [`${VOICE_TWO}${chordText(chord, first, true)}`] : []
  })
  const first = notes.filter((n) => n.voice !== 2)
  return [firstVoiceText(first, barTicks), ...second].join(' ')
}

/** The first voice's chords one after another, rests in the gaps, `@beat` where one starts under another. */
function firstVoiceText(notes: readonly HandNote[], barTicks: Tick): string {
  if (notes.length === 0) return `r/${beatsText(barTicks)}`
  const tokens: string[] = []
  let running: Tick = 0
  for (const chord of chordsOf(notes)) {
    const [first] = chord
    if (!first) continue
    if (first.startTick > running) tokens.push(`r/${beatsText(first.startTick - running)}`)
    tokens.push(chordText(chord, first, first.startTick < running))
    running = first.startTick + first.durationTicks
  }
  return tokens.join(' ')
}

/**
 * A hand as the piece writes it, bar by bar, every bar written (a bar with no notes a rest, ADR
 * 0114), each bar that changes its staff's clef starting `clef:` (ADR 0097).
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
