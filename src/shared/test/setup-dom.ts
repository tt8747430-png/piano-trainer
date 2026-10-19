import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, beforeEach, vi } from 'vitest'
import { i18n } from '@/shared/i18n'
import { stubFonts } from './fonts'
import { stubIntersectionObserver } from './intersection'
import { stubMatchMedia } from './match-media'
import { stubServiceWorker } from './pwa-register'
import { stubResizeObserver } from './resize'

/**
 * The browser's stand-ins round every test with a DOM. The setup calls it for each file: with
 * `isolate: false` the files of a worker share their modules, so hooks registered by importing this
 * module would round only the first file.
 */
export function setUpDom() {
  beforeEach(() => {
    stubMatchMedia({ dark: false })
    stubServiceWorker({ waiting: false })
    // jsdom lays nothing out: everything a test renders is on screen.
    stubIntersectionObserver({ visible: true })
    stubResizeObserver()
    // jsdom lays nothing out and cannot scroll the window, which the router resets on every navigation.
    vi.spyOn(window, 'scrollTo').mockImplementation(() => undefined)
    // jsdom cannot scroll an element, which the router resets on a full screen's navigation, nor
    // scroll one into view: one asked to stays where it is.
    Element.prototype.scrollTo = vi.fn()
    Element.prototype.scrollIntoView = vi.fn()
    stubFonts()
  })

  // `globals: false` means Testing Library cannot register its own cleanup.
  afterEach(async () => {
    cleanup()
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
    await i18n.changeLanguage('en')
    localStorage.clear()
    delete document.documentElement.dataset.theme
    document.documentElement.lang = 'en'
  })
}
