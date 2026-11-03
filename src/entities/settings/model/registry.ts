import type { SettingsState } from './types'

/**
 * The pages a preference can live on (R18): the app's own Settings pages, and each kind's page
 * (every item of a kind reads and plays the way its page says). An item's own facts (a song's name,
 * a lesson's chapter) are not preferences: they stay on the item's Settings page.
 */
export const SETTINGS_PAGES = [
  'general',
  'keyboard-and-recording',
  'midi',
  'score-editor',
  'player',
  'metronome',
  'chord-finder',
  'trainers',
] as const
export type SettingsPageId = (typeof SETTINGS_PAGES)[number]

/** What the saved settings keep that is not a preference: the screen as the learner left it. */
export const NOT_PREFERENCES = [
  'sidebar',
  'paletteFolded',
  'paletteSections',
  'foldedSections',
  'welcomed',
  'chordFinder.chords',
] as const

type Leaf<T> = {
  [K in keyof T & string]: T[K] extends readonly unknown[]
    ? K
    : T[K] extends object
      ? `${K}.${keyof T[K] & string}`
      : K
}[keyof T & string]

/** Every field of the saved settings, a group's fields one by one (`keyboard.keySize`). */
export type SettingsField = Leaf<SettingsState>

type NotPreference = (typeof NOT_PREFERENCES)[number]

/** A preference: a field the learner sets on one page. */
export type SettingKey = Exclude<SettingsField, NotPreference | `${NotPreference}.${string}`>

/**
 * The one page each preference is set on (A10). Anywhere else the app may show its value or link to
 * that page, never a second control: `settings-homes.test.tsx` renders the pages and fails a key
 * drawn on any page but its home.
 */
export const SETTING_HOMES: Readonly<Record<SettingKey, SettingsPageId>> = {
  theme: 'general',
  locale: 'general',
  lessonReading: 'general',
  'practice.fingerNumbers': 'player',
  'practice.namedNotes': 'player',
  'practice.positions': 'player',
  'practice.metronome': 'player',
  'practice.countIn': 'player',
  'sound.rh': 'player',
  'sound.lh': 'player',
  'sound.staves': 'player',
  'sound.recording': 'player',
  'sound.click': 'player',
  'trainer.autoNext': 'trainers',
  'keyboard.keySize': 'keyboard-and-recording',
  'keyboard.swipe': 'keyboard-and-recording',
  'keyboard.namedKeys': 'keyboard-and-recording',
  'keyboard.markNotes': 'keyboard-and-recording',
  'keyboard.chordNames': 'keyboard-and-recording',
  'keyboard.typing': 'keyboard-and-recording',
  'keyboard.autoplay': 'keyboard-and-recording',
  'keyboard.dock': 'keyboard-and-recording',
  'keyboard.folded': 'keyboard-and-recording',
  'keyboard.foldedLandscape': 'keyboard-and-recording',
  'keyboard.keyLength': 'keyboard-and-recording',
  'keyboard.railControls': 'keyboard-and-recording',
  'recorder.click': 'keyboard-and-recording',
  'recorder.tune': 'keyboard-and-recording',
  'editing.hearNotes': 'score-editor',
  'midi.input': 'midi',
  'midi.device': 'midi',
  'midi.sound': 'midi',
  'midi.throughPiano': 'midi',
  'midi.octaveShift': 'midi',
  'midi.touch': 'midi',
  'midi.pedal': 'midi',
  'chordFinder.remember': 'chord-finder',
  'chordFinder.inKeys': 'chord-finder',
  'chordFinder.slash': 'chord-finder',
  'scoreView.layout': 'player',
  'scoreView.music': 'player',
  'scoreView.diagrams': 'player',
  'scoreView.askOnOpen': 'player',
  'scoreView.chordNames': 'player',
  'scoreView.lyrics': 'player',
  'scoreView.pinned': 'player',
  'scoreView.textSize': 'player',
  'scoreView.hidden': 'player',
  'scoreView.keys': 'player',
  melody: 'player',
  'metronome.bpm': 'metronome',
  'metronome.meter': 'metronome',
  'metronome.sound': 'metronome',
  'metronome.trainer': 'metronome',
  'metronome.levels': 'metronome',
  'metronome.subdivision': 'metronome',
  'metronome.speed': 'metronome',
}
