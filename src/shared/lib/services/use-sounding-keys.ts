import { useSyncExternalStore } from 'react'
import type { Midi } from '@/shared/lib/music'
import { useServices } from './use-services'

/** The keys the app is sounding now, whatever played them. */
export function useSoundingKeys(): ReadonlySet<Midi> {
  const { audio } = useServices()
  return useSyncExternalStore(audio.onSounding, audio.sounding)
}
