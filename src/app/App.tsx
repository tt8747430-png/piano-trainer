import { RouterProvider } from '@tanstack/react-router'
import { ChordSheetsStoreProvider } from '@/entities/chord-sheet'
import { DiagramInversionsStoreProvider } from '@/entities/diagram-inversion'
import { LibraryStoreProvider } from '@/entities/library'
import { NotificationsStoreProvider } from '@/entities/notification'
import { PatternsStoreProvider } from '@/entities/pattern'
import { PracticeLibraryStoreProvider } from '@/entities/practice-library'
import { PiecesStoreProvider } from '@/entities/piece'
import { ProgressStoreProvider } from '@/entities/progress'
import { SettingsStoreProvider } from '@/entities/settings'
import { TakesStoreProvider } from '@/entities/take'
import type { AdminPort, FeaturesPort } from '@/shared/api/admin'
import type { AuthGateway } from '@/shared/api/auth'
import type { ContentEditingPort } from '@/shared/api/content-editing'
import type { ErrorReporter } from '@/shared/api/errors'
import type { GroupsPort } from '@/shared/api/groups'
import type { ProfilePort } from '@/shared/api/profile'
import { GroupsProvider } from '@/shared/lib/groups'
import type { PublicLibrary } from '@/shared/api/public-library'
import { AccountProvider, ProfileProvider } from '@/shared/lib/account'
import { AdminProvider } from '@/shared/lib/admin'
import { ContentEditingProvider } from '@/shared/lib/content-editing'
import { ErrorReportsProvider } from '@/shared/lib/error-reports'
import { FeaturesProvider } from '@/shared/lib/features'
import { PublicLibraryProvider } from '@/shared/lib/public-library'
import { type Services, ServicesProvider } from '@/shared/lib/services'
import type { SyncRunner } from '@/shared/lib/sync'
import { ShortcutsProvider } from '@/shared/lib/shortcuts'
import { Confirmer, Toaster } from '@/shared/ui'
import { AudioUnlock } from './providers/AudioUnlock'
import { ErrorListener } from './providers/ErrorListener'
import { LocaleSync } from './providers/LocaleSync'
import { MidiReconnect } from './providers/MidiReconnect'
import { MidiSync } from './providers/MidiSync'
import { ThemeProvider } from './providers/ThemeProvider'
import type { Stores } from './composition-root'
import type { AppRouter } from './router'

export function App({
  stores,
  services,
  auth,
  sync,
  publicLibrary,
  profile,
  groups,
  admin,
  features,
  contentEditing,
  errors,
  router,
}: {
  stores: Stores
  services: Services
  auth: AuthGateway
  sync: SyncRunner
  publicLibrary: PublicLibrary
  profile: ProfilePort
  groups: GroupsPort
  admin: AdminPort
  features: FeaturesPort
  contentEditing: ContentEditingPort
  errors: ErrorReporter
  router: AppRouter
}) {
  return (
    <ErrorReportsProvider reporter={errors}>
      <ErrorListener />
      <AccountProvider auth={auth} sync={sync}>
        <ProfileProvider port={profile}>
          <GroupsProvider groups={groups}>
            <PublicLibraryProvider library={publicLibrary}>
              <AdminProvider admin={admin}>
                <FeaturesProvider features={features}>
                  <ContentEditingProvider editing={contentEditing}>
                    <SettingsStoreProvider store={stores.settings}>
                      <ProgressStoreProvider store={stores.progress}>
                        <PatternsStoreProvider store={stores.patterns}>
                          <PracticeLibraryStoreProvider store={stores.practiceLibrary}>
                            <PiecesStoreProvider store={stores.pieces}>
                              <TakesStoreProvider store={stores.takes}>
                                <LibraryStoreProvider store={stores.library}>
                                  <DiagramInversionsStoreProvider store={stores.diagramInversions}>
                                    <ChordSheetsStoreProvider store={stores.chordSheets}>
                                      <NotificationsStoreProvider store={stores.notifications}>
                                        <ServicesProvider services={services}>
                                          <LocaleSync />
                                          <AudioUnlock />
                                          <MidiReconnect />
                                          <MidiSync />
                                          <ThemeProvider>
                                            <ShortcutsProvider>
                                              <RouterProvider router={router} />
                                              <Toaster />
                                              <Confirmer />
                                            </ShortcutsProvider>
                                          </ThemeProvider>
                                        </ServicesProvider>
                                      </NotificationsStoreProvider>
                                    </ChordSheetsStoreProvider>
                                  </DiagramInversionsStoreProvider>
                                </LibraryStoreProvider>
                              </TakesStoreProvider>
                            </PiecesStoreProvider>
                          </PracticeLibraryStoreProvider>
                        </PatternsStoreProvider>
                      </ProgressStoreProvider>
                    </SettingsStoreProvider>
                  </ContentEditingProvider>
                </FeaturesProvider>
              </AdminProvider>
            </PublicLibraryProvider>
          </GroupsProvider>
        </ProfileProvider>
      </AccountProvider>
    </ErrorReportsProvider>
  )
}
