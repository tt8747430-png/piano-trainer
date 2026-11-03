import type { SpeedUp } from '@/shared/lib/schedule'

/** Each pass of speed training adds this share of the piece's tempo, in percent, unless said. */
const STEP = 5

/**
 * Speed training from a tempo: a share of the piece's tempo each pass (5% unless said, 1 BPM at
 * least), up to it; nothing at or above it.
 */
export function speedUp(tempo: number, ownTempo: number, percent = STEP): SpeedUp | undefined {
  return tempo < ownTempo
    ? { step: Math.max(1, Math.round((ownTempo * percent) / 100)), until: ownTempo }
    : undefined
}
