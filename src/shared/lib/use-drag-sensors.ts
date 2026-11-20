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
 * keyboard from its handle. `keys` changes the keys that lift and drop (the Chord player's Space).
 */
export function useDragSensors(keys?: KeyboardCodes) {
  return useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
      ...(keys ? { keyboardCodes: keys } : {}),
    }),
  )
}
