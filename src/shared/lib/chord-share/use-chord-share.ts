import { use } from 'react'
import type { ChordSharePort } from '@/shared/api/chord-share'
import { Context } from './context'

/** The shared chord sheets' port given by `ChordShareProvider`. */
export function useChordShare(): ChordSharePort {
  const share = use(Context)
  if (!share) throw new Error('useChordShare needs a ChordShareProvider')
  return share
}
