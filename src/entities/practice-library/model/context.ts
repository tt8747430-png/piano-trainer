import { createStoreContext } from '@/shared/lib'
import type { PracticeLibraryState } from './store'

const context = createStoreContext<PracticeLibraryState>('PracticeLibrary')

export const PracticeLibraryStoreProvider = context.Provider
export const usePracticeLibrary = context.useSelector
export const usePracticeLibraryStoreApi = context.useStoreApi
