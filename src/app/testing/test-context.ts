import { createMemoryHistory } from '@tanstack/react-router'
import { filesContent } from '@/shared/api/content'
import { createMemoryStorage } from '@/shared/lib'
import { heardUntil, untilTestEnds } from '@/shared/test/listeners'
import { createStores } from '../composition-root'
import { createAppRouter, type AppRouter, type RouterContext } from '../router'

/** The router's saved stores on in-memory storage, hearing no other tab, and the content: a test's own. */
export function testContext(): RouterContext {
  const stores = createStores({ storage: createMemoryStorage(), otherTabs: new EventTarget() })
  return { ...stores, content: filesContent() }
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
