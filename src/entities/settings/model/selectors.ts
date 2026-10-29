import type { Locale } from '@/shared/i18n/locale'
import type {
  ChordFinderSettings,
  ScoreViewSettings,
  KeyboardSettings,
  MelodySource,
  MetronomeSettings,
  MidiSettings,
  PracticeToggles,
  RecorderSettings,
  PalettePlace,
  SettingsState,
  Sidebar,
  SoundSettings,
  Theme,
  FloatingSettings,
  TrainerSettings,
} from './types'

export const selectTheme = (state: SettingsState): Theme => state.theme
export const selectLocale = (state: SettingsState): Locale => state.locale
export const selectPractice = (state: SettingsState): PracticeToggles => state.practice
export const selectSound = (state: SettingsState): SoundSettings => state.sound
export const selectTrainer = (state: SettingsState): TrainerSettings => state.trainer
export const selectFloating = (state: SettingsState): FloatingSettings => state.floating
export const selectKeyboard = (state: SettingsState): KeyboardSettings => state.keyboard
export const selectRecorder = (state: SettingsState): RecorderSettings => state.recorder
export const selectSidebar = (state: SettingsState): Sidebar => state.sidebar
/** Whether the palette is folded where it stands: as the learner left it there, else the panel shown and the sheet compact. */
export const selectPaletteFolded =
  (place: PalettePlace) =>
  (state: SettingsState): boolean =>
    state.paletteFolded[place] ?? place === 'sheet'
/** The editor's panel's open sections, by name; null until the learner chooses. */
export const selectPaletteSections = (state: SettingsState): readonly string[] | null =>
  state.paletteSections
export const selectMidi = (state: SettingsState): MidiSettings => state.midi
/** Whether the section `id` is folded away. */
export const selectSectionFolded =
  (id: string) =>
  (state: SettingsState): boolean =>
    state.foldedSections.includes(id)
export const selectChordFinder = (state: SettingsState): ChordFinderSettings => state.chordFinder
export const selectScoreView = (state: SettingsState): ScoreViewSettings => state.scoreView
/** What plays a song's melody along (ADR 0115). */
export const selectMelody = (state: SettingsState): MelodySource => state.melody
export const selectMetronome = (state: SettingsState): MetronomeSettings => state.metronome

export const selectWelcomed = (state: SettingsState): boolean => state.welcomed
