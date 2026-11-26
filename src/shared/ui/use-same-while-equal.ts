import { useState } from 'react'

/**
 * The value as first given while each new one is equal to it (the same JSON), so an effect or a
 * memo over it runs again only when it changes, not for each new object of the same value.
 */
export function useSameWhileEqual<T>(value: T): T {
  const key = JSON.stringify(value)
  const [held, setHeld] = useState({ key, value })
  if (held.key === key) return held.value
  setHeld({ key, value })
  return value
}
