import { useCallback, useState } from 'react'
import type { NetFailure } from '@/shared/api/network'

/**
 * Why a tab's last change was not made, kept until the next one is (`problem`), and what a change's
 * result is handed to (`after`), which keeps why and loads the tab again.
 */
export function useChangeProblem(reload: () => void) {
  const [problem, setProblem] = useState<NetFailure | null>(null)
  const after = useCallback(
    (result: { ok: true } | { ok: false; reason: NetFailure }) => {
      setProblem(result.ok ? null : result.reason)
      reload()
    },
    [reload],
  )
  return { problem, after }
}
