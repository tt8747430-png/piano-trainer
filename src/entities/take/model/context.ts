import { createStoreContext } from '@/shared/lib'
import type { TakesState } from './store'

const context = createStoreContext<TakesState>('Takes')

export const TakesStoreProvider = context.Provider
export const useTakes = context.useSelector
export const useTakesStoreApi = context.useStoreApi
