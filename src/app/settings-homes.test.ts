import { readdirSync, readFileSync } from 'node:fs'
import { join, relative, resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

import { SETTING_HOMES, type SettingsPageId } from '@/entities/settings'

const SRC = resolve(import.meta.dirname, '..')

/** Where each page's controls are drawn: its page and the parts it is made of. */
const PAGE_PATHS: Readonly<Record<SettingsPageId, readonly string[]>> = {
  general: [
    'pages/settings/ui/GeneralPage.tsx',
    // The theme, General's, on its own Appearance page as Apple's Display & Brightness.
    'pages/settings/ui/AppearancePage.tsx',
    'features/live-keyboard/ui/TypingSwitch.tsx',
  ],
  'piano-sheet': ['features/live-keyboard/ui/PianoSheet.tsx'],
  'connect-piano': ['pages/midi-settings/', 'features/connect-midi/', 'features/live-keyboard/'],
  'score-editor': [
    'pages/score-editor/ui/ScoreSettingsPages.tsx',
    'features/record-take/ui/',
    // The recorder's click and count-in, set as a take is set up in Songs' Record sheet.
    'pages/songs/ui/RecordSheet.tsx',
  ],
  player: [
    'pages/player/',
    'widgets/player-settings/',
    'widgets/practice-player/',
    'widgets/score-view-menu/',
    'widgets/player-setup/',
    // The hands at the keys, one choice wherever the keys are: the Chords stage's too.
    'pages/chords/ui/ChordsPage.tsx',
    'widgets/chord-explorer/ui/ChordStage.tsx',
  ],
  metronome: ['pages/metronome/', 'features/metronome/'],
  tuner: ['pages/tuner/'],
  scales: ['widgets/scale-explorer/ui/ScaleLayout.tsx'],
  progressions: ['pages/progression/ui/ProgressionSettings.tsx'],
  intervals: ['pages/intervals/ui/IntervalSettings.tsx'],
  'chord-player': ['pages/chord-player/ui/ChordPlayerSettings.tsx'],
  chords: ['features/live-keyboard/ui/PianoSheet.tsx'],
  lessons: ['pages/lesson/ui/LessonSettingsPage.tsx'],
  'chord-finder': ['pages/chord-finder/ui/ChordFinderSettings.tsx'],
  trainers: ['widgets/trainer-setup/'],
  'select-toolbar': ['pages/settings/ui/SelectToolbarPage.tsx'],
  'swipe-actions': ['pages/settings/ui/SwipeActionsPage.tsx'],
}

/** Each preference command and the settings it writes (`features/set-preference`). */
const COMMANDS: Readonly<Record<string, readonly (keyof typeof SETTING_HOMES)[]>> = {
  setTheme: ['theme'],
  setLocale: ['locale'],
  setPracticeToggle: ['practice.fingerNumbers'],
  setScoreView: ['scoreView.layout'],
  setSound: ['sound.recording'],
  setStaffVolume: ['sound.staves'],
  setOtherHand: ['otherHand.look'],
  setPlayback: ['playback.countdown'],
  setAutoNext: ['trainer.autoNext'],
  setKeyboard: ['keyboard.namedKeys', 'keyboard.typing'],
  setRecorderClick: ['recorder.click'],
  setRecorderTune: ['recorder.tune'],
  setRecorderCountIn: ['recorder.countIn'],
  setEditing: ['editing.hearNotes'],
  setMidi: ['midi.input'],
  setChordFinder: ['chordFinder.remember'],
  setProgressions: ['progressions.names'],
  setChordPlayer: ['chordPlayer.names'],
  setMetronome: ['metronome.bpm'],
  setTunerA4: ['tuner.a4'],
  setBar: ['bars.select.songs', 'bars.swipe.songs.leading'],
}

/**
 * Writers outside their setting's home, each with why: the round that moves it, or a command called
 * for a field that is no preference. A new entry for a preference is a second home, which R18 refuses.
 */
const NOT_YET_HOME: Readonly<Record<string, string>> = {
  'setSound features/metronome/use-metronome.ts':
    "round 2 (A39): the click's volume moves to the Metronome's one set",
  'setKeyboard features/live-keyboard/model/use-fold-keys.ts':
    'writes only the keys’ fold, which is the screen as left and not a preference',
}

function sources(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) return sources(path)
    return /\.tsx?$/.test(entry.name) && !/\.test\.tsx?$/.test(entry.name) ? [path] : []
  })
}

describe('each preference has one home (R18, A10)', () => {
  const files = sources(SRC)
    .map((path) => relative(SRC, path))
    .filter(
      (path) => !path.startsWith('features/set-preference/') && !path.startsWith('app/testing/'),
    )
    .map((path) => ({ path, text: readFileSync(join(SRC, path), 'utf8') }))
    // A writer imports its command; a component's own state setter of the same name is not one.
    .filter(({ text }) => text.includes("from '@/features/set-preference'"))

  it.each(Object.entries(COMMANDS))('writes %s only from its home', (command, keys) => {
    const homes = new Set(keys.map((key) => SETTING_HOMES[key]))
    const allowed = [...homes].flatMap((home) => PAGE_PATHS[home])
    const call = new RegExp(`\\b${command}\\(`)
    const strays = files
      .filter(({ text }) => call.test(text))
      .map(({ path }) => path)
      .filter((path) => !allowed.some((place) => path.startsWith(place)))
      .filter((path) => NOT_YET_HOME[`${command} ${path}`] === undefined)
    expect(strays).toEqual([])
  })

  it('keeps no exception that has gone', () => {
    const stale = Object.keys(NOT_YET_HOME).filter((entry) => {
      const [command = '', path = ''] = entry.split(' ')
      const file = files.find((candidate) => candidate.path === path)
      return !file || !new RegExp(`\\b${command}\\(`).test(file.text)
    })
    expect(stale).toEqual([])
  })
})
