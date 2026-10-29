import { useSyncExternalStore } from 'react'

const subscribe = (listener: () => void) => {
  window.addEventListener('online', listener)
  window.addEventListener('offline', listener)
  return () => {
    window.removeEventListener('online', listener)
    window.removeEventListener('offline', listener)
  }
}

/** Whether the device has a connection, followed as it comes and goes: a form that needs the server waits on it. */
export const useOnline = (): boolean => useSyncExternalStore(subscribe, () => navigator.onLine)
