import { BAR_SURFACES, DEFAULT_BARS, normaliseBar, type Bars } from './bars'
import type { StoreApi } from 'zustand/vanilla'
import { isLocale } from '@/shared/i18n/locale'
import { isStaffId } from '@/shared/lib/notation'
import {
  createSavedStore,
  isOneOf,
  SHEET_VIEWS,
  readKeyList,
  savedObject,
  type SavingOptions,
} from '@/shared/lib'
import { isInversion, type Midi } from '@/shared/lib/music'
import { beatsOf, BPM_RANGE, isMetronomeMeter } from '@/shared/lib/schedule'
import {
  CHORD_KEYS_MAX,
  isLessonReading,
  DEFAULT_CHORD_FINDER,
  DEFAULT_METRONOME,
  DEFAULT_MIDI,
  DEFAULT_SCORE_VIEW,
  DEFAULT_PRACTICE,
  DEFAULT_EDITING,
  EDITOR_START_MODES,
  PALETTE_SIDES,
  DEFAULT_RECORDER,
  RECORDER_COUNT_INS,
  DEFAULT_SIDEBAR,
  DEFAULT_OTHER_HAND,
  DEFAULT_PLAYBACK,
  FOLLOW_RETURNS,
  type FollowReturn,
  DEFAULT_SOUND,
  DEFAULT_TRAINER,
  DEFAULT_PROGRESSIONS,
  DEFAULT_CHORD_PLAYER,
  type ChordPlayerSettings,
  isProgressionNames,
  isProgressionVoicing,
  DEVICE_NAME_MAX,
  FOLDED_MAX,
  SECTION_ID_MAX,
  PRACTICE_TOGGLES,
  REMEMBERED_CHORDS,
  defaultKeyboard,
  detectLocale,
  isKeyDock,
  isKeyLength,
  isDiagramsMode,
  isTextSize,
  isOtherHandLook,
  isCountdown,
  isCursor,
  isPedalPlay,
  isSpeedStep,
  isKeySize,
  isBeatLevel,
  isMetronomeSound,
  isSubdivision,
  isTrainerBars,
  isMusicView,
  isNamedKeys,
  isOctaveShift,
  isPedalWay,
  isSidebar,
  isSwipe,
  isTheme,
  isTouch,
  type ChordFinderSettings,
  type ProgressionsSettings,
  type KeyboardSettings,
  type MetronomeSettings,
  type MidiSettings,
  type OtherHandSettings,
  type PlaybackSettings,
  type PracticeToggles,
  type EditingSettings,
  type RecorderSettings,
  type ScoreViewSettings,
  type SettingsState,
  type SoundSettings,
  type TrainerSettings,
  A4_RANGE,
  DEFAULT_TUNER,
  DEFAULT_SCALE_STAFF,
  type ScaleStaffSettings,
  type TunerSettings,
} from './types'

/** Read before first paint by index.html's #theme-boot script: keep the key and shape in step. */
export const SETTINGS_STORAGE_KEY = 'pt-settings'
export const SETTINGS_VERSION = 31

export type SettingsStore = StoreApi<SettingsState>

export function createSettingsStore({
  languages = navigator.languages,
  finePointer = matchMedia('(pointer: fine)').matches,
  ...saving
}: SavingOptions & {
  languages?: readonly string[]
  finePointer?: boolean
} = {}): SettingsStore {
  return createSavedStore(
    {
      key: SETTINGS_STORAGE_KEY,
      version: SETTINGS_VERSION,
      initial: {
        theme: 'system',
        locale: detectLocale(languages),
        practice: DEFAULT_PRACTICE,
        sound: DEFAULT_SOUND,
        trainer: DEFAULT_TRAINER,
        keyboard: defaultKeyboard(finePointer),
        recorder: DEFAULT_RECORDER,
        editing: DEFAULT_EDITING,
        sidebar: DEFAULT_SIDEBAR,
        paletteFolded: true,
        paletteList: false,
        paletteCategory: null,
        editorMode: 'replace',
        midi: DEFAULT_MIDI,
        chordFinder: DEFAULT_CHORD_FINDER,
        scoreView: DEFAULT_SCORE_VIEW,
        otherHand: DEFAULT_OTHER_HAND,
        playback: DEFAULT_PLAYBACK,
        metronome: DEFAULT_METRONOME,
        foldedSections: [],
        welcomed: false,
        tipsSeen: [],
        practiceRecent: [],
        lessonReading: 'page',
        progressions: DEFAULT_PROGRESSIONS,
        chordPlayer: DEFAULT_CHORD_PLAYER,
        bars: DEFAULT_BARS,
        tuner: DEFAULT_TUNER,
        scaleStaff: DEFAULT_SCALE_STAFF,
      },
      read: sanitize,
    },
    saving,
  )
}

