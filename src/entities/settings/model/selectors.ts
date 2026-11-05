import type { Locale } from '@/shared/i18n/locale'
import type {
  AccompanimentSettings,
  EditorStartMode,
  ChordFinderSettings,
  ProgressionsSettings,
  ChordPlayerSettings,
  ScaleStaffSettings,
  TunerSettings,
  ScoreViewSettings,
  KeyboardSettings,
  OtherHandSettings,
  PlaybackSettings,
  MetronomeSettings,
  MidiSettings,
  PracticeToggles,
  RecorderSettings,
  EditingSettings,
  SettingsState,
  Sidebar,
  SoundSettings,
  Theme,
  TrainerSettings,
  LessonReading,
} from './types'

export const selectTheme = (state: SettingsState): Theme => state.theme
export const selectLocale = (state: SettingsState): Locale => state.locale
export const selectPractice = (state: SettingsState): PracticeToggles => state.practice
export const selectSound = (state: SettingsState): SoundSettings => state.sound
export const selectTrainer = (state: SettingsState): TrainerSettings => state.trainer
export const selectKeyboard = (state: SettingsState): KeyboardSettings => state.keyboard
export const selectRecorder = (state: SettingsState): RecorderSettings => state.recorder
export const selectEditing = (state: SettingsState): EditingSettings => state.editing
export const selectSidebar = (state: SettingsState): Sidebar => state.sidebar
/** Whether the palette is folded where it stands: as the learner left it there, else the panel shown and the sheet compact. */
export const selectPaletteFolded = (state: SettingsState): boolean => state.paletteFolded
/** Whether the palette shows its tools as named rows (R32-C, Flat's list view). */
export const selectPaletteList = (state: SettingsState): boolean => state.paletteList
/** The palette's category chosen, by name; null until the learner chooses. */
export const selectPaletteCategory = (state: SettingsState): string | null => state.paletteCategory
/** The mode the score editor writes in, as it was left. */
export const selectEditorMode = (state: SettingsState): EditorStartMode => state.editorMode
export const selectMidi = (state: SettingsState): MidiSettings => state.midi
/** Whether the section `id` is folded away. */
export const selectSectionFolded =
  (id: string) =>
  (state: SettingsState): boolean =>
    state.foldedSections.includes(id)
export const selectChordFinder = (state: SettingsState): ChordFinderSettings => state.chordFinder
export const selectScoreView = (state: SettingsState): ScoreViewSettings => state.scoreView
/** With one hand practised, how the other looks and whether it is heard (A35). */
export const selectOtherHand = (state: SettingsState): OtherHandSettings => state.otherHand
/** How the Player always plays (B7). */
export const selectPlayback = (state: SettingsState): PlaybackSettings => state.playback
export const selectMetronome = (state: SettingsState): MetronomeSettings => state.metronome

export const selectWelcomed = (state: SettingsState): boolean => state.welcomed
/** Whether a tip was put away or done (R31-P): it shows no more. */
export const selectTipSeen =
  (id: string) =>
  (state: SettingsState): boolean =>
    state.tipsSeen.includes(id)

/** How a lesson reads (round 26): one page, or a section at a time. */
export const selectLessonReading = (state: SettingsState): LessonReading => state.lessonReading

/** How every progression is written and voiced (A24). */
export const selectProgressions = (state: SettingsState): ProgressionsSettings => state.progressions
/** How the Chord player writes its chords and voices its piano (R29 CP6). */
export const selectTuner = (state: SettingsState): TunerSettings => state.tuner
export const selectScaleStaff = (state: SettingsState): ScaleStaffSettings => state.scaleStaff
export const selectChordPlayer = (state: SettingsState): ChordPlayerSettings => state.chordPlayer
/** Accompaniment's sources the learner hid (A24). */
export const selectAccompaniment = (state: SettingsState): AccompanimentSettings =>
  state.accompaniment
