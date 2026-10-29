/**
 * What the server's link brings back to `/auth/callback`: the code to exchange for a session, or
 * the error it met; `next` says a password reset follows.
 */
export interface CallbackSearch {
  readonly code?: string
  readonly next?: 'reset'
  readonly error?: string
}
