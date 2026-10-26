import { afterEach, vi } from 'vitest'

// A unit test (`*.test.ts`) runs in node: it needs no more than its mocks put back. A test with a
// DOM (`*.test.tsx`, or a `*.test.ts` that says `// @vitest-environment jsdom`) gets the browser's
// stand-ins too, loaded only then: jsdom, Testing Library and the locales cost a node test seconds.
if (typeof document === 'undefined') {
  afterEach(() => {
    vi.restoreAllMocks()
    // A worker keeps every mock made in it (`isolate: false`), and with it what each was called with.
    vi.clearAllMocks()
    vi.unstubAllGlobals()
  })
} else {
  const { setUpDom } = await import('./setup-dom')
  setUpDom()
}
