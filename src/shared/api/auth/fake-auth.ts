import { netResult, type NetResult } from '../network'
import type { Account, AuthGateway, SignUp } from './types'

const refused = (message: string) => Object.assign(new Error(message), { status: 400 })

const GRACE_MS = 30 * 24 * 60 * 60 * 1000

/**
 * Accounts kept in memory for tests, behaving as the server does (the contract test holds it to
 * that): `accounts` exist already, `online` is the device's connection, `now` the clock a
 * deletion's grace is counted from.
 */
export function createFakeAuth({
  accounts = [],
  online = () => true,
  now = () => Date.now(),
}: { accounts?: readonly SignUp[]; online?: () => boolean; now?: () => number } = {}): AuthGateway {
  const known = new Map<string, { name: string; password: string }>(
    accounts.map(({ email, name, password }) => [email, { name, password }]),
  )
  const deletions = new Map<string, string>()
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
    updateName: (name) =>
      ask(async () => {
        const found = current && known.get(current.email)
        if (!current || !found) throw refused('Not signed in')
        found.name = name
        const account = accountOf(current.email)
        become(account)
        return account
      }),
    requestDeletion: () =>
      ask(async () => {
        if (!current) throw refused('Not signed in')
        const purgeAfter = new Date(now() + GRACE_MS).toISOString()
        deletions.set(current.email, purgeAfter)
        become(null)
        return { purgeAfter }
      }),
    pendingDeletion: () =>
      ask(async () => {
        if (!current) throw refused('Not signed in')
        return deletions.get(current.email) ?? null
      }),
    cancelDeletion: () =>
      ask(async () => {
        if (!current) throw refused('Not signed in')
        deletions.delete(current.email)
      }),
    signOut: async () => become(null),
    onChange: (listener) => {
      listeners.add(listener)
      return () => void listeners.delete(listener)
    },
  }
}
