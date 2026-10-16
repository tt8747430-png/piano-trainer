import { createContext, useContext } from 'react'

/** Where a screen's floating actions stand along its foot. */
export type FloatingPlace = 'left' | 'center' | 'right'

export interface Floating {
  /** The column they stand in; none until the host has drawn it. */
  readonly column: HTMLElement | null
  readonly place: FloatingPlace
  /** Each says its name beside its icon; else the name is its tooltip and its screen reader's. */
  readonly labels: boolean
}

export const FloatingContext = createContext<Floating>({
  column: null,
  place: 'right',
  labels: true,
})

/** Whether the floating actions say their names beside their icons. */
export const useFloatingLabels = (): boolean => useContext(FloatingContext).labels
