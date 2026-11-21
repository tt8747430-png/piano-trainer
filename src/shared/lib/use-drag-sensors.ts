import { useMemo } from 'react'
import {
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type KeyboardCodes,
} from '@dnd-kit/core'
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable'

/**
 * How a drag starts, the same in every list (Apple HIG, Drag and drop): a mouse after it moves 8px,
 * a finger after it holds still 250ms (5px of wobble allowed, so a scroll is never a drag), the
 * keyboard from its handle. `keys` changes the keys that lift and drop (the Chord player's Space), a constant.
 */
/** The mouse's and the finger's thresholds, held for good: new options would make new sensors. */
const MOUSE = { activationConstraint: { distance: 8 } }
const TOUCH = { activationConstraint: { delay: 250, tolerance: 5 } }

export function useDragSensors(keys?: KeyboardCodes) {
  // Held while `keys` is the same: a list's sensors stay one value from render to render, so
  // what reads the drag (every sortable row) renders again only for a drag.
  const keyboard = useMemo(
    () => ({
      coordinateGetter: sortableKeyboardCoordinates,
      ...(keys ? { keyboardCodes: keys } : {}),
    }),
    [keys],
  )
  return useSensors(
    useSensor(MouseSensor, MOUSE),
    useSensor(TouchSensor, TOUCH),
    useSensor(KeyboardSensor, keyboard),
  )
}
