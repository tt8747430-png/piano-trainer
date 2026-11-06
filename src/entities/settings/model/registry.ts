import type { SettingsState } from './types'

/**
 * The pages a preference can live on (R18): the app's own Settings pages, and each kind's page
 * (every item of a kind reads and plays the way its page says). An item's own facts (a song's name,
 * a lesson's chapter) are not preferences: they stay on the item's Settings page.
 */
export const SETTINGS_PAGES = [
  'general',
  'on-screen-piano',
  'connect-piano',
  'score-editor',
  'player',
  'metronome',
  'scales',
  'progressions',
  'chord-player',
  'chord-finder',
  'trainers',
  'select-toolbar',
  'swipe-actions',
  'lessons',
  'tuner',
] as const
export type SettingsPageId = (typeof SETTINGS_PAGES)[number]

/** What the saved settings keep that is not a preference: the screen as the learner left it. */
export const NOT_PREFERENCES = [
  'sidebar',
  'paletteFolded',
  'paletteList',
  'paletteCategory',
  'editorMode',
  'foldedSections',
  'welcomed',
  'tipsSeen',
  'practiceRecent',
  'chordFinder.chords',
  'keyboard.folded',
  'keysHeight',
  'keyboard.foldedLandscape',
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
  lessonReading: 'lessons',
  'practice.fingerNumbers': 'player',
  'practice.namedNotes': 'player',
  'practice.positions': 'player',
  'practice.metronome': 'player',
  'sound.staves': 'player',
  'sound.recording': 'player',
  'sound.click': 'player',
  'trainer.autoNext': 'trainers',
  'keyboard.keySize': 'on-screen-piano',
  'keyboard.swipe': 'on-screen-piano',
  'keyboard.namedKeys': 'on-screen-piano',
  'keyboard.markNotes': 'on-screen-piano',
  'keyboard.chordNames': 'on-screen-piano',
  'keyboard.typing': 'on-screen-piano',
  'keyboard.autoplay': 'on-screen-piano',
  'keyboard.dock': 'on-screen-piano',
  'keyboard.pedals': 'on-screen-piano',
  'keyboard.volume': 'on-screen-piano',
  'recorder.click': 'score-editor',
  'recorder.tune': 'score-editor',
  'recorder.countIn': 'score-editor',
  'editing.hearNotes': 'score-editor',
  'editing.paletteSide': 'score-editor',
  'midi.input': 'connect-piano',
  'midi.device': 'connect-piano',
  'midi.sound': 'connect-piano',
  'midi.throughPiano': 'connect-piano',
  'midi.octaveShift': 'connect-piano',
  'midi.touch': 'connect-piano',
  'midi.pedal': 'connect-piano',
  'midi.latency': 'connect-piano',
  'chordFinder.remember': 'chord-finder',
  'chordFinder.inKeys': 'chord-finder',
  'chordFinder.slash': 'chord-finder',
  'chordFinder.scale': 'chord-finder',
  'progressions.names': 'progressions',
  'progressions.voicing': 'progressions',
  'progressions.inversion': 'progressions',
  'chordPlayer.names': 'chord-player',
  'chordPlayer.voicing': 'chord-player',
  'scoreView.layout': 'player',
  'scoreView.music': 'player',
  'scoreView.diagrams': 'player',
  'scoreView.askOnOpen': 'player',
  'scoreView.chordNames': 'player',
  'scoreView.lyrics': 'player',
  'scoreView.pinned': 'player',
  'scoreView.textSize': 'player',
  'scoreView.keys': 'player',
  'scoreView.hands': 'player',
  'scoreView.annotations': 'player',
  'bars.select.songs': 'select-toolbar',
  'bars.swipe.songs.leading': 'swipe-actions',
  'bars.swipe.songs.trailing': 'swipe-actions',
  'bars.swipe.folders.leading': 'swipe-actions',
  'bars.swipe.folders.trailing': 'swipe-actions',
  'otherHand.look': 'player',
  'otherHand.play': 'player',
  'handsView.skin': 'player',
  'playback.countdown': 'player',
  'playback.cursor': 'player',
  'playback.follow': 'player',
  'playback.followReturn': 'player',
  'playback.pedal': 'player',
  'playback.speedStep': 'player',
  'metronome.bpm': 'metronome',
  'metronome.meter': 'metronome',
  'metronome.sound': 'metronome',
  'metronome.trainer': 'metronome',
  'metronome.levels': 'metronome',
  'metronome.subdivision': 'metronome',
  'metronome.speed': 'metronome',
  'tuner.a4': 'tuner',
  'scaleStaff.tonic': 'scales',
  'scaleStaff.tetrachords': 'scales',
}
