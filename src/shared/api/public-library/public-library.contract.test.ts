import { describe, expect, it } from 'vitest'
import { createFakePublicLibrary } from './fake'
import type { PublicCategory } from './types'

const ANA = { id: 'ana', name: 'Ana' }
const song = (title: string) => ({ title, music: { key: 'C', meter: '4/4' } })

function library(who: { id: string; name: string } | null = ANA, online = true) {
  let author = who
  const public_ = createFakePublicLibrary({ author: () => author, online: () => online })
  return { library: public_, as: (next: typeof who) => (author = next) }
}

const publication = (
  sourceId: string,
  title: string,
  version = '1',
  category: PublicCategory | null = null,
) => ({
  kind: 'song' as const,
  sourceId,
  title,
  authorName: 'Ana',
  meta: { key: 'C', meter: '4/4' },
  category,
  body: song(title),
  version,
})

// What every PublicLibrary keeps (ADR 0116); the Supabase adapter was checked against the project.
describe('a public library', () => {
  it('publishes a learner’s song for anyone to find, and the newer version in its place', async () => {
    const { library: shelf, as } = library()
    const first = await shelf.publish(publication('my-1', 'Morning'))
    expect(first).toMatchObject({ ok: true, value: { sourceId: 'my-1' } })
    await shelf.publish(publication('my-1', 'Morning song', '2'))
    as(null)
    const found = await shelf.browse({ kind: 'song', sort: 'new', query: 'morn' })
    expect(found).toMatchObject({ ok: true, value: [{ title: 'Morning song', authorName: 'Ana' }] })
    const id = found.ok ? found.value[0]?.id : undefined
    expect(await shelf.item(id ?? '')).toMatchObject({
      ok: true,
      value: { body: song('Morning song') },
    })
  })

  it('refuses to publish, save or report without an account; reading needs none', async () => {
    const { library: shelf } = library(null)
    expect(await shelf.publish(publication('my-1', 'Morning'))).toMatchObject({
      ok: false,
      reason: 'refused',
    })
    expect(await shelf.browse({ kind: 'song', sort: 'new', query: '' })).toEqual({
      ok: true,
      value: [],
    })
  })

  it('counts a learner’s save once, and sorts by the most saved', async () => {
    const { library: shelf, as } = library()
    await shelf.publish(publication('my-1', 'One'))
    const two = await shelf.publish(publication('my-2', 'Two'))
    const id = two.ok ? two.value.id : ''
    as({ id: 'bo', name: 'Bo' })
    expect(await shelf.save(id)).toEqual({ ok: true, value: 1 })
    expect(await shelf.save(id)).toEqual({ ok: true, value: 1 })
    const sorted = await shelf.browse({ kind: 'song', sort: 'saved', query: '' })
    expect(sorted.ok && sorted.value.map((entry) => entry.title)).toEqual(['Two', 'One'])
  })

  it('lists and unpublishes only the learner’s own', async () => {
    const { library: shelf, as } = library()
    await shelf.publish(publication('my-1', 'One'))
    as({ id: 'bo', name: 'Bo' })
    await shelf.unpublish('my-1')
    expect(await shelf.mine()).toEqual({ ok: true, value: [] })
    as(ANA)
    expect(await shelf.mine()).toMatchObject({ ok: true, value: [{ sourceId: 'my-1' }] })
    await shelf.unpublish('my-1')
    expect(await shelf.browse({ kind: 'song', sort: 'new', query: '' })).toEqual({
      ok: true,
      value: [],
    })
  })

  it('says offline before asking', async () => {
    const { library: shelf } = library(ANA, false)
    expect(await shelf.browse({ kind: 'song', sort: 'new', query: '' })).toEqual({
      ok: false,
      reason: 'offline',
    })
  })

  it('keeps a song’s category, and browses one category', async () => {
    const { library: shelf } = library()
    await shelf.publish(publication('my-1', 'Minuet', '1', 'classical'))
    await shelf.publish(publication('my-2', 'Ballad', '1', 'pop'))
    const classical = await shelf.browse({
      kind: 'song',
      sort: 'new',
      query: '',
      category: 'classical',
    })
    expect(classical).toMatchObject({
      ok: true,
      value: [{ title: 'Minuet', category: 'classical' }],
    })
    const all = await shelf.browse({ kind: 'song', sort: 'new', query: '' })
    expect(all.ok && all.value.map((entry) => entry.category)).toEqual(['pop', 'classical'])
  })

  it('opens a song with the first line of its chart, for its card', async () => {
    const { library: shelf } = library()
    await shelf.publish({
      ...publication('my-1', 'Morning'),
      body: { ...song('Morning'), sections: [{ kind: 'verse', lines: ['C G Am F', 'C G C'] }] },
    })
    const found = await shelf.browse({ kind: 'song', sort: 'new', query: '' })
    expect(found).toMatchObject({ ok: true, value: [{ opening: 'C G Am F' }] })
  })

  it('rates once per learner, changes only their own, and shows no average under three', async () => {
    const { library: shelf, as } = library()
    const published = await shelf.publish(publication('my-1', 'Morning'))
    const id = published.ok ? published.value.id : ''
    expect(await shelf.rate(id, 5)).toEqual({ ok: true, value: { average: 5, count: 1 } })
    expect(await shelf.rate(id, 4)).toEqual({ ok: true, value: { average: 4, count: 1 } })
    expect(await shelf.myRating(id)).toEqual({ ok: true, value: 4 })
    as({ id: 'bo', name: 'Bo' })
    expect(await shelf.myRating(id)).toEqual({ ok: true, value: null })
    await shelf.rate(id, 3)
    as({ id: 'cy', name: 'Cy' })
    expect(await shelf.rate(id, 4)).toEqual({ ok: true, value: { average: 3.7, count: 3 } })
    as(null)
    expect(await shelf.rate(id, 5)).toMatchObject({ ok: false, reason: 'refused' })
    const found = await shelf.browse({ kind: 'song', sort: 'rated', query: '' })
    expect(found).toMatchObject({ ok: true, value: [{ rating: { average: 3.7, count: 3 } }] })
  })

  it('sorts the top rated first, then the rest by the newest', async () => {
    const { library: shelf, as } = library()
    const ids: string[] = []
    for (const title of ['Liked', 'Loved', 'Unrated']) {
      const made = await shelf.publish(publication(title, title))
      ids.push(made.ok ? made.value.id : '')
    }
    for (const [who, stars] of [
      ['a', [3, 5]],
      ['b', [4, 5]],
      ['c', [4, 4]],
    ] as const) {
      as({ id: who, name: who })
      await shelf.rate(ids[0] ?? '', stars[0])
      await shelf.rate(ids[1] ?? '', stars[1])
    }
    const sorted = await shelf.browse({ kind: 'song', sort: 'rated', query: '' })
    expect(sorted.ok && sorted.value.map((entry) => entry.title)).toEqual([
      'Loved',
      'Liked',
      'Unrated',
    ])
  })

  it('refuses a rating outside one to five stars', async () => {
    const { library: shelf } = library()
    const published = await shelf.publish(publication('my-1', 'Morning'))
    const id = published.ok ? published.value.id : ''
    expect(await shelf.rate(id, 6)).toMatchObject({ ok: false, reason: 'refused' })
  })
})
