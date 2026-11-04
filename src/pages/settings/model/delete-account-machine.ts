import type { NetFailure } from '@/shared/api/network'

/**
 * Deleting the account (B1, memory-palaces' `delete-account-machine`): closed; asked to confirm (the
 * word typed); deleting; then done (its day of purging), failed, or offline, each of which can try
 * again or close.
 */
export type DeleteState =
  | { readonly kind: 'closed' }
  | { readonly kind: 'confirm' }
  | { readonly kind: 'deleting' }
  | { readonly kind: 'done'; readonly purgeAfter: string }
  | { readonly kind: 'failed' }
  | { readonly kind: 'offline' }

export type DeleteEvent =
  | { readonly type: 'open' }
  | { readonly type: 'cancel' }
  | { readonly type: 'confirm'; readonly online: boolean }
  | { readonly type: 'deleted'; readonly purgeAfter: string }
  | { readonly type: 'refused'; readonly reason: NetFailure }

export const DELETE_CLOSED: DeleteState = { kind: 'closed' }

/** The next state; an event that does not fit the state changes nothing. */
export function deleteAccountMachine(state: DeleteState, event: DeleteEvent): DeleteState {
  switch (event.type) {
    case 'open':
      return state.kind === 'deleting' ? state : { kind: 'confirm' }
    case 'cancel':
      return state.kind === 'deleting' || state.kind === 'done' ? state : DELETE_CLOSED
    case 'confirm':
      if (state.kind !== 'confirm' && state.kind !== 'failed' && state.kind !== 'offline')
        return state
      return event.online ? { kind: 'deleting' } : { kind: 'offline' }
    case 'deleted':
      return state.kind === 'deleting' ? { kind: 'done', purgeAfter: event.purgeAfter } : state
    case 'refused':
      if (state.kind !== 'deleting') return state
      return event.reason === 'offline' ? { kind: 'offline' } : { kind: 'failed' }
  }
}
