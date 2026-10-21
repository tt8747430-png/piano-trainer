import { afterEach, vi } from 'vitest'

// jsdom lays nothing out and has no taps to keep waiting: a score is engraved at once, so a test
// finds it drawn as soon as its font is in. engrave.test.ts tests the steps themselves.
vi.mock('@/shared/ui/score/engrave', async (importActual) => {
  const actual = await importActual<typeof import('@/shared/ui/score/engrave')>()
  return {
    ...actual,
    engraveInSteps: (...[score, host, options]: Parameters<typeof actual.engraveInSteps>) =>
      Promise.resolve(actual.engrave(score, host, options)),
  }
})

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
