import type { PedalEvent, Tick } from '@/shared/lib/music'

/** The sustain pedal held down: from where it is pressed to where it is let up (`Infinity`: never). */
export interface PedalSpan {
  readonly from: Tick
  readonly to: Tick
}

/**
 * Where the sustain pedal is down along its line (ADR 0097), in order: from a press to its release,
 * a change ending one span and starting the next (or pressing it where it was up).
 */
export function pedalSpans(events: readonly PedalEvent[]): PedalSpan[] {
  const spans: PedalSpan[] = []
  let down: Tick | null = null
  for (const { tick, kind } of events.toSorted((a, b) => a.tick - b.tick)) {
    if (kind === 'down' && down === null) down = tick
    else if ((kind === 'up' || kind === 'change') && down !== null && tick > down) {
      spans.push({ from: down, to: tick })
      down = kind === 'change' ? tick : null
    } else if (kind === 'change' && down === null) down = tick
  }
  if (down !== null) spans.push({ from: down, to: Infinity })
  return spans
}

/**
 * Where the sustain pedal lets up a note struck at a tick: its next release or change after the
 * press it was struck under; `Infinity` for a pedal never let up; null for a note struck with the
 * pedal up.
 */
export function pedalHeld(events: readonly PedalEvent[]): (tick: Tick) => Tick | null {
  const spans = pedalSpans(events)
  return (tick) => spans.find((span) => tick >= span.from && tick < span.to)?.to ?? null
}
