import { useCallback, useState, useSyncExternalStore } from 'react'
import type { MidiStatus } from '@/shared/api/midi'
import { useServices } from '@/shared/lib/services'

export type MidiConnection =
  | { readonly kind: 'unsupported' }
  | { readonly kind: 'idle' }
  | { readonly kind: 'connecting' }
  | { readonly kind: 'ready'; readonly status: MidiStatus }

const NO_UNSUBSCRIBE = () => {}

/** The MIDI keyboard's connection, following the port's status as keyboards come and go. */
export function useMidiConnection(): { connection: MidiConnection; connect: () => void } {
  const { midi } = useServices()
  const [connecting, setConnecting] = useState(false)
  const subscribe = useCallback(
    (onChange: () => void) => (midi ? midi.onStatus(onChange) : NO_UNSUBSCRIBE),
    [midi],
  )
  const status = useSyncExternalStore(subscribe, () => midi?.current() ?? null)
  const connect = useCallback(() => {
    if (!midi) return
    setConnecting(true)
    void midi.connect().finally(() => setConnecting(false))
  }, [midi])
  const connection: MidiConnection = !midi
    ? { kind: 'unsupported' }
    : connecting
      ? { kind: 'connecting' }
      : status
        ? { kind: 'ready', status }
        : { kind: 'idle' }
  return { connection, connect }
}
