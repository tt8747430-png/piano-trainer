import { useState, type FormEvent } from 'react'
import type { NetResult } from '@/shared/api/network'
import { authProblem, type AuthProblem } from '@/shared/lib/account'

/**
 * A form that asks the server: its fields checked first (`check` says whether they will do), then
 * `send` once at a time; what the server's answer came to as a problem to say, or `done` with it.
 */
export function useAuthSubmit<T>({
  check,
  send,
  done,
}: {
  check: () => boolean
  send: () => Promise<NetResult<T>>
  done: (value: T) => void
}) {
  const [busy, setBusy] = useState(false)
  const [problem, setProblem] = useState<AuthProblem | null>(null)
  const submit = async (event: FormEvent) => {
    event.preventDefault()
    if (busy) return
    setProblem(null)
    if (!check()) return
    setBusy(true)
    const result = await send()
    setBusy(false)
    if (result.ok) done(result.value)
    else setProblem(authProblem(result))
  }
  return { busy, problem, setProblem, submit }
}
