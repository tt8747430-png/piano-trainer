import { useMemo, useRef, type ComponentProps } from 'react'
import { useTranslation } from 'react-i18next'
import { selectKeyboard, useSettings } from '@/entities/settings'
import { useHeldKeys } from '@/features/connect-midi'
import { rangeOf, type Midi } from '@/shared/lib/music'
import { hasFinePointer } from '@/shared/lib'
import { useLiveVoice, useSoundingKeys } from '@/shared/lib/services'
import { useShortcuts } from '@/shared/lib/shortcuts'
import { MIN_KEYS_PX, PianoKeyboard } from '@/shared/ui'
import { useKeysHeight } from '../model/use-keys-height'
import { useSpacePedal } from '../model/use-space-pedal'
import { useTyping } from '../model/use-typing'
import { KeysDivider, type DividerEdge } from './KeysDivider'

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
 * it down while the key is held. Keys at the screen's edge (`divider`: on the side facing the music)
 * stand as tall as their divider sets them, kept per size of screen (R34).
 */
export function LiveKeyboard({
  keyPlays,
  onKeyPress,
  inView,
  spotlight = false,
  spacePedal = true,
  namesKeys = true,
  showsSound = true,
  divider,
  ...keyboard
}: Omit<
  ComponentProps<typeof PianoKeyboard>,
  'down' | 'keySize' | 'swipe' | 'namedKeys' | 'markNotes' | 'letters' | 'onKeyPress' | 'height'
> & {
  /** The divider that resizes the keys, on the side facing the music; none inside a card. */
  divider?: DividerEdge | undefined
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
  const keysHeight = useKeysHeight()
  const box = useRef<HTMLDivElement>(null)
  // Half the screen at most, a saved height cut down to it on a shorter screen.
  const most = Math.max(MIN_KEYS_PX, Math.round(window.innerHeight / 2))
  const height =
    divider === undefined || keysHeight.height === null
      ? undefined
      : Math.min(most, Math.max(MIN_KEYS_PX, keysHeight.height))
  const keys = (
    <PianoKeyboard
      {...keyboard}
      {...settings}
      inView={typed.inView}
      down={down}
      letters={typed.letters}
      height={height}
      keyPlays={keyPlays}
      onKeyPress={play}
      onKeyRelease={letGo}
    />
  )
  if (divider === undefined) return keys
  const resize = (
    <KeysDivider
      edge={divider}
      height={height ?? null}
      least={MIN_KEYS_PX}
      most={most}
      measure={() => box.current?.getBoundingClientRect().height ?? MIN_KEYS_PX}
      onResize={keysHeight.set}
    />
  )
  return (
    <div className="flex flex-col">
      {divider === 'above' ? resize : null}
      <div ref={box}>{keys}</div>
      {divider === 'below' ? resize : null}
    </div>
  )
}
