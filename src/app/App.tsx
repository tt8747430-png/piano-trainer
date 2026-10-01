import { RouterProvider } from '@tanstack/react-router'
import { type PatternsStore, PatternsStoreProvider } from '@/entities/pattern'
import { type PiecesStore, PiecesStoreProvider } from '@/entities/piece'
import { type ProgressStore, ProgressStoreProvider } from '@/entities/progress'
import { type SettingsStore, SettingsStoreProvider } from '@/entities/settings'
import { type Services, ServicesProvider } from '@/shared/lib/services'
import { AudioUnlock } from './providers/AudioUnlock'
import { LocaleSync } from './providers/LocaleSync'
import { MidiReconnect } from './providers/MidiReconnect'
import { ThemeProvider } from './providers/ThemeProvider'
import type { AppRouter } from './router'

export function App({
  settingsStore,
  progressStore,
  patternsStore,
  piecesStore,
  services,
  router,
}: {
  settingsStore: SettingsStore
  progressStore: ProgressStore
  patternsStore: PatternsStore
  piecesStore: PiecesStore
  services: Services
  router: AppRouter
}) {
  return (
    <SettingsStoreProvider store={settingsStore}>
      <ProgressStoreProvider store={progressStore}>
        <PatternsStoreProvider store={patternsStore}>
          <PiecesStoreProvider store={piecesStore}>
            <ServicesProvider services={services}>
              <LocaleSync />
              <AudioUnlock />
              <MidiReconnect />
              <ThemeProvider>
                <RouterProvider router={router} />
              </ThemeProvider>
            </ServicesProvider>
          </PiecesStoreProvider>
        </PatternsStoreProvider>
      </ProgressStoreProvider>
    </SettingsStoreProvider>
  )
}
