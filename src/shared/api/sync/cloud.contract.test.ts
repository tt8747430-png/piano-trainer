import { describe, expect, it } from 'vitest'
import type { SyncDocument } from '@/shared/lib/sync'
import { createFakeCloud } from './fake-cloud'

const doc = (data: Record<string, unknown>, updatedAt: string, deleted = false): SyncDocument => ({
  id: 'state',
  data,
  updatedAt,
  deleted,
})

// What the server does with a push (supabase/migrations/…_push_documents.sql), held by the fake; the
// project itself passes supabase/tests/access.sql, which checks the same rule.
describe('the cloud', () => {
  it('holds nothing for a learner who never synced', async () => {
    expect(await createFakeCloud().fetch('settings')).toEqual({ ok: true, value: null })
  })

  it('takes a first push, and gives it back', async () => {
    const cloud = createFakeCloud()
    const first = doc({ theme: 'dark' }, '2026-10-29T10:00:00Z')
    expect(await cloud.push('settings', first, null)).toEqual({ ok: true, value: null })
    expect(await cloud.fetch('settings')).toEqual({ ok: true, value: first })
  })

  it('takes a push based on the copy it holds, and refuses one based on another, giving its own', async () => {
    const cloud = createFakeCloud()
    const first = doc({ theme: 'dark' }, '2026-10-29T10:00:00Z')
    await cloud.push('settings', first, null)
    const second = doc({ theme: 'light' }, '2026-10-29T10:01:00Z')
    expect(await cloud.push('settings', second, first)).toEqual({ ok: true, value: null })
    const stale = doc({ theme: 'system' }, '2026-10-29T10:02:00Z')
    expect(await cloud.push('settings', stale, first)).toEqual({ ok: true, value: second })
  })

  it('takes a push with no base only where its clock is the newer', async () => {
    const cloud = createFakeCloud()
    const held = doc({ theme: 'dark' }, '2026-10-29T10:05:00Z')
    await cloud.push('settings', held, null)
    expect(await cloud.push('settings', doc({}, '2026-10-29T10:01:00Z'), null)).toEqual({
      ok: true,
      value: held,
    })
  })

  it('keeps each table apart, and says offline before asking', async () => {
    let online = true
    const cloud = createFakeCloud({ online: () => online })
    await cloud.push('settings', doc({ theme: 'dark' }, '2026-10-29T10:00:00Z'), null)
    expect(await cloud.fetch('progress')).toEqual({ ok: true, value: null })
    online = false
    expect(await cloud.fetch('settings')).toEqual({ ok: false, reason: 'offline' })
  })
})
