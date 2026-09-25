import { createStoreContext } from '@/shared/lib'
import type { ProgressState } from './types'

const context = createStoreContext<ProgressState>('Progress')

export const ProgressStoreProvider = context.Provider
export const useProgress = context.useSelector
export const useProgressStoreApi = context.useStoreApi
