import { createLucideIcon } from 'lucide-react'

/**
 * Play, the way of practising in time with the music (the Player board's `METRO`): a metronome, its
 * case, pendulum and the bar across it.
 */
export const PlayAlongIcon = createLucideIcon('play-along', [
  ['path', { d: 'M9 3h6l4 18H5L9 3Z', key: 'case' }],
  ['path', { d: 'm12 15 6-9', key: 'pendulum' }],
  ['path', { d: 'M7.5 15h9', key: 'bar' }],
])
