import { createMemoryHistory } from '@tanstack/react-router'
import { render } from '@testing-library/react'
import type { Locale } from '@/shared/i18n'
import { createFakeAudio } from '@/shared/api/audio'
import { createFakeMidi } from '@/shared/api/midi'
import { filesContent, type ContentPort } from '@/shared/api/content'
import { createMemoryStorage } from '@/shared/lib'
import { heardUntil, untilTestEnds } from '@/shared/test/listeners'
import { loadScoreView } from '@/shared/ui'
import { App } from '../App'
import { createStores } from '../composition-root'
import { createAppRouter } from '../router'

/**
 * The whole app at `path`, its saved stores on in-memory storage unless told otherwise, in the given
 * language, with fake audio and MIDI it hands back for the test to drive; `webMidi: false` is a
 * browser without it; `content` is where songs' music and lessons come from (all on the device unless
 * a test says otherwise).
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
  }: { locale?: Locale; storage?: Storage; webMidi?: boolean; content?: ContentPort } = {},
) {
  const testOver = untilTestEnds()
  const stores = createStores(
    { storage, signal: testOver },
    { languages: [locale], finePointer: false },
  )
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
    <App stores={stores} services={{ audio, midi: webMidi ? midi : null }} router={router} />,
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
  }
}
