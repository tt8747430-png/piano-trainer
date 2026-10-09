import { useSyncExternalStore } from 'react'
import type { PedalKind } from '@/shared/lib/schedule'
import { useServices } from './use-services'

/** Whether a pedal is down now: the port's, put down by the MIDI keyboard's foot or the rail's button. */
export function usePedal(pedal: PedalKind = 'sustain'): boolean {
  const { audio } = useServices()
  return useSyncExternalStore(audio.onSounding, () => audio.pedals()[pedal])
}
