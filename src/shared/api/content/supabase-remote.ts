import { netResult, type NetOptions } from '../network'
import type { PianoClient } from '../supabase'
import type { ContentItem } from './cache'
import { isContentKind } from './port'
import type { ContentRemote } from './updates'

/** A row's content kind, or none: the database holds kinds this app does not read yet. */
const ofKnownKind = <R extends { kind: string }>(row: R): row is R & Pick<ContentItem, 'kind'> =>
  isContentKind(row.kind)

/** What the project publishes to this learner (ADR 0116): row-level security picks the rows. */
export function createSupabaseContentRemote(
  client: PianoClient,
  { online }: NetOptions = {},
): ContentRemote {
  const ask = <T>(run: () => Promise<T>) => netResult(run, online ? { online } : {})
  return {
    versions: () =>
      ask(async () => {
        const { data, error, status } = await client
          .from('content_items')
          .select('kind, id, version')
          .eq('status', 'published')
        if (error) throw Object.assign(new Error(error.message), { status })
        return data.filter(ofKnownKind)
      }),
    bodies: (kind, ids) =>
      ask(async () => {
        const { data, error, status } = await client
          .from('content_items')
          .select('kind, id, version, body')
          .eq('kind', kind)
          .in('id', [...ids])
        if (error) throw Object.assign(new Error(error.message), { status })
        return data.filter(ofKnownKind)
      }),
  }
}
