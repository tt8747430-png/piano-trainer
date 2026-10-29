import type { SyncDocument } from '@/shared/lib/sync'
import { netResult, type NetOptions } from '../network'
import type { DocumentTableName, Json, PianoClient } from '../supabase'
import { STATE_ID, type CloudSync } from './types'

interface Row {
  readonly id: string
  readonly data: Json
  readonly deleted: boolean
}

/** A row as the device's document: the device's clock is kept in the data, where the server reads it. */
function documentOf({ id, data, deleted }: Row): SyncDocument {
  const fields = typeof data === 'object' && data !== null && !Array.isArray(data) ? data : {}
  const { updatedAt, ...rest } = fields
  return { id, data: rest, updatedAt: typeof updatedAt === 'string' ? updatedAt : '', deleted }
}

const rowOf = (document: SyncDocument) => ({
  id: document.id,
  data: { ...document.data, updatedAt: document.updatedAt } as Json,
  deleted: document.deleted,
})

/** The cloud on Supabase (ADR 0116): a select the learner's row-level security narrows, and `push_documents`. */
export function createSupabaseCloud(client: PianoClient, { online }: NetOptions = {}): CloudSync {
  const ask = <T>(run: () => Promise<T>) => netResult(run, online ? { online } : {})
  return {
    fetch: (table: DocumentTableName) =>
      ask(async () => {
        const { data, error, status } = await client
          .from(table)
          .select('id, data, deleted')
          .eq('id', STATE_ID)
          .maybeSingle()
        if (error) throw Object.assign(new Error(error.message), { status })
        return data ? documentOf(data) : null
      }),
    push: (table, document, base) =>
      ask(async () => {
        const row = {
          ...rowOf(document),
          ...(base ? { base: base.updatedAt, base_deleted: base.deleted } : {}),
        }
        const { data, error, status } = await client.rpc('push_documents', {
          p_table: table,
          p_rows: [row],
        })
        if (error) throw Object.assign(new Error(error.message), { status })
        const [refused] = Array.isArray(data) ? data : []
        return refused && typeof refused === 'object' && !Array.isArray(refused)
          ? documentOf(refused as unknown as Row)
          : null
      }),
  }
}
