import { afterEach, vi } from 'vitest'

// A unit test (`*.test.ts`) runs in node: it needs no more than its mocks put back. A test with a
// DOM (`*.test.tsx`, or a `*.test.ts` that says `// @vitest-environment jsdom`) gets the browser's
// stand-ins too, loaded only then: jsdom, Testing Library and the locales cost a node test seconds.
if (typeof document === 'undefined') {
  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })
} else {
  const { setUpDom } = await import('./setup-dom')
  setUpDom()
}
