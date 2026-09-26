import { useMemo, type ComponentProps } from 'react'
import { selectKeyboard, useSettings } from '@/entities/settings'
import { useHeldKeys } from '@/features/connect-midi'
import { rangeOf, type Midi } from '@/shared/lib/music'
import { useSoundingKeys, useSoundKey } from '@/shared/lib/services'
import { PianoKeyboard } from '@/shared/ui'
import { useTyping } from '../model/use-typing'
import { KeyboardSettingsButton } from './KeyboardSettingsButton'

/**
 * The keyboard every screen shows, set up as the learner chose (the keyboard settings): a key goes
 * down while the app sounds it, a MIDI keyboard holds it, or a finger or a typed key presses it;
 * a tapped or typed key sounds before it does whatever else the screen makes it mean. Unless the
 * screen says which keys to keep in sight, it follows the keys the app sounds. With `spotlight`,
 * the keys down are the ones struck last, and only they show their marks while any key is down.
 */
export function LiveKeyboard({
  onKeyPress,
  inView,
  spotlight = false,
  ...keyboard
}: Omit<
  ComponentProps<typeof PianoKeyboard>,
  'down' | 'keySize' | 'swipe' | 'namedKeys' | 'map' | 'letters' | 'children' | 'onKeyPress'
> & {
  /** What a tap means besides its sound: a quiz's choice, Wait mode's answer. */
  onKeyPress?: ((key: Midi) => void) | undefined
  /** The explorers' keyboards: only the keys struck last show, alone or together. */
  spotlight?: boolean
}) {
  const { typing, ...settings } = useSettings(selectKeyboard)
  const sounding = useSoundingKeys(spotlight ? 'struck' : 'sounding')
  const held = useHeldKeys()
  const soundKey = useSoundKey()
  const play = (key: Midi) => {
    soundKey(key)
    onKeyPress?.(key)
  }
  // The keys the app sounds or MIDI holds lead the view; a tapped or typed key is where the hand already is.
  const soundingRange = useMemo(() => rangeOf([...sounding, ...held]), [sounding, held])
  const typed = useTyping({ enabled: typing, onKey: play, inView: inView ?? soundingRange })
  const down = useMemo(
    () =>
      held.size === 0 && typed.held.size === 0
        ? sounding
        : new Set([...sounding, ...held, ...typed.held]),
    [sounding, held, typed.held],
  )
  return (
    <PianoKeyboard
      {...keyboard}
      {...settings}
      inView={typed.inView}
      down={down}
      spotlight={spotlight}
      letters={typed.letters}
      onKeyPress={play}
    >
      <KeyboardSettingsButton />
    </PianoKeyboard>
  )
}
