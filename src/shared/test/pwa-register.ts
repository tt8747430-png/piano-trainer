import { useState } from 'react'
import { vi } from 'vitest'

/**
 * Test fake for vite-plugin-pwa's `virtual:pwa-register/react`, which exists only in a Vite build
 * (vite.config.ts aliases it here): a service worker registration whose waiting version each test
 * decides with `stubServiceWorker`.
 */
const registration = {
  waiting: false,
  updateServiceWorker: vi.fn(async (_reloadPage?: boolean) => {}),
}

export function useRegisterSW() {
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
  return { updateServiceWorker: registration.updateServiceWorker }
}
