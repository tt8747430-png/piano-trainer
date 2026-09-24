import { createJSONStorage, persist } from 'zustand/middleware'
import { createStore, type StoreApi } from 'zustand/vanilla'
import { safeLocalStorage } from '@/shared/lib'
import { detectLocale, isLocale, isTheme, type SettingsState } from './types'

/** Read before first paint by index.html's #theme-boot script: keep the key and shape in step. */
export const SETTINGS_STORAGE_KEY = 'pt-settings'
export const SETTINGS_VERSION = 1

export type SettingsStore = StoreApi<SettingsState>

export function createSettingsStore({
  storage = safeLocalStorage(),
  languages = navigator.languages,
}: { storage?: Storage; languages?: readonly string[] } = {}): SettingsStore {
  const initial: SettingsState = { theme: 'system', locale: detectLocale(languages) }
  return createStore<SettingsState>()(
    persist(() => initial, {
      name: SETTINGS_STORAGE_KEY,
      version: SETTINGS_VERSION,
      storage: createJSONStorage(() => storage),
      // Every earlier shape is sanitised field by field in `merge`, so migrating is passing it on.
      migrate: (persisted) => persisted as SettingsState,
      merge: (persisted, current) => sanitize(persisted, current),
    }),
  )
}

/** Stored JSON is untrusted: keep each field that is still valid, and the current value otherwise. */
function sanitize(persisted: unknown, current: SettingsState): SettingsState {
  const saved = (typeof persisted === 'object' && persisted !== null ? persisted : {}) as Partial<
    Record<keyof SettingsState, unknown>
  >
  return {
    theme: isTheme(saved.theme) ? saved.theme : current.theme,
    locale: isLocale(saved.locale) ? saved.locale : current.locale,
  }
}
