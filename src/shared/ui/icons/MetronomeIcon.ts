import { createLucideIcon } from 'lucide-react'

/**
 * A metronome, its case and its pendulum (the Practice board's Tools glyph, the Metronome's page picture
 * drawn small): the mark of the Tools in a screen's bar, the Metronome being the first of them.
 */
export const MetronomeIcon = createLucideIcon('metronome', [
  ['path', { d: 'M8 21h8L13.5 3h-3Z', key: 'case' }],
  ['path', { d: 'm12 15 5-7', key: 'pendulum' }],
])
