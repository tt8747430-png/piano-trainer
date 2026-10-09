import { matches, type Combo, type KeyPress } from './combo'

/**
 * A shortcut a screen binds: what it does, its keys and what they run; or one only listed, its keys
 * handled elsewhere (the piano's typing keys), shown as the caps `shown` names.
 */
export type Shortcut =
  | {
      readonly label: string
      readonly combo: Combo
      /** Held down, it runs again and again (a tempo stepped). */
      readonly repeat?: boolean
      /** Bound, but not a row of its own: listed by another row (each of 1–9 by one). */
      readonly hidden?: boolean
      run(): void
    }
  | { readonly label: string; readonly shown: readonly string[] }

export const isBound = (shortcut: Shortcut): shortcut is Extract<Shortcut, { combo: Combo }> =>
  'combo' in shortcut

/** Whose shortcuts a group is: the screen's, the piano's on it, or the app's everywhere. */
export type ShortcutScope = 'screen' | 'piano' | 'app'

/** A screen's shortcuts under their name, as the sheet lists them. */
export interface ShortcutGroup {
  readonly name: string
  readonly scope: ShortcutScope
  /** The shortcuts as the screen last rendered them. */
  shortcuts(): readonly Shortcut[]
}

/** Every group of shortcuts on the screen: who binds what, for the one listener and for the sheet. */
export interface ShortcutRegistry {
  /** Adds a group; the returned function removes it. */
  add(group: ShortcutGroup): () => void
  /** The bound shortcut a key press runs: of the group added last, the first that matches. */
  find(press: KeyPress, mac: boolean): Extract<Shortcut, { combo: Combo }> | null
  groups(): readonly ShortcutGroup[]
  subscribe(listener: () => void): () => void
}

export function createShortcutRegistry(): ShortcutRegistry {
  let groups: readonly ShortcutGroup[] = []
  const listeners = new Set<() => void>()
  const set = (next: readonly ShortcutGroup[]) => {
    groups = next
    for (const listener of listeners) listener()
  }
  return {
    add(group) {
      set([...groups, group])
      return () => set(groups.filter((other) => other !== group))
    },
    find(press, mac) {
      for (const group of groups.toReversed()) {
        for (const shortcut of group.shortcuts()) {
          if (isBound(shortcut) && matches(press, shortcut.combo, mac)) return shortcut
        }
      }
      return null
    },
    groups: () => groups,
    subscribe(listener) {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
  }
}
