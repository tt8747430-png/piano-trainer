import type { StoreApi } from 'zustand/vanilla'
import { isLocale } from '@/shared/i18n/locale'
import { isStaffId } from '@/shared/lib/notation'
import {
  createSavedStore,
  isOneOf,
  railControls,
  SHEET_VIEWS,
  readKeyList,
  savedObject,
  type SavingOptions,
} from '@/shared/lib'
import type { Midi } from '@/shared/lib/music'
import { BPM_RANGE } from '@/shared/lib/schedule'
import {
  CHORD_KEYS_MAX,
  DEFAULT_CHORD_FINDER,
  DEFAULT_METRONOME,
  DEFAULT_MIDI,
  DEFAULT_SCORE_VIEW,
  DEFAULT_PRACTICE,
  DEFAULT_RECORDER,
  DEFAULT_SIDEBAR,
  DEFAULT_SOUND,
  DEFAULT_TRAINER,
  DEFAULT_FLOATING,
  DEVICE_NAME_MAX,
  FOLDED_MAX,
  SECTION_ID_MAX,
  PRACTICE_TOGGLES,
  REMEMBERED_CHORDS,
  SOUND_PARTS,
  defaultKeyboard,
  detectLocale,
  isFloatingPlace,
  isKeyDock,
  isKeyLength,
  isDiagramsMode,
  isTextSize,
  isKeySize,
  isMetronomeMeter,
  isMetronomeSound,
  isMusicView,
  isNamedKeys,
  isOctaveShift,
  isPedalWay,
  isSidebar,
  PALETTE_PLACES,
  isSwipe,
  isTheme,
  isTitleSize,
  isTouch,
  type ChordFinderSettings,
  type KeyboardSettings,
  type MetronomeSettings,
  type MidiSettings,
  type PaletteFolds,
  type PracticeToggles,
  type RecorderSettings,
  type ScoreViewSettings,
  type SettingsState,
  type SoundSettings,
  type FloatingSettings,
  type TrainerSettings,
} from './types'

/** Read before first paint by index.html's #theme-boot script: keep the key and shape in step. */
export const SETTINGS_STORAGE_KEY = 'pt-settings'
export const SETTINGS_VERSION = 14

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
        titles: 'large',
        locale: detectLocale(languages),
        practice: DEFAULT_PRACTICE,
        sound: DEFAULT_SOUND,
        trainer: DEFAULT_TRAINER,
        floating: DEFAULT_FLOATING,
        keyboard: defaultKeyboard(finePointer),
        recorder: DEFAULT_RECORDER,
        sidebar: DEFAULT_SIDEBAR,
        paletteFolded: {},
        midi: DEFAULT_MIDI,
        chordFinder: DEFAULT_CHORD_FINDER,
        scoreView: DEFAULT_SCORE_VIEW,
        metronome: DEFAULT_METRONOME,
        foldedSections: [],
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

/** Each part's volume as saved where it is one, at full otherwise. */
function soundSettings(value: unknown): SoundSettings {
  const saved = savedObject<SoundSettings>(value)
  return Object.fromEntries(
    SOUND_PARTS.map((part) => {
      const kept: unknown = saved[part]
      return [part, isVolume(kept) ? kept : DEFAULT_SOUND[part]]
    }),
  ) as Record<keyof SoundSettings, number>
}

/** Where the floating actions stand and whether they say their names, each as saved where valid. */
function floatingSettings(value: unknown): FloatingSettings {
  const saved = savedObject<FloatingSettings>(value)
  return {
    place: isFloatingPlace(saved.place) ? saved.place : DEFAULT_FLOATING.place,
    labels: typeof saved.labels === 'boolean' ? saved.labels : DEFAULT_FLOATING.labels,
  }
}

/** Each place's fold as saved where it is a boolean; a place never chosen stays unset. */
function paletteFolds(value: unknown): PaletteFolds {
  const saved = savedObject<PaletteFolds>(value)
  return Object.fromEntries(
    PALETTE_PLACES.flatMap((place) => {
      const folded: unknown = saved[place]
      return typeof folded === 'boolean' ? [[place, folded]] : []
    }),
  )
}

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
  }
}

