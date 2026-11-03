import type { Midi } from '@/shared/lib/music'

/**
 * How long a struck string takes to die away (ADR 0034), the time constant its level falls by: 1.5 s
 * at the piano's top key to 6 s at its bottom, a lower string ringing longer. Every note decays so,
 * a hand's or the pedal's holding it: none holds at a level.
 */
export const stringDecay = (key: Midi): number => 1.5 + (4.5 * (108 - key)) / 87

/** A string's level `seconds` after it is struck, its peak 1. */
export const stringLevel = (key: Midi, seconds: number): number =>
  Math.exp(-seconds / stringDecay(key))
