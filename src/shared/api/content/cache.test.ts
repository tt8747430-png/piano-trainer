import { IDBFactory } from 'fake-indexeddb'
import { describe, expect, it } from 'vitest'
import { createBrowserContentCache, type ContentItem } from './cache'

const song = (id: string, version = 'v1'): ContentItem => ({
  kind: 'piece',
  id,
  version,
  body: { id, sections: [] },
})

describe('the browser content cache', () => {
  it('keeps items across opens, a newer one in place of the older', async () => {
    const factory = new IDBFactory()
    await createBrowserContentCache(factory).put([song('bz5'), song('ode')])
    const reopened = createBrowserContentCache(factory)
    await reopened.put([song('bz5', 'v2')])
    expect((await reopened.all()).map(({ id, version }) => `${id}@${version}`).sort()).toEqual([
      'bz5@v2',
      'ode@v1',
    ])
  })

  it('removes what it is told to', async () => {
    const cache = createBrowserContentCache(new IDBFactory())
    await cache.put([song('bz5'), song('ode')])
    await cache.remove([['piece', 'bz5']])
    expect((await cache.all()).map(({ id }) => id)).toEqual(['ode'])
  })

  it('keeps nothing, and never fails, where there is no IndexedDB', async () => {
    const cache = createBrowserContentCache(undefined)
    await cache.put([song('bz5')])
    expect(await cache.all()).toEqual([song('bz5')])
    const broken = {
      open: () => {
        throw new Error('blocked')
      },
    } as unknown as globalThis.IDBFactory
    expect(await createBrowserContentCache(broken).all()).toEqual([])
  })
})
