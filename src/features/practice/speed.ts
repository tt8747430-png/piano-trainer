import type { SpeedUp } from '@/shared/lib/schedule'

/** Each pass of speed training adds this share of the piece's tempo. */
const STEP = 0.05

/** Speed training from a tempo: 5% of the piece's tempo each pass (1 BPM at least), up to it; nothing at or above it. */
export function speedUp(tempo: number, ownTempo: number): SpeedUp | undefined {
  return tempo < ownTempo
    ? { step: Math.max(1, Math.round(ownTempo * STEP)), until: ownTempo }
    : undefined
}
