import { createStoreContext } from '@/shared/lib'
import type { PageLayoutsState } from './store'

const context = createStoreContext<PageLayoutsState>('PageLayouts')

export const PageLayoutsStoreProvider = context.Provider
export const usePageLayouts = context.useSelector
export const usePageLayoutsStoreApi = context.useStoreApi
