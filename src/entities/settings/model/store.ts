import type { StoreApi } from 'zustand/vanilla'
import { isLocale } from '@/shared/i18n/locale'
import { createSavedStore, savedObject, type SavingOptions } from '@/shared/lib'
import {
  DEFAULT_MIDI,
  DEFAULT_PRACTICE,
  DEFAULT_RECORDER,
  DEFAULT_SIDEBAR,
  DEFAULT_TRAINER,
  DEVICE_NAME_MAX,
  PRACTICE_TOGGLES,
  defaultKeyboard,
  detectLocale,
  isKeySize,
  isNamedKeys,
  isOctaveShift,
  isPedalWay,
  isSidebar,
  isSwipe,
  isTheme,
  isTouch,
  type KeyboardSettings,
  type MidiSettings,
  type PracticeToggles,
  type RecorderSettings,
  type SettingsState,
  type TrainerSettings,
} from './types'

/** Read before first paint by index.html's #theme-boot script: keep the key and shape in step. */
export const SETTINGS_STORAGE_KEY = 'pt-settings'
export const SETTINGS_VERSION = 11

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
        trainer: DEFAULT_TRAINER,
        keyboard: defaultKeyboard(finePointer),
        recorder: DEFAULT_RECORDER,
        sidebar: DEFAULT_SIDEBAR,
        midi: DEFAULT_MIDI,
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

/** Each saved choice that is still one of its values stands; anything else takes the current one. */
function keyboardSettings(value: unknown, current: KeyboardSettings): KeyboardSettings {
  const saved = savedObject<KeyboardSettings>(value)
  return {
    keySize: isKeySize(saved.keySize) ? saved.keySize : current.keySize,
    swipe: isSwipe(saved.swipe) ? saved.swipe : current.swipe,
    namedKeys: isNamedKeys(saved.namedKeys) ? saved.namedKeys : current.namedKeys,
    chordNames: typeof saved.chordNames === 'boolean' ? saved.chordNames : current.chordNames,
    typing: typeof saved.typing === 'boolean' ? saved.typing : current.typing,
  }
}

/**
 * Stored JSON is untrusted: the theme, language and keyboard keep each value still valid and take the
 * current one otherwise; a practice toggle or trainer setting not saved, or not valid, takes its
 * default. A version-1 save has no practice fields, a version-2 save no keyboard, a version-3 save no
 * recording toggle, a version-4 save no named notes, a version-5 save no trainer settings (its quiz
 * choice is what a trainer's URL now holds, and is not read), a version-6 save no recorder, a version-7
 * save no sidebar, a version-8 save no MIDI settings and no tune: each gains its defaults here. A
 * version-9 save's keyboard map is not read: the map is the rail's own, wherever the keys scroll. A
 * version-10 save has no chord names: the chords played are named until the learner says not.
 */
function sanitize(persisted: unknown, current: SettingsState): SettingsState {
  const saved = savedObject<SettingsState>(persisted)
  return {
    theme: isTheme(saved.theme) ? saved.theme : current.theme,
    locale: isLocale(saved.locale) ? saved.locale : current.locale,
    practice: practiceToggles(saved.practice),
    trainer: trainerSettings(saved.trainer),
    keyboard: keyboardSettings(saved.keyboard, current.keyboard),
    recorder: recorderSettings(saved.recorder),
    sidebar: isSidebar(saved.sidebar) ? saved.sidebar : current.sidebar,
    midi: midiSettings(saved.midi),
  }
}
