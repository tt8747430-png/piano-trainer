import type { EventPattern, Pattern } from '@/shared/lib/arrangement'
import { LEFT_FIGURES, RIGHT_FIGURES } from '../content/figures'
import type { LeftFigureId, RightFigureId } from './types'

/** What a pattern that plays the tune plays, both hands, on a piece with no melody: Harmonic figuration (r4). */
const WITHOUT_MELODY: EventPattern = {
  id: 'r4',
  rh: RIGHT_FIGURES.r4.figure,
  lh: LEFT_FIGURES.fig.figure,
}

/** The pattern `arrange` plays for a figure in each hand, under `id`. */
export function figurePattern(id: string, rh: RightFigureId, lh: LeftFigureId): Pattern {
  const right = RIGHT_FIGURES[rh].figure
  const left = LEFT_FIGURES[lh].figure
  return right.kind === 'events'
    ? { id, rh: right, lh: left }
    : { id, rh: right, lh: left, withoutMelody: WITHOUT_MELODY }
}
