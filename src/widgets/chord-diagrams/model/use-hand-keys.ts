import { useMemo } from 'react'
import { useHeldKeys } from '@/features/connect-midi'
import type { Midi } from '@/shared/lib/music'
import { useSoundingKeys } from '@/shared/lib/services'

/**
 * The keys hands hold now, as the keyboard's rail names their chord: a finger's on the screen's keys
 * (the live voice's, on under the pedal too) and a MIDI keyboard's; never what the app sounds.
 */
export function useHandKeys(): ReadonlySet<Midi> {
  const live = useSoundingKeys('live')
  const held = useHeldKeys()
  return useMemo(() => new Set([...live, ...held]), [live, held])
}
