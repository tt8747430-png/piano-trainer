import type { NoteMarks, Tick } from '@/shared/lib/music'

/** The sustain pedal held down: from where it is pressed to where it is let up (`Infinity`: never). */
export interface PedalSpan {
  readonly from: Tick
  readonly to: Tick
}

/**
 * Where the sustain pedal its notes mark (ADR 0097) is down, in order: from a press to its release,
 * a change ending one span and starting the next.
 */
export function pedalSpans(
  notes: readonly { readonly startTick: Tick; readonly marks?: NoteMarks }[],
): PedalSpan[] {
  const spans: PedalSpan[] = []
  let down: Tick | null = null
  const marked = notes
    .filter((n) => n.marks?.pedal !== undefined)
    .sort((a, b) => a.startTick - b.startTick)
  for (const { startTick, marks } of marked) {
    const pedal = marks?.pedal
    if (pedal === 'down' && down === null) down = startTick
    else if ((pedal === 'up' || pedal === 'change') && down !== null && startTick > down) {
      spans.push({ from: down, to: startTick })
      down = pedal === 'change' ? startTick : null
    } else if (pedal === 'change' && down === null) down = startTick
  }
  if (down !== null) spans.push({ from: down, to: Infinity })
  return spans
}

/**
 * Where the sustain pedal its notes mark lets up a note struck at a tick: the pedal's next release
 * or change after the press it was struck under; `Infinity` for a pedal never let up; null for a
 * note struck with the pedal up.
 */
export function pedalHeld(
  notes: readonly { readonly startTick: Tick; readonly marks?: NoteMarks }[],
): (tick: Tick) => Tick | null {
  const spans = pedalSpans(notes)
  return (tick) => spans.find((span) => tick >= span.from && tick < span.to)?.to ?? null
}
