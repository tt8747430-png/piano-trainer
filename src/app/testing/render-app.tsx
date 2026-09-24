import { createMemoryHistory } from '@tanstack/react-router'
import { render } from '@testing-library/react'
import { createSettingsStore, type Locale } from '@/entities/settings'
import { createMemoryStorage } from '@/shared/lib'
import { App } from '../App'
import { createAppRouter } from '../router'

/** The whole app at `path`, on in-memory storage unless told otherwise, in the given language. */
export function renderApp(
  path: string,
  { locale = 'en', storage = createMemoryStorage() }: { locale?: Locale; storage?: Storage } = {},
) {
  const settingsStore = createSettingsStore({ storage, languages: [locale] })
  const router = createAppRouter(createMemoryHistory({ initialEntries: [path] }))
  const view = render(<App settingsStore={settingsStore} router={router} />)
  return { ...view, router, settingsStore }
}
