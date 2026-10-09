import { createContext } from 'react'
import type { ShortcutRegistry } from './registry'

/** The screen's shortcuts and whose keyboard prints them; null outside a `ShortcutsProvider`. */
export const ShortcutsContext = createContext<{
  readonly registry: ShortcutRegistry
  readonly mac: boolean
} | null>(null)
