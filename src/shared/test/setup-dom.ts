import '@testing-library/jest-dom/vitest'
import { cleanup, configure } from '@testing-library/react'
import { afterEach, beforeEach, vi } from 'vitest'
import { i18n } from '@/shared/i18n'
import { stubIntersectionObserver } from './intersection'
import { stubMatchMedia } from './match-media'
import { stubServiceWorker } from './pwa-register'
import { stubResizeObserver } from './resize'
import { watchTrees } from './trees'

// A `findBy` waits as long as a busy runner needs: four workers engraving at once can take a staff past
// the one second it waits by default, failing a test that passes alone.
configure({ asyncUtilTimeout: 5_000 })

// One of each for the worker, as new for every test: a worker keeps every mock made in it.
const scrollWindow = vi.fn()
const scrollElement = vi.fn()
const scrollIntoView = vi.fn()

/**
 * The browser's stand-ins round every test with a DOM. The setup calls it for each file: with
 * `isolate: false` the files of a worker share their modules, so hooks registered by importing this
 * module would round only the first file.
 */
export function setUpDom() {
  let takeTreesApart = () => {}

  beforeEach(() => {
    takeTreesApart = watchTrees()
    stubMatchMedia({ dark: false })
    stubServiceWorker({ waiting: false })
    // jsdom lays nothing out: everything a test renders is on screen.
    stubIntersectionObserver({ visible: true })
    stubResizeObserver()
    // jsdom lays nothing out and cannot scroll the window, which the router resets on every navigation.
    window.scrollTo = scrollWindow.mockReset()
    // jsdom cannot scroll an element, which the router resets on a full screen's navigation, nor
    // scroll one into view: one asked to stays where it is.
    Element.prototype.scrollTo = scrollElement.mockReset()
    Element.prototype.scrollIntoView = scrollIntoView.mockReset()
  })

  // `globals: false` means Testing Library cannot register its own cleanup.
  afterEach(async () => {
    cleanup()
    vi.restoreAllMocks()
    // A worker keeps every mock made in it (`isolate: false`): what each was called with, and on,
    // would keep the elements, and the app, of every test before.
    vi.clearAllMocks()
    vi.unstubAllGlobals()
    await i18n.changeLanguage('en')
    localStorage.clear()
    delete document.documentElement.dataset.theme
    document.documentElement.lang = 'en'
    vi.useRealTimers()
    // What a pop-up leaves behind once its test is unmounted (a portal, the page marked inert or
    // aria-hidden around it, the scroll lock's styles) would hide the next test's pop-up from its
    // queries: the page starts bare.
    document.body.replaceChildren()
    for (const element of [document.documentElement, document.body]) {
      for (const name of ['style', 'inert', 'aria-hidden', 'data-base-ui-scroll-locked'])
        element.removeAttribute(name)
    }
    takeTreesApart()
  })
}
