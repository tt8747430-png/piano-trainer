import { useState } from 'react'
import { vi } from 'vitest'

/** What the app asks of `useRegisterSW`, as far as a test can see it. */
interface RegisterOptions {
  immediate?: boolean
  onRegisteredSW?: (url: string, registration: { update(): Promise<unknown> }) => void
}

/**
 * Test fake for vite-plugin-pwa's `virtual:pwa-register/react`, which exists only in a Vite build
 * (vite.config.ts aliases it here): a service worker registration whose waiting version each test
 * decides with `stubServiceWorker`, and which says how it was asked to register.
 */
const registration = {
  waiting: false,
  updateServiceWorker: vi.fn(async (_reloadPage?: boolean) => {}),
  worker: { update: vi.fn(async () => undefined) },
}
let registeredWith: RegisterOptions = {}

export function useRegisterSW(options: RegisterOptions = {}) {
  // Registers once, as the real hook does in its state's initialiser.
  useState(() => {
    registeredWith = options
    options.onRegisteredSW?.('/sw.js', registration.worker)
  })
  return {
    needRefresh: useState(registration.waiting),
    offlineReady: useState(false),
    updateServiceWorker: registration.updateServiceWorker,
  }
}

/** Whether a new version is waiting from the next render on; the setup makes it none per test. */
export function stubServiceWorker({ waiting }: { waiting: boolean }) {
  registration.waiting = waiting
  registration.updateServiceWorker = vi.fn(async (_reloadPage?: boolean) => {})
  registration.worker = { update: vi.fn(async () => undefined) }
  registeredWith = {}
  return {
    updateServiceWorker: registration.updateServiceWorker,
    update: registration.worker.update,
    registeredWith: () => registeredWith,
  }
}
