/** A set of listeners to call with each new value; subscribing returns the unsubscribe. */
export function createListeners<T>() {
  const listeners = new Set<(value: T) => void>()
  return {
    add(listener: (value: T) => void): () => void {
      listeners.add(listener)
      return () => {
        listeners.delete(listener)
      }
    },
    emit(value: T): void {
      for (const listener of listeners) listener(value)
    },
  }
}
