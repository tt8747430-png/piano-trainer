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

/** A group as the sheet lists it: each row's name and its keycaps. */
export interface ListedShortcuts {
  readonly name: string
  readonly rows: readonly { readonly label: string; readonly keys: readonly string[] }[]
}

const SCOPES: readonly ShortcutScope[] = ['screen', 'piano', 'app']

/**
 * The shortcuts on screen, for the sheet: the screen's groups first, then the piano's, then the
 * app's; a group bound twice (two keyboards on a screen) listed once.
 */
export function useListedShortcuts(): readonly ListedShortcuts[] {
  const shortcuts = use(ShortcutsContext)
  const groups = useSyncExternalStore(
    shortcuts?.registry.subscribe ?? NEVER,
    shortcuts?.registry.groups ?? (() => NO_GROUPS),
  )
  const mac = shortcuts?.mac ?? false
  const names = new Set<string>()
  return SCOPES.flatMap((scope) =>
    groups
      .filter((group) => group.scope === scope)
      .filter((group) => !names.has(group.name) && names.add(group.name))
      .map((group) => ({
        name: group.name,
        rows: group
          .shortcuts()
          .filter((shortcut) => !isBound(shortcut) || !shortcut.hidden)
          .map((shortcut) => ({
            label: shortcut.label,
            keys: isBound(shortcut) ? comboKeys(shortcut.combo, mac) : shortcut.shown,
          })),
      })),
  )
}
