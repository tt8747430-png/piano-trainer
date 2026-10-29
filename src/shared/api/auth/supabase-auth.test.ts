import { AuthApiError, AuthRetryableFetchError, type User } from '@supabase/supabase-js'
import { describe, expect, it, vi } from 'vitest'
import type { PianoClient } from '../supabase/client'
import { createSupabaseAuth } from './supabase-auth'

const user = {
  id: 'u1',
  email: 'ana@example.com',
  user_metadata: { name: 'Ana' },
  app_metadata: {},
} as unknown as User

/** A client whose auth answers as the server would, the rest never reached. */
const OPTIONS = { callback: 'https://app/auth/callback', online: () => true }

const clientWith = (auth: Record<string, unknown>) => ({ auth }) as unknown as PianoClient

describe('createSupabaseAuth', () => {
  it('reads a signed-in learner as an account', async () => {
    const auth = createSupabaseAuth(
      clientWith({
        signInWithPassword: async () => ({ data: { user, session: {} }, error: null }),
      }),
      OPTIONS,
    )
    expect(await auth.signIn('ana@example.com', 'x')).toEqual({
      ok: true,
      value: { id: 'u1', email: 'ana@example.com', name: 'Ana', role: 'learner' },
    })
  })

  it('reads the server refusing a password as refused, with its message', async () => {
    const auth = createSupabaseAuth(
      clientWith({
        signInWithPassword: async () => ({
          data: { user: null, session: null },
          error: new AuthApiError('Invalid login credentials', 400, 'invalid_credentials'),
        }),
      }),
      OPTIONS,
    )
    expect(await auth.signIn('ana@example.com', 'wrong')).toEqual({
      ok: false,
      reason: 'refused',
      detail: 'Invalid login credentials',
    })
  })

  it('says a sign-up must be confirmed by email where the server opened no session', async () => {
    const auth = createSupabaseAuth(
      clientWith({ signUp: async () => ({ data: { user, session: null }, error: null }) }),
      OPTIONS,
    )
    expect(await auth.signUp({ email: 'ana@example.com', name: 'Ana', password: 'x' })).toEqual({
      ok: true,
      value: {
        account: { id: 'u1', email: 'ana@example.com', name: 'Ana', role: 'learner' },
        confirm: true,
      },
    })
  })

  it('sends a password reset back to the callback, to set a new one', async () => {
    const resetPasswordForEmail = vi.fn(async () => ({ data: {}, error: null }))
    const auth = createSupabaseAuth(clientWith({ resetPasswordForEmail }), OPTIONS)
    await auth.requestPasswordReset('ana@example.com')
    expect(resetPasswordForEmail).toHaveBeenCalledWith('ana@example.com', {
      redirectTo: 'https://app/auth/callback?next=reset',
    })
  })

  it('signs out on the device even when the server cannot be reached', async () => {
    const signOut = vi.fn(async () => ({
      error: new AuthRetryableFetchError('Failed to fetch', 0),
    }))
    const auth = createSupabaseAuth(clientWith({ signOut }), OPTIONS)
    await expect(auth.signOut()).resolves.toBeUndefined()
    expect(signOut).toHaveBeenCalledWith({ scope: 'local' })
  })

  it('renames the learner in their account’s data', async () => {
    const updateUser = vi.fn(async () => ({
      data: { user: { ...user, user_metadata: { name: 'Anna' } } },
      error: null,
    }))
    const auth = createSupabaseAuth(clientWith({ updateUser }), OPTIONS)
    expect(await auth.updateName('Anna')).toMatchObject({ ok: true, value: { name: 'Anna' } })
    expect(updateUser).toHaveBeenCalledWith({ data: { name: 'Anna' } })
  })

  it('asks the deletion function to schedule the deletion, then signs out here', async () => {
    const invoke = vi.fn(async () => ({
      data: { requestedAt: 'r', purgeAfter: '2026-11-28T10:00:00.000Z' },
      error: null,
    }))
    const signOut = vi.fn(async () => ({ error: null }))
    const client = { auth: { signOut }, functions: { invoke } } as unknown as PianoClient
    const auth = createSupabaseAuth(client, OPTIONS)
    expect(await auth.requestDeletion()).toEqual({
      ok: true,
      value: { purgeAfter: '2026-11-28T10:00:00.000Z' },
    })
    expect(invoke).toHaveBeenCalledWith('request-account-deletion', { method: 'POST' })
    expect(signOut).toHaveBeenCalledWith({ scope: 'local' })
  })

  it('reads the deletion function’s refusal by its status', async () => {
    const invoke = async () => ({
      data: null,
      error: Object.assign(new Error('Edge Function returned a non-2xx status code'), {
        context: new Response('{}', { status: 401 }),
      }),
    })
    const client = { auth: {}, functions: { invoke } } as unknown as PianoClient
    expect(await createSupabaseAuth(client, OPTIONS).requestDeletion()).toMatchObject({
      ok: false,
      reason: 'refused',
    })
  })

  it('reads the role the server gave, and none other', async () => {
    const signIn = (app_metadata: object) =>
      createSupabaseAuth(
        clientWith({
          signInWithPassword: async () => ({
            data: { user: { ...user, app_metadata }, session: {} },
            error: null,
          }),
        }),
        OPTIONS,
      ).signIn('ana@example.com', 'x')
    expect(await signIn({ role: 'admin' })).toMatchObject({ value: { role: 'admin' } })
    expect(await signIn({ role: 'editor' })).toMatchObject({ value: { role: 'editor' } })
    expect(await signIn({ role: 'king' })).toMatchObject({ value: { role: 'learner' } })
  })
})
