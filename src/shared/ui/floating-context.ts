import { createContext } from 'react'

export interface Floating {
  /** The column they stand in; none until the host has drawn it. */
  readonly column: HTMLElement | null
}

export const FloatingContext = createContext<Floating>({ column: null })