/** A toggle keeps what was saved; one never saved (a newer toggle) takes its default. */
function practiceToggles(value: unknown): PracticeToggles {
  const saved = savedObject<PracticeToggles>(value)
  return Object.fromEntries(
    PRACTICE_TOGGLES.map((toggle) => {
      const kept: unknown = saved[toggle]
      return [toggle, typeof kept === 'boolean' ? kept : DEFAULT_PRACTICE[toggle]]
    }),
  ) as Record<keyof PracticeToggles, boolean>
}

/** A volume as saved: a whole percent from 0 to 100. */
const isVolume = (value: unknown): value is number =>
  Number.isInteger(value) && (value as number) >= 0 && (value as number) <= 100

/** Each part's volume as saved where it is one, at full otherwise; a staff's kept by a staff's id. */
function soundSettings(value: unknown): SoundSettings {
  const saved = savedObject<SoundSettings>(value)
  const staves = savedObject<Record<string, unknown>>(saved.staves)
  return {
    staves: Object.fromEntries(
      Object.entries(staves).filter(
        (entry): entry is [string, number] => isStaffId(entry[0]) && isVolume(entry[1]),
      ),
    ),
    recording: isVolume(saved.recording) ? saved.recording : DEFAULT_SOUND.recording,
    click: isVolume(saved.click) ? saved.click : DEFAULT_SOUND.click,
  }
}

/** How the Player plays as saved, each where still valid. */
function playbackSettings(value: unknown): PlaybackSettings {
  const saved = savedObject<PlaybackSettings>(value)
  const initial = DEFAULT_PLAYBACK
  return {
    countdown: isCountdown(saved.countdown) ? saved.countdown : initial.countdown,
    cursor: isCursor(saved.cursor) ? saved.cursor : initial.cursor,
    pedal: isPedalPlay(saved.pedal) ? saved.pedal : initial.pedal,
    speedStep: isSpeedStep(saved.speedStep) ? saved.speedStep : initial.speedStep,
    follow: typeof saved.follow === 'boolean' ? saved.follow : initial.follow,
    followReturn: (FOLLOW_RETURNS as readonly unknown[]).includes(saved.followReturn)
      ? (saved.followReturn as FollowReturn)
      : initial.followReturn,
  }
}

/** How the other hand looks and plays as saved, each where still valid. */
function otherHandSettings(value: unknown): OtherHandSettings {
  const saved = savedObject<OtherHandSettings>(value)
  return {
    look: isOtherHandLook(saved.look) ? saved.look : DEFAULT_OTHER_HAND.look,
    play: typeof saved.play === 'boolean' ? saved.play : DEFAULT_OTHER_HAND.play,
  }
}

/** Each place's fold as saved where it is a boolean; a place never chosen stays unset. */
/** The palette's category: a name, or none chosen. */
const paletteCategory = (value: unknown): string | null =>
  typeof value === 'string' && value !== '' ? value : null

/** A trainer setting keeps what was saved; one never saved, or not valid, takes its default. */
function trainerSettings(value: unknown): TrainerSettings {
  const saved = savedObject<TrainerSettings>(value)
  return {
    autoNext: typeof saved.autoNext === 'boolean' ? saved.autoNext : DEFAULT_TRAINER.autoNext,
  }
}

/** The recorder's click and tune keep what was saved; one never saved, or not valid, takes its default. */
function recorderSettings(value: unknown): RecorderSettings {
  const saved = savedObject<RecorderSettings>(value)
  return {
    click: typeof saved.click === 'boolean' ? saved.click : DEFAULT_RECORDER.click,
    tune: typeof saved.tune === 'boolean' ? saved.tune : DEFAULT_RECORDER.tune,
    countIn: RECORDER_COUNT_INS.find((bars) => bars === saved.countIn) ?? DEFAULT_RECORDER.countIn,
  }
}

const isStartMode = isOneOf(EDITOR_START_MODES)
const isPaletteSide = isOneOf(PALETTE_SIDES)

