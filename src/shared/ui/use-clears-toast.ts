import { useEffect } from 'react'
import { toast } from './primitives/toast'

/**
 * A layer that rises over a phone's foot, where a toast stands (a bottom sheet, the Chord player's ☰): the
 * toast goes as it rises, its word said and its Undo now about a screen behind the layer, as the boards draw it.
 */
export function useClearsToast(rising: boolean) {
  useEffect(() => {
    if (rising) toast.close()
  }, [rising])
}
