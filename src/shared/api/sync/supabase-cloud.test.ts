import { describe, expect, it, vi } from 'vitest'
import type { PianoClient } from '../supabase'
import { createSupabaseCloud } from './supabase-cloud'

const OPTIONS = { online: () => true }

describe('createSupabaseCloud', () => {
  it('reads the table’s state row, its clock out of the data', async () => {
    const maybeSingle = vi.fn(async () => ({
      data: { id: 'state', data: { theme: 'dark', updatedAt: 't1' }, deleted: false },
      error: null,
    }))
    const eq = vi.fn(() => ({ maybeSingle }))
    const from = vi.fn(() => ({ select: () => ({ eq }) }))
    const cloud = createSupabaseCloud({ from } as unknown as PianoClient, OPTIONS)
    expect(await cloud.fetch('settings')).toEqual({
      ok: true,
      value: { id: 'state', data: { theme: 'dark' }, updatedAt: 't1', deleted: false },
    })
    expect(from).toHaveBeenCalledWith('settings')
    expect(eq).toHaveBeenCalledWith('id', 'state')
  })

  it('pushes with its base, its clock in the data, and reads a refusal as the server’s copy', async () => {
    const rpc = vi.fn(async () => ({
      data: [{ id: 'state', data: { theme: 'light', updatedAt: 't2' }, deleted: false }],
      error: null,
    }))
    const cloud = createSupabaseCloud({ rpc } as unknown as PianoClient, OPTIONS)
    const mine = { id: 'state', data: { theme: 'dark' }, updatedAt: 't3', deleted: false }
    const base = { id: 'state', data: {}, updatedAt: 't1', deleted: false }
    expect(await cloud.push('settings', mine, base)).toEqual({
      ok: true,
      value: { id: 'state', data: { theme: 'light' }, updatedAt: 't2', deleted: false },
    })
    expect(rpc).toHaveBeenCalledWith('push_documents', {
      p_table: 'settings',
      p_rows: [
        {
          id: 'state',
          data: { theme: 'dark', updatedAt: 't3' },
          deleted: false,
          base: 't1',
          base_deleted: false,
        },
      ],
    })
  })

  it('reads an applied push as nothing refused', async () => {
    const rpc = vi.fn(async () => ({ data: [], error: null }))
    const cloud = createSupabaseCloud({ rpc } as unknown as PianoClient, OPTIONS)
    const mine = { id: 'state', data: {}, updatedAt: 't1', deleted: false }
    expect(await cloud.push('progress', mine, null)).toEqual({ ok: true, value: null })
  })
})

describe('createSupabaseCloud, refused', () => {
  it('reads the server refusing a signed-out device as refused, by the response’s status', async () => {
    const rpc = vi.fn(async () => ({
      data: null,
      error: { message: 'permission denied for function push_documents', code: '42501' },
      status: 401,
    }))
    const cloud = createSupabaseCloud({ rpc } as unknown as PianoClient, OPTIONS)
    const mine = { id: 'state', data: {}, updatedAt: 't1', deleted: false }
    expect(await cloud.push('settings', mine, null)).toEqual({
      ok: false,
      reason: 'refused',
      detail: 'permission denied for function push_documents',
    })
  })
})
