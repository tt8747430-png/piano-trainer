import { netResult } from '../network'
import type { PublicEntry, PublicLibrary, Published } from './types'

const refused = (message: string) => Object.assign(new Error(message), { status: 403 })

interface Held extends PublicEntry {
  readonly sourceId: string
  readonly author: string
  readonly version: string
  readonly body: unknown
}

/**
 * The Public library in memory for tests, behaving as the server does: `author()` is who is signed
 * in (null for no one), `online` the device's connection; `items` are already published by others.
 */
export function createFakePublicLibrary({
  author = () => null,
  online = () => true,
  items = [],
}: {
  author?: () => { readonly id: string; readonly name: string } | null
  online?: () => boolean
  items?: readonly (Omit<PublicEntry, 'saves' | 'publishedAt'> & { body: unknown })[]
} = {}): PublicLibrary & { readonly reports: { id: string; reason: string; note: string }[] } {
  let clock = 0
  const at = () => new Date(Date.UTC(2026, 9, 29, 10, clock++)).toISOString()
  const held = new Map<string, Held>(
    items.map((item) => [
      item.id,
      { ...item, saves: 0, publishedAt: at(), sourceId: item.id, author: 'someone', version: '1' },
    ]),
  )
  const saved = new Set<string>()
  const reports: { id: string; reason: string; note: string }[] = []
  let next = 1
  const ask = <T>(run: () => Promise<T>) => netResult(run, { online })
  const signedIn = () => {
    const who = author()
    if (!who) throw refused('Not signed in')
    return who
  }
  const entryOf = ({ id, title, authorName, saves, publishedAt, meta }: Held): PublicEntry => ({
    id,
    title,
    authorName,
    saves,
    publishedAt,
    meta,
  })
  return {
    reports,
    browse: ({ sort, query }) =>
      ask(async () =>
        [...held.values()]
          .filter((item) => item.title.toLowerCase().includes(query.trim().toLowerCase()))
          .sort((a, b) =>
            sort === 'saved' ? b.saves - a.saves : b.publishedAt.localeCompare(a.publishedAt),
          )
          .map(entryOf),
      ),
    item: (id) =>
      ask(async () => {
        const item = held.get(id)
        return item ? { entry: entryOf(item), body: item.body } : null
      }),
    publish: (publication) =>
      ask(async () => {
        const who = signedIn()
        const same = [...held.values()].find(
          (item) => item.author === who.id && item.sourceId === publication.sourceId,
        )
        const id = same?.id ?? `public-${next++}`
        held.set(id, {
          ...publication,
          id,
          author: who.id,
          saves: same?.saves ?? 0,
          publishedAt: same?.publishedAt ?? at(),
        })
        return { sourceId: publication.sourceId, id, version: publication.version }
      }),
    unpublish: (sourceId) =>
      ask(async () => {
        const who = signedIn()
        for (const item of held.values())
          if (item.author === who.id && item.sourceId === sourceId) held.delete(item.id)
      }),
    mine: () =>
      ask(async () => {
        const who = signedIn()
        return [...held.values()]
          .filter((item) => item.author === who.id)
          .map((item): Published => ({
            sourceId: item.sourceId,
            id: item.id,
            version: item.version,
          }))
      }),
    save: (id) =>
      ask(async () => {
        const who = signedIn()
        const item = held.get(id)
        if (!item) throw Object.assign(new Error('Not found'), { status: 404 })
        if (!saved.has(`${who.id} ${id}`)) {
          saved.add(`${who.id} ${id}`)
          held.set(id, { ...item, saves: item.saves + 1 })
        }
        return held.get(id)?.saves ?? 0
      }),
    report: (id, reason, note) =>
      ask(async () => {
        signedIn()
        reports.push({ id, reason, note })
      }),
  }
}
