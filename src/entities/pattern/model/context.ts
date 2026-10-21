import { createStoreContext } from '@/shared/lib'
import type { PatternsState } from './store'

const context = createStoreContext<PatternsState>('Patterns')

export const PatternsStoreProvider = context.Provider
export const usePatterns = context.useSelector
export const usePatternsStoreApi = context.useStoreApi
