import { createMemoryHistory } from '@tanstack/react-router'
import { render } from '@testing-library/react'
import { createProgressStore } from '@/entities/progress'
import { createSettingsStore } from '@/entities/settings'
import type { Locale } from '@/shared/i18n'
import { createFakeAudio } from '@/shared/api/audio'
import { createFakeMidi } from '@/shared/api/midi'
import { createMemoryStorage } from '@/shared/lib'
import { App } from '../App'
import { createAppRouter } from '../router'

/**
 * The whole app at `path`, on in-memory storage unless told otherwise, in the given language, with
 * fake audio and MIDI it hands back for the test to drive; `webMidi: false` is a browser without it.
 * Every screen's code is loaded first, so a test waits on the app and never on the runner importing
 * a lazy chunk.
 */
export async function renderApp(
  path: string,
  {
    locale = 'en',
    storage = createMemoryStorage(),
    webMidi = true,
  }: { locale?: Locale; storage?: Storage; webMidi?: boolean } = {},
) {
  const settingsStore = createSettingsStore({ storage, languages: [locale], finePointer: false })
  const progressStore = createProgressStore({ storage })
  const router = createAppRouter(createMemoryHistory({ initialEntries: [path] }))
  await Promise.all(Object.values(router.routesById).map((route) => router.loadRouteChunk(route)))
  const audio = createFakeAudio()
  const midi = createFakeMidi()
  const view = render(
    <App
      settingsStore={settingsStore}
      progressStore={progressStore}
      services={{ audio, midi: webMidi ? midi : null }}
      router={router}
    />,
  )
  return { ...view, router, settingsStore, progressStore, audio, midi }
}
