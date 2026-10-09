import { createPatternsStore } from '@/entities/pattern'
import { createPiecesStore } from '@/entities/piece'
import { createTakesStore } from '@/entities/take'
import { createViewsStore } from '@/entities/views'
import { createMemoryStorage } from '@/shared/lib'
import type { RouterContext } from '../router'

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
