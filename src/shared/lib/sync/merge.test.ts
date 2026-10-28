import { describe, expect, it } from 'vitest'
import { byId, byKey, mergeDocuments, type SyncDocument } from './merge'

const doc = (data: Record<string, unknown>, updatedAt: string, deleted = false): SyncDocument => ({
  id: 'settings',
  data,
  updatedAt,
  deleted,
})

describe('mergeDocuments', () => {
  const base = doc({ theme: 'system', language: 'en', volume: 5 }, '2026-10-29T10:00:00Z')

  it('keeps a field only one side changed from each side, with the later clock', () => {
    const mine = doc({ theme: 'dark', language: 'en', volume: 5 }, '2026-10-29T10:01:00Z')
    const theirs = doc({ theme: 'system', language: 'ru', volume: 5 }, '2026-10-29T10:02:00Z')
    expect(mergeDocuments(mine, theirs, base)).toEqual({
      document: doc({ theme: 'dark', language: 'ru', volume: 5 }, '2026-10-29T10:02:00Z'),
      clash: false,
    })
  })

  it('gives a field both changed to the newer side, or to the rule it has', () => {
    const mine = doc({ theme: 'dark', language: 'en', volume: 7 }, '2026-10-29T10:03:00Z')
    const theirs = doc({ theme: 'light', language: 'en', volume: 9 }, '2026-10-29T10:02:00Z')
    const sum = (a: unknown, b: unknown, was: unknown) => Number(a) + Number(b) - Number(was)
    expect(mergeDocuments(mine, theirs, base, { both: { volume: sum } }).document.data).toEqual({
      theme: 'dark',
      language: 'en',
      volume: 11,
    })
  })

  it('compares a field by its value, however deep', () => {
    const nested = doc({ keys: { a: [1, 2] } }, '2026-10-29T10:00:00Z')
    const mine = doc({ keys: { a: [1, 2] } }, '2026-10-29T10:05:00Z')
    const theirs = doc({ keys: { a: [1, 2, 3] } }, '2026-10-29T10:01:00Z')
    expect(mergeDocuments(mine, theirs, nested).document.data).toEqual({ keys: { a: [1, 2, 3] } })
  })

  it('keeps a deletion the other side left alone', () => {
    const deleted = doc(base.data, '2026-10-29T10:04:00Z', true)
    expect(mergeDocuments(deleted, base, base)).toMatchObject({
      document: { deleted: true },
      clash: false,
    })
  })

  it('keeps the changed copy where a deletion meets a change, and says they clash', () => {
    const deleted = doc(base.data, '2026-10-29T10:04:00Z', true)
    const edited = doc({ ...base.data, theme: 'dark' }, '2026-10-29T10:05:00Z')
    expect(mergeDocuments(deleted, edited, base)).toEqual({
      document: { ...edited, updatedAt: '2026-10-29T10:05:00Z' },
      clash: true,
    })
  })

  it('leaves out a field the side it comes from has not got', () => {
    const mine = doc({ theme: 'system', language: 'en' }, '2026-10-29T10:01:00Z')
    expect(mergeDocuments(mine, base, base).document.data).toEqual({
      theme: 'system',
      language: 'en',
    })
  })
})

describe('byKey and byId', () => {
  it('merges a record item by item: each side keeps its own changes, and a removal stands', () => {
    const base = { a: 1, b: 1, c: 1 }
    expect(byKey({ a: 2, b: 1, c: 1 }, { a: 1, b: 3 }, base)).toEqual({ a: 2, b: 3 })
  })

  it('keeps an item one side removed where the other changed it', () => {
    expect(byKey({ b: 1 }, { a: 5, b: 1 }, { a: 1, b: 1 })).toEqual({ a: 5, b: 1 })
  })

  it('merges a list by id, in this device’s order, the other device’s new items after', () => {
    const base = [{ id: 's1', title: 'One' }]
    const mine = [
      { id: 's2', title: 'Two' },
      { id: 's1', title: 'One' },
    ]
    const theirs = [
      { id: 's1', title: 'One!' },
      { id: 's3', title: 'Three' },
    ]
    expect(byId(mine, theirs, base)).toEqual([
      { id: 's2', title: 'Two' },
      { id: 's1', title: 'One!' },
      { id: 's3', title: 'Three' },
    ])
  })
})