/** The editor's preferences keep what was saved; one never saved, or not valid, takes its default. */
function editingSettings(value: unknown): EditingSettings {
  const saved = savedObject<EditingSettings>(value)
  return {
    hearNotes: typeof saved.hearNotes === 'boolean' ? saved.hearNotes : DEFAULT_EDITING.hearNotes,
    paletteSide: isPaletteSide(saved.paletteSide) ? saved.paletteSide : DEFAULT_EDITING.paletteSide,
  }
}

/** A keyboard's name: one a keyboard could have, else any keyboard. */
const deviceName = (value: unknown): string | null =>
  typeof value === 'string' && value.length > 0 && value.length <= DEVICE_NAME_MAX ? value : null

/** Each MIDI setting still one of its values stands; anything else takes its default. */
function midiSettings(value: unknown): MidiSettings {
  const saved = savedObject<MidiSettings>(value)
  return {
    input: typeof saved.input === 'boolean' ? saved.input : DEFAULT_MIDI.input,
    device: deviceName(saved.device),
    sound: typeof saved.sound === 'boolean' ? saved.sound : DEFAULT_MIDI.sound,
    throughPiano:
      typeof saved.throughPiano === 'boolean' ? saved.throughPiano : DEFAULT_MIDI.throughPiano,
    octaveShift: isOctaveShift(saved.octaveShift) ? saved.octaveShift : DEFAULT_MIDI.octaveShift,
    touch: isTouch(saved.touch) ? saved.touch : DEFAULT_MIDI.touch,
    pedal: isPedalWay(saved.pedal) ? saved.pedal : DEFAULT_MIDI.pedal,
  }
}

/** A chord remembered: its keys on the piano, each once, lowest first; none past two hands' worth. */
function rememberedChord(value: unknown): Midi[] {
  if (!Array.isArray(value) || value.length > CHORD_KEYS_MAX) return []
  return value.every((key) => typeof key === 'number') ? readKeyList(value.join('-')) : []
}

/** The Chord finder's switches keep what was saved; its chords keep each one still a chord's keys. */
function chordFinderSettings(value: unknown): ChordFinderSettings {
  const saved = savedObject<ChordFinderSettings>(value)
  const chords: unknown = saved.chords
  return {
    remember: typeof saved.remember === 'boolean' ? saved.remember : DEFAULT_CHORD_FINDER.remember,
    inKeys: typeof saved.inKeys === 'boolean' ? saved.inKeys : DEFAULT_CHORD_FINDER.inKeys,
    slash: typeof saved.slash === 'boolean' ? saved.slash : DEFAULT_CHORD_FINDER.slash,
    scale: saved.scale === true,
    chords: Array.isArray(chords)
      ? chords
          .map(rememberedChord)
          .filter((keys) => keys.length > 0)
          .slice(-REMEMBERED_CHORDS)
      : [],
  }
}

/** Progressions' choices as saved where each is still one of its values, the default otherwise. */
function progressionsSettings(value: unknown): ProgressionsSettings {
  const saved = savedObject<ProgressionsSettings>(value)
  return {
    names: isProgressionNames(saved.names) ? saved.names : DEFAULT_PROGRESSIONS.names,
    voicing: isProgressionVoicing(saved.voicing) ? saved.voicing : DEFAULT_PROGRESSIONS.voicing,
    inversion: isInversion(saved.inversion) ? saved.inversion : DEFAULT_PROGRESSIONS.inversion,
  }
}

/** The Chord player's choices as saved where each is still one of its values, the default otherwise. */
function chordPlayerSettings(value: unknown): ChordPlayerSettings {
  const saved = savedObject<ChordPlayerSettings>(value)
  return {
    names: isProgressionNames(saved.names) ? saved.names : DEFAULT_CHORD_PLAYER.names,
    voicing: isProgressionVoicing(saved.voicing) ? saved.voicing : DEFAULT_CHORD_PLAYER.voicing,
  }
}

const isSheetView = isOneOf(SHEET_VIEWS)

/**
 * The Player's view: the music's view, Diagrams' mode and Chords over lyrics' text size, each switch
 * and the layout as saved where still valid.
 */
