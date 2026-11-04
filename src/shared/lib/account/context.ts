import { createContext, use } from 'react'
import type { Account, AuthGateway } from '@/shared/api/auth'
import type { SyncRunner } from '../sync'

export interface AccountContext {
  readonly auth: AuthGateway
  readonly sync: SyncRunner
  readonly account: Account | null
  /** Whether the device has been asked who is signed in. */
  readonly ready: boolean
  /**
   * Learner view (R29 B5): an editor or admin sees the app as a learner does, for this session alone
   * (never saved, no role changed). `account` then carries the learner's role; `realRole` the true one.
   */
  readonly learnerView: boolean
  readonly setLearnerView: (on: boolean) => void
  readonly realRole: Account['role'] | null
}

export const Context = createContext<AccountContext | null>(null)

export function useAccountContext(): AccountContext {
  const context = use(Context)
  if (!context) throw new Error('useAccount needs an AccountProvider')
  return context
}
