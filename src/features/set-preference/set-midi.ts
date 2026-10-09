import type { MidiSettings, SettingsStore } from '@/entities/settings'

/** Saves a change to the MIDI keyboard's settings, keeping the rest. */
export function setMidi(store: SettingsStore, change: Partial<MidiSettings>): void {
  store.setState((state) => ({ midi: { ...state.midi, ...change } }))
}
