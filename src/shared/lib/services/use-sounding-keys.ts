import { useSyncExternalStore } from 'react'
import type { Midi } from '@/shared/lib/music'
import { useServices } from './use-services'

/** The keys the app is sounding now, whatever played them; `'struck'`: only the ones struck last. */
export function useSoundingKeys(which: 'sounding' | 'struck' = 'sounding'): ReadonlySet<Midi> {
  const { audio } = useServices()
  return useSyncExternalStore(audio.onSounding, which === 'struck' ? audio.struck : audio.sounding)
}
