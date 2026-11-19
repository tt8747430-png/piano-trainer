import { useMediaQuery } from '@/shared/lib'
import { useSettings } from './context'
import { selectScoreView } from './selectors'
import type { GridBars } from './types'

/** From a phone on its side, a tablet or a laptop: four bars a row, as PlayerDesk draws them. */
const WIDER = '(min-width: 40rem)'

/**
 * The Grid's bars a row (Bars per row): the learner's choice, else the screen's, two on a phone held
 * upright and four from 640px, as PlayerViewGrid and PlayerDesk draw them.
 */
export function useGridBars(): GridBars {
  const chosen = useSettings((state) => selectScoreView(state).gridBars)
  const wider = useMediaQuery(WIDER)
  return chosen ?? (wider ? 4 : 2)
}
