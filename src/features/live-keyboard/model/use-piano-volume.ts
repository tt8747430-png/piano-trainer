import { useEffect } from 'react'
import { selectKeyboard, useSettings } from '@/entities/settings'
import { useServices } from '@/shared/lib/services'

/** The keys a hand plays sound as loud as the piano's Volume (R33), on every screen. */
export function usePianoVolume(): void {
  const { audio } = useServices()
  const volume = useSettings((state) => selectKeyboard(state).volume)
  useEffect(() => {
    audio.pianoVolume(volume / 100)
  }, [audio, volume])
}
