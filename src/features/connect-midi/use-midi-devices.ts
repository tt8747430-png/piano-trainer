import { useCallback, useSyncExternalStore } from 'react'
import type { MidiDevice, MidiLogEntry } from '@/shared/api/midi'
import { useServices } from '@/shared/lib/services'

const NONE: readonly never[] = []
const NO_UNSUBSCRIBE = () => {}

/** The MIDI devices connected now, following them as they come and go; none without Web MIDI. */
export function useMidiDevices(): readonly MidiDevice[] {
  const { midi } = useServices()
  const subscribe = useCallback(
    (onChange: () => void) => (midi ? midi.onStatus(onChange) : NO_UNSUBSCRIBE),
    [midi],
  )
  return useSyncExternalStore(subscribe, () => midi?.devices() ?? NONE)
}

/** The MIDI log as it grows (oldest first), and a way to clear it. */
export function useMidiLog(): { entries: readonly MidiLogEntry[]; clear: () => void } {
  const { midi } = useServices()
  const subscribe = useCallback(
    (onChange: () => void) => (midi ? midi.onLog(onChange) : NO_UNSUBSCRIBE),
    [midi],
  )
  const entries = useSyncExternalStore(subscribe, () => midi?.log() ?? NONE)
  const clear = useCallback(() => midi?.clearLog(), [midi])
  return { entries, clear }
}
