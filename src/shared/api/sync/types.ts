import type { SyncDocument } from '@/shared/lib/sync'
import type { NetResult } from '../network'
import type { DocumentTableName } from '../supabase'

/**
 * The cloud copy of each of the learner's stores (ADR 0116): one document a table, its id `state`.
 * A push names the copy it was based on; the server applies it only over that copy, else gives back
 * the copy it holds, for the device to merge and push again.
 */
export interface CloudSync {
  /** The table's document, or none where the learner never synced it. */
  fetch(table: DocumentTableName): Promise<NetResult<SyncDocument | null>>
  /** None where it was applied; the server's copy where it was refused over that one. */
  push(
    table: DocumentTableName,
    document: SyncDocument,
    base: SyncDocument | null,
  ): Promise<NetResult<SyncDocument | null>>
}

/** Every store's one document goes by this id. */
export const STATE_ID = 'state'
