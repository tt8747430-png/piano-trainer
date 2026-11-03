import { useRouter } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { LAPTOP, UpProvider, useMediaQuery } from '@/shared/lib'
import { useAccount } from '@/shared/lib/account'
import { parentOf } from '../routes/parents'

/** Back as up (rule 26): every screen's Back finds its parent in the parents table. */
export function Parents({ children }: { children: ReactNode }) {
  const router = useRouter()
  const signedIn = useAccount().account !== null
  const wide = useMediaQuery(LAPTOP)
  const findUp = () => {
    const match = router.state.matches.at(-1)
    if (!match) return null
    const { routeId, params, search } = match
    return parentOf(
      { routeId, params, search },
      { context: router.options.context, signedIn, wide },
    )
  }
  return <UpProvider findUp={findUp}>{children}</UpProvider>
}
