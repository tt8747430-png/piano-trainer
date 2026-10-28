/**
 * What a call to the server came to, as a value (ADR 0116): its answer, or why there is none. A
 * screen handles the three failures one way everywhere: `offline` before or while asking, `refused`
 * when the server said no (a 4xx: wrong password, a rule broken), `failed` for anything else.
 */
export type NetFailure = 'offline' | 'refused' | 'failed'

export type NetResult<T> =
  | { readonly ok: true; readonly value: T }
  | { readonly ok: false; readonly reason: NetFailure; readonly detail?: string }

/** A result that is a failure, whatever the value would have been. */
export type NetFailed = Extract<NetResult<never>, { ok: false }>

export interface NetOptions {
  /** Whether the device has a connection: the browser's, or a test's. */
  readonly online?: () => boolean
}

const browserOnline = () => navigator.onLine

const statusOf = (error: unknown): number | undefined =>
  error instanceof Object && 'status' in error && typeof error.status === 'number'
    ? error.status
    : undefined

/** What a thrown value says: refused for a 4xx, offline when the connection went, else failed. */
export function failureOf(error: unknown, online: () => boolean = browserOnline): NetFailed {
  if (!online()) return { ok: false, reason: 'offline' }
  const status = statusOf(error)
  const reason = status !== undefined && status >= 400 && status < 500 ? 'refused' : 'failed'
  return error instanceof Error
    ? { ok: false, reason, detail: error.message }
    : { ok: false, reason }
}

/** Runs a call to the server, never throwing: offline before any request when there is no connection. */
export async function netResult<T>(
  run: () => Promise<T>,
  { online = browserOnline }: NetOptions = {},
): Promise<NetResult<T>> {
  if (!online()) return { ok: false, reason: 'offline' }
  try {
    return { ok: true, value: await run() }
  } catch (error) {
    return failureOf(error, online)
  }
}
