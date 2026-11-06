import { usePianoVolume } from '@/features/live-keyboard'

/** The on-screen piano's Volume heard on every screen. Renders nothing. */
export function PianoVolume() {
  usePianoVolume()
  return null
}
