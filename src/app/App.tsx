import { RouterProvider } from '@tanstack/react-router'
import { type PatternsStore, PatternsStoreProvider } from '@/entities/pattern'
import { type PiecesStore, PiecesStoreProvider } from '@/entities/piece'
import { type ProgressStore, ProgressStoreProvider } from '@/entities/progress'
import { type SettingsStore, SettingsStoreProvider } from '@/entities/settings'
import { type TakesStore, TakesStoreProvider } from '@/entities/take'
import { type Services, ServicesProvider } from '@/shared/lib/services'
import { ShortcutsProvider } from '@/shared/lib/shortcuts'
import { AudioUnlock } from './providers/AudioUnlock'
import { LocaleSync } from './providers/LocaleSync'
import { MidiReconnect } from './providers/MidiReconnect'
import { MidiSync } from './providers/MidiSync'
import { ThemeProvider } from './providers/ThemeProvider'
import type { AppRouter } from './router'

export function App({
  settingsStore,
  progressStore,
  patternsStore,
  piecesStore,
  takesStore,
  services,
  router,
}: {
  settingsStore: SettingsStore
  progressStore: ProgressStore
  patternsStore: PatternsStore
  piecesStore: PiecesStore
  takesStore: TakesStore
  services: Services
  router: AppRouter
}) {
  return (
    <SettingsStoreProvider store={settingsStore}>
      <ProgressStoreProvider store={progressStore}>
        <PatternsStoreProvider store={patternsStore}>
          <PiecesStoreProvider store={piecesStore}>
            <TakesStoreProvider store={takesStore}>
              <ServicesProvider services={services}>
                <LocaleSync />
                <AudioUnlock />
                <MidiReconnect />
                <MidiSync />
                <ThemeProvider>
                  <ShortcutsProvider>
                    <RouterProvider router={router} />
                  </ShortcutsProvider>
                </ThemeProvider>
              </ServicesProvider>
            </TakesStoreProvider>
          </PiecesStoreProvider>
        </PatternsStoreProvider>
      </ProgressStoreProvider>
    </SettingsStoreProvider>
  )
}
