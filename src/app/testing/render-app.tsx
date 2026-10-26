import { createMemoryHistory } from '@tanstack/react-router'
import { render } from '@testing-library/react'
import { createDiagramInversionsStore } from '@/entities/diagram-inversion'
import { createPatternsStore } from '@/entities/pattern'
import { createPiecesStore } from '@/entities/piece'
import { createProgressStore } from '@/entities/progress'
import { createSettingsStore } from '@/entities/settings'
import { createTakesStore } from '@/entities/take'
import { createViewsStore } from '@/entities/views'
import type { Locale } from '@/shared/i18n'
import { createFakeAudio } from '@/shared/api/audio'
import { createFakeMidi } from '@/shared/api/midi'
import { createMemoryStorage } from '@/shared/lib'
import { heardUntil, untilTestEnds } from '@/shared/test/listeners'
import { loadScoreView } from '@/shared/ui'
import { App } from '../App'
import { createAppRouter } from '../router'

/**
 * The whole app at `path`, its saved stores on in-memory storage unless told otherwise, in the given
 * language, with fake audio and MIDI it hands back for the test to drive; `webMidi: false` is a
 * browser without it.
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
  }: { locale?: Locale; storage?: Storage; webMidi?: boolean } = {},
) {
  const testOver = untilTestEnds()
  const saving = { storage, signal: testOver }
  const settingsStore = createSettingsStore({ ...saving, languages: [locale], finePointer: false })
  const progressStore = createProgressStore(saving)
  const patternsStore = createPatternsStore(saving)
  const piecesStore = createPiecesStore(saving)
  const takesStore = createTakesStore(saving)
  const viewsStore = createViewsStore(saving)
  const diagramInversionsStore = createDiagramInversionsStore(saving)
  const router = heardUntil(testOver, () =>
    createAppRouter({
      history: createMemoryHistory({ initialEntries: [path] }),
      views: viewsStore,
      patterns: patternsStore,
      pieces: piecesStore,
      takes: takesStore,
    }),
  )
  await Promise.all(Object.values(router.routesById).map((route) => router.loadRouteChunk(route)))
  await loadScoreView()
  const audio = createFakeAudio()
  const midi = createFakeMidi()
  const view = render(
    <App
      settingsStore={settingsStore}
      progressStore={progressStore}
      patternsStore={patternsStore}
      piecesStore={piecesStore}
      takesStore={takesStore}
      diagramInversionsStore={diagramInversionsStore}
      services={{ audio, midi: webMidi ? midi : null }}
      router={router}
    />,
  )
  return {
    ...view,
    router,
    settingsStore,
    progressStore,
    patternsStore,
    piecesStore,
    takesStore,
    viewsStore,
    diagramInversionsStore,
    audio,
    midi,
  }
}
