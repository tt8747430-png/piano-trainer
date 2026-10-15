import { REMEMBERED_CHORDS, type SettingsStore } from '@/entities/settings'
import type { Midi } from '@/shared/lib/music'

/**
 * Saves the Chord finder's switches. Remembering turned off forgets the chords: the staff writes the
 * chord down now, and the device keeps none.
 */
export function setChordFinder(
  store: SettingsStore,
  change: { readonly remember?: boolean; readonly inKeys?: boolean },
): void {
  store.setState((state) => ({
    chordFinder: {
      ...state.chordFinder,
      ...change,
      ...(change.remember === false ? { chords: [] } : {}),
    },
  }))
}

/** Saves the chords the Chord finder remembers, the newest kept; none while it remembers none. */
export function rememberChords(store: SettingsStore, chords: readonly (readonly Midi[])[]): void {
  store.setState((state) =>
    state.chordFinder.remember
      ? { chordFinder: { ...state.chordFinder, chords: chords.slice(-REMEMBERED_CHORDS) } }
      : {},
  )
}
