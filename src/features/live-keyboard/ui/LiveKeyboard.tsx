import { useMemo, type ComponentProps } from 'react'
import { useTranslation } from 'react-i18next'
import { selectKeyboard, useSettings } from '@/entities/settings'
import { useHeldKeys } from '@/features/connect-midi'
import { rangeOf, type Midi } from '@/shared/lib/music'
import { hasFinePointer } from '@/shared/lib'
import { useLiveVoice, useSoundingKeys } from '@/shared/lib/services'
import { useShortcuts } from '@/shared/lib/shortcuts'
import { PianoKeyboard } from '@/shared/ui'
import { useSpacePedal } from '../model/use-space-pedal'
import { useTyping } from '../model/use-typing'

/** A key plays itself unless the screen says otherwise. */
const ALONE = (key: Midi): readonly Midi[] => [key]
/** No keys: what a keyboard shows of a sound that is the question. */
const NOTHING: ReadonlySet<Midi> = new Set()

/**
 * The keyboard every screen shows, set up as the learner chose (the keyboard settings): a key goes
 * down while the app sounds it, a MIDI keyboard holds it, or a finger or a typed key presses it;
 * a tapped or typed key sounds while it is held (on under the pedal) and before it does whatever
 * else the screen makes it mean. Its keys alone (R34): the chord held, the pedals and Keyboard are
 * the screen's bar's (`KeyboardTools`), its settings the screen's gear's. Unless the screen says which
 * keys to keep in sight, it follows the keys the app sounds. With `spotlight`, the keys the app puts
 * down are the ones struck last: an arpeggio's or a run's key alone, a chord's keys together, every
 * mark kept. With `keyPlays`, a key a hand plays may sound more than itself (a degree's chord), all of
 * it down while the key is held.
 */
export function LiveKeyboard({
  keyPlays,
  onKeyPress,
  inView,
  spotlight = false,
  spacePedal = true,
  namesKeys = true,
  showsSound = true,
  ...keyboard
}: Omit<
  ComponentProps<typeof PianoKeyboard>,
  'down' | 'keySize' | 'swipe' | 'namedKeys' | 'markNotes' | 'letters' | 'onKeyPress'
> & {
  /** What a tap means besides its sound: a quiz's choice, Wait mode's answer. */
  onKeyPress?: ((key: Midi) => void) | undefined
  /** The explorers' keyboards: the keys struck last go down, alone or together. */
  spotlight?: boolean
  /** Space holds the pedal while typing plays the keys: off where the screen gives Space a job. */
  spacePedal?: boolean
  /**
   * The keys carry their names as the learner chose: off where a key's name is the answer (a round
   * played on the keys), whatever the setting.
   */
  namesKeys?: boolean
  /** The keys the app sounds go down: off where what sounds is the question (a round by ear). */
  showsSound?: boolean
}) {
  const { typing, keySize, swipe, namedKeys, markNotes } = useSettings(selectKeyboard)
  const settings = {
    keySize,
    swipe,
    namedKeys: namesKeys ? namedKeys : ('none' as const),
    markNotes,
  }
  const heard = useSoundingKeys(spotlight ? 'struck' : 'sounding')
  const sounding = showsSound ? heard : NOTHING
  const live = useSoundingKeys('live')
  const held = useHeldKeys()
  const voice = useLiveVoice()
  const plays = keyPlays ?? ALONE
  const play = (key: Midi) => {
    voice.down(key, plays(key))
    onKeyPress?.(key)
  }
  const letGo = (key: Midi) => voice.up(key)
  // The keys the app sounds or MIDI holds lead the view; a tapped or typed key is where the hand already is.
  const soundingRange = useMemo(() => rangeOf([...sounding, ...held]), [sounding, held])
  // Letters play only where there are letters to type: a setting synced from a laptop does nothing on
  // a phone, which has no way to turn it off (R29).
  const typingPlays = typing && hasFinePointer()
  const typed = useTyping({
    enabled: typingPlays,
    onKey: play,
    onKeyUp: letGo,
    inView: inView ?? soundingRange,
  })
  useSpacePedal({ enabled: typingPlays && spacePedal })
  // The typing keys are heard by `useTyping` and the pedal's hook: here they are only listed.
  const { t } = useTranslation('common')
  useShortcuts(
    t('shortcuts.piano'),
    [
      { label: t('shortcuts.typing'), shown: ['A', '–', '’'] },
      { label: t('shortcuts.octave'), shown: ['Z', 'X'] },
      ...(spacePedal ? [{ label: t('shortcuts.pedal'), shown: ['Space'] }] : []),
    ],
    { enabled: typing, scope: 'piano' },
  )
  // A key the live voice sounds is down until its damper falls: held, or on under the pedal.
  const down = useMemo(
    () =>
      held.size === 0 && typed.held.size === 0 && live.size === 0
        ? sounding
        : new Set([...sounding, ...live, ...held, ...[...typed.held].flatMap(plays)]),
    [sounding, live, held, typed.held, plays],
  )
  return (
    <PianoKeyboard
      {...keyboard}
      {...settings}
      inView={typed.inView}
      down={down}
      letters={typed.letters}
      keyPlays={keyPlays}
      onKeyPress={play}
      onKeyRelease={letGo}
    />
  )
}
