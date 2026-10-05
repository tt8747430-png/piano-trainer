import type { StoreApi } from 'zustand/vanilla'
import { isLocale } from '@/shared/i18n/locale'
import { createSavedStore, savedObject, type SavingOptions } from '@/shared/lib'
import {
  DEFAULT_PRACTICE,
  DEFAULT_RECORDER,
  DEFAULT_SIDEBAR,
  DEFAULT_TRAINER,
  PRACTICE_TOGGLES,
  defaultKeyboard,
  detectLocale,
  isKeySize,
  isNamedKeys,
  isSidebar,
  isSwipe,
  isTheme,
  type KeyboardSettings,
  type PracticeToggles,
  type RecorderSettings,
  type SettingsState,
  type TrainerSettings,
} from './types'

/** Read before first paint by index.html's #theme-boot script: keep the key and shape in step. */
export const SETTINGS_STORAGE_KEY = 'pt-settings'
export const SETTINGS_VERSION = 8

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

/** The recorder's click keeps what was saved; one never saved, or not valid, takes its default. */
function recorderSettings(value: unknown): RecorderSettings {
  const saved = savedObject<RecorderSettings>(value)
  return { click: typeof saved.click === 'boolean' ? saved.click : DEFAULT_RECORDER.click }
}

/** Each saved choice that is still one of its values stands; anything else takes the current one. */
function keyboardSettings(value: unknown, current: KeyboardSettings): KeyboardSettings {
  const saved = savedObject<KeyboardSettings>(value)
  return {
    keySize: isKeySize(saved.keySize) ? saved.keySize : current.keySize,
    swipe: isSwipe(saved.swipe) ? saved.swipe : current.swipe,
    namedKeys: isNamedKeys(saved.namedKeys) ? saved.namedKeys : current.namedKeys,
    map: typeof saved.map === 'boolean' ? saved.map : current.map,
    typing: typeof saved.typing === 'boolean' ? saved.typing : current.typing,
  }
}

/**
 * Stored JSON is untrusted: the theme, language and keyboard keep each value still valid and take the
 * current one otherwise; a practice toggle or trainer setting not saved, or not valid, takes its
 * default. A version-1 save has no practice fields, a version-2 save no keyboard, a version-3 save no
 * recording toggle, a version-4 save no named notes, a version-5 save no trainer settings (its quiz
 * choice is what a trainer's URL now holds, and is not read), a version-6 save no recorder, a version-7
 * save no sidebar: each gains its defaults here.
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
  }
}
