import type { User } from '@supabase/supabase-js'
import { netResult, type NetOptions } from '../network'
import type { Backend, PianoClient } from '../supabase'
import type { Account, AccountRole, AuthGateway } from './types'

const roleOf = (user: User): AccountRole => {
  const role: unknown = user.app_metadata.role
  return role === 'admin' || role === 'editor' ? role : 'learner'
}

const accountOf = (user: User): Account => ({
  id: user.id,
  email: user.email ?? '',
  name: typeof user.user_metadata.name === 'string' ? user.user_metadata.name : '',
  role: roleOf(user),
})

/** Throws the server's error, so `netResult` reads it: a 4xx refused, a fetch that failed failed. */
function answer<R extends { data: unknown; error: Error | null }>(
  response: R,
): Extract<R, { error: null }>['data'] {
  if (response.error) throw response.error
  return response.data
}

/** An Edge Function's error, with the status its response had: a 4xx is a refusal. */
function functionError(error: unknown): Error {
  const message = error instanceof Error ? error.message : 'The function failed'
  const context = error instanceof Object && 'context' in error ? error.context : undefined
  return Object.assign(new Error(message), {
    status: context instanceof Response ? context.status : undefined,
  })
}

/** Accounts on Supabase Auth (ADR 0116), memory-palaces' gateway with its results as values. */
export function createSupabaseAuth(
  backend: Backend,
  {
    callback = `${window.location.origin}/auth/callback`,
    online,
  }: NetOptions & { callback?: string } = {},
): AuthGateway {
  const ask = <T>(run: (client: PianoClient) => Promise<T>) =>
    netResult(async () => run(await backend()), online ? { online } : {})
  return {
    current: async () => {
      const client = await backend()
      const { data } = await client.auth.getSession()
      return data.session ? accountOf(data.session.user) : null
    },
    signUp: ({ email, name, password }) =>
      ask(async (client) => {
        const { user, session } = answer(
          await client.auth.signUp({
            email,
            password,
            options: { data: { name }, emailRedirectTo: callback },
          }),
        )
        if (!user) throw new Error('The server made no account')
        return { account: accountOf(user), confirm: session === null }
      }),
    signIn: (email, password) =>
      ask(async (client) =>
        accountOf(answer(await client.auth.signInWithPassword({ email, password })).user),
      ),
    signInWith: (provider) =>
      ask(async (client) => {
        answer(await client.auth.signInWithOAuth({ provider, options: { redirectTo: callback } }))
      }),
    completeRedirect: (code) =>
      ask(async (client) => accountOf(answer(await client.auth.exchangeCodeForSession(code)).user)),
    requestPasswordReset: (email) =>
      ask(async (client) => {
        answer(
          await client.auth.resetPasswordForEmail(email, { redirectTo: `${callback}?next=reset` }),
        )
      }),
    updatePassword: (password) =>
      ask(async (client) => {
        answer(await client.auth.updateUser({ password }))
      }),
    updateName: (name) =>
      ask(async (client) =>
        accountOf(answer(await client.auth.updateUser({ data: { name } })).user),
      ),
    requestDeletion: () =>
      ask(async (client) => {
        const { data, error } = await client.functions.invoke<{ purgeAfter: string }>(
          'request-account-deletion',
          { method: 'POST' },
        )
        if (error || !data) throw functionError(error)
        // The function signed every device out; this one lets its session go too.
        await client.auth.signOut({ scope: 'local' })
        return { purgeAfter: data.purgeAfter }
      }),
    pendingDeletion: () =>
      ask(async (client) => {
        const { data, error, status } = await client
          .from('account_deletions')
          .select('purge_after')
          .maybeSingle()
        if (error) throw Object.assign(new Error(error.message), { status })
        return data?.purge_after ?? null
      }),
    cancelDeletion: () =>
      ask(async (client) => {
        const { data } = await client.auth.getSession()
        if (!data.session) throw Object.assign(new Error('Not signed in'), { status: 401 })
        const { error, status } = await client
          .from('account_deletions')
          .delete()
          .eq('user_id', data.session.user.id)
        if (error) throw Object.assign(new Error(error.message), { status })
      }),
    // Local, always: the session goes from the device, and only a refused revocation is said.
    signOut: async () => {
      const client = await backend()
      const { error } = await client.auth.signOut({ scope: 'local' })
      // A revocation that never reached the server is no refusal (supabase-js's retryable fetch error).
      if (error && error.name !== 'AuthRetryableFetchError') throw error
    },
    // Heard once the client has loaded; stopped before then, it is never heard.
    onChange: (listener) => {
      let stop: (() => void) | null = null
      let stopped = false
      void backend().then((client) => {
        if (stopped) return
        const { data } = client.auth.onAuthStateChange((_event, session) =>
          listener(session ? accountOf(session.user) : null),
        )
        stop = () => data.subscription.unsubscribe()
      })
      return () => {
        stopped = true
        stop?.()
      }
    },
  }
}
