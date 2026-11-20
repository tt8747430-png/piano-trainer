import { isRecord } from '@/shared/lib'
import type { SyncDocument } from '@/shared/lib/sync'
import { netResult, type NetOptions } from '../network'
import {
  isJson,
  toJson,
  type Backend,
  type DocumentTableName,
  type Json,
  type PianoClient,
} from '../supabase'
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

/**
 * Data as `jsonb` holds it: no NUL character, which it refuses (and with it the whole push). A NUL comes
 * in with a file, a MIDI track name padded with them; it is never something the learner typed.
 */
const storable = (data: unknown): Json =>
  toJson(data, (_, value) => (typeof value === 'string' ? value.replaceAll('\u0000', '') : value))

/** Whether a value the server answered with is a document's row. */
const isRow = (value: unknown): value is Row =>
  isRecord(value) &&
  typeof value.id === 'string' &&
  isJson(value.data) &&
  typeof value.deleted === 'boolean'

const rowOf = (document: SyncDocument) => ({
  id: document.id,
  data: storable({ ...document.data, updatedAt: document.updatedAt }),
  deleted: document.deleted,
})

/** The cloud on Supabase (ADR 0116): a select the learner's row-level security narrows, and `push_documents`. */
export function createSupabaseCloud(backend: Backend, { online }: NetOptions = {}): CloudSync {
  const ask = <T>(run: (client: PianoClient) => Promise<T>) =>
    netResult(async () => run(await backend()), online ? { online } : {})
  return {
    fetch: (table: DocumentTableName) =>
      ask(async (client) => {
        const { data, error, status } = await client
          .from(table)
          .select('id, data, deleted')
          .eq('id', STATE_ID)
          .maybeSingle()
        if (error) throw Object.assign(new Error(error.message), { status })
        return data ? documentOf(data) : null
      }),
    push: (table, document, base) =>
      ask(async (client) => {
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
        return isRow(refused) ? documentOf(refused) : null
      }),
  }
}
