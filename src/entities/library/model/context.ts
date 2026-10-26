import { createStoreContext } from '@/shared/lib'
import type { LibraryState } from './store'

const context = createStoreContext<LibraryState>('Library')

export const LibraryStoreProvider = context.Provider
export const useLibrary = context.useSelector
export const useLibraryStoreApi = context.useStoreApi
