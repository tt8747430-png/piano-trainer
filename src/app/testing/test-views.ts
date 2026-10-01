import { createViewsStore, type ViewsStore } from '@/entities/views'
import { createMemoryStorage } from '@/shared/lib'

/** Remembered views on in-memory storage, hearing no other tab: a test's own. */
export const testViews = (): ViewsStore =>
  createViewsStore({ storage: createMemoryStorage(), otherTabs: new EventTarget() })
