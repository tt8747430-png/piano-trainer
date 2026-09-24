import { createStoreContext } from '@/shared/lib'
import type { SettingsState } from './types'

const context = createStoreContext<SettingsState>('Settings')

export const SettingsStoreProvider = context.Provider
export const useSettings = context.useSelector
export const useSettingsStoreApi = context.useStoreApi
