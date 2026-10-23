import type { Locale } from '@/shared/i18n/locale'
import type {
  ChordFinderSettings,
  ScoreViewSettings,
  KeyboardSettings,
  MidiSettings,
  PracticeToggles,
  RecorderSettings,
  SettingsState,
  PaletteSide,
  Sidebar,
  Theme,
  TitleSize,
  FloatingSettings,
  TrainerSettings,
} from './types'

export const selectTheme = (state: SettingsState): Theme => state.theme
export const selectTitles = (state: SettingsState): TitleSize => state.titles
export const selectLocale = (state: SettingsState): Locale => state.locale
export const selectPractice = (state: SettingsState): PracticeToggles => state.practice
export const selectTrainer = (state: SettingsState): TrainerSettings => state.trainer
export const selectFloating = (state: SettingsState): FloatingSettings => state.floating
export const selectKeyboard = (state: SettingsState): KeyboardSettings => state.keyboard
export const selectRecorder = (state: SettingsState): RecorderSettings => state.recorder
export const selectSidebar = (state: SettingsState): Sidebar => state.sidebar
export const selectPaletteSide = (state: SettingsState): PaletteSide => state.paletteSide
export const selectPaletteFolded = (state: SettingsState): boolean => state.paletteFolded
export const selectMidi = (state: SettingsState): MidiSettings => state.midi
/** Whether the section `id` is folded away. */
export const selectSectionFolded =
  (id: string) =>
  (state: SettingsState): boolean =>
    state.foldedSections.includes(id)
export const selectChordFinder = (state: SettingsState): ChordFinderSettings => state.chordFinder
export const selectScoreView = (state: SettingsState): ScoreViewSettings => state.scoreView
