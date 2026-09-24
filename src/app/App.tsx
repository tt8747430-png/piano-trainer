import { RouterProvider } from '@tanstack/react-router'
import { type SettingsStore, SettingsStoreProvider } from '@/entities/settings'
import { LocaleSync } from './providers/LocaleSync'
import { ThemeProvider } from './providers/ThemeProvider'
import type { AppRouter } from './router'

export function App({
  settingsStore,
  router,
}: {
  settingsStore: SettingsStore
  router: AppRouter
}) {
  return (
    <SettingsStoreProvider store={settingsStore}>
      <LocaleSync />
      <ThemeProvider>
        <RouterProvider router={router} />
      </ThemeProvider>
    </SettingsStoreProvider>
  )
}