function scoreViewSettings(value: unknown): ScoreViewSettings {
  const saved = savedObject<ScoreViewSettings>(value)
  const switched = (
    key: 'askOnOpen' | 'chordNames' | 'lyrics' | 'pinned' | 'keys' | 'annotations',
  ) => (typeof saved[key] === 'boolean' ? saved[key] : DEFAULT_SCORE_VIEW[key])
  return {
    layout: isSheetView(saved.layout) ? saved.layout : DEFAULT_SCORE_VIEW.layout,
    music: isMusicView(saved.music) ? saved.music : DEFAULT_SCORE_VIEW.music,
    diagrams: isDiagramsMode(saved.diagrams) ? saved.diagrams : DEFAULT_SCORE_VIEW.diagrams,
    askOnOpen: switched('askOnOpen'),
    chordNames: switched('chordNames'),
    lyrics: switched('lyrics'),
    pinned: switched('pinned'),
    textSize: isTextSize(saved.textSize) ? saved.textSize : DEFAULT_SCORE_VIEW.textSize,
    keys: switched('keys'),
    annotations: switched('annotations'),
  }
}

/** A tempo the Metronome keeps: whole beats a minute within its range. */
const isBpm = (value: unknown): value is number =>
  Number.isInteger(value) &&
  (value as number) >= BPM_RANGE.min &&
  (value as number) <= BPM_RANGE.max

/** The Metronome's tempo, meter, sound, beats, subdivision and trainers, each as saved where valid (A39). */
function metronomeSettings(value: unknown): MetronomeSettings {
  const saved = savedObject<MetronomeSettings>(value)
  const trainer = savedObject<MetronomeSettings['trainer']>(saved.trainer)
  const speed = savedObject<MetronomeSettings['speed']>(saved.speed)
  const initial = DEFAULT_METRONOME
  const meter = isMetronomeMeter(saved.meter) ? saved.meter : initial.meter
  const levels =
    Array.isArray(saved.levels) && saved.levels.length > 0 && saved.levels.every(isBeatLevel)
      ? saved.levels
      : null
  const tempo = (bpm: unknown, fallback: number) => (isBpm(bpm) ? bpm : fallback)
  const count = (n: unknown, fallback: number) =>
    typeof n === 'number' && Number.isInteger(n) && n >= 1 && n <= 32 ? n : fallback
  return {
    bpm: tempo(saved.bpm, initial.bpm),
    meter,
    sound: isMetronomeSound(saved.sound) ? saved.sound : initial.sound,
    // The squares as set, kept only for a meter of as many beats.
    levels: levels && levels.length === beatsOf(meter) ? levels : null,
    subdivision: isSubdivision(saved.subdivision) ? saved.subdivision : initial.subdivision,
    trainer: {
      on: typeof trainer.on === 'boolean' ? trainer.on : initial.trainer.on,
      play: isTrainerBars(trainer.play) ? trainer.play : initial.trainer.play,
      mute: isTrainerBars(trainer.mute) ? trainer.mute : initial.trainer.mute,
    },
    speed: {
      on: typeof speed.on === 'boolean' ? speed.on : initial.speed.on,
      from: tempo(speed.from, initial.speed.from),
      to: tempo(speed.to, initial.speed.to),
      step: count(speed.step, initial.speed.step),
      every: count(speed.every, initial.speed.every),
    },
  }
}

/** The sections folded: each an id a section could have, once; the newest kept. */
function foldedSections(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  const ids = value.filter(
    (id): id is string => typeof id === 'string' && id.length > 0 && id.length <= SECTION_ID_MAX,
  )
  return [...new Set(ids)].slice(-FOLDED_MAX)
}

/** Each saved choice that is still one of its values stands; anything else takes the current one. */
function keyboardSettings(value: unknown, current: KeyboardSettings): KeyboardSettings {
  const saved = savedObject<KeyboardSettings>(value)
  return {
    keySize: isKeySize(saved.keySize) ? saved.keySize : current.keySize,
    swipe: isSwipe(saved.swipe) ? saved.swipe : current.swipe,
    namedKeys: isNamedKeys(saved.namedKeys) ? saved.namedKeys : current.namedKeys,
    markNotes: typeof saved.markNotes === 'boolean' ? saved.markNotes : current.markNotes,
    chordNames: typeof saved.chordNames === 'boolean' ? saved.chordNames : current.chordNames,
    typing: typeof saved.typing === 'boolean' ? saved.typing : current.typing,
    autoplay: typeof saved.autoplay === 'boolean' ? saved.autoplay : current.autoplay,
    dock: isKeyDock(saved.dock) ? saved.dock : current.dock,
    folded: typeof saved.folded === 'boolean' ? saved.folded : current.folded,
    foldedLandscape:
      typeof saved.foldedLandscape === 'boolean' ? saved.foldedLandscape : current.foldedLandscape,
    keyLength: isKeyLength(saved.keyLength) ? saved.keyLength : current.keyLength,
    pedals: saved.pedals === 'all' || saved.pedals === 'sustain' ? saved.pedals : current.pedals,
  }
}

