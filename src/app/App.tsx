import { RouterProvider } from '@tanstack/react-router'
import {
  type DiagramInversionsStore,
  DiagramInversionsStoreProvider,
} from '@/entities/diagram-inversion'
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
import { TitlesSync } from './providers/TitlesSync'
import type { AppRouter } from './router'

export function App({
  settingsStore,
  progressStore,
  patternsStore,
  piecesStore,
  takesStore,
  diagramInversionsStore,
  services,
  router,
}: {
  settingsStore: SettingsStore
  progressStore: ProgressStore
  patternsStore: PatternsStore
  piecesStore: PiecesStore
  takesStore: TakesStore
  diagramInversionsStore: DiagramInversionsStore
  services: Services
  router: AppRouter
}) {
  return (
    <SettingsStoreProvider store={settingsStore}>
      <ProgressStoreProvider store={progressStore}>
        <PatternsStoreProvider store={patternsStore}>
          <PiecesStoreProvider store={piecesStore}>
            <TakesStoreProvider store={takesStore}>
              <DiagramInversionsStoreProvider store={diagramInversionsStore}>
                <ServicesProvider services={services}>
                  <LocaleSync />
                  <AudioUnlock />
                  <MidiReconnect />
                  <MidiSync />
                  <TitlesSync />
                  <ThemeProvider>
                    <ShortcutsProvider>
                      <RouterProvider router={router} />
                    </ShortcutsProvider>
                  </ThemeProvider>
                </ServicesProvider>
              </DiagramInversionsStoreProvider>
            </TakesStoreProvider>
          </PiecesStoreProvider>
        </PatternsStoreProvider>
      </ProgressStoreProvider>
    </SettingsStoreProvider>
  )
}
