import { createLucideIcon } from 'lucide-react'

/**
 * A scale, its notes climbing step by step (the canvas's `SCALESI`): a staircase drawn as lucide draws
 * its icons, one for Scales and keys wherever it appears (its tile, a lesson's scale step, the Circle's
 * Scales).
 */
export const ScaleIcon = createLucideIcon('scale-steps', [
  ['path', { d: 'M3 18h4v-4h4v-4h4V6h6', key: 'steps' }],
])
