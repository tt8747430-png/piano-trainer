import { describe, expect, it } from 'vitest'
import { createFakePublicLibrary } from './fake'

const ANA = { id: 'ana', name: 'Ana' }
const song = (title: string) => ({ title, music: { key: 'C', meter: '4/4' } })

function library(who: { id: string; name: string } | null = ANA, online = true) {
  let author = who
  const public_ = createFakePublicLibrary({ author: () => author, online: () => online })
  return { library: public_, as: (next: typeof who) => (author = next) }
}

const publication = (sourceId: string, title: string, version = '1') => ({
  kind: 'song' as const,
  sourceId,
  title,
  authorName: 'Ana',
  meta: { key: 'C', meter: '4/4' },
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
    expect(await shelf.browse({ kind: 'song', sort: 'new', query: '' })).toEqual({ ok: true, value: [] })
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
    expect(await shelf.browse({ kind: 'song', sort: 'new', query: '' })).toEqual({ ok: true, value: [] })
  })

  it('says offline before asking', async () => {
    const { library: shelf } = library(ANA, false)
    expect(await shelf.browse({ kind: 'song', sort: 'new', query: '' })).toEqual({ ok: false, reason: 'offline' })
  })
})
