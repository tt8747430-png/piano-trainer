import { describe, expect, it, vi } from 'vitest'
import type { PianoClient } from '../supabase'
import { createSupabaseContentRemote } from './supabase-remote'
import { backendOf } from '../supabase'

/** A client whose `content_items` answers `rows`, recording the filters asked. */
function clientAnswering(rows: unknown[], status = 200, error: { message: string } | null = null) {
  const asked: unknown[][] = []
  const query = {
    select: (...args: unknown[]) => (asked.push(['select', ...args]), query),
    eq: (...args: unknown[]) => (asked.push(['eq', ...args]), query),
    in: (...args: unknown[]) => (asked.push(['in', ...args]), Promise.resolve(answer)),
    then: (resolve: (value: unknown) => void) => resolve(answer),
  }
  const answer = { data: error ? null : rows, error, status }
  const client = { from: vi.fn(() => query) } as unknown as PianoClient
  return { client, asked }
}

const OPTIONS = { online: () => true }

describe('the Supabase content remote', () => {
  it('lists what is published, leaving out kinds this app does not read', async () => {
    const { client, asked } = clientAnswering([
      { kind: 'piece', id: 'bz5', version: 'v2' },
      { kind: 'course', id: 'c', version: 'v1' },
    ])
    expect(await createSupabaseContentRemote(backendOf(client), OPTIONS).versions()).toEqual({
      ok: true,
      value: [{ kind: 'piece', id: 'bz5', version: 'v2' }],
    })
    expect(asked).toContainEqual(['eq', 'status', 'published'])
  })

  it('asks for bodies by kind and ids', async () => {
    const row = { kind: 'piece', id: 'bz5', version: 'v2', body: {} }
    const { client, asked } = clientAnswering([row])
    expect(
      await createSupabaseContentRemote(backendOf(client), OPTIONS).bodies('piece', ['bz5']),
    ).toEqual({
      ok: true,
      value: [row],
    })
    expect(asked).toContainEqual(['in', 'id', ['bz5']])
  })

  it('reads a refusal by its status', async () => {
    const { client } = clientAnswering([], 401, { message: 'permission denied' })
    expect(await createSupabaseContentRemote(backendOf(client), OPTIONS).versions()).toMatchObject({
      ok: false,
      reason: 'refused',
    })
  })
})
