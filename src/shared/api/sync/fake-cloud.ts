import type { SyncDocument } from '@/shared/lib/sync'
import { netResult } from '../network'
import type { DocumentTableName } from '../supabase'
import type { CloudSync } from './types'

/**
 * Whether the server applies a push: it holds no copy, holds exactly this one, holds the copy the
 * push was based on, or (with no base) its own clock is not the later. `push_documents`' rule.
 */
export function applies(
  held: SyncDocument | undefined,
  document: SyncDocument,
  base: SyncDocument | null,
): boolean {
  if (!held) return true
  if (JSON.stringify(held) === JSON.stringify(document)) return true
  if (base) return held.updatedAt === base.updatedAt && held.deleted === base.deleted
  return held.updatedAt <= document.updatedAt
}

/** The cloud in memory, for tests: one learner's tables, `online` the device's connection. */
export function createFakeCloud({
  online = () => true,
}: { online?: () => boolean } = {}): CloudSync & {
  /** What the server holds now, as another device would read it. */
  readonly held: Map<DocumentTableName, SyncDocument>
} {
  const held = new Map<DocumentTableName, SyncDocument>()
  return {
    held,
    fetch: (table) => netResult(async () => held.get(table) ?? null, { online }),
    push: (table, document, base) =>
      netResult(
        async () => {
          const current = held.get(table)
          if (!applies(current, document, base)) return current ?? null
          held.set(table, document)
          return null
        },
        { online },
      ),
  }
}
