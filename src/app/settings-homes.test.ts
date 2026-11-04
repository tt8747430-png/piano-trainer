import { readdirSync, readFileSync } from 'node:fs'
import { join, relative, resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

import { SETTING_HOMES, type SettingsPageId } from '@/entities/settings'

const SRC = resolve(import.meta.dirname, '..')

/** Where each page's controls are drawn: its page and the parts it is made of. */
const PAGE_PATHS: Readonly<Record<SettingsPageId, readonly string[]>> = {
  general: ['pages/settings/ui/GeneralPage.tsx', 'widgets/welcome/'],
  'on-screen-piano': ['pages/settings/ui/OnScreenPianoPage.tsx', 'features/live-keyboard/'],
  'connect-piano': ['pages/midi-settings/', 'features/connect-midi/', 'features/live-keyboard/'],
  'score-editor': ['pages/score-editor/ui/ScoreSettingsPages.tsx', 'features/record-take/ui/'],
  player: [
    'pages/player/',
    'widgets/player-settings/',
    'widgets/practice-player/',
    'widgets/score-view-menu/',
    'widgets/player-setup/',
    'pages/score-editor/ui/EditorToolsRow.tsx',
  ],
  metronome: ['pages/metronome/'],
  chords: ['pages/practice-settings/ui/ExplorerSettingsPages.tsx'],
  scales: ['pages/practice-settings/ui/ExplorerSettingsPages.tsx'],
  intervals: ['pages/practice-settings/ui/ExplorerSettingsPages.tsx'],
  progressions: ['pages/practice-settings/ui/ProgressionsSettingsPage.tsx'],
  accompaniment: ['pages/practice-settings/ui/AccompanimentSettingsPage.tsx'],
  'chord-player': ['pages/chord-player-settings/'],
  lessons: ['pages/lesson/ui/LessonSettingsPage.tsx'],
  'chord-finder': ['pages/practice-settings/ui/ChordFinderSettingsPage.tsx'],
  trainers: ['pages/practice-settings/ui/TrainersSettingsPage.tsx'],
  'select-toolbar': ['pages/settings/ui/SelectToolbarPage.tsx'],
  'swipe-actions': ['pages/settings/ui/SwipeActionsPage.tsx'],
}

/** Each preference command and the settings it writes (`features/set-preference`). */
const COMMANDS: Readonly<Record<string, readonly (keyof typeof SETTING_HOMES)[]>> = {
  setTheme: ['theme'],
  setLocale: ['locale'],
  setLessonReading: ['lessonReading'],
  setPracticeToggle: ['practice.fingerNumbers'],
  setScoreView: ['scoreView.layout'],
  setSound: ['sound.recording'],
  setStaffVolume: ['sound.staves'],
  setOtherHand: ['otherHand.look'],
  setPlayback: ['playback.countdown'],
  setAutoNext: ['trainer.autoNext'],
  setKeyboard: ['keyboard.keySize', 'keyboard.typing'],
  setRecorderClick: ['recorder.click'],
  setRecorderTune: ['recorder.tune'],
  setEditing: ['editing.hearNotes'],
  setMidi: ['midi.input'],
  setChordFinder: ['chordFinder.remember'],
  setProgressions: ['progressions.names'],
  setChordPlayer: ['chordPlayer.names'],
  setAccompaniment: ['accompaniment.hidden'],
  setMetronome: ['metronome.bpm'],
  setBar: ['bars.bar.player', 'bars.select.songs', 'bars.swipe.songs.leading'],
}

/**
 * Writers that stay outside their setting's home for now, each with the round that moves it. The
 * list only shrinks: a new entry is a second home, which R18 refuses.
 */
const NOT_YET_HOME: Readonly<Record<string, string>> = {
  'setSound pages/metronome/model/use-metronome.ts':
    "round 2 (A39): the click's volume moves to the Metronome's one set",
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
