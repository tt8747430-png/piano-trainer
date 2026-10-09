import { useSyncExternalStore } from 'react'
import type { Midi } from '@/shared/lib/music'
import { useServices } from './use-services'

/**
 * The keys the app's music is sounding now; `'struck'`: only the ones struck last; `'live'`: the live
 * voice's (a hand's, and the ones the pedals hold).
 */
export function useSoundingKeys(
  which: 'sounding' | 'struck' | 'live' = 'sounding',
): ReadonlySet<Midi> {
  const { audio } = useServices()
  return useSyncExternalStore(audio.onSounding, audio[which])
}
