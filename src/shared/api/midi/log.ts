import { createListeners } from './listeners'
import { MIDI_LOG_SIZE, type MidiLogEntry } from './types'

/**
 * The MIDI log: the newest messages the keyboards sent (`size` of them), each with its keyboard and
 * the time it came. Its list is one value until a message comes or it is cleared, so a screen can
 * read it as a store.
 */
export function createMidiLog(size = MIDI_LOG_SIZE) {
  let entries: readonly MidiLogEntry[] = []
  let next = 1
  const listeners = createListeners<void>()
  return {
    entries: () => entries,
    add(device: string, data: ArrayLike<number>, time: number) {
      const entry: MidiLogEntry = { id: next++, device, data: Array.from(data), time }
      entries = [...entries.slice(Math.max(0, entries.length - size + 1)), entry]
      listeners.emit()
    },
    clear() {
      entries = []
      listeners.emit()
    },
    subscribe: listeners.add,
  }
}
