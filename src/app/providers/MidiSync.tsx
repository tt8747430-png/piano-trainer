import { useMidiSync } from '@/features/connect-midi'

/** The MIDI keyboard heard as the settings say, on every screen. Renders nothing. */
export function MidiSync() {
  useMidiSync()
  return null
}
