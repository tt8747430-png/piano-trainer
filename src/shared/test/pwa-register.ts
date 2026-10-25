import { useState } from 'react'
import { vi } from 'vitest'
import { heardUntil, untilTestEnds } from './listeners'

/** What the app asks of `useRegisterSW`, as far as a test can see it. */
interface RegisterOptions {
  immediate?: boolean
  onRegisteredSW?: (url: string, registration: { update(): Promise<unknown> }) => void
  onNeedReload?: () => void
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
  // Registers once, as the real hook does in its state's initialiser. What the app then sets
  // listening on the page (a look for a new version on each return) stops once the test is over,
  // as a closed page's would: the document outlives every test of a worker.
  useState(() => {
    registeredWith = options
    heardUntil(untilTestEnds(), () => options.onRegisteredSW?.('/sw.js', registration.worker))
  })
  return {
    needRefresh: useState(registration.waiting),
    offlineReady: useState(false),
    updateServiceWorker: registration.updateServiceWorker,
  }
}

/**
 * Whether a new version is waiting from the next render on; the setup makes it none per test. Its
 * two mocks are the same ones every time, reset as new: a worker keeps every mock made in it.
 */
export function stubServiceWorker({ waiting }: { waiting: boolean }) {
  registration.waiting = waiting
  registration.updateServiceWorker.mockReset()
  registration.worker.update.mockReset()
  registeredWith = {}
  return {
    updateServiceWorker: registration.updateServiceWorker,
    update: registration.worker.update,
    registeredWith: () => registeredWith,
  }
}
