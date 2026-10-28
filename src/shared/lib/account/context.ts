import { createContext, use } from 'react'
import type { Account, AuthGateway } from '@/shared/api/auth'
import type { SyncRunner } from '../sync'

export interface AccountContext {
  readonly auth: AuthGateway
  readonly sync: SyncRunner
  readonly account: Account | null
  /** Whether the device has been asked who is signed in. */
  readonly ready: boolean
}

export const Context = createContext<AccountContext | null>(null)

export function useAccountContext(): AccountContext {
  const context = use(Context)
  if (!context) throw new Error('useAccount needs an AccountProvider')
  return context
}
