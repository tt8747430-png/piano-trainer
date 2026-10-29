import { isAuthRetryableFetchError, type User } from '@supabase/supabase-js'
import { netResult, type NetOptions } from '../network'
import type { PianoClient } from '../supabase/client'
import type { Account, AuthGateway } from './types'

const accountOf = (user: User): Account => ({
  id: user.id,
  email: user.email ?? '',
  name: typeof user.user_metadata.name === 'string' ? user.user_metadata.name : '',
})

/** Throws the server's error, so `netResult` reads it: a 4xx refused, a fetch that failed failed. */
function answer<R extends { data: unknown; error: Error | null }>(
  response: R,
): Extract<R, { error: null }>['data'] {
  if (response.error) throw response.error
  return response.data
}

/** Accounts on Supabase Auth (ADR 0116), memory-palaces' gateway with its results as values. */
export function createSupabaseAuth(
  client: PianoClient,
  {
    callback = `${window.location.origin}/auth/callback`,
    online,
  }: NetOptions & { callback?: string } = {},
): AuthGateway {
  const ask = <T>(run: () => Promise<T>) => netResult(run, online ? { online } : {})
  return {
    current: async () => {
      const { data } = await client.auth.getSession()
      return data.session ? accountOf(data.session.user) : null
    },
    signUp: ({ email, name, password }) =>
      ask(async () => {
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
      ask(async () =>
        accountOf(answer(await client.auth.signInWithPassword({ email, password })).user),
      ),
    signInWith: (provider) =>
      ask(async () => {
        answer(await client.auth.signInWithOAuth({ provider, options: { redirectTo: callback } }))
      }),
    completeRedirect: (code) =>
      ask(async () => accountOf(answer(await client.auth.exchangeCodeForSession(code)).user)),
    requestPasswordReset: (email) =>
      ask(async () => {
        answer(
          await client.auth.resetPasswordForEmail(email, { redirectTo: `${callback}?next=reset` }),
        )
      }),
    updatePassword: (password) =>
      ask(async () => {
        answer(await client.auth.updateUser({ password }))
      }),
    // Local, always: the session goes from the device, and only a refused revocation is said.
    signOut: async () => {
      const { error } = await client.auth.signOut({ scope: 'local' })
      if (error && !isAuthRetryableFetchError(error)) throw error
    },
    onChange: (listener) => {
      const { data } = client.auth.onAuthStateChange((_event, session) =>
        listener(session ? accountOf(session.user) : null),
      )
      return () => data.subscription.unsubscribe()
    },
  }
}
