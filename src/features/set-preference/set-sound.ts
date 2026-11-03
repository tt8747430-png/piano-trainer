import type { SettingsStore, SoundSettings } from '@/entities/settings'
import type { StaffId } from '@/shared/lib/notation'

/** Saves how loud the recording or the click sounds (ADR 0105), keeping the rest. */
export function setSound(
  store: SettingsStore,
  change: Partial<Omit<SoundSettings, 'staves'>>,
): void {
  store.setState((state) => ({ sound: { ...state.sound, ...change } }))
}

/** Saves how loud a staff sounds, by its place, for every song (A35). */
export function setStaffVolume(store: SettingsStore, staff: StaffId, percent: number): void {
  store.setState((state) => ({
    sound: { ...state.sound, staves: { ...state.sound.staves, [staff]: percent } },
  }))
}

/**
 * Chordify's tip, "turn the Song volume down and the chord volume up to only hear the chords": the
 * recording silent, the piano's two staves at full; the single staves and the click as they were.
 */
export function onlyTheChords(store: SettingsStore): void {
  store.setState((state) => ({
    sound: {
      ...state.sound,
      recording: 0,
      staves: { ...state.sound.staves, treble: 100, bass: 100 },
    },
  }))
}
