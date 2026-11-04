import { useAccount } from '@/shared/lib/account'
import { can, type LibraryAct, type LibraryTarget } from './permissions'

/**
 * The permission table asked as the account the app reads (R29 B4): Learner view's a learner's,
 * signed out a learner. For a list of rows, each asked of its own target.
 */
export function usePermissions(): (act: LibraryAct, target: LibraryTarget) => boolean {
  const { account } = useAccount()
  return (act, target) => can(account, act, target)
}

/** Whether the account the app reads may do `act` on `target` (D8's table). */
export const useCan = (act: LibraryAct, target: LibraryTarget): boolean =>
  usePermissions()(act, target)
