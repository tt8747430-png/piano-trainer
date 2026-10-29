import { RouterProvider } from '@tanstack/react-router'
import { DiagramInversionsStoreProvider } from '@/entities/diagram-inversion'
import { LibraryStoreProvider } from '@/entities/library'
import { PatternsStoreProvider } from '@/entities/pattern'
import { PiecesStoreProvider } from '@/entities/piece'
import { ProgressStoreProvider } from '@/entities/progress'
import { SettingsStoreProvider } from '@/entities/settings'
import { TakesStoreProvider } from '@/entities/take'
import type { AuthGateway } from '@/shared/api/auth'
import { AccountProvider } from '@/shared/lib/account'
import { type Services, ServicesProvider } from '@/shared/lib/services'
import type { SyncRunner } from '@/shared/lib/sync'
import { ShortcutsProvider } from '@/shared/lib/shortcuts'
import { Toaster } from '@/shared/ui'
import { AudioUnlock } from './providers/AudioUnlock'
import { LocaleSync } from './providers/LocaleSync'
import { MidiReconnect } from './providers/MidiReconnect'
import { MidiSync } from './providers/MidiSync'
import { ThemeProvider } from './providers/ThemeProvider'
import { TitlesSync } from './providers/TitlesSync'
import type { Stores } from './composition-root'
import type { AppRouter } from './router'

export function App({
  stores,
  services,
  auth,
  sync,
  router,
}: {
  stores: Stores
  services: Services
  auth: AuthGateway
  sync: SyncRunner
  router: AppRouter
}) {
  return (
    <AccountProvider auth={auth} sync={sync}>
      <SettingsStoreProvider store={stores.settings}>
        <ProgressStoreProvider store={stores.progress}>
          <PatternsStoreProvider store={stores.patterns}>
            <PiecesStoreProvider store={stores.pieces}>
              <TakesStoreProvider store={stores.takes}>
                <LibraryStoreProvider store={stores.library}>
                  <DiagramInversionsStoreProvider store={stores.diagramInversions}>
                    <ServicesProvider services={services}>
                      <LocaleSync />
                      <AudioUnlock />
                      <MidiReconnect />
                      <MidiSync />
                      <TitlesSync />
                      <ThemeProvider>
                        <ShortcutsProvider>
                          <RouterProvider router={router} />
                          <Toaster />
                        </ShortcutsProvider>
                      </ThemeProvider>
                    </ServicesProvider>
                  </DiagramInversionsStoreProvider>
                </LibraryStoreProvider>
              </TakesStoreProvider>
            </PiecesStoreProvider>
          </PatternsStoreProvider>
        </ProgressStoreProvider>
      </SettingsStoreProvider>
    </AccountProvider>
  )
}
