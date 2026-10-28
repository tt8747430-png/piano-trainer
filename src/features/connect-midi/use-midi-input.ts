import { useCallback } from 'react'
import { useSettingsStoreApi } from '@/entities/settings'
import { setMidi } from '@/features/set-preference'
import { useServices } from '@/shared/lib/services'
import { useMidiConnection, type MidiConnection } from './use-midi-connection'

/** Whether MIDI input is on: the port listening, with a keyboard or not. */
export const isMidiInputOn = (connection: MidiConnection): boolean =>
  connection.kind === 'connecting' ||
  (connection.kind === 'ready' &&
    connection.status.state !== 'off' &&
    connection.status.state !== 'denied')

/**
 * MIDI input, on or off: on asks for the keyboards (and keeps them heard as the app opens again),
 * off stops listening and asks nothing as the app opens. Connecting anywhere (the Player's MIDI
 * button) turns it on.
 */
export function useMidiInput(): {
  connection: MidiConnection
  on: boolean
  turn: (on: boolean) => void
} {
  const { midi } = useServices()
  const store = useSettingsStoreApi()
  const { connection, connect } = useMidiConnection()
  const turn = useCallback(
    (on: boolean) => {
      setMidi(store, { input: on })
      if (on) connect()
      else midi?.disconnect()
    },
    [store, connect, midi],
  )
  return { connection, on: isMidiInputOn(connection), turn }
}
