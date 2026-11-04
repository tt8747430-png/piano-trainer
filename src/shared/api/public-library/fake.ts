import { netResult } from '../network'
import {
  RATED_MIN,
  type PublicEntry,
  type PublicLibrary,
  type PublicRating,
  type Published,
} from './types'

const refused = (message: string) => Object.assign(new Error(message), { status: 403 })

interface Held extends Omit<PublicEntry, 'rating' | 'opening'> {
  readonly sourceId: string
  readonly author: string
  readonly version: string
  readonly body: unknown
}

/** A song body's first line of its chart, as the server reads it (`body->sections->0->lines->0`). */
function openingOf(body: unknown): string | undefined {
  if (typeof body !== 'object' || body === null || !('sections' in body)) return undefined
  const { sections } = body
  if (!Array.isArray(sections)) return undefined
  const first: unknown = sections[0]
  if (typeof first !== 'object' || first === null || !('lines' in first)) return undefined
  const { lines } = first
  const line: unknown = Array.isArray(lines) ? lines[0] : undefined
  return typeof line === 'string' ? line : undefined
}

/** An average to one decimal, as the server's view rounds it. */
const averageOf = (stars: readonly number[]) =>
  Math.round((stars.reduce((sum, each) => sum + each, 0) / stars.length) * 10) / 10

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
  items?: readonly (Omit<
    PublicEntry,
    'saves' | 'publishedAt' | 'kind' | 'category' | 'rating' | 'authorAvatar' | 'opening'
  > & {
    kind?: PublicEntry['kind']
    category?: PublicEntry['category']
    authorAvatar?: string | null
    /** Ratings already given, each a learner's stars. */
    stars?: readonly number[]
    body: unknown
  })[]
} = {}): PublicLibrary & { readonly reports: { id: string; reason: string; note: string }[] } {
  let clock = 0
  const at = () => new Date(Date.UTC(2026, 9, 29, 10, clock++)).toISOString()
  const held = new Map<string, Held>(
    items.map(({ stars: _stars, ...item }) => [
      item.id,
      {
        ...item,
        kind: item.kind ?? 'song',
        category: item.category ?? null,
        authorAvatar: item.authorAvatar ?? null,
        saves: 0,
        publishedAt: at(),
        sourceId: item.id,
        author: 'someone',
        version: '1',
      },
    ]),
  )
  // Each item's ratings, by who gave them.
  const ratings = new Map<string, Map<string, number>>(
    items.map((item) => [
      item.id,
      new Map((item.stars ?? []).map((stars, i) => [`rater-${i}`, stars])),
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
  const ratingOf = (id: string): PublicRating | null => {
    const given = [...(ratings.get(id)?.values() ?? [])]
    return given.length === 0 ? null : { average: averageOf(given), count: given.length }
  }
  const entryOf = (item: Held): PublicEntry => {
    const opening = item.kind === 'song' ? openingOf(item.body) : undefined
    return {
      id: item.id,
      kind: item.kind,
      title: item.title,
      authorName: item.authorName,
      authorAvatar: item.authorAvatar,
      saves: item.saves,
      publishedAt: item.publishedAt,
      category: item.category,
      rating: ratingOf(item.id),
      ...(opening ? { opening } : {}),
      meta: item.meta,
    }
  }
  /** Top rated: an average over enough ratings, highest first; the rest after. */
  const ratedScore = (entry: PublicEntry) =>
    entry.rating && entry.rating.count >= RATED_MIN ? entry.rating.average : -1
  return {
    reports,
    browse: ({ kind, sort, query, category }) =>
      ask(async () =>
        [...held.values()]
          .filter((item) => item.kind === kind)
          .filter((item) => !category || item.category === category)
          .filter((item) => item.title.toLowerCase().includes(query.trim().toLowerCase()))
          .map(entryOf)
          .sort(
            (a, b) =>
              (sort === 'saved'
                ? b.saves - a.saves
                : sort === 'rated'
                  ? ratedScore(b) - ratedScore(a)
                  : 0) || b.publishedAt.localeCompare(a.publishedAt),
          ),
      ),
    item: (id) =>
      ask(async () => {
        const item = held.get(id)
        return item ? { entry: entryOf(item), body: item.body } : null
      }),
    publish: ({ category, ...publication }) =>
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
          authorAvatar: null,
          category: publication.kind === 'song' ? (category ?? null) : null,
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
    rate: (id, stars) =>
      ask(async () => {
        const who = signedIn()
        if (!Number.isInteger(stars) || stars < 1 || stars > 5) throw refused('1 to 5 stars')
        if (!held.has(id)) throw Object.assign(new Error('Not found'), { status: 404 })
        const given = ratings.get(id) ?? new Map<string, number>()
        given.set(who.id, stars)
        ratings.set(id, given)
        return ratingOf(id) ?? { average: stars, count: 1 }
      }),
    myRating: (id) =>
      ask(async () => {
        const who = author()
        return who ? (ratings.get(id)?.get(who.id) ?? null) : null
      }),
  }
}
