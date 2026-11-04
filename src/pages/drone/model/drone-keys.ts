import type { DroneSettings } from '@/entities/settings'
import { midi, type Midi } from '@/shared/lib/music'

/** What each kind holds over its root, in semitones. */
const OVER: Readonly<Record<DroneSettings['kind'], readonly number[]>> = {
  note: [0],
  fifth: [0, 7],
  major: [0, 4, 7],
  minor: [0, 3, 7],
}

/** The keys a drone holds (R29 B11): its root in its octave (C4 middle C), and what its kind adds. */
export function droneKeys({
  root,
  kind,
  octave,
}: Pick<DroneSettings, 'root' | 'kind' | 'octave'>): Midi[] {
  const base = 12 * (octave + 1) + root
  return OVER[kind].map((above) => midi(base + above))
}
