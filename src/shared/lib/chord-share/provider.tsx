import type { ReactNode } from 'react'
import type { ChordSharePort } from '@/shared/api/chord-share'
import { Context } from './context'

/** Chord sheets shared live (R39-10), for the Chord player. */
export function ChordShareProvider({
  share,
  children,
}: {
  share: ChordSharePort
  children: ReactNode
}) {
  return <Context value={share}>{children}</Context>
}
