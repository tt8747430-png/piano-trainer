import { describe, expect, it } from 'vitest'
import type { NetResult } from '../network'
import { createMemoryContentCache, type ContentItem } from './cache'
import { fetchContentUpdates, type ContentRemote } from './updates'

const item = (id: string, version: string): ContentItem => ({
  kind: 'piece',
  id,
  version,
  body: { id, version },
})

/** A database publishing `items`, counting the bodies it was asked for. */
function remoteOf(items: readonly ContentItem[], online = true) {
  const asked: string[] = []
  const offline: NetResult<never> = { ok: false, reason: 'offline' }
  const remote: ContentRemote = {
    versions: async () =>
      online
        ? { ok: true, value: items.map(({ kind, id, version }) => ({ kind, id, version })) }
        : offline,
    bodies: async (kind, ids) => {
      asked.push(...ids)
      return {
        ok: true,
        value: items.filter((each) => each.kind === kind && ids.includes(each.id)),
      }
    },
  }
  return { remote, asked }
}

const BUNDLED: Record<string, string> = { bz5: 'v1', ode: 'v1' }
const bundled = (_kind: string, id: string) => BUNDLED[id]

describe('fetchContentUpdates', () => {
  it('brings what changed and what is new, leaving what the app carries as it is', async () => {
    const cache = createMemoryContentCache()
    const { remote, asked } = remoteOf([item('bz5', 'v2'), item('ode', 'v1'), item('new', 'v1')])
    expect(await fetchContentUpdates({ remote, cache, bundled })).toEqual({ ok: true, value: 2 })
    expect(asked).toEqual(['bz5', 'new'])
    expect((await cache.all()).map(({ id, version }) => `${id}@${version}`)).toEqual([
      'bz5@v2',
      'new@v1',
    ])
  })

  it('asks for nothing it already keeps', async () => {
    const cache = createMemoryContentCache([item('bz5', 'v2')])
    const { remote, asked } = remoteOf([item('bz5', 'v2'), item('ode', 'v1')])
    expect(await fetchContentUpdates({ remote, cache, bundled })).toEqual({ ok: true, value: 0 })
    expect(asked).toEqual([])
  })

  it('lets go of what the app now carries, and of what is no longer published', async () => {
    const cache = createMemoryContentCache([item('bz5', 'v1'), item('gone', 'v1')])
    const { remote } = remoteOf([item('bz5', 'v1'), item('ode', 'v1')])
    await fetchContentUpdates({ remote, cache, bundled })
    expect(await cache.all()).toEqual([])
  })

  it('says offline and keeps what it has', async () => {
    const cache = createMemoryContentCache([item('bz5', 'v2')])
    const { remote } = remoteOf([], false)
    expect(await fetchContentUpdates({ remote, cache, bundled })).toEqual({
      ok: false,
      reason: 'offline',
    })
    expect(await cache.all()).toHaveLength(1)
  })
})
