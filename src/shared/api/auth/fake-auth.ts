import { netResult, type NetResult } from '../network'
import type { Account, AuthGateway, SignUp } from './types'

const refused = (message: string) => Object.assign(new Error(message), { status: 400 })

/**
 * Accounts kept in memory for tests, behaving as the server does (the contract test holds it to
 * that): `accounts` exist already, `online` is the device's connection.
 */
export function createFakeAuth({
  accounts = [],
  online = () => true,
}: { accounts?: readonly SignUp[]; online?: () => boolean } = {}): AuthGateway {
  const known = new Map<string, { name: string; password: string }>(
    accounts.map(({ email, name, password }) => [email, { name, password }]),
  )
  const listeners = new Set<(account: Account | null) => void>()
  let current: Account | null = null
  const ask = <T>(run: () => Promise<T>): Promise<NetResult<T>> => netResult(run, { online })
  const become = (account: Account | null) => {
    current = account
    for (const listener of listeners) listener(account)
  }
  const accountOf = (email: string): Account => {
    const found = known.get(email)
    if (!found) throw refused('Unknown account')
    return { id: `fake-${email}`, email, name: found.name }
  }

  return {
    current: async () => current,
    signUp: (input) =>
      ask(async () => {
        if (known.has(input.email)) throw refused('User already registered')
        known.set(input.email, { name: input.name, password: input.password })
        const account = accountOf(input.email)
        become(account)
        return { account, confirm: false }
      }),
    signIn: (email, password) =>
      ask(async () => {
        if (known.get(email)?.password !== password) throw refused('Invalid login credentials')
        const account = accountOf(email)
        become(account)
        return account
      }),
    signInWith: () => ask(async () => undefined),
    completeRedirect: () =>
      ask(async () => {
        if (!current) throw refused('No sign-in to complete')
        return current
      }),
    // As the server: it never says whether an email has an account.
    requestPasswordReset: () => ask(async () => undefined),
    updatePassword: (password) =>
      ask(async () => {
        const found = current && known.get(current.email)
        if (!found) throw refused('Not signed in')
        found.password = password
      }),
    signOut: async () => become(null),
    onChange: (listener) => {
      listeners.add(listener)
      return () => void listeners.delete(listener)
    },
  }
}
