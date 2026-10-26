import { createContext } from 'react'
import type { MenuAction } from '@/shared/ui'

/**
 * A piece's place in the learner's library, first in the Player's More (ADR 0106): Add to favourites,
 * Move to… and Archive (Restore while archived). Its page hands them round the layout the bar's More
 * is drawn in; a study, a walk, a progression or an exercise has none.
 */
export const MoreActions = createContext<readonly MenuAction[]>([])
