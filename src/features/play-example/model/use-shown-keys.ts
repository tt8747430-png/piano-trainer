import { useState } from 'react'
import type { ShownKeys } from '@/shared/ui'

/**
 * What a page's keyboard shows: the example played last, else `fallback`. What was played is
 * forgotten for good when `context` (the root, the chord, the key) changes: it no longer stands on
 * these keys.
 */
export function useShownKeys(
  context: string,
  fallback: ShownKeys,
): readonly [ShownKeys, (shown: ShownKeys) => void] {
  const [played, setPlayed] = useState<ShownKeys | null>(null)
  const [shownIn, setShownIn] = useState(context)
  // A new context forgets while rendering, so no frame shows the old example on the new keys.
  if (shownIn !== context) {
    setShownIn(context)
    setPlayed(null)
  }
  return [played ?? fallback, setPlayed]
}
