import { describe, expect, it } from 'vitest'
import { contentHash } from '@/shared/lib'
import { createFakeContentEditing } from './fake'

const ITEM = { kind: 'lesson' as const, id: 'scales', body: { id: 'scales', v: 1 }, meta: {} }

function editing({ editor = true, online = true } = {}) {
  let state = { editor, online }
  const port = createFakeContentEditing({
    items: [ITEM],
    editor: () => state.editor,
    online: () => state.online,
  })
  return { port, set: (next: Partial<typeof state>) => (state = { ...state, ...next }) }
}

// What every ContentEditingPort keeps (ADR 0116); the Supabase adapter was checked against the project.
describe('editing the built-in content', () => {
  it('keeps a draft until it is published, then the item reads as the draft', async () => {
    const { port } = editing()
    expect(await port.draft('lesson', 'scales')).toEqual({ ok: true, value: null })
    const body = { id: 'scales', v: 2 }
    expect(await port.saveDraft('lesson', 'scales', { body, meta: { title: 'S' } })).toEqual({
      ok: true,
      value: undefined,
    })
    expect(await port.draft('lesson', 'scales')).toMatchObject({ ok: true, value: { body } })
    const published = await port.publish('lesson', 'scales')
    expect(published).toEqual({ ok: true, value: contentHash(JSON.stringify(body)) })
    expect(await port.draft('lesson', 'scales')).toEqual({ ok: true, value: null })
    expect(port.body('lesson', 'scales')).toEqual(body)
  })

  it('keeps every version published, the newest first, and restores one', async () => {
    const { port } = editing()
    const first = contentHash(JSON.stringify(ITEM.body))
    await port.saveDraft('lesson', 'scales', { body: { id: 'scales', v: 2 }, meta: {} })
    const second = await port.publish('lesson', 'scales')
    const kept = await port.versions('lesson', 'scales')
    expect(kept.ok && kept.value.map((each) => each.version)).toEqual([
      second.ok && second.value,
      first,
    ])
    expect(await port.restore('lesson', 'scales', first)).toEqual({ ok: true, value: undefined })
    expect(port.body('lesson', 'scales')).toEqual(ITEM.body)
  })

  it('discards a draft, and has nothing to publish without one', async () => {
    const { port } = editing()
    await port.saveDraft('lesson', 'scales', { body: { id: 'scales', v: 3 }, meta: {} })
    await port.discardDraft('lesson', 'scales')
    expect(await port.draft('lesson', 'scales')).toEqual({ ok: true, value: null })
    expect(await port.publish('lesson', 'scales')).toMatchObject({ ok: false, reason: 'refused' })
  })

  it('shows anyone but an editor nothing and refuses their changes, and a draft of no item', async () => {
    const { port, set } = editing({ editor: false })
    expect(await port.draft('lesson', 'scales')).toEqual({ ok: true, value: null })
    expect(await port.versions('lesson', 'scales')).toEqual({ ok: true, value: [] })
    expect(await port.saveDraft('lesson', 'scales', { body: {}, meta: {} })).toMatchObject({
      ok: false,
      reason: 'refused',
    })
    expect(await port.restore('lesson', 'scales', 'x')).toMatchObject({
      ok: false,
      reason: 'refused',
    })
    set({ editor: true })
    expect(await port.saveDraft('lesson', 'nothing', { body: {}, meta: {} })).toMatchObject({
      ok: false,
      reason: 'refused',
    })
  })

  it('says it is offline without a connection', async () => {
    const { port } = editing({ online: false })
    expect(await port.versions('lesson', 'scales')).toMatchObject({ ok: false, reason: 'offline' })
  })
})
