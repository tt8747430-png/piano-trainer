import { createContext } from 'react'
import type { MenuAction } from '@/shared/ui'

/**
 * A piece's place in the learner's library, first in the Player's More (ADR 0103): Add to favourites
 * and Add to setlist. Its page hands them round the layout the bar's More is drawn in; a walk, a
 * progression or an exercise has none.
 */
export const MoreActions = createContext<readonly MenuAction[]>([])