/** A keyboard's name: one a keyboard could have, else any keyboard. */
const deviceName = (value: unknown): string | null =>
  typeof value === 'string' && value.length > 0 && value.length <= DEVICE_NAME_MAX ? value : null

/** Each MIDI setting still one of its values stands; anything else takes its default. */
function midiSettings(value: unknown): MidiSettings {
  const saved = savedObject<MidiSettings>(value)
  return {
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
    chords: Array.isArray(chords)
      ? chords
          .map(rememberedChord)
          .filter((keys) => keys.length > 0)
          .slice(-REMEMBERED_CHORDS)
      : [],
  }
}

const isSheetView = isOneOf(SHEET_VIEWS)

/**
 * The Player's view: the music's view, Diagrams' mode and Chords over lyrics' text size, each switch
 * and the layout as saved where still valid, the staves hidden each once.
 */
function scoreViewSettings(value: unknown): ScoreViewSettings {
  const saved = savedObject<ScoreViewSettings>(value)
  const switched = (key: 'askOnOpen' | 'chordNames' | 'lyrics' | 'pinned' | 'keys') =>
    typeof saved[key] === 'boolean' ? saved[key] : DEFAULT_SCORE_VIEW[key]
  const hidden: unknown = saved.hidden
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
    hidden: Array.isArray(hidden) ? [...new Set(hidden.filter(isStaffId))] : [],
  }
}

/** A tempo the Metronome keeps: whole beats a minute within its range. */
const isBpm = (value: unknown): value is number =>
  Number.isInteger(value) &&
  (value as number) >= BPM_RANGE.min &&
  (value as number) <= BPM_RANGE.max

/** The Metronome's tempo, meter and sound, each as saved where still valid (ADR 0113). */
function metronomeSettings(value: unknown): MetronomeSettings {
  const saved = savedObject<MetronomeSettings>(value)
  return {
    bpm: isBpm(saved.bpm) ? saved.bpm : DEFAULT_METRONOME.bpm,
    meter: isMetronomeMeter(saved.meter) ? saved.meter : DEFAULT_METRONOME.meter,
    sound: isMetronomeSound(saved.sound) ? saved.sound : DEFAULT_METRONOME.sound,
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
    dock: isKeyDock(saved.dock) ? saved.dock : current.dock,
    folded: typeof saved.folded === 'boolean' ? saved.folded : current.folded,
    foldedLandscape:
      typeof saved.foldedLandscape === 'boolean' ? saved.foldedLandscape : current.foldedLandscape,
    keyLength: isKeyLength(saved.keyLength) ? saved.keyLength : current.keyLength,
    railControls: railControls(saved.railControls, current.railControls),
  }
}

/**
 * Stored JSON is untrusted: the theme, language and keyboard keep each value still valid and take the
 * current one otherwise; a practice toggle or trainer setting not saved, or not valid, takes its
 * default.
 */
function sanitize(persisted: unknown, current: SettingsState): SettingsState {
  const saved = savedObject<SettingsState>(persisted)
  return {
    theme: isTheme(saved.theme) ? saved.theme : current.theme,
    titles: isTitleSize(saved.titles) ? saved.titles : current.titles,
    locale: isLocale(saved.locale) ? saved.locale : current.locale,
    practice: practiceToggles(saved.practice),
    sound: soundSettings(saved.sound),
    trainer: trainerSettings(saved.trainer),
    floating: floatingSettings(saved.floating),
    keyboard: keyboardSettings(saved.keyboard, current.keyboard),
    recorder: recorderSettings(saved.recorder),
    sidebar: isSidebar(saved.sidebar) ? saved.sidebar : current.sidebar,
    paletteFolded: paletteFolds(saved.paletteFolded),
    midi: midiSettings(saved.midi),
    chordFinder: chordFinderSettings(saved.chordFinder),
    scoreView: scoreViewSettings(saved.scoreView),
    metronome: metronomeSettings(saved.metronome),
    foldedSections: foldedSections(saved.foldedSections),
  }
}
