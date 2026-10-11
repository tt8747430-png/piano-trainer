/** The channel open tabs hear a restore on. */
const CHANNEL = 'piano-trainer-restore'
const RESTORED = 'restored'

/**
 * Tells the other open tabs a backup was restored: each opens again over it, or its stores, still
 * holding what was there, would write it back with their next save.
 */
export function announceRestore(): void {
  if (typeof BroadcastChannel === 'undefined') return
  const channel = new BroadcastChannel(CHANNEL)
  channel.postMessage(RESTORED)
  channel.close()
}

/** Hears a restore in another tab; returns the function that stops listening. */
export function onRestoreElsewhere(listener: () => void): () => void {
  if (typeof BroadcastChannel === 'undefined') return () => {}
  const channel = new BroadcastChannel(CHANNEL)
  channel.onmessage = (event) => {
    if (event.data === RESTORED) listener()
  }
  return () => channel.close()
}
