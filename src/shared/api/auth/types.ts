import type { NetResult } from '../network'

/** The sign-in services an account can use (ADR 0116); Apple is shown as coming soon. */
export type OAuthProvider = 'google' | 'apple'

/** A signed-in learner, as the app knows them. */
export interface Account {
  readonly id: string
  readonly email: string
  readonly name: string
}

export interface SignUp {
  readonly email: string
  readonly name: string
  readonly password: string
}

/**
 * Accounts (ADR 0116): optional, so the app runs without one. Each call that needs the server returns
 * its result as a value; signing out is local and always works, offline too.
 */
export interface AuthGateway {
  /** The account signed in on this device, read without the network. */
  current(): Promise<Account | null>
  /** `confirm` where the server asks the learner to confirm their email before signing in. */
  signUp(input: SignUp): Promise<NetResult<{ account: Account; confirm: boolean }>>
  signIn(email: string, password: string): Promise<NetResult<Account>>
  /** Leaves for the provider's page; the app opens again at its callback. */
  signInWith(provider: OAuthProvider): Promise<NetResult<void>>
  /** Finishes a sign-in or a password reset the callback brought back. */
  completeRedirect(code: string): Promise<NetResult<Account>>
  requestPasswordReset(email: string): Promise<NetResult<void>>
  updatePassword(password: string): Promise<NetResult<void>>
  /** Renames the account signed in; its listeners hear the account renamed. */
  updateName(name: string): Promise<NetResult<Account>>
  /**
   * Schedules the account signed in for deletion after its grace (30 days) and signs out on every
   * device; returns when it will be deleted. Signing in again within the grace can cancel it.
   */
  requestDeletion(): Promise<NetResult<{ purgeAfter: string }>>
  /** When the account signed in is to be deleted, if it is. */
  pendingDeletion(): Promise<NetResult<string | null>>
  cancelDeletion(): Promise<NetResult<void>>
  signOut(): Promise<void>
  /** Hears every change of account: a sign-in, a sign-out, another tab's. Returns how to stop. */
  onChange(listener: (account: Account | null) => void): () => void
}
