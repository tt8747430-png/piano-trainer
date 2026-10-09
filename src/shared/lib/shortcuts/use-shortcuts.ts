import { use, useEffect, useLayoutEffect, useRef, useSyncExternalStore } from 'react'
import { comboKeys } from './combo'
import { isBound, type Shortcut, type ShortcutGroup, type ShortcutScope } from './registry'
import { ShortcutsContext } from './shortcuts-context'

const NO_GROUPS: readonly ShortcutGroup[] = []
const NEVER = () => () => {}

/**
 * Binds a screen's shortcuts under `name` while it is on screen (and `enabled`): each key runs what
 * the screen last rendered for it, and the sheet lists them. Outside a `ShortcutsProvider` nothing is
 * bound.
 */
export function useShortcuts(
  name: string,
  shortcuts: readonly Shortcut[],
  { enabled = true, scope = 'screen' }: { enabled?: boolean; scope?: ShortcutScope } = {},
): void {
  const registry = use(ShortcutsContext)?.registry
  const latest = useRef(shortcuts)
  useLayoutEffect(() => {
    latest.current = shortcuts
  })
  // What the sheet lists: it hears of a change of names or keys, never of a new closure.
  const listed = JSON.stringify(
    shortcuts.map((shortcut) => [
      shortcut.label,
      isBound(shortcut) ? shortcut.combo : shortcut.shown,
    ]),
  )
  useEffect(() => {
    if (!enabled || !registry) return
    return registry.add({ name, scope, shortcuts: () => latest.current })
  }, [registry, enabled, name, scope, listed])
}

/** Whether the keyboard is a Mac's, for a hint that names a key: Cmd or Ctrl. */
export const useShortcutsPlatform = (): boolean => use(ShortcutsContext)?.mac ?? false

/** A group as the sheet lists it: each row's name and its keycaps. */
export interface ListedShortcuts {
  readonly name: string
  readonly rows: readonly { readonly label: string; readonly keys: readonly string[] }[]
}

const SCOPES: readonly ShortcutScope[] = ['screen', 'piano', 'app']

/**
 * The shortcuts on screen, for the sheet: the screen's groups first, then the piano's, then the
 * app's. Groups of one name are one group (the app's keys are bound by its navigation and by its
 * sheet), and a row bound twice (two keyboards on a screen) is listed once.
 */
export function useListedShortcuts(): readonly ListedShortcuts[] {
  const shortcuts = use(ShortcutsContext)
  const groups = useSyncExternalStore(
    shortcuts?.registry.subscribe ?? NEVER,
    shortcuts?.registry.groups ?? (() => NO_GROUPS),
  )
  const mac = shortcuts?.mac ?? false
  const listed = new Map<string, Map<string, readonly string[]>>()
  for (const scope of SCOPES) {
    for (const group of groups.filter((other) => other.scope === scope)) {
      const rows = listed.get(group.name) ?? new Map<string, readonly string[]>()
      for (const shortcut of group.shortcuts()) {
        if (!isBound(shortcut)) rows.set(shortcut.label, shortcut.shown)
        else if (!shortcut.hidden) rows.set(shortcut.label, comboKeys(shortcut.combo, mac))
      }
      listed.set(group.name, rows)
    }
  }
  return [...listed].map(([name, rows]) => ({
    name,
    rows: [...rows].map(([label, keys]) => ({ label, keys })),
  }))
}
