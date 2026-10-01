import {
  createMemoryHistory,
  createRootRoute,
  createRouter,
  RouterProvider,
} from '@tanstack/react-router'
import { render } from '@testing-library/react'
import type { ReactElement } from 'react'
import { createPatternsStore, PatternsStoreProvider } from '@/entities/pattern'
import { createSettingsStore, SettingsStoreProvider } from '@/entities/settings'
import type { Locale } from '@/shared/i18n'
import { createMemoryStorage } from '@/shared/lib'

/**
 * `ui` as the one route of a memory router, under fresh in-memory settings and patterns stores, so
 * its links build their addresses: a widget that leads elsewhere, tested on its own.
 */
export async function renderRouted(ui: ReactElement, { locale = 'en' }: { locale?: Locale } = {}) {
  const storage = createMemoryStorage()
  const settingsStore = createSettingsStore({ storage, languages: [locale], finePointer: false })
  const patternsStore = createPatternsStore({ storage, otherTabs: new EventTarget() })
  const router = createRouter({
    routeTree: createRootRoute({ component: () => ui }),
    history: createMemoryHistory(),
  })
  // Loaded first, so the route renders at once.
  await router.load()
  const view = render(
    <SettingsStoreProvider store={settingsStore}>
      <PatternsStoreProvider store={patternsStore}>
        <RouterProvider router={router} />
      </PatternsStoreProvider>
    </SettingsStoreProvider>,
  )
  return { ...view, settingsStore, patternsStore }
}
