import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, beforeEach, vi } from 'vitest'
import { i18n } from '@/shared/i18n'
import { stubFonts } from './fonts'
import { stubIntersectionObserver } from './intersection'
import { stubMatchMedia } from './match-media'
import { stubServiceWorker } from './pwa-register'
import { stubResizeObserver } from './resize'

beforeEach(() => {
  stubMatchMedia({ dark: false })
  stubServiceWorker({ waiting: false })
  // jsdom lays nothing out: everything a test renders is on screen.
  stubIntersectionObserver({ visible: true })
  stubResizeObserver()
  // jsdom lays nothing out and cannot scroll the window, which the router resets on every navigation.
  if (typeof window !== 'undefined')
    vi.spyOn(window, 'scrollTo').mockImplementation(() => undefined)
  // jsdom cannot scroll an element into view: one asked to stays where it is.
  if (typeof Element !== 'undefined') Element.prototype.scrollIntoView = vi.fn()
  // Tests in the node environment have no document to give fonts to.
  if (typeof document !== 'undefined') stubFonts()
})

// `globals: false` means Testing Library cannot register its own cleanup.
afterEach(async () => {
  cleanup()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
  await i18n.changeLanguage('en')
  // Tests in the node environment (`@vitest-environment node`) have no DOM to reset.
  if (typeof document === 'undefined') return
  localStorage.clear()
  delete document.documentElement.dataset.theme
  document.documentElement.lang = 'en'
})
