import type { NoteMarks, Tick } from '@/shared/lib/music'

/**
 * Where the sustain pedal its notes mark (ADR 0068) lets up a note struck at a tick: the pedal's
 * next release or change after the press it was struck under; `Infinity` for a pedal never let up;
 * null for a note struck with the pedal up.
 */
export function pedalHeld(
  notes: readonly { readonly startTick: Tick; readonly marks?: NoteMarks }[],
): (tick: Tick) => Tick | null {
  const spans: { readonly from: Tick; readonly to: Tick }[] = []
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
  return (tick) => spans.find((span) => tick >= span.from && tick < span.to)?.to ?? null
}