/**
 * Stored JSON is untrusted: the theme, language and keyboard keep each value still valid and take the
 * current one otherwise; a practice toggle or trainer setting not saved, or not valid, takes its
 * default.
 */
/** Each surface's bar as saved, where it reads within its limits (`normaliseBar`); else its default. */
function barsSettings(value: unknown): Bars {
  const saved = savedObject<Record<string, unknown>>(value)
  return Object.fromEntries(
    BAR_SURFACES.map((surface) => [surface, normaliseBar(surface, saved[surface])]),
  )
}

function sanitize(persisted: unknown, current: SettingsState): SettingsState {
  const saved = savedObject<SettingsState>(persisted)
  return {
    theme: isTheme(saved.theme) ? saved.theme : current.theme,
    locale: isLocale(saved.locale) ? saved.locale : current.locale,
    practice: practiceToggles(saved.practice),
    sound: soundSettings(saved.sound),
    trainer: trainerSettings(saved.trainer),
    keyboard: keyboardSettings(saved.keyboard, current.keyboard),
    recorder: recorderSettings(saved.recorder),
    editing: editingSettings(saved.editing),
    sidebar: isSidebar(saved.sidebar) ? saved.sidebar : current.sidebar,
    paletteFolded:
      typeof saved.paletteFolded === 'boolean' ? saved.paletteFolded : current.paletteFolded,
    paletteList: typeof saved.paletteList === 'boolean' ? saved.paletteList : current.paletteList,
    paletteCategory: paletteCategory(saved.paletteCategory),
    editorMode: isStartMode(saved.editorMode) ? saved.editorMode : current.editorMode,
    midi: midiSettings(saved.midi),
    chordFinder: chordFinderSettings(saved.chordFinder),
    scoreView: scoreViewSettings(saved.scoreView),
    otherHand: otherHandSettings(saved.otherHand),
    playback: playbackSettings(saved.playback),
    metronome: metronomeSettings(saved.metronome),
    foldedSections: foldedSections(saved.foldedSections),
    welcomed: saved.welcomed === true,
    practiceRecent: Array.isArray(saved.practiceRecent)
      ? [
          ...new Set(saved.practiceRecent.filter((id): id is string => typeof id === 'string')),
        ].slice(0, 8)
      : [],
    tipsSeen: Array.isArray(saved.tipsSeen)
      ? [...new Set(saved.tipsSeen.filter((id): id is string => typeof id === 'string'))].slice(
          0,
          64,
        )
      : [],
    lessonReading: isLessonReading(saved.lessonReading) ? saved.lessonReading : 'page',
    progressions: progressionsSettings(saved.progressions),
    chordPlayer: chordPlayerSettings(saved.chordPlayer),
    bars: barsSettings(saved.bars),
    tuner: tunerSettings(saved.tuner),
    scaleStaff: scaleStaffSettings(saved.scaleStaff),
  }
}

/** A whole number from `min` to `max`; null otherwise. */
const wholeWithin = (value: unknown, { min, max }: { min: number; max: number }): number | null =>
  typeof value === 'number' && Number.isInteger(value) && value >= min && value <= max
    ? value
    : null

/** The Tuner's A as saved, where it is a whole hertz within its range; 440 otherwise. */
function tunerSettings(value: unknown): TunerSettings {
  const saved = savedObject<TunerSettings>(value)
  return { a4: wholeWithin(saved.a4, A4_RANGE) ?? DEFAULT_TUNER.a4 }
}

/** The Scales staff's layers, each as saved where it is a switch's value. */
function scaleStaffSettings(value: unknown): ScaleStaffSettings {
  const saved = savedObject<ScaleStaffSettings>(value)
  const on = (key: keyof ScaleStaffSettings) =>
    typeof saved[key] === 'boolean' ? saved[key] : DEFAULT_SCALE_STAFF[key]
  return {
    degrees: on('degrees'),
    steps: on('steps'),
    tonic: on('tonic'),
    tetrachords: on('tetrachords'),
  }
}
