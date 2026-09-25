import { createMemoryHistory } from '@tanstack/react-router'
import { render } from '@testing-library/react'
import { createProgressStore } from '@/entities/progress'
import { createSettingsStore } from '@/entities/settings'
import type { Locale } from '@/shared/i18n'
import { createFakeAudio } from '@/shared/api/audio'
import { createFakeMidi } from '@/shared/api/midi'
import { createMemoryStorage } from '@/shared/lib'
import type { Services } from '@/shared/lib/services'
import { App } from '../App'
import { createAppRouter } from '../router'

/**
 * The whole app at `path`, on in-memory storage unless told otherwise, in the given language, with
 * fake audio and MIDI unless others are given.
 */
export function renderApp(
  path: string,
  {
    locale = 'en',
    storage = createMemoryStorage(),
    services = { audio: createFakeAudio(), midi: createFakeMidi() },
  }: { locale?: Locale; storage?: Storage; services?: Services } = {},
) {
  const settingsStore = createSettingsStore({ storage, languages: [locale] })
  const progressStore = createProgressStore({ storage })
  const router = createAppRouter(createMemoryHistory({ initialEntries: [path] }))
  const view = render(
    <App
      settingsStore={settingsStore}
      progressStore={progressStore}
      services={services}
      router={router}
    />,
  )
  return { ...view, router, settingsStore, progressStore, services }
}
