import type { Tick } from '@/shared/lib/music'
import type { Scheduled } from './schedule'

/**
 * The tick a pass sounds `elapsed` seconds after its start, where a playhead stands (ADR 0096):
 * between the beat group reached and the next (the pass's end after its last), in proportion to
 * the time between them; null before its first beat group sounds (through a count-in).
 */
export function passTickAt(
  pass: Pick<Scheduled, 'cues' | 'end' | 'toTick'>,
  elapsed: number,
): Tick | null {
  const reached = pass.cues.findLastIndex((cue) => cue.at <= elapsed)
  const cue = pass.cues[reached]
  if (!cue) return null
  const next = pass.cues[reached + 1] ?? { tick: pass.toTick, at: pass.end }
  const span = next.at - cue.at
  const part = span > 0 ? Math.min(1, (elapsed - cue.at) / span) : 0
  return cue.tick + (next.tick - cue.tick) * part
}
