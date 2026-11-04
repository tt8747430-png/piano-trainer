import { createStoreContext } from '@/shared/lib'
import type { ChordSheetsState } from './store'

const context = createStoreContext<ChordSheetsState>('ChordSheets')

export const ChordSheetsStoreProvider = context.Provider
export const useChordSheets = context.useSelector
export const useChordSheetsStoreApi = context.useStoreApi
