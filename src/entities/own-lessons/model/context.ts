import { createStoreContext } from '@/shared/lib'
import type { OwnLessonsState } from './store'

const context = createStoreContext<OwnLessonsState>('OwnLessons')

export const OwnLessonsStoreProvider = context.Provider
export const useOwnLessons = context.useSelector
export const useOwnLessonsStoreApi = context.useStoreApi
