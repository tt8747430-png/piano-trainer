import { useEffect, useState, type ReactNode } from 'react'
import type { FeaturesPort } from '@/shared/api/admin'
import { useAccount } from '../account'
import { Context } from './context'

/**
 * The feature switches on for this learner (ADR 0116), asked at start and at each sign-in or sign-out;
 * offline, or until answered, every switched feature stays off.
 */
export function FeaturesProvider({
  features,
  children,
}: {
  features: FeaturesPort
  children: ReactNode
}) {
  const { account, ready } = useAccount()
  const [on, setOn] = useState<ReadonlySet<string>>(new Set())
  const accountId = account?.id
  useEffect(() => {
    if (!ready) return
    let current = true
    void features.mine().then((result) => {
      if (current && result.ok) setOn(new Set(result.value))
    })
    return () => {
      current = false
    }
  }, [features, accountId, ready])
  return <Context value={on}>{children}</Context>
}
