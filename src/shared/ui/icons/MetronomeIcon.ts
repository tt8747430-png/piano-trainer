import { createLucideIcon } from 'lucide-react'

/**
 * The metronome (the canvas's `METI`): its body, its scale and its arm, drawn as lucide draws its
 * icons. The bands' metronome button, where one press changes its mode.
 */
export const MetronomeIcon = createLucideIcon('metronome-body', [
  ['path', { d: 'M9 3h6l4 18H5z', key: 'body' }],
  ['path', { d: 'M7.5 15h9', key: 'scale' }],
  ['path', { d: 'm12 15 5-9', key: 'arm' }],
])
