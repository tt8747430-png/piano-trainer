import { useMemo, type ComponentProps } from 'react'
import { useTranslation } from 'react-i18next'
import { selectKeyboard, useSettings } from '@/entities/settings'
import { MidiSoundToggle, useHeldKeys } from '@/features/connect-midi'
import { nameChords, rangeOf, type Midi } from '@/shared/lib/music'
import { useLiveVoice, useSoundingKeys } from '@/shared/lib/services'
import { useShortcuts } from '@/shared/lib/shortcuts'
import { PianoKeyboard, RailGroup } from '@/shared/ui'
import { useSpacePedal } from '../model/use-space-pedal'
import { useTyping } from '../model/use-typing'
import { ChordNamesToggle } from './ChordNamesToggle'
import { GlissandoToggle } from './GlissandoToggle'
import { KeyZoom } from './KeyZoom'
import { NamedKeysToggle } from './NamedKeysToggle'
import { PedalToggle } from './PedalToggle'
import { TypingToggle } from './TypingToggle'

/** A key plays itself unless the screen says otherwise. */
const ALONE = (key: Midi): readonly Midi[] => [key]

/**
 * The keyboard every screen shows, set up as the learner chose (the keyboard settings): a key goes
 * down while the app sounds it, a MIDI keyboard holds it, or a finger or a typed key presses it;
 * a tapped or typed key sounds while it is held (on under the pedal) and before it does whatever
 * else the screen makes it mean. Its rail holds every setting in sight, as pictures: how the keys
 * look (their size as a zoom, their names, the chord names, the typing letters), then how they play
 * (a MIDI keyboard's sound, glissando, the pedal). With chord names on, the rail names the chord a
 * hand holds (three notes or more, held or on under the pedal; never what the app sounds). Unless the
 * screen says which keys to keep in sight, it follows the keys the app sounds. With `spotlight`,
 * the keys the app puts down are the ones struck last: an arpeggio's or a run's key alone, a
 * chord's keys together, every mark kept. With `keyPlays`, a key a hand plays may sound more than
 * itself (a degree's chord), all of it down while the key is held.
 */
export function LiveKeyboard({
  keyPlays,
  onKeyPress,
  inView,
  spotlight = false,
  spacePedal = true,
  namesChords = true,
  ...keyboard
}: Omit<
  ComponentProps<typeof PianoKeyboard>,
  'down' | 'keySize' | 'swipe' | 'namedKeys' | 'letters' | 'caption' | 'children' | 'onKeyPress'
> & {
  /** What a tap means besides its sound: a quiz's choice, Wait mode's answer. */
  onKeyPress?: ((key: Midi) => void) | undefined
  /** The explorers' keyboards: the keys struck last go down, alone or together. */
  spotlight?: boolean
  /** Space holds the pedal while typing plays the keys: off where the screen gives Space a job. */
  spacePedal?: boolean
  /** The rail may name the chord a hand holds: off where its name is the question (a round). */
  namesChords?: boolean
}) {
  const { typing, chordNames, ...settings } = useSettings(selectKeyboard)
  const sounding = useSoundingKeys(spotlight ? 'struck' : 'sounding')
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
  const typed = useTyping({
    enabled: typing,
    onKey: play,
    onKeyUp: letGo,
    inView: inView ?? soundingRange,
  })
  useSpacePedal({ enabled: typing && spacePedal })
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
  // What a hand plays: the live voice's keys and a MIDI keyboard's, held or on under the pedal.
  const chord = useMemo(
    () => (namesChords && chordNames ? (nameChords([...live, ...held])[0]?.symbol ?? '') : null),
    [namesChords, chordNames, live, held],
  )
  return (
    <PianoKeyboard
      {...keyboard}
      {...settings}
      inView={typed.inView}
      down={down}
      letters={typed.letters}
      caption={chord === null ? undefined : { label: t('rail.chord'), text: chord }}
      keyPlays={keyPlays}
      onKeyPress={play}
      onKeyRelease={letGo}
    >
      <RailGroup>
        <KeyZoom />
        <NamedKeysToggle />
        <ChordNamesToggle disabled={!namesChords} />
        <TypingToggle />
      </RailGroup>
      <RailGroup>
        <MidiSoundToggle />
        <GlissandoToggle />
        <PedalToggle />
      </RailGroup>
    </PianoKeyboard>
  )
}
