import { createContext } from 'react'
import type { MenuAction } from '@/shared/ui'

/**
 * A piece's place in the learner's library, first among the acts in the Player's Settings (ADR
 * 0106): Add to favourites, Move to… and Archive (Restore while archived). Its page hands them round the layout the Settings
 * is drawn in; a study, a walk, a progression or an exercise has none.
 */
export const MoreActions = createContext<readonly MenuAction[]>([])
