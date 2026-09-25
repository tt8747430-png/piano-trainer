import { RouterProvider } from '@tanstack/react-router'
import { type ProgressStore, ProgressStoreProvider } from '@/entities/progress'
import { type SettingsStore, SettingsStoreProvider } from '@/entities/settings'
import { type Services, ServicesProvider } from '@/shared/lib/services'
import { AudioUnlock } from './providers/AudioUnlock'
import { LocaleSync } from './providers/LocaleSync'
import { ThemeProvider } from './providers/ThemeProvider'
import type { AppRouter } from './router'

export function App({
  settingsStore,
  progressStore,
  services,
  router,
}: {
  settingsStore: SettingsStore
  progressStore: ProgressStore
  services: Services
  router: AppRouter
}) {
  return (
    <SettingsStoreProvider store={settingsStore}>
      <ProgressStoreProvider store={progressStore}>
        <ServicesProvider services={services}>
          <LocaleSync />
          <AudioUnlock />
          <ThemeProvider>
            <RouterProvider router={router} />
          </ThemeProvider>
        </ServicesProvider>
      </ProgressStoreProvider>
    </SettingsStoreProvider>
  )
}
