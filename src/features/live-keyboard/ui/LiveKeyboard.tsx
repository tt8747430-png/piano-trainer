import { useMemo, type ComponentProps } from 'react'
import { useHeldKeys } from '@/features/connect-midi'
import { rangeOf, type Midi } from '@/shared/lib/music'
import { useSoundingKeys, useSoundKey } from '@/shared/lib/services'
import { PianoKeyboard } from '@/shared/ui'

/**
 * The keyboard every screen shows: a key goes down while the app sounds it or a MIDI keyboard
 * holds it, and a tapped key sounds before it does whatever else the screen makes it mean. Unless
 * the screen says which keys to keep in sight, it follows the keys that are down.
 */
export function LiveKeyboard({
  onKeyPress,
  inView,
  ...keyboard
}: Omit<ComponentProps<typeof PianoKeyboard>, 'down' | 'onKeyPress'> & {
  /** What a tap means besides its sound: a quiz's choice, Your turn's answer. */
  onKeyPress?: ((key: Midi) => void) | undefined
}) {
  const sounding = useSoundingKeys()
  const held = useHeldKeys()
  const soundKey = useSoundKey()
  const down = useMemo(
    () => (held.size === 0 ? sounding : new Set([...sounding, ...held])),
    [sounding, held],
  )
  const downRange = useMemo(() => rangeOf([...down]), [down])
  return (
    <PianoKeyboard
      {...keyboard}
      inView={inView ?? downRange}
      down={down}
      onKeyPress={(key) => {
        soundKey(key)
        onKeyPress?.(key)
      }}
    />
  )
}
