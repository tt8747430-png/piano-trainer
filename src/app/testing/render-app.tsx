import { createMemoryHistory } from '@tanstack/react-router'
import { render } from '@testing-library/react'
import type { Locale } from '@/shared/i18n'
import {
  createFakeAdmin,
  createFakeFeatures,
  type AdminPort,
  type FeaturesPort,
} from '@/shared/api/admin'
import { createFakeAudio } from '@/shared/api/audio'
import { createFakeMidi } from '@/shared/api/midi'
import { createFakeAuth, type AuthGateway } from '@/shared/api/auth'
import { filesContent, type ContentPort } from '@/shared/api/content'
import { createFakeContentEditing, type ContentEditingPort } from '@/shared/api/content-editing'
import { createFakePublicLibrary, type PublicLibrary } from '@/shared/api/public-library'
import { createFakeCloud } from '@/shared/api/sync'
import { createMemoryStorage } from '@/shared/lib'
import { heardUntil, untilTestEnds } from '@/shared/test/listeners'
import { loadScoreView } from '@/shared/ui'
import { App } from '../App'
import { createStores, createSync } from '../composition-root'
import { createAppRouter } from '../router'

/**
 * The whole app at `path`, its saved stores on in-memory storage unless told otherwise, in the given
 * language, with fake audio and MIDI it hands back for the test to drive; `webMidi: false` is a
 * browser without it; `content` is where songs' music and lessons come from (all on the device unless
 * a test says otherwise); `auth` and `cloud` are fakes, signed out unless the test signs in;
 * `welcomed: false` is the app's first run, with its welcome; `publicLibrary`, `admin`, `features` and `contentEditing` fakes, empty unless given.
 * Every screen's code is loaded first, and the score's engraver, so a test waits on the app and
 * never on the runner importing a lazy chunk.
 * What the app hears on the window and the document (its stores another tab's saves, its router the
 * page's scroll) it stops hearing once the test is over, so nothing there holds it after.
 */
export async function renderApp(
  path: string,
  {
    locale = 'en',
    storage = createMemoryStorage(),
    webMidi = true,
    content = filesContent(),
    auth = createFakeAuth(),
    cloud = createFakeCloud(),
    welcomed = true,
    publicLibrary = createFakePublicLibrary(),
    admin = createFakeAdmin(),
    features = createFakeFeatures(),
    contentEditing = createFakeContentEditing(),
  }: {
    locale?: Locale
    storage?: Storage
    webMidi?: boolean
    content?: ContentPort
    auth?: AuthGateway
    cloud?: ReturnType<typeof createFakeCloud>
    welcomed?: boolean
    publicLibrary?: PublicLibrary
    admin?: AdminPort
    features?: FeaturesPort
    contentEditing?: ContentEditingPort
  } = {},
) {
  const testOver = untilTestEnds()
  const sync = createSync(cloud, storage)
  const stores = createStores(
    { storage: sync.storage, signal: testOver },
    { languages: [locale], finePointer: false },
  )
  if (welcomed && !stores.settings.getState().welcomed) stores.settings.setState({ welcomed })
  const router = heardUntil(testOver, () =>
    createAppRouter({
      ...stores,
      content,
      history: createMemoryHistory({ initialEntries: [path] }),
    }),
  )
  await Promise.all(Object.values(router.routesById).map((route) => router.loadRouteChunk(route)))
  await loadScoreView()
  const audio = createFakeAudio()
  const midi = createFakeMidi()
  const view = render(
    <App
      stores={stores}
      services={{ audio, midi: webMidi ? midi : null }}
      auth={auth}
      sync={sync}
      publicLibrary={publicLibrary}
      admin={admin}
      features={features}
      contentEditing={contentEditing}
      router={router}
    />,
  )
  return {
    ...view,
    router,
    settingsStore: stores.settings,
    progressStore: stores.progress,
    patternsStore: stores.patterns,
    piecesStore: stores.pieces,
    takesStore: stores.takes,
    viewsStore: stores.views,
    libraryStore: stores.library,
    diagramInversionsStore: stores.diagramInversions,
    audio,
    midi,
    auth,
    cloud,
    sync,
  }
}
