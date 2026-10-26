import { createMemoryHistory } from '@tanstack/react-router'
import { createPatternsStore } from '@/entities/pattern'
import { createPiecesStore } from '@/entities/piece'
import { createTakesStore } from '@/entities/take'
import { createViewsStore } from '@/entities/views'
import { createMemoryStorage } from '@/shared/lib'
import { heardUntil, untilTestEnds } from '@/shared/test/listeners'
import { createAppRouter, type AppRouter, type RouterContext } from '../router'

/** The router's saved stores on in-memory storage, hearing no other tab: a test's own. */
export function testContext(): RouterContext {
  const saving = { storage: createMemoryStorage(), otherTabs: new EventTarget() }
  return {
    views: createViewsStore(saving),
    patterns: createPatternsStore(saving),
    pieces: createPiecesStore(saving),
    takes: createTakesStore(saving),
  }
}

/**
 * The app's router at `path` on a memory history, over a test's own stores. Its scroll restoration
 * hears the page (its scroll, its leaving) with no way to stop: that is taken off once the test is
 * over, so the window and the document, which outlive it, keep no router.
 */
export function testRouter(path = '/'): AppRouter {
  return heardUntil(untilTestEnds(), () =>
    createAppRouter({ history: createMemoryHistory({ initialEntries: [path] }), ...testContext() }),
  )
}
