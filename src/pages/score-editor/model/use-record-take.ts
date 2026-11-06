import { useEffect, useEffectEvent } from 'react'
import { selectRoomLeft, useTakes } from '@/entities/take'
import { isMidiConnected, useMidiConnection } from '@/features/connect-midi'
import { useScoreEditorContext } from './editor-context'

/** What Record a take needs, and Record itself. */
export interface RecordTake {
  /** Whether a MIDI keyboard is connected to record from. */
  readonly connected: boolean
  /** Whether the takes have room for another. */
  readonly room: boolean
  /** Records at once where it can (ADR 0114, Dorico's: no sheet first); else its gear page says why. */
  readonly record: () => void
}

/**
 * Record a take (ADR 0114, 0096, R31-E), the gear's: with a MIDI keyboard connected and room in the
 * takes, the gear shuts and the take counts in at once; else the gear turns to Record's page, saying
 * what it needs.
 */
export function useRecordTake(): RecordTake {
  const { takes, view } = useScoreEditorContext()
  const room = useTakes(selectRoomLeft) > 0
  const connected = isMidiConnected(useMidiConnection().connection)
  const record = () => {
    if (connected && room) {
      view.setGear(null)
      takes.record()
    } else view.setGear('record')
  }
  return { connected, room, record }
}

/** New song's Record (`takes.asked`, ADR 0096): pressed as the editor opens, once. */
export function useAnswerRecord(): void {
  const { takes } = useScoreEditorContext()
  const { record } = useRecordTake()
  const answer = useEffectEvent(() => {
    takes.answered()
    record()
  })
  useEffect(() => {
    if (takes.asked) answer()
  }, [takes.asked])
}
