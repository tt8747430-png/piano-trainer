import { afterEach, describe, expect, it, vi } from 'vitest'
import { pieceById } from '@/entities/piece'
import {
  createMemoryContentCache,
  keepContent,
  type ContentItem,
  type ContentRemote,
} from '@/shared/api/content'
import { untilTestEnds } from '@/shared/test/listeners'
import { applyKeptContent, startContentUpdates } from './content-updates'
import { bundledVersions } from './export-content'

afterEach(() => keepContent([]))

const original = pieceById('bz5')
const revised: ContentItem = {
  kind: 'piece',
  id: 'bz5',
  version: 'revised',
  body: { ...original, title: 'Revised' },
}

/** A database that publishes the app's own content, but bz5 revised. */
function remote(): ContentRemote & { asked: string[] } {
  const asked: string[] = []
  return {
    asked,
    versions: async () => ({
      ok: true,
      value: [...bundledVersions()].map(([key, version]) => {
        const [kind = '', id = ''] = key.split(' ')
        return id === 'bz5'
          ? { kind: 'piece' as const, id, version: 'revised' }
          : { kind: kind as 'piece' | 'lesson', id, version }
      }),
    }),
    bodies: async (_kind, ids) => {
      asked.push(...ids)
      return { ok: true, value: ids.includes('bz5') ? [revised] : [] }
    },
  }
}

describe('content updates', () => {
  it('brings only what the database changed, kept for the next start', async () => {
    const cache = createMemoryContentCache()
    const database = remote()
    const stop = startContentUpdates({
      remote: database,
      cache,
      tabs: new EventTarget(),
      later: (run) => run(),
    })
    await vi.waitFor(async () => expect(await cache.all()).toEqual([revised]))
    expect(database.asked).toEqual(['bz5'])
    expect(pieceById('bz5')).toBe(original)
    stop()
  })

  it('reads what is kept into the run at start', async () => {
    expect(await applyKeptContent(createMemoryContentCache([revised]))).toBe(1)
    expect(pieceById('bz5')?.title).toBe('Revised')
  })

  it('asks again when the device comes back online, and no more once stopped', async () => {
    const tabs = new EventTarget()
    const database = remote()
    const versions = vi.spyOn(database, 'versions')
    const stop = startContentUpdates({
      remote: database,
      cache: createMemoryContentCache(),
      tabs,
      later: () => {},
    })
    untilTestEnds().addEventListener('abort', stop)
    tabs.dispatchEvent(new Event('online'))
    await vi.waitFor(() => expect(versions).toHaveBeenCalledTimes(1))
    stop()
    tabs.dispatchEvent(new Event('online'))
    expect(versions).toHaveBeenCalledTimes(1)
  })
})
