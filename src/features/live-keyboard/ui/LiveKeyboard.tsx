import { useMemo, type ComponentProps } from 'react'
import { selectKeyboard, useSettings } from '@/entities/settings'
import { useHeldKeys } from '@/features/connect-midi'
import { rangeOf, type Midi } from '@/shared/lib/music'
import { useSoundingKeys, useSoundKey } from '@/shared/lib/services'
import { PianoKeyboard } from '@/shared/ui'
import { useTyping } from '../model/use-typing'
import { KeyboardSettingsButton } from './KeyboardSettingsButton'

const NONE: ReadonlySet<Midi> = new Set()

/**
 * The keyboard every screen shows, set up as the learner chose (the keyboard settings): a key goes
 * down while the app sounds it or a MIDI keyboard holds it, and a tapped or typed key sounds before
 * it does whatever else the screen makes it mean. Unless the screen says which keys to keep in
 * sight, it follows the keys that are down. With `spotlight`, the keys down are the ones struck
 * last, and the other marked keys go quiet while any key is struck.
 */
export function LiveKeyboard({
  onKeyPress,
  inView,
  spotlight = false,
  ...keyboard
}: Omit<
  ComponentProps<typeof PianoKeyboard>,
  | 'down'
  | 'quiet'
  | 'keySize'
  | 'swipe'
  | 'namedKeys'
  | 'map'
  | 'letters'
  | 'children'
  | 'onKeyPress'
> & {
  /** What a tap means besides its sound: a quiz's choice, Wait mode's answer. */
  onKeyPress?: ((key: Midi) => void) | undefined
  /** The explorers' keyboards: the key struck last stands out alone. */
  spotlight?: boolean
}) {
  const { typing, ...settings } = useSettings(selectKeyboard)
  const sounding = useSoundingKeys(spotlight ? 'struck' : 'sounding')
  const held = useHeldKeys()
  const soundKey = useSoundKey()
  const down = useMemo(
    () => (held.size === 0 ? sounding : new Set([...sounding, ...held])),
    [sounding, held],
  )
  const { marks } = keyboard
  const quiet = useMemo(
    () =>
      spotlight && sounding.size > 0 && marks
        ? new Set([...marks.keys()].filter((key) => !sounding.has(key)))
        : NONE,
    [spotlight, sounding, marks],
  )
  const downRange = useMemo(() => rangeOf([...down]), [down])
  const play = (key: Midi) => {
    soundKey(key)
    onKeyPress?.(key)
  }
  const typed = useTyping({ enabled: typing, onKey: play, inView: inView ?? downRange })
  return (
    <PianoKeyboard
      {...keyboard}
      {...settings}
      inView={typed.inView}
      down={down}
      quiet={quiet}
      letters={typed.letters}
      onKeyPress={play}
    >
      <KeyboardSettingsButton />
    </PianoKeyboard>
  )
}
