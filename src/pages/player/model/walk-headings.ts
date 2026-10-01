import { walkKeys, type Key, type KeyWalk } from '@/shared/lib/music'

/** A walk of keys' sections, by section: each key's name at its first bar. */
export const walkHeadings = (
  home: Key,
  walk: KeyWalk,
  keyName: (key: Key) => string,
): readonly string[] => walkKeys(home, walk).map(keyName)
