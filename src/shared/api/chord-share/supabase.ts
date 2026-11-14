import { netResult, type NetOptions } from '../network'
import type { Backend, PianoClient } from '../supabase'
import type { ChordSharePort, LivePlace, OnlineSheet, SheetLine } from './types'

const thrown = (error: { message: string }, status: number) =>
  Object.assign(new Error(error.message), { status })

const isPlace = (value: unknown): value is LivePlace =>
  typeof value === 'object' &&
  value !== null &&
  'section' in value &&
  'index' in value &&
  typeof value.section === 'number' &&
  typeof value.index === 'number'

/**
 * Shared chord sheets on Supabase (R39-10): `shared_chord_sheets` under the owner's policy,
 * `read_shared_chord_sheet` and `write_shared_chord_sheet` for the link, and the sheet's Realtime
 * topic `chord-sheet:<id>`: the server's `changed` pings and the copies' own `playing`.
 */
export function createSupabaseChordShare(
  backend: Backend,
  { online }: NetOptions = {},
): ChordSharePort {
  const ask = <T>(run: (client: PianoClient) => Promise<T>) =>
    netResult(async () => run(await backend()), online ? { online } : {})
  return {
    share: (sheetKey, name, { body, style, tempo }, canEdit) =>
      ask(async (client) => {
        const { data: session } = await client.auth.getSession()
        if (!session.session) throw thrown({ message: 'Not signed in' }, 401)
        const { data, error, status } = await client
          .from('shared_chord_sheets')
          .upsert(
            { sheet_key: sheetKey, name, body, style, tempo, can_edit: canEdit },
            { onConflict: 'owner,sheet_key' },
          )
          .select('id')
          .single()
        if (error) throw thrown(error, status)
        return data.id
      }),
    setAccess: (id, canEdit) =>
      ask(async (client) => {
        const { error, status } = await client
          .from('shared_chord_sheets')
          .update({ can_edit: canEdit })
          .eq('id', id)
        if (error) throw thrown(error, status)
      }),
    read: (id) =>
      ask(async (client): Promise<OnlineSheet | null> => {
        const { data, error, status } = await client.rpc('read_shared_chord_sheet', { p_id: id })
        if (error) throw thrown(error, status)
        const [row] = data
        return row
          ? {
              name: row.name,
              body: row.body,
              style: row.style,
              tempo: row.tempo,
              canEdit: row.can_edit,
              revision: row.revision,
              mine: row.mine,
            }
          : null
      }),
    write: (id, { body, style, tempo }) =>
      ask(async (client) => {
        const { data, error, status } = await client.rpc('write_shared_chord_sheet', {
          p_id: id,
          p_body: body,
          p_style: style,
          p_tempo: tempo,
        })
        if (error) throw thrown(error, status === 200 ? 403 : status)
        return data
      }),
    open(id, { onChanged, onPlaying }): SheetLine {
      let closed = false
      let send: (place: LivePlace | null) => void = () => undefined
      let leave = () => undefined as void
      void backend().then((client) => {
        if (closed) return
        const channel = client
          .channel(`chord-sheet:${id}`, { config: { broadcast: { self: false } } })
          .on('broadcast', { event: 'changed' }, ({ payload }) => {
            const revision: unknown = payload?.revision
            if (typeof revision === 'number') onChanged(revision)
          })
          .on('broadcast', { event: 'playing' }, ({ payload }) => {
            const place: unknown = payload?.place
            onPlaying(isPlace(place) ? place : null)
          })
          .subscribe()
        send = (place) =>
          void channel.send({ type: 'broadcast', event: 'playing', payload: { place } })
        leave = () => void client.removeChannel(channel)
      })
      return {
        sendPlaying: (place) => send(place),
        close() {
          closed = true
          leave()
        },
      }
    },
  }
}
