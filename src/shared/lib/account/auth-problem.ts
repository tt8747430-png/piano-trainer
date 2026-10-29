import type { NetFailed } from '@/shared/api/network'

/** What went wrong with a sign-in, a sign-up or a password, in words a screen can say. */
export type AuthProblem =
  | 'wrongCredentials'
  | 'emailTaken'
  | 'weakPassword'
  | 'tooManyTries'
  | 'unconfirmed'
  | 'refused'
  | 'offline'
  | 'failed'

const REFUSALS: readonly (readonly [RegExp, AuthProblem])[] = [
  [/invalid login credentials/i, 'wrongCredentials'],
  [/already (registered|been registered|exists)/i, 'emailTaken'],
  [/password should|weak password|password is too/i, 'weakPassword'],
  [/rate limit|for security purposes|too many/i, 'tooManyTries'],
  [/not confirmed/i, 'unconfirmed'],
]

/** A failed call's problem: a refusal read from the server's message, else offline or failed. */
export function authProblem(failed: NetFailed): AuthProblem {
  if (failed.reason !== 'refused') return failed.reason
  const detail = failed.detail ?? ''
  return REFUSALS.find(([pattern]) => pattern.test(detail))?.[1] ?? 'refused'
}
