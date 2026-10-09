import { useMidiSync } from '@/features/connect-midi'

/** The MIDI keyboard heard as the settings say, on every screen (spec 2026-10-09 §3.2). Renders nothing. */
export function MidiSync() {
  useMidiSync()
  return null
}
