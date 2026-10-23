import type { BarRange } from '@/features/practice'

/**
 * Whether a note clicked in `bar` keeps the loop: inside it, a tap while practising it costs nothing;
 * outside it, the learner is going elsewhere and the loop is let go of.
 */
export function keepsLoop(loop: BarRange, bar: number | undefined): boolean {
  return bar !== undefined && bar >= loop.first && bar <= loop.last
}
