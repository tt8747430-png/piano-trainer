import { netResult, type NetResult, statusError } from '../network'
import type { Account, AccountRole, AuthGateway, KnownAccount } from './types'

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
}: {
  accounts?: readonly KnownAccount[]
  online?: () => boolean
  now?: () => number
} = {}): AuthGateway {
  const known = new Map<string, { name: string; password: string; role: AccountRole }>(
    accounts.map(({ email, name, password, role = 'learner' }) => [
      email,
      { name, password, role },
    ]),
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
    if (!found) throw statusError('Unknown account', 400)
    return { id: `fake-${email}`, email, name: found.name, role: found.role }
  }

  return {
    current: async () => current,
    signUp: (input) =>
      ask(async () => {
        if (known.has(input.email)) throw statusError('User already registered', 400)
        known.set(input.email, { name: input.name, password: input.password, role: 'learner' })
        const account = accountOf(input.email)
        become(account)
        return { account, confirm: false }
      }),
    signIn: (email, password) =>
      ask(async () => {
        if (known.get(email)?.password !== password)
          throw statusError('Invalid login credentials', 400)
        const account = accountOf(email)
        become(account)
        return account
      }),
    signInWith: () => ask(async () => undefined),
    completeRedirect: () =>
      ask(async () => {
        if (!current) throw statusError('No sign-in to complete', 400)
        return current
      }),
    // As the server: it never says whether an email has an account.
    requestPasswordReset: () => ask(async () => undefined),
    updatePassword: (password) =>
      ask(async () => {
        const found = current && known.get(current.email)
        if (!found) throw statusError('Not signed in', 400)
        found.password = password
      }),
    updateEmail: (email) =>
      ask(async () => {
        if (!current) throw statusError('Not signed in', 400)
        // The server sends a link to the new address; the email changes once it is followed.
        if (!/^[^@\s]+@[^@\s]+$/.test(email)) throw statusError('Not an email', 400)
      }),
    updateName: (name) =>
      ask(async () => {
        const found = current && known.get(current.email)
        if (!current || !found) throw statusError('Not signed in', 400)
        found.name = name
        const account = accountOf(current.email)
        become(account)
        return account
      }),
    requestDeletion: () =>
      ask(async () => {
        if (!current) throw statusError('Not signed in', 400)
        const purgeAfter = new Date(now() + GRACE_MS).toISOString()
        deletions.set(current.email, purgeAfter)
        become(null)
        return { purgeAfter }
      }),
    pendingDeletion: () =>
      ask(async () => {
        if (!current) throw statusError('Not signed in', 400)
        return deletions.get(current.email) ?? null
      }),
    cancelDeletion: () =>
      ask(async () => {
        if (!current) throw statusError('Not signed in', 400)
        deletions.delete(current.email)
      }),
    signOut: async () => become(null),
    onChange: (listener) => {
      listeners.add(listener)
      return () => void listeners.delete(listener)
    },
  }
}
