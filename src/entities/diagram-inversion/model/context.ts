import { createStoreContext } from '@/shared/lib'
import type { DiagramInversionsState } from './store'

const context = createStoreContext<DiagramInversionsState>('DiagramInversions')

export const DiagramInversionsStoreProvider = context.Provider
export const useDiagramInversions = context.useSelector
export const useDiagramInversionsStoreApi = context.useStoreApi
