import { createStoreContext } from '@/shared/lib'
import type { PiecesState } from './store'

const context = createStoreContext<PiecesState>('Pieces')

export const PiecesStoreProvider = context.Provider
export const usePieces = context.useSelector
export const usePiecesStoreApi = context.useStoreApi
